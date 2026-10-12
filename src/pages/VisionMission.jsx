import React from "react";
import { Link } from "react-router-dom";

function VisionMission() {
  return (
    <div className="w-full bg-white flex flex-col">

      {/* =========================
          OUR VISION
      ========================= */}
      <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
            OUR VISION
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-10 leading-tight">
            A society built on <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foundation-primary to-[#213562]">
              inclusion and fairness.
            </span>
          </h2>
          
          <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
            <p>
              At the core of our mission lies a vision for the future—one where equal access to opportunities and resources is not a privilege but a fundamental right. We envision a society that flourishes on the principles of inclusivity, fairness, and shared prosperity.
            </p>
            <p>
              In this future, every individual, regardless of their background or circumstances, will have an equitable chance to harness their potential. We aspire to break down the barriers that stand in the way of progress and create a world where the doors to success are wide open for all.
            </p>
            <p>
              Our commitment to this vision is unwavering. We believe that by working together, we can construct a more just and equitable world—one where everyone can thrive, where fairness is not a luxury, but a cornerstone of our society.
            </p>
          </div>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-foundation-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-foundation-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
      </section>

      {/* =========================
          OUR MISSION
      ========================= */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-foundation-secondary/20 to-transparent rounded-[2rem] transform -translate-x-4 translate-y-4 -z-10"></div>
              <img
                src="/vision.webp"
                alt="Sharda Welfare Foundation Mission"
                className="w-full h-auto rounded-[2rem] shadow-2xl object-cover"
              />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
                OUR MISSION
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                Uplifting People Through <br className="hidden md:block"/> Meaningful Support
              </h2>

              <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
                Our mission is to uplift those in need by addressing the multifaceted challenges they face.
              </p>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                We aim to provide essential services and support in these crucial areas to create a positive and lasting impact on the lives of individuals and communities.
              </p>

              <div className="space-y-6">
                {[
                  { num: "01", title: "Essential Support", desc: "Addressing important needs through meaningful welfare initiatives and services." },
                  { num: "02", title: "Inclusive Development", desc: "Working towards greater access to opportunities and resources for communities." },
                  { num: "03", title: "Lasting Impact", desc: "Supporting positive change that can contribute to stronger and more equitable communities." },
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300 group">
                    <span className="text-4xl font-black text-foundation-secondary/20 group-hover:text-foundation-secondary/40 transition-colors">{point.num}</span>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{point.title}</h4>
                      <p className="text-slate-600">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* =========================
          CORE VALUES
      ========================= */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">OUR CORE VALUES</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Principles That Guide Our Work
            </h2>
            <p className="text-lg text-slate-600">
              At the heart of our organization are the following core values that drive our mission:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            
            {[
              { num: "01", title: "Compassion", desc: "We genuinely care about the well-being of the communities we serve. Empathy and understanding underpin all our efforts as we work towards a better future for those in need." },
              { num: "02", title: "Integrity", desc: "We are unwavering in our commitment to maintaining the highest standards of ethics, transparency, and accountability in every action we take. Trust and integrity are at the foundation of our work." },
              { num: "03", title: "Collaboration", desc: "We recognize the strength that comes from working together. We actively seek partnerships to amplify our positive impact, believing that through collaboration, we can achieve greater outcomes." },
              { num: "04", title: "Innovation", desc: "We are proactive in our quest for creative and effective solutions to tackle complex social challenges. We embrace innovation as a driving force to bring about positive change." },
              { num: "05", title: "Impact-Driven", desc: "Our primary focus is on achieving concrete and beneficial outcomes. We measure our success by the positive and lasting impact we make in the lives of the communities we support." },
            ].map((value, idx) => (
              <div key={idx} className={`bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group ${idx === 3 ? 'lg:col-start-1 lg:col-span-1 lg:ml-auto lg:translate-x-1/2' : ''} ${idx === 4 ? 'lg:col-start-2 lg:col-span-1 lg:translate-x-1/2' : ''}`}>
                <div className="absolute top-0 right-0 p-6 text-7xl font-black text-slate-50 group-hover:text-foundation-secondary/5 transition-colors duration-300 pointer-events-none">
                  {value.num}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-foundation-primary/5 flex items-center justify-center text-foundation-primary font-bold text-2xl mb-8 group-hover:bg-foundation-secondary/10 group-hover:text-foundation-secondary transition-colors duration-300">
                  {value.num}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{value.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================
          CLOSING CTA
      ========================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-foundation-primary rounded-[3rem] relative overflow-hidden py-20 px-8 lg:px-16 shadow-2xl">
            <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-[0.05] mix-blend-screen pointer-events-none" style={{ backgroundImage: "url('/hero-banner.webp')" }}></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-foundation-secondary/20 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-left max-w-2xl">
                <p className="text-sm font-bold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
                  BE PART OF THE CHANGE
                </p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                  Together, We Can Build a More Equitable Future.
                </h2>
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

export default VisionMission;