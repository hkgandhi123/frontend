export const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_ID;

// Pageview track karne ka function
export const pageview = (url) => {
  if (!window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};
