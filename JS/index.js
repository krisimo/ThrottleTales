// === Import UI features and logic ===
import {
  loadLocalPostsOnly,         // (Optional fallback) Loads only local JSON posts
  togglePostFormVisibility    // Toggles the create post form if it's present
} from "./blog-display.js";

import { loadHomepagePosts } from "./blog-api.js";  // Loads posts from API and local JSON
import { enableDarkModeToggle } from "./darcmode.js";  // Enables light/dark mode switching
import { setupNavbar } from "./navbar.js";             // Sets up mobile/desktop nav features
import { setupScrollEffects } from "./scroll-effects.js"; // Applies scroll-related visual effects
import { setupAuthModal } from "./auth.js";               // Sets up login/register modal and state
import { setupLogin } from "./login.js";                  // Handles API login/register logic

// === Initialize homepage features ===
loadLocalPostsOnly();       // Optional: Load only local posts (can be removed if unused)
togglePostFormVisibility(); // Enable form toggle for creating a post (if included)
setupNavbar();              // Setup responsive nav + burger menu
setupScrollEffects();       // Enable scroll effects for hero/image sections
enableDarkModeToggle();     // Enable dark mode toggle
setupAuthModal();           // Setup modal open/close and auth UI updates
setupLogin();               // Register and login event handlers

loadHomepagePosts();        // 👈 Final step: Load blog posts from API + local JSON and display them
