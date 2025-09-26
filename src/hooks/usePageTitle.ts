import { useEffect } from 'react';

export const usePageTitle = (title?: string) => {
  useEffect(() => {
    const baseTitle = 'Fansat';
    const fullTitle = title ? `${baseTitle} | ${title}` : baseTitle;
    document.title = fullTitle;
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};

// Helper function to set page title from anywhere
export const setPageTitle = (title?: string) => {
  const baseTitle = 'Fansat';
  const fullTitle = title ? `${baseTitle} | ${title}` : baseTitle;
  document.title = fullTitle;
};