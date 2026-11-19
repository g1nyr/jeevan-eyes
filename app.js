// ============================================================================
// 0. LIVE SCROBBLE CONFIG (BitChord / YouTube Music -> ListenBrainz or Last.fm)
// ============================================================================
// Fill in EITHER listenbrainzUsername OR lastfmUsername + lastfmApiKey below.
// Leave blank ('') to use your local shuffled MP3 playlist by default.
const LIVE_MUSIC_CONFIG = {
    listenbrainzUsername: 'g1nyr', // Connected to BitChord / ListenBrainz
    lastfmUsername: '',       // e.g. 'jeevannayyar'
    lastfmApiKey: '',         // Free key from https://www.last.fm/api/account/create
    pollIntervalMs: 45000     // Refresh live/last-played track every 45 seconds
};

// ============================================================================
// 1. BLOG POSTS DATA (Add new posts at the top of this array to update your site!)
// ============================================================================
const blogPosts = [
    {
        id: 'make-things-feel-like-me',
        date: 'Nov 2026',
        readTime: '3 min read',
        title: 'Learning to make things that feel like me',
        summary: 'A personal collection of experiments, thoughts, and small discoveries in electrical engineering and interface design.',
        content: [
            'Most personal corners on the internet either look like sterile resumes or overwhelming dashboards. When I started putting together Jeevan’s Eyes, I wanted something quieter—a space that felt like a desk near an open window in Hyderabad after rain.',
            'Studying electrical engineering teaches you to respect structure: every node has a purpose, every path carries signal, and unnecessary noise only clouds the waveform. Interface design turns out to be surprisingly similar. Soft lavender surfaces, clear typography, and small interactive details make a page feel alive without shouting for attention.',
            '<blockquote>“Good design, like a clean circuit, removes everything that doesn’t belong until only the signal remains.”</blockquote>',
            'This journal will be a living logbook—part engineering notes, part late-night reflections, and part archive of the small moments I capture along the way.'
        ]
    },
    {
        id: 'circuits-and-quiet-evenings',
        date: 'Oct 2026',
        readTime: '4 min read',
        title: 'On Circuits and Quiet Evenings',
        summary: 'Reflections on hardware debugging, the smell of solder, and finding tranquility under jasmines and lillies.',
        content: [
            'There is a very specific kind of patience required when a breadboard refuses to cooperate. You check continuity, trace ground loops, test voltage rails one pin at a time, and realize the fault was a single loose jumper hiding in plain sight.',
            'Stepping away from schematics and oscilloscopes at dusk always resets my perspective. Around Mehdipatnam, evening air cools down fast, and the scent of fresh jasmines and lilies nearby makes all the debugging static fade away.',
            'Balancing technical rigor with slow, unhurried evenings is something I want to carry into every project I build—whether it is a power simulation lab or a simple personal website.'
        ]
    }
];

// ============================================================================
// 2. PLAYLIST DATA (Add more songs by dropping .mp3 files into assets/photos/)
// ============================================================================
// Local MP3 playlist removed — synced live via ListenBrainz (@g1nyr)


// ============================================================================
// 3. PHOTO GALLERY & CAROUSEL
// ============================================================================
const photos = [
    { src: 'assets/photos/image1.jpeg', title: 'Quiet Grace' },
    { src: 'assets/photos/image2.jpeg', title: 'Breathing Through Leaves' },
    { src: 'assets/photos/image3.jpeg', title: 'Timeless Roots' },
    { src: 'assets/photos/image4.jpeg', title: 'Midnight Whisper' },
    { src: 'assets/photos/image5.jpeg', title: 'Wandering Boulders' }
];

function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

let shuffledPhotos = shuffleArray(photos);
let active = 0;
const slide = document.querySelector('#slide');
const caption = document.querySelector('#caption');
const carouselBox = document.querySelector('#carousel-box');

function updateSlide(index, immediate = false) {
    if (index >= shuffledPhotos.length) {
        const lastShown = shuffledPhotos[shuffledPhotos.length - 1];
        shuffledPhotos = shuffleArray(photos);
        if (shuffledPhotos.length > 1 && shuffledPhotos[0].src === lastShown.src) {
            [shuffledPhotos[0], shuffledPhotos[1]] = [shuffledPhotos[1], shuffledPhotos[0]];
        }
        active = 0;
    } else if (index < 0) {
        active = (index + shuffledPhotos.length) % shuffledPhotos.length;
    } else {
        active = index;
    }

    const applyPhoto = () => {
        if (slide) {
            slide.src = shuffledPhotos[active].src;
            slide.alt = shuffledPhotos[active].title;
            slide.style.opacity = '1';
        }
        if (caption) {
            caption.textContent = shuffledPhotos[active].title;
        }
    };

    if (immediate || !slide) {
        applyPhoto();
    } else {
        slide.style.opacity = '0.2';
        setTimeout(applyPhoto, 150);
    }
}

// Initialize carousel with a random photo immediately
updateSlide(0, true);

// Also randomize the dashboard photo card preview on load
const dashboardPhotoImg = document.querySelector('.photo-card img');
if (dashboardPhotoImg && shuffledPhotos.length > 1) {
    const previewPhoto = shuffledPhotos[1];
    dashboardPhotoImg.src = previewPhoto.src;
    dashboardPhotoImg.alt = previewPhoto.title;
}

let carouselInterval = setInterval(() => {
    updateSlide(active + 1);
}, 3500);

if (carouselBox) {
    carouselBox.onmouseenter = () => clearInterval(carouselInterval);
    carouselBox.onmouseleave = () => {
        carouselInterval = setInterval(() => {
            updateSlide(active + 1);
        }, 3500);
    };
}

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

// ============================================================================
// 4. LIGHTBOX MODAL
// ============================================================================
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

document.querySelectorAll('.photos-page figure, .lightbox-trigger-img').forEach((el) => {
    el.onclick = () => {
        const src = el.querySelector('img') ? el.querySelector('img').src : el.src;
        const title = el.querySelector('figcaption') ? el.querySelector('figcaption').textContent : (el.alt || 'Jeevan Eyes');
        const photoIndex = photos.findIndex(p => src.includes(p.src.split('/').pop()));
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

// ============================================================================
// 5. FULL BLOG ARTICLE READER MODAL & DYNAMIC RENDERING
// ============================================================================
const blogGridEl = document.querySelector('#blog-posts');
const blogModal = document.querySelector('#blog-modal');
const blogModalClose = document.querySelector('#blog-modal-close');
const blogModalDate = document.querySelector('#blog-modal-date');
const blogModalReadtime = document.querySelector('#blog-modal-readtime');
const blogModalTitle = document.querySelector('#blog-modal-title');
const blogModalBody = document.querySelector('#blog-modal-body');
const blogModalPrev = document.querySelector('#blog-modal-prev');
const blogModalNext = document.querySelector('#blog-modal-next');
let currentPostIndex = 0;

function renderBlogCards() {
    if (blogGridEl && blogPosts.length > 0) {
        blogGridEl.innerHTML = blogPosts.map((post, idx) => `
            <article class="blog-card" data-post-index="${idx}" tabindex="0" role="button">
                <span class="blog-date">${post.date} · ${post.readTime}</span>
                <h3>${post.title}</h3>
                <p>${post.summary}</p>
                <span class="read-more">Read article →</span>
            </article>
        `).join('');

        blogGridEl.querySelectorAll('.blog-card').forEach(card => {
            const openHandler = () => openBlogModal(Number(card.dataset.postIndex));
            card.onclick = openHandler;
            card.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openHandler();
                }
            };
        });
    }

    // Sync Home dashboard "LATEST NOTE" card with blogPosts[0]
    if (blogPosts.length > 0) {
        const latestTitle = document.querySelector('#latest-note-title');
        const latestSummary = document.querySelector('#latest-note-summary');
        const latestLink = document.querySelector('#latest-note-link');
        if (latestTitle) latestTitle.textContent = blogPosts[0].title + '.';
        if (latestSummary) latestSummary.textContent = blogPosts[0].summary;
        if (latestLink) {
            latestLink.onclick = (e) => {
                e.preventDefault();
                openBlogModal(0);
            };
        }
    }
}

function openBlogModal(index) {
    if (!blogModal || index < 0 || index >= blogPosts.length) return;
    currentPostIndex = index;
    const post = blogPosts[index];

    blogModalDate.textContent = post.date;
    blogModalReadtime.textContent = post.readTime;
    blogModalTitle.textContent = post.title;
    blogModalBody.innerHTML = post.content.map(block => {
        if (block.trim().startsWith('<blockquote>')) return block;
        return `<p>${block}</p>`;
    }).join('');

    if (blogModalPrev) blogModalPrev.disabled = index === 0;
    if (blogModalNext) blogModalNext.disabled = index === blogPosts.length - 1;

    blogModal.classList.add('open');
    blogModal.setAttribute('aria-hidden', 'false');
    const dialog = blogModal.querySelector('.blog-modal-dialog');
    if (dialog) dialog.scrollTop = 0;
}

function closeBlogModal() {
    if (!blogModal) return;
    blogModal.classList.remove('open');
    blogModal.setAttribute('aria-hidden', 'true');
}

if (blogModalClose) blogModalClose.onclick = closeBlogModal;
if (blogModal) {
    blogModal.onclick = (e) => {
        if (e.target === blogModal) closeBlogModal();
    };
}
if (blogModalPrev) {
    blogModalPrev.onclick = () => openBlogModal(currentPostIndex - 1);
}
if (blogModalNext) {
    blogModalNext.onclick = () => openBlogModal(currentPostIndex + 1);
}

renderBlogCards();

// Combined Keyboard Navigation (Lightbox + Blog Reader Modal + Spacebar Music Toggle)
window.onkeydown = (e) => {
    if (suggestModal && suggestModal.classList.contains('open')) {
        if (e.key === 'Escape') closeSuggestModal();
        return;
    }
    if (blogModal && blogModal.classList.contains('open')) {
        if (e.key === 'Escape') closeBlogModal();
        if (e.key === 'ArrowLeft' && currentPostIndex > 0) openBlogModal(currentPostIndex - 1);
        if (e.key === 'ArrowRight' && currentPostIndex < blogPosts.length - 1) openBlogModal(currentPostIndex + 1);
        return;
    }
    if (lightbox && lightbox.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
        if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
        return;
    }
    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const isTyping = tag === 'input' || tag === 'textarea' || (document.activeElement && document.activeElement.isContentEditable);
    if (e.code === 'Space' && !isTyping) {
        e.preventDefault();
        togglePlayPause();
    }
};

// ============================================================================
// 6. THEME TOGGLE WITH LOCALSTORAGE
// ============================================================================
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

// ============================================================================
// 7. LIVE MEHDIPATNAM WEATHER (OPEN-METEO) & IST CLOCK
// ============================================================================
const istClockEl = document.querySelector('#ist-clock');
const weatherLabelEl = document.querySelector('#weather-label');
const weatherTempEl = document.querySelector('#weather-temp');
const weatherDescEl = document.querySelector('#weather-desc');

function updateISTClock() {
    if (!istClockEl) return;
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(now).toUpperCase();
    istClockEl.textContent = `${formatted} IST`;
}

updateISTClock();
setInterval(updateISTClock, 1000);

function describeWeatherCode(code) {
    if (code === 0) return { icon: '☀️', text: 'Clear sky' };
    if (code === 1 || code === 2) return { icon: '⛅', text: 'Partly cloudy' };
    if (code === 3) return { icon: '☁️', text: 'Overcast' };
    if (code === 45 || code === 48) return { icon: '🌫️', text: 'Misty' };
    if ([51, 53, 55, 56, 57].includes(code)) return { icon: '🌦️', text: 'Light drizzle' };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: '🌧️', text: 'Rain showers' };
    if ([95, 96, 99].includes(code)) return { icon: '⛈️', text: 'Thunderstorm' };
    return { icon: '🌤️', text: 'Pleasant' };
}

async function fetchMehdipatnamWeather() {
    if (!weatherTempEl || !weatherDescEl) return;
    try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=17.3951&longitude=78.4402&current=temperature_2m,weather_code&timezone=Asia%2FKolkata';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        if (data && data.current) {
            const temp = Math.round(data.current.temperature_2m);
            const info = describeWeatherCode(data.current.weather_code);
            if (weatherLabelEl) weatherLabelEl.textContent = `${info.icon} WEATHER`;
            weatherTempEl.textContent = `${temp}°C`;
            weatherDescEl.textContent = `Mehdipatnam · ${info.text}`;
        }
    } catch (err) {
        console.warn('Using fallback weather display:', err);
    }
}

fetchMehdipatnamWeather();
setInterval(fetchMehdipatnamWeather, 600000); // Refresh every 10 minutes

// ============================================================================
// 8. LEAFLET MAP CENTERED ON MEHDIPATNAM, HYDERABAD
// ============================================================================
const mapEl = document.querySelector('#map');
if (mapEl) {
    const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([17.3951, 78.4402], 14);
    
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri'
    }).addTo(map);

    L.marker([17.3951, 78.4402], {
        icon: L.divIcon({ className: 'cat-pin', html: '<div class="cat-pin-inner">🐱</div>', iconSize: [36, 36], iconAnchor: [18, 18] })
    }).addTo(map).bindPopup('Mehdipatnam, Hyderabad').openPopup();

    setTimeout(() => map.invalidateSize(), 150);
}

// ============================================================================
// 9. LIVE SCROBBLE PLAYER (@g1nyr) + 30S PREVIEW + SPOTIFY & YT MUSIC REDIRECTS
// ============================================================================
const musicCard = document.querySelector('#music-card');
const musicStatusLabel = document.querySelector('#music-status-label');
const spotifyExternalLink = document.querySelector('#spotify-external-link');
const ytmExternalLink = document.querySelector('#ytm-external-link');
const playPauseBtn = document.querySelector('#play-pause-btn');
const suggestSongBtn = document.querySelector('#suggest-song-btn');
const trackCoverEl = document.querySelector('#track-cover');
const trackTitleEl = document.querySelector('#track-title');
const trackArtistEl = document.querySelector('#track-artist');
const equalizer = document.querySelector('#equalizer');
const musicLine = document.querySelector('.music .line');
const progressB = document.querySelector('.music .line b');
const currentTimeEl = document.querySelector('#current-time');
const totalTimeEl = document.querySelector('#total-time');

const audio = document.querySelector('#bg-audio') || new Audio();
audio.preload = 'metadata';

let isPlaying = false;
let currentLiveTrack = {
    title: 'Listening on YT Music',
    artist: '@g1nyr',
    cover: 'assets/photos/profile.jpeg',
    src: '',
    spotifyUrl: 'https://open.spotify.com',
    ytmUrl: 'https://music.youtube.com'
};
let lastScrobbleSignature = '';

const playSvg = '<svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" style="display: block; transform: translateX(1.5px);"><path d="M1 1L11 7L1 13V1Z"/></svg>';
const pauseSvg = '<svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" style="display: block;"><rect width="3" height="14" rx="1"/><rect x="7" width="3" height="14" rx="1"/></svg>';

function formatTime(seconds) {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function setPlayingUI(playing) {
    isPlaying = playing;
    if (playPauseBtn) playPauseBtn.innerHTML = playing ? pauseSvg : playSvg;
    if (equalizer) equalizer.classList.toggle('playing', playing);
    if (musicCard) musicCard.classList.toggle('is-playing', playing);
}

function buildStreamLinks(title, artist) {
    const query = encodeURIComponent(`${title} ${artist}`.trim());
    return {
        spotifyUrl: `https://open.spotify.com/search/${query}`,
        ytmUrl: `https://music.youtube.com/search?q=${query}`
    };
}

function applyLiveTrackUI(track, isNowPlaying = false) {
    currentLiveTrack = track;

    if (musicCard) {
        musicCard.classList.toggle('is-live-scrobble', isNowPlaying);
    }
    if (musicStatusLabel) {
        musicStatusLabel.textContent = isNowPlaying ? '● LIVE NOW' : '♫ LAST PLAYED';
    }
    if (trackCoverEl) {
        trackCoverEl.src = track.cover || 'assets/photos/profile.jpeg';
        trackCoverEl.alt = `${track.title} cover`;
    }
    if (trackTitleEl) {
        trackTitleEl.textContent = track.title;
        trackTitleEl.title = `${track.title} — ${track.artist}`;
    }
    if (trackArtistEl) {
        trackArtistEl.textContent = track.artist;
    }
    if (spotifyExternalLink) {
        spotifyExternalLink.href = track.spotifyUrl;
    }
    if (ytmExternalLink) {
        ytmExternalLink.href = track.ytmUrl;
    }

    if (progressB) progressB.style.width = '0%';
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
    if (totalTimeEl) totalTimeEl.textContent = '0:00';

    if (track.src) {
        audio.src = track.src;
        audio.load();
        if (playPauseBtn) {
            playPauseBtn.disabled = false;
            playPauseBtn.style.opacity = '1';
            playPauseBtn.title = 'Play / Pause 30s preview (Space)';
        }
    } else {
        audio.removeAttribute('src');
        if (playPauseBtn) {
            playPauseBtn.title = 'Open on Spotify / YT Music';
        }
    }
    setPlayingUI(false);
}

// Lookup 30-second audio preview + high-res cover via iTunes Search API (no API key needed)
async function enrichWithItunesPreview(title, artist, existingCover = '') {
    try {
        const term = encodeURIComponent(`${title} ${artist}`.trim());
        const res = await fetch(`https://itunes.apple.com/search?term=${term}&entity=song&limit=1`);
        if (!res.ok) throw new Error('iTunes search failed');
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            const hit = data.results[0];
            const hiResCover = hit.artworkUrl100 ? hit.artworkUrl100.replace('100x100bb', '400x400bb') : existingCover;
            return {
                previewUrl: hit.previewUrl || '',
                cover: existingCover || hiResCover || 'assets/photos/profile.jpeg'
            };
        }
    } catch (err) {
        console.warn('iTunes preview lookup failed:', err);
    }
    return {
        previewUrl: '',
        cover: existingCover || 'assets/photos/profile.jpeg'
    };
}

// Fetch live / last-played song from ListenBrainz (@g1nyr) or Last.fm
async function syncLiveScrobble(force = false) {
    const lbUser = (LIVE_MUSIC_CONFIG.listenbrainzUsername || '').trim();
    const lfmUser = (LIVE_MUSIC_CONFIG.lastfmUsername || '').trim();
    const lfmKey = (LIVE_MUSIC_CONFIG.lastfmApiKey || '').trim();

    if (!lbUser && (!lfmUser || !lfmKey)) return;

    try {
        let title = '';
        let artist = '';
        let isNowPlaying = false;
        let cover = '';

        if (lbUser) {
            const nowRes = await fetch(`https://api.listenbrainz.org/1/user/${encodeURIComponent(lbUser)}/playing-now`);
            const nowData = nowRes.ok ? await nowRes.json() : null;
            const nowListens = nowData?.payload?.listens || [];

            if (nowListens.length > 0 && nowListens[0].track_metadata) {
                title = nowListens[0].track_metadata.track_name || '';
                artist = nowListens[0].track_metadata.artist_name || '';
                isNowPlaying = true;
            } else {
                const histRes = await fetch(`https://api.listenbrainz.org/1/user/${encodeURIComponent(lbUser)}/listens?count=1`);
                const histData = histRes.ok ? await histRes.json() : null;
                const histListens = histData?.payload?.listens || [];
                if (histListens.length > 0 && histListens[0].track_metadata) {
                    title = histListens[0].track_metadata.track_name || '';
                    artist = histListens[0].track_metadata.artist_name || '';
                    isNowPlaying = false;
                }
            }
        } else if (lfmUser && lfmKey) {
            const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(lfmUser)}&api_key=${encodeURIComponent(lfmKey)}&format=json&limit=1`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                const tracks = data?.recenttracks?.track || [];
                const latest = Array.isArray(tracks) ? tracks[0] : tracks;
                if (latest) {
                    title = latest.name || '';
                    artist = (latest.artist && (latest.artist['#text'] || latest.artist.name)) || '';
                    isNowPlaying = latest['@attr']?.nowplaying === 'true';
                    const imgs = latest.image || [];
                    const xl = imgs.find(i => i.size === 'extralarge') || imgs[imgs.length - 1];
                    if (xl && xl['#text'] && !xl['#text'].includes('2a96cbd8b46e442fc41c2b86b821562f')) {
                        cover = xl['#text'];
                    }
                }
            }
        }

        if (!title || !artist) {
            if (trackTitleEl && trackTitleEl.textContent === 'Loading track...') {
                trackTitleEl.textContent = 'No recent scrobbles';
                if (trackArtistEl) trackArtistEl.textContent = `ListenBrainz: @${lbUser || lfmUser}`;
            }
            return;
        }

        const signature = `${title}::${artist}::${isNowPlaying}`;
        if (!force && signature === lastScrobbleSignature) return;
        lastScrobbleSignature = signature;

        const enriched = await enrichWithItunesPreview(title, artist, cover);
        const links = buildStreamLinks(title, artist);

        const nextTrack = {
            title,
            artist,
            cover: enriched.cover,
            src: enriched.previewUrl,
            spotifyUrl: links.spotifyUrl,
            ytmUrl: links.ytmUrl
        };

        if (!isPlaying || force) {
            applyLiveTrackUI(nextTrack, isNowPlaying);
        }
    } catch (err) {
        console.warn('Live scrobble sync error:', err);
    }
}

audio.onloadedmetadata = () => {
    if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
};

audio.ontimeupdate = () => {
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    if (audio.duration && !isNaN(audio.duration)) {
        if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
        if (progressB) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressB.style.width = `${percent}%`;
        }
    }
};

audio.onerror = () => {
    setPlayingUI(false);
};

audio.onended = () => {
    setPlayingUI(false);
    if (progressB) progressB.style.width = '0%';
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
};

if (musicLine) {
    musicLine.onclick = (e) => {
        e.stopPropagation();
        const rect = musicLine.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        if (audio.duration && !isNaN(audio.duration)) {
            audio.currentTime = pos * audio.duration;
            if (!isPlaying) {
                audio.play().then(() => setPlayingUI(true)).catch(console.error);
            }
        }
    };
}

function togglePlayPause() {
    if (!currentLiveTrack.src) {
        // If no 30s preview exists for this track, open directly in Spotify
        window.open(currentLiveTrack.spotifyUrl || 'https://open.spotify.com', '_blank', 'noopener,noreferrer');
        return;
    }
    if (isPlaying) {
        audio.pause();
        setPlayingUI(false);
    } else {
        audio.play().then(() => {
            setPlayingUI(true);
        }).catch(err => {
            console.error('Preview playback failed:', err);
        });
    }
}

if (playPauseBtn) {
    playPauseBtn.onclick = (e) => {
        e.stopPropagation();
        togglePlayPause();
    };
}

const suggestModal = document.querySelector('#suggest-modal');
const suggestModalClose = document.querySelector('#suggest-modal-close');
const suggestSongForm = document.querySelector('#suggest-song-form');

function openSuggestModal() {
    if (!suggestModal) return;
    suggestModal.classList.add('open');
    suggestModal.setAttribute('aria-hidden', 'false');
    const firstInput = suggestModal.querySelector('input[name="song_title"]');
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
}

function closeSuggestModal() {
    if (!suggestModal) return;
    suggestModal.classList.remove('open');
    suggestModal.setAttribute('aria-hidden', 'true');
}

if (suggestSongBtn) {
    suggestSongBtn.onclick = (e) => {
        e.stopPropagation();
        openSuggestModal();
    };
}

if (suggestModalClose) {
    suggestModalClose.onclick = () => closeSuggestModal();
}

if (suggestModal) {
    suggestModal.onclick = (e) => {
        if (e.target === suggestModal) closeSuggestModal();
    };
}

// Fetch live / last-played song immediately and poll every 45s
syncLiveScrobble(true);
setInterval(() => syncLiveScrobble(false), LIVE_MUSIC_CONFIG.pollIntervalMs || 45000);

// ============================================================================
// 10. NAVIGATION TAB ROUTING
// ============================================================================
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
        if (aside) aside.style.display = 'block';
        pages.forEach(p => {
            if ('#' + p.id === hash) {
                p.classList.add('active-page');
            } else {
                p.classList.remove('active-page');
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

// ============================================================================
// 11. CONTACT FORM SUBMISSION VIA FORMSUBMIT AJAX
// ============================================================================
const contactForm = document.querySelector('#contact-form');
const toast = document.querySelector('#toast');
if (contactForm && toast) {
    contactForm.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : 'Send message →';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        const formData = new FormData(contactForm);
        try {
            const response = await fetch('https://formsubmit.co/ajax/jeevannayyar0@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });
            const result = await response.json();
            if (response.ok && (result.success === 'true' || result.success === true)) {
                toast.textContent = 'Message sent to Jeevan! ✨';
                toast.classList.add('show');
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (err) {
            console.error('FormSubmit error:', err);
            toast.textContent = 'Check Gmail to activate FormSubmit or try again!';
            toast.classList.add('show');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    };
}

// ============================================================================
// 12. SUGGEST SONG FORM SUBMISSION VIA FORMSUBMIT AJAX
// ============================================================================
if (suggestSongForm && toast) {
    suggestSongForm.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = suggestSongForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : 'Send suggestion →';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        const formData = new FormData(suggestSongForm);
        try {
            const response = await fetch('https://formsubmit.co/ajax/jeevannayyar0@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });
            const result = await response.json();
            if (response.ok && (result.success === 'true' || result.success === true)) {
                toast.textContent = 'Song suggestion sent to Jeevan! ♫';
                toast.classList.add('show');
                suggestSongForm.reset();
                closeSuggestModal();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (err) {
            console.error('Song suggestion error:', err);
            toast.textContent = 'Could not send right now — try again!';
            toast.classList.add('show');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    };
}
