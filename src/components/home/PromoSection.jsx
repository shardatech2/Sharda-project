import React from 'react';
import { Link } from 'react-router-dom';

const PromoSection = () => {
  return (
    <section className="py-24 bg-[#172442] relative overflow-hidden text-white">
      {/* Background Glows & Accent Shapes */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-foundation-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
      
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-[0.04] mix-blend-screen pointer-events-none"
        style={{ backgroundImage: "url('/hero-banner.webp')" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-6">
            <span className="w-2 h-2 rounded-full bg-foundation-secondary"></span>
            <span className="text-xs font-bold text-slate-200 tracking-[0.2em] uppercase">
              Our Continuous Commitment
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
            Extending Care, Knowledge, & Hope Where It Matters Most
          </h2>
          
          <p className="text-base md:text-lg text-slate-300 leading-relaxed font-light">
            At Sharda Welfare Foundation, we believe sustainable progress begins at the grassroots level. Through multi-specialty medical checkups, inclusive education initiatives, and skill-building drives, we work every day to bridge disparities and foster self-reliant communities.
          </p>
        </div>

        {/* 3 Informative Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
          
          {/* Pillar 1 */}
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-foundation-secondary/20 text-pink-300 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-foundation-secondary/30 transition-all duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Accessible Healthcare</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Conducting comprehensive health camps with pediatricians, ophthalmologists, and dentists to ensure timely screenings, eye tests, and essential medicines for all.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Inclusive Education</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Supporting rural schools and underprivileged students with quality learning kits, sanitation awareness, and nutritional guidance to build healthy futures.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Community Partnerships</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Collaborating with institutional partners, dedicated doctors, educators, and ground volunteers to maximize direct impact across every targeted initiative.
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/what-we-do" 
            className="w-full sm:w-auto px-8 py-4 bg-foundation-secondary hover:bg-pink-600 text-white font-bold rounded-full shadow-[0_8px_30px_rgba(233,84,124,0.4)] hover:shadow-[0_12px_40px_rgba(233,84,124,0.6)] transition-all duration-300 transform hover:-translate-y-1 text-center text-sm"
          >
            Explore What We Do
          </Link>
          <Link 
            to="/latest-updates" 
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-foundation-primary font-bold rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300 text-center text-sm"
          >
            Read Latest Updates
          </Link>
          <Link 
            to="/contact" 
            className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-slate-300 hover:text-white font-semibold rounded-full border border-white/15 transition-all duration-300 text-center text-sm"
          >
            Volunteer With Us
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PromoSection;
