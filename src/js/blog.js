import { posts } from './data.js';
import { marked } from 'marked';

const postFiles = import.meta.glob('../../posts/*.md', { query: '?raw', import: 'default', eager: true });
const slideFiles = import.meta.glob('../../slides/*/*.{jpg,jpeg,png,webp,gif}', { query: '?url', import: 'default', eager: true });
const slidesByDeck = Object.entries(slideFiles).reduce((acc, [path, url]) => {
    const segments = path.split('/');
    const folder = segments[segments.length - 2];
    if (!folder) return acc;
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push([path, url]);
    return acc;
}, {});

const slideNotesByDeck = {
    "3": {
        2: "The right controller is attached to the tip of the physical stick. Its forward vector defines our virtual forward direction with one caveat: at the beginning of the game, the right controller can look anywhere. We calculate the angle between actual forward and where it looks, then use that offset for our forward direction.",
        3: "While our work is very similar to this paper, we are mostly focused on smooth experience rather than answering specific research questions about leaning.",
        4: "The acceleration happens when the user leans. In other words, the distance between head and right controller is calculated. To encourage users to reach for the tip of the broom, extra speed is possible. We also map physical and virtual sticks by using two controllers at the beginning of the game (left controller is free after that).",
        5: "Since we are using the controller's forward axis, we can use that for vertical steering. The left controller is used for creating portals that bring us back to another point.",
        8: "Our study had 7 participants. Their demography is provided as follows."
    }
};

Object.keys(slidesByDeck).forEach((folder) => {
    slidesByDeck[folder] = slidesByDeck[folder]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, url]) => url);
});

let lastScrollY = 0;
const blogView = document.getElementById('blog-view');
const backButton = document.getElementById('back-button');
const blogContent = document.querySelector('.blog-content');
const blogTitle = document.getElementById('blog-title');
const blogMeta = document.getElementById('blog-meta');
const blogBody = document.getElementById('blog-body');
const viewport = document.getElementById('viewport');
const tableOfContents = document.getElementById('table-of-contents');

export function initBlog() {
    window.addEventListener('hashchange', handleHashChange);
    backButton.addEventListener('click', () => {
        window.location.hash = '';
    });
    handleHashChange();
}

export function isBlogOpen() {
    return !blogView.classList.contains('hidden');
}

function handleHashChange() {
    const hash = window.location.hash.substring(1);
    const post = posts.find(p => p.slug === hash);

    if (!post) {
        blogView.classList.add('hidden');
        viewport.style.opacity = '1';
        document.body.style.overflow = '';
        blogContent.classList.remove('is-slideshow');
        tableOfContents.classList.add('hidden');
        if (lastScrollY > 0) {
            window.scrollTo(0, lastScrollY);
        }
        return;
    }

    lastScrollY = window.scrollY;
    blogView.classList.remove('hidden');
    viewport.style.opacity = '0';
    document.body.style.overflow = 'hidden';

    blogTitle.textContent = post.title;
    blogMeta.textContent = post.meta + ' | ' + post.tags.join(', ');
    blogContent.classList.remove('is-slideshow');

    const slideUrls = post.slides ? (slidesByDeck[post.slides] || []) : [];

    if (slideUrls.length > 0) {
        blogContent.classList.add('is-slideshow');
        tableOfContents.classList.add('hidden');
        showSlideshow(slideUrls, post.title, post.slides);
        return;
    }

    const mdPath = `../../posts/${post.slug}.md`;
    const mdContent = postFiles[mdPath];

    if (mdContent) {
        blogBody.innerHTML = marked.parse(mdContent);
        generateTableOfContents();
    } else if (post.body.length < 50 || post.body === '...' || post.body === '--') {
        blogBody.innerHTML = '<p>No content available yet.</p>';
        tableOfContents.classList.add('hidden');
    } else {
        blogBody.textContent = post.body;
        tableOfContents.classList.add('hidden');
    }
}

function showSlideshow(slideUrls, title, deckId) {
    if (slideUrls.length === 0) {
        blogBody.innerHTML = '<p>No slides available.</p>';
        return;
    }

    const notesBySlide = slideNotesByDeck[deckId] || {};

    blogBody.innerHTML = `
        <div class="slideshow">
            <button class="slide-nav slide-prev">&larr;</button>
            <div class="slide-frame">
                <img class="slide-image" src="${slideUrls[0]}" alt="${title} slide 1">
                <div class="slide-counter">1 / ${slideUrls.length}</div>
            </div>
            <aside class="slide-note hidden" aria-live="polite"></aside>
            <button class="slide-nav slide-next">&rarr;</button>
        </div>
    `;

    const slideshow = blogBody.querySelector('.slideshow');
    const prevBtn = blogBody.querySelector('.slide-prev');
    const nextBtn = blogBody.querySelector('.slide-next');
    const img = blogBody.querySelector('.slide-image');
    const counter = blogBody.querySelector('.slide-counter');
    const notePanel = blogBody.querySelector('.slide-note');
    let currentSlide = 0;

    function goToSlide(newIndex) {
        currentSlide = (newIndex + slideUrls.length) % slideUrls.length;
        img.src = slideUrls[currentSlide];
        img.alt = `${title} slide ${currentSlide + 1}`;
        counter.textContent = `${currentSlide + 1} / ${slideUrls.length}`;

        const note = notesBySlide[currentSlide + 1];
        if (note) {
            notePanel.textContent = note;
            notePanel.classList.remove('hidden');
            slideshow.classList.add('has-note');
            return;
        }

        notePanel.textContent = '';
        notePanel.classList.add('hidden');
        slideshow.classList.remove('has-note');
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    goToSlide(0);
}

function generateTableOfContents() {
    const headers = blogBody.querySelectorAll('h1, h2, h3');

    if (headers.length === 0) {
        tableOfContents.classList.add('hidden');
        return;
    }

    tableOfContents.innerHTML = '';
    tableOfContents.classList.remove('hidden');

    headers.forEach((header, index) => {
        const id = `header-${index}`;
        header.id = id;

        const link = document.createElement('a');
        link.href = `#${id}`;
        link.className = `toc-item ${header.tagName.toLowerCase()}`;
        link.textContent = header.textContent;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const headerTop = header.offsetTop;
            blogView.scrollTo({ top: headerTop - 100, behavior: 'smooth' });
        });

        tableOfContents.appendChild(link);
    });
}
