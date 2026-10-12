import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, breadcrumb }) => {
  return (
    <div className="relative w-full pt-28 pb-10 md:pt-32 md:pb-12 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#172442] via-[#213562] to-[#3a204e]">
      
      {/* Background overlay texture */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-[0.03] mix-blend-screen pointer-events-none"
        style={{ backgroundImage: "url('/hero-banner.webp')" }}
      ></div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          {title}
        </h1>
        
        <div className="flex items-center gap-2 text-sm md:text-base font-medium text-slate-300">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-white/40">/</span>}
              {item.link ? (
                <Link to={item.link} className="hover:text-foundation-secondary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default PageHeader;
