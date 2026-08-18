(()=>{
const LENGTH_KEY='leagueLessonLengthV1';
const MODE_KEY='leagueLessonModeV2';
const LESSON_MODE_KEY=MODE_KEY+':'+location.pathname;
const buttons=[...document.querySelectorAll('[data-lesson-length]')];
const panels=[...document.querySelectorAll('[data-lesson-plan]')];
const status=document.querySelector('[data-lesson-length-status]');
function showLength(value){
  const v=value==='90'?'90':'45';
  buttons.forEach(b=>{const on=b.dataset.lessonLength===v;b.classList.toggle('is-selected',on);b.setAttribute('aria-pressed',on?'true':'false');});
  panels.forEach(p=>{p.hidden=p.dataset.lessonPlan!==v;});
  if(status)status.textContent=v==='45'?'Showing the 1 × 45-minute Lesson Plan.':'Showing the 2 × 45-minute Lesson Plan.';
  try{localStorage.setItem(LENGTH_KEY,v)}catch(e){}
}
if(buttons.length&&panels.length){let saved='45';try{saved=localStorage.getItem(LENGTH_KEY)||'45'}catch(e){}showLength(saved);buttons.forEach(b=>b.addEventListener('click',()=>showLength(b.dataset.lessonLength)));}

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
})();