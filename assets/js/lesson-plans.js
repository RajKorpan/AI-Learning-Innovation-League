(()=>{
const KEY='leagueLessonLengthV1';
const buttons=[...document.querySelectorAll('[data-lesson-length]')];
const panels=[...document.querySelectorAll('[data-lesson-plan]')];
const status=document.querySelector('[data-lesson-length-status]');
if(!buttons.length||!panels.length)return;
function show(value){
  const v=value==='90'?'90':'45';
  buttons.forEach(b=>{const on=b.dataset.lessonLength===v;b.classList.toggle('is-selected',on);b.setAttribute('aria-pressed',on?'true':'false');});
  panels.forEach(p=>{p.hidden=p.dataset.lessonPlan!==v;});
  if(status)status.textContent=`Showing the ${v==='45'?'45-minute':'90-minute (two-session)'} Lesson Plan.`;
  try{localStorage.setItem(KEY,v)}catch(e){}
}
let saved='45';try{saved=localStorage.getItem(KEY)||'45'}catch(e){}
show(saved);
buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.lessonLength)));
})();