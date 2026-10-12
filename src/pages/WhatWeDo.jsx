import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import suSehat from "../assets/suSehat.webp";
import suUjjwal from "../assets/suUjjwal.webp";
import suSambhavna from "../assets/suSambhavna.webp";
import suUnnati from "../assets/suUnnati.webp";
import suVision2 from "../assets/suVision2.webp";

function WhatWeDo() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [hash]);

  const programs = [
    {
      id: "sehat",
      title: "SEHAT",
      subtitle: "Transforming Healthcare for the Vulnerable",
      image: suSehat,
      intro: [
        "The SEHAT program is dedicated to addressing the pressing healthcare challenges faced by economically disadvantaged communities in our nation. Our primary focus is on enhancing maternal and child health, recognizing the vital importance of this demographic.",
        "Our vision is to empower women and protect the well-being of children by improving healthcare facilities and fostering awareness about healthy living."
      ],
      points: [
        { title: "Bridging the Healthcare Gap", desc: "We are committed to reducing disparities in healthcare access, ensuring that the underserved can receive the care they need." },
        { title: "Ensuring Accessible Healthcare", desc: "Our goal is to make healthcare more accessible to all, regardless of their economic circumstances." },
        { title: "Promoting Preventive Healthcare", desc: "We believe in the power of prevention. Our efforts are directed towards raising awareness about preventive healthcare practices to improve overall well-being." },
        { title: "Capacity Building", desc: "We aim to strengthen healthcare infrastructure and empower individuals with the knowledge and skills needed for a healthier life." }
      ],
      conclusion: "Join us in our mission to create a society where every individual can access quality healthcare, enabling them to lead healthier and happier lives. Reality is made out of this vision, together."
    },
    {
      id: "ujjawal",
      title: "UJJAWAL",
      subtitle: "Illuminating Pathways to Education and Learning",
      image: suUjjwal,
      intro: [
        "The UJJAWAL program is a steadfast commitment to education and the enrichment of learning capabilities. We firmly believe that education serves as the foundation for individual growth, social advancement, and economic prosperity.",
        "Through UJJAWAL, our mission is to ensure equitable access to high-quality education while nurturing the innate learning potential of every individual."
      ],
      points: [
        { title: "Equitable Quality Education", desc: "We are dedicated to providing equal access to quality education for all, breaking down barriers and creating opportunities for a brighter future." },
        { title: "Enhancing Learning Abilities", desc: "Our efforts extend beyond access, as we work to cultivate and enhance the innate learning abilities of individuals, unlocking their full potential." }
      ],
      conclusion: "Join us on our journey to unlock the potential of individuals, empower communities, and forge a future where equal opportunities for success are a reality for everyone. Your support is instrumental in making this vision come to life."
    },
    {
      id: "sambhavana",
      title: "SAMBHAVANA",
      subtitle: "Empowering with Skills for a Brighter Tomorrow",
      image: suSambhavna,
      intro: [
        "The SAMBHAVANA program is dedicated to skill development, with a particular focus on equipping individuals, especially women, with practical skills that enhance their employability and foster socio-economic growth.",
        "Our commitment lies in providing comprehensive skill development programs that are closely aligned with market demands, ensuring that participants gain industry-relevant knowledge and expertise."
      ],
      points: [
        { title: "Skill Enhancement", desc: "We are dedicated to enhancing the skills of individuals, empowering them with the tools they need to excel in the job market." },
        { title: "Industry-Relevant Training", desc: "Our programs are designed to provide training that directly aligns with the needs of industries, ensuring that participants are well-prepared for the workforce." },
        { title: "Career Pathway Guidance", desc: "We offer guidance and support to help individuals chart their career paths, making informed decisions about their professional journeys." },
        { title: "Mentorship and Support", desc: "We provide mentorship to facilitate growth and offer the necessary support to help participants thrive." }
      ],
      conclusion: "Join us in our mission to empower individuals with the skills they need to excel in the job market, attain economic independence, and contribute to the prosperity of their communities. With SAMBHAVANA, we believe in unlocking the potential of individuals and enabling them to build a brighter and more promising future."
    },
    {
      id: "unnati",
      title: "UNNATI",
      subtitle: "Cultivating Environmental Change Leaders",
      image: suUnnati,
      intro: [
        "The UNNATI program is wholeheartedly committed to nurturing change leaders who advocate for environmental protection and the promotion of sustainable consumption practices.",
        "We firmly believe in the potential of individuals to initiate positive change and leave a lasting imprint on the environment."
      ],
      points: [
        { title: "Environmental Education and Awareness", desc: "Our program aims to educate and raise awareness about critical environmental issues, empowering individuals with knowledge to drive informed decisions." },
        { title: "Building Sustainable Consumption Habits", desc: "We work to instil and promote sustainable consumption practices that reduce environmental impact and ensure a greener future." },
        { title: "Developing Change Leaders", desc: "UNNATI focuses on grooming individuals to become leaders in environmental protection, equipping them with the skills and knowledge needed to drive positive change." },
        { title: "Community Engagement and Collaboration", desc: "We actively engage with communities and foster collaboration to create a collective force for environmental well-being." }
      ],
      conclusion: "Join us in our mission to nurture change leaders for environmental protection and to promote sustainable consumption. Together, we can take significant steps toward a more sustainable and environmentally conscious world."
    },
    {
      id: "bharosa",
      title: "BHAROSA",
      subtitle: "Empowering Communities through Justice and Accountability",
      image: suVision2,
      intro: [
        "The BHAROSA program is dedicated to empowering communities by fostering legal awareness, providing access to justice, and fortifying institutions to establish an accountability mechanism.",
        "We firmly believe that access to justice and a robust accountability framework are fundamental pillars of a just and equitable society."
      ],
      points: [
        { title: "Legal Awareness", desc: "Our efforts centre on raising awareness about legal rights and responsibilities, ensuring individuals are informed and empowered." },
        { title: "Access to Justice", desc: "We strive to make justice accessible to all, irrespective of their background, ensuring that individuals have a voice and recourse in the legal system." },
        { title: "Strengthening Institutions", desc: "We work to enhance the capabilities and integrity of institutions that play a critical role in ensuring justice and accountability." },
        { title: "Building an Accountability Mechanism", desc: "Our goal is to establish mechanisms that hold individuals and organizations accountable for their actions, contributing to a fair and responsible society." },
        { title: "Community Empowerment", desc: "We empower communities to actively engage in matters of justice and accountability, fostering a sense of ownership and participation." }
      ],
      conclusion: "Through targeted interventions, BHAROSA aims to build a society rooted in fairness and responsibility."
    }
  ];

  return (
    <div className="w-full bg-white flex flex-col">

      {/* =========================
          INTRO SECTION
      ========================= */}
      <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
            OUR INITIATIVES
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-10 leading-tight">
            Driving Positive <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foundation-primary to-[#213562]">
              Social Change
            </span>
          </h2>
          
          <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
            <p>
              At Sharda Welfare Foundation, our unwavering commitment is to drive positive social change through a diverse range of initiatives and interventions. We work diligently across various sectors, with a special focus on key areas that are pivotal to transforming lives. These areas include healthcare, education, skill development, environmental sustainability, and legal aid.
            </p>
            <p>
              Our aim is to make a meaningful and lasting impact on the communities we serve, fostering a brighter and more equitable future. We invite you to explore our initiatives and join us in our mission to create a better world for all.
            </p>
          </div>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-foundation-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-foundation-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
      </section>

      {/* =========================
          PROGRAM SECTIONS
      ========================= */}
      {programs.map((program, index) => {
        const isEven = index % 2 === 0;
        return (
          <section id={program.id} key={program.id} className="py-20 md:py-32 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-foundation-primary/20 to-foundation-secondary/20 rounded-[3rem] transform translate-x-4 translate-y-4 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
                  <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-[3rem] shadow-xl">
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2">
                  <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
                    {program.title}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                    {program.subtitle}
                  </h2>
                  
                  <div className="space-y-4 text-slate-600 font-medium leading-relaxed mb-10">
                    {program.intro.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {/* Core Focus Areas List */}
                  <div className="bg-slate-50 rounded-3xl p-8 mb-8 border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider">Core Focus Areas</h3>
                    <ul className="space-y-6">
                      {program.points.map((point, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-foundation-primary/10 flex items-center justify-center text-foundation-primary font-bold text-sm">
                            {i + 1}
                          </span>
                          <div>
                            <strong className="block text-slate-900 mb-1">{point.title}</strong>
                            <p className="text-slate-600 text-sm leading-relaxed">{point.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-slate-600 font-medium italic">
                    {program.conclusion}
                  </p>

                </div>

              </div>
            </div>
          </section>
        );
      })}

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

export default WhatWeDo;
