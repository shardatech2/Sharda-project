import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_BASE_URL = 'https://shardawelfare.org';
const DEFAULT_TITLE = 'Sharda Welfare Foundation | Empowering Communities, Transforming Lives';
const DEFAULT_DESCRIPTION = 'Sharda Welfare Foundation is a non-profit organization dedicated to grassroots healthcare, inclusive education, skill development, and community welfare.';
const DEFAULT_IMAGE = `${DEFAULT_BASE_URL}/about.webp`;
const DEFAULT_KEYWORDS = 'Sharda Welfare Foundation, NGO Greater Noida, healthcare NGO, child education charity, SEHAT healthcare, Ujjawal education, community health camps, free health screening';

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  breadcrumb = []
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Document Title
    const finalTitle = title 
      ? (title.includes('Sharda Welfare') ? title : `${title} | Sharda Welfare Foundation`)
      : DEFAULT_TITLE;
    document.title = finalTitle;

    // Helper to safely set meta attributes
    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          element.setAttribute('name', selector.replace(/meta\[name=['"]?|['"]?\]/g, ''));
        } else if (selector.startsWith('meta[property=')) {
          element.setAttribute('property', selector.replace(/meta\[property=['"]?|['"]?\]/g, ''));
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    const finalDesc = description || DEFAULT_DESCRIPTION;
    const finalKeywords = keywords || DEFAULT_KEYWORDS;
    const currentCanonical = canonical || `${DEFAULT_BASE_URL}${location.pathname}`;
    const finalImage = ogImage 
      ? (ogImage.startsWith('http') ? ogImage : `${DEFAULT_BASE_URL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`)
      : DEFAULT_IMAGE;

    // 2. Primary Meta Tags
    setMetaTag('meta[name="description"]', 'content', finalDesc);
    setMetaTag('meta[name="keywords"]', 'content', finalKeywords);
    setMetaTag('meta[name="title"]', 'content', finalTitle);

    // 3. Canonical Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentCanonical);

    // 4. Open Graph Meta Tags
    setMetaTag('meta[property="og:title"]', 'content', finalTitle);
    setMetaTag('meta[property="og:description"]', 'content', finalDesc);
    setMetaTag('meta[property="og:url"]', 'content', currentCanonical);
    setMetaTag('meta[property="og:image"]', 'content', finalImage);
    setMetaTag('meta[property="og:type"]', 'content', ogType);

    // 5. Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:title"]', 'content', finalTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', finalDesc);
    setMetaTag('meta[name="twitter:image"]', 'content', finalImage);
    setMetaTag('meta[name="twitter:url"]', 'content', currentCanonical);

    // 6. Optional Breadcrumb Schema (JSON-LD)
    let breadcrumbScript = document.getElementById('dynamic-breadcrumb-schema');
    if (breadcrumb && breadcrumb.length > 0) {
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement('script');
        breadcrumbScript.id = 'dynamic-breadcrumb-schema';
        breadcrumbScript.type = 'application/ld+json';
        document.head.appendChild(breadcrumbScript);
      }

      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumb.map((item, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': item.label,
          ...(item.link ? { 'item': `${DEFAULT_BASE_URL}${item.link}` } : {})
        }))
      };

      breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
    } else if (breadcrumbScript) {
      breadcrumbScript.remove();
    }

  }, [title, description, keywords, canonical, ogImage, ogType, breadcrumb, location.pathname]);

  return null;
};

export default SEO;
