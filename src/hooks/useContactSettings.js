import { useState, useEffect } from "react";
import { initialContactData } from "../data/contactData.js";

const PUBLIC_CONTACT_API_URL =
  typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api/public/contact`
    : "http://localhost:5000/api/public/contact";

let cachedContactSettings = null;
let cacheTimestamp = 0;
let inFlightContactPromise = null;
const listeners = new Set();
const CACHE_TTL_MS = 60000; // 1 minute cache TTL

/**
 * Format and merge API response with initialContactData fallback
 */
function normalizeContactData(data) {
  if (!data || typeof data !== "object") {
    return initialContactData;
  }
  return {
    ...initialContactData,
    ...data,
    additional_phones: Array.isArray(data.additional_phones) ? data.additional_phones : [],
    additional_emails: Array.isArray(data.additional_emails) ? data.additional_emails : [],
    additional_addresses: Array.isArray(data.additional_addresses) ? data.additional_addresses : [],
    social_links: Array.isArray(data.social_links)
      ? data.social_links
      : (initialContactData.social_links || []),
  };
}

/**
 * Fetch public contact settings from the backend API.
 * Deduplicates in-flight requests and caches results.
 * Falls back to initialContactData on network or server errors.
 */
export async function fetchPublicContactSettings(force = false) {
  if (!force && cachedContactSettings && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedContactSettings;
  }

  if (inFlightContactPromise) {
    return inFlightContactPromise;
  }

  inFlightContactPromise = fetch(PUBLIC_CONTACT_API_URL)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch contact settings: HTTP ${response.status}`);
      }

      const data = await response.json();
      const merged = normalizeContactData(data);

      cachedContactSettings = merged;
      cacheTimestamp = Date.now();

      // Notify all active hook subscribers
      listeners.forEach((callback) => {
        try {
          callback(merged);
        } catch {}
      });

      return merged;
    })
    .catch((err) => {
      console.warn("Using fallback contact settings:", err.message);
      return cachedContactSettings || initialContactData;
    })
    .finally(() => {
      inFlightContactPromise = null;
    });

  return inFlightContactPromise;
}

/**
 * Invalidate the cache (useful after saving changes in admin panel or tests).
 */
export function clearContactSettingsCache() {
  cachedContactSettings = null;
  cacheTimestamp = 0;
  inFlightContactPromise = null;
}

// Listen for cross-component update events dispatched from admin panel
if (typeof window !== "undefined") {
  window.addEventListener("contact-settings-updated", (event) => {
    if (event?.detail) {
      const merged = normalizeContactData(event.detail);
      cachedContactSettings = merged;
      cacheTimestamp = Date.now();
      listeners.forEach((callback) => {
        try {
          callback(merged);
        } catch {}
      });
    } else {
      clearContactSettingsCache();
      fetchPublicContactSettings(true);
    }
  });
}

/**
 * React hook to retrieve public contact settings with safe initial fallback.
 * Eliminates blank screens, prevents duplicate network calls, and syncs across components.
 */
export function useContactSettings() {
  const [contact, setContact] = useState(cachedContactSettings || initialContactData);
  const [loading, setLoading] = useState(!cachedContactSettings);

  useEffect(() => {
    let isMounted = true;

    const onUpdate = (data) => {
      if (isMounted) {
        setContact(data);
        setLoading(false);
      }
    };

    listeners.add(onUpdate);

    fetchPublicContactSettings().then((data) => {
      if (isMounted) {
        setContact(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      listeners.delete(onUpdate);
    };
  }, []);

  return { contact, loading };
}
