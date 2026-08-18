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

// Question Detective: several rounds, immediate feedback, retry.
const game=document.getElementById('neutral-question-game');
if(game){
 const rounds=[
  {q:'A learner keeps making mistakes on graph scales. What do you ask first?',a:[['Would step-by-step hints help?',false],['Show me what you look at first when you see this graph.',true],['Are the tick marks confusing you?',false]],why:'The neutral question asks for observable behavior before naming a cause or solution.'},
  {q:'A student says, “I never remember these words.” Which follow-up is strongest?',a:[['What do you usually do when you study these words?',true],['Would flashcards make you remember them?',false],['Do you have a bad memory for vocabulary?',false]],why:'Ask about what the learner actually does. Avoid proposing a product or labeling ability.'},
  {q:'A teacher says students are “not motivated.” What question gives you better evidence?',a:[['Why are they unmotivated?',false],['Would a game motivate them?',false],['Can you describe a recent moment when students stopped or changed what they were doing?',true]],why:'A recent example gives you something you can investigate instead of treating a broad interpretation as the cause.'}
 ];
 let idx=0,score=0,attempts=0;
 const q=game.querySelector('[data-neutral-question]'),opts=game.querySelector('[data-neutral-options]'),fb=game.querySelector('[data-neutral-feedback]'),sc=game.querySelector('[data-neutral-score]'),next=game.querySelector('[data-neutral-next]');
 function render(){const r=rounds[idx];q.innerHTML=`<strong>Round ${idx+1}</strong><p>${r.q}</p>`;opts.innerHTML=r.a.map((x,i)=>`<button type="button" data-ng-answer="${i}" data-correct="${x[1]}">${x[0]}</button>`).join('');fb.textContent='Choose an answer.';next.hidden=true;opts.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{if(opts.dataset.answered==='1')return;opts.dataset.answered='1';attempts++;const ok=b.dataset.correct==='true';if(ok)score++;b.classList.add(ok?'is-correct':'is-incorrect');if(!ok){opts.querySelector('button[data-correct="true"]')?.classList.add('is-correct');}fb.textContent=(ok?'✓ ':'Not quite. ')+r.why;sc.textContent=`Score: ${score} / ${attempts}`;next.hidden=idx>=rounds.length-1;}));}
 next.addEventListener('click',()=>{if(idx<rounds.length-1){idx++;delete opts.dataset.answered;render();}});render();
}
})();