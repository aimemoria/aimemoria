// Fallback custom project details (used when projects.json and GitHub API are unavailable)
const customProjects = {
    "Eliot-Downloader": {
        name: "Eliot Downloader",
        category: "Full-Stack App",
        status: "Complete",
        description: "Web-based media downloader supporting 1000+ platforms including YouTube, Instagram, TikTok, and Facebook with user accounts and an admin dashboard.",
        details: "A full-stack Flask application with user registration/login, an admin dashboard with analytics, and real-time download progress via SocketIO. Supports video (MP4), audio (MP3), and photo downloads with quality selection. Includes cookie authentication for restricted content, batch processing, activity tracking, and a contact inbox system. Built as a practice project for full-stack Python development.",
        tech: ["Python", "Flask", "SocketIO", "yt-dlp", "HTML/CSS", "JavaScript"],
        github: "https://github.com/aimemoria/Eliot-Downloader",
        liveUrl: null
    },
    "Eliot-Downloader-Streamlit": {
        name: "Eliot Downloader (Streamlit)",
        category: "Full-Stack App",
        status: "Practice",
        description: "Streamlit version of Eliot Downloader, a simpler cloud-compatible media downloader with a dark-themed UI.",
        details: "A lighter version of Eliot Downloader rebuilt with Streamlit for rapid prototyping. Supports multiple quality options (360p to 1080p), MP3 audio extraction, cookie management for private content, and real-time progress tracking. Uses temp directories for cloud compatibility. Built as practice for Python web app development and cloud deployment.",
        tech: ["Python", "Streamlit", "yt-dlp", "FFmpeg"],
        github: "https://github.com/aimemoria/Eliot-Downloader-Streamlit",
        liveUrl: null
    },
    "moment-rental-platform": {
        name: "Moment Rental Platform",
        category: "Full-Stack App",
        status: "Complete",
        description: "A property rental platform built with Next.js 16, featuring guest booking, host management, payments via Flutterwave, and an admin panel.",
        details: "A full-featured rental marketplace where guests can search/book properties and hosts can list/manage them. Includes Flutterwave payment processing (cards, mobile money, bank transfers), host verification workflow (ID, selfie, proof of address), real-time messaging, reviews/ratings, earnings dashboard, and admin moderation tools. Uses PostgreSQL with Prisma ORM, NextAuth.js for auth, Cloudinary for images, and Tailwind CSS for styling.",
        tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Flutterwave", "NextAuth.js"],
        github: "https://github.com/aimemoria/moment-rental-platform",
        liveUrl: null
    },
    "spring-boot-oauth": {
        name: "Spring Boot OAuth",
        category: "Practice",
        status: "Practice",
        description: "A Spring Boot practice project demonstrating traditional login and Google OAuth 2.0 sign-in with role-based authorization.",
        details: "An orders management app built to practice Spring Security. Features username/password registration, Google OAuth 2.0 (OIDC) login, role-based access control (ROLE_USER, ROLE_ADMIN), and CRUD operations on orders. Uses Thymeleaf templates, MySQL database with JDBC, and Spring Security 6 configuration.",
        tech: ["Java 17", "Spring Boot 3", "Spring Security", "OAuth 2.0", "MySQL", "Thymeleaf", "Maven"],
        github: "https://github.com/aimemoria/spring-boot-oauth",
        liveUrl: null
    },
    "QuickBank-Console": {
        name: "QuickBank Console",
        category: "Practice",
        status: "Practice",
        description: "A console-based banking simulation in Java for practicing OOP fundamentals: account creation, deposits, withdrawals, and interest calculation.",
        details: "A simple two-file Java console app built to practice object-oriented programming. Users create an account with a unique ID and initial balance ($500 minimum), then interact through a menu to deposit, withdraw, view daily interest rates, and check account details. Includes input validation and insufficient balance protection.",
        tech: ["Java", "OOP"],
        github: "https://github.com/aimemoria/QuickBank-Console",
        liveUrl: null
    },
    "musicSite-Template": {
        name: "HIDDENTIMES Music",
        category: "Practice",
        status: "Practice",
        description: "A React single-page landing page for a music project, built as front-end practice with a dark theme and smooth navigation.",
        details: "A practice project for front-end development. Features a fixed navbar with backdrop blur, full-screen hero with radial gradient, interactive track listing with click-to-select, and about/contact sections. Responsive design with mobile support. Built with React 18 and custom CSS with Google Fonts (Inter).",
        tech: ["React 18", "CSS3", "JavaScript"],
        github: "https://github.com/aimemoria/musicSite-Template",
        liveUrl: null
    },
    "DiamondHunt-VR": {
        name: "DiamondHunt VR",
        category: "Practice",
        status: "Practice",
        description: "A Unity VR simulation set in a desert environment where the player searches for a diamond while facing narrative-driven ethical decisions.",
        details: "A practice VR project built with Unity and C#. The player explores a desert environment in first-person VR to locate a lost diamond inside a hut. Features branching narrative with ethical decision points that change the outcome.",
        tech: ["Unity", "C#", "VR"],
        github: "https://github.com/aimemoria/DiamondHunt-VR",
        liveUrl: null
    },
    "ElliotMedia": {
        name: "Elliot Media",
        category: "Website",
        status: "Complete",
        description: "My personal company website. Elliot Media is a real estate photography and media service based in Phoenix, Arizona.",
        details: "The official website for Elliot Media, my real estate photography and media service company. Offers professional photography, aerial drone shots, videography, 3D virtual tours, and floor plans. Features a property showcase carousel, portfolio filtering system, contact form via Web3Forms, and full SEO optimization.",
        tech: ["HTML", "CSS", "JavaScript", "Web3Forms", "SEO"],
        github: "https://github.com/aimemoria/ElliotMedia",
        liveUrl: "https://elliotmediapro.com/"
    },
    "aimePersonalWebsite": {
        name: "Aime Moria (Personal Website)",
        category: "Website",
        status: "Complete",
        description: "My personal portfolio website showcasing my skills, experience, and projects as a Computer Science student and Data Analyst.",
        details: "A responsive personal portfolio site with sections for bio, skills, and contact. Features dark mode toggle, animated particle canvas background, dynamic year counter, social media integration, and a contact form powered by EmailJS. Hosted on Firebase with custom domain.",
        tech: ["HTML", "CSS", "JavaScript", "Firebase", "EmailJS"],
        github: "https://github.com/aimemoria/aimePersonalWebsite",
        liveUrl: "https://aime-moria.com/"
    },
    "Fraud-Detection": {
        name: "Fraud Detection System",
        category: "Data Science",
        status: "Complete",
        description: "A client-server system that streams financial transaction data in real-time for training neural networks in fraud detection.",
        details: "Implements a TCP/IP socket-based architecture where a server generates and broadcasts simulated banking transactions (with embedded fraud patterns) to multiple clients. Includes a visual GUI client with real-time charts, feature engineering pipeline, and ANN training for fraud classification using PyTorch.",
        tech: ["Python", "PyTorch", "TCP Sockets", "Matplotlib", "Threading"],
        github: "https://github.com/aimemoria/Fraud-Detection",
        liveUrl: null
    },
    "nlp-sentiment-analysis": {
        name: "NLP Sentiment Analysis",
        category: "Data Science",
        status: "Practice",
        description: "A natural language processing project for classifying text sentiment, built for an NLP course.",
        details: "An NLP project that applies text preprocessing, tokenization, and feature extraction to classify sentiment in text data. Part of coursework for AIT-204 NLP. Includes a requirements.txt for dependencies and test data for review classification.",
        tech: ["Python", "NLP", "Jupyter"],
        github: "https://github.com/aimemoria/nlp-sentiment-analysis",
        liveUrl: null
    }
};

const hiddenRepos = ["aimemoria"];

let projects = [];
let categories = [];
let activeCategory = "All";

// Priority 1: Load from projects.json (AI-generated, auto-updated)
// Priority 2: Fetch from GitHub API (live fallback)
// Priority 3: Use hardcoded customProjects (offline fallback)
async function fetchProjects() {
    let loaded = false;

    // Try loading from projects.json first
    try {
        const response = await fetch('data/projects.json');
        if (response.ok) {
            const data = await response.json();
            if (data.projects && data.projects.length > 0) {
                projects = data.projects.map(p => ({
                    name: p.name,
                    category: p.category,
                    status: p.status,
                    description: p.description,
                    details: p.details,
                    tech: p.tech,
                    github: p.github,
                    liveUrl: p.liveUrl || null
                }));
                loaded = true;
                console.log(`Loaded ${projects.length} projects from projects.json (last updated: ${data.lastUpdated})`);
            }
        }
    } catch (e) {
        console.warn('Could not load projects.json:', e);
    }

    // Fallback: try GitHub API
    if (!loaded) {
        try {
            const response = await fetch('https://api.github.com/users/aimemoria/repos?per_page=100&sort=updated');
            if (response.ok) {
                const repos = await response.json();
                projects = repos
                    .filter(repo => !repo.private && !repo.fork && !hiddenRepos.includes(repo.name))
                    .map(repo => {
                        const custom = customProjects[repo.name];
                        if (custom) {
                            return {
                                name: custom.name,
                                category: custom.category,
                                status: custom.status,
                                description: custom.description,
                                details: custom.details,
                                tech: custom.tech,
                                github: repo.html_url,
                                liveUrl: custom.liveUrl || null
                            };
                        }
                        return {
                            name: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                            category: "Practice",
                            status: "Practice",
                            description: repo.description || "A project by Aime Moria.",
                            details: repo.description || "Check the GitHub repository for more information.",
                            tech: repo.language ? [repo.language] : [],
                            github: repo.html_url,
                            liveUrl: repo.homepage || null
                        };
                    });
                loaded = true;
                console.log(`Loaded ${projects.length} projects from GitHub API`);
            }
        } catch (e) {
            console.warn('Could not fetch from GitHub API:', e);
        }
    }

    // Final fallback: hardcoded data
    if (!loaded) {
        projects = Object.entries(customProjects).map(([repoName, p]) => ({
            name: p.name,
            category: p.category,
            status: p.status,
            description: p.description,
            details: p.details,
            tech: p.tech,
            github: p.github,
            liveUrl: p.liveUrl || null
        }));
        console.log(`Loaded ${projects.length} projects from hardcoded fallback`);
    }

    // Sort: non-Practice status first
    projects.sort((a, b) => {
        if (a.status === "Complete" && b.status !== "Complete") return -1;
        if (a.status !== "Complete" && b.status === "Complete") return 1;
        return 0;
    });

    // Build category filters
    const uniqueCategories = [...new Set(projects.map(p => p.category))];
    categories = ["All", ...uniqueCategories, "Complete", "Practice"];
    categories = [...new Set(categories)];

    renderCategories();
    renderProjects();
}

function renderCategories() {
    const container = document.getElementById('categoryFilters');
    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat === activeCategory ? 'active' : ''}" onclick="filterByCategory('${cat}')">${cat}</button>
    `).join('');
}

function filterByCategory(category) {
    activeCategory = category;
    renderCategories();
    renderProjects();
}

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    const statusFilters = ["Complete", "Practice"];
    const filtered = activeCategory === "All"
        ? projects
        : statusFilters.includes(activeCategory)
            ? projects.filter(p => p.status === activeCategory)
            : projects.filter(p => p.category === activeCategory);
    grid.innerHTML = filtered.map((project, i) => {
        const index = projects.indexOf(project);
        const liveBtn = project.liveUrl
            ? `<a href="${project.liveUrl}" target="_blank" rel="noopener" class="live-link" onclick="event.stopPropagation();"><i class="fas fa-external-link-alt"></i> Visit Site</a>`
            : '';
        return `
        <div class="project-card" onclick="openModal(${index})">
            <div class="project-header">
                <span class="project-category">${project.category}</span>
                <span class="project-status ${project.status === 'Complete' ? 'status-complete' : 'status-practice'}">${project.status}</span>
            </div>
            <h3>${project.name}</h3>
            <p class="project-desc">${project.description}</p>
            <div class="tech-tags">
                ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            <div class="project-actions">
                <button class="details-btn" onclick="event.stopPropagation(); openModal(${index})">View Details</button>
                ${liveBtn}
                <a href="${project.github}" target="_blank" rel="noopener" class="github-link" onclick="event.stopPropagation();">
                    <i class="fab fa-github"></i>
                </a>
            </div>
        </div>
    `}).join('');
}

function openModal(index) {
    const project = projects[index];
    const modal = document.getElementById('projectModal');
    document.getElementById('modalTitle').textContent = project.name;
    document.getElementById('modalCategory').textContent = project.category;
    document.getElementById('modalStatus').textContent = project.status;
    document.getElementById('modalStatus').className = 'project-status ' + (project.status === 'Complete' ? 'status-complete' : 'status-practice');
    document.getElementById('modalDesc').textContent = project.details;
    document.getElementById('modalTech').innerHTML = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    document.getElementById('modalGithub').href = project.github;

    const liveContainer = document.getElementById('modalLive');
    if (project.liveUrl) {
        liveContainer.href = project.liveUrl;
        liveContainer.style.display = 'inline-flex';
    } else {
        liveContainer.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('projectModal').classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();

    document.getElementById('projectModal').addEventListener('click', (e) => {
        if (e.target.id === 'projectModal') closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
