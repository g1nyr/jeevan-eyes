const photos = [
    { src: 'assets/photos/image1.jpeg', title: 'Stillness' },
    { src: 'assets/photos/image2.jpeg', title: 'Sun through leaves' },
    { src: 'assets/photos/image3.jpeg', title: 'Temple tree' },
    { src: 'assets/photos/image4.jpeg', title: 'Hampi horses' },
    { src: 'assets/photos/image5.jpeg', title: 'Moon through trees' }
];

let active = 0;
const slide = document.querySelector('#slide');
const counter = document.querySelector('#counter');
const caption = document.querySelector('#caption');
const carouselBox = document.querySelector('#carousel-box');

// Carousel update function
function updateSlide(index) {
    active = (index + photos.length) % photos.length;
    slide.style.opacity = '0.2';
    setTimeout(() => {
        slide.src = photos[active].src;
        slide.alt = photos[active].title;
        caption.textContent = photos[active].title;
        counter.textContent = `0${active + 1} / 05`;
        slide.style.opacity = '1';
    }, 150);
}

// Auto carousel timer
let carouselInterval = setInterval(() => {
    updateSlide(active + 1);
}, 3500);

// Pause on hover
if (carouselBox) {
    carouselBox.onmouseenter = () => clearInterval(carouselInterval);
    carouselBox.onmouseleave = () => {
        carouselInterval = setInterval(() => {
            updateSlide(active + 1);
        }, 3500);
    };
}

// Manual carousel buttons
const prevBtn = document.querySelector('#prev-slide');
const nextBtn = document.querySelector('#next-slide');
if (prevBtn && nextBtn) {
    prevBtn.onclick = (e) => { e.stopPropagation(); updateSlide(active - 1); };
    nextBtn.onclick = (e) => { e.stopPropagation(); updateSlide(active + 1); };
}

// Populate Gallery
const galleryEl = document.querySelector('#gallery');
if (galleryEl) {
    galleryEl.innerHTML = photos.map((p, idx) => `
        <figure data-index="${idx}">
            <img src="${p.src}" alt="${p.title}" loading="lazy"/>
            <figcaption>${p.title}</figcaption>
        </figure>
    `).join('');
}

// Lightbox functionality
const lightbox = document.querySelector('#lightbox');
const lightboxImg = document.querySelector('#lightbox-img');
const lightboxCaption = document.querySelector('#lightbox-caption');
const lightboxClose = document.querySelector('#lightbox-close');
const lightboxPrev = document.querySelector('#lightbox-prev');
const lightboxNext = document.querySelector('#lightbox-next');
let lightboxIndex = 0;

function openLightbox(src, title, index) {
    lightboxIndex = index !== undefined ? index : 0;
    lightboxImg.src = src;
    lightboxCaption.textContent = title;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
}

// Trigger lightbox on gallery figures and carousel / profile images
document.querySelectorAll('.photos-page figure, .lightbox-trigger-img').forEach((el, idx) => {
    el.onclick = () => {
        let src = el.querySelector('img') ? el.querySelector('img').src : el.src;
        let title = el.querySelector('figcaption') ? el.querySelector('figcaption').textContent : (el.alt || 'Jeevan Eyes');
        let photoIndex = photos.findIndex(p => src.includes(p.src.split('/').pop()));
        openLightbox(src, title, photoIndex >= 0 ? photoIndex : 0);
    };
});

if (lightboxClose) lightboxClose.onclick = closeLightbox;
if (lightbox) {
    lightbox.onclick = (e) => {
        if (e.target === lightbox) closeLightbox();
    };
}

if (lightboxPrev && lightboxNext) {
    lightboxPrev.onclick = () => {
        lightboxIndex = (lightboxIndex - 1 + photos.length) % photos.length;
        lightboxImg.src = photos[lightboxIndex].src;
        lightboxCaption.textContent = photos[lightboxIndex].title;
    };
    lightboxNext.onclick = () => {
        lightboxIndex = (lightboxIndex + 1) % photos.length;
        lightboxImg.src = photos[lightboxIndex].src;
        lightboxCaption.textContent = photos[lightboxIndex].title;
    };
}

// Keyboard navigation for lightbox
window.onkeydown = (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
};

// Theme Toggle with localStorage
const themeToggle = document.querySelector('#theme-toggle');
const htmlEl = document.documentElement;
const themeIcon = themeToggle.querySelector('.theme-icon');

const savedTheme = localStorage.getItem('jeevan_theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.onclick = () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('jeevan_theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
};

// Leaflet Map with smooth interactive controls
const mapEl = document.querySelector('#map');
if (mapEl) {
    const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([17.3982, 78.4422], 14);
    
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri'
    });
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });
    
    let currentLayer = satelliteLayer;
    currentLayer.addTo(map);

    const marker = L.marker([17.3982, 78.4422], {
        icon: L.divIcon({ className: 'cat-pin', html: '🐱', iconSize: [42, 42], iconAnchor: [21, 38] })
    }).addTo(map).bindPopup('Mehdipatnam, Hyderabad').openPopup();

    setTimeout(() => map.invalidateSize(), 150);

    const centerBtn = document.querySelector('#center-map');
    const toggleLayerBtn = document.querySelector('#toggle-layer');

    if (centerBtn) {
        centerBtn.onclick = () => {
            map.flyTo([17.3982, 78.4422], 15, { duration: 1.5 });
            marker.openPopup();
        };
    }

    if (toggleLayerBtn) {
        toggleLayerBtn.onclick = () => {
            map.removeLayer(currentLayer);
            currentLayer = currentLayer === satelliteLayer ? streetLayer : satelliteLayer;
            currentLayer.addTo(map);
            toggleLayerBtn.textContent = currentLayer === satelliteLayer ? '🗺️ Style' : '🛰️ Satellite';
        };
    }
}

// Real Audio Player with Random Start Time, Pause Support, Progress Bar & Perfectly Centered SVG Icons
const musicCard = document.querySelector('#music-card');
const playPauseBtn = document.querySelector('#play-pause-btn');
const equalizer = document.querySelector('#equalizer');
const musicLine = document.querySelector('.music .line');
const progressB = document.querySelector('.music .line b');

const audio = document.querySelector('#bg-audio') || new Audio(encodeURI('assets/Melanie Martinez - Play Date [Official Lyric Video]_320p.mp3'));
audio.preload = 'auto';

audio.onerror = (e) => {
    console.error("Audio loading error:", audio.error);
};
let isPlaying = false;

const playSvg = '<svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" style="display: block; transform: translateX(1.5px);"><path d="M1 1L11 7L1 13V1Z"/></svg>';
const pauseSvg = '<svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" style="display: block;"><rect width="3" height="14" rx="1"/><rect x="7" width="3" height="14" rx="1"/></svg>';

if (playPauseBtn) playPauseBtn.innerHTML = playSvg;

audio.ontimeupdate = () => {
    if (progressB && audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressB.style.width = `${percent}%`;
    }
};

if (musicLine) {
    musicLine.onclick = (e) => {
        e.stopPropagation();
        const rect = musicLine.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (audio.duration && !isNaN(audio.duration)) {
            audio.currentTime = pos * audio.duration;
            if (!isPlaying) {
                audio.play().then(() => {
                    isPlaying = true;
                    if (playPauseBtn) playPauseBtn.innerHTML = pauseSvg;
                    if (equalizer) equalizer.classList.add('playing');
                }).catch(err => {
                    console.error("Seek playback failed:", err);
                });
            }
        }
    };
}

function toggleOrRandomPlay() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        if (playPauseBtn) playPauseBtn.innerHTML = playSvg;
        if (equalizer) equalizer.classList.remove('playing');
    } else {
        audio.currentTime = 0;
        audio.play().then(() => {
            isPlaying = true;
            if (playPauseBtn) playPauseBtn.innerHTML = pauseSvg;
            if (equalizer) equalizer.classList.add('playing');
        }).catch(err => {
            console.error("Audio playback failed:", err);
            alert("Could not play audio. Please ensure browser permissions allow audio playback.");
        });
    }
}

if (musicCard) {
    musicCard.onclick = () => {
        toggleOrRandomPlay();
    };
}

if (playPauseBtn) {
    playPauseBtn.onclick = (e) => {
        e.stopPropagation();
        toggleOrRandomPlay();
    };
}

audio.onended = () => {
    isPlaying = false;
    if (playPauseBtn) playPauseBtn.innerHTML = playSvg;
    if (equalizer) equalizer.classList.remove('playing');
};

// Navigation Tab Routing
const navLinks = document.querySelectorAll('nav a');
const dashboard = document.querySelector('.dashboard');
const aside = document.querySelector('aside');
const pages = document.querySelectorAll('.page');

function handleRouting() {
    const hash = window.location.hash || '#home';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    if (hash === '#home') {
        if (dashboard) dashboard.style.display = 'grid';
        if (aside) aside.style.display = 'block';
        pages.forEach(p => p.classList.remove('active-page'));
    } else {
        if (dashboard) dashboard.style.display = 'none';
        if (aside) aside.style.display = 'block'; // Keep aside or hide depending on layout
        pages.forEach(p => {
            if ('#' + p.id === hash) {
                p.classList.add('active-page');
            } else {
                p.classList.remove('active-page');
            }
        });
    }
}

window.onhashchange = handleRouting;
window.onload = handleRouting;

// Mobile Menu Toggle
const menu = document.querySelector('#menu');
const nav = document.querySelector('nav');
if (menu && nav) {
    menu.onclick = () => nav.classList.toggle('open');
    nav.querySelectorAll('a').forEach(a => {
        a.onclick = () => nav.classList.remove('open');
    });
}

// Contact Form Submission Toast
const contactForm = document.querySelector('#contact-form');
const toast = document.querySelector('#toast');
if (contactForm && toast) {
    contactForm.onsubmit = (e) => {
        e.preventDefault();
        toast.classList.add('show');
        contactForm.reset();
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    };
}
