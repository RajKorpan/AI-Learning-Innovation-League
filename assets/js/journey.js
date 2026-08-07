(()=>{
const KEY='leagueJourneyStateV1';
const stagePages=['student-empathize.html','student-define.html','student-ideate.html','student-prototype.html','student-test.html','student-share.html'];
const stageNames=['Empathize','Define','Ideate','Prototype','Test','Share'];
const exampleData={
  1:{
    slope:['Slope and steepness','The learner can use the slope formula when values are already given but cannot explain what slope means from a graph. The team listens and does not choose a product yet.'],
    bio:['Biology vocabulary','The learner rereads vocabulary and recognizes terms in notes but cannot recall them later without looking. The team asks what study attempts feel useful and what happens during recall.'],
    word:['Understanding word problems','The learner can perform operations once someone identifies them, but often starts calculating before deciding what the problem is asking. The team listens for how the learner interprets the question.']
  },
  2:{
    slope:['Slope and steepness','The learner can identify axes and use the formula, but the breakdown seems to be connecting rise/run as a ratio to visible steepness. The team focuses there.'],
    bio:['Biology vocabulary','The learner understands many definitions while reading but struggles when a cue is removed. The team focuses on retrieving meanings and examples from memory rather than rereading.'],
    word:['Understanding word problems','The learner can calculate accurately after a plan is identified. The breakdown seems to happen while identifying givens, unknowns, and relationships before choosing an operation.']
  },
  3:{
    slope:['Slope and steepness','Ideas include a staircase activity, a line-sorting card game, a ruler-and-whiteboard challenge, and an interactive graph. The team deliberately compares physical and digital possibilities.'],
    bio:['Biology vocabulary','Ideas include a partner retrieval game, printable question deck, sorting activity, timed self-quiz routine, and AI-generated question bank that students curate before use.'],
    word:['Understanding word problems','Ideas include a paper “givens/unknowns/relationships” mat, partner questioning routine, card sort, worked-example comparison, and a Gem that asks decomposition questions without solving.']
  },
  4:{
    slope:['Slope and steepness','The team chooses a low-tech path and builds only enough of the ruler-and-whiteboard activity to test whether a learner can connect physical steepness to rise/run.'],
    bio:['Biology vocabulary','The team uses AI to help draft varied retrieval questions, then prototypes a small paper card deck rather than building an AI application.'],
    word:['Understanding word problems','The team chooses a guided conversational-AI path and prototypes a short interaction that asks for givens, unknowns, and relationships before any operation is suggested.']
  },
  5:{
    slope:['Slope and steepness','The learner explains positive slope more clearly but still treats negative slope as simply “less steep.” The team revises the comparison activity to separate direction from steepness.'],
    bio:['Biology vocabulary','The learner enjoys the cards but guesses from familiar wording. The team revises several prompts so recall must happen from different cues and tests again later.'],
    word:['Understanding word problems','The AI sometimes asks too many questions and the learner loses track of the original problem. The team shortens the conversation and tests whether the learner can state a plan independently.']
  },
  6:{
    slope:['Slope and steepness','The team demonstrates one line comparison, explains the original breakdown, shows what changed after testing, and names negative slope as the next improvement area.'],
    bio:['Biology vocabulary','The team demonstrates the card routine, explains why retrieval—not rereading—drove the design, and shows how testing changed the question cues.'],
    word:['Understanding word problems','The team demos one short AI interaction, explains how the tool preserves the learner’s problem-solving, and shows the revision that reduced unnecessary questioning.']
  }
};

function getState(){
  try{
    const raw=localStorage.getItem(KEY);
    if(raw){
      const s=JSON.parse(raw);
      return {completed:Array.isArray(s.completed)?s.completed:[],support:s.support||'guided',buildPath:s.buildPath||'',projectLens:s.projectLens||'other'};
    }
  }catch(e){}
  return {completed:[],support:'guided',buildPath:'',projectLens:'other'};
}
function saveState(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
function firstIncomplete(s){for(let i=1;i<=6;i++)if(!s.completed.includes(i))return i;return 6;}
function supportName(v){return v==='independent'?'Independent':v==='supported'?'Supported':'Guided';}
function currentExample(){const q=new URLSearchParams(location.search).get('example');return ['slope','bio','word'].includes(q)?q:'slope';}

function updateBuildPath(s){
  document.querySelectorAll('[data-build-path]').forEach(btn=>{
    const selected=btn.dataset.buildPath===s.buildPath;
    btn.classList.toggle('is-selected',selected);
    btn.setAttribute('aria-checked',String(selected));
    btn.setAttribute('role','radio');
  });
  const out=document.querySelector('[data-build-path-output]');
  if(out){
    const data={
      a:['Path A selected','Keep the learner-facing prototype simple. Use the Prototype Planner; Prompt Builder is usually unnecessary.'],
      b:['Path B selected','Use the Prototype Planner and reveal the Prompt Builder when the learning interaction needs a guided AI conversation.'],
      c:['Path C selected','Prototype the interaction first, then use Prompt Builder as a starting point and move toward more independent prompt iteration.'],
      d:['Path D selected','Review scope and platform requirements with an advisor before building. Use advanced guidance only when the learning problem requires it.']
    };
    const x=data[s.buildPath];
    out.innerHTML=x?`<strong>${x[0]}</strong><p>${x[1]}</p>`:'<strong>No build path selected yet.</strong><p>Choose the path that best matches your current idea. You can change paths after prototyping.</p>';
  }
  document.querySelectorAll('[data-path-tool]').forEach(card=>{
    const allowed=card.dataset.pathTool.split(/\s+/);
    card.classList.toggle('is-path-relevant',!!s.buildPath&&allowed.includes(s.buildPath));
  });
}

function updateExample(){
  const main=document.querySelector('main[data-journey-stage]');
  if(!main)return;
  const n=Number(main.dataset.journeyStage), key=currentExample(), data=exampleData[n]?.[key];
  const box=document.querySelector('[data-example-thread]');
  if(box&&data)box.innerHTML=`<strong>${data[0]}</strong><p>${data[1]}</p>`;
  document.querySelectorAll('[data-example-choice]').forEach(btn=>btn.classList.toggle('is-selected',btn.dataset.exampleChoice===key));
  document.querySelectorAll('a[href]').forEach(a=>{
    const raw=a.getAttribute('href'); if(!raw)return;
    const base=raw.split('?')[0];
    if(stagePages.includes(base))a.setAttribute('href',`${base}?example=${key}`);
  });
}

function update(){
  const s=getState();
  const next=firstIncomplete(s);
  const complete=new Set(s.completed);

  document.querySelectorAll('[data-stage-status]').forEach(el=>{
    const n=Number(el.dataset.stageStatus);
    el.classList.remove('is-complete','is-current','is-preview');
    if(complete.has(n)){el.textContent='Complete';el.classList.add('is-complete');}
    else if(n===next){el.textContent=n===1?'Start here':'Up next';el.classList.add('is-current');}
    else{el.textContent='Preview';el.classList.add('is-preview');}
  });
  document.querySelectorAll('[data-stage-card]').forEach(el=>{
    const n=Number(el.dataset.stageCard);
    el.classList.toggle('is-complete',complete.has(n));
    el.classList.toggle('is-current',!complete.has(n)&&n===next);
    el.classList.toggle('is-preview',!complete.has(n)&&n!==next);
  });
  document.querySelectorAll('[data-stage-sidebar]').forEach(el=>{
    const n=Number(el.dataset.stageSidebar);
    el.classList.toggle('is-complete',complete.has(n));
  });
  document.querySelectorAll('[data-journey-complete-count]').forEach(el=>el.textContent=`${complete.size} of 6 complete`);
  document.querySelectorAll('[data-journey-next-label]').forEach(el=>el.textContent=complete.size===6?'Journey complete — revisit any stage':`Next: ${stageNames[next-1]}`);
  document.querySelectorAll('[data-resume-link]').forEach(el=>{
    el.href=stagePages[next-1];
    el.textContent=complete.size===0?'Start Stage 1':complete.size===6?'Review your journey':`Resume: ${stageNames[next-1]}`;
  });
  document.querySelectorAll('[data-support-label]').forEach(el=>el.textContent=supportName(s.support));
  document.querySelectorAll('[data-project-lens-label]').forEach(el=>el.textContent=s.projectLens==='self'?'Help myself learn':'Help someone else learn');
  document.querySelectorAll('[data-project-lens-subject]').forEach(el=>el.textContent=s.projectLens==='self'?'I':'The learner');
  document.querySelectorAll('[data-project-lens]').forEach(el=>{
    const selected=el.dataset.projectLens===s.projectLens;
    el.classList.toggle('is-selected',selected);
    el.setAttribute('aria-checked',String(selected));
    el.setAttribute('role','radio');
  });
  document.body.dataset.projectLens=s.projectLens;
  document.querySelectorAll('[data-support-choice]').forEach(el=>{
    const selected=el.dataset.supportChoice===s.support;
    el.classList.toggle('is-selected',selected);
    el.setAttribute('aria-checked',String(selected));
    el.setAttribute('role','radio');
  });
  document.body.dataset.supportMode=s.support;
  document.querySelectorAll('[data-complete-stage]').forEach(btn=>{
    const n=Number(btn.dataset.completeStage);
    if(complete.has(n)){btn.textContent=`Stage ${n} complete ✓`;btn.classList.add('is-complete');}
    else{btn.textContent=`Mark Stage ${n} complete`;btn.classList.remove('is-complete');}
  });
  updateBuildPath(s);
  updateExample();
}

document.querySelectorAll('[data-project-lens]').forEach(btn=>btn.addEventListener('click',()=>{
  const s=getState(); s.projectLens=btn.dataset.projectLens; saveState(s); update();
}));
document.querySelectorAll('[data-support-choice]').forEach(btn=>btn.addEventListener('click',()=>{
  const s=getState(); s.support=btn.dataset.supportChoice; saveState(s); update();
}));
document.querySelectorAll('[data-build-path]').forEach(btn=>btn.addEventListener('click',()=>{
  const s=getState(); s.buildPath=btn.dataset.buildPath; saveState(s); update();
}));
document.querySelectorAll('[data-complete-stage]').forEach(btn=>btn.addEventListener('click',()=>{
  const n=Number(btn.dataset.completeStage),s=getState();
  if(!s.completed.includes(n))s.completed.push(n);
  s.completed=s.completed.sort((a,b)=>a-b); saveState(s); update();
  const msg=document.querySelector('[data-stage-completion-message]');
  if(msg)msg.textContent=n<6?`Stage ${n} saved as complete. Stage ${n+1} is now your next stage.`:'Stage 6 saved as complete. Your journey map now shows all six stages complete.';
}));
document.querySelectorAll('[data-reset-journey]').forEach(btn=>btn.addEventListener('click',()=>{
  if(confirm('Reset stage completion, support level, and build path for this browser?')){localStorage.removeItem(KEY);update();}
}));
document.querySelectorAll('[data-example-choice]').forEach(btn=>btn.addEventListener('click',()=>{
  const u=new URL(location.href); u.searchParams.set('example',btn.dataset.exampleChoice); history.replaceState(null,'',u); updateExample();
}));

update();
})();
