import React, { useState } from 'react';

const leaders = [
  {
    id: 1,
    name: "Shri. Pradeep Kumar Gupta",
    designation: "Chairman, Sharda Corporation, Chancellor Sharda University",
    image: "/p.k.gupta.webp", 
    shortBio: "A visionary leader who has revolutionized educational paradigms across India.",
    fullBio: [
      "Mr. Pradeep Kumar Gupta stands as a visionary leader who has revolutionized educational paradigms across India. Beginning with engineering campuses in 1996 at Agra & Mathura, Mr. P. K. Gupta established Sharda University in 2009 as India's first truly global university, welcoming students from 95+ countries.",
      "Mr. P. K. Gupta has also made forays in the healthcare sector with a vision to offer ethical & affordable treatment through Sharda Hospital, a 1200+ bed super-specialty hospital. Mr. Gupta's distinguished recognitions include the 'Udyog Ratna' award, 'Uttar Pradesh Ratna' award, 'Gaurav Shri' award for entrepreneurship, and Best Educationist award from the Federation of Educational Publishers in India."
    ]
  },
  {
    id: 2,
    name: "Shri. Yatendra Kumar Gupta",
    designation: "Vice Chairman, Sharda Corporation, Pro Chancellor Sharda University",
    image: "/y.k.gupta.webp", 
    shortBio: "A renowned educationalist, social leader and visionary industrialist.",
    fullBio: [
      "Mr. Yatendra Kumar Gupta is a renowned educationalist, social leader and a visionary industrialist who has traversed a tough road to the position he holds in the corporate world today.",
      "Mr. Y.K. Gupta has put immense efforts to do pioneering work in education, healthcare and construction sectors. His extraordinary leadership has driven the tremendous success of Sharda University, Sharda Hospital & RSPL.",
      "Under his guidance, Sharda Corporation is positioned for quantum leaps across multiple sectors, thanks to his extraordinary vision that transcends conventional boundaries.",
      "Several awards have been conferred on Mr. Y. K. Gupta, prominent one being 'INDIA SKILL AWARD' presented during the Australia-India Skills Conference-2013, acknowledging his contributions to skill development initiatives."
    ]
  },
  {
    id: 3,
    name: "Shri. Prashant Gupta",
    designation: "CEO- Sharda Corporation, President Sharda University Uzbekistan",
    image: "/prashant.webp", 
    shortBio: "Bringing over 14 years of leadership experience across education, healthcare & IT sectors.",
    fullBio: [
      "Mr. Prashant Gupta serves as Chief Executive Officer of Sharda Corporation, bringing over 14 years of leadership experience across education, healthcare, IT sectors & export. As Founder & CEO of Sharda Tech, Sharda World School, Sharda University Uzbekistan and WireOut Technologies, he demonstrates exceptional entrepreneurial acumen. He is also an angel investor in start-up's.",
      "Mr. Prashant Gupta is the alumni of the prestigious Nottingham Business School, University of Bradford and continued his education with University of Oxford, University of Illinois and London School of Economics. Mr. Prashant Gupta is among the select young business leaders who have received prestigious honour and recognition from various industry bodies. For his numerous achievements, Mr. Prashant Gupta recently received the AsiaOne 40 Most Influential Asians under 40 award which was validated by PricewaterhouseCoopers."
    ]
  },
  {
    id: 4,
    name: "Shri. Rishabh Gupta",
    designation: "MD - Sharda Hospital & ShardaCare Healthcity, Sharda Welfare Foundation & Maxwell",
    image: "/rishabh.webp", 
    shortBio: "An accomplished professional with a robust foundation in international hospitality and healthcare management.",
    fullBio: [
      "Mr. Rishabh Gupta is an accomplished professional with a robust academic foundation in international hospitality management, having graduated from the prestigious Swiss Hotel Management School in Switzerland in 2020. His academic credentials are further strengthened by a diploma in business of Health Care: Driving Impact and Transformation from Johns Hopkins University, obtained in 2024.",
      "This diverse educational background equips him with a unique blend of expertise in both hospitality and healthcare management. Currently, Mr. Rishabh Gupta holds the esteemed position of Managing Director - Sharda Hospital, ShardaCare Healthcity, Sharda Welfare Foundation & Maxwell Hotels Pvt. Ltd. His leadership and strategic vision have significantly contributed to the growth and success of these organizations.",
      "Mr. Rishabh Gupta's expertise in healthcare management, coupled with his dynamic leadership skills and knowledge in healthcare business, make him a distinguished figure in his field. His commitment to excellence and dedication to his work are evident through his remarkable achievements and contributions to the industry."
    ]
  }
];

function Leadership() {
  const [selectedLeader, setSelectedLeader] = useState(null);

  return (
    <div className="w-full bg-slate-50 flex flex-col relative min-h-screen">
      
      {/* Intro Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
            OUR VISIONARY FOUNDERS
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-10 leading-tight">
            Driving Impact Through <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foundation-primary to-[#213562]">
              Visionary Leadership
            </span>
          </h2>
          
          <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
            <p>
              The founders of Sharda Welfare Foundation are an extraordinary assembly of leaders, each bringing diverse expertise to the table. Their integral roles within the Sharda Group, combined with their deeply-rooted philanthropic values, were the driving force behind the organization's inception. Their visionary leadership facilitated a seamless alignment with the foundation's mission, giving rise to impactful initiatives in the realms of education, healthcare, and community support.
            </p>
            <p>
              Collectively, their unwavering dedication played a pivotal role in establishing the foundation's capacity to effect a significant and enduring transformation within society.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Grid */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {leaders.map((leader) => (
              <div key={leader.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-2 transition-all duration-300 flex flex-col group">
                
                {/* Image Container */}
                <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
                  <img 
                    src={leader.image} 
                    alt={leader.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle gradient overlay at bottom of image */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{leader.name}</h3>
                  <p className="text-sm font-bold text-foundation-secondary mb-8 flex-grow">{leader.designation}</p>
                  
                  <button 
                    onClick={() => setSelectedLeader(leader)}
                    className="w-full py-3 px-6 bg-slate-50 hover:bg-foundation-secondary text-slate-900 hover:text-white font-bold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    Read More
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          
          {/* Modal Overlay (click to close) */}
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => setSelectedLeader(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedLeader(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-slate-100 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
              {/* Modal Image */}
              <div className="w-full md:w-2/5 md:flex-shrink-0 bg-slate-100 min-h-[300px] relative">
                <img 
                  src={selectedLeader.image} 
                  alt={selectedLeader.name}
                  className="w-full h-full object-cover md:absolute md:inset-0"
                />
              </div>
              
              {/* Modal Text */}
              <div className="w-full p-8 sm:p-10 md:p-12 overflow-y-auto">
                <p className="text-sm font-bold text-foundation-secondary tracking-[0.1em] mb-2">
                  {selectedLeader.designation}
                </p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8">
                  {selectedLeader.name}
                </h3>
                
                <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                  {Array.isArray(selectedLeader.fullBio) ? (
                    selectedLeader.fullBio.map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))
                  ) : (
                    <p>{selectedLeader.fullBio}</p>
                  )}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Tailwind Custom Animation (can also be put in index.css) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Leadership;
