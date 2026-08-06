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

export const memoryKindLabels: Record<MemoryKind, string> = {
  photo: "Photo",
  video: "Video",
  note: "Story",
  milestone: "Milestone",
};

export const starterMemories: Memory[] = [
  {
    id: "welcome-1",
    title: "Welcome to your family nest",
    description: "Your first memories will appear here. Add a photo, video, milestone or little story.",
    date: new Date().toISOString().slice(0, 10),
    kind: "note",
    createdAt: new Date().toISOString(),
  },
];
