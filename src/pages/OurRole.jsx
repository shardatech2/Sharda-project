import React from "react";
import { Link } from "react-router-dom";

function OurRole() {
  return (
    <div className="w-full bg-white flex flex-col">

      {/* =========================
          OUR ROLE IN THE COMMUNITY
      ========================= */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-foundation-secondary/20 to-transparent rounded-[2rem] transform -translate-x-4 translate-y-4 -z-10"></div>
              <img
                src="/role1.webp"
                alt="Sharda Welfare community welfare initiative"
                className="w-full h-auto rounded-[2rem] shadow-2xl object-cover"
              />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
                OUR ROLE IN THE COMMUNITY
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                Bringing Welfare <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foundation-primary to-[#213562]">
                  Efforts Together
                </span>
              </h2>

              <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
                Sharda Welfare Foundation represents the philanthropic initiative of Sharda Group.
              </p>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Sharda Group has been executing several community welfare activities in the field of healthcare, education and environment since its inception from last 25 years. Sharda Group launched Sharda Welfare Foundation for the purpose of standardisation of all these welfare activities and also to strengthen its corporate social responsibility by reaching out to the masses in the economically weaker communities by working in the field of environment, education and healthcare.
              </p>

              <div className="flex items-start gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-4xl font-extrabold text-foundation-secondary/30">01</span>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Community-Centred Approach</h4>
                  <p className="text-slate-600">
                    Working with communities and focusing on areas that can contribute to better health, education, skills and living conditions.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* =========================
          AREAS OF CONTRIBUTION
      ========================= */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-5xl mx-auto mb-20">
            <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">OUR AREAS OF CONTRIBUTION</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Focused on Essential Community Needs
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              The best gift that we can give to our future generation is good quality air to breathe, clean and uncontaminated water to drink and healthy and nutritious food to eat. Apart from this accessibility to basic health care facilities and education are the basic pillars of any developed economy. Providing better healthcare facilities to the marginalised community, spreading awareness about the protection of environment and importance of education through various outreach programs has been the primary focus of Sharda Welfare Foundation.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Sharda Welfare Foundation has structured it’s working into following domains for community development – Health care improvement, skilling the youth, education, cleanliness and waste management. The Sharda Welfare Foundation focuses on the social initiatives of Sharda Group which include Sharda University – Greater Noida, Sharda University – Uzbekistan, Sharda Hospital, Maxwell Biotech, Sharda World School, Hindustan Institute of Engineering and Management, Anand college of Engineering and RSPL. The foundation emphasises into addressing some significant issues for economically backward rural section of the society like health care and education, women empowerment, contributing towards the skill development initiate of Government of India and eventually making a deeper and concrete impact in the society.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {[
              { num: "01", title: "Healthcare Improvement", desc: "Supporting better healthcare facilities, awareness and access for economically weaker and marginalised communities." },
              { num: "02", title: "Youth Skill Development", desc: "Supporting skill development and opportunities that can help young people build capabilities and improve their livelihoods." },
              { num: "03", title: "Education", desc: "Promoting the importance of education and supporting access to learning opportunities within communities." },
              { num: "04", title: "Cleanliness & Waste", desc: "Creating awareness about cleanliness, waste segregation and responsible waste management practices." },
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
          WORKING WITH COMMUNITIES
      ========================= */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Content */}
            <div className="order-2 lg:order-1">
              <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
                WORKING WITH COMMUNITIES
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                Creating Deeper, <br />
                Long-Term Impact
              </h2>

              <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
                Sharda Welfare Foundation was established with the vision of Chairman of Sharda Group Shri P K Gupta to make a positive impact in the lives of economically weaker section of the societies by improving healthcare and education, enabling them with skills, providing better infrastructure, water, sanitation, better health care facilities and also making the communities aware about the importance of keeping our environment clean.
              </p>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Our patriarch Shri P K Gupta is the inspiration and guiding force behind Sharda Welfare Foundation who strongly believe that the engagement with the community must be deep, robust, meaningful with the long term vision of impacting the lives of the under privileged sections of the society and thus giving back to the society. The foundation mostly works in the communities which are located in the vicinity of the campuses of Sharda Group i.e. Sharda University Greater Noida, Hindustan Institute of Technology and Management and Anand engineering college Agra are located.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Sharda Welfare Foundation also contributes to the Nation Building by spreading awareness to the weaker and underprivileged section of the rural section of the society about various Government Initiatives like Swach Bharat Mission, waste management , segregation and disposal of waste material, livestock health awareness, promoting organic farming, skilling the youth. Sharda Welfare Foundation strongly believes that these welfare driven activities for the weaker section of the society will not only improve the livelihood of these individuals and their families but would also make a robust and liveable nation for the future generations.
              </p>
            </div>

            {/* Image */}
            <div className="relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-foundation-primary/20 to-transparent rounded-[2rem] transform translate-x-4 translate-y-4 -z-10"></div>
              <img
                src="/role2.webp"
                alt="Working with communities"
                className="w-full h-auto rounded-[2rem] shadow-2xl object-cover"
              />
            </div>
            
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
                  OUR COMMITMENT
                </p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                  Building Stronger Communities
                </h2>
                <p className="text-lg text-slate-300">
                  Our role is to turn commitment into action and contribute towards healthier, more empowered and sustainable communities.
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

export default OurRole;