import { NextResponse } from "next/server";
import { mux } from "@/lib/mux";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      return NextResponse.json(
        {
          error:
            "Mux credentials not configured (MUX_TOKEN_ID / MUX_TOKEN_SECRET)",
        },
        { status: 500 },
      );
    }

    // optional admin key; if provided we require the x-admin-key header match
    const adminKey = process.env.ADMIN_KEY;
    if (adminKey) {
      const header = req.headers.get("x-admin-key");
      if (header !== adminKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const dayStr = formData.get("day");
    const day = dayStr ? parseInt(dayStr as string, 10) : null;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Video file missing" },
        { status: 400 },
      );
    }

    // create a direct upload on Mux
    const upload = await mux.Video.Uploads.create({
      new_asset_settings: {
        playback_policy: "public",
      },
    });

    // send the file to the upload URL
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await fetch(upload.url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      return NextResponse.json(
        { error: `Mux upload failed: ${text}` },
        { status: uploadRes.status || 500 },
      );
    }

    // after uploading we can fetch the updated upload object
    const updatedUpload = await mux.Video.Uploads.get(upload.id);
    let playbackUrl: string | null = null;

    if (updatedUpload.asset_id) {
      const asset = await mux.Video.Assets.get(updatedUpload.asset_id);
      // pick the first public playback id if available
      const publicPlayback = asset.playback_ids?.find(
        (p: any) => p.policy === "public",
      );
      if (publicPlayback) {
        playbackUrl = `https://stream.mux.com/${publicPlayback.id}.m3u8`;
      }
    }

    // if a day was provided, record the new admin video in the database
    // Note: use `!== null` instead of truthiness check because day 0 is valid
    if (day !== null && playbackUrl) {
      try {
        await prisma.adminVideo.create({
          data: {
            day,
            playbackUrl,
            muxAssetId: updatedUpload.asset_id || undefined,
          },
        });
      } catch (e) {
        // log but don't fail the request, upload still succeeded
        console.error('failed to save admin video record', e);
      }
    }

    return NextResponse.json({ upload: updatedUpload, playbackUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Upload error" },
      { status: 500 },
    );
  }
}
