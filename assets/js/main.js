(()=>{

const menuButton=document.querySelector('.menu-button');
const siteNav=document.querySelector('.site-nav');
if(menuButton&&siteNav){menuButton.addEventListener('click',()=>{const open=siteNav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});}
const sidebar=document.querySelector('.page-sidebar');
const sidebarToggle=document.querySelector('.sidebar-toggle');
if(sidebar&&sidebarToggle){sidebarToggle.addEventListener('click',()=>{const open=sidebar.classList.toggle('is-open');sidebarToggle.setAttribute('aria-expanded',String(open));});sidebar.querySelectorAll('.sidebar-panel a').forEach(a=>a.addEventListener('click',()=>{if(window.matchMedia('(max-width: 780px)').matches){sidebar.classList.remove('is-open');sidebarToggle.setAttribute('aria-expanded','false');}}));}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){siteNav?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');sidebar?.classList.remove('is-open');sidebarToggle?.setAttribute('aria-expanded','false');}});
const sectionLinks=[...document.querySelectorAll('.sidebar-toc a[href^="#"]')];
const sections=sectionLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window&&sections.length){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){sectionLinks.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+entry.target.id));}});},{rootMargin:'-20% 0px -70% 0px',threshold:0});sections.forEach(s=>observer.observe(s));}

})();
