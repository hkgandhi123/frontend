export const resolveURL = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url; // handles Cloudinary and full URLs

  const base = process.env.REACT_APP_API_URL || "https://bkc-dt1n.onrender.com";
  return `${base}/${url.replace(/^\//, "")}`;
};
