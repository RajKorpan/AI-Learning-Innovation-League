(()=>{
'use strict';
const STORE='leagueStageToolsV2', JOURNEY='leagueJourneyStateV1';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>\'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const load=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch(e){return {}}};
const save=(k,v)=>{const s=load();s[k]=v;try{localStorage.setItem(STORE,JSON.stringify(s))}catch(e){}return v};
const journey=()=>{try{return JSON.parse(localStorage.getItem(JOURNEY)||'{}')}catch(e){return {}}};
const checked=n=>[...document.querySelectorAll(`input[name="${n}"]:checked`)].map(x=>x.value);
// Migrate an older four-path prototype choice into the current three-path model.
try{const j=journey();if(j.buildPath==='d'){j.buildPath='c';localStorage.setItem(JOURNEY,JSON.stringify(j));}const s=load();if(s.buildWizard?.path==='d'){s.buildWizard.path='c';localStorage.setItem(STORE,JSON.stringify(s));}}catch(e){}
async function copy(text,status){try{await navigator.clipboard.writeText(text);if(status)status.textContent='Copied. Open the AI tool your advisor or school permits.';}catch(e){if(status)status.textContent='Copy was blocked. Select the prompt text and copy it manually.';}}

// Design check
$('run-design-check')?.addEventListener('click',()=>{
 const core=checked('league-quality'), ai=checked('ai-quality'), path=journey().buildPath||load().productDecision?.path||'';
 const aiUsed=path==='b'||path==='c'||['conversation','aicontent','aiphysical','app'].includes(load().buildProduct);
 const missingCore=7-core.length, missingAI=aiUsed?5-ai.length:0;
 const rec=[];
 if(!core.includes('goal'))rec.push('Write the learning objective and observable success evidence before polishing.');
 if(!core.includes('thinking'))rec.push('Redesign the interaction so the learner—not the tool—does the important thinking.');
 if(!core.includes('strategy'))rec.push('Name the learning strategy and show where it appears in the interaction.');
 if(!core.includes('testable'))rec.push('Shrink the prototype until one important design claim can be tested.');
 if(!core.includes('access'))rec.push('Add an accessible way to understand instructions, respond, control pacing, or use an alternative format.');
 if(aiUsed&&!ai.includes('reusable'))rec.push('Clarify the repeatable learning process. A single generated answer is not yet a reusable Learning League tool.');
 if(aiUsed&&!ai.includes('learner'))rec.push('Change the AI behavior so it asks for a learner attempt before giving substantial help.');
 if(aiUsed&&!ai.includes('verify'))rec.push('Add a plan to verify generated content/feedback and handle uncertainty.');
 const ready=missingCore===0 && missingAI===0;
 const title=ready?'Strong foundation for testing':missingCore<=2&&missingAI<=1?'Almost ready—make a few design revisions':'Revisit the design before investing in polish';
 const next=path==='b'?'<a class="button primary small" href="#ai-tool-lab">Next: Experience an AI learning tool →</a>':path==='c'?'<a class="button primary small" href="#advisor-check">Next: Review the advanced build with your advisor →</a>':'<a class="button primary small" href="#advisor-check">Next: Review the prototype with your advisor →</a>'; const out=$('design-check-result');out.innerHTML=`<div class="result-summary ${ready?'fit-high':'fit-medium'}"><div><span class="result-kicker">Design check</span><h3>${esc(title)}</h3><p>${core.length}/7 core checks${aiUsed?` and ${ai.length}/5 AI checks`:''} are currently confirmed.</p></div></div>${rec.length?`<div class="note-box"><strong>Best next revisions</strong><ul>${rec.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:'<div class="callout-blue"><strong>Ready for the next decision:</strong> keep the prototype small. Testing may still show that your current hypothesis is wrong—and that is useful.</div>'}<div class="tool-actions">${next}</div>`;
 save('designCheck',{core,ai,aiUsed,ready});
});

// Curated AI examples
const examples={
 word:`Act as a question-decomposition coach for a learner working on math word problems. Do not solve the problem. Ask one short question at a time. First ask the learner to name the unknown, then the givens, then the relationships. Require the learner to state a plan before suggesting an operation. If the learner is stuck, give one focused cue rather than the answer. After the learner states a plan, ask them to explain why it fits.`,
 retrieval:`Act as a retrieval-practice coach for a learner studying biology vocabulary. Ask for one term or example from memory before showing any definition. After the attempt, identify what was accurate and give a short correction if needed. Ask the learner to try again from a different cue. Keep rounds short and do not turn the interaction into rereading. End by asking which terms need another later attempt.`,
 explain:`Act as an explain-and-compare coach. Present two short contrasting examples related to the target concept. Ask the learner which difference matters and why before giving feedback. If the learner gives a surface feature, ask one follow-up that points toward the underlying relationship. Do not explain the concept until the learner has made an attempt. End by asking the learner to create or identify a new contrasting case.`
};
document.querySelectorAll('[data-ai-prompt-preview]').forEach(pre=>pre.textContent=examples[pre.dataset.aiPromptPreview]||'');
document.querySelectorAll('[data-copy-ai-example]').forEach(btn=>btn.addEventListener('click',()=>copy(examples[btn.dataset.copyAiExample]||'',btn.closest('.ai-example-card')?.querySelector('.copy-status')||null)));
$('remix-ai-example')?.addEventListener('click',()=>{
 const key=$('ai-example-select')?.value||'word', change=$('ai-example-change')?.value||'shorter';
 const mods={shorter:'\n\nMODIFICATION: Keep every AI response to no more than 2–3 short sentences unless the learner asks for more.',younger:'\n\nMODIFICATION: Use simpler vocabulary and shorter sentences appropriate for a younger learner. Keep the learning goal the same.',reflection:'\n\nMODIFICATION: After each practice round, ask one short reflection question: What did you notice about how you decided?',two:'\n\nMODIFICATION: Use only two practice rounds, then end with a learner summary and next-step question.'};
 const text=(examples[key]||'')+(mods[change]||'');
 const out=$('ai-remix-result');out.innerHTML=`<h4>Modified prompt</h4><pre>${esc(text)}</pre><button class="button secondary small" id="copy-ai-remix" type="button">Copy modified prompt</button><p class="status" id="ai-remix-status"></p>`;$('copy-ai-remix')?.addEventListener('click',()=>copy(text,$('ai-remix-status')));
});

// Empathy interview practice prompt
$('make-empathy-practice')?.addEventListener('click',()=>{
 const topic=($('practice-topic')?.value||'a STEM topic').trim(), level=($('practice-level')?.value||'a secondary student').trim(), difficulty=($('practice-difficulty')?.value||'a realistic learning difficulty').trim();
 const text=`Pretend you are ${level} working on ${topic}. Privately use this general difficulty to guide your answers: ${difficulty}. Do not announce the difficulty or diagnose yourself. Answer my interview questions naturally and reveal the experience gradually through specific examples. If I ask a leading question, answer naturally rather than agreeing automatically. After I say “end interview,” step out of role and give me feedback on: (1) which questions were open and neutral, (2) which questions were leading or solution-focused, (3) one follow-up I could have asked, and (4) whether I listened for evidence before guessing the cause. This is interview practice only; do not claim the simulation represents a real learner.`;
 const out=$('empathy-practice-result');out.innerHTML=`<div class="result-summary fit-high"><div><span class="result-kicker">Practice prompt</span><h3>Practice the questioning—not the diagnosis</h3></div></div><pre>${esc(text)}</pre><div class="tool-actions"><button class="button secondary small" id="copy-empathy-practice" type="button">Copy practice prompt</button></div><p class="status" id="empathy-practice-status"></p>`;$('copy-empathy-practice')?.addEventListener('click',()=>copy(text,$('empathy-practice-status')));
});

// Prompt history visual
function setHistory(step){const h=$('prompt-history');if(!h)return;const order=['first','draft1','test1','draft2','test2'];const idx=order.indexOf(step);[...h.querySelectorAll('span')].forEach((x,i)=>{x.classList.toggle('is-done',i<idx);x.classList.toggle('is-current',i===idx)});}
document.addEventListener('leaguePromptStep',e=>{setHistory(e.detail?.step||'first');if(e.detail?.step==='draft2'){const x=$('prompt-test2-cycle');if(x)x.hidden=false;}});
$('save-prompt-test2')?.addEventListener('click',()=>{const improved=($('prompt-test2-improved')?.value||'').trim(),still=($('prompt-test2-still')?.value||'').trim(),next=($('prompt-test2-next')?.value||'').trim();if(!improved&&!still){$('prompt-test2-result').innerHTML='<div class="warning-box">Record what changed before saving the comparison.</div>';return}save('promptTest2',{improved,still,next});setHistory('test2');$('prompt-test2-result').innerHTML=`<div class="result-summary fit-high"><div><span class="result-kicker">Iteration history</span><h3>Draft 1 → Test 1 → Draft 2 → Test 2</h3><p>You now have evidence about how a design change affected the interaction.</p></div></div><p><strong>What improved:</strong> ${esc(improved||'[not recorded]')}</p><p><strong>What still needs work:</strong> ${esc(still||'[not recorded]')}</p><p><strong>Possible next change:</strong> ${esc(next||'No additional change identified yet.')}</p>`;});
const saved=load(); if(saved.promptTest2)setHistory('test2'); else if(saved.promptDraft2){setHistory('draft2');const x=$('prompt-test2-cycle');if(x)x.hidden=false;} else if(saved.promptDraft1)setHistory('test1'); else if(saved.firstPrompt)setHistory('first');
})();
