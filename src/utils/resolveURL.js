export const resolveURL = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = process.env.REACT_APP_API_URL || "https://bkc-dt1n.onrender.com";
  return `${base}/${url.replace(/^\//, "")}`;
};

// Use this for images that need cache-busting
export const resolveURLWithCacheBust = (url) =>
  url ? resolveURL(url) + `?t=${Date.now()}` : "/default-avatar.png";
