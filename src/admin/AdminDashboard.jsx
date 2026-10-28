import { useEffect, useRef, useState } from "react";
import ManageContact from "./ManageContact";

const API_URL = "http://localhost:5000/api/projects";
const UPDATES_API_URL = "http://localhost:5000/api/updates";

const emptyForm = {
  title: "",
  subtitle: "",
  image_url: "",
  intro: "",
  description: "",
  focus_areas: [{ title: "", desc: "" }],
  conclusion: "",
  status: "draft",
};

const emptyUpdateForm = {
  title: "",
  slug: "",
  short_desc: "",
  image_url: "",
  date_label: "",
  display_order: 1,
  content: "",
  status: "draft",
};

function parseParagraphs(content) {
  if (Array.isArray(content)) return content.filter(Boolean);
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {}
    return content
      .split(/\r?\n\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

function formatContentForTextarea(content) {
  if (Array.isArray(content)) return content.join("\n\n");
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed.join("\n\n");
    } catch {}
    return content;
  }
  return "";
}

function AdminDashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ==========================================
  // Projects (Initiatives) State
  // ==========================================
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // Latest Updates State
  // ==========================================
  const [updates, setUpdates] = useState([]);
  const [updateForm, setUpdateForm] = useState(emptyUpdateForm);
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [updatesSaving, setUpdatesSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [updatesError, setUpdatesError] = useState("");
  const [updatesMessage, setUpdatesMessage] = useState("");
  const [previewArticle, setPreviewArticle] = useState(null);
  const [previewTab, setPreviewTab] = useState("card"); // "card" | "article"
  const [updatesFilter, setUpdatesFilter] = useState("all"); // "all" | "published" | "draft"
  const [updatesSearch, setUpdatesSearch] = useState("");

  const mainRef = useRef(null);

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getToken = () => sessionStorage.getItem("adminToken");

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  const selectNav = (pageName) => {
    setActivePage(pageName);
    setMobileMenuOpen(false);
    setError("");
    setMessage("");
    setUpdatesError("");
    setUpdatesMessage("");
  };

  // ==========================================
  // Load Data
  // ==========================================
  async function loadProjects() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to load projects.");
      }

      setProjects(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function loadUpdates() {
    setUpdatesLoading(true);
    setUpdatesError("");

    try {
      const response = await fetch(UPDATES_API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to load updates.");
      }

      setUpdates(data);
    } catch (err) {
      setUpdatesError(err.message || "Unable to connect to the server.");
    } finally {
      setUpdatesLoading(false);
    }
  }

  useEffect(() => {
    scrollToTop();
    if (activePage === "Dashboard") {
      loadProjects();
      loadUpdates();
    } else if (activePage === "Manage Projects") {
      loadProjects();
    } else if (activePage === "Manage Latest Updates") {
      loadUpdates();
    }
  }, [activePage]);

  // ==========================================
  // Projects Handlers
  // ==========================================
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleFocusAreaChange(index, field, value) {
    setForm((previous) => {
      const updated = [...previous.focus_areas];
      updated[index] = { ...updated[index], [field]: value };
      return { ...previous, focus_areas: updated };
    });
  }

  function addFocusArea() {
    setForm((previous) => ({
      ...previous,
      focus_areas: [...previous.focus_areas, { title: "", desc: "" }],
    }));
  }

  function removeFocusArea(index) {
    setForm((previous) => ({
      ...previous,
      focus_areas: previous.focus_areas.filter((_, i) => i !== index),
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(project) {
    let parsedAreas = [];
    if (Array.isArray(project.focus_areas)) {
      parsedAreas = project.focus_areas;
    } else if (typeof project.focus_areas === "string" && project.focus_areas.trim()) {
      try {
        const parsed = JSON.parse(project.focus_areas);
        if (Array.isArray(parsed)) parsedAreas = parsed;
      } catch {
        parsedAreas = [];
      }
    }

    if (parsedAreas.length === 0) {
      parsedAreas = [{ title: "", desc: "" }];
    }

    setForm({
      title: project.title || "",
      subtitle: project.subtitle || "",
      intro: project.intro || project.description || "",
      description: project.description || project.intro || "",
      image_url: project.image_url || "",
      conclusion: project.conclusion || "",
      focus_areas: parsedAreas,
      status: project.status || "draft",
    });

    setEditingId(project.id);
    setMessage("");
    setError("");

    scrollToTop();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const isEditing = editingId !== null;

      const cleanedFocusAreas = (form.focus_areas || []).filter(
        (fa) => (fa.title && fa.title.trim()) || (fa.desc && fa.desc.trim())
      );

      const finalDescription =
        form.intro.trim() || form.description.trim() || form.title.trim();

      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        intro: form.intro.trim(),
        description: finalDescription,
        image_url: form.image_url.trim() || null,
        focus_areas: cleanedFocusAreas,
        conclusion: form.conclusion.trim(),
        status: form.status,
      };

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to save project.");
      }

      setMessage(data.message || "Project saved successfully.");
      resetForm();
      await loadProjects();
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete project.");
      }

      setMessage(data.message || "Project deleted successfully.");
      await loadProjects();
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    }
  }

  // ==========================================
  // Latest Updates Handlers
  // ==========================================
  function handleUpdateChange(e) {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleImageUploadFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUpdatesError("Image file size must be less than 5MB.");
      return;
    }

    setImageUploading(true);
    setUpdatesError("");
    setUpdatesMessage("");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const res = await fetch("http://localhost:5000/api/updates/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            filename: file.name,
            base64Data: base64Data,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to upload image.");
        }

        setUpdateForm((prev) => ({
          ...prev,
          image_url: data.imageUrl,
        }));
        setUpdatesMessage("Image uploaded successfully: " + data.imageUrl);
      } catch (err) {
        setUpdatesError(err.message || "Failed to upload image.");
      } finally {
        setImageUploading(false);
        e.target.value = "";
      }
    };

    reader.onerror = () => {
      setImageUploading(false);
      setUpdatesError("Failed to read image file.");
      e.target.value = "";
    };

    reader.readAsDataURL(file);
  }

  function resetUpdateForm() {
    setUpdateForm(emptyUpdateForm);
    setEditingUpdateId(null);
  }

  function handleUpdateEdit(update) {
    const textContent = formatContentForTextarea(update.content);

    setUpdateForm({
      title: update.title || "",
      slug: update.slug || "",
      short_desc: update.short_desc || "",
      image_url: update.image_url || "",
      date_label: update.date_label || "",
      display_order: update.display_order ?? 0,
      content: textContent,
      status: update.status || "draft",
    });

    setEditingUpdateId(update.id);
    setUpdatesError("");
    setUpdatesMessage("");

    scrollToTop();
  }

  async function handleUpdateSubmit(e) {
    e.preventDefault();

    setUpdatesSaving(true);
    setUpdatesError("");
    setUpdatesMessage("");

    try {
      const isEditing = editingUpdateId !== null;

      const paragraphs = updateForm.content
        .split(/\r?\n\r?\n/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (paragraphs.length === 0) {
        throw new Error("Please provide at least one paragraph of article content.");
      }

      const payload = {
        title: updateForm.title.trim(),
        slug: updateForm.slug.trim() || undefined,
        short_desc: updateForm.short_desc.trim(),
        content: paragraphs,
        image_url: updateForm.image_url.trim(),
        date_label: updateForm.date_label.trim() || null,
        display_order: Number(updateForm.display_order) || 0,
        status: updateForm.status,
      };

      const url = isEditing
        ? `${UPDATES_API_URL}/${editingUpdateId}`
        : UPDATES_API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to save update.");
      }

      setUpdatesMessage(data.message || "Article saved successfully.");
      resetUpdateForm();
      await loadUpdates();
    } catch (err) {
      setUpdatesError(err.message || "Unable to connect to the server.");
    } finally {
      setUpdatesSaving(false);
    }
  }

  async function handleUpdateDelete(update) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${update.title}"?\n\nThis will permanently remove the article from the website.`
    );

    if (!confirmed) return;

    setUpdatesError("");
    setUpdatesMessage("");

    try {
      const response = await fetch(`${UPDATES_API_URL}/${update.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete update.");
      }

      setUpdatesMessage(data.message || "Article deleted successfully.");
      await loadUpdates();
    } catch (err) {
      setUpdatesError(err.message || "Unable to connect to the server.");
    }
  }

  function openPreview(data) {
    setPreviewArticle(data);
    setPreviewTab("card");
  }

  function closePreview() {
    setPreviewArticle(null);
  }

  // Filter and search updates
  const filteredUpdates = updates.filter((item) => {
    if (updatesFilter === "published" && item.status !== "published") return false;
    if (updatesFilter === "draft" && item.status !== "draft") return false;
    if (updatesSearch.trim()) {
      const q = updatesSearch.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchSlug = item.slug?.toLowerCase().includes(q);
      const matchDesc = item.short_desc?.toLowerCase().includes(q);
      return matchTitle || matchSlug || matchDesc;
    }
    return true;
  });

  const publishedUpdatesCount = updates.filter((u) => u.status === "published").length;
  const draftUpdatesCount = updates.filter((u) => u.status === "draft").length;

  return (
    <div className="relative min-h-screen bg-[#F3F4F6] md:h-screen md:overflow-hidden md:flex flex-col md:flex-row">
      {/* ==============================================================
          Mobile Top Navigation Bar (Visible only on mobile/tablet screens)
      ============================================================== */}
      <div className="md:hidden flex items-center justify-between bg-[#111827] px-4 py-3.5 border-b border-gray-800 text-white sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-gray-700/50">
            <img
              src="/logo.webp"
              alt="Sharda Welfare Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-tight">Sharda Welfare</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Admin Portal</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ==============================================================
          Sidebar Navigation (Modern Dark Navy #111827)
      ============================================================== */}
      <aside
        className={`${
          mobileMenuOpen ? "flex" : "hidden"
        } md:flex w-full md:w-64 bg-[#111827] p-5 md:p-6 text-white md:h-screen md:shrink-0 md:overflow-y-auto flex-col justify-between border-r border-gray-800/80 z-30 shrink-0`}
      >
        <div>
          {/* Brand Header */}
          <div className="mb-7 hidden md:block">
            <div className="flex items-center gap-3 px-1 py-1">
              <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-xs border border-gray-700/50">
                <img
                  src="/logo.webp"
                  alt="Sharda Welfare Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-white tracking-tight truncate leading-tight">
                  Sharda Welfare
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <p className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase">
                    Admin Portal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Content Menu
            </p>

            {/* Dashboard */}
            <button
              type="button"
              onClick={() => selectNav("Dashboard")}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-left font-medium transition-all duration-150 ${
                activePage === "Dashboard"
                  ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/20"
                  : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="text-sm">Dashboard</span>
              </div>
            </button>

            {/* Manage Projects */}
            <button
              type="button"
              onClick={() => selectNav("Manage Projects")}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-left font-medium transition-all duration-150 ${
                activePage === "Manage Projects"
                  ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/20"
                  : "text-gray-300 hover:bg-gray-800/80 hover:text-white group"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm">Manage Projects</span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  activePage === "Manage Projects"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-800 text-gray-400 group-hover:text-gray-200"
                }`}
              >
                {projects.length}
              </span>
            </button>

            {/* Manage Latest Updates */}
            <button
              type="button"
              onClick={() => selectNav("Manage Latest Updates")}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-left font-medium transition-all duration-150 ${
                activePage === "Manage Latest Updates"
                  ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/20"
                  : "text-gray-300 hover:bg-gray-800/80 hover:text-white group"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span className="text-sm">Manage Latest Updates</span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  activePage === "Manage Latest Updates"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-800 text-gray-400 group-hover:text-gray-200"
                }`}
              >
                {updates.length}
              </span>
            </button>

            {/* Manage Contact Details */}
            <button
              type="button"
              onClick={() => selectNav("Manage Contact Details")}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-left font-medium transition-all duration-150 ${
                activePage === "Manage Contact Details"
                  ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/20"
                  : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                <span className="text-sm">Manage Contact Details</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with Session & Logout */}
        <div className="mt-8 pt-6 border-t border-gray-800/80">
          <div className="px-3 py-2.5 mb-3 rounded-xl bg-gray-800/40 border border-gray-800/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 border border-blue-500/30">
                SW
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-200 truncate">Administrator</p>
                <p className="text-[10px] text-gray-400 truncate">Foundation Panel</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active Session"></span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-700/60 bg-gray-800/30 px-4 py-2.5 text-center text-xs font-semibold text-gray-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all duration-150"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ==============================================================
          Main Content Area (Background #F3F4F6)
      ============================================================== */}
      <main
        ref={mainRef}
        className="relative min-w-0 flex-1 p-5 sm:p-6 md:p-8 lg:p-10 md:h-screen md:overflow-y-auto md:overflow-x-hidden bg-[#F3F4F6]"
      >
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200/80">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                {activePage}
              </h2>
              {activePage === "Dashboard" && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#2563EB] border border-blue-200/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                  Overview
                </span>
              )}
            </div>
            <p className="text-sm text-[#6B7280]">
              {activePage === "Dashboard" && "Overview and summary of Sharda Welfare Foundation content."}
              {activePage === "Manage Projects" && "Create, edit, and organize What We Do initiatives."}
              {activePage === "Manage Latest Updates" && "Publish and manage community stories, events, and health camp updates."}
              {activePage === "Manage Contact Details" && "Manage helpline numbers, campus address, operating hours, and official social media channels."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <a
              href="https://www.shardawelfare.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-900 transition-colors"
              title="Open public website in a new tab"
            >
              <span>View Live Website</span>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </header>

        {/* ==============================================================
            DASHBOARD VIEW
        ============================================================== */}
        {activePage === "Dashboard" && (
          <div className="space-y-8">
            {/* Primary Metrics Grid (4 Cards) */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              
              {/* Card 1: Welcome & Status */}
              <div className="rounded-2xl bg-white p-6 shadow-xs hover:shadow-sm border border-gray-200/80 flex flex-col justify-between transition-all duration-200">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Operational
                    </span>
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Admin Overview</p>
                  <h3 className="mt-1 text-xl font-bold text-[#111827]">Welcome Back!</h3>
                  <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                    Manage What We Do initiatives and Latest Updates articles from a single place.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-medium">System Status</span>
                  <span className="font-semibold text-emerald-700">● Local Active</span>
                </div>
              </div>

              {/* Card 2: What We Do Initiatives */}
              <div className="rounded-2xl bg-white p-6 shadow-xs hover:shadow-sm border border-gray-200/80 flex flex-col justify-between transition-all duration-200">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/60">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="inline-flex items-center text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                      Initiatives
                    </span>
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">What We Do</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <h3 className="text-3xl font-extrabold text-[#111827]">{projects.length}</h3>
                    <span className="text-xs text-[#6B7280]">total</span>
                  </div>
                  <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                    Initiatives configured (<strong className="text-gray-700">{projects.filter((p) => p.status === "published").length}</strong> Published)
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => selectNav("Manage Projects")}
                    className="w-full inline-flex items-center justify-between text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors group"
                  >
                    <span>Manage Projects</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>

              {/* Card 3: Latest Updates */}
              <div className="rounded-2xl bg-white p-6 shadow-xs hover:shadow-sm border border-gray-200/80 flex flex-col justify-between transition-all duration-200">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/60">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                      Updates
                    </span>
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Latest Updates</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <h3 className="text-3xl font-extrabold text-[#111827]">{updates.length}</h3>
                    <span className="text-xs text-[#6B7280]">articles</span>
                  </div>
                  <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                    Articles total (<strong className="text-gray-700">{publishedUpdatesCount}</strong> Published, <strong className="text-gray-700">{draftUpdatesCount}</strong> Drafts)
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => selectNav("Manage Latest Updates")}
                    className="w-full inline-flex items-center justify-between text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors group"
                  >
                    <span>Manage Latest Updates</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>

              {/* Card 4: Contact & Social */}
              <div className="rounded-2xl bg-white p-6 shadow-xs hover:shadow-sm border border-gray-200/80 flex flex-col justify-between transition-all duration-200">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </div>
                    <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                      Channels
                    </span>
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Contact & Social</p>
                  <h3 className="mt-1 text-xl font-bold text-[#111827]">Contact Details</h3>
                  <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                    Helpline, official email, campus location & social profiles.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => selectNav("Manage Contact Details")}
                    className="w-full inline-flex items-center justify-between text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors group"
                  >
                    <span>Manage Contact Details</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Activity Section */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Quick Actions Card */}
              <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-200/80 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Quick Actions
                  </h4>
                  <p className="text-xs text-[#6B7280] mb-5">
                    Frequently used content management shortcuts.
                  </p>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        selectNav("Manage Projects");
                        setEditingId(null);
                        setForm(emptyForm);
                        scrollToTop();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50/80 hover:bg-blue-50/70 border border-gray-200/70 hover:border-blue-200 text-left transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 group-hover:text-blue-700">Add New Initiative</p>
                          <p className="text-[11px] text-gray-500">Create a What We Do project</p>
                        </div>
                      </div>
                      <span className="text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5">→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        selectNav("Manage Latest Updates");
                        setEditingUpdateId(null);
                        setUpdateForm(emptyUpdateForm);
                        scrollToTop();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50/80 hover:bg-amber-50/70 border border-gray-200/70 hover:border-amber-200 text-left transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 group-hover:text-amber-800">Publish Latest Update</p>
                          <p className="text-[11px] text-gray-500">Post news, health camp, or event</p>
                        </div>
                      </div>
                      <span className="text-gray-400 group-hover:text-amber-700 transition-transform group-hover:translate-x-0.5">→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        selectNav("Manage Contact Details");
                        scrollToTop();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50/80 hover:bg-emerald-50/70 border border-gray-200/70 hover:border-emerald-200 text-left transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-800">Edit Contact & Social</p>
                          <p className="text-[11px] text-gray-500">Helpline, campus map & links</p>
                        </div>
                      </div>
                      <span className="text-gray-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>NGO Content System</span>
                  <span>Protected Session</span>
                </div>
              </div>

              {/* Recent Content Summary */}
              <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-200/80 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-1">
                        Recent Articles & Initiatives
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        Overview of published and draft content in database.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectNav("Manage Latest Updates")}
                      className="text-xs font-semibold text-[#2563EB] hover:underline"
                    >
                      View All Updates ({updates.length}) →
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {updates.slice(0, 4).map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{item.title}</p>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">
                            {item.date_label || "No date"} &middot; slug: <span className="font-mono text-gray-600">{item.slug}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              item.status === "published"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {item.status === "published" ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                    ))}

                    {updates.length === 0 && (
                      <p className="text-xs text-gray-400 py-6 text-center italic">
                        No updates loaded yet.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Database: <strong className="text-gray-700 font-medium">sharda_admin_local</strong></span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Synchronized
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==============================================================
            MANAGE PROJECTS (WHAT WE DO) VIEW
        ============================================================== */}
        {activePage === "Manage Projects" && (
          <div className="space-y-6">
            {/* Project Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <h3 className="mb-5 text-xl font-semibold text-gray-900">
                {editingId !== null ? "Edit Project" : "Add New Project"}
              </h3>

              {error && (
                <p
                  role="alert"
                  className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              {message && (
                <p
                  role="status"
                  className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                >
                  {message}
                </p>
              )}

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Initiative Title * (e.g. SEHAT, SHIKSHA)
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    placeholder="Enter initiative title"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subtitle"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Subtitle / Headline (e.g. Transforming Healthcare for the Vulnerable)
                  </label>
                  <input
                    id="subtitle"
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    maxLength={255}
                    placeholder="Enter initiative subtitle or headline"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="image_url"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Image URL (optional)
                  </label>
                  <input
                    id="image_url"
                    name="image_url"
                    type="text"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="/assets/initiative.webp or https://example.com/photo.jpg"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="intro"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Introduction Paragraphs *
                  </label>
                  <textarea
                    id="intro"
                    name="intro"
                    value={form.intro}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Describe the initiative. Separate multiple paragraphs with a blank line."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Tip: Separate multiple paragraphs by leaving a blank line between them.
                  </p>
                </div>

                {/* Core Focus Areas Repeater */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">
                        Core Focus Areas
                      </h4>
                      <p className="text-xs text-gray-500">
                        Add key pillars and focus points for this initiative.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addFocusArea}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      + Add Focus Area
                    </button>
                  </div>

                  <div className="space-y-4">
                    {form.focus_areas.map((fa, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                            {index + 1}
                          </span>

                          {form.focus_areas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFocusArea(index)}
                              className="text-xs font-medium text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <input
                            type="text"
                            value={fa.title}
                            onChange={(e) =>
                              handleFocusAreaChange(index, "title", e.target.value)
                            }
                            placeholder={`Focus Area ${index + 1} Title (e.g. Bridging the Healthcare Gap)`}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                          />

                          <textarea
                            rows={2}
                            value={fa.desc}
                            onChange={(e) =>
                              handleFocusAreaChange(index, "desc", e.target.value)
                            }
                            placeholder="Description of this core focus area..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="conclusion"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Conclusion / Closing Statement (optional)
                  </label>
                  <textarea
                    id="conclusion"
                    name="conclusion"
                    value={form.conclusion}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Concluding remarks or call to action..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Project Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  >
                    <option value="draft">Draft (hidden from public)</option>
                    <option value="published">Published (visible on What We Do)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Update Project"
                      : "Save Project"}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* Project List */}
            <section className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  Saved Projects ({projects.length})
                </h3>

                <button
                  type="button"
                  onClick={loadProjects}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {loading && (
                <p className="py-4 text-gray-500">Loading projects...</p>
              )}

              {!loading && projects.length === 0 && (
                <p className="py-4 text-gray-500">
                  No projects found. Add your first project using the form above.
                </p>
              )}

              <div className="space-y-4">
                {projects.map((project) => {
                  let focusAreasCount = 0;
                  if (Array.isArray(project.focus_areas)) {
                    focusAreasCount = project.focus_areas.length;
                  } else if (
                    typeof project.focus_areas === "string" &&
                    project.focus_areas.trim()
                  ) {
                    try {
                      const parsed = JSON.parse(project.focus_areas);
                      if (Array.isArray(parsed)) focusAreasCount = parsed.length;
                    } catch {}
                  }

                  return (
                    <article
                      key={project.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row">
                        <div className="min-w-0">
                          <h4 className="break-words text-lg font-semibold text-gray-900">
                            {project.title}
                          </h4>

                          {project.subtitle && (
                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {project.subtitle}
                            </p>
                          )}

                          <p className="mt-2 line-clamp-3 whitespace-pre-wrap break-words text-sm text-gray-600">
                            {project.intro || project.description}
                          </p>

                          {focusAreasCount > 0 && (
                            <p className="mt-2 text-xs font-semibold text-blue-800">
                              ✓ {focusAreasCount} Core Focus Area
                              {focusAreasCount > 1 ? "s" : ""}
                            </p>
                          )}

                          {project.image_url && (
                            <p className="mt-2 break-all text-sm text-blue-700">
                              Image: {project.image_url}
                            </p>
                          )}

                          <span
                            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              project.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {project.status === "published"
                              ? "Published (Live)"
                              : "Draft"}
                          </span>
                        </div>

                        <div className="flex shrink-0 gap-2 sm:self-start">
                          <button
                            type="button"
                            onClick={() => handleEdit(project)}
                            className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(project.id)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ==============================================================
            MANAGE LATEST UPDATES VIEW
        ============================================================== */}
        {activePage === "Manage Latest Updates" && (
          <div className="space-y-8">
            {/* Form Section */}
            <form
              onSubmit={handleUpdateSubmit}
              className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-gray-100"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingUpdateId !== null ? "Edit Article" : "Create New Article"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {editingUpdateId !== null
                      ? "Update the article details, images, content, and visibility."
                      : "Add a new story, health camp update, or community announcement."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openPreview({
                        title: updateForm.title || "Untitled Article",
                        slug: updateForm.slug || "sample-slug",
                        short_desc: updateForm.short_desc,
                        image_url: updateForm.image_url,
                        date_label: updateForm.date_label,
                        content: updateForm.content,
                        status: updateForm.status,
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <span>👁️</span> Preview
                  </button>

                  {editingUpdateId !== null && (
                    <button
                      type="button"
                      onClick={resetUpdateForm}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>

              {updatesError && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200"
                >
                  <span className="font-bold">⚠️</span>
                  <div className="flex-1">{updatesError}</div>
                </div>
              )}

              {updatesMessage && (
                <div
                  role="status"
                  className="mb-5 flex items-start gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200"
                >
                  <span className="font-bold">✓</span>
                  <div className="flex-1">{updatesMessage}</div>
                </div>
              )}

              <div className="space-y-6">
                {/* Title & Slug */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="update_title"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Article Title *
                    </label>
                    <input
                      id="update_title"
                      name="title"
                      value={updateForm.title}
                      onChange={handleUpdateChange}
                      required
                      placeholder="e.g. 3rd Mega Camp held at Greater Noida School"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="update_slug"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      URL Slug (optional)
                    </label>
                    <input
                      id="update_slug"
                      name="slug"
                      value={updateForm.slug}
                      onChange={handleUpdateChange}
                      placeholder="e.g. 3rd-mega-camp-greater-noida (auto-generated if empty)"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Determines the web address: /latest-updates/<strong>{updateForm.slug || "slug-here"}</strong>
                    </p>
                  </div>
                </div>

                {/* Date Label & Display Order */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="update_date"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Date Label / Badge (optional)
                    </label>
                    <input
                      id="update_date"
                      name="date_label"
                      value={updateForm.date_label}
                      onChange={handleUpdateChange}
                      placeholder="e.g. October 14, 2026 or Spring 2026"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="update_order"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Display Order (lower numbers appear first)
                    </label>
                    <input
                      id="update_order"
                      name="display_order"
                      type="number"
                      value={updateForm.display_order}
                      onChange={handleUpdateChange}
                      min="0"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label
                    htmlFor="update_short_desc"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Short Description * (Summary shown on preview cards)
                  </label>
                  <textarea
                    id="update_short_desc"
                    name="short_desc"
                    value={updateForm.short_desc}
                    onChange={handleUpdateChange}
                    required
                    rows={2}
                    placeholder="Brief 1-2 sentence overview for the card display..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                {/* Image Upload and Image URL */}
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Article Image *
                  </label>
                  <p className="text-xs text-gray-500 mb-4">
                    Upload an image file from your computer or provide an existing image URL or asset path.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* File Upload Option */}
                    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Option A: Upload Image File</p>
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors">
                        <span>📷 Choose Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUploadFile}
                          disabled={imageUploading}
                        />
                      </label>
                      {imageUploading && (
                        <p className="mt-2 text-xs font-medium text-blue-600 animate-pulse">
                          Uploading image to server...
                        </p>
                      )}
                      <p className="mt-2 text-[11px] text-gray-400">
                        Supports JPG, PNG, WEBP, GIF up to 5MB.
                      </p>
                    </div>

                    {/* Direct URL Input Option */}
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Option B: Existing Image Path / URL</p>
                      <input
                        type="text"
                        name="image_url"
                        value={updateForm.image_url}
                        onChange={handleUpdateChange}
                        required
                        placeholder="/latest-updates/story1.webp or https://..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
                      />
                      <p className="mt-2 text-[11px] text-gray-400">
                        Enter full public URL or relative path.
                      </p>
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  {updateForm.image_url && (
                    <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
                      <img
                        src={updateForm.image_url}
                        alt="Article preview thumbnail"
                        className="h-16 w-24 rounded object-cover border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.alt = "Image failed to load";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-800">Selected Image:</p>
                        <p className="text-xs font-mono text-gray-500 truncate">{updateForm.image_url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUpdateForm((prev) => ({ ...prev, image_url: "" }))}
                        className="text-xs text-red-600 hover:underline font-medium px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Full Article Content */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="update_content"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Article Content *
                    </label>
                    <span className="text-xs text-gray-400">
                      Separate paragraphs by leaving a blank line (double Enter)
                    </span>
                  </div>
                  <textarea
                    id="update_content"
                    name="content"
                    value={updateForm.content}
                    onChange={handleUpdateChange}
                    required
                    rows={8}
                    placeholder="First paragraph of the article detailing the event or story...&#10;&#10;Second paragraph elaborating on participating doctors, partners, or community members...&#10;&#10;Concluding paragraph or impact summary..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm leading-relaxed outline-none focus:border-blue-600 font-normal transition-colors"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Paragraphs count: {parseParagraphs(updateForm.content).length}
                  </p>
                </div>

                {/* Status Selection */}
                <div className="max-w-xs">
                  <label
                    htmlFor="update_status"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Publication Status *
                  </label>
                  <select
                    id="update_status"
                    name="status"
                    value={updateForm.status}
                    onChange={handleUpdateChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-600"
                  >
                    <option value="draft">🟡 Draft (Hidden from public)</option>
                    <option value="published">🟢 Published (Live on website)</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={updatesSaving || imageUploading}
                  className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                >
                  {updatesSaving
                    ? "Saving Article..."
                    : editingUpdateId !== null
                      ? "Update Article"
                      : "Create Article"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openPreview({
                      title: updateForm.title || "Untitled Article",
                      slug: updateForm.slug || "sample-slug",
                      short_desc: updateForm.short_desc,
                      image_url: updateForm.image_url,
                      date_label: updateForm.date_label,
                      content: updateForm.content,
                      status: updateForm.status,
                    })
                  }
                  className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  👁️ Preview Article
                </button>

                {editingUpdateId !== null && (
                  <button
                    type="button"
                    onClick={resetUpdateForm}
                    className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* Updates List Section */}
            <section className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Existing Articles ({updates.length})
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage display ordering, draft/published status, or edit content.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadUpdates}
                    disabled={updatesLoading}
                    className="rounded-lg border border-gray-300 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
                  >
                    {updatesLoading ? "Refreshing..." : "🔄 Refresh"}
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setUpdatesFilter("all")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      updatesFilter === "all"
                        ? "bg-white text-gray-900 shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All ({updates.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpdatesFilter("published")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      updatesFilter === "published"
                        ? "bg-white text-green-700 shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Published ({publishedUpdatesCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpdatesFilter("draft")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      updatesFilter === "draft"
                        ? "bg-white text-yellow-700 shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Drafts ({draftUpdatesCount})
                  </button>
                </div>

                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    value={updatesSearch}
                    onChange={(e) => setUpdatesSearch(e.target.value)}
                    placeholder="Search by title or slug..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {updatesLoading && (
                <div className="py-12 text-center text-gray-500">
                  <p>Loading articles from server...</p>
                </div>
              )}

              {!updatesLoading && filteredUpdates.length === 0 && (
                <div className="py-12 text-center rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">No articles match your current criteria.</p>
                  <p className="text-xs text-gray-400 mt-1">Try clearing your search or filter.</p>
                </div>
              )}

              <div className="space-y-4">
                {filteredUpdates.map((update) => {
                  const paras = parseParagraphs(update.content);

                  return (
                    <article
                      key={update.id}
                      className="rounded-xl border border-gray-200 p-4 sm:p-5 hover:border-gray-300 transition-colors bg-white shadow-xs"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        {/* Thumbnail & Main Info */}
                        <div className="flex gap-4 min-w-0">
                          {update.image_url ? (
                            <img
                              src={update.image_url}
                              alt={update.title}
                              className="h-20 w-28 shrink-0 rounded-lg object-cover border border-gray-200 bg-gray-50"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="h-20 w-28 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-mono font-bold text-gray-700">
                                #{update.display_order ?? 0}
                              </span>

                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  update.status === "published"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {update.status === "published" ? "Published (Live)" : "Draft"}
                              </span>

                              {update.date_label && (
                                <span className="text-xs text-gray-500 font-medium">
                                  • {update.date_label}
                                </span>
                              )}
                            </div>

                            <h4 className="text-base font-bold text-gray-900 break-words">
                              {update.title}
                            </h4>

                            <p className="mt-1 text-xs text-blue-700 font-mono">
                              /latest-updates/{update.slug}
                            </p>

                            <p className="mt-1.5 text-xs text-gray-600 line-clamp-2">
                              {update.short_desc}
                            </p>

                            <p className="mt-2 text-[11px] text-gray-400">
                              {paras.length} paragraph{paras.length === 1 ? "" : "s"}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex shrink-0 items-center gap-2 sm:self-start">
                          <button
                            type="button"
                            onClick={() => openPreview(update)}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            👁️ Preview
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateEdit(update)}
                            className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateDelete(update)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ==============================================================
            MANAGE CONTACT DETAILS VIEW
        ============================================================== */}
        {activePage === "Manage Contact Details" && (
          <div className="space-y-6">
            <ManageContact getToken={getToken} />
          </div>
        )}
      </main>

      {/* ==============================================================
          LIVE PREVIEW MODAL
      ============================================================== */}
      {previewArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">
                  Article Preview
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    previewArticle.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {previewArticle.status === "published" ? "Published (Live)" : "Draft"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* View switcher tabs */}
                <div className="flex items-center bg-gray-200 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("card")}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      previewTab === "card"
                        ? "bg-white text-gray-900 shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Card View
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("article")}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      previewTab === "article"
                        ? "bg-white text-gray-900 shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Article Page View
                  </button>
                </div>

                <button
                  type="button"
                  onClick={closePreview}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                >
                  <span className="text-xl leading-none">✕</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50">
              {previewTab === "card" && (
                <div className="max-w-md mx-auto">
                  <p className="text-xs text-center text-gray-500 mb-4 font-medium">
                    This is how the card will look in the "Latest Updates" grid:
                  </p>
                  <div className="bg-white rounded-[2rem] overflow-hidden shadow-md border border-slate-100 flex flex-col group">
                    <div className="relative h-64 overflow-hidden bg-slate-100">
                      {previewArticle.image_url ? (
                        <img
                          src={previewArticle.image_url}
                          alt={previewArticle.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                          No Image Provided
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      {previewArticle.date_label && (
                        <p className="text-xs font-bold text-foundation-secondary uppercase tracking-wider mb-2">
                          {previewArticle.date_label}
                        </p>
                      )}
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 line-clamp-3">
                        {previewArticle.title || "Untitled Article"}
                      </h3>
                      <p className="text-slate-600 mb-8 flex-grow line-clamp-3 text-sm">
                        {previewArticle.short_desc || "No short description provided."}
                      </p>
                      <div className="inline-flex items-center text-foundation-secondary font-bold text-sm">
                        Read More <span className="ml-2">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewTab === "article" && (
                <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-10 shadow-xs border border-gray-100 space-y-8">
                  <div className="text-center">
                    <p className="text-xs font-extrabold text-foundation-secondary tracking-[0.2em] uppercase mb-3">
                      {previewArticle.date_label
                        ? `SHARDA WELFARE • ${previewArticle.date_label}`
                        : "SHARDA WELFARE • LATEST UPDATES"}
                    </p>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                      {previewArticle.title || "Untitled Article"}
                    </h2>
                  </div>

                  {previewArticle.image_url && (
                    <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-2xl shadow-sm border border-slate-100">
                      <img
                        src={previewArticle.image_url}
                        alt={previewArticle.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    {parseParagraphs(previewArticle.content).map((paragraph, idx) => (
                      <p key={idx} className="text-base text-slate-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                    {parseParagraphs(previewArticle.content).length === 0 && (
                      <p className="text-slate-400 italic">No article paragraphs provided yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
              <span className="text-xs text-gray-500">
                Slug: <strong className="font-mono text-gray-700">{previewArticle.slug || "(auto)"}</strong>
              </span>
              <button
                type="button"
                onClick={closePreview}
                className="rounded-lg bg-gray-900 px-5 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;