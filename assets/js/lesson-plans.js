(()=>{
const modeButtons=[...document.querySelectorAll('[data-lesson-mode]')];
const modePanels=[...document.querySelectorAll('[data-lesson-mode-panel]')];
function showMode(mode,scroll=false){
  const m=mode==='student'?'student':'prep';
  modeButtons.forEach(b=>{const on=b.dataset.lessonMode===m;b.classList.toggle('is-selected',on);b.setAttribute('aria-pressed',on?'true':'false');});
  modePanels.forEach(p=>{p.hidden=p.dataset.lessonModePanel!==m;});
  try{localStorage.setItem(LESSON_MODE_KEY,m)}catch(e){}
  if(scroll){const target=document.getElementById(m==='prep'?'advisor-prep':'student-meeting');target?.scrollIntoView({behavior:'smooth',block:'start'});}
}
if(modeButtons.length&&modePanels.length){let saved='prep';try{saved=localStorage.getItem(LESSON_MODE_KEY)||'prep'}catch(e){}showMode(saved);modeButtons.forEach(b=>b.addEventListener('click',()=>showMode(b.dataset.lessonMode,true)));document.querySelectorAll('[data-switch-lesson-mode]').forEach(b=>b.addEventListener('click',()=>showMode(b.dataset.switchLessonMode,true)));document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{const id=a.getAttribute('href').slice(1),target=document.getElementById(id);const panel=target?.closest('[data-lesson-mode-panel]');if(panel)showMode(panel.dataset.lessonModePanel,false);}));}

document.querySelectorAll('.prep-challenge').forEach(card=>{const feedback=card.querySelector('[data-prep-feedback]');card.querySelectorAll('[data-prep-answer]').forEach(btn=>btn.addEventListener('click',()=>{const correct=btn.dataset.correct==='true';card.querySelectorAll('[data-prep-answer]').forEach(b=>{b.classList.remove('is-correct','is-incorrect');b.setAttribute('aria-pressed','false')});btn.classList.add(correct?'is-correct':'is-incorrect');btn.setAttribute('aria-pressed','true');if(feedback)feedback.textContent=correct?`✓ ${feedback.dataset.correctFeedback}`:'Not quite. Try the option that gathers evidence about learning before assuming a cause, choosing a solution, or judging success.';}));});


// On facilitator session pages, the sticky utility replaces the top controls only
// after those controls have scrolled out of view. This prevents duplicate controls
// from appearing in the opening viewport.
const sessionSticky=document.querySelector('.session-sticky-utility');
const sessionTopTools=document.querySelector('.session-top-tools');
if(sessionSticky&&sessionTopTools){
  const setSticky=(show)=>{
    sessionSticky.hidden=!show;
    sessionSticky.setAttribute('aria-hidden',show?'false':'true');
  };
  setSticky(false);
  const updateSticky=()=>{
    const rect=sessionTopTools.getBoundingClientRect();
    const header=document.querySelector('.site-header');
    const offset=(header?.getBoundingClientRect().height||0)+8;
    setSticky(rect.bottom<offset);
  };
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(()=>updateSticky(),{threshold:[0,1]});
    observer.observe(sessionTopTools);
  }
  window.addEventListener('scroll',updateSticky,{passive:true});
  window.addEventListener('resize',updateSticky);
  updateSticky();
}
})();