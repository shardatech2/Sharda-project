import React from 'react';

const stats = [
  { id: 1, name: 'Lives Impacted', value: '50,000+' },
  { id: 2, name: 'Health Camps', value: '200+' },
  { id: 3, name: 'Children Educated', value: '15,000+' },
  { id: 4, name: 'Trees Planted', value: '10,000+' },
];

const ImpactStats = () => {
  return (
    <section className="relative py-16 md:py-28 overflow-hidden bg-slate-50">
      {/* Soft Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-pink-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <h2 className="text-sm font-extrabold text-foundation-primary tracking-[0.2em] uppercase mb-4 text-center">Our Impact</h2>
          <p className="text-2xl md:text-5xl font-extrabold text-slate-900 leading-tight text-center w-full">
            Numbers That Tell a <br className="hidden md:block"/> Story of Hope
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4 md:gap-x-8 md:gap-y-16 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-y-2 md:gap-y-4 items-center justify-center p-5 md:p-8 bg-white/60 backdrop-blur-md rounded-2xl md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white hover:bg-white transition-all duration-500 transform hover:-translate-y-2">
              <dt className="text-xs md:text-base font-semibold leading-snug text-slate-500 uppercase tracking-wide">{stat.name}</dt>
              <dd className="order-first text-3xl md:text-6xl font-bold md:font-normal text-slate-900 drop-shadow-sm">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default ImpactStats;
