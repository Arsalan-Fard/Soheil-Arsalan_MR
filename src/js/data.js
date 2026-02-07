export const posts = [
    {
        title: "Presentations and Project",
        meta: "Main Track",
        body: "The project subject is Locomotion. You can see presentations, demos and final project in this path.",
        tags: ["projects", "main"],
        isProjects: true,
        slug: "main-track",
        // image: "images/blog_image.jpg"
    },
    {
        title: "Lab Assignments",
        meta: "Lab Track",
        body: "This path shows lab assignments. You can see unity projects about a ball in Telecom paris!",
        tags: ["lab", "assignments"],
        isLabAssignments: true,
        slug: "lab-track",
        // image: "images/unity_setup_image.jpg"
    },
    {
        title: "Tutorials",
        meta: "Tutorial Track",
        body: "Learn how to setup a blog like this. And also how to setup Unity 6 for your VR projects.",
        tags: ["Tutorial", "theory"],
        isTutorialAssignments: true,
        slug: "tutorial-track",
        // image: "/images/VR_fail_image.jpg"
    },
    
    {
        title: "Lab 01: Roll a Ball",
        meta: "2026.01.06",
        body: "A ball in Telecom Paris!",
        tags: ["Unity", "C#"],
        isLabRoute: true,
        slug: "lab-01",
        image: "images/1.png"
    },
    {
        title: "Lab 02: The VR Ball",
        meta: "2026.01.14",
        body: "How to run the ball project in VR.",
        tags: ["Unity", "C#", "VR"],
        isLabRoute: true,
        slug: "lab-02",
        image: "images/3.png"
    },
    {
        title: "Tutorial 01: Blog Setup",
        meta: "2025.12.18",
        body: "Quick tips about how this blog is created and deployed on github.",
        tags: ["Sass", "Vite", "GitHub Pages"],
        isTutorialRoute: true,
        slug: "tutorial-01",
        image: "images/blog_image.jpg"
    },
    {
        title: "Tutorial 02: Unity Setup",
        meta: "2025.12.20",
        body: "This section provides you quick tips about how to setup Unity 6.",
        tags: ["Unity 6", "Microsoft Visual Studio"],
        isTutorialRoute: true,
        slug: "tutorial-02",
        image: "images/unity_setup_image.jpg"
    },
    
    {
        title: "Presentation 01: Three Locomotion Techniques",
        meta: "2025.12.08",
        body: "First presentation.",
        tags: ["Presentation", "Locomotion", "VR"],
        isProjectRoute: true,
        slug: "project-01",
        slides: "1",
        image: "images/4.png"
    },
    {
        title: "Presentation 02: Our Locomotion Technique",
        meta: "2026.01.20",
        body: "Second Presentation.",
        tags: ["Presentation", "Locomotion", "VR"],
        isProjectRoute: true,
        slug: "project-02",
        slides: "2",
        image: "images/5.jpg"
    },
    {
        title: "Final Presentation: Magic Broom",
        meta: "2026.02.04",
        body: "Final presentation",
        tags: ["Project", "Locomotion", "MR"],
        isProjectRoute: true,
        slug: "project-03",
        slides: "3",
        image:  "images/6.png"
    },

];

export const spacing = 2300;
export const scatterX = 220;
export const scatterY = 140;

const trackCounts = posts.reduce(
    (counts, post, index) => {
        if (index <= 2) return counts;
        if (post.isLabRoute) {
            counts.lab += 1;
        } else if (post.isTutorialRoute) {
            counts.tutorial += 1;
        } else {
            counts.project += 1;
        }
        return counts;
    },
    { lab: 0, tutorial: 0, project: 0 }
);

const diagonalSpacing = spacing * Math.cos(Math.PI / 4);
const maxTrackDepth = Math.max(
    trackCounts.project * spacing,
    trackCounts.lab * diagonalSpacing,
    trackCounts.tutorial * diagonalSpacing
);

export const totalDepth = maxTrackDepth;
export const introDepth = 5400;

// Camera forward limit (prevents scrolling far past the content).
export const maxForwardDepth = 650;
