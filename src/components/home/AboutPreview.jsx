import React from 'react';
import { Link } from 'react-router-dom';

const AboutPreview = () => {
  return (
    <section className="pt-20 md:pt-32 pb-10 md:pb-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">Little About Us</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
              Empowering Lives,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foundation-primary to-[#213562]">
                Building Futures.
              </span>
            </h3>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
              At Sharda Welfare Foundation, we believe in the power of collective action. Since our inception, we have been dedicated to reaching the unreached, focusing on healthcare, education, environmental sustainability, and skill development for marginalized communities.
            </p>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Every initiative we undertake is a step towards a more equitable society. From conducting mega health camps to planting thousands of trees, our mission is to create a lasting, positive impact on the world around us.
            </p>

            <Link to="/about" className="inline-flex justify-center items-center px-8 py-4 bg-foundation-primary hover:bg-[#1f4db3] text-white font-bold rounded-full shadow-[0_8px_25px_rgba(23,36,66,0.3)] hover:shadow-[0_12px_30px_rgba(23,36,66,0.4)] transition-all duration-300 transform hover:-translate-y-1">
              Read Our Full Story
            </Link>
          </div>

          {/* Image/Visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-foundation-secondary/20 to-transparent rounded-[2rem] transform translate-x-4 translate-y-4 -z-10"></div>
            <img 
              src="/home-about.webp" 
              alt="Community health camp with smiling volunteers" 
              className="w-full h-auto rounded-[2rem] shadow-2xl object-cover aspect-[4/3]"
            />
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 hidden md:flex">
              <div className="w-14 h-14 rounded-full bg-foundation-secondary/10 flex items-center justify-center text-foundation-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">10k+</p>
                <p className="text-sm font-medium text-slate-500">Lives Touched</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
