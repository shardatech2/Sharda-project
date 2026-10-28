import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updatesData as fallbackUpdates } from "../data/updatesData";

function LatestUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUpdates() {
      try {
        const response = await fetch("http://localhost:5000/api/public/updates", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load updates.");
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setUpdates(data);
        } else {
          setUpdates(fallbackUpdates);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Using fallback updates data:", err.message);
          setUpdates(fallbackUpdates);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchUpdates();

    return () => controller.abort();
  }, []);

  const displayUpdates = updates.length > 0 ? updates : fallbackUpdates;

  return (
    <div className="w-full bg-slate-50 flex flex-col min-h-screen">
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
            <p className="text-sm font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-4">
              STAY INFORMED
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-foundation-primary to-[#213562]">Updates</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              Discover the recent initiatives, projects, and stories from the Sharda Welfare Foundation community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayUpdates.map((update) => {
              const articleSlug = update.slug || update.id;
              const articleImage = update.image_url || update.image;
              const articleDesc = update.short_desc || update.shortDesc;

              return (
                <div key={articleSlug} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] transition-all duration-300 border border-slate-100 flex flex-col group">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img 
                      src={articleImage} 
                      alt={update.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    {update.date_label && (
                      <p className="text-xs font-bold text-foundation-secondary uppercase tracking-wider mb-2">
                        {update.date_label}
                      </p>
                    )}
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 line-clamp-3">
                      {update.title}
                    </h3>
                    <p className="text-slate-600 mb-8 flex-grow line-clamp-3">
                      {articleDesc}
                    </p>
                    <Link 
                      to={`/latest-updates/${articleSlug}`}
                      className="inline-flex items-center text-foundation-secondary font-bold hover:text-pink-600 transition-colors group/link"
                    >
                      Read More 
                      <span className="ml-2 transform group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </div>
  );
}

export default LatestUpdates;
