
const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
}

const dropdownToggles = document.querySelectorAll(".nav-toggle");

// Dropdowns are closed on initial load. The current page is identified by
// aria-current on its link, not by claiming that its parent menu is expanded.
dropdownToggles.forEach(toggle => {
  toggle.setAttribute("aria-expanded", "false");
});

function closeDropdowns(except = null) {
  document.querySelectorAll(".nav-item.open").forEach(item => {
    if (item !== except) {
      item.classList.remove("open");
      const toggle = item.querySelector(".nav-toggle");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });
}

dropdownToggles.forEach(toggle => {
  toggle.addEventListener("click", event => {
    event.stopPropagation();
    const item = toggle.closest(".nav-item");
    const willOpen = !item.classList.contains("open");
    closeDropdowns(item);
    item.classList.toggle("open", willOpen);
    toggle.setAttribute("aria-expanded", String(willOpen));
  });
});

document.addEventListener("click", event => {
  if (!event.target.closest(".site-nav")) closeDropdowns();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    const openToggle = document.querySelector(".nav-item.open .nav-toggle");
    closeDropdowns();
    if (siteNav) siteNav.classList.remove("open");
    if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    if (openToggle) openToggle.focus();
  }
});
