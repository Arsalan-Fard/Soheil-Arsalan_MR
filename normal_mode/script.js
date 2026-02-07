import { marked } from "marked";
import { posts as locomotionPosts } from "../src/js/data.js";

const postFiles = import.meta.glob("../posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const categoryOrder = {
  Tutorials: 0,
  Labs: 1,
  Projects: 2,
  Uncategorized: 3,
};

const posts = locomotionPosts
  .filter((post) => post.isLabRoute || post.isTutorialRoute || post.isProjectRoute)
  .map((post, index) => {
    let category = "Uncategorized";
    if (post.isTutorialRoute) category = "Tutorials";
    else if (post.isLabRoute) category = "Labs";
    else if (post.isProjectRoute) category = "Projects";

    return {
      orderIndex: index,
      id: post.slug,
      mdPath: `../posts/${post.slug}.md`,
      category,
      title: post.title,
      body: post.body,
      image: post.image ? `../${post.image}` : null,
      slides: post.slides || null,
    };
  })
  .sort((a, b) => {
    const categoryDiff = (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99);
    return categoryDiff !== 0 ? categoryDiff : a.orderIndex - b.orderIndex;
  });

function getMarkdown(mdPath) {
  const content = postFiles[mdPath];
  return content || null;
}

function extractTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)\s*$/m);
  return match ? match[1].trim() : fallback;
}

function extractFirstImage(markdown) {
  const match = markdown.match(/!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/);
  if (!match) return null;

  let path = match[1];
  // If path starts with /, it's from public folder
  if (path.startsWith("/")) {
    path = ".." + path;
  } else if (!path.startsWith("..")) {
    // If it's a relative path without ../, assume it's in public
    path = "../public/" + path;
  }
  return path;
}

function renderMarkdown(markdown, options = {}) {
  const { rewriteImagePaths = false } = options;
  let html = marked.parse(markdown);
  if (rewriteImagePaths) {
    html = html.replace(/<img src="([^"]*)"/g, (match, src) => {
      let path = src;
      // If path starts with /, it's from public folder
      if (path.startsWith("/")) {
        path = ".." + path;
      } else if (!path.startsWith("..")) {
        // If it's a relative path without ../, assume it's in public
        path = "../public/" + path;
      }
      return `<img src="${path}"`;
    });
  }
  return html;
}

const slideFiles = import.meta.glob("../slides/*/*.{jpg,jpeg,png,webp,gif}", {
  query: "?url",
  import: "default",
  eager: true,
});
const slidesByDeck = Object.entries(slideFiles).reduce((acc, [path, url]) => {
  const segments = path.split("/");
  const folder = segments[segments.length - 2];
  if (!folder) return acc;
  if (!acc[folder]) acc[folder] = [];
  acc[folder].push([path, url]);
  return acc;
}, {});

Object.keys(slidesByDeck).forEach((folder) => {
  slidesByDeck[folder] = slidesByDeck[folder]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);
});

function showSlideshow(container, slideUrls, title) {
  if (slideUrls.length === 0) {
    container.innerHTML = "<p>No slides available.</p>";
    return;
  }

  container.innerHTML = `
        <div class="slideshow">
            <button class="slide-nav slide-prev">&larr;</button>
            <img class="slide-image" src="${slideUrls[0]}" alt="${title} slide 1">
            <button class="slide-nav slide-next">&rarr;</button>
            <div class="slide-counter">1 / ${slideUrls.length}</div>
        </div>
    `;

  const prevBtn = container.querySelector(".slide-prev");
  const nextBtn = container.querySelector(".slide-next");
  const img = container.querySelector(".slide-image");
  const counter = container.querySelector(".slide-counter");
  let currentSlide = 0;

  function goToSlide(newIndex) {
    currentSlide = (newIndex + slideUrls.length) % slideUrls.length;
    img.src = slideUrls[currentSlide];
    img.alt = `${title} slide ${currentSlide + 1}`;
    counter.textContent = `${currentSlide + 1} / ${slideUrls.length}`;
  }

  prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));
}

function renderCards(container) {
  const fragment = document.createDocumentFragment();

  for (const post of posts) {
    const markdown = getMarkdown(post.mdPath);
    const title = post.title || extractTitle(markdown || "", post.id);
    const firstImage = post.image || (markdown ? extractFirstImage(markdown) : null);

    const article = document.createElement("article");
    article.className = "project-card";
    article.dataset.category = post.category;
    article.dataset.id = post.id;

    article.innerHTML = `
            <div class="image-container">
                ${firstImage ? `<img src="${firstImage}" alt="${title}">` : ""}
            </div>
            <div class="project-info">
                <h3 class="project-title">${title}</h3>
                <div class="tags">
                    <span class="tag">${post.category}</span>
                </div>
            </div>
        `;

    fragment.appendChild(article);
  }

  container.innerHTML = "";
  container.appendChild(fragment);
}

function setActiveFilter(buttons, activeButton) {
  buttons.forEach((btn) => btn.classList.remove("active"));
  activeButton.classList.add("active");
}

function applyFilter(cards, category) {
  cards.forEach((card) => {
    const cardCategory = card.getAttribute("data-category");
    const show = category === "all" || cardCategory === category;
    card.classList.toggle("hidden", !show);
  });
}

function showProjectDetails(postId) {
  const gallery = document.getElementById("gallery");
  const filterNav = document.querySelector(".filter-nav");
  const detailView = document.getElementById("project-detail");
  const detailTitle = document.getElementById("detail-title");
  const detailImage = document.getElementById("detail-image");
  const detailContent = document.getElementById("detail-content");

  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const markdown = getMarkdown(post.mdPath);
  const title = post.title || extractTitle(markdown || "", post.id);
  const slideUrls = post.slides ? slidesByDeck[post.slides] || [] : [];

  if (slideUrls.length > 0) {
    detailTitle.textContent = title;
    detailImage.classList.add("hidden");
    showSlideshow(detailContent, slideUrls, title);
  } else {
    detailTitle.textContent = title;
    detailImage.src = "";
    detailImage.classList.add("hidden");
    if (markdown) {
      detailContent.innerHTML = renderMarkdown(markdown, {
        rewriteImagePaths: true,
      });
    } else {
      detailContent.innerHTML = `<p>${post.body || "No content available yet."}</p>`;
    }
  }

  gallery.classList.add("hidden");
  filterNav.classList.add("hidden");
  detailView.classList.remove("hidden");
  window.scrollTo(0, 0);
}

function showGallery() {
  const gallery = document.getElementById("gallery");
  const filterNav = document.querySelector(".filter-nav");
  const detailView = document.getElementById("project-detail");

  gallery.classList.remove("hidden");
  filterNav.classList.remove("hidden");
  detailView.classList.add("hidden");
  window.scrollTo(0, 0);
}

function getPostIdFromHash() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;
  const postId = decodeURIComponent(hash);
  return posts.some((post) => post.id === postId) ? postId : null;
}

function applyRouteFromUrl() {
  const postId = getPostIdFromHash();
  if (postId) {
    showProjectDetails(postId);
  } else {
    showGallery();
  }
}

function initFiltering() {
  const buttons = Array.from(document.querySelectorAll(".filter-btn"));
  const cards = Array.from(document.querySelectorAll(".project-card"));

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.filter || "all";
      setActiveFilter(buttons, btn);
      applyFilter(cards, category);
    });
  });
}

function initNavigation() {
  const backButton = document.getElementById("back-btn");
  if (backButton) {
    backButton.addEventListener("click", () => {
      if (window.location.hash) {
        history.back();
      } else {
        showGallery();
      }
    });
  }

  const cards = Array.from(document.querySelectorAll(".project-card"));
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const nextHash = `#${encodeURIComponent(card.dataset.id)}`;
      if (window.location.hash !== nextHash) {
        window.location.hash = nextHash;
      } else {
        showProjectDetails(card.dataset.id);
      }
    });
  });

  window.addEventListener("hashchange", applyRouteFromUrl);
}

function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    body.classList.add("dark-mode");
  }

  if (!themeToggle) return;
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const currentTheme = body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    localStorage.setItem("theme", currentTheme);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  renderCards(gallery);
  initFiltering();
  initNavigation();
  initThemeToggle();
  applyRouteFromUrl();
});
