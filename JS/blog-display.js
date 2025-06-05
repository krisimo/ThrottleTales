// === Import utilities ===
import { renderPosts, fetchKrisimoooPosts } from "./blog-api.js";

// === Pagination configuration ===
let currentPage = 1;
const postsPerPage = 9;
let allPosts = [];

// === Load API and local posts for homepage ===
export async function loadAllPosts() {
  try {
    const apiPosts = await fetchKrisimoooPosts(); // Fetch from Noroff API user "krisimooo"
    let localPosts = [];

    try {
      const res = await fetch("../post/posts.json"); // Fetch local filler posts
      localPosts = await res.json();
    } catch (_) {
      // Ignore local post loading errors silently
    }

    allPosts = [...apiPosts, ...localPosts]; // Combine API + local posts (API first)
    renderPaginatedPosts();
    renderPaginationControls();
  } catch (_) {
    // Silent fail if API fetch fails
  }
}

// === blog display after DOM is ready ===
async function initBlogDisplay() {
  await loadAllPosts();
}

document.addEventListener("DOMContentLoaded", initBlogDisplay);

// === posts for current page ===
function renderPaginatedPosts() {
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pagePosts = allPosts.slice(start, end);
  renderPosts(pagePosts);

  const blogFeed = document.getElementById("blogFeed");
  const blogGrid = document.getElementById("blogGrid");

  if (blogFeed && blogGrid) {
    if (window.scrollY > 10) {
      blogFeed.classList.add("reveal");
      blogGrid.classList.add("reveal");
    } else {
      blogFeed.classList.remove("reveal");
      blogGrid.classList.remove("reveal");
    }
  }
}

// === pagination controls below posts ===
function renderPaginationControls() {
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  if (totalPages <= 1) return;

  const navRow = document.createElement("div");
  navRow.className = "pagination-nav";

  // Prev button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "<";
  prevBtn.className = "pagination-arrow";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPaginatedPosts();
      renderPaginationControls();
      scrollToBlogFeed();
    }
  });

  // Current page number
  const current = document.createElement("span");
  current.textContent = currentPage;
  current.className = "pagination-current";

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = ">";
  nextBtn.className = "pagination-arrow";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderPaginatedPosts();
    renderPaginationControls();
    scrollToBlogFeed();

    const blogFeed = document.getElementById("blogFeed");
    const blogGrid = document.getElementById("blogGrid");

    if (blogFeed && blogGrid) {
      blogFeed.classList.add("reveal");
      blogGrid.classList.add("reveal");
    }
  } // 👈❗ YOU FORGOT THIS CLOSING BRACE
});


  // add to DOM
  navRow.appendChild(prevBtn);
  navRow.appendChild(current);
  navRow.appendChild(nextBtn);
  paginationContainer.appendChild(navRow);

  const total = document.createElement("div");
  total.className = "pagination-total";
  total.textContent = totalPages;
  paginationContainer.appendChild(total);
}

// === Smooth scroll to blog grid section ===
function scrollToBlogFeed() {
  const offset = window.scrollY + 1;  if (blogFeed) {
    window.scrollTo({ top: offset, behavior: "smooth" });
  }
}

// === Toggle new post form (used in profile) ===
export function togglePostFormVisibility() {
  const toggleBtn = document.getElementById("showNewPostFormBtn");
  const postForm = document.getElementById("newPostForm");

  if (!toggleBtn || !postForm) return;

  toggleBtn.addEventListener("click", () => {
    postForm.classList.toggle("is-hidden");
    toggleBtn.textContent = postForm.classList.contains("is-hidden")
      ? "New Blog"
      : "Cancel";
  });
}

// === Load local JSON-only posts (fallback) ===
export async function loadLocalPostsOnly() {
  try {
    const res = await fetch("../post/posts.json");
    const posts = await res.json();
    renderPosts(posts);
  } catch (_) {
    // Ignore error if local file missing
  }
}
