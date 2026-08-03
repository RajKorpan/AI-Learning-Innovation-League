
const menuButton=document.querySelector(".menu-button");
const siteNav=document.querySelector(".site-nav");
if(menuButton&&siteNav){
 menuButton.addEventListener("click",()=>{const open=siteNav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));});
}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&siteNav){siteNav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false");}});
