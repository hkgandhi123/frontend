// utils/resolveURL.js
export const resolveURLWithCacheBust = (url) => {
  if (!url) return "/default-avatar.png";

  // Skip blob: and data:
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;

  try {
    // ✅ Add backend base URL if path is relative
    const baseURL = "https://bkc-dt1n.onrender.com";
    const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`;

    // Remove any existing ?t= timestamps
    const cleanUrl = fullUrl.replace(/(\?|&)t=\d+/g, "");

    // Add timestamp (to bypass cache)
    const separator = cleanUrl.includes("?") ? "&" : "?";
    return `${cleanUrl}${separator}t=${Date.now()}`;
  } catch (err) {
    console.error("resolveURL error:", err);
    return url;
  }
};
