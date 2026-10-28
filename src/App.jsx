import './App.css'
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from './admin/AdminLogin';
import { useLocation, Navigate } from 'react-router-dom'
import About from './pages/About'
import OurStory from './pages/OurStory'
import OurRole from './pages/OurRole'
import VisionMission from './pages/VisionMission'
import UpdateDetail from './pages/UpdateDetail'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Contact from './pages/Contact'
import Leadership from './pages/Leadership'
import WhatWeDo from './pages/WhatWeDo'
import LatestUpdates from './pages/LatestUpdates'
import Navbar from './components/Navbar';
import Home from './pages/Home';

import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import PageHeader from './components/PageHeader';
import SEO from './components/SEO';

function App() {
  const location = useLocation();

if (location.pathname === "/admin") {
  return <AdminLogin />;
}

if (location.pathname === "/admin/dashboard") {
  const token = sessionStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return <AdminDashboard />;
}

  const getPageConfig = () => {
    switch (location.pathname) {
      case "/":
        return {
          title: "Sharda Welfare Foundation | Empowering Communities, Transforming Lives",
          description: "Sharda Welfare Foundation drives grassroots social change through accessible healthcare, inclusive child education, skill development, and environmental sustainability.",
          keywords: "Sharda Welfare Foundation, NGO Greater Noida, healthcare NGO, child education charity, SEHAT healthcare, Ujjawal education, community health camps",
          ogImage: "/about.webp"
        };
      case "/what-we-do":
        return {
          title: "What We Do | Healthcare, Education & Skill Development",
          description: "Explore our flagship initiatives: SEHAT (Healthcare), UJJAWAL (Education), SAMBHAVANA (Skill Development), UNNATI (Environment), and BHAROSA (Justice & Accountability).",
          keywords: "SEHAT healthcare, Ujjawal education, Sambhavana skill development, Unnati environment, Bharosa, NGO programs, free medical camps",
          ogImage: "/sehat.webp",
          breadcrumb: [{label: "Home", link: "/"}, {label: "Our Work"}, {label: "What We Do"}]
        };
      case "/about":
        return {
          title: "About Us | Our Mission & Guiding Principles",
          description: "Learn about Sharda Welfare Foundation, our mission to reach the unreached, and our collective efforts to build an equitable tomorrow.",
          keywords: "about Sharda Welfare Foundation, NGO mission, non-profit organization Greater Noida, community welfare trust",
          ogImage: "/about.webp",
          breadcrumb: [{label: "Home", link: "/"}, {label: "About Us"}]
        };
      case "/our-story":
        return {
          title: "Our Story | Grassroots Journey of Compassion",
          description: "Discover how Sharda Welfare Foundation grew into a trusted pillar of healthcare, education, and community support for vulnerable families.",
          keywords: "our story, Sharda Welfare journey, community welfare history, social welfare impact India",
          ogImage: "/story.webp",
          breadcrumb: [{label: "Home", link: "/"}, {label: "Our Story"}]
        };
      case "/our-role":
        return {
          title: "Our Role | Empowering Marginalized Communities",
          description: "Understanding our role as a bridge between specialized medical care, quality education resources, and underserved communities.",
          keywords: "our role in community, social responsibility, grassroots development NGO, public health outreach",
          ogImage: "/role1.webp",
          breadcrumb: [{label: "Home", link: "/"}, {label: "Our Role"}]
        };
      case "/vision-mission":
        return {
          title: "Vision & Mission | Our Guiding Compass",
          description: "Our vision is an inclusive, healthier society where every individual has equitable access to healthcare, education, and economic dignity.",
          keywords: "vision and mission, NGO objectives, charitable foundation goals, social welfare vision",
          ogImage: "/vision.webp",
          breadcrumb: [{label: "Home", link: "/"}, {label: "Vision & Mission"}]
        };
      case "/leadership":
        return {
          title: "Our Leadership | Visionary Changemakers",
          description: "Meet the trustees and leadership of Sharda Welfare Foundation dedicated to education, healthcare, and social upliftment.",
          keywords: "Sharda Welfare leadership, Pradeep Kumar Gupta Chancellor, Yatendra Kumar Gupta, Prashant Gupta CEO, Sharda trustees",
          ogImage: "/p.k.gupta.webp",
          breadcrumb: [{label: "Home", link: "/"}, {label: "About Us"}, {label: "Our Leadership"}]
        };
      case "/latest-updates":
        return {
          title: "Latest Updates & Field Stories | Community Impact",
          description: "Browse reports, doctor screenings, school health camps, and grassroots milestones from our ongoing on-ground drives.",
          keywords: "Sharda Welfare news, mega health camp updates, community health drives, school screening reports",
          ogImage: "/latest-updates/story1.webp",
          breadcrumb: [{label: "Home", link: "/"}, {label: "Latest Updates"}]
        };
      case "/contact":
        return {
          title: "Contact Us & Volunteer | Helpline & Campus Desk",
          description: "Connect directly with Sharda Welfare Foundation. Call +91 88009 98844, email info@shardawelfare.org, or volunteer with our ground team.",
          keywords: "contact Sharda Welfare, volunteer NGO Greater Noida, donate, collaborate, Sharda University contact",
          ogImage: "/about.webp",
          breadcrumb: [{label: "Home", link: "/"}, {label: "Contact"}]
        };
      case "/privacy-policy":
        return {
          title: "Privacy Policy",
          description: "Our privacy policy explains how Sharda Welfare Foundation protects your personal data and privacy.",
          breadcrumb: [{label: "Home", link: "/"}, {label: "Privacy Policy"}]
        };
      case "/terms-of-service":
        return {
          title: "Terms of Service",
          description: "Terms and conditions governing the use of the Sharda Welfare Foundation official website.",
          breadcrumb: [{label: "Home", link: "/"}, {label: "Terms of Service"}]
        };
      default:
        return null;
    }
  };

  const renderPage = () => {
    if (location.pathname.startsWith("/latest-updates/") && location.pathname !== "/latest-updates") {
      return <UpdateDetail />;
    }

    switch (location.pathname) {
      case "/what-we-do": return <WhatWeDo />;
      case "/sehat": return <Navigate to="/what-we-do#sehat" replace />;
      case "/ujjawal": return <Navigate to="/what-we-do#ujjawal" replace />;
      case "/sambhavana": return <Navigate to="/what-we-do#sambhavana" replace />;
      case "/unnati": return <Navigate to="/what-we-do#unnati" replace />;
      case "/mega-school-health-drive": return <Navigate to="/what-we-do" replace />;
      case "/about": return <About />;
      case "/our-story": return <OurStory />;
      case "/our-role": return <OurRole />;
      case "/vision-mission": return <VisionMission />;
      case "/leadership": return <Leadership />;
      case "/latest-updates": return <LatestUpdates />;
      case "/privacy-policy": return <PrivacyPolicy />;
      case "/terms-of-service": return <TermsOfService />;
      case "/contact": return <Contact />;
      default: return <Home />;
    }
  };

  const pageConfig = getPageConfig();
  const isArticlePage = location.pathname.startsWith("/latest-updates/") && location.pathname !== "/latest-updates";

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isArticlePage && pageConfig && <SEO {...pageConfig} />}
      <Navbar />
      <main className="flex-grow">
        {pageConfig?.breadcrumb && location.pathname !== "/" && (
          <PageHeader title={pageConfig.title} breadcrumb={pageConfig.breadcrumb} />
        )}
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}

export default App