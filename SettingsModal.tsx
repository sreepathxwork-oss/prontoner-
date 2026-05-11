import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  X, 
  Star, 
  Activity, 
  Monitor, 
  Layers, 
  Zap, 
  ShieldAlert, 
  Plus, 
  ChevronRight, 
  Trash2, 
  RefreshCw 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { MODELS } from '../constants';
import { SurveyAnswer, GeneratedPrompt } from '../types';
import { NeuralLink } from './NeuralLink';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarSeed: string;
  setAvatarSeed: (seed: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  userBio: string;
  setUserBio: (bio: string) => void;
  answers: SurveyAnswer;
  setAnswers: (fn: (prev: SurveyAnswer) => SurveyAnswer) => void;
  dailyCount: number;
  hasApiKey: boolean;
  handleSelectKey: () => void;
  isStatusBarVisible: boolean;
  setIsStatusBarVisible: (v: boolean) => void;
  isScanlineEnabled: boolean;
  setIsScanlineEnabled: (v: boolean) => void;
  isAtmosphereEnabled: boolean;
  setIsAtmosphereEnabled: (v: boolean) => void;
  isHapticsEnabled: boolean;
  setIsHapticsEnabled: (v: boolean) => void;
  glassIntensity: 'low' | 'medium' | 'high';
  setGlassIntensity: (v: 'low' | 'medium' | 'high') => void;
  deferredPrompt: any;
  handleInstall: () => void;
  persistGallery: (g: GeneratedPrompt[]) => void;
  handleHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  avatarSeed,
  userName,
  userBio,
  answers,
  setAnswers,
  dailyCount,
  hasApiKey,
  handleSelectKey,
  isStatusBarVisible,
  setIsStatusBarVisible,
  isScanlineEnabled,
  setIsScanlineEnabled,
  isAtmosphereEnabled,
  setIsAtmosphereEnabled,
  isHapticsEnabled,
  setIsHapticsEnabled,
  glassIntensity,
  setGlassIntensity,
  deferredPrompt,
  handleInstall,
  persistGallery,
  handleHaptic
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-[150] glass border-l border-white/10 p-8 pt-24 overflow-y-auto"
          >
            <NeuralLink />
            
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-display tracking-wider">SETTINGS</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-10 pb-12 relative z-10">
              {/* User Profile Section */}
              <section>
                <label className="block font-serif italic text-xs text-white/40 mb-4">Neural Identity</label>
                <div className="flex items-center gap-4 p-4 glass rounded-2xl hardware-border">
                  <div className="w-12 h-12 rounded-full border-2 border-primary p-0.5">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} 
                      className="w-full h-full rounded-full bg-surface" 
                      alt="Avatar"
                    />
                  </div>
                  <div>
                    <p className="font-display tracking-wide text-lg">{userName}</p>
                    <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{userBio.slice(0, 20)}...</p>
                  </div>
                </div>
              </section>

              {/* AI Configuration */}
              <section className="space-y-6">
                <label className="block font-serif italic text-xs text-white/40 mb-4">Neural Engine</label>
                
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase mb-2">Model Selection</p>
                  <div className="space-y-2">
                    {MODELS.map(m => (
                      <button 
                        key={m.id}
                        onClick={() => {
                          handleHaptic('light');
                          setAnswers(prev => ({ ...prev, model: m.id }));
                        }}
                        className={cn(
                          "w-full p-4 rounded-xl border text-left transition-all",
                          answers.model === m.id ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/5 hover:border-white/10"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {m.icon}
                          <span className="font-display tracking-wider text-sm">{m.name}</span>
                        </div>
                        <p className="text-[9px] font-mono text-white/40 uppercase">{m.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase mb-2">Negative Seed</p>
                  <textarea 
                    value={answers.negativePrompt}
                    onChange={(e) => setAnswers(prev => ({ ...prev, negativePrompt: e.target.value }))}
                    placeholder="Blurry, low quality, distorted..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-24 focus:ring-1 ring-primary/50 outline-none transition-all resize-none font-mono text-[10px] uppercase"
                  />
                </div>
              </section>

              {/* Usage & Limits */}
              <section className="space-y-4">
                <label className="block font-serif italic text-xs text-white/40 mb-4">Usage & Limits</label>
                <div className="p-4 glass rounded-2xl hardware-border space-y-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Daily Quota</span>
                    <span className="text-[10px] font-mono text-primary">{dailyCount}/25</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(dailyCount / 25) * 100}%` }}
                      className="h-full bg-primary shadow-[0_0_10px_rgba(255,42,133,0.5)]" 
                    />
                  </div>
                  {!hasApiKey && (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleHaptic('medium');
                        handleSelectKey();
                      }} 
                      className="w-full py-4 bg-primary/10 border border-primary/30 text-primary rounded-xl font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                    >
                      <motion.div 
                        animate={{ 
                          x: ["-100%", "200%"],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                      <Star className="w-3 h-3 group-hover:rotate-45 transition-transform relative z-10" /> 
                      <span className="relative z-10">Connect API Key</span>
                    </motion.button>
                  )}
                </div>
              </section>

              {/* UI Preferences */}
              <section className="space-y-4">
                <label className="block font-serif italic text-xs text-white/40 mb-4">Neural Interface Preferences</label>
                
                <div className="space-y-3">
                  {/* Status Bar Toggle */}
                  <div className="flex items-center justify-between p-4 glass rounded-2xl hardware-border group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg transition-colors", isStatusBarVisible ? "bg-primary/20 text-primary" : "bg-white/5 text-white/20")}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono uppercase tracking-widest">Status Bar</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase">Neural Link Monitor</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        handleHaptic('light');
                        setIsStatusBarVisible(!isStatusBarVisible);
                      }}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative overflow-hidden",
                        isStatusBarVisible ? "bg-primary shadow-[0_0_15px_rgba(255,42,133,0.5)]" : "bg-white/10"
                      )}
                    >
                      <motion.div 
                        layout
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 30,
                          scale: { type: "tween", duration: 0.2 }
                        }}
                        animate={{ 
                          x: isStatusBarVisible ? 24 : 4,
                          scale: isStatusBarVisible ? [1, 1.2, 1] : 1
                        }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg z-10"
                      />
                      {isStatusBarVisible && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-white/20"
                        />
                      )}
                    </button>
                  </div>

                  {/* Scanline Toggle */}
                  <div className="flex items-center justify-between p-4 glass rounded-2xl hardware-border group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg transition-colors", isScanlineEnabled ? "bg-secondary/20 text-secondary" : "bg-white/5 text-white/20")}>
                        <Monitor className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono uppercase tracking-widest">Scanlines</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase">Retro CRT Simulation</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        handleHaptic('light');
                        setIsScanlineEnabled(!isScanlineEnabled);
                      }}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative overflow-hidden",
                        isScanlineEnabled ? "bg-secondary shadow-[0_0_15px_rgba(122,0,255,0.5)]" : "bg-white/10"
                      )}
                    >
                      <motion.div 
                        layout
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 30,
                          scale: { type: "tween", duration: 0.2 }
                        }}
                        animate={{ 
                          x: isScanlineEnabled ? 24 : 4,
                          scale: isScanlineEnabled ? [1, 1.2, 1] : 1
                        }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg z-10"
                      />
                      {isScanlineEnabled && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-white/20"
                        />
                      )}
                    </button>
                  </div>

                  {/* Atmosphere Toggle */}
                  <div className="flex items-center justify-between p-4 glass rounded-2xl hardware-border group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg transition-colors", isAtmosphereEnabled ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-white/20")}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono uppercase tracking-widest">Atmosphere</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase">Dynamic Neural Fog</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        handleHaptic('light');
                        setIsAtmosphereEnabled(!isAtmosphereEnabled);
                      }}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative overflow-hidden",
                        isAtmosphereEnabled ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-white/10"
                      )}
                    >
                      <motion.div 
                        layout
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 30,
                          scale: { type: "tween", duration: 0.2 }
                        }}
                        animate={{ 
                          x: isAtmosphereEnabled ? 24 : 4,
                          scale: isAtmosphereEnabled ? [1, 1.2, 1] : 1
                        }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg z-10"
                      />
                      {isAtmosphereEnabled && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-white/20"
                        />
                      )}
                    </button>
                  </div>

                  {/* Haptics Toggle */}
                  <div className="flex items-center justify-between p-4 glass rounded-2xl hardware-border group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg transition-colors", isHapticsEnabled ? "bg-orange-500/20 text-orange-500" : "bg-white/5 text-white/20")}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono uppercase tracking-widest">Neural Haptics</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase">Visual Feedback Pulse</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        handleHaptic('light');
                        setIsHapticsEnabled(!isHapticsEnabled);
                      }}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative overflow-hidden",
                        isHapticsEnabled ? "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" : "bg-white/10"
                      )}
                    >
                      <motion.div 
                        layout
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 30,
                          scale: { type: "tween", duration: 0.2 }
                        }}
                        animate={{ 
                          x: isHapticsEnabled ? 24 : 4,
                          scale: isHapticsEnabled ? [1, 1.2, 1] : 1
                        }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg z-10"
                      />
                      {isHapticsEnabled && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-white/20"
                        />
                      )}
                    </button>
                  </div>

                  {/* Glass Intensity */}
                  <div className="p-4 glass rounded-2xl hardware-border space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-white/40">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono uppercase tracking-widest">Glass Density</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase">Backdrop Blur Calibration</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['low', 'medium', 'high'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            handleHaptic('light');
                            setGlassIntensity(level);
                          }}
                          className={cn(
                            "py-2 rounded-lg font-mono text-[8px] uppercase tracking-widest transition-all",
                            glassIntensity === level ? "bg-primary text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* System Status */}
              <section className="space-y-4">
                <label className="block font-serif italic text-xs text-white/40 mb-4">System Status</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 glass rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Neural Link</span>
                    </div>
                    <span className="text-[9px] font-mono text-green-500 uppercase">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 glass rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-3 h-3 text-blue-500" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Safety Guard</span>
                    </div>
                    <span className="text-[9px] font-mono text-blue-500 uppercase">Enabled</span>
                  </div>
                </div>
              </section>

              {/* App Management */}
              <section className="space-y-4">
                <label className="block font-serif italic text-xs text-white/40 mb-4">Neural Management</label>
                
                <div className="grid grid-cols-1 gap-3">
                  {deferredPrompt && (
                    <motion.button 
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        handleHaptic('medium');
                        handleInstall();
                      }}
                      className="w-full p-4 glass rounded-xl border border-primary/30 text-primary hover:bg-primary/10 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <Plus className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-[10px] font-mono uppercase tracking-widest">Install App</span>
                          <span className="text-[8px] font-mono text-white/20 uppercase">Add to Home Screen</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}

                  <motion.button 
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      handleHaptic('heavy');
                      if (confirm("Are you sure you want to clear your neural archive? This cannot be undone.")) {
                        persistGallery([]);
                      }
                    }}
                    className="w-full p-4 glass rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono uppercase tracking-widest">Clear Archive</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase">Wipe Neural History</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.button 
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      handleHaptic('heavy');
                      if (confirm("Clear all application cache and reset? This will sign you out and clear your archive.")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="w-full p-4 glass rounded-xl border border-white/10 text-white/40 hover:bg-white/5 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono uppercase tracking-widest">Reset System</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase">Factory Neural Reset</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </section>

              {/* About Section */}
              <section className="space-y-4">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-white/30 mb-4">About</label>
                <div className="p-4 glass rounded-2xl hardware-border space-y-3">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-white/40">
                    <span>Version</span>
                    <span>2.0.48-X</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-white/40">
                    <span>Build</span>
                    <span>Neural-Stable</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex justify-between text-[9px] font-mono uppercase tracking-widest text-white/40">
                    <span>Developer</span>
                    <span>Antigravity AI</span>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
