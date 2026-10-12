import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const cleanId = hash.replace(/[^a-zA-Z0-9_-]/g, '');
      if (!cleanId) return;

      const scrollToElement = () => {
        const element = document.getElementById(cleanId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

      // Try immediately and with timeouts to ensure DOM elements are mounted
      scrollToElement();
      const t1 = setTimeout(scrollToElement, 100);
      const t2 = setTimeout(scrollToElement, 300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
