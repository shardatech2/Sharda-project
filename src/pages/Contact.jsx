import React from 'react';
import { useContactSettings } from '../hooks/useContactSettings';
import { initialContactData, socialPlatformIcons, isValidUrl, getSafeUrl, cleanTel } from '../data/contactData';

const Contact = () => {
  const { contact } = useContactSettings();
  const data = contact || initialContactData;

  const emailAddress = data.official_email || initialContactData.official_email;
  const phoneNumber = data.helpline_number || initialContactData.helpline_number;
  const phoneTel = cleanTel(data.helpline_tel, phoneNumber) || initialContactData.helpline_tel;
  const officeHours = data.office_hours || initialContactData.office_hours;
  const emailResponseTime = data.email_response_time || initialContactData.email_response_time;

  const whatsappNumber = data.whatsapp_number || initialContactData.whatsapp_number;
  const rawWhatsappUrl = data.whatsapp_url || initialContactData.whatsapp_url;
  const whatsappUrl = getSafeUrl(
    rawWhatsappUrl,
    whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hello Sharda Welfare Foundation, I would like to connect.')}` : initialContactData.whatsapp_url
  );

  const rawMapEmbedUrl = data.map_embed_url || initialContactData.map_embed_url;
  const mapEmbedUrl = getSafeUrl(rawMapEmbedUrl, initialContactData.map_embed_url);

  const rawMapDirectionsUrl = data.map_directions_url || initialContactData.map_directions_url;
  const mapDirectionsUrl = getSafeUrl(rawMapDirectionsUrl, initialContactData.map_directions_url);

  const addressLines = (data.campus_address_multiline || initialContactData.campus_address_multiline)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const additionalPhones = Array.isArray(data.additional_phones) ? data.additional_phones : [];
  const additionalEmails = Array.isArray(data.additional_emails) ? data.additional_emails : [];
  const additionalAddresses = Array.isArray(data.additional_addresses) ? data.additional_addresses : [];

  const validSocialLinks = (data.social_links || []).filter(
    (item) => item.is_enabled && isValidUrl(item.url)
  );

  const volunteerMailto = `mailto:${emailAddress}?subject=Volunteer%20Inquiry%20-%20Sharda%20Welfare%20Foundation&body=Dear%20Sharda%20Welfare%20Team%2C%0A%0AI%20am%20interested%20in%20joining%20as%20a%20volunteer.%0A%0AName%3A%20%0APhone%20Number%3A%20%0AProfession%20%2F%20Background%3A%20%0AArea%20of%20Interest%20(Healthcare%2C%20Education%2C%20Field%20Coordination%2C%20etc.)%3A%20%0AAvailability%3A%20%0A%0AThank%20you!`;

  return (
    <div className="bg-slate-50/60 min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Intro */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-foundation-primary text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-foundation-secondary animate-pulse"></span>
            Direct Contact & Volunteering
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-5">
            We’d Love to Connect With You
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Whether you are looking to volunteer, partner with our community initiatives, or have questions about our health and education drives, reach out directly to our team via phone or email.
          </p>
        </div>

        {/* Featured Volunteer Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172442] via-[#1f3159] to-[#172442] text-white p-8 sm:p-10 mb-14 shadow-xl border border-slate-800">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-foundation-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foundation-secondary/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Join as a Volunteer
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Passionate About Creating Real Impact?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                We are always excited to welcome passionate doctors, students, teachers, and changemakers to our grassroots healthcare screenings, education workshops, and skill-building programs. Contact us directly to get onboarded!
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5">
              <a
                href={volunteerMailto}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-foundation-secondary hover:bg-pink-600 text-white font-bold text-sm shadow-lg shadow-foundation-secondary/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email Volunteer Team</span>
              </a>
              <a
                href={`tel:${phoneTel}`}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call Coordinator</span>
              </a>
            </div>
          </div>
        </div>

        {/* Core Direct Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          
          {/* Card 1: Phone */}
          <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-md border border-slate-200/80 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-foundation-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-pink-100 transition-all duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Call Our Helpline</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Connect directly with our support desk for inquiries, initiative details, or quick guidance.
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Direct Line</p>
                <a 
                  href={`tel:${phoneTel}`} 
                  className="text-lg font-bold text-foundation-primary hover:text-foundation-secondary transition-colors"
                >
                  {phoneNumber}
                </a>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {officeHours}
                </p>

                {/* Additional Phone Numbers if configured */}
                {additionalPhones.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-1.5">
                    {additionalPhones.map((item, idx) => (
                      <div key={item.id || idx} className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">{item.label || "Alternate"}:</span>
                        <a
                          href={`tel:${cleanTel(item.tel, item.phone)}`}
                          className="font-bold text-foundation-primary hover:text-foundation-secondary transition-colors"
                        >
                          {item.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${phoneTel}`}
                className="flex-1 text-center py-3 px-4 rounded-xl bg-foundation-primary hover:bg-slate-800 text-white font-bold text-sm shadow transition-all duration-200"
              >
                Call Now
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-sm border border-emerald-200 transition-all duration-200 flex items-center gap-1.5"
                title="Chat on WhatsApp"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-md border border-slate-200/80 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-foundation-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Our Team</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Drop us a detailed message regarding volunteering, CSR partnerships, or general feedback.
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Official Email</p>
                <a 
                  href={`mailto:${emailAddress}`}
                  className="text-base sm:text-lg font-bold text-foundation-primary hover:text-foundation-secondary transition-colors break-all"
                >
                  {emailAddress}
                </a>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {emailResponseTime}
                </p>

                {/* Additional Emails if configured */}
                {additionalEmails.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-1.5">
                    {additionalEmails.map((item, idx) => (
                      <div key={item.id || idx} className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">{item.label || "Alternate"}:</span>
                        <a
                          href={`mailto:${item.email}`}
                          className="font-bold text-foundation-primary hover:text-foundation-secondary transition-colors truncate max-w-[170px]"
                          title={item.email}
                        >
                          {item.email}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <a
              href={`mailto:${emailAddress}`}
              className="w-full text-center py-3 px-4 rounded-xl bg-foundation-primary hover:bg-slate-800 text-white font-bold text-sm shadow transition-all duration-200"
            >
              Compose Email
            </a>
          </div>

          {/* Card 3: Location / Address */}
          <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-md border border-slate-200/80 transition-all duration-300 flex flex-col justify-between group md:col-span-2 lg:col-span-1">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Foundation Campus</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Located within the Sharda University campus in Knowledge Park III, Greater Noida.
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Campus Address</p>
                <div className="text-sm font-semibold text-slate-800 leading-snug">
                  {addressLines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                {/* Additional Addresses if configured */}
                {additionalAddresses.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-2">
                    {additionalAddresses.map((item, idx) => (
                      <div key={item.id || idx} className="text-xs">
                        <span className="text-slate-500 font-medium block">{item.label || "Additional Branch"}:</span>
                        <p className="font-semibold text-slate-700 whitespace-pre-line">{item.address}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-foundation-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Get Directions
            </a>
          </div>

        </div>

        {/* Interactive Google Map Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/80 mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foundation-primary mb-1">
                <svg className="w-4 h-4 text-foundation-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Location & Directions
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Find Us on Google Maps
              </h2>
            </div>
            
            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foundation-primary hover:bg-slate-800 text-white font-bold text-sm shadow transition-all duration-200 self-start md:self-auto"
            >
              <span>Open in Google Maps</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Map Frame */}
          <div className="w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 relative">
            <iframe
              title="Sharda Welfare Foundation Google Map Location"
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-foundation-secondary"></span>
              <span className="font-semibold text-slate-700">{data.campus_address || initialContactData.campus_address}</span>
            </div>
            <div>
              <span>Need navigation help? Call our front desk at </span>
              <a href={`tel:${phoneTel}`} className="font-bold text-foundation-primary hover:underline">{phoneNumber}</a>
            </div>
          </div>
        </div>

        {/* Social Media Channels (rendered only when valid enabled links exist) */}
        {validSocialLinks.length > 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 mb-16 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Connect Across Our Social Channels</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xl mx-auto">
              Follow Sharda Welfare Foundation on our official channels to stay updated on our health camps, education drives, and community stories.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3">
              {validSocialLinks.map((item) => {
                const iconDef = socialPlatformIcons[item.platform?.toLowerCase()];
                return (
                  <a
                    key={item.id || item.platform}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-foundation-primary hover:text-white border border-slate-200/80 text-slate-700 font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow"
                  >
                    {iconDef && (
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox={iconDef.viewBox}>
                        <path d={iconDef.path} />
                      </svg>
                    )}
                    <span>{item.label || iconDef?.name || item.platform}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* 3 Simple Steps to Volunteer & Connect */}
        <div className="bg-gradient-to-b from-slate-100/80 to-white rounded-3xl p-8 sm:p-10 border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">How to Get Involved</h3>
            <p className="text-slate-600 text-sm">
              We make volunteering and collaboration straightforward — no complex forms or lengthy bureaucracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-foundation-primary text-white font-extrabold flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Connect Directly</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Reach out by email or call our hotline sharing your background, skills, and areas of interest (medical camps, teaching, distribution drives).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-foundation-secondary text-white font-extrabold flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Orientation & Scheduling</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our coordinator connects with you to discuss upcoming welfare drives, dates, and locations that best fit your schedule.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Create On-Ground Impact</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Join our dedicated team on the ground, delivering healthcare screenings, educational supplies, and vital community aid.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
