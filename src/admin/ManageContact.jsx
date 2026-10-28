import { useEffect, useState } from "react";
import { socialPlatformIcons } from "../data/contactData";

const CONTACT_API_URL = "http://localhost:5000/api/contact";

function ManageContact({ getToken, onSettingsUpdated }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    helpline_number: "",
    helpline_tel: "",
    footer_phone: "",
    official_email: "",
    campus_address: "",
    campus_address_multiline: "",
    office_hours: "",
    email_response_time: "",
    whatsapp_number: "",
    whatsapp_url: "",
    map_embed_url: "",
    map_directions_url: "",
    additional_phones: [],
    additional_emails: [],
    additional_addresses: [],
    social_links: [],
  });

  // Fetch settings on mount
  useEffect(() => {
    loadContactSettings();
  }, []);

  async function loadContactSettings() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const res = await fetch(CONTACT_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load contact settings.");
      }

      setForm({
        helpline_number: data.helpline_number || "",
        helpline_tel: data.helpline_tel || "",
        footer_phone: data.footer_phone || "",
        official_email: data.official_email || "",
        campus_address: data.campus_address || "",
        campus_address_multiline: data.campus_address_multiline || "",
        office_hours: data.office_hours || "",
        email_response_time: data.email_response_time || "",
        whatsapp_number: data.whatsapp_number || "",
        whatsapp_url: data.whatsapp_url || "",
        map_embed_url: data.map_embed_url || "",
        map_directions_url: data.map_directions_url || "",
        additional_phones: Array.isArray(data.additional_phones) ? data.additional_phones : [],
        additional_emails: Array.isArray(data.additional_emails) ? data.additional_emails : [],
        additional_addresses: Array.isArray(data.additional_addresses) ? data.additional_addresses : [],
        social_links: Array.isArray(data.social_links) ? data.social_links : [],
      });
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ==========================================
  // Additional Phones Handlers
  // ==========================================
  function addPhone() {
    setForm((prev) => ({
      ...prev,
      additional_phones: [
        ...prev.additional_phones,
        {
          id: `phone_${Date.now()}`,
          label: "",
          phone: "",
          tel: "",
        },
      ],
    }));
  }

  function updatePhone(index, field, value) {
    setForm((prev) => {
      const updated = [...prev.additional_phones];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "phone" && !updated[index].tel) {
        updated[index].tel = value.replace(/[\s-]/g, "");
      }
      return { ...prev, additional_phones: updated };
    });
  }

  function deletePhone(index) {
    setForm((prev) => ({
      ...prev,
      additional_phones: prev.additional_phones.filter((_, i) => i !== index),
    }));
  }

  // ==========================================
  // Additional Emails Handlers
  // ==========================================
  function addEmail() {
    setForm((prev) => ({
      ...prev,
      additional_emails: [
        ...prev.additional_emails,
        {
          id: `email_${Date.now()}`,
          label: "",
          email: "",
        },
      ],
    }));
  }

  function updateEmail(index, field, value) {
    setForm((prev) => {
      const updated = [...prev.additional_emails];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, additional_emails: updated };
    });
  }

  function deleteEmail(index) {
    setForm((prev) => ({
      ...prev,
      additional_emails: prev.additional_emails.filter((_, i) => i !== index),
    }));
  }

  // ==========================================
  // Additional Addresses Handlers
  // ==========================================
  function addAddress() {
    setForm((prev) => ({
      ...prev,
      additional_addresses: [
        ...prev.additional_addresses,
        {
          id: `addr_${Date.now()}`,
          title: "",
          address: "",
          phone: "",
        },
      ],
    }));
  }

  function updateAddress(index, field, value) {
    setForm((prev) => {
      const updated = [...prev.additional_addresses];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, additional_addresses: updated };
    });
  }

  function deleteAddress(index) {
    setForm((prev) => ({
      ...prev,
      additional_addresses: prev.additional_addresses.filter((_, i) => i !== index),
    }));
  }

  // ==========================================
  // Social Media Links Handlers
  // ==========================================
  function updateSocialLink(index, field, value) {
    setForm((prev) => {
      const updated = [...prev.social_links];
      updated[index] = { ...updated[index], [field]: value };
      // If user clears URL, auto-disable to prevent broken links
      if (field === "url" && !value.trim()) {
        updated[index].is_enabled = false;
      }
      return { ...prev, social_links: updated };
    });
  }

  function toggleSocialEnabled(index) {
    setForm((prev) => {
      const updated = [...prev.social_links];
      const current = updated[index];
      const willEnable = !current.is_enabled;

      // Rule: Keep empty URLs disabled; warn if enabling with no URL
      if (willEnable && (!current.url || !current.url.trim())) {
        setError(
          `Please provide an official URL for ${current.label || current.platform} before enabling it.`
        );
        return prev;
      }

      setError("");
      updated[index] = { ...current, is_enabled: willEnable };
      return { ...prev, social_links: updated };
    });
  }

  function moveSocialLink(index, direction) {
    setForm((prev) => {
      const list = [...prev.social_links];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;

      // Re-assign display_order sequentially
      const reordered = list.map((item, idx) => ({
        ...item,
        display_order: idx + 1,
      }));

      return { ...prev, social_links: reordered };
    });
  }

  function addSocialPlatform() {
    setForm((prev) => {
      const nextOrder = prev.social_links.length + 1;
      return {
        ...prev,
        social_links: [
          ...prev.social_links,
          {
            id: `social_${Date.now()}`,
            platform: "custom",
            label: "New Platform",
            url: "",
            is_enabled: false,
            display_order: nextOrder,
          },
        ],
      };
    });
  }

  function deleteSocialPlatform(index) {
    setForm((prev) => {
      const filtered = prev.social_links.filter((_, i) => i !== index);
      const reordered = filtered.map((item, idx) => ({
        ...item,
        display_order: idx + 1,
      }));
      return { ...prev, social_links: reordered };
    });
  }

  // ==========================================
  // Validation and Submission
  // ==========================================
  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return; // Prevent duplicate submissions

    setError("");
    setMessage("");

    // Required field validation
    if (!form.helpline_number.trim()) {
      setError("Helpline number is required.");
      return;
    }
    if (!form.official_email.trim()) {
      setError("Official email address is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.official_email.trim())) {
      setError("Please provide a valid official email address.");
      return;
    }
    if (!form.campus_address.trim()) {
      setError("Campus address is required.");
      return;
    }

    // Additional emails validation
    for (let i = 0; i < form.additional_emails.length; i++) {
      const em = form.additional_emails[i];
      if (em.email && !emailRegex.test(em.email.trim())) {
        setError(`Additional email #${i + 1} ("${em.label || "Email"}") has an invalid email format.`);
        return;
      }
    }

    // Social links validation: enabled platforms must have valid http/https URLs
    for (let i = 0; i < form.social_links.length; i++) {
      const item = form.social_links[i];
      if (item.is_enabled) {
        if (!item.url || !item.url.trim()) {
          setError(
            `Social link #${i + 1} (${item.label || item.platform}) is enabled but has an empty URL. Please enter an official URL or disable it.`
          );
          return;
        }
        if (!item.url.startsWith("http://") && !item.url.startsWith("https://")) {
          setError(
            `Social link #${i + 1} (${item.label || item.platform}) URL must start with http:// or https://.`
          );
          return;
        }
      }
    }

    setSaving(true);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const res = await fetch(CONTACT_API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update contact settings.");
      }

      setMessage("Contact settings updated and saved successfully!");
      if (data.settings) {
        setForm({
          helpline_number: data.settings.helpline_number || "",
          helpline_tel: data.settings.helpline_tel || "",
          footer_phone: data.settings.footer_phone || "",
          official_email: data.settings.official_email || "",
          campus_address: data.settings.campus_address || "",
          campus_address_multiline: data.settings.campus_address_multiline || "",
          office_hours: data.settings.office_hours || "",
          email_response_time: data.settings.email_response_time || "",
          whatsapp_number: data.settings.whatsapp_number || "",
          whatsapp_url: data.settings.whatsapp_url || "",
          map_embed_url: data.settings.map_embed_url || "",
          map_directions_url: data.settings.map_directions_url || "",
          additional_phones: Array.isArray(data.settings.additional_phones) ? data.settings.additional_phones : [],
          additional_emails: Array.isArray(data.settings.additional_emails) ? data.settings.additional_emails : [],
          additional_addresses: Array.isArray(data.settings.additional_addresses) ? data.settings.additional_addresses : [],
          social_links: Array.isArray(data.settings.social_links) ? data.settings.social_links : [],
        });
      }

      if (typeof onSettingsUpdated === "function") {
        onSettingsUpdated(data.settings);
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("contact-settings-updated", { detail: data.settings })
        );
      }
    } catch (err) {
      setError(err.message || "Unable to save contact settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 text-gray-600">
          <svg className="h-6 w-6 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="font-medium text-sm">Loading contact configuration from server...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16 sm:pb-20">
      {/* Notifications */}
      {error && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-700 flex items-start gap-3">
          <span className="text-red-500 font-bold">✕</span>
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => setError("")} className="text-red-400 hover:text-red-700">×</button>
        </div>
      )}

      {message && (
        <div role="status" className="rounded-xl bg-green-50 p-4 border border-green-200 text-sm text-green-700 flex items-start gap-3">
          <span className="text-green-500 font-bold">✓</span>
          <span className="flex-1">{message}</span>
          <button type="button" onClick={() => setMessage("")} className="text-green-400 hover:text-green-700">×</button>
        </div>
      )}

      {/* ==============================================================
          Section 1: Primary Contact Information
      ============================================================== */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Primary Contact Information</h3>
          <p className="text-xs text-gray-500 mt-1">
            Official telephone helpline, email, visiting hours, and response promises.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Helpline Number */}
          <div>
            <label htmlFor="helpline_number" className="block text-sm font-medium text-gray-700 mb-1">
              Helpline Number (Display) *
            </label>
            <input
              type="text"
              id="helpline_number"
              name="helpline_number"
              value={form.helpline_number}
              onChange={handleFieldChange}
              required
              placeholder="+91 88009 98844"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            <p className="text-xs text-gray-400 mt-1">Displayed on the Contact Us cards and header banners.</p>
          </div>

          {/* Helpline Dialer Tel */}
          <div>
            <label htmlFor="helpline_tel" className="block text-sm font-medium text-gray-700 mb-1">
              Helpline Dialer URI (tel:)
            </label>
            <input
              type="text"
              id="helpline_tel"
              name="helpline_tel"
              value={form.helpline_tel}
              onChange={handleFieldChange}
              placeholder="+918800998844"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            <p className="text-xs text-gray-400 mt-1">Raw dialer format for mobile click-to-call.</p>
          </div>

          {/* Footer Phone */}
          <div>
            <label htmlFor="footer_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Footer Phone Number
            </label>
            <input
              type="text"
              id="footer_phone"
              name="footer_phone"
              value={form.footer_phone}
              onChange={handleFieldChange}
              placeholder="088009 98844"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            <p className="text-xs text-gray-400 mt-1">Formatted phone display in the website global footer.</p>
          </div>

          {/* Official Email */}
          <div>
            <label htmlFor="official_email" className="block text-sm font-medium text-gray-700 mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              id="official_email"
              name="official_email"
              value={form.official_email}
              onChange={handleFieldChange}
              required
              placeholder="info@shardawelfare.org"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            <p className="text-xs text-gray-400 mt-1">Inquiries and correspondence address.</p>
          </div>

          {/* Office Hours */}
          <div>
            <label htmlFor="office_hours" className="block text-sm font-medium text-gray-700 mb-1">
              Office / Operating Hours
            </label>
            <input
              type="text"
              id="office_hours"
              name="office_hours"
              value={form.office_hours}
              onChange={handleFieldChange}
              placeholder="Mon – Sat, 9:00 AM – 6:00 PM IST"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Email Response Time */}
          <div>
            <label htmlFor="email_response_time" className="block text-sm font-medium text-gray-700 mb-1">
              Email Response Guarantee
            </label>
            <input
              type="text"
              id="email_response_time"
              name="email_response_time"
              value={form.email_response_time}
              onChange={handleFieldChange}
              placeholder="Replies typically within 24–48 hours"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Support Number
            </label>
            <input
              type="text"
              id="whatsapp_number"
              name="whatsapp_number"
              value={form.whatsapp_number}
              onChange={handleFieldChange}
              placeholder="+91 88009 98844"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* WhatsApp Direct URL */}
          <div>
            <label htmlFor="whatsapp_url" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Direct Chat Link (wa.me)
            </label>
            <input
              type="text"
              id="whatsapp_url"
              name="whatsapp_url"
              value={form.whatsapp_url}
              onChange={handleFieldChange}
              placeholder="https://wa.me/918800998844?text=..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* ==============================================================
          Section 2: Campus Address & Google Maps Integration
      ============================================================== */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Campus Address & Maps Integration</h3>
          <p className="text-xs text-gray-500 mt-1">
            Physical campus location, multiline postal formatting, and embedded Google Maps coordinates.
          </p>
        </div>

        <div className="space-y-5">
          {/* Single-line Campus Address */}
          <div>
            <label htmlFor="campus_address" className="block text-sm font-medium text-gray-700 mb-1">
              Campus Address (Single Line) *
            </label>
            <input
              type="text"
              id="campus_address"
              name="campus_address"
              value={form.campus_address}
              onChange={handleFieldChange}
              required
              placeholder="Plot No. 32, 34, Knowledge Park III, Greater Noida, Uttar Pradesh 201310"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            <p className="text-xs text-gray-400 mt-1">Used in badges, copyright footer, and summary snippets.</p>
          </div>

          {/* Multiline Campus Address */}
          <div>
            <label htmlFor="campus_address_multiline" className="block text-sm font-medium text-gray-700 mb-1">
              Campus Postal Address (Multi-line)
            </label>
            <textarea
              id="campus_address_multiline"
              name="campus_address_multiline"
              rows={3}
              value={form.campus_address_multiline}
              onChange={handleFieldChange}
              placeholder="Sharda Welfare Foundation,&#10;Plot no 32, 34, Knowledge Park III,&#10;Greater Noida, Uttar Pradesh 201310"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">Displayed line-by-line inside the Contact Page Office card.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Google Maps Embed URL */}
            <div>
              <label htmlFor="map_embed_url" className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps Embed URL (iframe src)
              </label>
              <textarea
                id="map_embed_url"
                name="map_embed_url"
                rows={2}
                value={form.map_embed_url}
                onChange={handleFieldChange}
                placeholder="https://maps.google.com/maps?q=..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">Coordinates embed iframe rendered on the Contact page.</p>
            </div>

            {/* Google Maps Directions URL */}
            <div>
              <label htmlFor="map_directions_url" className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps Navigation Link (Directions)
              </label>
              <textarea
                id="map_directions_url"
                name="map_directions_url"
                rows={2}
                value={form.map_directions_url}
                onChange={handleFieldChange}
                placeholder="https://www.google.com/maps/dir/?api=1&destination=..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">Opens directions in Google Maps when visitor clicks "Get Directions".</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          Section 3: Additional Contact Channels
      ============================================================== */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 space-y-8">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">Additional Communication Channels</h3>
          <p className="text-xs text-gray-500 mt-1">
            Add department phone numbers, departmental email addresses, and regional branch offices.
          </p>
        </div>

        {/* --- Sub-section A: Additional Phones --- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Additional Phone Numbers</h4>
              <p className="text-xs text-gray-400">e.g. Admissions Helpline, Toll-Free, Medical Camp Desk</p>
            </div>
            <button
              type="button"
              onClick={addPhone}
              className="rounded-lg bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition"
            >
              + Add Phone
            </button>
          </div>

          {form.additional_phones.length === 0 ? (
            <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
              No additional phone numbers configured. Click "+ Add Phone" to create one.
            </p>
          ) : (
            <div className="space-y-3">
              {form.additional_phones.map((item, index) => (
                <div key={item.id || index} className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-3 items-center">
                  <input
                    type="text"
                    value={item.label || ""}
                    onChange={(e) => updatePhone(index, "label", e.target.value)}
                    placeholder="Label (e.g. CSR Inquiries)"
                    className="w-full md:w-1/3 rounded border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                  <input
                    type="text"
                    value={item.phone || ""}
                    onChange={(e) => updatePhone(index, "phone", e.target.value)}
                    placeholder="Display Phone (e.g. +91 120 4567890)"
                    className="w-full md:w-1/3 rounded border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                  <input
                    type="text"
                    value={item.tel || ""}
                    onChange={(e) => updatePhone(index, "tel", e.target.value)}
                    placeholder="tel: URI (+911204567890)"
                    className="w-full md:w-1/4 rounded border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => deletePhone(index)}
                    title="Remove phone number"
                    className="text-red-500 hover:text-red-700 p-1 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- Sub-section B: Additional Emails --- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Additional Email Addresses</h4>
              <p className="text-xs text-gray-400">e.g. Volunteer Inquiries, Media Relations, Donations & Grants</p>
            </div>
            <button
              type="button"
              onClick={addEmail}
              className="rounded-lg bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition"
            >
              + Add Email
            </button>
          </div>

          {form.additional_emails.length === 0 ? (
            <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
              No additional email addresses configured. Click "+ Add Email" to create one.
            </p>
          ) : (
            <div className="space-y-3">
              {form.additional_emails.map((item, index) => (
                <div key={item.id || index} className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-3 items-center">
                  <input
                    type="text"
                    value={item.label || ""}
                    onChange={(e) => updateEmail(index, "label", e.target.value)}
                    placeholder="Label (e.g. Volunteer Team)"
                    className="w-full md:w-1/2 rounded border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                  <input
                    type="email"
                    value={item.email || ""}
                    onChange={(e) => updateEmail(index, "email", e.target.value)}
                    placeholder="Email (e.g. volunteers@shardawelfare.org)"
                    className="w-full md:w-1/2 rounded border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => deleteEmail(index)}
                    title="Remove email address"
                    className="text-red-500 hover:text-red-700 p-1 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- Sub-section C: Additional Addresses --- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Additional Office / Branch Locations</h4>
              <p className="text-xs text-gray-400">e.g. Registered Trust Office, Regional Information Centre</p>
            </div>
            <button
              type="button"
              onClick={addAddress}
              className="rounded-lg bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition"
            >
              + Add Address
            </button>
          </div>

          {form.additional_addresses.length === 0 ? (
            <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
              No additional office addresses configured. Click "+ Add Address" to create one.
            </p>
          ) : (
            <div className="space-y-3">
              {form.additional_addresses.map((item, index) => (
                <div key={item.id || index} className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-3 items-center">
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) => updateAddress(index, "title", e.target.value)}
                    placeholder="Office Title (e.g. Delhi Registered Office)"
                    className="w-full md:w-1/3 rounded border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                  <input
                    type="text"
                    value={item.address || ""}
                    onChange={(e) => updateAddress(index, "address", e.target.value)}
                    placeholder="Full Address"
                    className="w-full md:w-1/2 rounded border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                  <input
                    type="text"
                    value={item.phone || ""}
                    onChange={(e) => updateAddress(index, "phone", e.target.value)}
                    placeholder="Contact Phone (Optional)"
                    className="w-full md:w-1/4 rounded border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => deleteAddress(index)}
                    title="Remove address"
                    className="text-red-500 hover:text-red-700 p-1 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==============================================================
          Section 4: Social Media Channels
      ============================================================== */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-6 gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Official Social Media Profiles</h3>
            <p className="text-xs text-gray-500 mt-1">
              Configure official handles. Platforms with empty URLs remain disabled by default.
            </p>
          </div>
          <button
            type="button"
            onClick={addSocialPlatform}
            className="rounded-lg bg-gray-100 hover:bg-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition self-start sm:self-auto"
          >
            + Add New Platform
          </button>
        </div>

        <div className="space-y-4">
          {form.social_links.map((item, index) => {
            const iconDef = socialPlatformIcons[item.platform?.toLowerCase()];

            return (
              <div
                key={item.id || index}
                className={`relative p-4 rounded-xl border transition-all ${
                  item.is_enabled
                    ? "border-blue-200 bg-blue-50/20 shadow-xs"
                    : "border-gray-200 bg-gray-50/70 opacity-90"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Order & Icon */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-gray-400 w-4">#{item.display_order || index + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                      {iconDef ? (
                        <svg className="w-4 h-4 fill-current" viewBox={iconDef.viewBox}>
                          <path d={iconDef.path} />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold uppercase">{item.platform ? item.platform.slice(0, 2) : "SO"}</span>
                      )}
                    </div>
                  </div>

                  {/* Label & Platform Name */}
                  <div className="grid grid-cols-2 gap-2 md:w-1/3 shrink-0">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Platform Key</label>
                      <input
                        type="text"
                        value={item.platform || ""}
                        onChange={(e) => updateSocialLink(index, "platform", e.target.value.toLowerCase().replace(/\s+/g, ""))}
                        placeholder="e.g. twitter"
                        className="w-full rounded border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Display Label</label>
                      <input
                        type="text"
                        value={item.label || ""}
                        onChange={(e) => updateSocialLink(index, "label", e.target.value)}
                        placeholder="e.g. Twitter / X"
                        className="w-full rounded border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white font-medium"
                      />
                    </div>
                  </div>

                  {/* Official URL */}
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Official Profile URL</label>
                    <input
                      type="url"
                      value={item.url || ""}
                      onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600 bg-white font-mono"
                    />
                  </div>

                  {/* Enable / Disable Switch */}
                  <div className="flex items-center gap-3 shrink-0">
                    <label className="relative flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(item.is_enabled)}
                        onChange={() => toggleSocialEnabled(index)}
                        className="sr-only"
                      />
                      <div
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                          item.is_enabled ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                            item.is_enabled ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${item.is_enabled ? "text-blue-700" : "text-gray-400"}`}>
                        {item.is_enabled ? "Enabled" : "Disabled"}
                      </span>
                    </label>

                    {/* Move Up / Down Buttons */}
                    <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() => moveSocialLink(index, "up")}
                        disabled={index === 0}
                        title="Move Up"
                        className="px-2 py-1 bg-white hover:bg-gray-100 disabled:opacity-30 text-xs font-bold text-gray-600 border-r border-gray-200"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSocialLink(index, "down")}
                        disabled={index === form.social_links.length - 1}
                        title="Move Down"
                        className="px-2 py-1 bg-white hover:bg-gray-100 disabled:opacity-30 text-xs font-bold text-gray-600"
                      >
                        ↓
                      </button>
                    </div>

                    {/* Delete Platform */}
                    <button
                      type="button"
                      onClick={() => deleteSocialPlatform(index)}
                      title="Delete Platform"
                      className="text-gray-400 hover:text-red-600 p-1 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacer buffer to ensure full clearance above the sticky bar */}
      <div className="h-6 sm:h-8" aria-hidden="true" />

      {/* ==============================================================
          Submission Footer (Compact & Non-Obtrusive Sticky Action Bar)
      ============================================================== */}
      <div className="sticky bottom-3 sm:bottom-4 z-20 rounded-xl bg-gray-900/95 backdrop-blur-md text-white px-4 py-2.5 sm:px-5 sm:py-3 shadow-xl border border-gray-800 flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="hidden sm:inline-flex w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
              <span className="sm:hidden">Contact Settings</span>
              <span className="hidden sm:inline">Save Contact & Social Changes</span>
            </h4>
            <p className="hidden md:block text-[11px] text-gray-400 truncate mt-0.5">
              Updates persist to the local database and sync with public Contact & Footer.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadContactSettings}
            disabled={saving}
            className="rounded-lg border border-gray-700 bg-gray-800/80 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-gray-300 hover:bg-gray-750 hover:text-white transition disabled:opacity-50"
          >
            <span className="sm:hidden">Reset</span>
            <span className="hidden sm:inline">Reset Form</span>
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm shadow-blue-600/30"
          >
            {saving && (
              <svg className="h-3.5 w-3.5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            <span>
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <span className="sm:hidden">Save</span>
                  <span className="hidden sm:inline">Save Contact Settings</span>
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default ManageContact;
