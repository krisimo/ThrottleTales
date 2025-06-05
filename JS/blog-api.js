import { getBlogEndpoint, authHeaders } from './api.js';

const API_BASE_URL = "https://v2.api.noroff.dev";

// === Create blog post ===
export async function createBlogPost(title, body, mediaUrl) {
  const username = localStorage.getItem("currentUser");
  if (!username) throw new Error("Username not found in localStorage");

  const postBody = {
    title,
    body,
    tags: ["ThrottleTales"],
    media: {
      url: mediaUrl,
      alt: `Image for post titled "${title}"`
    }
  };

  const res = await fetch(`${API_BASE_URL}/blog/posts/${username}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(postBody),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || 'Unknown error');
  }

  return data;
}

// === Fetch all posts (general fallback, unused) ===
export async function fetchAllPosts() {
  const username = localStorage.getItem("currentUser");
  try {
    const res = await fetch(`${API_BASE_URL}/blog/posts/${username}`, {
      method: "GET",
      headers: authHeaders(),
    });
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    return [];
  }
}

// === Fetch posts for a specific user ===
export async function fetchUserPosts(username) {
  try {
    const res = await fetch(`${API_BASE_URL}/blog/posts/${username}`, {
      method: "GET",
      headers: authHeaders(),
    });
    const data = await res.json();
    const sorted = (data.data || []).sort((a, b) => new Date(b.created) - new Date(a.created));
    return sorted;
  } catch (err) {
    return [];
  }
}

// === Fetch posts for a fixed username "krisimooo" (used on homepage) ===
export function fetchKrisimoooPosts() {
  return fetchUserPosts("krisimooo");
}

// === Delete a blog post by ID for current user ===
export async function deletePost(postId) {
  const username = localStorage.getItem('currentUser');
  if (!username) throw new Error("Username not found");

  const url = `${API_BASE_URL}/blog/posts/${username}/${postId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.errors?.[0]?.message || 'Failed to delete post');
  }

  return true;
}

// === Render blog post cards to grid or user profile ===
export function renderPosts(posts) {
  const blogGrid = document.getElementById("blogGrid");
  const userPosts = document.getElementById("userPosts");
  const target = blogGrid || userPosts;
  if (!target) return;

  const isProfilePage = !!userPosts;

  // === Add layout adjustment if 3 or fewer posts ===
  if (posts.length <= 3) {
    target.classList.add("few-posts");
  } else {
    target.classList.remove("few-posts");
  }

  // === Render all posts ===
  target.innerHTML = posts.map(post => `
    <article class="post-card" data-id="${post.id}">
      <a href="blog.html?id=${post.id}">
        ${post.media?.url ? `<img src="${post.media.url}" alt="${post.media.alt || post.title}" />` : ''}
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      </a>
      ${isProfilePage ? `<button class="delete-post-btn" data-id="${post.id}">🗑 Delete</button>` : ''}
    </article>
  `).join("");

  // === Make blog cards clickable (homepage only) ===
  if (!isProfilePage) {
    const cards = target.querySelectorAll(".post-card");
    cards.forEach(card => {
      const postId = card.dataset.id;
      card.addEventListener("click", () => {
        window.location.href = `blog.html?id=${postId}`;
      });
    });
  }

  // === Enable delete buttons on profile page ===
  if (isProfilePage) {
    const deleteButtons = target.querySelectorAll(".delete-post-btn");
    deleteButtons.forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        try {
          await deletePost(id);
          btn.closest(".post-card").remove();
        } catch (err) {
          alert("Failed to delete post.");
        }
      });
    });
  }
}


// === Load homepage posts (API + local JSON filler) ===
export async function loadHomepagePosts() {
  try {
    const apiPosts = await fetchKrisimoooPosts();
    const localRes = await fetch("./post/posts.json");
    const localPosts = await localRes.json();

    const combined = [...apiPosts, ...localPosts];
    renderPosts(combined);
  } catch (err) {
    console.error("❌ Failed to load homepage posts:", err);
  }
}
