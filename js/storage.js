// js/storage.js

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromStorage(key) {
  const value = localStorage.getItem(key);

  try {
    return JSON.parse(value);
  } catch (e) {
    return value; // fallback kalau bukan JSON
  }
}
