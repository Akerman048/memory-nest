export type MemoryKind = "photo" | "video" | "note" | "milestone";

export type Memory = {
  id: string;
  title: string;
  description: string;
  date: string;
  kind: MemoryKind;
  mediaUrl?: string;
  mediaName?: string;
  createdAt: string;
};

export type NewMemoryInput = {
  title: string;
  description: string;
  date: string;
  kind: MemoryKind;
  file?: File;
};

export const memoryKindLabels: Record<MemoryKind, string> = {
  photo: "Photo",
  video: "Video",
  note: "Story",
  milestone: "Milestone",
};
