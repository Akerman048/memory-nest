import type { IconType } from "react-icons";
import { FiBookOpen, FiImage, FiStar, FiVideo } from "react-icons/fi";

import type { MemoryKind } from "./types";

export const memoryKindIcons: Record<MemoryKind, IconType> = {
  photo: FiImage,
  video: FiVideo,
  note: FiBookOpen,
  milestone: FiStar,
};
