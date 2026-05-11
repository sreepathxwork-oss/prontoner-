export type AppState = 'splash' | 'intro' | 'auth' | 'landing' | 'survey' | 'review' | 'generating' | 'result' | 'gallery';
export type Tab = 'home' | 'discover' | 'create' | 'mine' | 'profile';

export interface SurveyAnswer {
  mediaType: 'Image' | 'Video';
  style: string;
  vibe: string;
  detailing: string;
  aspectRatio: string;
  referenceImages?: string[];
  model: string;
  negativePrompt: string;
  videoPurpose?: string;
  videoCameraAngle?: string;
  videoTheme?: string;
}

export interface GeneratedPrompt {
  id: string;
  originalIdea: string;
  tunedPrompt: string;
  images: string[];
  videoUrl?: string;
  timestamp: number;
  aspectRatio: string;
  referenceImages?: string[];
  model: string;
  mediaType: 'Image' | 'Video';
}

export const ASPECT_RATIOS = ["1:1", "3:4", "4:3", "9:16", "16:9", "21:9"] as const;
