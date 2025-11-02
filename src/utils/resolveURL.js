// utils/resolveURL.js
export const resolveURLWithCacheBust = (url) => {
  if (!url) return "/default-avatar.png";

  // Skip blob: and data:
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;

  try {
    // Remove any existing ?t= timestamps
    const cleanUrl = url.replace(/(\?|&)t=\d+/g, "");

    // Add timestamp (forces Cloudinary/Firebase to refresh cache)
    const separator = cleanUrl.includes("?") ? "&" : "?";
    return `${cleanUrl}${separator}t=${Date.now()}`;
  } catch (err) {
    console.error("resolveURL error:", err);
    return url;
  }
};
