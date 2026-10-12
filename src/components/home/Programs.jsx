import React from 'react';
import { Link } from 'react-router-dom';
import Suhealth from '../../assets/Suhealth.webp';
import Sueducation from '../../assets/Sueducation.webp';
import Suskill from '../../assets/Suskill.webp';
import Suenvironment from '../../assets/Suenvironment.webp';

const programs = [
  {
    id: 'sehat',
    title: 'Sehat',
    subtitle: 'Healthcare for All',
    description: 'Providing accessible healthcare, medical camps, and essential health awareness to underserved communities.',
    image: Suhealth,
    link: '/what-we-do#sehat',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    id: 'ujjawal',
    title: 'Ujjawal',
    subtitle: 'Lighting up Minds',
    description: 'Empowering children through quality education, learning resources, and better school infrastructure.',
    image: Sueducation,
    link: '/what-we-do#ujjawal',
    color: 'from-pink-400 to-rose-500'
  },
  {
    id: 'sambhavana',
    title: 'Sambhavana',
    subtitle: 'Skill Development',
    description: 'Creating livelihood opportunities by imparting crucial skills and vocational training to the youth.',
    image: Suskill,
    link: '/what-we-do#sambhavana',
    color: 'from-purple-500 to-fuchsia-500'
  },
  {
    id: 'unnati',
    title: 'Unnati',
    subtitle: 'Sustainable Environment',
    description: 'Promoting environmental conservation, tree plantation, and sustainable living practices.',
    image: Suenvironment,
    link: '/what-we-do#unnati',
    color: 'from-green-500 to-emerald-400'
  }
];

const Programs = () => {
  return (
    <section className="pt-10 pb-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-extrabold text-foundation-primary tracking-[0.2em] uppercase mb-4 text-center">Our Key Initiatives</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight text-center w-full">
            Empowering Communities <br/> Through Action
          </h3>
          <p className="text-lg text-slate-600 leading-relaxed font-medium text-center">
            We focus on core areas that create a lasting, positive impact on society. Discover how our programs are changing lives every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {programs.map((program) => (
            <Link 
              key={program.id} 
              to={program.link}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10 mix-blend-multiply`}></div>
                <img 
                  src={program.image} 
                  alt={program.title} 
                  className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <h4 className="text-2xl font-bold text-slate-900 mb-2">{program.title}</h4>
                <p className={`text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r ${program.color} mb-4 tracking-wide`}>
                  {program.subtitle}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1 font-medium">
                  {program.description}
                </p>
                <div className="mt-auto flex items-center text-sm font-bold text-slate-900 group-hover:text-foundation-primary transition-colors">
                  Explore Program 
                  <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
