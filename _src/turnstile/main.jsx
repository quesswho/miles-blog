import { createRoot } from "react-dom/client";
import App from "./App.jsx";

/* App.jsx persists progress through `window.storage`, an async key/value API
   that only exists in the environment it was authored in. Back it with
   localStorage so progress survives between sessions here, and leave any
   pre-existing implementation alone so App.jsx stays portable. */
if (!window.storage) {
  const PREFIX = "turnstile:";
  window.storage = {
    async get(key) {
      const value = window.localStorage.getItem(PREFIX + key);
      return value === null ? null : { value };
    },
    async set(key, value) {
      window.localStorage.setItem(PREFIX + key, value);
    },
  };
}

const root = document.getElementById("turnstile-root");
if (root) createRoot(root).render(<App />);
