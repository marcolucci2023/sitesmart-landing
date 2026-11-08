/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  // Paddle Initialization
  useEffect(() => {
    try {
      const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
      if (window.Paddle && token && typeof token === 'string' && token.trim().length > 0) {
        // If the token starts with "test_", enable sandbox mode, otherwise production
        const isSandbox = token.startsWith('test_');
        if (isSandbox) {
          window.Paddle.Environment.set('sandbox');
        }

        window.Paddle.Initialize({
          token: token,
        });
      }
    } catch (err) {
      console.warn('[SiteSmart] Paddle initialization skipped or deferred:', err);
    }
  }, []);

  // Paddle Checkout Handler
  const handleSubscribe = (priceId?: string) => {
    try {
      const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
      if (window.Paddle && token && priceId && typeof priceId === 'string' && priceId.trim().length > 0) {
        window.Paddle.Checkout.open({
          items: [{ priceId: priceId, quantity: 1 }],
        });
        return;
      }
    } catch (err) {
      console.warn('[SiteSmart] Paddle checkout open error:', err);
    }
    // Graceful fallback if Paddle token or priceId is not yet configured
    const msg = encodeURIComponent("Hi SiteSmart, I want to start my 7-day free trial!");
    window.open(`https://wa.me/971XXXXXXXX?text=${msg}`, '_blank');
  };

  // State
  const [activeChatTab, setActiveChatTab] = useState<'whatsapp' | 'telegram'>('whatsapp');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<{ src: string; title: string } | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlayable = () => setVideoLoaded(true);
    video.addEventListener('loadeddata', onPlayable);
    video.addEventListener('canplay', onPlayable);
    video.addEventListener('play', onPlayable);
    return () => {
      video.removeEventListener('loadeddata', onPlayable);
      video.removeEventListener('canplay', onPlayable);
      video.removeEventListener('play', onPlayable);
    };
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="bg-[#07090E] text-slate-100 min-h-screen selection:bg-blue-600 selection:text-white antialiased font-sans">
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#07090E]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-8 h-8 rounded-md bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition-colors">
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"></path>
                <path d="M5 21V7l7-4 7 4v14"></path>
                <path d="M9 10h6"></path>
                <path d="M9 14h6"></path>
                <path d="M9 18h6"></path>
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              SiteSmart
              <span className="text-[11px] font-mono text-slate-400 font-normal">UAE</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#product-tour" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>Live Screenshots
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#demo-video" className="hover:text-white transition-colors">Video</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleSubscribe(import.meta.env.VITE_PADDLE_PRICE_PRO)}
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-[#07090E] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#25D366] cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/>
              </svg>
              <span>Start Free Trial</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="text-slate-400 hover:text-white p-2 rounded focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/[0.08] bg-[#0E131F] px-4 pt-3 pb-5 space-y-2">
            <a href="#product-tour" onClick={() => setMobileMenuOpen(false)} className="block text-emerald-400 hover:text-emerald-300 text-sm font-semibold py-2">📸 Live Screenshots</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-sm font-medium py-2">How it works</a>
            <a href="#demo-video" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-sm font-medium py-2">Product Video</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-sm font-medium py-2">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-sm font-medium py-2">FAQ</a>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSubscribe(import.meta.env.VITE_PADDLE_PRICE_PRO);
                }}
                className="flex items-center justify-center gap-2 w-full text-center bg-[#25D366] hover:bg-[#20bd5a] text-[#07090E] text-xs font-bold uppercase tracking-wider py-2.5 rounded-md transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/>
                </svg>
                <span>Start Free Trial</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-14 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        {/* Subtle Radial Illumination */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.06] rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Platform Badges & Trust Label */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.09] text-xs font-medium text-slate-300 mb-6 shadow-sm">
            <span className="flex items-center gap-1.5 font-semibold text-[#25D366]">
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/>
              </svg>
              WhatsApp
            </span>
            <span className="text-slate-600 font-normal">&</span>
            <span className="flex items-center gap-1.5 font-semibold text-[#229ED9]">
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              Telegram
            </span>
            <span className="text-slate-500 font-normal">|</span>
            <span className="text-slate-300">Engineered for MEP & Fit-Out Subcontractors in Dubai</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.14] mb-6 max-w-4xl mx-auto" style={{ textWrap: 'balance' }}>
            Your construction site talks.<br className="hidden sm:inline" /> You just don't listen.
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-9 font-normal">
            SiteSmart reads every message in your site WhatsApp group, catches emergencies instantly, and sends you a clean daily summary at 6 PM. No app to install. No training needed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-2">
            <button
              onClick={() => handleSubscribe(import.meta.env.VITE_PADDLE_PRICE_PRO)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-[#07090E] font-bold text-sm px-7 py-3.5 rounded-md shadow-lg shadow-emerald-950/40 transition-all focus:outline-none cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/>
              </svg>
              <span>Start 7-Day Free Trial</span>
            </button>
            <a
              href="https://t.me/SiteSmartBot"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white font-medium text-sm px-6 py-3.5 rounded-md transition-all"
            >
              <svg className="w-4 h-4 fill-current text-[#229ED9] shrink-0" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              <span>Or Connect on Telegram</span>
            </a>
            <a href="#product-tour" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-400 hover:text-white font-medium text-xs px-4 py-3.5 transition-colors">
              <span>See Live Screenshots ↓</span>
            </a>
          </div>

          {/* Block A: Under Hero CTA */}
          <p className="mt-2 mb-14 text-xs text-slate-400">
            ⚡ Setup takes 30 seconds. Opens direct WhatsApp chat with setup team. No credit card required.
          </p>

          {/* PRODUCT VIDEO PLAYER (Target: presentation.mp4) */}
          <div id="demo-video" className="max-w-3xl mx-auto text-left">
            <div className="relative rounded-2xl p-2.5 bg-[#0C101A] border border-white/10 shadow-2xl">
              {/* Video Chrome Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#0E1422] border-b border-white/[0.08] rounded-t-xl text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="font-mono font-semibold text-white tracking-wide">SiteSmart Product Overview</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-blue-400 font-medium">presentation.mp4</span>
                </div>
              </div>

              {/* Video Container */}
              <div className="relative rounded-b-xl bg-[#080B11] border-x border-b border-white/[0.08] overflow-hidden aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover z-10"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src="/presentation.mp4" type="video/mp4" />
                  <source src="presentation.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Waiting State */}
                {!videoLoaded && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-[#090C14] pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-xl mb-3 shadow-lg">
                      <svg className="w-6 h-6 stroke-current ml-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-white mb-1 font-mono">presentation.mp4</div>
                    <p className="text-xs text-slate-300 max-w-sm leading-relaxed mb-3">
                      Place your video file named <strong className="text-blue-400 font-mono">presentation.mp4</strong> in the public folder.
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                      Ready to stream presentation.mp4
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3 font-mono">
              Target video: <span className="text-blue-400 font-semibold">presentation.mp4</span> (HTML5 video player with native controls).
            </p>
          </div>
        </div>
      </section>

      {/* 3. PROOF BANNER */}
      <section className="py-6 bg-[#0B0F19] border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-around gap-5 text-xs sm:text-sm font-medium text-slate-300 text-center">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-mono font-bold">✓</span>
              <span><strong>0 Apps</strong> to install</span>
            </div>
            <div className="hidden sm:block text-slate-600">·</div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#25D366]/20 text-[#25D366]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/>
                </svg>
              </span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#229ED9]/20 text-[#229ED9]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </span>
              <span><strong>100% Native WhatsApp & Telegram</strong></span>
            </div>
            <div className="hidden sm:block text-slate-600">·</div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-mono font-bold">✓</span>
              <span><strong>Multi-language</strong> (Arabic, Hindi, English, Urdu, Tagalog)</span>
            </div>
            <div className="hidden sm:block text-slate-600">·</div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-mono font-bold">✓</span>
              <span><strong>0 team training</strong> required</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROBLEM SECTION */}
      <section className="py-24 bg-[#06080E] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="text-xs uppercase font-mono font-semibold tracking-wider text-blue-400 mb-2">Operational Bottlenecks</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Problem You Already Know
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Running 2 to 5 concurrent sites in the UAE creates an unmanageable stream of informal group chatter. Critical operational data vanishes in the thread.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0B0F19] border border-white/10 rounded-xl p-7 flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 flex items-center justify-center mb-6">
                  <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                  </svg>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight font-mono mb-2">150+</div>
                <h3 className="text-base font-bold text-white mb-2">messages/day in your site group</h3>
                <p className="text-sm font-semibold text-blue-400 mb-3">You can't read them all</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Site engineers, material suppliers, and foremen publish hundreds of notes, voice clips, and invoices daily. Vital issues are diluted in irrelevant chatter.
                </p>
              </div>
            </div>

            <div className="bg-[#0B0F19] border border-white/10 rounded-xl p-7 flex flex-col justify-between hover:border-red-500/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-6">
                  <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                  </svg>
                </div>
                <div className="text-3xl font-extrabold text-red-400 tracking-tight font-mono mb-2">7 Hours</div>
                <h3 className="text-base font-bold text-white mb-2">Critical alerts buried in noise</h3>
                <p className="text-sm font-semibold text-red-400 mb-3">Water leak reported at 2 PM, you see it at 9 PM</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  By the time you open the app after customer meetings, water has soaked electrical distribution boards or civil defense violations have accrued fines.
                </p>
              </div>
            </div>

            <div className="bg-[#0B0F19] border border-white/10 rounded-xl p-7 flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 flex items-center justify-center mb-6">
                  <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight font-mono mb-2">45 Min</div>
                <h3 className="text-base font-bold text-white mb-2">No daily overview</h3>
                <p className="text-sm font-semibold text-blue-400 mb-3">You call the site engineer every evening asking 'what happened today?'</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Foremen forget procurement slips, subbie delays remain unexplained, and you finish each workday without a clear written status of project milestones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-[#080B11]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="text-xs uppercase font-mono font-semibold tracking-wider text-blue-400 mb-2">Deployment Flow</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How It Works
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Zero behavioral adjustments required from your workforce. Complete visibility configured in under one minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#0E131F] border border-white/10 rounded-xl p-7 relative">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-semibold text-blue-400 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">01</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/></svg>
                  </span>
                  <span className="w-6 h-6 rounded bg-[#229ED9]/20 border border-[#229ED9]/40 flex items-center justify-center text-[#229ED9]">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Add the bot to your group</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Takes 30 seconds. No app, no login for your team. Simply invite the verified SiteSmart number to your existing WhatsApp or Telegram group chat.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0E131F] border border-white/10 rounded-xl p-7 relative">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-semibold text-blue-400 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">02</span>
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">It reads and understands</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                AI reads every message in English, Arabic, Hindi, Urdu, Tagalog. Detects problems, deliveries, expenses, progress autonomously in real time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0E131F] border border-white/10 rounded-xl p-7 relative">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-semibold text-blue-400 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">03</span>
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">You get alerts + daily summary</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Urgent issues = instant DM to you. Every day at 6 PM = clean summary on your phone. Formatted with executive clarity before you leave site.
              </p>
            </div>
          </div>

          {/* Test Callout Box */}
          <div className="mt-14 max-w-3xl mx-auto rounded-xl bg-gradient-to-r from-blue-950/40 via-[#0F172A] to-blue-950/20 border border-blue-500/30 p-6 sm:p-7 text-left shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/></svg>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span>Want to test before connecting your real site?</span>
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Create a private 2-minute test group on WhatsApp, invite the bot, and send fake messages, voice notes, or delivery receipts to see how instant alerts and the 6 PM summary work in real time.
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/971XXXXXXXX?text=Hi%20SiteSmart,%20I%20want%20to%20test%20in%20a%20sandbox%20group"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-[#07090E] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <span>Test on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REAL-WORLD DEMONSTRATION (Live WhatsApp Screenshots) */}
      <section id="product-tour" className="py-24 bg-[#070A10] border-t border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[160px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-xs font-mono font-semibold text-[#25D366] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              <span>Real-World Proof · Captured from Dubai Site Chat</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
              From WhatsApp Group Chaos to Instant Executive Clarity
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              See the exact 3-step transformation captured live on a Dubai MEP project. Your workers change nothing, but you get total control in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 items-stretch">
            {/* Card 1 */}
            <div className="flex flex-col justify-between bg-[#0B0F19] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-red-500/40 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono font-bold text-red-400 px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20">
                    STEP 01 · SITE REALITY
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Without SiteSmart</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                  The Noisy Group Chat
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  Managing construction sites in Dubai means scrolling through hundreds of WhatsApp audio notes, photos, and messy chats every single day. Things get lost, money gets wasted.
                </p>
              </div>

              <div
                onClick={() => setSelectedScreenshot({ src: '/assets/aistudio/whatsapp_group_chat__1__e064b713.png', title: 'Step 1: The Noisy Site Group Chat' })}
                className="relative mx-auto w-full max-w-[280px] sm:max-w-[300px] rounded-[34px] p-2 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 border border-white/10 shadow-2xl overflow-hidden cursor-zoom-in"
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-end pr-2 pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60"></div>
                </div>
                <div className="rounded-[26px] overflow-hidden bg-black aspect-[9/19.5] relative">
                  <img
                    src="/assets/aistudio/whatsapp_group_chat__1__e064b713.png"
                    alt="Dubai MEP site WhatsApp group chat"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/20 flex items-center gap-1">
                    <span>🔍 Click to expand</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">📸 150+ messy cables</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">🎙️ Audio notes</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col justify-between bg-[#0E1524] border border-[#25D366]/40 rounded-2xl p-6 sm:p-7 hover:border-[#25D366]/70 transition-all duration-300 group shadow-lg shadow-emerald-950/20 relative">
              <div className="absolute -top-3 left-7">
                <span className="bg-[#25D366] text-[#07090E] text-[10px] uppercase font-mono tracking-widest font-extrabold px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                  100% SILENT IN GROUP
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 mt-1">
                  <span className="text-xs font-mono font-bold text-[#25D366] px-2.5 py-1 rounded bg-[#25D366]/10 border border-[#25D366]/30">
                    STEP 02 · REAL-TIME EXTRACTION
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">Direct Private DM</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  Private Alerts: Inspection & Material
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  Meet SiteSmart. It sits silently in your group chat and extracts critical events in real-time. Inspection expected today? Material shortage? You get a direct, private alert in your DM. Your workers change nothing, but you stay in total control.
                </p>
              </div>

              <div
                onClick={() => setSelectedScreenshot({ src: '/assets/aistudio/whatsapp_chat__2__b6cf1bca.png', title: 'Step 2: Real-time private alert on inspection & material shortages' })}
                className="relative mx-auto w-full max-w-[280px] sm:max-w-[300px] rounded-[34px] p-2 bg-gradient-to-b from-emerald-600/40 via-slate-800 to-slate-950 border border-[#25D366]/40 shadow-2xl overflow-hidden cursor-zoom-in"
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-end pr-2 pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="rounded-[26px] overflow-hidden bg-black aspect-[9/19.5] relative">
                  <img
                    src="/assets/aistudio/whatsapp_chat__2__b6cf1bca.png"
                    alt="SiteSmart Private Alert"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span>🔍 Click to expand</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap gap-2 text-[11px] font-mono text-emerald-400">
                <span className="px-2 py-0.5 rounded bg-[#25D366]/10 border border-[#25D366]/20">⚠️ Inspection detected</span>
                <span className="px-2 py-0.5 rounded bg-[#25D366]/10 border border-[#25D366]/20">📦 50m wire flagged</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col justify-between bg-[#0B0F19] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-blue-500/40 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono font-bold text-blue-400 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                    STEP 03 · SITE MEMORY Q&A
                  </span>
                  <span className="text-[11px] font-mono text-blue-400">1.2s Response</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  Interactive Site Memory
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  Need instant answers? Just ask your bot in private. Petty cash spending this week? Pending deliveries? SiteSmart analyzes hundreds of messages and answers in 1 second with exact numbers.
                </p>
              </div>

              <div
                onClick={() => setSelectedScreenshot({ src: '/assets/aistudio/whatsapp_chat__3__f0aebf8e.png', title: 'Step 3: Interactive Site Memory answering petty cash and deliveries in 1.2s' })}
                className="relative mx-auto w-full max-w-[280px] sm:max-w-[300px] rounded-[34px] p-2 bg-gradient-to-b from-blue-700/40 via-slate-800 to-slate-950 border border-blue-500/30 shadow-2xl overflow-hidden cursor-zoom-in"
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-end pr-2 pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
                <div className="rounded-[26px] overflow-hidden bg-black aspect-[9/19.5] relative">
                  <img
                    src="/assets/aistudio/whatsapp_chat__3__f0aebf8e.png"
                    alt="SiteSmart interactive Q&A"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono text-blue-300 border border-blue-500/30 flex items-center gap-1">
                    <span>🔍 Click to expand</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">💰 385 AED petty cash parsed</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">⚡ 142 msgs scanned</span>
              </div>
            </div>
          </div>

          <div className="mt-14 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-2"><span className="text-[#25D366]">✓</span> Works in your existing WhatsApp group</span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="flex items-center gap-2"><span className="text-blue-400">✓</span> No app to download for your workers</span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 100% Silent in group chat</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5. DEMO SECTION: What You'll Receive Every Evening */}
      <section className="py-20 bg-[#06080E] border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-medium text-blue-400 mb-3">
              <span>⚡ Automated Daily Dispatch at 18:00 GST</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              What You'll Receive Every Evening
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Delivered straight to your personal WhatsApp or Telegram DM. Clean, formatted intelligence with zero noise.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Platform Tabs */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => setActiveChatTab('whatsapp')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeChatTab === 'whatsapp'
                    ? 'bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366]'
                    : 'bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white'
                }`}
              >
                <span>WhatsApp Preview</span>
              </button>
              <button
                onClick={() => setActiveChatTab('telegram')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeChatTab === 'telegram'
                    ? 'bg-[#229ED9]/20 border border-[#229ED9]/50 text-[#229ED9]'
                    : 'bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white'
                }`}
              >
                <span>Telegram Preview</span>
              </button>
            </div>

            {/* Phone Screen Container */}
            <div
              className={`rounded-2xl border border-white/[0.12] shadow-2xl overflow-hidden transition-all ${
                activeChatTab === 'whatsapp' ? 'bg-[#0B141A]' : 'bg-[#17212B]'
              }`}
            >
              {/* App Bar Header */}
              <div
                className={`flex items-center justify-between px-4 py-3 border-b border-white/[0.08] ${
                  activeChatTab === 'whatsapp' ? 'bg-[#1F2C34]' : 'bg-[#1E2C3A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold text-xs">
                    SS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white tracking-tight">
                        {activeChatTab === 'whatsapp' ? 'SiteSmart Private Bot' : '@SiteSmart_Daily_Bot'}
                      </span>
                      <span className="text-[#25D366] text-xs">✓</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                      <span>Direct DM · 100% Confidential</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1 ${
                      activeChatTab === 'whatsapp'
                        ? 'bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366]'
                        : 'bg-[#229ED9]/20 border border-[#229ED9]/40 text-[#229ED9]'
                    }`}
                  >
                    {activeChatTab === 'whatsapp' ? 'WhatsApp DM' : 'Telegram Bot'}
                  </span>
                </div>
              </div>

              {/* Message Area */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex justify-center">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08]">
                    Today · 18:00 GST
                  </span>
                </div>

                <div className="max-w-xl mx-auto rounded-xl p-5 bg-[#1F2C34] border border-white/[0.1] text-slate-200 text-xs sm:text-sm font-sans shadow-lg leading-relaxed relative">
                  <div className="font-mono text-sm font-bold text-white mb-2.5 pb-2 border-b border-white/[0.08] flex items-center justify-between">
                    <span>📊 Overview — 02/11/2026 — 18 messages</span>
                    <span className="text-[11px] text-blue-400 font-normal">Tower B · Dubai Marina</span>
                  </div>

                  <div className="space-y-2.5 font-normal">
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 text-base">🚨</span>
                      <div>
                        <strong className="text-red-400 font-semibold">Problems:</strong> Water leak in DB room touching main panel. Foremen shut valve at 14:15.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 text-base">📦</span>
                      <div>
                        <strong className="text-amber-300 font-semibold">Deliveries:</strong> 50m cable 4mm delivered to Floor 3 (received by Eng. Rashid).
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 text-base">💰</span>
                      <div>
                        <strong className="text-emerald-400 font-semibold">Expenses:</strong> 785 AED total (3 cash receipts scanned via OCR from foremen).
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 text-base">🔧</span>
                      <div>
                        <strong className="text-blue-400 font-semibold">Progress:</strong> Ducting on Floor 2 completed (85%). Pressure test cleared.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 text-base">⚠️</span>
                      <div>
                        <strong className="text-orange-400 font-semibold">Next Day Risks:</strong> MEP inspection scheduled at 10 AM, need civil defense clearance on site.
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Automated AI synthesis</span>
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                      <span>18:00</span>
                      <span className="text-[#25D366]">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Bar */}
              <div className="px-5 py-3.5 bg-[#121B22] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <span>Configured to your project's specific timezone (GST)</span>
                </span>
                <a
                  href="https://wa.me/971XXXXXXXX?text=Hi%20SiteSmart,%20send%20me%20a%20sample%20report"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline"
                >
                  <span>Receive a live sample on WhatsApp →</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES GRID */}
      <section className="py-24 bg-[#080B11] border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="text-xs uppercase font-mono font-semibold tracking-wider text-blue-400 mb-2">Core Capabilities</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Features Built for Subcontractors
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Practical automation engineered specifically for the MEP and interior fit-out industry in the United Arab Emirates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Block B: 100% Silent */}
            <div className="bg-[#0E1524] border border-blue-500/40 p-7 rounded-xl hover:border-blue-400/60 transition-colors shadow-md">
              <div className="w-10 h-10 rounded-md bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-5 text-xl">
                🤫
              </div>
              <h3 className="text-base font-bold text-white mb-2">100% Silent in Group</h3>
              <p className="font-normal text-slate-300 text-sm leading-relaxed">
                The bot listens silently. It NEVER posts or interrupts your site group chat. Only sends private DMs to project directors.
              </p>
            </div>

            {/* 1. Multi-language */}
            <div className="bg-[#0E131F] border border-white/10 p-7 rounded-xl hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Multi-language</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                English, Arabic, Hindi, Urdu, Tagalog, Malayalam. Intelligently processes multilingual group dynamics, shorthand, and vernacular site voice transcriptions.
              </p>
            </div>

            {/* 2. Real-time emergency alerts */}
            <div className="bg-[#0E131F] border border-white/10 p-7 rounded-xl hover:border-red-500/30 transition-colors">
              <div className="w-10 h-10 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="M12 8v4"></path>
                  <path d="M12 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Real-time emergency alerts</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Catches fire, injury, structural risks, and DEWA violations. Dispatches an urgent private notification to owners and project directors within seconds.
              </p>
            </div>

            {/* 3. Expense tracking */}
            <div className="bg-[#0E131F] border border-white/10 p-7 rounded-xl hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                  <circle cx="7" cy="15" r="1"></circle>
                  <circle cx="12" cy="15" r="1"></circle>
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Expense tracking & OCR</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automatic from messages and photos. Scans paper delivery notes and invoices, parsing amounts in AED with supplier breakdown.
              </p>
            </div>

            {/* 4. Daily summary 6PM */}
            <div className="bg-[#0E131F] border border-white/10 p-7 rounded-xl hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Daily summary at 6 PM Dubai time</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Structured synopsis scheduled promptly at 18:00 GST. Immediate visibility over completions, roadblocks, and next-day logistics.
              </p>
            </div>

            {/* 5. No behavior change */}
            <div className="bg-[#0E131F] border border-white/10 p-7 rounded-xl hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <polyline points="16 11 18 13 22 9"></polyline>
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-2">No behavior change</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Works directly within your existing groups. Foremen and engineers continue communicating normally on WhatsApp or Telegram with zero onboarding friction.
              </p>
            </div>

            {/* 6. Telegram + WhatsApp */}
            <div className="bg-[#0E131F] border border-white/10 p-7 rounded-xl hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-md bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 rounded-md bg-[#229ED9]/20 border border-[#229ED9]/40 text-[#229ED9] flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Telegram + WhatsApp support</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dual-platform integration for the primary messaging services across Gulf contracting networks. Real-time webhook architecture with zero lag.
              </p>
            </div>

            {/* Feature 7: 07:30 AM Morning Briefing */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors">
              <div className="text-3xl mb-3">☀️</div>
              <h3 className="text-lg font-bold text-white mb-2">07:30 AM Morning Briefing</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Start your workday with an executive checklist delivered to your phone: today's priorities, expected material deliveries, and open risks before you arrive on site.
              </p>
            </div>

            {/* Feature 8: Interactive Site Memory */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="text-lg font-bold text-white mb-2">Interactive Site Memory</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ask the bot anything in private DM: <em>"What is delaying the painting?", "Who ordered the cables?", "Show electrical issues"</em> — Get instant answers backed by real site logs and dates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING WITH PADDLE CHECKOUT INTEGRATION */}
      <section id="pricing" className="py-24 bg-[#06080E] border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="text-xs uppercase font-mono font-semibold tracking-wider text-blue-400 mb-2">Transparent Subscription</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Plans for Growing Subcontractors
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              All plans include a 7-day free trial, no credit card required. Cancel anytime without commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Starter Tier */}
            <div className="bg-[#0B0F19] border border-white/10 rounded-xl p-7 flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Starter</h3>
                  <span className="text-xs font-mono text-slate-400">Single project</span>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-white font-mono">99 AED</span>
                  <span className="text-slate-400 text-xs"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8 border-t border-white/[0.06] pt-6 font-normal">
                  <li className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#229ED9]/20 text-[#229ED9] shrink-0">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                    </span>
                    <span className="font-semibold text-white">Telegram</span> integration
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs">✓</span> 1 group
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs">✓</span> Daily summary + alerts
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs">✓</span> Multilingual AI parser
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] text-center text-slate-400 mb-3 font-mono">7-day free trial, no credit card required</div>
                <button
                  onClick={() => handleSubscribe(import.meta.env.VITE_PADDLE_PRICE_STARTER)}
                  className="w-full inline-flex items-center justify-center gap-2 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold uppercase tracking-wider py-3 px-4 rounded-md transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-[#229ED9]" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                  <span>Start Free Trial</span>
                </button>
                <p className="mt-2 text-[11px] text-slate-400 text-center leading-normal">
                  ⚡ Setup takes 30 seconds. Opens direct Telegram chat with setup team. No credit card required.
                </p>
              </div>
            </div>

            {/* Pro Tier (MOST POPULAR) */}
            <div className="bg-[#0E1422] border border-blue-500/60 rounded-xl p-7 flex flex-col justify-between relative shadow-lg shadow-blue-900/10">
              <div className="absolute -top-3 left-7">
                <span className="bg-blue-600 text-white text-[10px] uppercase font-mono tracking-widest font-bold px-2.5 py-0.5 rounded shadow-sm">
                  MOST POPULAR
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4 mt-1">
                  <h3 className="text-lg font-bold text-white">Pro</h3>
                  <span className="text-xs font-mono text-blue-400">2-5 projects</span>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-white font-mono">199 AED</span>
                  <span className="text-slate-400 text-xs"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-200 mb-8 border-t border-white/[0.08] pt-6 font-normal">
                  <li className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#229ED9]/20 text-[#229ED9] shrink-0">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                    </span>
                    <span className="font-semibold text-white">Telegram</span> full access
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs">✓</span> 3 groups
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs">✓</span> Priority alerts
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs">✓</span> Weekly reports
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs">✓</span> Daily summaries at 6 PM
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] text-center text-slate-400 mb-3 font-mono">7-day free trial, no credit card required</div>
                <button
                  onClick={() => handleSubscribe(import.meta.env.VITE_PADDLE_PRICE_PRO)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider py-3 px-4 rounded-md shadow-sm transition-all focus:outline-none cursor-pointer"
                >
                  <span>Start 7-Day Free Trial</span>
                </button>
                <p className="mt-2 text-[11px] text-slate-400 text-center leading-normal">
                  ⚡ Setup takes 30 seconds. Opens direct WhatsApp chat with setup team. No credit card required.
                </p>
              </div>
            </div>

            {/* Business Tier */}
            <div className="bg-[#0E1524] border border-[#25D366]/50 rounded-xl p-7 flex flex-col justify-between hover:border-[#25D366] transition-colors relative shadow-lg shadow-emerald-950/20">
              <div className="absolute -top-3 left-7">
                <span className="bg-[#25D366] text-[#07090E] text-[10px] uppercase font-mono tracking-widest font-extrabold px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/></svg>
                  WHATSAPP NATIVE
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4 mt-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Business</span>
                  </h3>
                  <span className="text-xs font-mono text-[#25D366] font-semibold">Official WhatsApp</span>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-white font-mono">299 AED</span>
                  <span className="text-slate-400 text-xs"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8 border-t border-white/[0.06] pt-6 font-normal">
                  <li className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#25D366]/20 text-[#25D366] shrink-0">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/></svg>
                    </span>
                    <span className="font-bold text-[#25D366]">100% Native WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs">✓</span> 3 groups
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs">✓</span> All features & OCR receipt scanning
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-blue-400 font-mono text-xs">✓</span> Dedicated WhatsApp support manager
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] text-center text-slate-400 mb-3 font-mono">7-day free trial, no credit card required</div>
                <button
                  onClick={() => handleSubscribe(import.meta.env.VITE_PADDLE_PRICE_BUSINESS)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-[#07090E] text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-md shadow-lg shadow-emerald-950/30 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/></svg>
                  <span>Start Free Trial on WhatsApp</span>
                </button>
                <p className="mt-2 text-[11px] text-slate-400 text-center leading-normal">
                  ⚡ Setup takes 30 seconds. Opens direct WhatsApp chat with setup team. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="py-24 bg-[#080B11]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <div className="text-xs uppercase font-mono font-semibold tracking-wider text-blue-400 mb-2">Technical & Operational Inquiries</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Does my team need to install anything?",
                a: "No. You simply add the SiteSmart number to your existing WhatsApp group chat. Your team communicates exactly as they do today."
              },
              {
                q: "Will the bot post messages in our group?",
                a: "Never. SiteSmart operates 100% silently. It only dispatches private DMs to business owners and authorized managers."
              },
              {
                q: "What languages does it process?",
                a: "English, Arabic, Hindi, Urdu, Tagalog, and Malayalam — including voice notes and photos of handwritten delivery notes."
              },
              {
                q: "Is my site financial data and invoice data secure?",
                a: "Yes. All data is encrypted in transit and at rest. We never share site data or train external AI models on your private messages."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#0E131F] border border-white/10 rounded-lg overflow-hidden transition-colors">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <span>{item.q}</span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-45' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-slate-300 leading-relaxed border-t border-white/[0.05] pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-20 sm:py-24 bg-[#06080E] border-t border-white/[0.06] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" style={{ textWrap: 'balance' }}>
            Stop missing what matters on your site.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Operational control delivered to your phone every evening at 18:00 GST.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-2">
            <button
              onClick={() => handleSubscribe(import.meta.env.VITE_PADDLE_PRICE_PRO)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-[#07090E] font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-md shadow-lg shadow-emerald-950/40 transition-all focus:outline-none cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.002.597 1.777.853 2.806.853 3.182 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.77zm3.39 8.175c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.12-.516-1.748-.724-2.88-2.502-2.966-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1 1.224zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.957-1.39A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.63 0-3.15-.494-4.42-1.341l-.317-.212-3.125.877.834-3.042-.207-.329A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z"/></svg>
              <span>Start 7-Day Free Trial</span>
            </button>
            <a
              href="https://t.me/SiteSmartBot"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white font-medium text-sm px-6 py-4 rounded-md transition-all"
            >
              <svg className="w-4 h-4 fill-current text-[#229ED9] shrink-0" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
              <span>Or Connect on Telegram</span>
            </a>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            ⚡ Setup takes 30 seconds. Opens direct WhatsApp chat with setup team. No credit card required.
          </p>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-[#05060A] border-t border-white/[0.06] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white tracking-tight">SiteSmart</span>
              </div>
              <p className="text-xs text-slate-400">Built for UAE construction teams</p>
            </div>

            <div className="text-xs text-slate-300 font-mono">
              <span className="text-slate-400">Contact: </span>
              <a href="mailto:hello@sitesmart.ai" className="text-slate-300 hover:text-white transition-colors underline underline-offset-4">hello@sitesmart.ai</a>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              © 2026 SiteSmart. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Screenshot Lightbox Modal */}
      {selectedScreenshot && (
        <div
          onClick={() => setSelectedScreenshot(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm sm:max-w-md w-full max-h-[92vh] flex flex-col items-center cursor-default"
          >
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute -top-12 right-0 sm:-right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all focus:outline-none cursor-pointer"
              aria-label="Close Preview"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-xs font-mono font-semibold text-emerald-400 mb-3 px-3 py-1 rounded bg-black/60 border border-white/10 text-center">
              {selectedScreenshot.title}
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl max-h-[80vh] overflow-y-auto">
              <img
                src={selectedScreenshot.src}
                alt={selectedScreenshot.title}
                className="w-full h-auto max-h-[78vh] object-contain block bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
