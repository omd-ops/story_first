/*
  Warnings:

  - You are about to drop the column `updated_at` on the `admin_config` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admin_config" DROP COLUMN "updated_at";

-- CreateTable
CREATE TABLE "admin_videos" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "playback_url" TEXT NOT NULL,
    "mux_asset_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_videos_day_idx" ON "admin_videos"("day");
