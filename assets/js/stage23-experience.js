(()=>{
'use strict';
const $=s=>document.querySelector(s);
// Visual card choices inside Interview Coach.
document.querySelectorAll('[data-choice-target]').forEach(group=>{
  const target=document.getElementById(group.dataset.choiceTarget);
  group.querySelectorAll('[data-choice-value]').forEach(btn=>btn.addEventListener('click',()=>{
    if(target)target.value=btn.dataset.choiceValue;
    group.querySelectorAll('[data-choice-value]').forEach(b=>{b.classList.toggle('is-selected',b===btn);b.setAttribute('aria-pressed',b===btn?'true':'false');});
  }));
});
// Sentence starters reduce the hardest blank-page moments without replacing student thinking.
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-fill-target]'); if(!b)return;
  const field=document.getElementById(b.dataset.fillTarget); if(!field)return;
  if(!field.value.trim()) field.value=b.dataset.fillText||'';
  else if(!field.value.includes(b.dataset.fillText||'')) field.value += (field.value.endsWith(' ')?'':' ') + (b.dataset.fillText||'');
  field.focus();
});
document.querySelectorAll('[data-interview-rewrite]').forEach(btn=>btn.addEventListener('click',()=>{
  const out=document.getElementById('interview-rewrite-feedback');
  document.querySelectorAll('[data-interview-rewrite]').forEach(b=>b.classList.remove('is-correct','is-incorrect'));
  const ok=btn.dataset.correct==='true';btn.classList.add(ok?'is-correct':'is-incorrect');
  if(out)out.textContent=ok?'✓ Good choice. It asks what happens without guessing the cause or naming a solution.':'That question pushes the learner toward your explanation. Try one that leaves more room for surprise.';
}));

// Two-minute quick-build prompts.
const quickPrompts=[
  ['Make the worst vocabulary practice tool you can with one index card.','After two minutes, circle the part that makes the learner think the least.'],
  ['Turn a sheet of paper into a 60-second way to compare two ideas.','What would the learner have to notice, say, or decide?'],
  ['Use three objects near you to represent a STEM idea.','What could someone misunderstand about your representation?'],
  ['Sketch a learning tool that gives far too much help.','What could you remove so the learner has to do more of the important thinking?']
];
const qbtn=document.getElementById('quick-build-prompt'),qout=document.getElementById('quick-build-result');
qbtn?.addEventListener('click',()=>{const x=quickPrompts[Math.floor(Math.random()*quickPrompts.length)];qout.innerHTML=`<span class="quick-build-clock">2:00</span><h3>${x[0]}</h3><p>${x[1]}</p><p><strong>Use what is nearby. Do not polish it.</strong></p>`;});

// Question Detective: a short challenge, not a pop quiz. Students can change their choice after feedback.
const game=document.getElementById('neutral-question-game');
if(game){
 const rounds=[
  {q:'A learner keeps making mistakes on graph scales. Which question gives you the best clue?',a:[
    ['Would step-by-step hints help?',false,'This suggests a solution before you know what is happening.'],
    ['Show me what you look at first when you see this graph.',true,'This asks for what the learner actually does and leaves room for surprise.'],
    ['Are the tick marks confusing you?',false,'This guesses the cause instead of asking what happens.']
  ]},
  {q:'A student says, “I never remember these words.” Which follow-up is least leading?',a:[
    ['What do you usually do when you study these words?',true,'This asks about the learner’s current approach without assuming what would fix it.'],
    ['Would flashcards make you remember them?',false,'This jumps to a product before understanding the experience.'],
    ['Do you have a bad memory for vocabulary?',false,'This labels the learner instead of investigating what happens.']
  ]}
 ];
 let idx=0;
 const q=game.querySelector('[data-neutral-question]'),opts=game.querySelector('[data-neutral-options]'),fb=game.querySelector('[data-neutral-feedback]'),sc=game.querySelector('[data-neutral-score]'),next=game.querySelector('[data-neutral-next]');
 function render(){
   const r=rounds[idx];
   q.innerHTML=`<strong>Clue ${idx+1} of ${rounds.length}</strong><p>${r.q}</p>`;
   opts.innerHTML=r.a.map((x,i)=>`<button type="button" data-ng-answer="${i}">${x[0]}</button>`).join('');
   fb.innerHTML='Choose one. You can change your answer after you see the clue.';
   sc.textContent=''; next.hidden=true;
   opts.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
     const choice=r.a[Number(b.dataset.ngAnswer)];
     opts.querySelectorAll('button').forEach(x=>x.classList.remove('is-correct','is-incorrect','is-selected'));
     b.classList.add('is-selected',choice[1]?'is-correct':'is-incorrect');
     if(choice[1]){
       fb.innerHTML=`<strong>You chose:</strong> ${choice[0]}<br><strong>Why it works:</strong> ${choice[2]}`;
       next.hidden=idx>=rounds.length-1;
       if(idx===rounds.length-1) sc.textContent='Nice. Take the question bank below and move to the real interview.';
     }else{
       const strong=r.a.find(x=>x[1]);
       fb.innerHTML=`<strong>You chose:</strong> ${choice[0]}<br><strong>Why it is less useful:</strong> ${choice[2]}<br><strong>Stronger question:</strong> ${strong[0]}<br><strong>Why it is better:</strong> ${strong[2]}`;
       next.hidden=true;
     }
   }));
 }
 next.addEventListener('click',()=>{if(idx<rounds.length-1){idx++;render();}});
 render();
}
})();