import { posts } from './data.js';
import { triggerGlitch } from './utils.js';
import { marked } from 'marked';

// Import all markdown files eagerly
const postFiles = import.meta.glob('../../posts/*.md', { query: '?raw', import: 'default', eager: true });
const slideFiles = import.meta.glob('../../slides/*.{jpg,jpeg,png,webp}', { query: '?url', import: 'default', eager: true });
const slideDecks = {
    slides: Object.entries(slideFiles)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, url]) => url)
};

let lastScrollY = 0;
const blogView = document.getElementById('blog-view');
const backButton = document.getElementById('back-button');
const blogContent = document.querySelector('.blog-content');
const blogTitle = document.getElementById('blog-title');
const blogMeta = document.getElementById('blog-meta');
const blogImage = document.getElementById('blog-image');
const blogBody = document.getElementById('blog-body');
const viewport = document.getElementById('viewport');
const minimap = document.getElementById('minimap');

export function initBlog() {
    window.addEventListener('hashchange', handleHashChange);
    backButton.addEventListener('click', () => {
        window.location.hash = '';
    });
    // Initial check
    handleHashChange();
}

export function isBlogOpen() {
    return !blogView.classList.contains('hidden');
}

function handleHashChange() {
    triggerGlitch();

    const hash = window.location.hash.substring(1);
    const post = posts.find(p => p.slug === hash);

    if (post) {
        lastScrollY = window.scrollY;

        blogView.classList.remove('hidden');
        viewport.style.opacity = '0';
        if(minimap) minimap.style.display = 'none';
        document.body.style.overflow = 'hidden';

        blogTitle.textContent = post.title;
        blogMeta.textContent = post.meta + ' | ' + post.tags.join(', ');
        // blogImage.src = 'https://via.placeholder.com/800x400/001018/00f0ff?text=' + encodeURIComponent(post.title); 
        blogImage.style.display = 'none';
        blogContent.classList.remove('is-slideshow');
        
        const slideUrls = post.slides ? slideDecks[post.slides] : null;

        if (slideUrls && slideUrls.length > 0) {
            blogContent.classList.add('is-slideshow');
            renderSlideshow(slideUrls, post.title);
        } else {
            // Try to find the matching markdown file
            const mdPath = `../../posts/${post.slug}.md`;
            const mdContent = postFiles[mdPath];

            if (mdContent) {
                blogBody.innerHTML = marked.parse(mdContent);
            } else if (post.body.length < 50 || post.body === '...' || post.body === '--') {
                 blogBody.innerHTML = `
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                `;
            } else {
                blogBody.textContent = post.body;
            }
        }

    } else {
        blogView.classList.add('hidden');
        viewport.style.opacity = '1';
        if(minimap) minimap.style.display = 'block';
        document.body.style.overflow = '';
        blogContent.classList.remove('is-slideshow');
        
        if (lastScrollY > 0) {
            window.scrollTo(0, lastScrollY);
        }
    }
}

function renderSlideshow(slideUrls, title) {
    const total = slideUrls.length;
    if (total === 0) {
        blogBody.innerHTML = '<p>No slides available.</p>';
        return;
    }

    blogBody.innerHTML = `
        <div class="slideshow" data-slideshow>
            <button class="slide-nav slide-prev" type="button" aria-label="Previous slide">&larr;</button>
            <img class="slide-image" src="${slideUrls[0]}" alt="${title} slide 1">
            <button class="slide-nav slide-next" type="button" aria-label="Next slide">&rarr;</button>
            <div class="slide-counter">1 / ${total}</div>
        </div>
    `;

    const slideshow = blogBody.querySelector('[data-slideshow]');
    const prevButton = slideshow.querySelector('.slide-prev');
    const nextButton = slideshow.querySelector('.slide-next');
    const slideImage = slideshow.querySelector('.slide-image');
    const counter = slideshow.querySelector('.slide-counter');
    let index = 0;

    const updateSlide = (nextIndex) => {
        index = (nextIndex + total) % total;
        slideImage.src = slideUrls[index];
        slideImage.alt = `${title} slide ${index + 1}`;
        counter.textContent = `${index + 1} / ${total}`;
    };

    prevButton.addEventListener('click', () => updateSlide(index - 1));
    nextButton.addEventListener('click', () => updateSlide(index + 1));
}
