import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative w-full min-h-[90vh] py-20 lg:py-0 flex items-center justify-center overflow-hidden">
      
      {/* Dynamic Animated Gradient Background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-foundation-primary via-[#213562] to-[#3a204e] animate-gradient-bg">
        {/* Soft overlay gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111a30] via-transparent to-transparent opacity-80"></div>
      </div>

      {/* Hero Banner Image Layer (Very Light Visibility) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-5 mix-blend-screen"
        style={{ backgroundImage: "url('/hero-banner.webp')" }}
      ></div>

      {/* Abstract Glow Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-foundation-secondary/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Hero Content - Split Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 mt-12 lg:mt-0">
        
        {/* Left Column - Text */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="inline-flex items-center py-1.5 px-4 rounded-full bg-white/10 text-white text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-8 border border-white/20 backdrop-blur-sm shadow-xl">
            Welcome to Sharda Welfare Foundation
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.15] drop-shadow-2xl">
            Building a <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200 filter drop-shadow-sm">Healthier</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-200 filter drop-shadow-sm">Brighter</span> Tomorrow
          </h1>
          
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl leading-relaxed font-medium drop-shadow-md">
            Extending healthcare awareness and essential support to communities who need it most. Join us in making a lasting impact.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link to="/about" className="inline-flex justify-center items-center text-center w-full sm:w-auto px-8 py-4 bg-foundation-secondary hover:bg-pink-600 text-white font-semibold rounded-full shadow-[0_0_20px_rgba(233,84,124,0.4)] hover:shadow-[0_0_30px_rgba(233,84,124,0.6)] transition-all duration-300 transform hover:-translate-y-1">
              Discover Our Impact
            </Link>
            <Link to="/contact" className="inline-flex justify-center items-center text-center w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-foundation-primary font-semibold rounded-full border border-white/30 backdrop-blur-sm transition-all duration-300">
              Get Involved
            </Link>
          </div>
        </div>

        {/* Right Column - Video */}
        <div className="w-full lg:w-1/2 relative mt-10 lg:mt-0">
          {/* UI Elements Behind Video */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-foundation-secondary to-blue-500 rounded-[2rem] blur-2xl opacity-40 animate-pulse"></div>
          <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-yellow-400 rounded-full mix-blend-screen filter blur-[40px] opacity-60"></div>
          
          {/* Video Container */}
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-video bg-slate-900 border border-white/20 backdrop-blur-sm transform transition-transform duration-500 hover:scale-[1.02]">
            <iframe 
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/EP6doeiLBYQ?controls=0&rel=0&modestbranding=1" 
              title="Sharda Welfare Foundation" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen>
            </iframe>
          </div>
          
          {/* Floating decorative elements around video */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxjaXJjbGUgY3g9IjMiIGN5PSIzIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNCkiLz48L3N2Zz4=')] opacity-50 z-20"></div>
        </div>

      </div>

      {/* Modern Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-10 hidden lg:flex">
        <span className="text-white/60 text-[10px] font-bold tracking-[0.25em] uppercase mb-2">Scroll</span>
        <div className="w-5 h-8 border-[1.5px] border-white/40 rounded-full flex justify-center p-1">
          <div className="w-1 h-1.5 bg-white rounded-full mt-0.5 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
