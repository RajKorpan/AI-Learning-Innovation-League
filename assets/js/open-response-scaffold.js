(()=>{
'use strict';
const page=document.querySelector('.student-stage-page');
if(!page)return;
function labelFor(el){
  const explicit=el.id?document.querySelector(`label[for="${CSS.escape(el.id)}"]`):null;
  if(explicit)return explicit.textContent.trim();
  const wrap=el.closest('label'); if(wrap)return wrap.textContent.trim();
  return '';
}
function starter(label){
  const t=label.toLowerCase();
  if(/question/.test(t))return 'Tell me about...';
  if(/evidence|see|hear|notice|happened/.test(t))return 'I saw or heard...';
  if(/success|know whether|look for/.test(t))return 'We will know it helped if...';
  if(/hard|stuck|breakdown|difficult/.test(t))return 'It starts to get hard when...';
  if(/learner.*do|trying to do|task/.test(t))return 'The learner is trying to...';
  if(/change|revise|improve/.test(t))return 'We changed... because...';
  if(/explain|why|reason/.test(t))return 'I think this because...';
  if(/prompt|ai.*do|tool.*do/.test(t))return 'Your job is to help the learner...';
  if(/already|current/.test(t))return 'The learner can already...';
  return 'Start with one specific example...';
}
page.querySelectorAll('textarea').forEach(el=>{
  if(el.dataset.noAutoScaffold==='true'||el.closest('.response-scaffold'))return;
  const parent=el.parentElement;
  // Avoid adding a duplicate when a field already has a nearby purpose-built helper.
  const next=el.nextElementSibling;
  if(next&&(next.classList.contains('sentence-starter-row')||next.classList.contains('wizard-uncertainty')))return;
  const text=starter(labelFor(el));
  const d=document.createElement('details');d.className='response-scaffold';
  d.innerHTML=`<summary>Need a starting point?</summary><div><p>Start rough. Use one real example instead of trying to write the perfect answer.</p><button type="button" class="button ghost tiny" data-auto-starter>Use a sentence starter</button>${el.dataset.allowUnsure==='true'?'<button type="button" class="button ghost tiny" data-auto-unsure>I’m not sure yet</button>':''}</div>`;
  el.insertAdjacentElement('afterend',d);
  d.querySelector('[data-auto-starter]')?.addEventListener('click',()=>{if(!el.value.trim())el.value=text;el.focus()});
  d.querySelector('[data-auto-unsure]')?.addEventListener('click',()=>{el.value="I'm not sure yet.";el.focus()});
});
})();
