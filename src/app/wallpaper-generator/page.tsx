'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Download, RefreshCw,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';

const FORMATS = [
  { name: 'Instagram Post', width: 1080, height: 1080, aspect: '1:1' },
  { name: 'Instagram/Mobile Story', width: 1080, height: 1920, aspect: '9:16' },
  { name: 'LinkedIn / Facebook Post', width: 1200, height: 627, aspect: '1.91:1' },
  { name: 'X / Twitter Post', width: 1200, height: 675, aspect: '16:9' },
  { name: 'Desktop Wallpaper', width: 1920, height: 1080, aspect: '16:9' },
];

const THEMES = [
  { name: 'Sunset Aura', colors: ['#FF512F', '#DD2476'], text: '#FFFFFF' },
  { name: 'Deep Space', colors: ['#0f172a', '#1e1b4b'], text: '#F8FAFC' },
  { name: 'Neon Mint', colors: ['#00F260', '#0575E6'], text: '#FFFFFF' },
  { name: 'Pure Grace', colors: ['#fdfbf7', '#e2d9c8'], text: '#2d3748' },
  { name: 'Aether Violet', colors: ['#6D28D9', '#8B5CF6'], text: '#FFFFFF' },
  { name: 'Amber Glow', colors: ['#F59E0B', '#D97706'], text: '#FFFFFF' },
];

const FONTS = ['Poppins', 'Georgia', 'Arial', 'Courier New'];

export default function WallpaperGeneratorPage() {
  return (
    <Suspense fallback={
      <div className="grow flex flex-col items-center justify-center py-40 gap-3">
        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
        <span className="text-xs text-slate-500 font-medium font-sans">Initializing Canvas Layout...</span>
      </div>
    }>
      <WallpaperGeneratorContent />
    </Suspense>
  );
}

function WallpaperGeneratorContent() {
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Quote input state
  const [quoteText, setQuoteText] = useState("Your limitation—it's only your imagination.");
  const [authorText, setAuthorText] = useState("Unknown");

  // Customizer state
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[4]);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [fontSize, setFontSize] = useState(48);
  const [isDownloading, setIsDownloading] = useState(false);

  // Initialize from search query params
  useEffect(() => {
    const q = searchParams.get('quote');
    const a = searchParams.get('author');
    if (q) setQuoteText(q);
    if (a) setAuthorText(a);
  }, [searchParams]);

  // Redraw Canvas whenever parameters change
  useEffect(() => {
    drawCanvas();
  }, [quoteText, authorText, selectedFormat, selectedTheme, selectedFont, fontSize]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = selectedFormat;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, selectedTheme.colors[0]);
    gradient.addColorStop(1, selectedTheme.colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Configure Text Font & Style
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = selectedTheme.text;

    // Scale font size relative to dimensions if needed, but respect font selection
    ctx.font = `italic 600 ${fontSize}px ${selectedFont}`;

    // 3. Wrap quote text within boundaries
    const maxTextWidth = width * 0.8;
    const words = quoteText.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && i > 0) {
        lines.push(currentLine.trim());
        currentLine = words[i] + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());

    // 4. Draw quote lines
    const lineHeight = fontSize * 1.35;
    const totalTextHeight = lines.length * lineHeight;
    let startY = (height - totalTextHeight) / 2 - 20;

    // Draw quote text
    lines.forEach((line) => {
      ctx.fillText(`“${line}”`, width / 2, startY);
      startY += lineHeight;
    });

    // 5. Draw Author profile footer
    ctx.font = `normal 500 ${fontSize * 0.45}px ${selectedFont}`;
    ctx.fillStyle = selectedTheme.text + 'CC'; // Add opacity to author text
    ctx.fillText(`— ${authorText}`, width / 2, startY + 40);

    // 6. Draw branding watermark at bottom
    ctx.font = `normal 600 ${fontSize * 0.3}px Poppins`;
    ctx.fillStyle = selectedTheme.text + '66'; // subtle opacity
    ctx.fillText('TheHalicQuotes', width / 2, height - (height * 0.05));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDownloading(true);
    try {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `TheHalicQuotes-${authorText.replace(/\s+/g, '-')}-${Date.now()}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to export image', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (

    <main className="grow hero-gradient py-12 px-4 w-full text-center">

      <div className='max-w-7xl mx-auto w-full'>

        {/* Header */}
        <section className="mb-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-slate-50 mb-3">
              Quote Poster Generator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Customize typography, sizing, aspect ratio, and gradients to export stunning wallpapers for Instagram, X, LinkedIn, or device displays.
            </p>
          </motion.div>
        </section>

        {/* Customizer Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* 1. Preview Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4 items-center">
            <div className="w-full max-w-[500px] border border-slate-200/50 dark:border-slate-800/40 rounded-2xl overflow-hidden shadow-2xl bg-slate-950/20 backdrop-blur-md p-4">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-2">Live Canvas Preview</span>
              <div className="flex justify-center items-center w-full aspect-square bg-slate-900/10 dark:bg-slate-900/40 rounded-xl overflow-hidden relative border border-slate-200/20">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                />
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full max-w-[500px] bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              disabled={isDownloading}
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Exporting PNG...' : 'Download Poster PNG'}
            </button>
          </div>

          {/* 2. Control Customizer Panel */}
          <div className="lg:col-span-1 glass-card p-6 flex flex-col gap-6 text-left">

            {/* Quote Inputs */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quote Editor</h3>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-semibold">Quote Text</label>
                <textarea
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  rows={3}
                  className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs outline-none focus:border-purple-500 resize-none font-sans"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-semibold">Author</label>
                <input
                  type="text"
                  value={authorText}
                  onChange={(e) => setAuthorText(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900/50 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs outline-none focus:border-purple-500 font-sans"
                />
              </div>
            </div>

            {/* Layout Aspect Ratios */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Poster Dimensions</h3>
              <div className="flex flex-col gap-1">
                {FORMATS.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => {
                      setSelectedFormat(f);
                      // scale initial font size based on height
                      if (f.height > 1500) {
                        setFontSize(72);
                      } else {
                        setFontSize(44);
                      }
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left border flex justify-between items-center transition-colors cursor-pointer ${selectedFormat.name === f.name
                      ? 'border-purple-600 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold'
                      : 'border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                      }`}
                  >
                    <span>{f.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold font-sans">{f.aspect}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Themes */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Color Gradients</h3>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((theme) => {
                  const active = selectedTheme.name === theme.name;
                  return (
                    <button
                      key={theme.name}
                      onClick={() => setSelectedTheme(theme)}
                      className={`h-11 rounded-xl bg-linear-to-br flex items-center justify-center text-white border transition-all ${active
                        ? 'border-purple-600 scale-105 shadow-md shadow-purple-500/20'
                        : 'border-slate-200/40 dark:border-slate-800/40 hover:scale-[1.02]'
                        }`}
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`
                      }}
                      title={theme.name}
                    >
                      {active && <Check className="w-4 h-4 drop-shadow" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Family selection */}
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Font Families</h3>
              <div className="grid grid-cols-2 gap-2">
                {FONTS.map((font) => (
                  <button
                    key={font}
                    onClick={() => setSelectedFont(font)}
                    className={`px-2 py-2 border text-xs rounded-xl transition-all cursor-pointer ${selectedFont === font
                      ? 'border-purple-600 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold'
                      : 'border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                      }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Sizer */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Text Font Size</h3>
                <span className="text-purple-600 font-bold">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="96"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

          </div>
        </section>
      </div>
    </main>


  );
}
