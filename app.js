const posts=[
 {title:'Why I Love Building on the Internet',date:'2025.09.10',category:'Tech',excerpt:'On making small things that reach farther than expected.'},
 {title:'A Day in My Life',date:'2025.09.03',category:'Life',excerpt:'A regular day, with a few details worth holding onto.'},
 {title:'Things I’m Learning Right Now',date:'2025.08.21',category:'Thoughts',excerpt:'A changing list of questions, tools, and rabbit holes.'},
 {title:'A Letter to My Future Self',date:'2025.08.05',category:'Thoughts',excerpt:'A note to revisit when the road looks different.'},
 {title:'Random Thoughts at 2 AM',date:'2025.07.28',category:'Random',excerpt:'The notes that only make sense when the world is quiet.'}
];
const photos = [
  { title: 'Faith', src: 'assets/photos/image1.jpeg' },
  { title: 'Peace', src: 'assets/photos/image2.jpeg' },
  { title: 'Nature', src: 'assets/photos/image3.jpeg' },
  { title: 'Calm', src: 'assets/photos/image4.jpeg' },
  { title: 'Beauty', src: 'assets/photos/image5.jpeg' }
];
document.querySelector('#photo-grid').innerHTML = photos.map((p, i) => `
  <button class="photo" data-index="${i}">
    <figure>
      <img src="${p.src}" alt="${p.title}" loading="lazy" />
      <figcaption>${p.title}</figcaption>
    </figure>
  </button>
`).join('');
let filter='all';
function visiblePosts(){return filter==='all'?posts:posts.filter(p=>p.category===filter)}
function renderPosts(){const list=visiblePosts();document.querySelector('#home-posts').innerHTML=list.map(p=>`<a class="post-row" href="#blog"><span>${p.title}</span><time>${p.date}</time></a>`).join('')||'<p>No posts in this category yet.</p>';document.querySelector('#blog-posts').innerHTML=list.map(p=>`<a class="card blog-post" href="#blog"><small>${p.category.toUpperCase()} · ${p.date}</small><h3>${p.title}</h3><p>${p.excerpt}</p></a>`).join('')||'<p>No posts in this category yet.</p>';document.querySelectorAll('.filters button').forEach(b=>b.classList.toggle('selected',b.dataset.filter===filter))}
document.querySelectorAll('[data-filter-group]').forEach(group=>group.addEventListener('click',e=>{if(e.target.matches('button')){filter=e.target.dataset.filter;renderPosts()}}));
function showPage(){const id=location.hash.slice(1)||'home';document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('.navigation a').forEach(a=>a.classList.toggle('active',a.dataset.page===id));document.querySelector('.sidebar').classList.remove('open');document.querySelector('#menu-button').setAttribute('aria-expanded','false');window.scrollTo({top:0,behavior:'smooth'})}
addEventListener('hashchange',showPage);showPage();renderPosts();
document.querySelector('#year').textContent=new Date().getFullYear();
const theme=localStorage.getItem('jeevans-eyes-theme');if(theme==='dark')document.documentElement.dataset.theme='dark';document.querySelector('.theme-toggle').onclick=()=>{const dark=document.documentElement.dataset.theme==='dark';document.documentElement.dataset.theme=dark?'':'dark';localStorage.setItem('jeevans-eyes-theme',dark?'light':'dark')};
document.querySelector('#menu-button').onclick=()=>{const bar=document.querySelector('.sidebar'),open=bar.classList.toggle('open');document.querySelector('#menu-button').setAttribute('aria-expanded',open)};
const dialog = document.querySelector('#lightbox');

document.querySelector('#photo-grid').onclick = e => {
  const button = e.target.closest('.photo');
  if (!button) return;

  const photo = photos[button.dataset.index];
  dialog.querySelector('img').src = photo.src;
  dialog.querySelector('img').alt = photo.title;
  dialog.querySelector('p').textContent = photo.title;
  dialog.showModal();
};

dialog.querySelector('button').onclick = () => dialog.close();
document.querySelector('.contact-form').onsubmit=e=>{e.preventDefault();const form=e.currentTarget,msg=form.querySelector('.form-message');msg.textContent=form.checkValidity()?'Thanks — your message looks ready to send. Connect a form service to deliver it.':'Please complete your name, a valid email, and message.';if(!form.checkValidity())form.reportValidity()};
lucide.createIcons();
