import React from 'react';
import { Zap, Cpu, Palette, Wind, Layers, Monitor } from 'lucide-react';
import { ASPECT_RATIOS, SurveyAnswer } from './types';

export const MODELS = [
  { id: 'gemini-2.5-flash-image', name: 'Flash 2.5', desc: 'Fast & Creative', icon: <Zap className="w-4 h-4" /> },
  { id: 'gemini-3.1-flash-image-preview', name: 'Pro 3.1', desc: 'Ultra High Quality', icon: <Cpu className="w-4 h-4" /> }
];

export const AVATAR_PRESETS = [
  'unni4723@gmail.com', 'architect', 'neo', 'cyber', 'pixel', 'dreamer', 'vision', 'pulse', 'spark', 'void'
];

export const MEDIA_QUESTION = {
  id: 'mediaType',
  question: "Synthesis Format",
  options: ["Image", "Video"],
  icon: <Monitor className="w-5 h-5" />
};

export const QUESTIONS = [
  {
    id: 'style',
    question: "Visual DNA",
    options: ["Realistic", "Cyberpunk", "Anime", "Photorealistic", "Oil Painting", "3D Render", "Sketch", "Minimalism"],
    icon: <Palette className="w-5 h-5" />
  },
  {
    id: 'vibe',
    question: "Atmospheric Mood",
    options: ["Joyful", "Mysterious", "Energetic", "Calm", "Dark Space", "Neon Noir", "Ethereal Light", "Melancholy"],
    icon: <Wind className="w-5 h-5" />
  },
  {
    id: 'detailing',
    question: "Neural Density",
    options: ["Low", "Medium", "Extreme"],
    icon: <Layers className="w-5 h-5" />
  },
  {
    id: 'aspectRatio',
    question: "Spatial Ratio",
    options: [...ASPECT_RATIOS]
  }
];

export const VIDEO_QUESTIONS = [
  {
    id: 'videoPurpose',
    question: "Video Purpose",
    options: ["Advertising", "Social Media", "Cinematic", "Documentary", "Music Video", "Abstract"],
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'videoCameraAngle',
    question: "Camera Angles",
    options: ["Low Angle", "Wide Angle", "Close Up", "Drone Shot", "Tracking Shot", "Static"],
    icon: <Cpu className="w-5 h-5" />
  },
  {
    id: 'videoTheme',
    question: "Video Theme",
    options: ["Cinematic", "3D Animation", "2D Animation", "Hyper-realistic", "Cyberpunk", "Vintage"],
    icon: <Palette className="w-5 h-5" />
  }
];

export const LOADING_MESSAGES = [
  "TUNING NEURAL PROMPT...",
  "SYNTHESIZING PIXELS...",
  "CALIBRATING NEURAL NETWORKS...",
  "WEAVING ATMOSPHERIC DATA...",
  "HARVESTING CREATIVE ENERGY...",
  "POLISHING DIGITAL DREAMS...",
  "FINALIZING MAGIC..."
];
