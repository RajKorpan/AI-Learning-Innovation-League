
const menuButton=document.querySelector('.menu-button');
const siteNav=document.querySelector('.site-nav');
if(menuButton&&siteNav){menuButton.addEventListener('click',()=>{const open=siteNav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){siteNav?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');}});
const sectionLinks=[...document.querySelectorAll('.sidebar-toc a[href^="#"]')];
const sections=sectionLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window&&sections.length){
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){sectionLinks.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+entry.target.id));}});},{rootMargin:'-20% 0px -70% 0px',threshold:0});
 sections.forEach(s=>observer.observe(s));
}
