// Shared type definitions for data returned from the backend

export interface AdminVideo {
  id: string;
  playbackUrl: string;
  muxAssetId?: string | null;
  createdAt: string;
}
