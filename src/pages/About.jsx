import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="w-full bg-white flex flex-col">
      
      {/* =========================
          WHO WE ARE
      ========================= */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-foundation-secondary/20 to-transparent rounded-[2rem] transform translate-x-4 translate-y-4 -z-10"></div>
              <img
                src="/about.webp"
                alt="Sharda Welfare Initiative"
                className="w-full h-auto rounded-[2rem] shadow-2xl object-cover"
              />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
                WHO WE ARE
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                Working Towards a More <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foundation-primary to-[#213562]">
                  Inclusive Future
                </span>
              </h2>

              <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
                Sharda Welfare Foundation is the philanthropic arm of Sharda University. The foundation works towards creating positive and meaningful change in communities through focused social welfare initiatives.
              </p>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                With a special emphasis on the well-being and empowerment of women and children, the foundation works across areas that contribute to social, economic and environmental development.
              </p>

              <div className="flex items-start gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-4xl font-extrabold text-foundation-secondary/30">01</span>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Community-Centred Development</h4>
                  <p className="text-slate-600">
                    Supporting communities through meaningful initiatives focused on health, education, skills and sustainable development.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* =========================
          OUR AREAS OF WORK
      ========================= */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">OUR AREAS OF WORK</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Creating Impact Across Communities
            </h2>
            <p className="text-lg text-slate-600">
              Sharda Welfare Foundation works across multiple areas that contribute to healthier, more empowered and sustainable communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Area Cards */}
            {[
              { num: "01", title: "Healthcare", desc: "Supporting better healthcare access, awareness and community health initiatives." },
              { num: "02", title: "Education", desc: "Promoting education and learning opportunities for children and communities." },
              { num: "03", title: "Skill Development", desc: "Supporting skill development and creating opportunities for young people to grow." },
              { num: "04", title: "Environment", desc: "Encouraging environmental awareness, cleanliness and sustainable practices." },
            ].map((area, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-6xl font-black text-slate-50 group-hover:text-foundation-secondary/5 transition-colors duration-300 pointer-events-none">
                  {area.num}
                </div>
                <div className="w-12 h-12 rounded-xl bg-foundation-secondary/10 flex items-center justify-center text-foundation-secondary font-bold text-2xl mb-8 group-hover:scale-110 transition-transform duration-300">
                  +
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{area.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{area.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================
          OUR APPROACH
      ========================= */}
      <section className="py-20 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-5 flex flex-col justify-center">
              <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
                OUR APPROACH
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                Building Change Through Meaningful Action
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                The foundation believes that sustainable social change requires meaningful engagement with communities and long-term efforts that address their essential needs.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Through outreach initiatives and community-focused programs, Sharda Welfare Foundation works towards improving access to healthcare and education, developing skills and promoting awareness about a cleaner and more sustainable environment.
              </p>
            </div>
            
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              {[
                { num: "01", title: "Community Focus", desc: "Understanding community needs and developing meaningful initiatives around them." },
                { num: "02", title: "Inclusive Development", desc: "Working towards greater access to opportunities and essential services." },
                { num: "03", title: "Sustainable Change", desc: "Supporting initiatives that can contribute to long-term community well-being." },
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-6 p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-[0_15px_30px_rgba(15,23,42,0.08)] transition-all duration-300">
                  <span className="text-5xl font-black text-foundation-secondary/20 mt-1">{point.num}</span>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-3">{point.title}</h4>
                    <p className="text-slate-600 text-lg">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================= */}
      <section className="py-20 bg-foundation-primary relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-[0.05] mix-blend-screen pointer-events-none" style={{ backgroundImage: "url('/hero-banner.webp')" }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-foundation-secondary/20 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-left">
            <p className="text-sm font-bold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
              GET INVOLVED
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Be Part of the Change.
            </h2>
            <p className="text-lg text-slate-300">
              Together, we can contribute towards healthier, empowered and more inclusive communities.
            </p>
          </div>
          
          <Link to="/contact" className="flex-shrink-0 inline-flex justify-center items-center px-8 py-5 bg-foundation-secondary hover:bg-pink-600 text-white font-bold rounded-full shadow-[0_8px_30px_rgba(233,84,124,0.4)] hover:shadow-[0_12px_40px_rgba(233,84,124,0.6)] transition-all duration-300 transform hover:-translate-y-1 text-lg group">
            Get Involved 
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;