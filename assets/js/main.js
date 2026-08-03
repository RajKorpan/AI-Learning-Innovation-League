
const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");
if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
}
const toggles = document.querySelectorAll(".nav-toggle");
function closeMenus(except=null){
  document.querySelectorAll(".nav-item.open").forEach(item=>{
    if(item!==except){item.classList.remove("open");const b=item.querySelector(".nav-toggle");if(b)b.setAttribute("aria-expanded","false");}
  });
}
toggles.forEach(toggle=>{
  toggle.addEventListener("click",e=>{
    e.stopPropagation();
    const item=toggle.closest(".nav-item");
    const willOpen=!item.classList.contains("open");
    closeMenus(item);
    item.classList.toggle("open",willOpen);
    toggle.setAttribute("aria-expanded",String(willOpen));
  });
});
document.addEventListener("click",e=>{if(!e.target.closest(".site-nav"))closeMenus();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeMenus();if(siteNav)siteNav.classList.remove("open");if(menuButton)menuButton.setAttribute("aria-expanded","false");}});
