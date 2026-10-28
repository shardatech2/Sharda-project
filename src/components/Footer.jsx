import React from 'react';
import { Link } from 'react-router-dom';
import { useContactSettings } from '../hooks/useContactSettings';
import { initialContactData, socialPlatformIcons, isValidUrl, cleanTel } from '../data/contactData';

const Footer = () => {
  const { contact } = useContactSettings();
  const data = contact || initialContactData;

  const officialEmail = data.official_email || initialContactData.official_email;
  const displayPhone = data.footer_phone || data.helpline_number || initialContactData.footer_phone;
  const phoneTel = cleanTel(data.helpline_tel, displayPhone);

  const validSocialLinks = (data.social_links || []).filter(
    (item) => item.is_enabled && isValidUrl(item.url)
  );

  const addressLines = (data.campus_address_multiline || initialContactData.campus_address_multiline)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <footer className="bg-[#172442] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start">
            <Link to="/" className="mb-6 bg-white p-2 rounded-xl inline-block">
              <img src="/logo.webp" alt="Sharda Welfare Foundation" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 pr-4">
              Building a healthier and brighter tomorrow by extending healthcare awareness and essential support to communities who need it most.
            </p>
            {validSocialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {validSocialLinks.map((item) => {
                  const iconDef = socialPlatformIcons[item.platform?.toLowerCase()];
                  return (
                    <a
                      key={item.id || item.platform}
                      href={item.url}
                      aria-label={item.label || item.platform}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-foundation-secondary transition-colors duration-300"
                    >
                      {iconDef ? (
                        <svg className="w-5 h-5 text-white fill-current" viewBox={iconDef.viewBox}>
                          <path d={iconDef.path} />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold uppercase text-white">
                          {item.platform ? item.platform.slice(0, 2) : "SO"}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/" className="text-slate-400 hover:text-foundation-secondary transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-foundation-secondary transition-colors">About Sharda Welfare</Link></li>
              <li><Link to="/our-story" className="text-slate-400 hover:text-foundation-secondary transition-colors">Our Story</Link></li>
              <li><Link to="/vision-mission" className="text-slate-400 hover:text-foundation-secondary transition-colors">Vision & Mission</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-foundation-secondary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Our Programs</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/what-we-do#sehat" className="text-slate-400 hover:text-foundation-secondary transition-colors">Healthcare — SEHAT</Link></li>
              <li><Link to="/what-we-do#ujjawal" className="text-slate-400 hover:text-foundation-secondary transition-colors">Education — UJJAWAL</Link></li>
              <li><Link to="/what-we-do#sambhavana" className="text-slate-400 hover:text-foundation-secondary transition-colors">Skill Development — SAMBHAVANA</Link></li>
              <li><Link to="/what-we-do#unnati" className="text-slate-400 hover:text-foundation-secondary transition-colors">Environment — UNNATI</Link></li>
              <li><Link to="/latest-updates" className="text-slate-400 hover:text-foundation-secondary transition-colors">Latest Updates</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Information</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-foundation-secondary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>
                  {addressLines.map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx < addressLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-foundation-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a href={`tel:${phoneTel}`} className="hover:text-white transition-colors">{displayPhone}</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-foundation-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href={`mailto:${officialEmail}`} className="hover:text-white transition-colors">{officialEmail}</a>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>&copy; {new Date().getFullYear()} Sharda Welfare Foundation. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
