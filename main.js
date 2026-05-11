import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/base16/dracula.css'; // A retro-friendly dark theme

const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_projects: "Projects",
    nav_blog: "Blog",
    nav_contact: "Contact",
    hero_title: "Thoughtful & Minimal",
    hero_subtitle: "Multi-disciplinary creator crafting digital experiences.",
    hero_cta: "View My Work",
    about_title: "About Me",
    about_text: "I believe in building software and digital art that respects the user's attention. Every pixel and line of code is an opportunity to express simplicity, structure, and calm.",
    projects_title: "Selected Work",
    filter_all: "All",
    filter_programming: "Programming",
    filter_video: "Video Editing",
    filter_design: "Design",
    filter_voice: "Voice Over",
    filter_photo: "Photography",
    filter_motion: "Motion Graphics",
    blog_title: "Notes & Thoughts",
    contact_title: "Get in Touch",
    contact_text: "Let's create something meaningful together.",
    contact_email: "moustafa0yasser123@gmail.com",
    footer_text: "© 2026 Creative Mind. Designed with intention.",
    btn_lang: "عربي",
    load_more: "Load More",
    projects_end: "I hope you liked my projects!",
    blog_end: "Thanks for reading!",
    back: "Back",
    comments_title: "Comments"
  },
  ar: {
    nav_home: "الرئيسية",
    nav_about: "نبذة عني",
    nav_projects: "المشاريع",
    nav_blog: "المدونة",
    nav_contact: "تواصل معي",
    hero_title: "بساطة وتأمل",
    hero_subtitle: "مبدع متعدد التخصصات يبني تجارب رقمية هادفة.",
    hero_cta: "تصفح أعمالي",
    about_title: "نبذة عني",
    about_text: "أتنقل بين البرمجة، والكتابة، والتصميم، التعليق الصوتي، والكثير من المهارات الأخرى.. وبناء التجارب الرقمية دون حدود واضحة. أجرّب كثيرًا، أتعلم باستمرار، وأخلق من الفوضى أشياءً تشبهني.",
    projects_title: "أعمال مختارة",
    filter_all: "الكل",
    filter_programming: "برمجة",
    filter_video: "مونتاج فيديو",
    filter_design: "تصميم",
    filter_voice: "تعليق صوتي",
    filter_photo: "تصوير",
    filter_motion: "موشن جرافيك",
    blog_title: "ملاحظات وأفكار",
    contact_title: "تواصل معي",
    contact_text: "دعنا نصنع شيئاً ذا قيمة معاً.",
    contact_email: "moustafa0yasser123@gmail.com",
    footer_text: "© 2026 عقل مبدع. صُمم بشغف واهتمام.",
    btn_lang: "English",
    load_more: "عرض المزيد",
    projects_end: "أتمنى أن تنال مشاريعي إعجابكم!",
    blog_end: "شكراً لقراءتك مدونتي!",
    back: "رجوع",
    comments_title: "التعليقات"
  }
};

// Configure Marked with Highlight.js
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true
});

// Markdown Parser
function parseMD(raw, slug) {
    const parts = raw.split('---');
    let metadata = {};
    let content = raw;

    if (parts.length >= 3) {
        const frontmatterRaw = parts[1];
        content = parts.slice(2).join('---').trim();
        
        frontmatterRaw.split('\n').forEach(line => {
            const colonIdx = line.indexOf(':');
            if (colonIdx !== -1) {
                const key = line.slice(0, colonIdx).trim();
                const value = line.slice(colonIdx + 1).trim();
                metadata[key] = value;
            }
        });
        
        if (metadata.tools) {
            metadata.tools = metadata.tools.split(',').map(s => s.trim());
        }
        if (metadata.images) {
            metadata.images = metadata.images.split(',').map(s => s.trim());
        }
    }
    
    // Split content into languages if separator exists
    // Expected format: [English Content] ---ar--- [Arabic Content]
    const contentParts = content.split('---ar---');
    if (contentParts.length > 1) {
        metadata.content_en = contentParts[0].trim();
        metadata.content_ar = contentParts[1].trim();
    } else {
        // Fallback: use same content for both if no separator
        metadata.content_en = content;
        metadata.content_ar = content;
    }
    
    return { ...metadata, content, slug };
}

// Fetch MD files using Vite's import.meta.glob (Recursive support)
const projectFiles = import.meta.glob(['./projects/*.md', './projects/**/*.md'], { query: '?raw', import: 'default', eager: true });
const blogFiles = import.meta.glob(['./blog/*.md', './blog/**/*.md'], { query: '?raw', import: 'default', eager: true });

const projectsData = Object.entries(projectFiles).map(([path, raw]) => {
    const slug = path.split('/').pop().replace('.md', '');
    return parseMD(raw, slug);
});

const blogData = Object.entries(blogFiles).map(([path, raw]) => {
    const slug = path.split('/').pop().replace('.md', '');
    return parseMD(raw, slug);
});

// State
let currentLang = localStorage.getItem('portfolio-lang') || 'ar';
let currentFilter = 'all';

// Pagination state
let pageSize = window.innerWidth <= 768 ? 3 : 6;
let visibleProjects = pageSize;
let visibleBlog = pageSize;

// DOM Elements
const langToggleBtn = document.getElementById('lang-toggle');
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;
const projectsContainer = document.getElementById('projects-container');
const blogContainer = document.getElementById('blog-container');
const themeIcon = document.getElementById('theme-icon');

// Load More Elements
const loadMoreProjectsBtn = document.getElementById('load-more-projects');
const projectsEndMessage = document.getElementById('projects-end-message');
const loadMoreBlogBtn = document.getElementById('load-more-blog');
const blogEndMessage = document.getElementById('blog-end-message');

const sunIcon = `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

// Detail View Elements
const mainView = document.getElementById('main-view');
const detailView = document.getElementById('detail-view');
const detailContent = document.getElementById('detail-content');
const backBtn = document.getElementById('back-btn');

// Router
function router() {
    const hash = window.location.hash;
    
    if (hash.startsWith('#/project/')) {
        const slug = decodeURIComponent(hash.replace('#/project/', ''));
        const project = projectsData.find(p => p.slug === slug);
        if (project) {
            showDetailView(project, 'project');
        } else {
            window.location.hash = '/';
        }
    } else if (hash.startsWith('#/blog/')) {
        const slug = decodeURIComponent(hash.replace('#/blog/', ''));
        const article = blogData.find(b => b.slug === slug);
        if (article) {
            showDetailView(article, 'blog');
        } else {
            window.location.hash = '/';
        }
    } else {
        hideDetailView();
        // Scroll to top on home/empty hash
        if (!hash || hash === '#' || hash === '#/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Initialize
function init() {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    htmlEl.setAttribute('data-theme', savedTheme);
    themeIcon.innerHTML = savedTheme === 'light' ? moonIcon : sunIcon;

    renderFilters();
    updateContent();
    
    themeToggleBtn.addEventListener('click', toggleTheme);
    backBtn.addEventListener('click', () => {
        window.location.hash = '/';
    });
    
    langToggleBtn.addEventListener('click', toggleLanguage);
    
    // Load More listeners
    loadMoreProjectsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextBatch = window.innerWidth <= 768 ? 3 : 6;
        visibleProjects += nextBatch;
        renderProjects();
    });

    loadMoreBlogBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextBatch = window.innerWidth <= 768 ? 3 : 6;
        visibleBlog += nextBatch;
        renderBlog();
    });

    window.addEventListener('hashchange', router);
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    router(); // Run router on init
}

function renderFilters() {
    const filterContainer = document.getElementById('project-filters');
    if (!filterContainer) return;
    
    // Collect unique categories and their translations from projectsData
    const categories = new Map();
    projectsData.forEach(p => {
        if (p.category) {
            if (!categories.has(p.category)) {
                categories.set(p.category, {
                    en: p.category_en || p.category,
                    ar: p.category_ar || p.category
                });
            }
        }
    });

    let html = `<button type="button" class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">${translations[currentLang].filter_all}</button>`;
    
    categories.forEach((names, slug) => {
        const name = currentLang === 'en' ? names.en : names.ar;
        html += `<button type="button" class="filter-btn ${currentFilter === slug ? 'active' : ''}" data-filter="${slug}">${name}</button>`;
    });

    filterContainer.innerHTML = html;

    // Re-attach listeners to new buttons
    const btns = filterContainer.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterValue = e.currentTarget.dataset.filter;
            if (!filterValue) return;

            btns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentFilter = filterValue;
            visibleProjects = pageSize;
            renderProjects();
        });
    });
}

function updateContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    
    langToggleBtn.textContent = translations[currentLang].btn_lang;
    htmlEl.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    htmlEl.lang = currentLang;
    
    renderFilters(); // Re-render filters to update names
    renderProjects();
    renderBlog();
    
    // If detail view is active, re-render it to update language
    const hash = window.location.hash;
    if (hash.startsWith('#/project/') || hash.startsWith('#/blog/')) {
        router();
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('portfolio-lang', currentLang);
    updateContent();
}

function toggleTheme() {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    themeIcon.innerHTML = newTheme === 'light' ? moonIcon : sunIcon;
}

function showDetailView(item, type) {
    mainView.style.display = 'none';
    detailView.style.display = 'block';
    
    let htmlContent = '';
    const title = currentLang === 'en' ? (item.title_en || item.title) : (item.title_ar || item.title);
    const bodyContent = currentLang === 'en' ? (item.content_en || item.content) : (item.content_ar || item.content);
    
    if (type === 'project') {
        const cat = currentLang === 'en' ? (item.category_en || item.category) : (item.category_ar || item.category);
        htmlContent += `<h1 class="pixel-text" style="font-size: 3rem; margin-bottom: 0.5rem;">${title || ''}</h1>`;
        htmlContent += `<p class="pixel-text" style="color: var(--accent-color); font-size: 1rem; text-transform: uppercase; margin-bottom: 2rem;">${cat || ''}</p>`;
        
        if (item.img) {
            htmlContent += `<img src="${item.img}" alt="${title || ''}" class="detail-main-img pixel-border">`;
        }

        htmlContent += `<div class="markdown-body">${marked.parse(bodyContent || '')}</div>`;

        if (item.images && item.images.length > 0) {
            htmlContent += `<div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 3rem;">`;
            item.images.forEach(img => {
                htmlContent += `<img src="${img}" class="pixel-border" style="width: 100%; border-radius: 4px;">`;
            });
            htmlContent += `</div>`;
        }
        
        if (item.link) {
            htmlContent += `<div style="margin-top: 3rem;"><a href="${item.link}" target="_blank" class="cta-button pixel-border">${currentLang === 'en' ? 'Visit Project' : 'زيارة المشروع'}</a></div>`;
        }

    } else {
        const date = currentLang === 'en' ? (item.date_en || item.date) : (item.date_ar || item.date);
        const cat = currentLang === 'en' ? (item.category_en || item.category) : (item.category_ar || item.category);
        
        htmlContent += `<h1 class="pixel-text" style="font-size: 3rem; margin-bottom: 0.5rem;">${title || ''}</h1>`;
        if (cat) {
            htmlContent += `<p class="pixel-text" style="color: var(--accent-color); font-size: 0.9rem; text-transform: uppercase; margin-bottom: 0.5rem;">${cat}</p>`;
        }
        htmlContent += `<p class="pixel-text" style="color: var(--text-secondary); font-size: 1rem; margin-bottom: 3rem;">${date || ''}</p>`;
        htmlContent += `<div class="markdown-body">${marked.parse(bodyContent || '')}</div>`;
    }

    // Add Giscus Comments Container
    htmlContent += `
        <div class="comments-section" style="margin-top: 5rem; border-top: 2px dashed var(--border-color); padding-top: 3rem;">
            <h3 class="pixel-text" style="margin-bottom: 2rem;">${translations[currentLang].comments_title}</h3>
            <div class="giscus"></div>
        </div>
    `;
    
    detailContent.innerHTML = htmlContent;
    window.scrollTo(0, 0);

    // Initialize Giscus for this slug
    loadComments(item.slug);
}

function loadComments(slug) {
    // Remove existing giscus script if any
    const existingScript = document.getElementById('giscus-script');
    if (existingScript) existingScript.remove();

    // Remove existing giscus iframe/container content
    const giscusContainer = document.querySelector('.giscus');
    if (giscusContainer) giscusContainer.innerHTML = '';

    const script = document.createElement('script');
    script.id = 'giscus-script';
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'mostafaYasserDev/Undefined');
    script.setAttribute('data-repo-id', 'R_kgDOHIZrag');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOHIZras4C8yxY');
    
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', slug); // IMPORTANT: Use slug to separate comments for each project/blog
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', currentLang === 'ar' ? 'ar' : 'en');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    document.body.appendChild(script);
}

function hideDetailView() {
    detailView.style.display = 'none';
    mainView.style.display = 'block';
    // We don't necessarily want to scroll to top on the main view when hiding detail
    // but if we were deep in a project and go back, staying at the top of the main view is fine.
}

function renderProjects() {
    if (!projectsContainer) return;
    projectsContainer.innerHTML = '';
    
    const filtered = currentFilter === 'all' 
        ? projectsData 
        : projectsData.filter(p => p.category === currentFilter);
        
    console.log(`Rendering projects: filter=${currentFilter}, total=${projectsData.length}, filtered=${filtered.length}, visible=${visibleProjects}`);
    
    if (filtered.length === 0) {
        projectsContainer.innerHTML = `<p class="pixel-text" style="grid-column: 1/-1; text-align: center; padding: 2rem;">${currentLang === 'en' ? 'No projects found in this category.' : 'لم يتم العثور على مشاريع في هذا القسم.'}</p>`;
    }

    const toShow = filtered.slice(0, visibleProjects);
    
    toShow.forEach(project => {
        const title = currentLang === 'en' ? (project.title_en || project.title || 'Untitled') : (project.title_ar || project.title || 'بدون عنوان');
        const desc = currentLang === 'en' ? (project.desc_en || project.desc || '') : (project.desc_ar || project.desc || '');
        const cat = currentLang === 'en' ? (project.category_en || project.category || '') : (project.category_ar || project.category || '');
        
        const card = document.createElement('div');
        card.className = 'project-card pixel-border';
        card.style.cursor = 'pointer';
        card.innerHTML = `
            <div class="card-img-container" style="position: relative; overflow: hidden; height: 200px;">
                <img src="${project.img || ''}" alt="${title}" class="project-thumb" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 400 300\\' fill=\\'%23eee\\'%3E%3Crect width=\\'400\\' height=\\'300\\'/%3E%3C/svg%3E'">
            </div>
            <div class="project-info">
                <div class="project-category pixel-text">${cat}</div>
                <h3 class="project-title pixel-text">${title}</h3>
                <p class="project-desc">${desc}</p>
                <div class="project-tools">
                    ${project.tools ? project.tools.map(t => `<span class="tool-tag">${t}</span>`).join('') : ''}
                </div>
            </div>
        `;
        card.addEventListener('click', () => {
            window.location.hash = `/project/${project.slug}`;
        });
        projectsContainer.appendChild(card);
    });

    if (filtered.length > visibleProjects) {
        loadMoreProjectsBtn.style.display = 'inline-block';
        projectsEndMessage.style.display = 'none';
    } else {
        loadMoreProjectsBtn.style.display = 'none';
        if (filtered.length > 0) {
            projectsEndMessage.style.display = 'block';
        } else {
            projectsEndMessage.style.display = 'none';
        }
    }
}

function renderBlog() {
    if (!blogContainer) return;
    blogContainer.innerHTML = '';
    
    const toShow = blogData.slice(0, visibleBlog);
    
    toShow.forEach(item => {
        const title = currentLang === 'en' ? (item.title_en || item.title || 'Untitled') : (item.title_ar || item.title || 'بدون عنوان');
        const date = currentLang === 'en' ? (item.date_en || item.date || '') : (item.date_ar || item.date || '');
        const cat = currentLang === 'en' ? (item.category_en || item.category || '') : (item.category_ar || item.category || '');
        
        const el = document.createElement('a');
        el.href = `#/blog/${item.slug}`;
        el.className = 'blog-item';
        el.innerHTML = `
            <div style="display: flex; flex-direction: column;">
                ${cat ? `<span class="blog-category" style="font-size: 0.7rem; color: var(--accent-color); text-transform: uppercase;">${cat}</span>` : ''}
                <span class="blog-title pixel-text">${title}</span>
            </div>
            <span class="blog-date">${date}</span>
        `;
        blogContainer.appendChild(el);
    });

    if (blogData.length > visibleBlog) {
        loadMoreBlogBtn.style.display = 'inline-block';
        blogEndMessage.style.display = 'none';
    } else {
        loadMoreBlogBtn.style.display = 'none';
        if (blogData.length > 0) {
            blogEndMessage.style.display = 'block';
        } else {
            blogEndMessage.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
