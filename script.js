const projectData = {
    "lab-1": { markdownPath: "posts/lab-1.md" },
    "lab-2": { markdownPath: "posts/lab-2.md" },
    "lecture-1": { markdownPath: "posts/lecture-1.md" },
    "project-1": { markdownPath: "posts/project-1.md" }
};

const markdownCache = new Map();
let activeProjectId = null;

function filterProjects(category, btnElement) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('d-none');
        } else {
            card.classList.add('d-none');
        }
    });
}

function showGallery() {
    const gallery = document.getElementById('gallery');
    const filterNav = document.querySelector('.filter-nav');
    const detailView = document.getElementById('project-detail');

    gallery.classList.remove('d-none');
    filterNav.classList.remove('d-none');
    detailView.classList.add('d-none');
    
    history.pushState(null, null, ' ');
}

function renderProjectDetails(projectId) {
    const gallery = document.getElementById('gallery');
    const filterNav = document.querySelector('.filter-nav');
    const detailView = document.getElementById('project-detail');
    const detailTitle = document.getElementById('detail-title');
    const detailImage = document.getElementById('detail-image');
    const detailContent = document.getElementById('detail-content');

    const card = document.querySelector(`.project-card[data-id="${projectId}"]`);
    if (!card) return;

    const title = card.querySelector('.project-title').innerHTML;
    const imageSrc = card.querySelector('img').src;
    const imageAlt = card.querySelector('img').alt;

    detailTitle.innerHTML = title;
    detailImage.src = imageSrc;
    detailImage.alt = imageAlt;

    activeProjectId = projectId;
    detailContent.innerHTML = '<p class="loading">Loading…</p>';
    renderProjectMarkdown(projectId).catch(() => {
        if (activeProjectId !== projectId) return;
        detailContent.innerHTML = "<p>Couldn't load this post. Please try again.</p>";
    });

    gallery.classList.add('d-none');
    filterNav.classList.add('d-none');
    detailView.classList.remove('d-none');

    window.scrollTo(0, 0);
}

function getMarkdownPathForProject(projectId) {
    return projectData[projectId]?.markdownPath ?? `posts/${projectId}.md`;
}

async function renderProjectMarkdown(projectId) {
    const markdownPath = getMarkdownPathForProject(projectId);

    if (markdownCache.has(markdownPath)) {
        if (activeProjectId !== projectId) return;
        document.getElementById("detail-content").innerHTML = markdownCache.get(markdownPath);
        return;
    }

    const response = await fetch(markdownPath, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Failed to load markdown: ${response.status}`);

    const markdown = await response.text();
    const rendered = DOMPurify.sanitize(marked.parse(markdown));
    markdownCache.set(markdownPath, rendered);

    if (activeProjectId !== projectId) return;
    document.getElementById("detail-content").innerHTML = rendered;
}

function openProject(projectId) {
    renderProjectDetails(projectId);
    history.pushState({id: projectId}, '', '#' + projectId);
}

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-id');
            openProject(projectId);
        });
    });

    window.addEventListener('popstate', (event) => {
        const hash = window.location.hash.substring(1); 
        if (hash) {
            renderProjectDetails(hash);
        } else {
            const gallery = document.getElementById('gallery');
            const filterNav = document.querySelector('.filter-nav');
            const detailView = document.getElementById('project-detail');
            
            gallery.classList.remove('d-none');
            filterNav.classList.remove('d-none');
            detailView.classList.add('d-none');
        }
    });

    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        renderProjectDetails(initialHash);
    }

    const themeToggle = document.getElementById('theme-toggle');
    const headerImage = document.getElementById('header-image');
    
    const htmlElement = document.documentElement;

    const updateHeaderImage = () => {
        if (!headerImage) return;
        const isDark = htmlElement.getAttribute('data-bs-theme') === 'dark';
        headerImage.src = isDark ? 'styles/2.png' : 'styles/1.png';
    };

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.setAttribute('data-bs-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-bs-theme', 'light');
    }
    
    updateHeaderImage();

    const toggleTheme = () => {
        if (window.PowerGlitch) {
            PowerGlitch.glitch('.container', {
                playMode: 'always',
                createContainers: false,
                hideOverflow: false,
                timing: {
                    duration: 400,
                    iterations: 1
                },
                glitchTimeSpan: {
                    start: 0,
                    end: 1
                },
                shake: {
                    velocity: 15,
                    amplitudeX: 0.05,
                    amplitudeY: 0.05
                },
                slice: {
                    count: 15,
                    velocity: 20,
                    minHeight: 0.02,
                    maxHeight: 0.15,
                    hueRotate: true,
                },
            });
        }

        setTimeout(() => {
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateHeaderImage();
        }, 200);
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (headerImage) {
        headerImage.addEventListener('click', toggleTheme);
    }
});