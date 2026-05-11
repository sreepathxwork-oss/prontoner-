/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Copy, 
  RefreshCw, 
  Image as ImageIcon, 
  Download, 
  History, 
  Check,
  Zap,
  Palette,
  Wind,
  Maximize,
  Star,
  Trash2,
  Settings,
  ShieldAlert,
  Cpu,
  Layers,
  Activity,
  ChevronRight,
  X,
  Plus,
  Globe,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Waves,
  Monitor,
  Share2,
  Home,
  Compass,
  LayoutGrid,
  User,
  Search,
  Heart,
  Edit2,
  Save,
  Camera,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';
import { 
  AppState, 
  Tab, 
  SurveyAnswer, 
  GeneratedPrompt, 
  ASPECT_RATIOS
} from './types';
import { 
  MODELS, 
  AVATAR_PRESETS, 
  QUESTIONS,
  MEDIA_QUESTION,
  VIDEO_QUESTIONS,
  LOADING_MESSAGES
} from './constants';
import { ThreeBackground } from './components/ThreeBackground';
import { SettingsModal } from './components/SettingsModal';
import { IntroSequence } from './components/IntroSequence';
import { Logo } from './components/Logo';
import NeuralLoading from './components/NeuralLoading';

// --- Constants ---
const QUESTIONS_LENGTH = QUESTIONS.length;

const getContextualLoadingMessages = (prompt: string) => {
  const lowerPrompt = prompt.toLowerCase();
  const baseMessages = [
    "TUNING NEURAL PROMPT...",
    "SYNTHESIZING PIXELS...",
    "CALIBRATING NEURAL NETWORKS...",
    "WEAVING ATMOSPHERIC DATA...",
    "HARVESTING CREATIVE ENERGY...",
    "POLISHING DIGITAL DREAMS...",
    "FINALIZING MAGIC..."
  ];

  if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('neon') || lowerPrompt.includes('future') || lowerPrompt.includes('cyber')) {
    return [
      "INJECTING NEON OVERDRIVE...",
      "CALIBRATING CYBERNETIC OPTICS...",
      "SYNTHESIZING DIGITAL RAIN...",
      "UPLOADING TO THE GRID...",
      ...baseMessages
    ];
  }
  if (lowerPrompt.includes('nature') || lowerPrompt.includes('forest') || lowerPrompt.includes('landscape') || lowerPrompt.includes('tree') || lowerPrompt.includes('mountain')) {
    return [
      "GROWING DIGITAL ECOSYSTEMS...",
      "SIMULATING ATMOSPHERIC LIGHT...",
      "WEAVING ORGANIC TEXTURES...",
      "HARVESTING NATURAL ESSENCE...",
      ...baseMessages
    ];
  }
  if (lowerPrompt.includes('portrait') || lowerPrompt.includes('person') || lowerPrompt.includes('face') || lowerPrompt.includes('human') || lowerPrompt.includes('man') || lowerPrompt.includes('woman')) {
    return [
      "SCULPTING NEURAL FEATURES...",
      "CALIBRATING HUMAN ESSENCE...",
      "SYNTHESIZING SOUL DATA...",
      "POLISHING MICRO-EXPRESSIONS...",
      ...baseMessages
    ];
  }
  if (lowerPrompt.includes('abstract') || lowerPrompt.includes('dream') || lowerPrompt.includes('surreal') || lowerPrompt.includes('magic') || lowerPrompt.includes('space')) {
    return [
      "NAVIGATING DREAMSCAPES...",
      "SYNTHESIZING SURREAL VECTORS...",
      "WEAVING SUBCONSCIOUS DATA...",
      "HARVESTING IMAGINARY LIGHT...",
      ...baseMessages
    ];
  }

  return baseMessages;
};

// --- Components ---

const Ripple: React.FC<{ x: number, y: number, onComplete: () => void }> = ({ x, y, onComplete }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0.5 }}
    animate={{ scale: 4, opacity: 0 }}
    transition={{ duration: 0.6, ease: "linear" }}
    onAnimationComplete={onComplete}
    className="ripple-effect"
    style={{ left: x, top: y }}
  />
);


const NeuralIllustration = ({ icon: Icon, color = "primary" }: { icon: any, color?: "primary" | "secondary" }) => (
  <div className="relative w-full h-full flex items-center justify-center p-8">
    {/* Blueprint Grid Background */}
    <div className="absolute inset-0 opacity-10" style={{ 
      backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      color: color === 'primary' ? '#6C5CE7' : '#00D2D3'
    }} />
    
    {/* Sketched Circle */}
    <div className={cn(
      "absolute w-32 h-32 border-2 border-dashed rounded-full opacity-20 animate-pulse",
      color === 'primary' ? "border-primary" : "border-secondary"
    )} />
    
    {/* Main Icon with Glitch/Sketch Effect */}
    <div className="relative">
      <Icon className={cn(
        "w-24 h-24 relative z-10",
        color === 'primary' ? "text-primary" : "text-secondary"
      )} strokeWidth={1} />
      
      {/* Ghost Layers for "Sketched" feel */}
      <Icon className={cn(
        "w-24 h-24 absolute inset-0 opacity-30 translate-x-1 translate-y-1",
        color === 'primary' ? "text-primary" : "text-secondary"
      )} strokeWidth={0.5} />
      <Icon className={cn(
        "w-24 h-24 absolute inset-0 opacity-20 -translate-x-1 -translate-y-0.5",
        color === 'primary' ? "text-primary" : "text-secondary"
      )} strokeWidth={0.5} />
    </div>

    {/* Technical Callouts */}
    <div className="absolute top-4 right-4 font-mono text-[6px] text-white/20 uppercase tracking-widest">
      Neural_Layer_0{Math.floor(Math.random() * 9) + 1}
    </div>
    <div className="absolute bottom-4 left-4 font-mono text-[6px] text-white/20 uppercase tracking-widest">
      Synthesis_Active
    </div>
  </div>
);

export default function App() {
  const [state, setState] = useState<AppState>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [idea, setIdea] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer>({
    mediaType: 'Image',
    style: '',
    vibe: '',
    detailing: 'Medium',
    aspectRatio: '1:1',
    model: MODELS[0].id,
    negativePrompt: '',
    videoPurpose: '',
    videoCameraAngle: '',
    videoTheme: ''
  });
  const [tunedPrompt, setTunedPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [gallery, setGallery] = useState<GeneratedPrompt[]>([]);
  const [copied, setCopied] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(false);
  const userEmail = "unni4723@gmail.com";
  const [userName, setUserName] = useState(userEmail.split('@')[0]);
  const [userBio, setUserBio] = useState("Neural Architect Level 42");
  const [avatarSeed, setAvatarSeed] = useState(userEmail);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const isLimitReached = !hasApiKey && dailyCount >= 25;
  const [refImages, setRefImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages: string[] = [];
      let loadedCount = 0;
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          loadedCount++;
          if (loadedCount === files.length) {
            setRefImages(prev => [...prev, ...newImages].slice(0, 4)); // Limit to 4 images
          }
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };
  const [showSettings, setShowSettings] = useState(false);
  const [isStatusMinimized, setIsStatusMinimized] = useState(false);
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true);
  const [isScanlineEnabled, setIsScanlineEnabled] = useState(true);
  const [isAtmosphereEnabled, setIsAtmosphereEnabled] = useState(true);
  const [isHapticsEnabled, setIsHapticsEnabled] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!isHapticsEnabled) return;
    if (navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleShare = async (url: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'PROMTONER X Generation',
          text: 'Check out this neural synthesis from PROMTONER X!',
          url: url
        });
      } else {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.log('Sharing failed:', error);
    }
  };

  const [glassIntensity, setGlassIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);
  const lastClickTime = useRef(0);

  // Back button handling for mobile
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.appState) {
        setState(e.state.appState);
      } else {
        setState('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Push state to history whenever app state changes
    if (window.history.state?.appState !== state) {
      window.history.pushState({ appState: state }, '');
    }
  }, [state]);

  // Scroll locking for modals
  useEffect(() => {
    if (showSettings || isStatusExpanded || !!fullScreenImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSettings, isStatusExpanded, fullScreenImage]);

  // Initialize AI
  const getAI = async () => {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  };

  useEffect(() => {
    const saved = localStorage.getItem('promtoner_gallery_x');
    if (saved) setGallery(JSON.parse(saved));

    const savedName = localStorage.getItem('promtoner_user_name');
    const savedBio = localStorage.getItem('promtoner_user_bio');
    const savedAvatar = localStorage.getItem('promtoner_avatar_seed');
    if (savedName) setUserName(savedName);
    if (savedBio) setUserBio(savedBio);
    if (savedAvatar) setAvatarSeed(savedAvatar);

    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('promtoner_last_date_x');
    const savedCount = localStorage.getItem('promtoner_daily_count_x');

    if (lastDate !== today) {
      localStorage.setItem('promtoner_last_date_x', today);
      localStorage.setItem('promtoner_daily_count_x', '0');
      setDailyCount(0);
    } else if (savedCount) {
      setDailyCount(parseInt(savedCount));
    }

    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();

    // Skip intro if already seen in this session
    const timer = setTimeout(() => {
      const connected = localStorage.getItem('promtoner_api_connected');
      const profileSetup = localStorage.getItem('promtoner_profile_setup');
      if (connected === 'true' && profileSetup === 'true') {
        setState('landing');
      } else {
        setState('auth');
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const [isApiConnected, setIsApiConnected] = useState(false);
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

  const addRipple = (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const y = 'clientY' in e ? e.clientY : e.touches[0].clientY;
    const id = Date.now() + Math.random();
    setRipples(prev => [...prev, { id, x, y }]);
  };

  const removeRipple = (id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  useEffect(() => {
    const connected = localStorage.getItem('promtoner_api_connected');
    if (connected === 'true') setIsApiConnected(true);
  }, []);

  const handleConnectFreeApi = () => {
    localStorage.setItem('promtoner_api_connected', 'true');
    localStorage.setItem('promtoner_profile_setup', 'true');
    localStorage.setItem('promtoner_user_name', userName);
    localStorage.setItem('promtoner_user_bio', userBio);
    localStorage.setItem('promtoner_avatar_seed', avatarSeed);
    setIsApiConnected(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6C5CE7', '#00D2D3']
    });
    setTimeout(() => setState('landing'), 1000);
  };

  const handleSelectKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleStatusClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current < 300) {
      setIsStatusExpanded(true);
    }
    lastClickTime.current = now;
  };

  const persistGallery = (newGallery: GeneratedPrompt[]) => {
    let currentGallery = [...newGallery];
    let success = false;
    while (!success && currentGallery.length > 0) {
      try {
        localStorage.setItem('promtoner_gallery_x', JSON.stringify(currentGallery));
        setGallery(currentGallery);
        success = true;
      } catch (e) {
        currentGallery.pop();
      }
    }
  };

  const saveToGallery = (prompt: GeneratedPrompt) => {
    const newGallery = [prompt, ...gallery].slice(0, 12);
    persistGallery(newGallery);
  };

  const generateVideoWithRetry = async (prompt: string, aspectRatio: string, referenceImages?: string[]) => {
    const apiKey = (typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined) || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    
    let videoAspectRatio = '16:9';
    if (aspectRatio === '9:16' || aspectRatio === '3:4') {
      videoAspectRatio = '9:16';
    }

    const config: any = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: videoAspectRatio
    };

    let operation;

    if (referenceImages && referenceImages.length > 0) {
      const base64Data = referenceImages[0].split(',')[1];
      const mimeType = referenceImages[0].split(';')[0].split(':')[1];
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
          imageBytes: base64Data,
          mimeType: mimeType,
        },
        config
      });
    } else {
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config
      });
    }

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    if (operation.error) {
      throw new Error(operation.error.message || "VIDEO GENERATION FAILED");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("NO VIDEO DATA RETURNED");
    }

    // Fetch the video to get a blob URL
    const response = await fetch(downloadLink, {
      method: 'GET',
      headers: {
        'x-goog-api-key': apiKey as string,
      },
    });
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  const generateImagesWithRetry = async (prompt: string, count: number, aspectRatio: string, referenceImages?: string[]) => {
    const urls: string[] = [];
    const apiKey = (typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined) || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    
    for (let i = 0; i < count; i++) {
      let retries = 0;
      const maxRetries = 2;
      let success = false;

      while (!success && retries < maxRetries) {
        try {
          const parts: any[] = [{ text: prompt }];
          if (referenceImages && referenceImages.length > 0) {
            referenceImages.forEach(img => {
              const base64Data = img.split(',')[1];
              const mimeType = img.split(';')[0].split(':')[1];
              parts.unshift({ inlineData: { data: base64Data, mimeType } });
            });
          }

          const res = await ai.models.generateContent({
            model: answers.model as any,
            contents: { parts },
            config: {
              imageConfig: {
                aspectRatio: aspectRatio.replace('/', ':') as any,
              }
            }
          });

          const candidate = res.candidates?.[0];
          const imagePart = candidate?.content?.parts.find(p => p.inlineData);
          if (imagePart?.inlineData) {
            urls.push(`data:image/png;base64,${imagePart.inlineData.data}`);
            success = true;
          } else if (candidate?.finishReason === 'SAFETY') {
            throw new Error("BLOCKED BY SAFETY FILTERS");
          } else {
            throw new Error("NO IMAGE DATA RETURNED");
          }
        } catch (error: any) {
          if (error?.message?.includes("429")) {
            retries++;
            await new Promise(r => setTimeout(r, 2000));
          } else throw error;
        }
      }
    }
    return urls;
  };

  const generateFinalPrompt = async () => {
    // Check and reset daily count if date changed
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('promtoner_last_date_x');
    if (lastDate !== today) {
      localStorage.setItem('promtoner_last_date_x', today);
      localStorage.setItem('promtoner_daily_count_x', '0');
      setDailyCount(0);
    }

    if (!hasApiKey && dailyCount >= 25) {
      return; // Handled by UI message
    }

    setState('generating');
    setIsGenerating(true);
    setLoadingProgress(30);

    try {
      const ai = await getAI();
      const promptContents = answers.mediaType === 'Video' 
        ? `SYSTEM: EXPERT VIDEO PROMPT ENGINEER.
        TASK: TUNE USER IDEA INTO HYPER-DETAILED VIDEO PROMPT WITH DYNAMIC AND ATTRACTIVE STYLE AND CREATIVE ANIMATIONS.
        IDEA: ${idea}
        STYLE: ${answers.style}
        VIBE: ${answers.vibe}
        PURPOSE: ${answers.videoPurpose}
        CAMERA ANGLE: ${answers.videoCameraAngle}
        THEME: ${answers.videoTheme}
        DETAIL LEVEL: ${answers.detailing}
        ${refImages.length > 0 ? "REF: SUBJECT PROVIDED. INCORPORATE ACCURATELY." : ""}
        ${answers.negativePrompt ? `AVOID: ${answers.negativePrompt}` : ""}
        OUTPUT: FINAL PROMPT ONLY.`
        : `SYSTEM: EXPERT PROMPT ENGINEER.
        TASK: TUNE USER IDEA INTO HYPER-DETAILED IMAGE PROMPT.
        IDEA: ${idea}
        STYLE: ${answers.style}
        VIBE: ${answers.vibe}
        DETAIL LEVEL: ${answers.detailing}
        ${refImages.length > 0 ? "REF: SUBJECT PROVIDED. INCORPORATE ACCURATELY." : ""}
        ${answers.negativePrompt ? `AVOID: ${answers.negativePrompt}` : ""}
        OUTPUT: FINAL PROMPT ONLY.`;

      const tuningResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: promptContents,
        config: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
      });

      const finalPrompt = tuningResponse.text || idea;
      setTunedPrompt(finalPrompt);
      setState('review');
    } catch (error: any) {
      alert(error.message || "TUNING FAILED");
      setState('survey');
    } finally {
      setIsGenerating(false);
      setLoadingProgress(0);
    }
  };

  const startGeneration = async () => {
    if (!hasApiKey && dailyCount >= 25) {
      return;
    }

    // Go to result state immediately to show skeletons
    setGeneratedImages([]);
    setGeneratedVideo(null);
    setState('result');
    setIsGenerating(true);
    setLoadingProgress(0);

    const contextualMessages = getContextualLoadingMessages(tunedPrompt);
    let msgIndex = 0;
    setLoadingMsg(contextualMessages[0]);

    const progressInterval = setInterval(() => {
      setLoadingProgress(p => p < 90 ? p + Math.random() * 5 : p);
    }, 300);

    const messageInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % contextualMessages.length;
      setLoadingMsg(contextualMessages[msgIndex]);
    }, 3000);

    try {
      let imageUrls: string[] = [];
      let videoUrl: string | undefined = undefined;

      if (answers.mediaType === 'Video') {
        videoUrl = await generateVideoWithRetry(tunedPrompt, answers.aspectRatio, refImages);
        setGeneratedVideo(videoUrl);
      } else {
        imageUrls = await generateImagesWithRetry(tunedPrompt, 1, answers.aspectRatio, refImages);
        setGeneratedImages(imageUrls);
      }
      
      setLoadingProgress(100);
      
      const newResult: GeneratedPrompt = {
        id: crypto.randomUUID(),
        originalIdea: idea,
        tunedPrompt: tunedPrompt,
        images: imageUrls,
        videoUrl: videoUrl,
        timestamp: Date.now(),
        aspectRatio: answers.aspectRatio,
        referenceImages: refImages.length > 0 ? refImages : undefined,
        model: answers.model,
        mediaType: answers.mediaType
      };
      saveToGallery(newResult);
      
      // Increment daily count
      const newCount = dailyCount + 1;
      setDailyCount(newCount);
      localStorage.setItem('promtoner_daily_count_x', newCount.toString());

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#6C5CE7', '#00D2D3', '#FFFFFF'] });

      setTimeout(() => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      }, 800);
    } catch (error: any) {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      alert(error.message || "GENERATION FAILED");
      setState('review');
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setIdea('');
    setRefImages([]);
    setGeneratedVideo(null);
    setAnswers(prev => ({ ...prev, style: '', vibe: '', aspectRatio: '1:1', mediaType: 'Image' }));
    setState('landing');
  };

  // --- Views ---

  const renderIntro = () => {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center"
        >
          <div className="relative inline-block">
            <motion.h1 
              className="text-[12vw] font-display leading-none text-white relative z-10 tracking-tighter"
              style={{ textShadow: "0 0 30px rgba(0, 240, 255, 0.3)" }}
            >
              PROMTONER X
            </motion.h1>
            
            <motion.div 
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl -z-10"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 space-y-4"
          >
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.5em]">Neural Synthesis Interface v2.0</p>
            <div className="w-48 h-1 bg-white/5 rounded-full mx-auto overflow-hidden relative">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  };

  const renderBottomNav = () => {
    if (state === 'intro' || state === 'auth') return null;

    const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
      { id: 'home', icon: <Home className="w-6 h-6" />, label: 'Home' },
      { id: 'discover', icon: <Compass className="w-6 h-6" />, label: 'Discover' },
      { id: 'create', icon: <Plus className="w-8 h-8" />, label: 'Create' },
      { id: 'mine', icon: <LayoutGrid className="w-6 h-6" />, label: 'Mine' },
      { id: 'profile', icon: <User className="w-6 h-6" />, label: 'Profile' }
    ];

    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-lg">
        <div className="liquid-glass p-2 flex items-center justify-between relative">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const isCenter = tab.id === 'create';

            return (
              <button
                key={tab.id}
                onClick={() => {
                  handleHaptic(isCenter ? 'heavy' : 'light');
                  setActiveTab(tab.id);
                  if (tab.id === 'create') {
                    setState('landing');
                  }
                }}
                className={cn(
                  "relative flex flex-col items-center justify-center transition-all duration-500",
                  isCenter ? "w-16 h-16 -mt-12 bg-primary rounded-full shadow-[0_10px_30px_rgba(108,92,231,0.5)] text-white animate-liquid" : "flex-1 h-14 text-white/40",
                  isActive && !isCenter && "text-primary scale-110"
                )}
              >
                {isActive && !isCenter && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-primary/10 blur-xl rounded-full"
                  />
                )}
                <div className={cn("relative z-10", isActive && "text-glow")}>
                  {tab.icon}
                </div>
                {!isCenter && (
                  <span className={cn(
                    "font-mono text-[8px] uppercase tracking-widest mt-1 transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-0"
                  )}>
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="pt-32 px-6 pb-40 space-y-32">
      {/* Branding Section */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8"
      >
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-primary" />
          <span className="font-mono text-xs tracking-[0.3em] text-primary uppercase">Neural Interface Active</span>
        </div>
        <h2 className="text-7xl md:text-9xl font-display leading-[0.85] tracking-tighter">
          DREAM <br /> <span className="text-primary italic font-serif lowercase tracking-normal">in</span> <br /> PIXELS
        </h2>
        <p className="text-xl text-white/40 max-w-md font-light leading-relaxed">
          The next generation of prompt engineering. Precise, atmospheric, and hyper-functional synthesis for the modern architect.
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ y: 50, opacity: 0, rotateX: 10 }}
        whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-1000"
      >
        <div className="glass p-8 rounded-[2.5rem] hardware-border space-y-6 group hover:bg-primary/5 transition-all">
          <div className="flex justify-between items-start">
            <Activity className="w-8 h-8 text-primary" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          <div>
            <div className="text-5xl font-display mb-1">{dailyCount}/25</div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">Daily Synthesis Load</div>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${(dailyCount / 25) * 100}%` }} />
          </div>
        </div>
        <div className="glass p-8 rounded-[2.5rem] hardware-border space-y-6 group hover:bg-secondary/5 transition-all">
          <div className="flex justify-between items-start">
            <History className="w-8 h-8 text-secondary" />
            <div className="w-2 h-2 rounded-full bg-secondary/40" />
          </div>
          <div>
            <div className="text-5xl font-display mb-1">{gallery.length}</div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">Neural Artifacts Stored</div>
          </div>
          <button 
            onClick={() => setActiveTab('mine')}
            className="text-[10px] font-mono text-secondary uppercase tracking-widest hover:underline"
          >
            Access Vault →
          </button>
        </div>
      </motion.div>

      {/* Tutorial Section: Neural Architecture */}
      <div className="space-y-12">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">Neural Architecture Tutorial</h3>
          <div className="h-px flex-1 bg-white/5 mx-6" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Seed Idea", desc: "Input your core concept into the neural interface.", icon: Sparkles, color: "primary" as const },
            { step: "02", title: "Calibration", desc: "Fine-tune visual DNA, mood, and neural density.", icon: Settings, color: "secondary" as const },
            { step: "03", title: "Synthesis", desc: "Watch as the engine weaves your data into pixels.", icon: Zap, color: "primary" as const },
            { step: "04", title: "Archive", desc: "Store and manage your artifacts in the secure vault.", icon: History, color: "secondary" as const }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6 group"
            >
              <div className="aspect-square rounded-[2rem] overflow-hidden hardware-border relative bg-white/[0.02] group-hover:bg-white/[0.05] transition-all duration-500">
                <NeuralIllustration icon={item.icon} color={item.color} />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
                <div className="absolute top-6 left-6 font-display text-4xl text-white/10 group-hover:text-primary/40 transition-colors">{item.step}</div>
              </div>
              <div className="px-2">
                <h4 className="text-2xl font-display mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Info: Core Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-5xl font-display tracking-tighter">CORE <br /><span className="text-primary">PROTOCOLS</span></h3>
          <p className="text-white/40 font-light leading-relaxed">
            Our synthesis engine is built on four fundamental pillars of digital craftsmanship.
          </p>
          <div className="pt-6">
            <div className="w-12 h-1 bg-primary/20 rounded-full" />
          </div>
        </div>
        
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Precision Prompting", desc: "Advanced algorithms that translate your simple ideas into complex, atmospheric neural data." },
            { title: "Atmospheric Rendering", desc: "Immersive visual feedback during the synthesis process, creating a cinematic experience." },
            { title: "Multi-Model Support", desc: "Access both high-speed Flash 2.5 and ultra-high-fidelity Pro 3.1 neural networks." },
            { title: "Secure Neural Vault", desc: "Your artifacts are stored with end-to-end encryption in your local neural storage." }
          ].map((protocol, idx) => (
            <div key={idx} className="glass p-8 rounded-3xl hardware-border space-y-4 hover:bg-white/5 transition-all">
              <h4 className="text-xl font-display text-white/90">{protocol.title}</h4>
              <p className="text-xs text-white/30 leading-relaxed font-mono uppercase tracking-wider">{protocol.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">Recent Neural Activity</h3>
          <div className="h-px flex-1 bg-white/5 mx-6" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {gallery.slice(0, 3).map((item, idx) => (
            <motion.div 
              key={item.id} 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass p-5 rounded-3xl flex items-center gap-6 group cursor-pointer hardware-border hover:bg-white/5 transition-all" 
              onClick={() => { setActiveTab('mine'); }}
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden">
                <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg text-white/90 truncate mb-1">{item.originalIdea}</div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="font-mono text-[8px] text-primary uppercase tracking-widest">{item.aspectRatio}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          ))}
          {gallery.length === 0 && (
            <div className="py-12 text-center glass rounded-3xl border-dashed border-white/10">
              <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">No recent activity detected</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  const renderDiscover = () => (
    <div className="pt-32 px-6 pb-40 space-y-12">
      <div className="space-y-4">
        <h2 className="text-6xl font-display leading-tight">Neural<br/><span className="text-secondary">Discover</span></h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Search the collective mind..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 font-mono text-xs focus:outline-none focus:border-secondary/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className="aspect-[3/4] rounded-3xl overflow-hidden glass hardware-border relative group"
          >
            <img src={`https://picsum.photos/seed/discover${i}/600/800`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
              <div className="font-mono text-[8px] text-white/80 uppercase tracking-widest">Neural Artifact #{1024 + i}</div>
              <div className="flex items-center gap-2 mt-2">
                <Heart className="w-3 h-3 text-red-500" />
                <span className="font-mono text-[8px] text-white/40">{Math.floor(Math.random() * 1000)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => {
    return (
      <div className="pt-32 px-6 pb-40 space-y-12">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full border-4 border-primary p-1 relative overflow-hidden">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} 
                className="w-full h-full rounded-full bg-surface object-cover" 
                alt="Profile"
              />
              {isEditingProfile && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-full shadow-lg glow-primary">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="w-full max-w-md space-y-4">
            {isEditingProfile ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-2 text-left">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/30 ml-2">Neural Identity</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-display text-2xl focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Username"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/30 ml-2">Architectural Bio</label>
                  <textarea 
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-mono text-sm focus:outline-none focus:border-primary/50 transition-all h-24 resize-none"
                    placeholder="Tell us about your vision..."
                  />
                </div>
                <div className="space-y-4 text-left">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/30 ml-2">Avatar DNA Selection</label>
                  <div className="grid grid-cols-5 gap-3">
                    {AVATAR_PRESETS.map(seed => (
                      <button 
                        key={seed}
                        onClick={() => {
                          setAvatarSeed(seed);
                          handleHaptic('light');
                        }}
                        className={cn(
                          "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                          avatarSeed === seed ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent opacity-40 hover:opacity-100"
                        )}
                      >
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} className="w-full h-full bg-surface" />
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsEditingProfile(false);
                    handleHaptic('medium');
                  }}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-display text-xl tracking-widest hover:bg-primary/80 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                >
                  <Save className="w-6 h-6" /> SYNC PROFILE
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-5xl font-display tracking-tighter">{userName}</h2>
                  <p className="font-mono text-xs text-white/40 uppercase tracking-[0.3em] mt-2 leading-relaxed">
                    {userBio}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsEditingProfile(true);
                    handleHaptic('light');
                  }}
                  className="px-6 py-2 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 mx-auto"
                >
                  <Edit2 className="w-3 h-3" /> Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">System Protocols</h3>
            <div className="h-px flex-1 bg-white/5 mx-6" />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button className="w-full glass p-6 rounded-3xl flex items-center justify-between group hover:bg-white/5 transition-all hardware-border" onClick={() => setShowSettings(true)}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <span className="block font-display text-lg">System Settings</span>
                  <span className="block font-mono text-[8px] text-white/30 uppercase tracking-widest">Neural Interface Config</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary" />
            </button>
            
            <button className="w-full glass p-6 rounded-3xl flex items-center justify-between group hover:bg-white/5 transition-all hardware-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-left">
                  <span className="block font-display text-lg">Privacy & Security</span>
                  <span className="block font-mono text-[8px] text-white/30 uppercase tracking-widest">Encrypted Protocols</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-secondary" />
            </button>

            <button 
              onClick={() => {
                handleHaptic('heavy');
                setDailyCount(0);
                setGallery([]);
                setIdea('');
                setUserName(userEmail.split('@')[0]);
                setUserBio("Neural Architect Level 42");
                setAvatarSeed(userEmail);
                setState('intro');
                setActiveTab('home');
              }}
              className="w-full glass p-6 rounded-3xl flex items-center justify-between group hover:bg-red-500/5 transition-all hardware-border border-red-500/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LogOut className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-left">
                  <span className="block font-display text-lg text-red-500">Disconnect</span>
                  <span className="block font-mono text-[8px] text-red-500/30 uppercase tracking-widest">Terminate Neural Link</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-red-500/20 group-hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAuth = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-20"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="liquid-glass p-8 md:p-12 max-w-md w-full relative overflow-hidden"
      >
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", onboardingStep >= 1 ? "bg-primary shadow-[0_0_10px_rgba(255,42,133,0.5)]" : "bg-white/10")} />
            <div className={cn("w-2 h-2 rounded-full", onboardingStep >= 2 ? "bg-secondary shadow-[0_0_10px_rgba(122,0,255,0.5)]" : "bg-white/10")} />
          </div>
          <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Step {onboardingStep} of 2</span>
        </div>

        <AnimatePresence mode="wait">
          {onboardingStep === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-4xl mb-2 tracking-tighter">INITIALIZE IDENTITY</h2>
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Define your neural presence</p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-primary/30 p-1 relative overflow-hidden glass">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} 
                    className="w-full h-full rounded-full bg-surface" 
                    alt="Avatar Preview"
                  />
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_PRESETS.slice(0, 5).map(seed => (
                    <button 
                      key={seed}
                      onClick={() => { setAvatarSeed(seed); handleHaptic('light'); }}
                      className={cn(
                        "w-10 h-10 rounded-lg overflow-hidden border-2 transition-all",
                        avatarSeed === seed ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent opacity-40"
                      )}
                    >
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} className="w-full h-full bg-surface" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-white/30 ml-2">Neural Alias</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-display text-xl focus:outline-none focus:border-primary/50 transition-all glass"
                    placeholder="Enter Alias"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-white/30 ml-2">Architect Bio</label>
                  <textarea 
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-mono text-xs focus:outline-none focus:border-primary/50 transition-all h-20 resize-none glass"
                    placeholder="Short bio..."
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  if (userName.trim()) {
                    setOnboardingStep(2);
                    handleHaptic('medium');
                  }
                }}
                disabled={!userName.trim()}
                className="w-full py-5 bg-primary text-white rounded-2xl font-display text-xl tracking-widest hover:bg-primary/80 transition-all flex items-center justify-center gap-3 disabled:opacity-30 shadow-xl shadow-primary/20"
              >
                NEXT PROTOCOL <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center relative glass">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                  <Globe className="w-10 h-10 text-primary relative z-10" />
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-4xl mb-2 tracking-tighter">NEURAL LINK</h2>
                <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em] leading-relaxed">
                  Establish a secure connection to the POP API backbone to begin synthesis.
                </p>
              </div>

              <button 
                onClick={() => {
                  handleHaptic('medium');
                  handleConnectFreeApi();
                }}
                className="w-full py-5 bg-white text-black rounded-2xl font-display text-2xl tracking-widest hover:bg-primary hover:text-white transition-all glow-primary flex items-center justify-center gap-3 group shadow-xl"
              >
                CONNECT POP API <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => setOnboardingStep(1)}
                className="w-full py-3 text-white/20 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-colors"
              >
                Back to Identity
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-center gap-2 font-mono text-[8px] text-white/20 uppercase tracking-widest">
          <ShieldAlert className="w-3 h-3" /> Encrypted Protocol v4.2
        </div>
      </motion.div>
    </motion.div>
  );

  const renderLanding = () => {
    const isLimitReached = !hasApiKey && dailyCount >= 25;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto pt-32 px-6"
      >
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-display tracking-tighter">INITIALIZE <span className="text-primary">SYNTHESIS</span></h2>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">Input your core concept below</p>
          </div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="liquid-glass p-10 relative group shadow-2xl shadow-primary/5"
          >
            {isLimitReached ? (
              <div className="py-12 text-center space-y-8">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 relative glass">
                  <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-pulse" />
                  <ShieldAlert className="w-10 h-10 text-accent relative z-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl tracking-tighter text-accent">QUOTA EXHAUSTED</h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 leading-relaxed">
                    Free tier neural limit reached (25/25).
                  </p>
                </div>
                <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl glass">
                  <p className="text-xl font-display tracking-widest text-white">TO DESTROY LIMITS GET A PAID API</p>
                </div>
                <button 
                  onClick={handleSelectKey}
                  className="w-full py-5 bg-white text-black rounded-2xl font-display text-2xl tracking-widest hover:bg-primary hover:text-white transition-all glow-primary shadow-xl"
                >
                  UPGRADE NOW
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">Core Concept Seed</label>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#6C5CE7]" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                  </div>
                </div>
                
                <div className="relative">
                  <textarea 
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe the impossible..."
                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 h-48 focus:ring-2 ring-primary/30 outline-none transition-all resize-none font-mono text-lg placeholder:text-white/10 leading-relaxed glass"
                  />
                  {refImages.length > 0 && (
                    <div className="absolute bottom-6 left-6 flex gap-2">
                      {refImages.map((img, idx) => (
                        <div key={img} className="w-16 h-16 rounded-xl overflow-hidden border border-white/20 group/ref shadow-lg relative">
                          <img src={img} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setRefImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/ref:opacity-100 transition-opacity"
                          >
                            <X className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 flex items-center gap-4">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      multiple
                      className="hidden" 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/30 hover:text-white"
                      title="Upload Reference Image"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <span className="font-mono text-[10px] text-white/20">
                      {idea.length} chars
                    </span>
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(108, 92, 231, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleHaptic('medium');
                    if (idea.trim()) setState('survey');
                  }}
                  disabled={!idea.trim()}
                  className="w-full py-6 bg-primary hover:bg-primary/80 disabled:opacity-30 text-white rounded-3xl font-display text-3xl tracking-widest transition-all flex items-center justify-center gap-4 group/btn shadow-lg shadow-primary/20 relative overflow-hidden"
                >
                  <motion.div 
                    animate={{ 
                      x: ["-100%", "200%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                  />
                  <span className="relative z-10">INITIALIZE</span> 
                  <ChevronRight className="w-8 h-8 group-hover/btn:translate-x-2 transition-transform relative z-10" />
                </motion.button>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <button 
                onClick={() => {
                  handleHaptic('light');
                  setActiveTab('mine');
                }}
                className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-primary transition-colors group"
              >
                <History className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" /> Neural Archive
              </button>
              <div className="flex gap-3 flex-wrap justify-center">
                {['Cyberpunk', 'Anime', 'Realistic', 'Surreal'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setIdea(tag.toLowerCase())}
                    className="px-4 py-2 rounded-xl bg-white/5 text-[10px] font-mono text-white/30 hover:text-white hover:bg-primary/20 transition-all border border-transparent hover:border-primary/30 glass"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const renderSurvey = () => {
    const activeQuestions = [MEDIA_QUESTION, ...QUESTIONS];
    if (answers.mediaType === 'Video') {
      activeQuestions.push(...VIDEO_QUESTIONS);
    }

    const q = activeQuestions[currentStep];
    const progress = ((currentStep + 1) / activeQuestions.length) * 100;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto pt-24 px-6"
      >
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h3 className="text-4xl mb-1">{q.question}</h3>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">Step {currentStep + 1} of {activeQuestions.length}</p>
          </div>
          <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden glass">
            <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {q.options.map(opt => (
            <button
              key={opt}
              onClick={() => {
                handleHaptic('light');
                setAnswers(prev => {
                  const newAnswers = { ...prev, [q.id]: opt };
                  if (q.id === 'mediaType' && opt === 'Video') {
                    if (newAnswers.aspectRatio !== '16:9' && newAnswers.aspectRatio !== '9:16') {
                      newAnswers.aspectRatio = '16:9';
                    }
                  }
                  return newAnswers as any;
                });
                setTimeout(() => {
                  if (currentStep < activeQuestions.length - 1) setCurrentStep(currentStep + 1);
                  else generateFinalPrompt();
                }, 300);
              }}
              className={cn(
                "p-6 rounded-2xl text-left transition-all border group relative overflow-hidden glass",
                answers[q.id as keyof SurveyAnswer] === opt 
                  ? "bg-primary border-primary text-white glow-primary" 
                  : "bg-white/5 border-white/5 hover:border-white/20"
              )}
            >
              <div className="relative z-10">
                <span className="block font-mono text-[10px] mb-2 opacity-40 uppercase tracking-widest">Option</span>
                <span className="text-xl font-display tracking-wide">{opt}</span>
              </div>
              {answers[q.id as keyof SurveyAnswer] === opt && (
                <motion.div layoutId="active-opt" className="absolute inset-0 bg-primary z-0" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => {
              handleHaptic('light');
              currentStep > 0 ? setCurrentStep(currentStep - 1) : setState('landing');
            }}
            className="px-8 py-4 glass rounded-2xl font-mono text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
          >
            Back
          </button>
          <motion.button 
            onClick={() => {
              handleHaptic('light');
              currentStep < activeQuestions.length - 1 ? setCurrentStep(currentStep + 1) : generateFinalPrompt();
            }}
            whileTap={isHapticsEnabled ? { 
              scale: 0.98, 
              x: [0, -1, 1, 0],
              transition: { x: { type: "tween", duration: 0.2 } }
            } : {}}
            className="flex-1 py-4 bg-white text-black rounded-2xl font-display text-xl tracking-wider hover:bg-primary hover:text-white transition-all shadow-xl"
          >
            {currentStep === activeQuestions.length - 1 ? "FINALIZE" : "CONTINUE"}
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const renderGenerating = () => (
    <NeuralLoading 
      progress={loadingProgress} 
      message={loadingMsg} 
      prompt={tunedPrompt} 
    />
  );

  const renderReview = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto pt-24 px-6 pb-24"
      >
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-serif italic tracking-tighter mb-2">Neural Review</h2>
            <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.4em]">Calibrate geometry and finalize synthesis</p>
          </div>
          <button 
            onClick={() => {
              handleHaptic('light');
              setState('survey');
            }}
            className="px-6 py-3 glass rounded-full font-mono text-[10px] uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Survey
          </button>
        </div>

        <div className="space-y-12">
          {/* Prompt Display */}
          <div className="liquid-glass p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <div className="flex justify-between items-center mb-8">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Generated Neural Prompt</span>
              <div className="flex gap-4">
                <button onClick={() => { navigator.clipboard.writeText(tunedPrompt); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 glass rounded-full hover:text-white transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <textarea
              value={tunedPrompt}
              onChange={(e) => setTunedPrompt(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-xl font-mono leading-relaxed text-white/80 italic selection:bg-primary/30 resize-none h-40 custom-scrollbar glass p-4 rounded-2xl"
              placeholder="Refine your neural prompt..."
            />
          </div>

          {/* Ratio Selection */}
          <div className="space-y-6">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/30 flex items-center gap-2">
              <Maximize className="w-4 h-4" /> Select Canvas Geometry
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {(answers.mediaType === 'Video' ? ['16:9', '9:16'] : ASPECT_RATIOS).map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAnswers(prev => ({ ...prev, aspectRatio: ratio }))}
                  className={cn(
                    "p-4 rounded-2xl transition-all flex flex-col items-center gap-3 group glass",
                    answers.aspectRatio === ratio ? "bg-primary text-white glow-primary border-primary" : "hover:bg-white/5 border-white/5"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 border-2 rounded-sm transition-all group-hover:scale-110",
                    answers.aspectRatio === ratio ? "border-white" : "border-white/20"
                  )} style={{ aspectRatio: ratio.replace(':', '/') }} />
                  <span className="font-mono text-[10px] tracking-widest">{ratio}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-8">
            <motion.button 
              onClick={() => {
                handleHaptic('heavy');
                startGeneration();
              }}
              disabled={isGenerating}
              whileTap={isHapticsEnabled ? { 
                scale: 0.95, 
                y: [0, 2, -2, 0],
                transition: { y: { type: "tween", duration: 0.2 } }
              } : {}}
              className="w-full py-8 bg-primary text-white rounded-[2rem] font-display text-4xl tracking-[0.2em] hover:bg-primary/80 transition-all glow-primary flex items-center justify-center gap-6 group shadow-2xl shadow-primary/20"
            >
              <Zap className={cn("w-10 h-10 transition-transform group-hover:scale-125", isGenerating && "animate-pulse")} />
              {answers.mediaType === 'Video' ? 'PROMTO VIDEOO' : 'PROMTO IMAGOO'}
            </motion.button>
            <p className="text-center mt-6 font-mono text-[10px] text-white/20 uppercase tracking-[0.4em]">Neural Synthesis Engine v2.0</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderResult = () => {
    const ratio = answers.aspectRatio.split(':').join('/') || '1/1';
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto pt-24 px-6 pb-24"
      >
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => {
              handleHaptic('light');
              reset();
            }} 
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >            <ArrowLeft className="w-4 h-4" /> New Project
          </button>
          <div className="flex gap-4">
            <button onClick={() => setState('gallery')} className="p-3 glass rounded-full hover:text-primary transition-colors">
              <History className="w-5 h-5" />
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="p-3 glass rounded-full hover:text-primary transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-12">
          {/* Image on Top */}
          <div className="w-full">
            <div className="space-y-12">
              {generatedVideo ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mx-auto rounded-[3rem] overflow-hidden glass group relative shadow-[0_50px_100px_rgba(0,0,0,0.5)] bg-black/40"
                  style={{ 
                    aspectRatio: ratio,
                    maxHeight: '80vh',
                    width: '100%',
                    maxWidth: `calc(80vh * (${ratio}))`
                  }}
                >
                  <video src={generatedVideo} controls autoPlay loop className="w-full h-full object-contain" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <a 
                      href={generatedVideo} 
                      download="promtoner-x.mp4" 
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-black/60 rounded-full hover:bg-black/80 transition-colors backdrop-blur-xl border border-white/10"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </motion.div>
              ) : generatedImages.length > 0 ? (
                generatedImages.map((img) => (
                  <motion.div 
                    key={img}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mx-auto rounded-[3rem] overflow-hidden glass group relative cursor-pointer shadow-[0_50px_100px_rgba(0,0,0,0.5)] bg-black/40"
                    style={{ 
                      aspectRatio: ratio,
                      maxHeight: '80vh',
                      width: '100%',
                      maxWidth: `calc(80vh * (${ratio}))`
                    }}
                    onClick={() => setFullScreenImage(img)}
                  >
                    <img src={img} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFullScreenImage(img); }}
                        className="p-6 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-xl border border-white/10"
                      >
                        <Maximize className="w-10 h-10" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleShare(img); }}
                        className="p-6 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-xl border border-white/10"
                      >
                        <Share2 className="w-10 h-10" />
                      </button>
                      <a 
                        href={img} 
                        download="promtoner-x.png" 
                        onClick={(e) => e.stopPropagation()}
                        className="p-6 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-xl border border-white/10"
                      >
                        <Download className="w-10 h-10" />
                      </a>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mx-auto rounded-[3rem] overflow-hidden glass relative shadow-2xl bg-black/40 group"
                  style={{ 
                    aspectRatio: ratio,
                    maxHeight: '80vh',
                    width: '100%',
                    maxWidth: `calc(80vh * (${ratio}))`
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-dashed border-primary/20 rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 border-2 border-dashed border-secondary/20 rounded-full absolute top-4 left-4"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="w-10 h-10 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center space-y-4">
                      <p className="font-mono text-[10px] text-primary uppercase tracking-[0.5em] animate-pulse">Synthesizing Neural Data</p>
                      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto glass">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x" 
                          animate={{ width: `${loadingProgress}%` }} 
                        />
                      </div>
                      <p className="font-mono text-[8px] text-white/20 uppercase tracking-[0.3em]">{Math.round(loadingProgress)}% SYNCED</p>
                    </div>
                  </div>
                  {/* Scanning Line Effect */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse pointer-events-none" />
                </motion.div>
              )}

              {(generatedImages.length > 0 || generatedVideo) && (
                <div className="flex justify-center pt-8">
                  <motion.button
                    onClick={() => {
                      handleHaptic('medium');
                      startGeneration();
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-4 bg-white text-black rounded-full font-display text-xl tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-4 glow-primary shadow-xl"
                  >
                    <RefreshCw className="w-6 h-6" />
                    REGENERATE NEURAL DATA
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Prompt Below */}
          <div className="glass p-10 rounded-[3rem] hardware-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-[9px] uppercase tracking-widest text-primary/60">Neural Prompt Data</span>
              <button onClick={() => { navigator.clipboard.writeText(tunedPrompt); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-white/20 hover:text-white transition-colors">
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <p className="text-xl font-mono leading-relaxed text-white/80 italic selection:bg-primary/30">
              "{tunedPrompt}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass p-8 rounded-3xl hardware-border">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">Seed Idea</span>
              <p className="text-sm text-white/60">{idea}</p>
            </div>
            <div className="glass p-8 rounded-3xl hardware-border">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">{answers.mediaType === 'Video' ? 'Video Theme' : 'Neural Style'}</span>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest">{answers.mediaType === 'Video' ? answers.videoTheme : answers.style}</span>
            </div>
            <div className="glass p-8 rounded-3xl hardware-border">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">Geometry</span>
              <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-[10px] font-mono uppercase tracking-widest">{answers.aspectRatio}</span>
            </div>
            <motion.button 
              onClick={() => {
                handleHaptic('medium');
                startGeneration();
              }}
              whileTap={isHapticsEnabled ? { 
                scale: 0.9, 
                rotate: [0, -2, 2, 0],
                transition: { rotate: { type: "tween", duration: 0.2 } }
              } : {}}
              className="glass p-8 rounded-3xl hardware-border hover:bg-primary/10 transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <RefreshCw className="w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Re-Synthesize</span>
            </motion.button>
          </div>

          <button 
            onClick={() => {
              handleHaptic('light');
              setState('survey');
            }}
            className="w-full py-6 bg-white/5 text-white rounded-3xl font-display text-2xl tracking-widest hover:bg-white/10 transition-all hardware-border flex items-center justify-center gap-4"
          >
            <RefreshCw className="w-6 h-6" /> NEW CALIBRATION
          </button>
        </div>
      </motion.div>
    );
  };

  const renderGallery = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto pt-24 px-6 pb-24"
    >
      <div className="flex items-center justify-between mb-16">
        <h2 className="text-5xl font-serif italic tracking-tighter">Archive</h2>
        <button onClick={() => setState('landing')} className="px-8 py-3 glass rounded-full font-mono text-[9px] uppercase tracking-widest hover:text-primary transition-colors">
          Exit
        </button>
      </div>

      {gallery.length === 0 ? (
        <div className="text-center py-32 glass rounded-[3rem] hardware-border">
          <Layers className="w-16 h-16 mx-auto mb-6 text-white/10" />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">No records found in neural storage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gallery.map(item => (
            <motion.div 
              key={item.id} 
              whileHover={{ y: -10 }}
              className="glass rounded-[2rem] overflow-hidden flex flex-col group hardware-border"
            >
              <div className="aspect-square relative overflow-hidden bg-black/20">
                {item.mediaType === 'Video' && item.videoUrl ? (
                  <video src={item.videoUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" muted loop autoPlay />
                ) : (
                  <img src={item.images[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" />
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-mono uppercase tracking-widest border border-white/10">
                    {item.aspectRatio}
                  </div>
                  {item.mediaType === 'Video' && (
                    <div className="bg-primary/60 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-mono uppercase tracking-widest border border-white/10">
                      VIDEO
                    </div>
                  )}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-serif italic mb-2 line-clamp-1">{item.originalIdea}</h3>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-6">{new Date(item.timestamp).toLocaleDateString()}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      handleHaptic('light');
                      setTunedPrompt(item.tunedPrompt);
                      setGeneratedImages(item.images || []);
                      setGeneratedVideo(item.videoUrl || null);
                      setRefImages(item.referenceImages || []);
                      setAnswers(prev => ({ ...prev, aspectRatio: item.aspectRatio, mediaType: item.mediaType || 'Image' }));
                      setState('result');
                    }}
                    className="flex-1 py-3 bg-white text-black rounded-xl text-[10px] font-mono uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                  >
                    Load Data
                  </button>
                  <button 
                    onClick={() => {
                      handleHaptic('medium');
                      persistGallery(gallery.filter(g => g.id !== item.id));
                    }}
                    className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const constraintsRef = useRef(null);

  const handleIntroComplete = useCallback(() => {
    setState('intro');
  }, []);

  return (
    <div 
      ref={constraintsRef} 
      className={cn(
        "min-h-screen relative overflow-x-hidden",
        glassIntensity === 'low' ? 'glass-low' : glassIntensity === 'high' ? 'glass-high' : ''
      )}
      onClick={addRipple}
    >
      <div className="noise" />
      {isScanlineEnabled && <div className="scanline" />}
      {isAtmosphereEnabled && <div className="atmosphere fixed inset-0 pointer-events-none z-0" />}
      <ThreeBackground />

      {ripples.map(r => (
        <Ripple key={r.id} x={r.x} y={r.y} onComplete={() => removeRipple(r.id)} />
      ))}

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {state === 'splash' && (
            <IntroSequence key="splash" onComplete={handleIntroComplete} />
          )}
          {state === 'intro' && renderIntro()}
          {state === 'auth' && renderAuth()}
          {state !== 'intro' && state !== 'auth' && state !== 'splash' && (
            <>
              <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none"
              >
                <Logo size="sm" animated={true} className="pointer-events-auto" />
              </motion.header>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
              {activeTab === 'home' && renderHome()}
              {activeTab === 'discover' && renderDiscover()}
              {activeTab === 'create' && (
                <div className="relative min-h-screen">
                  <div className="relative z-10 pt-32 pb-40">
                    {state === 'landing' && renderLanding()}
                    {state === 'survey' && renderSurvey()}
                    {state === 'review' && renderReview()}
                    {state === 'generating' && renderGenerating()}
                    {state === 'result' && renderResult()}
                  </div>
                </div>
              )}
              {activeTab === 'mine' && renderGallery()}
              {activeTab === 'profile' && renderProfile()}
            </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>

      {state !== 'splash' && renderBottomNav()}

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8"
            onClick={() => setFullScreenImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img src={fullScreenImage} className="w-full h-auto max-h-[85vh] object-contain rounded-3xl shadow-2xl" />
              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <button 
                  onClick={() => handleShare(fullScreenImage)}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-display text-xl tracking-widest hover:bg-primary/80 transition-all flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" /> SHARE
                </button>
                <a href={fullScreenImage} download="promtoner-x-full.png" className="px-8 py-4 bg-white text-black rounded-2xl font-display text-xl tracking-widest hover:bg-primary hover:text-white transition-all">
                  DOWNLOAD
                </a>
                <button onClick={() => setFullScreenImage(null)} className="px-8 py-4 glass rounded-2xl font-display text-xl tracking-widest">
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {state !== 'splash' && (
        <SettingsModal 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          avatarSeed={avatarSeed}
          setAvatarSeed={setAvatarSeed}
          userName={userName}
          setUserName={setUserName}
          userBio={userBio}
          setUserBio={setUserBio}
          answers={answers}
          setAnswers={setAnswers}
          dailyCount={dailyCount}
          hasApiKey={hasApiKey}
          handleSelectKey={handleSelectKey}
          isStatusBarVisible={isStatusBarVisible}
          setIsStatusBarVisible={setIsStatusBarVisible}
          isScanlineEnabled={isScanlineEnabled}
          setIsScanlineEnabled={setIsScanlineEnabled}
          isAtmosphereEnabled={isAtmosphereEnabled}
          setIsAtmosphereEnabled={setIsAtmosphereEnabled}
          isHapticsEnabled={isHapticsEnabled}
          setIsHapticsEnabled={setIsHapticsEnabled}
          glassIntensity={glassIntensity}
          setGlassIntensity={setGlassIntensity}
          deferredPrompt={deferredPrompt}
          handleInstall={handleInstall}
          persistGallery={persistGallery}
          handleHaptic={handleHaptic}
        />
      )}

      {/* Liquid Glass API Status Bar */}
      <AnimatePresence>
        {isStatusBarVisible && state !== 'splash' && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[160] w-full max-w-lg px-6 cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence mode="wait">
              {!isStatusMinimized ? (
                <motion.div
                  key="bar"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={handleStatusClick}
                  className={cn(
                    "relative group transition-all duration-500",
                    "bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
                    "hover:bg-white/15",
                    isStatusExpanded ? "h-0 opacity-0 pointer-events-none" : "h-16"
                  )}
                >
                  <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />
                    <motion.div 
                      animate={{ 
                        x: ["-100%", "100%"],
                        opacity: [0, 0.5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  </div>

                  <div className="relative h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.5, 0.2]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-primary rounded-full blur-md"
                        />
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center relative z-10">
                          <Activity className="w-4 h-4 text-primary" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-bg animate-pulse z-20" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Neural Status</p>
                        <p className="text-xs font-display tracking-wider">POP API: STABLE</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Daily Quota</p>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(dailyCount / 25) * 100}%` }}
                              className="h-full bg-gradient-to-r from-primary to-secondary"
                            />
                          </div>
                          <span className="text-[10px] font-mono text-primary">{dailyCount}/25</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setIsStatusMinimized(true); }}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <ChevronDown className="w-4 h-4 text-white/40" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setIsStatusBarVisible(false); }}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-500/50 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[8px] font-mono uppercase tracking-widest border border-white/10">
                      Drag to Move • Double Tap to Expand
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="minimized"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex flex-col items-center gap-2"
                >
                  <button
                    onClick={() => setIsStatusMinimized(false)}
                    className="w-12 h-12 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all shadow-xl mx-auto"
                  >
                    <ChevronUp className="w-5 h-5 text-primary" />
                  </button>
                  <button 
                    onClick={() => setIsStatusBarVisible(false)}
                    className="p-1 glass rounded-full text-white/20 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Usage Modal */}
      <AnimatePresence>
        {isStatusExpanded && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStatusExpanded(false)}
              className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-[180] max-w-2xl mx-auto glass rounded-[3rem] hardware-border p-10 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x" />
              
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-3xl tracking-tighter">NEURAL ANALYTICS</h3>
                    <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">Free API Usage Metrics</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsStatusExpanded(false)}
                  className="p-3 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 glass rounded-2xl hardware-border relative group overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">Total Synthesis</p>
                  <p className="text-4xl font-display text-primary">{dailyCount}</p>
                  <p className="text-[9px] font-mono text-white/20 mt-2 uppercase">Last 24 Hours</p>
                </div>
                <div className="p-6 glass rounded-2xl hardware-border relative group overflow-hidden">
                  <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">Remaining</p>
                  <p className="text-4xl font-display text-secondary">{25 - dailyCount}</p>
                  <p className="text-[9px] font-mono text-white/20 mt-2 uppercase">Neural Credits</p>
                </div>
                <div className="p-6 glass rounded-2xl hardware-border relative group overflow-hidden">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">Efficiency</p>
                  <p className="text-4xl font-display text-accent">98.4%</p>
                  <p className="text-[9px] font-mono text-white/20 mt-2 uppercase">Neural Accuracy</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="h-64 w-full glass rounded-3xl p-6 hardware-border relative">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                    <Waves className="w-3 h-3 text-primary" /> Synthesis Distribution
                  </p>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: '00:00', usage: 2 },
                      { time: '04:00', usage: 5 },
                      { time: '08:00', usage: dailyCount * 0.4 },
                      { time: '12:00', usage: dailyCount * 0.7 },
                      { time: '16:00', usage: dailyCount * 0.9 },
                      { time: '20:00', usage: dailyCount },
                      { time: '23:59', usage: dailyCount },
                    ]}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#6C5CE7', fontSize: '10px', fontFamily: 'JetBrains Mono' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="usage" 
                        stroke="#6C5CE7" 
                        fillOpacity={1} 
                        fill="url(#colorUsage)" 
                        strokeWidth={3}
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-8 glass rounded-3xl hardware-border bg-primary/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-display tracking-wider">UNLIMITED NEURAL ACCESS</p>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Destroy all limits with a Pro API Key</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setIsStatusExpanded(false); handleSelectKey(); }}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-display text-xl tracking-widest hover:bg-primary/80 transition-all glow-primary"
                  >
                    UPGRADE NOW
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
