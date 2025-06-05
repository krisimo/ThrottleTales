// profile.js
import { enableDarkModeToggle } from '../JS/darcmode.js';
import { createBlogPost, fetchUserPosts, deletePost } from '../JS/blog-api.js';
import { loadAllPosts, togglePostFormVisibility } from '../JS/blog-display.js';
import { setupNavbar } from '../JS/navbar.js';
import '../JS/auth.js';
import '../JS/login.js';
import '../JS/darcmode.js';
import '../JS/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  enableDarkModeToggle();  // Dark mode toggle
  setupNavbar();           // Navbar behavior

  const welcome = document.getElementById('userWelcome');
  const welcomeMobile = document.getElementById('userWelcomeMobile');
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutBtnMobile = document.getElementById('logoutBtnMobile');
  const messageBox = document.getElementById('message');
  const postsContainer = document.getElementById('userPosts');
  const createPostForm = document.getElementById('newPostForm');

  const currentUser = localStorage.getItem('currentUser');
  const token = localStorage.getItem('token');

  if (!currentUser || !token) {
    location.href = '../index.html';
    return;
  }

  // === Show Welcome Message ===
  if (welcome) {
    welcome.innerHTML = `<a href="account/profile.html" class="profile-link">Welcome ${currentUser}</a>`;
    welcome.classList.remove('hidden');
  }

  if (welcomeMobile) {
    welcomeMobile.innerHTML = `<a href="account/profile.html" class="profile-link">Welcome ${currentUser}</a>`;
    welcomeMobile.classList.remove('hidden');
  }

  // === Logout buttons ===
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    location.href = '../index.html';
  });

  logoutBtnMobile?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    location.href = '../index.html';
  });

  // === Load Posts ===
  loadUserPosts();
  togglePostFormVisibility();

  // === Helper: Show Message ===
  function showMessage(msg) {
    messageBox.textContent = msg;
    setTimeout(() => (messageBox.textContent = ''), 3000);
  }

  // === Load User Blog Posts ===
  async function loadUserPosts() {
    try {
      const posts = await fetchUserPosts(currentUser);
      if (!posts.length) {
        postsContainer.innerHTML = "<p>You haven't posted anything yet.</p>";
      } else {
        postsContainer.innerHTML = posts.map(post => `
          <div class="post-card">
            ${post.media?.url ? `<img src="${post.media.url}" alt="${post.media.alt || post.title}" />` : ''}
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <button class="delete-btn" data-id="${post.id}">Delete</button>
          </div>
        `).join('');

        postsContainer.querySelectorAll('.delete-btn').forEach(button => {
          button.addEventListener('click', async (e) => {
            const postId = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this post?')) {
              try {
                await deletePost(postId);
                await loadUserPosts();
              } catch (err) {
                console.error('Failed to delete post:', err);
                alert('Error deleting post.');
              }
            }
          });
        });
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      showMessage('Error loading posts');
    }
  }

  // === Submit New Blog Post ===
  createPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById("newPostTitle").value.trim();
    const body = document.getElementById("newPostContent").value.trim();
    const imageUrl = document.getElementById("newPostImageUrl").value.trim();

    if (!title || !body) {
      return showMessage("Please fill in both the title and body.");
    }

    const media = {
      url: imageUrl || "https://via.placeholder.com/600x400?text=No+Image",
      alt: `Image for post titled "${title}"`
    };

    try {
      await createBlogPost(title, body, media.url);
      createPostForm.reset();
      showMessage("✅ Post published!");
      await loadUserPosts();
    } catch (err) {
      console.error("❌ Failed to publish post:", err);
      showMessage("❌ Failed to publish post.");
    }
  });
});
