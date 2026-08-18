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
const exampleMoments={"1":{"slope":{"learn":["Slope and steepness","Knowing the slope formula is not the same as understanding what slope means. The team decides to look for evidence about how the learner connects the ratio to a graph."],"interview-coach":["A neutral question","“Show me what you look at first when you see a graph like this.” The team avoids asking, “Do the rise and run confuse you?”"],"practice":["What the team carries forward","The learner can substitute numbers into the formula, but says the graph itself still feels disconnected from the calculation."]},"bio":{"learn":["Biology vocabulary","Recognizing a term while rereading notes is different from being able to retrieve its meaning later. The team wants evidence about what happens when the notes are removed."],"interview-coach":["A neutral question","“How do you usually study these terms, and what happens when you try to remember them later without looking?”"],"practice":["What the team carries forward","The learner rereads and highlights often, but rarely practices retrieving a definition or example from memory."]},"word":{"learn":["Word problems","Getting the operation after someone points it out is different from independently making sense of the problem. The team listens for what happens before calculation begins."],"interview-coach":["A neutral question","“Walk me through what you do from the moment you read the problem until you decide what to calculate.”"],"practice":["What the team carries forward","The learner often starts calculating immediately and has trouble identifying the unknown and the relationships first."]}},"2":{"slope":{"breakdown-mapper":["Task map","Read axes → identify two points → compare rise and run → connect the ratio to steepness → calculate. The first major change appears when the learner must connect rise/run to the visual line."],"evidence-tracker":["Claim + evidence","Claim: the learner treats slope as a formula rather than a relationship. Evidence: interview explanation + task work on two graphs."],"focused-statement":["Focused challenge","Help the learner connect rise/run as a ratio to visible steepness before relying on the slope formula."]},"bio":{"breakdown-mapper":["Task map","Read term → recognize definition → close notes → retrieve meaning → use in an example. Performance changes when the cue disappears."],"evidence-tracker":["Claim + evidence","Claim: rereading is producing familiarity but not reliable retrieval. Evidence: study routine + delayed recall attempt."],"focused-statement":["Focused challenge","Help the learner retrieve a term’s meaning and example from memory after a delay."]},"word":{"breakdown-mapper":["Task map","Read → identify givens → identify unknown → identify relationships → choose representation/operation → calculate. The breakdown appears before operation selection."],"evidence-tracker":["Claim + evidence","Claim: the learner needs support decomposing the situation before calculation. Evidence: think-aloud + correct calculations once a plan is supplied."],"focused-statement":["Focused challenge","Help the learner identify givens, unknowns, and relationships before choosing an operation."]}},"3":{"slope":{"strategy-explorer":["Strategy idea","Comparison and representation interpretation rise to the top: the learner needs to compare lines and connect a visual feature to a numerical relationship."],"resource-inventor":["Resources become design material","Whiteboard + ruler + classroom stairs + partner = a physical steepness challenge before any digital graphing."],"idea-board":["Five possibilities","Line-sorting cards, staircase measurement, whiteboard challenge, partner “build a slope,” and an interactive graph. The team does not choose yet."]},"bio":{"strategy-explorer":["Strategy idea","Retrieval practice is a strong fit because the learner recognizes terms while looking but struggles when the cue is removed."],"resource-inventor":["Resources become design material","Index cards + partner + class notes + AI for drafting = a question deck whose prompts are checked by students before use."],"idea-board":["Five possibilities","Partner challenge, printable deck, sorting game, five-minute routine, and AI-generated question bank curated into a non-AI activity."]},"word":{"strategy-explorer":["Strategy idea","Task decomposition and metacognitive monitoring fit because the learner needs a repeatable way to pause and identify the structure of the problem."],"resource-inventor":["Resources become design material","Paper mat + highlighters + partner + optional AI = multiple ways to practice givens/unknowns/relationships."],"idea-board":["Five possibilities","Paper organizer, partner question routine, card sort, worked-example comparison, and a Gem that asks decomposition questions without solving."]}},"4":{"slope":{"choose-build":["Product choice","A physical/interactive activity scores higher than conversational AI because the learning target depends on seeing and measuring relationships."],"prototype-planner":["Smallest useful version","Three lines, one ruler, and one prediction/measurement sequence are enough to test the central interaction."],"prompt-builder":["AI branch?","The team skips Prompt Builder. AI is not needed for the learner-facing activity; it might only help generate additional examples later."]},"bio":{"choose-build":["Product choice","An AI-assisted non-AI product fits: AI can help vary question prompts, while the learner-facing routine can stay as a simple card challenge."],"prototype-planner":["Smallest useful version","Create 12 cards across three terms and test whether the prompts produce actual retrieval rather than recognition."],"prompt-builder":["AI branch?","The team skips the conversational builder because AI is helping create materials, not interacting directly with the learner."]},"word":{"choose-build":["Product choice","Conversational AI may fit because the desired interaction is a flexible sequence of questions that responds to the learner’s reasoning."],"prototype-planner":["Smallest useful version","Prototype only 4–5 turns: identify unknown → givens → relationship → learner states a plan."],"prompt-builder":["Prompt learning","The first prompt says “help me solve word problems.” The guided version adds boundaries: ask before telling, preserve the learner’s plan-making, and stop before solving."]}},"5":{"slope":{"testing-tool":["Test plan","Ask the learner to compare two unfamiliar lines, explain which is steeper, then measure rise/run. Observe whether the visual explanation changes."],"testing-ladder":["What happens","The learner handles positive slopes but says a negative line is simply “less steep.” That becomes the next design issue."],"advisor-check":["Revision","Separate direction from steepness and add a comparison that includes positive and negative lines before retesting."]},"bio":{"testing-tool":["Test plan","Use a small card set, wait between rounds, and ask for definitions and examples without notes. Observe guessing, retrieval time, and explanations."],"testing-ladder":["What happens","The learner gets many cards right but relies on familiar wording. A changed cue causes performance to drop."],"advisor-check":["Revision","Vary the cues and examples so success requires retrieval of meaning, not recognition of one phrase."]},"word":{"testing-tool":["Test plan","Give one unfamiliar word problem and observe whether the learner can state givens, unknown, and relationships before choosing an operation."],"testing-ladder":["What happens","The AI asks too many follow-up questions and the learner loses track of the original problem."],"advisor-check":["Revision","Shorten the conversation and require the learner to summarize the plan after only a few prompts."]}},"6":{"slope":{"share-builder":["Project story","The team explains that the learner could calculate slope but did not connect the ratio to visible steepness. Testing revealed a separate issue with negative direction."],"demo":["Focused demo","Audience members predict which of two lines is steeper, then watch the team connect the physical rise/run measurement to the ratio."],"advisor-check":["Evidence-sized claim","“Our learner connected positive steepness to rise/run more independently after revision; negative slope needs more testing.”"]},"bio":{"share-builder":["Project story","The team explains why recognition during rereading was not the same as later recall and why retrieval practice shaped the card design."],"demo":["Focused demo","Run one card round showing recall, feedback, and a changed cue rather than displaying the entire deck."],"advisor-check":["Evidence-sized claim","“Varying the cues reduced recognition-only success in our small retest; we need longer-term testing to know what is retained.”"]},"word":{"share-builder":["Project story","The team explains that calculation was not the original bottleneck; planning the problem was. The conversational design therefore asks decomposition questions instead of solving."],"demo":["Focused demo","Show one short interaction where the learner identifies givens, unknown, and relationship and then states a plan."],"advisor-check":["Evidence-sized claim","“After shortening the prompt sequence, our tester stated a plan with less prompting in the second test; we have only tested a small number of problems.”"]}}};

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
      a:['Build Path 1 selected','AI may help the team design or create materials, while the learner-facing experience can stay physical, social, printable, or otherwise simple.'],
      b:['Build Path 2 selected','Build a reusable conversational AI learning tool only when responsive questioning or feedback adds useful capability.'],
      c:['Build Path 3 selected','Advanced build is optional. Review scope, platform, privacy, access, and technical readiness with an advisor before investing in development.']
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
  document.querySelectorAll('[data-example-moment]').forEach(el=>{
    const moment=el.dataset.exampleMoment, item=exampleMoments[n]?.[key]?.[moment];
    if(!item)return;
    const title=el.querySelector('h3'), p=el.querySelector('p');
    if(title)title.textContent=item[0];
    if(p)p.textContent=item[1];
  });
  document.querySelectorAll('[data-example-choice]').forEach(btn=>btn.classList.toggle('is-selected',btn.dataset.exampleChoice===key));
  document.querySelectorAll('a[href]').forEach(a=>{
    const raw=a.getAttribute('href'); if(!raw)return;
    const base=raw.split('?')[0].split('#')[0];
    if(stagePages.includes(base)){
      const hash=raw.includes('#')?'#'+raw.split('#')[1].split('?')[0]:'';
      a.setAttribute('href',`${base}?example=${key}${hash}`);
    }
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
    else{el.textContent='Coming later';el.classList.add('is-preview');}
  });
  document.querySelectorAll('[data-stage-card]').forEach(el=>{
    const n=Number(el.dataset.stageCard);
    el.classList.toggle('is-complete',complete.has(n));
    el.classList.toggle('is-current',!complete.has(n)&&n===next);
    el.classList.toggle('is-preview',!complete.has(n)&&n!==next);
  });
  document.querySelectorAll('[data-process-stage]').forEach(el=>{const n=Number(el.dataset.processStage);el.classList.toggle('is-complete',complete.has(n));el.classList.toggle('is-current',!complete.has(n)&&n===next);});
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

document.querySelectorAll('.stage-quick-challenge').forEach(card=>{
  const feedback=card.querySelector('[data-quiz-feedback]');
  card.querySelectorAll('[data-quiz-option]').forEach(btn=>btn.addEventListener('click',()=>{
    const correct=btn.dataset.correct==='true';
    card.querySelectorAll('[data-quiz-option]').forEach(b=>{b.classList.remove('is-correct','is-incorrect');b.setAttribute('aria-pressed','false');});
    btn.classList.add(correct?'is-correct':'is-incorrect'); btn.setAttribute('aria-pressed','true');
    if(feedback)feedback.textContent=correct?`✓ ${feedback.dataset.correctFeedback}`:`Not quite. Look for the choice that focuses on evidence about learning rather than assumptions, polish, or technology.`;
  }));
});

update();
})();
