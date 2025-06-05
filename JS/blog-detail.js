import { fetchKrisimoooPosts } from "./blog-api.js";

// Select comment form elements
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const commentsSection = document.querySelector(".comments-section");

// Handle new comment submission
commentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const commentText = commentInput.value.trim();
  if (!commentText) return;

  // Create and display new comment element
  const commentElement = document.createElement("div");
  commentElement.className = "comment";
  commentElement.innerHTML = `<p><strong>You</strong>: ${commentText}</p>`;

  commentsSection.insertBefore(commentElement, commentForm);
  commentInput.value = "";
});

// Load and display detailed blog post content
async function loadPostDetail() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    document.getElementById("blogDetail").innerHTML = "<p>Post not found.</p>";
    return;
  }

  let allPosts = [];

  try {
    // Load both API and local posts
    const [apiPosts, localRes] = await Promise.all([
      fetchKrisimoooPosts(),
      fetch("../post/posts.json")
    ]);
    const localPosts = await localRes.json();

    // Combine API and local posts
    allPosts = [...apiPosts, ...localPosts];
  } catch (err) {
    // Show fallback error if fetching fails
    document.getElementById("blogDetail").innerHTML = "<p>Error loading blog post.</p>";
    return;
  }

  // Match post by ID
  const post = allPosts.find(p => decodeURIComponent(p.id) === decodeURIComponent(postId));

  if (!post) {
    document.getElementById("blogDetail").innerHTML = `<p>Post not found for ID: ${postId}</p>`;
    return;
  }

  // Render post details
  const container = document.getElementById("blogDetail");
  container.innerHTML = `
    <h1>${post.title}</h1>
    <p class="author-date">By <strong>${post.author?.name || "Unknown"}</strong> – ${new Date(post.created || Date.now()).toLocaleDateString()}</p>
    ${post.media?.url ? `<img src="${post.media.url}" alt="${post.media.alt || post.title}">` : ""}
    <p>${post.body}</p>
  `;
}

// Trigger loading when page is ready
document.addEventListener("DOMContentLoaded", loadPostDetail);
