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

// ==========================================================
// PENTING: GANTI DENGAN URL API PUBLIK ANDA SETELAH DI-DEPLOY
// ==========================================================
// Contoh: const BASE_API_URL = 'https://api-portofolio-ivory.vercel.app/api';
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
// B. Fungsi Utama Fetch & Render
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
        return null; // Kembalikan null jika gagal
    }
}

// ----------------------------------------------------------
// 1. Render Profil & Hero
// ----------------------------------------------------------
async function renderProfile() {
    const profile = await fetchData('/profile');
    if (!profile) return;

    // Bagian Hero
    const heroTitle = document.querySelector('.hero-content h1');
    const heroSubtitle = document.querySelector('.hero-content p');
    if (heroTitle) heroTitle.textContent = `Hi, Saya ${profile.name}`;
    if (heroSubtitle) heroSubtitle.textContent = profile.title || "Web Developer & Desainer"; 

    // Bagian Navbar Logo (Opsional, jika ingin dinamis)
    const logo = document.querySelector('.logo');
    if (logo) logo.textContent = profile.name || "Portofolio";

    // Bagian About
    const aboutImg = document.querySelector('.about-img img');
    const aboutTitle = document.querySelector('.about-text h2');
    const aboutIntro = document.querySelector('.about-text p:nth-child(2)');
    const aboutDesc = document.querySelector('.about-text p:nth-child(3)');
    
    if (aboutImg && profile.image) aboutImg.src = profile.image; 
    if (aboutTitle) aboutTitle.textContent = "Tentang Saya"; // Tetap statis
    if (aboutIntro) aboutIntro.innerHTML = `Halo! Saya **${profile.name}**, ${profile.about.intro}`; 
    if (aboutDesc) aboutDesc.textContent = profile.about.description;
}

// ----------------------------------------------------------
// 2. Render Skills
// ----------------------------------------------------------
async function renderSkills() {
    const skills = await fetchData('/skills');
    if (!skills) return;
    
    // Asumsi: Bagian skills Anda menggunakan class/ID seperti yang ada di panduan sebelumnya:
    // <section class="skills" id="skills">
    //     <div class="skills-soft"></div>
    //     <div class="skills-hard"></div>
    // </section>

    const skillsContainer = document.querySelector('.skills-grid'); // Menggunakan container dari panduan sebelumnya
    if (!skillsContainer) return;

    skillsContainer.innerHTML = ''; // Bersihkan konten

    // Gabungkan Soft dan Hard Skills ke dalam satu array untuk rendering kartu yang konsisten
    const allSkills = [
        ...skills.softSkills.map(s => ({ name: s, type: 'soft' })),
        ...skills.hardSkills.map(s => ({ name: s, type: 'hard' }))
    ];

    allSkills.forEach(skill => {
        // Ikon Placeholder: ganti dengan ikon SVG/Font yang sesuai
        const icon = skill.type === 'soft' 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 11l2 2 4-4"/></svg>' 
            : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-laptop"><path d="M20 17H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"/><path d="M2 17h20"/><path d="M8 21h8"/></svg>';

        const cardHTML = `
            <div class="skill-card">
                <div class="skill-icon">
                    ${icon}
                </div>
                <h3>${skill.name}</h3>
                <p>(${skill.type === 'soft' ? 'Soft Skill' : 'Hard Skill'})</p>
            </div>
        `;
        skillsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}


// ----------------------------------------------------------
// 3. Render Pengalaman (Jika Anda membuat bagian "Experiences" terpisah)
// ----------------------------------------------------------
async function renderExperiences() {
    const experiences = await fetchData('/experiences');
    if (!experiences) return;

    const expContainer = document.querySelector('.experiences-list'); // Ganti dengan ID/class yang sesuai
    if (!expContainer) return;
    
    expContainer.innerHTML = '';

    experiences.forEach(exp => {
        const expHTML = `
            <div class="experience-item">
                <div class="exp-image">
                    <img src="${exp.image}" alt="${exp.organization}">
                </div>
                <div class="exp-details">
                    <h4>${exp.title}</h4>
                    <p class="organization">${exp.organization} - ${exp.year}</p>
                    <p>${exp.description}</p>
                    <a href="${exp.link}" target="_blank" class="exp-link">Lihat Detail</a>
                </div>
            </div>
        `;
        expContainer.insertAdjacentHTML('beforeend', expHTML);
    });
}

// ----------------------------------------------------------
// 4. Render Kontak
// ----------------------------------------------------------
async function renderContact() {
    const contact = await fetchData('/contact');
    if (!contact) return;
    
    const contactEmail = document.querySelector('#contact-email');
    const contactIG = document.querySelector('#contact-instagram');
    const contactYT = document.querySelector('#contact-youtube');
    const contactLI = document.querySelector('#contact-linkedin');

    if (contactEmail) contactEmail.href = `mailto:${contact.email}`;
    if (contactIG) contactIG.href = contact.instagram;
    if (contactYT) contactYT.href = contact.youtube;
    if (contactLI) contactLI.href = contact.linkedin;
    
    // Update teks email di halaman
    const emailText = document.querySelector('.contact p a');
    if(emailText) emailText.textContent = contact.email;
}


// Jalankan semua fungsi rendering saat dokumen dimuat sepenuhnya
document.addEventListener('DOMContentLoaded', () => {
    renderProfile();
    renderSkills();
    renderExperiences();
    renderContact();
    // Jika Anda ingin Portofolio (My Work) mengambil data dari API, 
    // Anda bisa membuat endpoint /api/projects dan merendernya di sini.
});
