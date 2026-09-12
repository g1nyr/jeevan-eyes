const photos=[{src:'assets/photos/image1.jpeg',title:'Stillness'},{src:'assets/photos/image2.jpeg',title:'Sun through leaves'},{src:'assets/photos/image3.jpeg',title:'Temple tree'},{src:'assets/photos/image4.jpeg',title:'Hampi horses'},{src:'assets/photos/image5.jpeg',title:'Moon through trees'}];

// ---- Carousel: pauses on hover/focus and when the tab isn't visible ----
let active=0,carouselTimer=null;
const slide=document.querySelector('#slide'),counter=document.querySelector('#counter'),caption=document.querySelector('#caption'),carousel=document.querySelector('.carousel');
function advanceSlide(){
  active=(active+1)%photos.length;
  slide.style.opacity='.25';
  setTimeout(()=>{
    slide.src=photos[active].src;
    slide.alt=photos[active].title;
    caption.textContent=photos[active].title;
    counter.textContent=`${String(active+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
    slide.style.opacity='1';
  },180);
}
function startCarousel(){ if(!carouselTimer) carouselTimer=setInterval(advanceSlide,2000); }
function stopCarousel(){ clearInterval(carouselTimer); carouselTimer=null; }
startCarousel();
carousel.addEventListener('mouseenter',stopCarousel);
carousel.addEventListener('mouseleave',startCarousel);
document.addEventListener('visibilitychange',()=>{ document.hidden?stopCarousel():startCarousel(); });

// ---- Gallery grid + lightbox ----
const gallery=document.querySelector('#gallery');
gallery.innerHTML=photos.map((p,i)=>`<figure data-index="${i}" tabindex="0" role="button" aria-label="View ${p.title} full size"><img src="${p.src}" alt="${p.title}" loading="lazy"/><figcaption>${p.title}</figcaption></figure>`).join('');

const lightbox=document.querySelector('#lightbox'),lightboxImg=document.querySelector('#lightboxImg'),lightboxCaption=document.querySelector('#lightboxCaption'),lightboxClose=document.querySelector('#lightboxClose');
let lastFocused=null;
function openLightbox(index){
  const p=photos[index];
  lightboxImg.src=p.src; lightboxImg.alt=p.title; lightboxCaption.textContent=p.title;
  lightbox.hidden=false;
  lastFocused=document.activeElement;
  lightboxClose.focus();
}
function closeLightbox(){
  lightbox.hidden=true;
  if(lastFocused) lastFocused.focus();
}
gallery.addEventListener('click',e=>{
  const fig=e.target.closest('figure[data-index]');
  if(fig) openLightbox(Number(fig.dataset.index));
});
gallery.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('figure[data-index]')){
    e.preventDefault();
    openLightbox(Number(e.target.dataset.index));
  }
});
lightboxClose.addEventListener('click',closeLightbox);
lightbox.addEventListener('click',e=>{ if(e.target===lightbox) closeLightbox(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape' && !lightbox.hidden) closeLightbox(); });

// ---- Map ----
const HYD_LAT=17.3982, HYD_LNG=78.4422;
const map=L.map('map',{zoomControl:false,attributionControl:true}).setView([HYD_LAT,HYD_LNG],14);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{attribution:'Tiles © Esri'}).addTo(map);
L.marker([HYD_LAT,HYD_LNG],{icon:L.divIcon({className:'cat-pin',html:'🐱',iconSize:[42,42],iconAnchor:[21,38]})}).addTo(map).bindPopup('Mehdipatnam, Hyderabad').openPopup();

// ---- Live weather (Open-Meteo, no key required) ----
const WEATHER_CODES={0:'Clear sky',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',48:'Foggy',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Rain showers',81:'Rain showers',82:'Violent showers',95:'Thunderstorm'};
async function updateWeather(){
  const tempEl=document.querySelector('#temp'),descEl=document.querySelector('#weather-desc');
  try{
    const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${HYD_LAT}&longitude=${HYD_LNG}&current=temperature_2m,weather_code`);
    const data=await res.json();
    const temp=Math.round(data.current.temperature_2m);
    const desc=WEATHER_CODES[data.current.weather_code]||'—';
    tempEl.textContent=`${temp}°C`;
    descEl.textContent=`Mehdipatnam · ${desc}`;
  }catch(err){
    // Keep the static fallback already in the markup if the request fails
    console.warn('Weather fetch failed, showing default values.',err);
  }
}
updateWeather();

// ---- Mobile nav ----
const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');
menu.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
}));

// ---- Active nav highlight for in-page sections ----
const navLinks=[...nav.querySelectorAll('a')];
function setActiveHash(){
  const hash=location.hash||'#home';
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===hash));
}
window.addEventListener('hashchange',setActiveHash);
setActiveHash();
