// Project Content Data
const projectData = {
    "lab-1": {
        content: `
            <div class="blog-post">
                In this tutorial, we will create a personal website using GitHub Pages. Follow the steps below to set up your site:
                <ol>
                    <li>
                        <p>First, we create a repository and upload our code.</p>
                        <figure>
                            <img src="blog_setup/1.png" alt="GitHub dropdown menu with 'New repository' outlined in dark orange." style="max-width: 100%; height: auto; display: block; margin: 15px 0; border-radius: 6px;">
                            <figcaption>GitHub dropdown menu</figcaption>
                        </figure>
                    </li>
                    <li>
                        <p>We used https://www.bestfolios.com/portfolio/leahlee to get a template and modified to meets our need.</p>
                        <figure>
                            <img src="blog_setup/2.png" alt="GitHub Pages settings in a repository with 'octocat.github.io' outlined." style="max-width: 100%; height: auto; display: block; margin: 15px 0; border-radius: 6px;">
                            <figcaption>Repository naming</figcaption>
                        </figure>
                    </li>
                    <li>
                        <p>Choose a repository visibility. For more information, see <a href="#">About repositories</a>.</p>
                    </li>
                    <li>
                        <p>Toggle <strong>Add README</strong> to <strong>On</strong>.</p>
                    </li>
                    <li>
                        <p>Click <strong>Create repository</strong>.</p>
                    </li>
                    <li>
                        <p>Under your repository name, click <strong>Settings</strong>. If you cannot see the "Settings" tab, select the <strong>...</strong> dropdown menu, then click <strong>Settings</strong>.</p>
                        <figure>
                            <img src="blog_setup/3.png" alt="Repository header with 'Settings' tab highlighted." style="max-width: 100%; height: auto; display: block; margin: 15px 0; border-radius: 6px;">
                            <figcaption>Repository Settings tab</figcaption>
                        </figure>
                    </li>
                    <li>
                        <p>In the "Code and automation" section of the sidebar, click <strong>Pages</strong>.</p>
                    </li>
                    <li>
                        <p>Under "Build and deployment", under "Source", select <strong>Deploy from a branch</strong>.</p>
                    </li>
                    <li>
                        <p>Under "Build and deployment", under "Branch", use the branch dropdown menu and select a publishing source.</p>
                        <figure>
                            <img src="blog_setup/4.png" alt="GitHub Pages branch selection menu with 'None' outlined." style="max-width: 100%; height: auto; display: block; margin: 15px 0; border-radius: 6px;">
                            <figcaption>GitHub Pages branch selection</figcaption>
                        </figure>                    </li>
                    <li>
                        <p>Optionally, open the <code>README.md</code> file of your repository. The <code>README.md</code> file is where you will write the content for your site. You can edit the file or keep the default content for now.</p>
                    </li>
                    <li>
                        <p>Visit <code>username.github.io</code> to view your new website. Note that it can take up to 10 minutes for changes to your site to publish after you push the changes to GitHub.</p>
                    </li>
                </ol>
            </div>
        `
    },
    "lab-2": {
        content: "<p>Content for Lab 2: Unity Setup will go here.</p>"
    },
    "lecture-1": {
        content: "<p>Content for Lecture 1: VR Fails will go here.</p>"
    },
    "project-1": {
        content: "<p>Content for Final Project: Locomotion will go here.</p>"
    }
};

function filterProjects(category, btnElement) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function showProjectDetails(card) {
    const gallery = document.getElementById('gallery');
    const filterNav = document.querySelector('.filter-nav');
    const detailView = document.getElementById('project-detail');
    const detailTitle = document.getElementById('detail-title');
    const detailImage = document.getElementById('detail-image');
    const detailContent = document.getElementById('detail-content');

    // Get content from the clicked card
    const title = card.querySelector('.project-title').innerHTML;
    const imageSrc = card.querySelector('img').src;
    const projectId = card.getAttribute('data-id');

    // Populate detail view
    detailTitle.innerHTML = title;
    detailImage.src = imageSrc;
    
    // Inject specific content if available, otherwise default
    if (projectData[projectId]) {
        detailContent.innerHTML = projectData[projectId].content;
    } else {
        detailContent.innerHTML = "<p>Details for this project are coming soon.</p>";
    }

    // Toggle visibility
    gallery.classList.add('hidden');
    filterNav.classList.add('hidden');
    detailView.classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function showGallery() {
    const gallery = document.getElementById('gallery');
    const filterNav = document.querySelector('.filter-nav');
    const detailView = document.getElementById('project-detail');

    // Toggle visibility
    gallery.classList.remove('hidden');
    filterNav.classList.remove('hidden');
    detailView.classList.add('hidden');
}

// Add event listeners to project cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('click', () => showProjectDetails(card));
    });

    // Theme Toggling
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
});