// Contoh: smooth scroll ke section
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// script.js (di folder portfolio-web)

// ==========================================================
// PENTING: GANTI DENGAN URL API PUBLIK VERCEL ANDA SETELAH DI-DEPLOY
// ==========================================================
// Contoh: const BASE_API_URL = 'https://favian-portfolio-api-xyz.vercel.app/api';
const BASE_API_URL = 'http://localhost:3000/api'; 

// ==========================================================
// A. Logika Smooth Scroll
// ==========================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==========================================================
// B. Fungsi Fetch dan Render Utama
// ==========================================================

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${BASE_API_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Gagal mengambil data dari ${endpoint}: ${response.statusText}`);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error.message);
        return null; 
    }
}

// ----------------------------------------------------------
// 1. Render Profil & Hero (Data dari /api/profile)
// ----------------------------------------------------------
async function renderProfile() {
    const profile = await fetchData('/profile');
    if (!profile) return;

    // Navbar & Hero
    document.getElementById('navbar-logo').textContent = profile.name || "Portofolio";
    document.getElementById('hero-title').textContent = `Hi, Saya ${profile.name}` || "Hi!";
    document.getElementById('hero-subtitle').textContent = profile.title || "Desainer Grafis";

    // About
    const aboutImg = document.getElementById('about-img');
    const aboutIntro = document.getElementById('about-intro');
    const aboutDesc = document.getElementById('about-desc');
    
    if (aboutImg) aboutImg.src = profile.image || aboutImg.src; 
    if (aboutIntro) aboutIntro.innerHTML = `Halo! Saya **${profile.name}**, ${profile.about.intro}` || 'Intro gagal dimuat.'; 
    if (aboutDesc) aboutDesc.textContent = profile.about.description || 'Deskripsi gagal dimuat.';

    // Footer
    const footerText = document.getElementById('footer-text');
    if (footerText) footerText.textContent = `© ${new Date().getFullYear()} ${profile.name}. All rights reserved.`;

}

// ----------------------------------------------------------
// 2. Render Skills (Data dari /api/skills)
// ----------------------------------------------------------
async function renderSkills() {
    const skills = await fetchData('/skills');
    const skillsContainer = document.getElementById('skills-grid');
    if (!skills || !skillsContainer) return;

    skillsContainer.innerHTML = ''; // Bersihkan loading state

    // Gabungkan Hard dan Soft Skills
    const hardSkillsMap = {
        "Desain Logo": "Membuat desain logo sesuai kebutuhan, baik minimalis, modern, elegan dan sebagainya",
        "Poster": "Menciptakan desain poster yang menarik dan dapat menyesuaikan dengan genre dan pesan yang ingin disampaikan",
        "UI/UX": "Membuat design UI yang clean dan responsif"
    };
    
    const allSkills = [
        ...skills.hardSkills.map(s => ({ name: s, type: 'hard', desc: hardSkillsMap[s] || "Keahlian teknis yang dikuasai." })),
        ...skills.softSkills.map(s => ({ name: s, type: 'soft', desc: "Keahlian interpersonal yang penting dalam lingkungan kerja." }))
    ];

    // Placeholder Icons (Gunakan ikon yang Anda sediakan sebelumnya)
    const iconMap = {
        "Desain Logo": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        "Poster": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush-2"><path d="M18.37 2.63c-1.3-1.3-3.6-1.3-4.9 0l-5.4 5.4c-.9.9-2.2 2.2-2.2 3.7c0 1.5.7 2.4.9 2.7l.6.9c.7 1.1 1.7 2.5 3 3.4l.6.4c.9.6 1.7.9 2.5.9c.8 0 1.6-.3 2.5-.9l.6-.4c1.3-.9 2.3-2.3 3-3.4l.6-.9c.2-.3.9-1.2.9-2.7c0-1.5-1.3-2.8-2.2-3.7l-5.4-5.4zM2 22l2-2.7"/><path d="M12 11h.01"/></svg>`,
        "UI/UX": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`,
        "default_soft": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 11l2 2 4-4"/></svg>`
    };


    allSkills.forEach(skill => {
        const iconHTML = iconMap[skill.name] || iconMap['default_soft'];

        const cardHTML = `
            <div class="skill-card">
                <div class="skill-icon">
                    ${iconHTML}
                </div>
                <h3>${skill.name}</h3>
                <p>${skill.desc}</p>
            </div>
        `;
        skillsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}


// ----------------------------------------------------------
// 3. Render Portofolio (Data dari /api/projects)
// ----------------------------------------------------------
async function renderPortfolio() {
    const projects = await fetchData('/projects'); 
    const projectsContainer = document.getElementById('projects-container');
    if (!projects || !projectsContainer) return;

    projectsContainer.innerHTML = ''; // Bersihkan loading state

    projects.forEach(project => {
        // Buat tech tags dari array technologies
        const techTagsHTML = project.technologies.map(tag => 
            `<span class="tech-tag">${tag}</span>`
        ).join('');

        const cardHTML = `
            <div class="project-card">
                <div class="project-image">
                    <img src="${project.imageUrl}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    
                    <div class="project-tech">
                        ${techTagsHTML}
                    </div>
                </div>
            </div>
        `;

        projectsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}


// ----------------------------------------------------------
// 4. Render Kontak (Data dari /api/contact)
// ----------------------------------------------------------
async function renderContact() {
    const contact = await fetchData('/contact');
    if (!contact) return;
    
    const emailText = document.getElementById('contact-email-text');
    const contactIG = document.getElementById('contact-instagram');
    const contactYT = document.getElementById('contact-youtube');
    const contactLI = document.getElementById('contact-linkedin');
    
    // Email Link
    if (emailText) {
        emailText.href = `mailto:${contact.email}`;
        emailText.textContent = contact.email;
    }
}


// Jalankan semua fungsi rendering saat dokumen dimuat sepenuhnya
document.addEventListener('DOMContentLoaded', () => {
    renderProfile();
    renderSkills();
    renderPortfolio(); 
    renderContact();
});
