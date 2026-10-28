/**
 * Static fallback contact data for Sharda Welfare Foundation.
 * Preserves all existing public Contact page and Footer details.
 */

export const initialContactData = {
  helpline_number: "+91 88009 98844",
  helpline_tel: "+918800998844",
  footer_phone: "088009 98844",
  official_email: "info@shardawelfare.org",
  campus_address: "Plot No. 32, 34, Knowledge Park III, Greater Noida, Uttar Pradesh 201310",
  campus_address_multiline: "Sharda Welfare Foundation,\nPlot no 32, 34, Knowledge Park III,\nGreater Noida, Uttar Pradesh 201310",
  office_hours: "Mon – Sat, 9:00 AM – 6:00 PM IST",
  email_response_time: "Replies typically within 24–48 hours",
  whatsapp_number: "+91 88009 98844",
  whatsapp_url: "https://wa.me/918800998844?text=Hello%20Sharda%20Welfare%20Foundation%2C%20I%20would%20like%20to%20connect.",
  map_embed_url: "https://maps.google.com/maps?q=Sharda%20University,%20Plot%20no%2032,%2034,%20Knowledge%20Park%20III,%20Greater%20Noida,%20Uttar%20Pradesh%20201310&t=&z=15&ie=UTF8&iwloc=&output=embed",
  map_directions_url: "https://www.google.com/maps/dir/?api=1&destination=Sharda+University+Knowledge+Park+III+Greater+Noida",
  
  // Dynamic additional channels (default empty)
  additional_phones: [],
  additional_emails: [],
  additional_addresses: [],

  // Social Media accounts
  social_links: [
    {
      id: "social_twitter",
      platform: "twitter",
      label: "Twitter / X",
      url: "https://x.com",
      is_enabled: true,
      display_order: 1
    },
    {
      id: "social_instagram",
      platform: "instagram",
      label: "Instagram",
      url: "https://instagram.com",
      is_enabled: true,
      display_order: 2
    },
    {
      id: "social_facebook",
      platform: "facebook",
      label: "Facebook",
      url: "https://facebook.com",
      is_enabled: true,
      display_order: 3
    },
    {
      id: "social_youtube",
      platform: "youtube",
      label: "YouTube",
      url: "",
      is_enabled: false,
      display_order: 4
    },
    {
      id: "social_linkedin",
      platform: "linkedin",
      label: "LinkedIn",
      url: "",
      is_enabled: false,
      display_order: 5
    }
  ]
};

export const socialPlatformIcons = {
  twitter: {
    name: "Twitter / X",
    viewBox: "0 0 24 24",
    path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
  },
  instagram: {
    name: "Instagram",
    viewBox: "0 0 24 24",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
  },
  facebook: {
    name: "Facebook",
    viewBox: "0 0 24 24",
    path: "M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"
  },
  youtube: {
    name: "YouTube",
    viewBox: "0 0 24 24",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
  },
  linkedin: {
    name: "LinkedIn",
    viewBox: "0 0 24 24",
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
  }
};

/**
 * Validates whether a given URL is a non-empty HTTP/HTTPS URL.
 */
export function isValidUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

/**
 * Returns the URL if valid, or a safe fallback.
 */
export function getSafeUrl(url, fallback = "") {
  return isValidUrl(url) ? url.trim() : fallback;
}

/**
 * Cleans telephone number for use in tel: links.
 */
export function cleanTel(tel, fallback = "") {
  if (tel && typeof tel === "string" && tel.trim()) {
    return tel.replace(/[^\d+]/g, "");
  }
  if (fallback && typeof fallback === "string" && fallback.trim()) {
    return fallback.replace(/[^\d+]/g, "");
  }
  return "";
}

