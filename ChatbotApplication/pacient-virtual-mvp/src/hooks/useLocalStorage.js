import { useState, useEffect } from 'react';

// Această funcție ne ajută să citim și să scriem în localStorage
// ca și cum am folosi un useState normal.
function getStorageValue(key, defaultValue) {
  const saved = localStorage.getItem(key);
  const initial = saved ? JSON.parse(saved) : defaultValue;
  return initial;
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // Salvează în localStorage de fiecare dată când 'value' se schimbă
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};