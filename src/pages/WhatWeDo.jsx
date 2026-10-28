import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import suSehat from "../assets/suSehat.webp";
import suUjjwal from "../assets/suUjjwal.webp";
import suSambhavna from "../assets/suSambhavna.webp";
import suUnnati from "../assets/suUnnati.webp";
import suVision2 from "../assets/suVision2.webp";

function parseIntro(project) {
  if (Array.isArray(project.intro)) return project.intro;
  if (typeof project.intro === "string" && project.intro.trim()) {
    return project.intro
      .split(/\r?\n\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  if (typeof project.description === "string" && project.description.trim()) {
    return project.description
      .split(/\r?\n\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

function parseFocusAreas(project) {
  if (Array.isArray(project.focus_areas)) return project.focus_areas;
  if (typeof project.focus_areas === "string" && project.focus_areas.trim()) {
    try {
      const parsed = JSON.parse(project.focus_areas);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [];
    }
  }
  return [];
}

function WhatWeDo() {
  const { hash } = useLocation();

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  // Preserve existing section navigation
  useEffect(() => {
    if (hash) {
      const cleanId = hash.replace(/[^a-zA-Z0-9_-]/g, "");
      if (!cleanId) return;

      const timer = setTimeout(() => {
        const element = document.getElementById(cleanId);

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [hash]);

  // Fetch published projects from the local backend
  useEffect(() => {
    const controller = new AbortController();

    async function fetchPublishedProjects() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/public/projects",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load published projects.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid projects response.");
        }

        setProjects(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching published projects:", error);
          setProjectsError("Projects are temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setProjectsLoading(false);
        }
      }
    }

    fetchPublishedProjects();

    return () => controller.abort();
  }, []);

  // Existing website programs — preserved
  const programs = [
    {
      id: "sehat",
      title: "SEHAT",
      subtitle: "Transforming Healthcare for the Vulnerable",
      image: suSehat,
      intro: [
        "The SEHAT program is dedicated to addressing the pressing healthcare challenges faced by economically disadvantaged communities in our nation. Our primary focus is on enhancing maternal and child health, recognizing the vital importance of this demographic.",
        "Our vision is to empower women and protect the well-being of children by improving healthcare facilities and fostering awareness about healthy living.",
      ],
      points: [
        {
          title: "Bridging the Healthcare Gap",
          desc: "We are committed to reducing disparities in healthcare access, ensuring that the underserved can receive the care they need.",
        },
        {
          title: "Ensuring Accessible Healthcare",
          desc: "Our goal is to make healthcare more accessible to all, regardless of their economic circumstances.",
        },
        {
          title: "Promoting Preventive Healthcare",
          desc: "We believe in the power of prevention. Our efforts are directed towards raising awareness about preventive healthcare practices to improve overall well-being.",
        },
        {
          title: "Capacity Building",
          desc: "We aim to strengthen healthcare infrastructure and empower individuals with the knowledge and skills needed for a healthier life.",
        },
      ],
      conclusion:
        "Join us in our mission to create a society where every individual can access quality healthcare, enabling them to lead healthier and happier lives. Reality is made out of this vision, together.",
    },
    {
      id: "ujjawal",
      title: "UJJAWAL",
      subtitle: "Illuminating Pathways to Education and Learning",
      image: suUjjwal,
      intro: [
        "The UJJAWAL program is a steadfast commitment to education and the enrichment of learning capabilities. We firmly believe that education serves as the foundation for individual growth, social advancement, and economic prosperity.",
        "Through UJJAWAL, our mission is to ensure equitable access to high-quality education while nurturing the innate learning potential of every individual.",
      ],
      points: [
        {
          title: "Equitable Quality Education",
          desc: "We are dedicated to providing equal access to quality education for all, breaking down barriers and creating opportunities for a brighter future.",
        },
        {
          title: "Enhancing Learning Abilities",
          desc: "Our efforts extend beyond access, as we work to cultivate and enhance the innate learning abilities of individuals, unlocking their full potential.",
        },
      ],
      conclusion:
        "Join us on our journey to unlock the potential of individuals, empower communities, and forge a future where equal opportunities for success are a reality for everyone. Your support is instrumental in making this vision come to life.",
    },
    {
      id: "sambhavana",
      title: "SAMBHAVANA",
      subtitle: "Empowering with Skills for a Brighter Tomorrow",
      image: suSambhavna,
      intro: [
        "The SAMBHAVANA program is dedicated to skill development, with a particular focus on equipping individuals, especially women, with practical skills that enhance their employability and foster socio-economic growth.",
        "Our commitment lies in providing comprehensive skill development programs that are closely aligned with market demands, ensuring that participants gain industry-relevant knowledge and expertise.",
      ],
      points: [
        {
          title: "Skill Enhancement",
          desc: "We are dedicated to enhancing the skills of individuals, empowering them with the tools they need to excel in the job market.",
        },
        {
          title: "Industry-Relevant Training",
          desc: "Our programs are designed to provide training that directly aligns with the needs of industries, ensuring that participants are well-prepared for the workforce.",
        },
        {
          title: "Career Pathway Guidance",
          desc: "We offer guidance and support to help participants chart their career paths, making informed decisions about their professional journeys.",
        },
        {
          title: "Mentorship and Support",
          desc: "We provide mentorship to facilitate growth and offer the necessary support to help participants thrive.",
        },
      ],
      conclusion:
        "Join us in our mission to empower individuals with the skills they need to excel in the job market, attain economic independence, and contribute to the prosperity of their communities. With SAMBHAVANA, we believe in unlocking the potential of individuals and enabling them to build a brighter and more promising future.",
    },
    {
      id: "unnati",
      title: "UNNATI",
      subtitle: "Cultivating Environmental Change Leaders",
      image: suUnnati,
      intro: [
        "The UNNATI program is wholeheartedly committed to nurturing change leaders who advocate for environmental protection and the promotion of sustainable consumption practices.",
        "We firmly believe in the potential of individuals to initiate positive change and leave a lasting imprint on the environment.",
      ],
      points: [
        {
          title: "Environmental Education and Awareness",
          desc: "Our program aims to educate and raise awareness about critical environmental issues, empowering individuals with knowledge to drive informed decisions.",
        },
        {
          title: "Building Sustainable Consumption Habits",
          desc: "We work to instil and promote sustainable consumption practices that reduce environmental impact and ensure a greener future.",
        },
        {
          title: "Developing Change Leaders",
          desc: "UNNATI focuses on grooming individuals to become leaders in environmental protection, equipping them with the skills and knowledge needed to drive positive change.",
        },
        {
          title: "Community Engagement and Collaboration",
          desc: "We actively engage with communities and foster collaboration to create a collective force for environmental well-being.",
        },
      ],
      conclusion:
        "Join us in our mission to nurture change leaders for environmental protection and to promote sustainable consumption. Together, we can take significant steps toward a more sustainable and environmentally conscious world.",
    },
    {
      id: "bharosa",
      title: "BHAROSA",
      subtitle: "Empowering Communities through Justice and Accountability",
      image: suVision2,
      intro: [
        "The BHAROSA program is dedicated to empowering communities by fostering legal awareness, providing access to justice, and fortifying institutions to establish an accountability mechanism.",
        "We firmly believe that access to justice and a robust accountability framework are fundamental pillars of a just and equitable society.",
      ],
      points: [
        {
          title: "Legal Awareness",
          desc: "Our efforts centre on raising awareness about legal rights and responsibilities, ensuring individuals are informed and empowered.",
        },
        {
          title: "Access to Justice",
          desc: "We strive to make justice accessible to all, irrespective of their background, ensuring that individuals have a voice and recourse in the legal system.",
        },
        {
          title: "Strengthening Institutions",
          desc: "We work to enhance the capabilities and integrity of institutions that play a critical role in ensuring justice and accountability.",
        },
        {
          title: "Building an Accountability Mechanism",
          desc: "Our goal is to establish mechanisms that hold individuals and organizations accountable for their actions, contributing to a fair and responsible society.",
        },
        {
          title: "Community Empowerment",
          desc: "We empower communities to actively engage in matters of justice and accountability, fostering a sense of ownership and participation.",
        },
      ],
      conclusion:
        "Through targeted interventions, BHAROSA aims to build a society rooted in fairness and responsibility.",
    },
  ];

  return (
    <div className="flex w-full flex-col bg-white">
      {/* INTRO SECTION */}
      <section className="relative overflow-hidden bg-slate-50 py-20 md:py-32">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-foundation-secondary">
            OUR INITIATIVES
          </p>

          <h2 className="mb-10 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Driving Positive <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-foundation-primary to-[#213562] bg-clip-text text-transparent">
              Social Change
            </span>
          </h2>

          <div className="space-y-6 text-lg font-medium leading-relaxed text-slate-600">
            <p>
              At Sharda Welfare Foundation, our unwavering commitment is to
              drive positive social change through a diverse range of
              initiatives and interventions. We work diligently across various
              sectors, with a special focus on key areas that are pivotal to
              transforming lives. These areas include healthcare, education,
              skill development, environmental sustainability, and legal aid.
            </p>

            <p>
              Our aim is to make a meaningful and lasting impact on the
              communities we serve, fostering a brighter and more equitable
              future. We invite you to explore our initiatives and join us in
              our mission to create a better world for all.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foundation-secondary/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-foundation-primary/5 blur-3xl" />
      </section>

      {/* EXISTING PROGRAM SECTIONS */}
      {programs.map((program, index) => {
        const isEven = index % 2 === 0;

        return (
          <section
            id={program.id}
            key={program.id}
            className="scroll-mt-24 py-20 md:py-32"
          >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div
                className={`flex flex-col items-center gap-12 lg:gap-20 ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Image */}
                <div className="group relative w-full lg:w-1/2">
                  <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 transform rounded-[3rem] bg-gradient-to-br from-foundation-primary/20 to-foundation-secondary/20 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6" />

                  <div className="relative aspect-square overflow-hidden rounded-[3rem] shadow-xl md:aspect-[4/3] lg:aspect-square">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="h-full w-full transform object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-slate-900/10 transition-colors duration-500 group-hover:bg-transparent" />
                  </div>
                </div>

                {/* Program content */}
                <div className="w-full lg:w-1/2">
                  <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-foundation-secondary">
                    {program.title}
                  </p>

                  <h2 className="mb-6 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
                    {program.subtitle}
                  </h2>

                  <div className="mb-10 space-y-4 font-medium leading-relaxed text-slate-600">
                    {program.intro.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  <div className="mb-8 rounded-3xl border border-slate-100 bg-slate-50 p-8">
                    <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-slate-900">
                      Core Focus Areas
                    </h3>

                    <ul className="space-y-6">
                      {program.points.map((point, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-foundation-primary/10 text-sm font-bold text-foundation-primary">
                            {i + 1}
                          </span>

                          <div>
                            <strong className="mb-1 block text-slate-900">
                              {point.title}
                            </strong>

                            <p className="text-sm leading-relaxed text-slate-600">
                              {point.desc}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="font-medium italic text-slate-600">
                    {program.conclusion}
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ADMIN-MANAGED PROJECTS: CONTINUE THE EXISTING INITIATIVES SEQUENCE */}
      {!projectsLoading && !projectsError && projects.map((project, index) => {
        const isEven = (programs.length + index) % 2 === 0;
        const introParagraphs = parseIntro(project);
        const focusAreas = parseFocusAreas(project);
        const sectionId = project.title
          ? project.title.toLowerCase().replace(/[^a-z0-9_-]+/g, "-")
          : `project-${project.id}`;

        return (
          <section
            id={sectionId}
            key={`project-${project.id}`}
            className="scroll-mt-24 py-20 md:py-32"
          >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div
                className={`flex flex-col items-center gap-12 lg:gap-20 ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Initiative Image */}
                <div className="group relative w-full lg:w-1/2">
                  <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 transform rounded-[3rem] bg-gradient-to-br from-foundation-primary/20 to-foundation-secondary/20 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6" />

                  <div className="relative aspect-square overflow-hidden rounded-[3rem] shadow-xl md:aspect-[4/3] lg:aspect-square">
                    <img
                      src={project.image_url || "/about.webp"}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full transform object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-slate-900/10 transition-colors duration-500 group-hover:bg-transparent" />
                  </div>
                </div>

                {/* Initiative Content */}
                <div className="w-full lg:w-1/2">
                  <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-foundation-secondary">
                    {project.title}
                  </p>

                  <h2 className="mb-6 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
                    {project.subtitle || project.title}
                  </h2>

                  {introParagraphs.length > 0 && (
                    <div className="mb-10 space-y-4 font-medium leading-relaxed text-slate-600">
                      {introParagraphs.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}

                  {focusAreas.length > 0 && (
                    <div className="mb-8 rounded-3xl border border-slate-100 bg-slate-50 p-8">
                      <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-slate-900">
                        Core Focus Areas
                      </h3>

                      <ul className="space-y-6">
                        {focusAreas.map((point, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-foundation-primary/10 text-sm font-bold text-foundation-primary">
                              {i + 1}
                            </span>

                            <div>
                              {point.title && (
                                <strong className="mb-1 block text-slate-900">
                                  {point.title}
                                </strong>
                              )}

                              {point.desc && (
                                <p className="text-sm leading-relaxed text-slate-600">
                                  {point.desc}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.conclusion && (
                    <p className="font-medium italic text-slate-600">
                      {project.conclusion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* EXISTING CLOSING CTA */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[3rem] bg-foundation-primary px-8 py-20 shadow-2xl lg:px-16">
            <div
              className="pointer-events-none absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat opacity-[0.05] mix-blend-screen"
              style={{ backgroundImage: "url('/hero-banner.webp')" }}
            />

            <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 transform rounded-full bg-foundation-secondary/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-10 md:flex-row">
              <div className="max-w-2xl text-left">
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-foundation-secondary">
                  BE PART OF THE CHANGE
                </p>

                <h2 className="mb-4 text-3xl font-extrabold text-white md:text-5xl">
                  Together, We Can Build a More Equitable Future.
                </h2>
              </div>

              <Link
                to="/contact"
                className="group inline-flex flex-shrink-0 transform items-center justify-center rounded-full bg-foundation-secondary px-8 py-5 text-lg font-bold text-white shadow-[0_8px_30px_rgba(233,84,124,0.4)] transition-all duration-300 hover:-translate-y-1 hover:bg-pink-600 hover:shadow-[0_12px_40px_rgba(233,84,124,0.6)]"
              >
                Get Involved
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WhatWeDo;