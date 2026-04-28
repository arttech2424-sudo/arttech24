/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Download, 
  Layout, 
  Maximize2,
  Check,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

type DesignStyle = 'Premium' | 'Classic' | 'Luxury' | 'Modern' | 'Traditional';
type SpaceType = 'Hotel' | 'Restaurant' | 'Bakery' | 'Coffee Shop' | 'Theater' | 'Parlor' | 'Gallery' | 'Home' | 'Office' | 'Shop';
type ColorPalette = 'Warm Neutrals' | 'Deep Forest' | 'Midnight Soul' | 'Minimalist Gray' | 'Desert Sands' | 'Royal Velvet';

interface DesignSettings {
  style: DesignStyle;
  spaceType: SpaceType;
  squareFeet: string;
  colorPalette: ColorPalette;
}

const Logo = () => (
  <svg width="48" height="40" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 75L60 25L110 75" stroke="#0D0D0D" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 75L60 43L92 75" stroke="#C75B2A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [settings, setSettings] = useState<DesignSettings>({
    style: 'Modern',
    spaceType: 'Home',
    squareFeet: '1000',
    colorPalette: 'Warm Neutrals'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDesign = async () => {
    if (!previewImage) return;
    
    setIsGenerating(true);
    setStep(3);

    try {
      const base64Data = previewImage.split(',')[1];
      const mimeType = previewImage.split(';')[0].split(':')[1];

      // Step 1: Image Analysis
      const analysisResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: `Analyze this image for an interior architecture project. 
              Determine if the space is 'Empty' (raw shell, unfinished) or 'Renovatable' (existing decor/furniture that needs overhaul). 
              Briefly describe the architectural features you see (lighting, windows, ceiling) to help a designer. 
              Keep it under 50 words.` }
          ]
        }
      });
      
      const analysisResult = analysisResponse.text || "Standard space detected.";
      setAnalysis(analysisResult);

      // Step 2: Image Generation/Reinvention
      const prompt = `Task: ${analysisResult.toLowerCase().includes('empty') ? 'Transform this raw empty shell' : 'Renovate this existing space'} into a high-end ${settings.style} style ${settings.spaceType}. 
      Context from Vision Analysis: ${analysisResult}
      Technical Specs: The total area is approximately ${settings.squareFeet} square feet. 
      Color Preference: Use a ${settings.colorPalette} color palette.
      Instructions: Maintain the core structural geometry (windows, doors, structural pillars) but completely reimagine the environment. 
      For a ${settings.spaceType}, focus on ${settings.style} materials, professional architectural lighting, and bespoke furniture consistent with the ${settings.colorPalette} theme. 
      Final output must be a crisp, photorealistic, professional 3D architectural render with perfect perspective.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', 
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: prompt },
          ],
        },
      });

      // Find the image part in response
      let foundImage = false;
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error('No image was generated. Please try again.');
      }

      const newCount = generationCount + 1;
      setGenerationCount(newCount);
      
      // Trigger contact form after 2nd generation
      if (newCount >= 2) {
        setTimeout(() => setShowContactForm(true), 1500);
      }

    } catch (error) {
      console.error('Error generating design:', error);
      alert('Design generation failed. Please check your API key or try a different image.');
      setStep(2);
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setPreviewImage(null);
    setGeneratedImage(null);
    setAnalysis(null);
    setStep(1);
    setSettings({
      style: 'Modern',
      spaceType: 'Home',
      squareFeet: '1000',
      colorPalette: 'Warm Neutrals'
    });
  };

  return (
    <div className="min-h-screen bg-off-white text-text-primary font-sans selection:bg-brand selection:text-white">
      {/* Header */}
      <header className="border-b border-border-brand bg-white/80 backdrop-blur-md sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-tight text-dark leading-none">Arttech</h1>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-text-muted mt-1 leading-none">Architectural AI Studio</p>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-10 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-text-sec">
            <a href="#" className="hover:text-brand transition-colors">Showcase</a>
            <a href="#" className="hover:text-brand transition-colors">Services</a>
            <a href="#" className="hover:text-brand transition-colors">Technology</a>
          </nav>

          <button className="btn-outline btn-sm hidden sm:block">
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center space-y-10"
            >
              <div className="inline-flex items-center px-4 py-1.5 bg-brand-50 border border-brand/10 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand">
                Step 01 / Visual Input
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-dark leading-[1.1] max-w-4xl mx-auto">
                Reimagine your space through <span className="italic">generative</span> intelligence.
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-text-sec font-medium leading-relaxed">
                Upload a capture of your environment—empty shell or existing interior—and witness our AI architect craft a bespoke design masterpiece.
              </p>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative cursor-pointer max-w-3xl mx-auto aspect-[21/9] rounded-brand-xl border-2 border-dashed border-border-brand bg-white hover:border-brand/40 transition-all flex flex-col items-center justify-center overflow-hidden shadow-brand"
              >
                <div className="p-6 rounded-full bg-surface mb-4 group-hover:scale-110 transition-transform">
                  <Camera size={36} className="text-brand opacity-60" />
                </div>
                <p className="font-bold text-lg">Drop high-res capture or click to browse</p>
                <p className="text-[0.72rem] font-bold uppercase tracking-widest text-text-muted mt-2">Support HEIC, JPG, PNG up to 15MB</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-50 grayscale group divide-x divide-border-brand">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-serif">Luxury</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest mt-2">Aesthetic</span>
                </div>
                <div className="flex flex-col items-center pl-12">
                  <span className="text-4xl font-serif">Classic</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest mt-2">Geometry</span>
                </div>
                <div className="flex flex-col items-center pl-12">
                  <span className="text-4xl font-serif">Modern</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest mt-2">Flow</span>
                </div>
                <div className="flex flex-col items-center pl-12">
                  <span className="text-4xl font-serif">Original</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest mt-2">Heritage</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid md:grid-cols-2 gap-16 items-start"
            >
              <div className="space-y-8">
                <div>
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-text-muted hover:text-brand transition-colors mb-6"
                  >
                    <ChevronLeft size={16} /> Back to capture
                  </button>
                  <div className="inline-flex items-center px-4 py-1.5 bg-brand-50 border border-brand/10 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand mb-4">
                    Step 02 / Design Configuration
                  </div>
                  <h2 className="text-4xl font-serif font-bold text-dark italic leading-tight">Define your architectural intent.</h2>
                </div>

                <div className="bg-white p-10 rounded-brand-lg border border-border-brand shadow-brand space-y-10">
                  <div className="space-y-5">
                    <label className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-text-muted block">Functional Intent</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Hotel', 'Restaurant', 'Bakery', 'Coffee Shop', 'Theater', 'Parlor', 'Gallery', 'Home', 'Office', 'Shop'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setSettings(s => ({ ...s, spaceType: type as SpaceType }))}
                          className={`px-4 py-4 rounded-brand text-[0.72rem] font-bold uppercase tracking-wider transition-all border ${
                            settings.spaceType === type 
                            ? 'bg-dark text-white border-dark' 
                            : 'bg-surface border-transparent hover:border-brand/30 text-text-sec'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <label className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-text-muted block">Design Philosophy</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Premium', 'Classic', 'Luxury', 'Modern', 'Traditional'].map((style) => (
                        <button
                          key={style}
                          onClick={() => setSettings(s => ({ ...s, style: style as DesignStyle }))}
                          className={`px-4 py-4 rounded-brand text-[0.72rem] font-bold uppercase tracking-wider transition-all border ${
                            settings.style === style 
                            ? 'bg-dark text-white border-dark' 
                            : 'bg-surface border-transparent hover:border-brand/30 text-text-sec'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <label className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-text-muted block">Signature Color Palette</label>
                    <div className="grid grid-cols-1 gap-3">
                      {['Warm Neutrals', 'Deep Forest', 'Midnight Soul', 'Minimalist Gray', 'Desert Sands', 'Royal Velvet'].map((palette) => (
                        <button
                          key={palette}
                          onClick={() => setSettings(s => ({ ...s, colorPalette: palette as ColorPalette }))}
                          className={`px-6 py-4 rounded-brand text-[0.72rem] font-bold uppercase tracking-wider transition-all border flex items-center justify-between ${
                            settings.colorPalette === palette 
                            ? 'bg-dark text-white border-dark' 
                            : 'bg-surface border-transparent hover:border-brand/30 text-text-sec'
                          }`}
                        >
                          {palette}
                          <div className={`w-3 h-3 rounded-full shadow-inner ${
                             palette === 'Warm Neutrals' ? 'bg-[#d2b48c]' :
                             palette === 'Deep Forest' ? 'bg-[#228b22]' :
                             palette === 'Midnight Soul' ? 'bg-[#191970]' :
                             palette === 'Minimalist Gray' ? 'bg-[#808080]' :
                             palette === 'Desert Sands' ? 'bg-[#edc9af]' :
                             'bg-[#4b0082]'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <label className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-text-muted block">Area Metrics (SQ FT)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        value={settings.squareFeet}
                        onChange={(e) => setSettings(s => ({ ...s, squareFeet: e.target.value }))}
                        className="w-full bg-surface border-transparent border focus:border-brand/30 rounded-brand px-5 py-4 text-sm font-bold focus:outline-none transition-all pr-16"
                        placeholder="e.g. 1500"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[0.65rem] font-bold text-text-muted uppercase tracking-widest">Sq Ft</span>
                    </div>
                  </div>

                  <button 
                    onClick={generateDesign}
                    disabled={!previewImage}
                    className="btn-primary w-full py-5 text-base flex items-center justify-center gap-3"
                  >
                    <Sparkles size={20} /> Generate Design Plan
                  </button>
                </div>
              </div>

              <div className="sticky top-32">
                 <div className="relative aspect-[3/4] rounded-brand-xl overflow-hidden shadow-brand-lg bg-white border border-border-brand">
                    <img 
                      src={previewImage!} 
                      alt="Input state" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                       <p className="text-brand text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-3">Input Analysis</p>
                       <h3 className="text-white text-3xl font-serif font-bold italic leading-tight">Original Architecture</h3>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                <div>
                  <div className="inline-flex items-center px-4 py-1.5 bg-brand-50 border border-brand/10 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand mb-4">
                    Step 03 / AI Generation Complete
                  </div>
                  <h2 className="text-5xl font-serif font-bold text-dark italic">Architecture Reinvented.</h2>
                </div>
                {!isGenerating && (
                  <div className="flex gap-4">
                    <button 
                      onClick={reset}
                      className="btn-outline p-4 flex items-center justify-center"
                      title="Initiate New Design"
                    >
                      <RotateCcw size={22} className="text-text-sec" />
                    </button>
                    <button 
                      className="btn-dark px-10 py-4 flex items-center gap-3"
                      onClick={() => {
                        if (generatedImage) {
                          const link = document.createElement('a');
                          link.href = generatedImage;
                          link.download = `arttech-render-${Date.now()}.png`;
                          link.click();
                        }
                      }}
                    >
                      <Download size={20} /> Export Render
                    </button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-text-muted">Captured State</p>
                    </div>
                    <div className="aspect-[3/4] rounded-brand-lg overflow-hidden border border-border-brand grayscale opacity-70">
                      <img 
                        src={previewImage!} 
                        alt="Original" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand">Final 3D Render</p>
                      {isGenerating && (
                         <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gold animate-pulse">
                           <Loader2 size={12} className="animate-spin" /> Intelligence at work...
                         </div>
                      )}
                    </div>
                    <div className="aspect-[3/4] rounded-brand-xl overflow-hidden border border-border-brand bg-white relative shadow-brand-lg group">
                      {isGenerating ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center space-y-8 bg-surface/50 backdrop-blur-sm">
                           <div className="relative">
                              <div className="w-28 h-28 border-2 border-brand/5 rounded-full animate-ping absolute inset-0"></div>
                              <div className="w-28 h-28 border-[3px] border-brand rounded-full animate-spin border-t-transparent relative z-10"></div>
                              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand opacity-30" size={36} />
                           </div>
                           <div className="space-y-3">
                             <p className="text-2xl font-serif font-bold text-dark italic">{analysis ? 'Synthesizing Materials...' : 'Mapping Spatial Geometry...'}</p>
                             <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-text-muted max-w-xs mx-auto">
                               {analysis ? `Rendering ${settings.colorPalette} tones for your ${settings.style} ${settings.spaceType}` : 'Determining architectural potential and structural constraints'}
                             </p>
                           </div>
                        </div>
                      ) : (
                        <>
                          <img 
                            src={generatedImage || ''} 
                            alt="Generated Design" 
                            className="w-full h-full object-cover animate-in fade-in duration-1000" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/90 backdrop-blur-md shadow-brand-lg rounded-brand-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 border border-border-brand">
                             <div className="flex items-center gap-4 mb-3">
                               <div className="px-3 py-1 bg-brand text-white text-[0.65rem] font-bold uppercase tracking-widest rounded-full shadow-brand-sm">AI Blueprint</div>
                               <div className="text-[0.65rem] font-bold uppercase tracking-widest text-text-sec">Palette: {settings.colorPalette}</div>
                             </div>
                             <h4 className="font-serif font-bold text-2xl text-dark leading-tight italic">Luxurious {settings.spaceType} / {settings.squareFeet} SQ FT</h4>
                          </div>
                        </>
                      )}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-40 bg-black-brand text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-start gap-16 border-b border-white/5 pb-16">
              <div className="max-w-md space-y-6">
                 <div className="flex items-center gap-4">
                    <svg width="40" height="34" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 75L60 25L110 75" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M28 75L60 43L92 75" stroke="#C75B2A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h2 className="text-3xl font-serif font-bold tracking-tight">Arttech</h2>
                 </div>
                 <p className="text-text-muted text-sm leading-relaxed">
                   Redefinition of space through the lens of artificial intelligence. We combine architectural precision with generative possibility to create the future of interior design.
                 </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-[0.65rem] font-bold uppercase tracking-[0.16em]">
                 <div className="space-y-6">
                    <p className="text-white">Studio</p>
                    <div className="flex flex-col gap-4 text-text-muted">
                       <a href="#" className="hover:text-brand transition-colors">Showcase</a>
                       <a href="#" className="hover:text-brand transition-colors">Vision</a>
                       <a href="#" className="hover:text-brand transition-colors">Archive</a>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <p className="text-white">Technology</p>
                    <div className="flex flex-col gap-4 text-text-muted">
                       <a href="#" className="hover:text-brand transition-colors">AI Engine</a>
                       <a href="#" className="hover:text-brand transition-colors">Processing</a>
                       <a href="#" className="hover:text-brand transition-colors">API</a>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <p className="text-white">Connect</p>
                    <div className="flex flex-col gap-4 text-text-muted">
                       <a href="#" className="hover:text-brand transition-colors">Consult</a>
                       <a href="#" className="text-green-wa">WhatsApp</a>
                    </div>
                 </div>
              </div>
           </div>
           <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-text-muted">© 2026 Arttech Design Group. Powered by Gemini AI.</p>
              <div className="flex gap-10 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-text-muted">
                 <a href="#" className="hover:text-white transition-colors">Privacy</a>
                 <a href="#" className="hover:text-white transition-colors">Terms</a>
                 <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
           </div>
        </div>
      </footer>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black-brand/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white max-w-xl w-full rounded-brand-xl shadow-brand-lg overflow-hidden relative"
            >
              <button 
                onClick={() => setShowContactForm(false)}
                className="absolute top-6 right-6 p-2 hover:bg-surface rounded-full transition-colors"
              >
                <RotateCcw size={20} className="text-text-muted" />
              </button>

              <div className="p-12 space-y-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center px-4 py-1.5 bg-brand-50 border border-brand/10 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand">
                    Exclusive Consultation
                  </div>
                  <h3 className="text-4xl font-serif font-bold text-dark italic">Bring your vision to life.</h3>
                  <p className="text-text-sec text-sm leading-relaxed">
                    You've explored the possibilities. Now, let our master architects turn these AI blueprints into a tangible reality.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowContactForm(false); alert('Thank you! Our design team will contact you shortly.'); }}>
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Full Name</label>
                    <input type="text" required className="w-full bg-surface border border-transparent focus:border-brand/30 rounded-brand px-5 py-4 text-sm focus:outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Email Address</label>
                      <input type="email" required className="w-full bg-surface border border-transparent focus:border-brand/30 rounded-brand px-5 py-4 text-sm focus:outline-none transition-all" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Phone Number</label>
                      <input type="tel" required className="w-full bg-surface border border-transparent focus:border-brand/30 rounded-brand px-5 py-4 text-sm focus:outline-none transition-all" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-widest text-text-muted">Project Type</label>
                    <select className="w-full bg-surface border border-transparent focus:border-brand/30 rounded-brand px-5 py-4 text-sm focus:outline-none transition-all appearance-none cursor-pointer">
                      <option>Commercial Transformation</option>
                      <option>Residential Luxury</option>
                      <option>Hospitality Design</option>
                      <option>Industrial Architect</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full py-5 text-sm">
                    Book Architectural Review
                  </button>
                  <p className="text-[0.6rem] text-center text-text-muted font-bold uppercase tracking-wider">
                    Our team typically responds within 24 business hours.
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
