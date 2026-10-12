import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { updatesData } from "../data/updatesData";
import SEO from "../components/SEO";

function UpdateDetail() {
  const location = useLocation();
  const id = location.pathname.replace("/latest-updates/", "");
  const update = updatesData.find((item) => item.id === id);

  if (!update) {
    return <Navigate to="/latest-updates" />;
  }

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      <SEO
        title={update.title}
        description={update.shortDesc}
        ogImage={update.image}
        ogType="article"
        breadcrumb={[
          { label: "Home", link: "/" },
          { label: "Latest Updates", link: "/latest-updates" },
          { label: update.title }
        ]}
      />

      {/* =========================
          INTRO SECTION
      ========================= */}
      <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
            SHARDA WELFARE • LATEST UPDATES
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-10 leading-tight">
            {update.title}
          </h1>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-foundation-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-foundation-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
      </section>

      {/* =========================
          MAIN IMAGE
      ========================= */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
           <div className="w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl relative">
              <img src={update.image} alt={update.title} className="w-full h-full object-cover" />
           </div>
        </div>
      </section>

      {/* =========================
          CONTENT SECTION
      ========================= */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-lg prose-slate max-w-none space-y-6 text-slate-700 font-medium leading-relaxed">
            {update.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-slate-100 flex justify-center">
            <Link 
              to="/latest-updates" 
              className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors duration-300 group"
            >
              <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
              Back to Updates
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          CLOSING CTA
      ========================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-foundation-primary rounded-[3rem] relative overflow-hidden py-20 px-8 lg:px-16 shadow-2xl">
            <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-[0.05] mix-blend-screen pointer-events-none" style={{ backgroundImage: "url('/hero-banner.webp')" }}></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-foundation-secondary/20 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-left max-w-2xl">
                <p className="text-sm font-bold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
                  SHARDA WELFARE FOUNDATION
                </p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                  Building Healthier Communities Together.
                </h2>
                <p className="text-white/80 text-lg font-medium">
                  Meaningful change begins by understanding community needs and taking action where it matters.
                </p>
              </div>
              
              <Link to="/contact" className="flex-shrink-0 inline-flex justify-center items-center px-8 py-5 bg-foundation-secondary hover:bg-pink-600 text-white font-bold rounded-full shadow-[0_8px_30px_rgba(233,84,124,0.4)] hover:shadow-[0_12px_40px_rgba(233,84,124,0.6)] transition-all duration-300 transform hover:-translate-y-1 text-lg group">
                Get Involved 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default UpdateDetail;
