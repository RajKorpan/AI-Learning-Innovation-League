(function(root, factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.LeagueClubPlanner=api;
  if(typeof document!=='undefined'){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>api.init());
    else api.init();
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const LABELS={
    grade:{'upper-elementary':'Upper elementary (grades 4–5)','middle':'Middle school (grades 6–8)','high':'High school (grades 9–12)','mixed':'Mixed grade band'},
    experience:{'new':'Mostly new to design and AI','mixed':'Mixed experience','experienced':'Prior design or AI project experience'},
    adults:{'one':'One advisor','two':'Two adults or co-advisors','tech-mentor':'Advisor plus technical mentor','multiple':'Multiple classroom adults or mentors'},
    lessonPattern:{'one':'One 45-minute session per lesson','two':'Two 45-minute sessions per lesson'}
  };
  const LESSONS=[
    {n:1,title:'Empathize',subtitle:'Understand the Challenge',href:'lesson-empathize.html'},
    {n:2,title:'Define',subtitle:'Find the Breakdown',href:'lesson-define.html'},
    {n:3,title:'Ideate',subtitle:'Invent Possibilities',href:'lesson-ideate.html'},
    {n:4,title:'Prototype',subtitle:'Build Something Small',href:'lesson-prototype.html'},
    {n:5,title:'Test + Share',subtitle:'Learn From Use and Tell the Story',href:'lesson-test.html'}
  ];

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const label=(group,key)=>(LABELS[group]&&LABELS[group][key])||key;
  const has=(cfg,v)=>cfg.supports.includes(v);
  const add=(arr,v)=>{if(v&&!arr.includes(v))arr.push(v)};
  const priority=(arr,level,text,reason)=>{if(!arr.some(x=>x.text===text))arr.push({level,text,reason})};
  const clientReady=cfg=>['Advisor is the teacher-client','Another teacher is identified and available'].includes(cfg.client);

  function normalize(raw){
    return {
      teamSize:Math.max(1,Math.min(40,Number(raw.teamSize)||1)),
      grade:raw.grade||'high',
      experience:raw.experience||'new',
      format:raw.format||'Small-group team',
      lessonPattern:raw.lessonPattern||'one',
      adults:raw.adults||'one',
      client:raw.client||'Advisor is the teacher-client',
      tech:raw.tech||'Not yet confirmed',
      family:raw.family||'Not yet started',
      access:(raw.access||'').trim(),
      supports:Array.from(new Set(raw.supports||[]))
    };
  }

  function parseAccessNeeds(text){
    const raw=(text||'').toLowerCase(), out=[];
    const push=(category,recommendation)=>{if(!out.some(x=>x.category===category))out.push({category,recommendation})};
    const any=terms=>terms.some(t=>raw.includes(t));
    if(any(['language','translation','interpreter','multilingual','bilingual','english learner','ell','esl'])) push('Language access','Use plain language, translated or bilingual materials when available, interpretation when needed, and more than one way for students to respond.');
    if(any(['reading','dyslexia','literacy','text','comprehension'])) push('Reading access','Chunk directions, use readable formatting, model examples, offer read-aloud or audio access when appropriate, and check understanding of the task separately from reading difficulty.');
    if(any(['visual','blind','low vision','screen reader','color blind','colour blind'])) push('Visual access','Use strong contrast, meaningful labels, alt text or verbal description, keyboard access, and a nonvisual way to receive the same information.');
    if(any(['hearing','deaf','hard of hearing','caption','transcript'])) push('Hearing access','Provide captions or transcripts, written directions, clear turn-taking, and visual access to questions and feedback.');
    if(any(['motor','mobility','fine motor','wheelchair','keyboard','mouse'])) push('Motor and physical access','Provide keyboard-operable or low-motor alternatives, accessible room setup, flexible positioning, and additional time when needed.');
    if(any(['adhd','attention','executive','autism','cognitive','memory','processing','anxiety','break'])) push('Cognitive and participation access','Use predictable agendas, small task chunks, models, checklists, breaks, quiet participation options, and flexible response formats.');
    if(any(['device','internet','wifi','computer','tablet','phone','technology'])) push('Device and connectivity access','Keep a paper or offline pathway, allow shared-device use where appropriate, and avoid making home internet a requirement.');
    if(any(['schedule','work','job','caregiving','religious','time','after school','afterschool','transport','travel','bus','subway','ride'])) push('Scheduling and participation access','Use predictable dates, advance notice, flexible contribution options, and an alternative when transportation or after-school participation is a barrier.');
    return out;
  }

  function teamStructure(cfg){
    if(cfg.format==='One-on-one') return {count:1,text:'one student working with the advisor',roles:['Have the student rotate through Listen, Learning, Design, Test, and Share responsibilities across the five lessons.','Bring in another learner, teacher, peer, or reviewer at checkpoints so the project is not designed from only one perspective.']};
    const ideal=cfg.format==='Classroom integration'?5:cfg.format==='Virtual club'?4:5;
    const count=Math.max(1,Math.ceil(cfg.teamSize/ideal));
    const low=Math.floor(cfg.teamSize/count), high=Math.ceil(cfg.teamSize/count);
    const text=count===1?`${cfg.teamSize} students in one project team`:`${count} project teams of about ${low}–${high} students`;
    const roles=[];
    if(cfg.teamSize<=5&&count===1) roles.push('Use the five flexible roles—Listen, Learning, Design, Test, and Share—and rotate or overlap them so every student can explain the whole project.');
    else roles.push('Use the five flexible roles within each project team and rotate high-status work such as building, testing, and presenting.');
    if(cfg.grade==='mixed') roles.push('In mixed-age groups, older students may model a process, but younger students should still make meaningful design decisions and speak about the project.');
    return {count,text,roles};
  }

  function formatRecommendations(cfg,teams,priorities){
    const out=[];
    switch(cfg.format){
      case 'Small-group team':
        out.push('Use one shared project per team and keep a visible team decision log so the work does not fragment into separate individual products.');
        if(cfg.teamSize>6) priority(priorities,'strong',`Split the group into ${teams.count} smaller project teams.`,`A single group of ${cfg.teamSize} students makes interviewing, prototyping, testing, and ownership harder to distribute.`);
        break;
      case 'One-on-one':
        out.push('Keep the student in charge of interviews, problem definition, design choices, testing observations, and presentation. The advisor should prompt rather than take over.');
        if(cfg.teamSize!==1) priority(priorities,'required','Use one student for the one-on-one format or choose a group format.','The selected format and number of students do not match.');
        break;
      case 'Classroom integration':
        out.push(`Plan for approximately ${teams.count} project teams, common lesson milestones, and cross-team critique at Define, Prototype, and Test.`);
        out.push('Use a small set of teacher-client challenges or allow each team to work from a teacher perspective that can be revisited during the five lessons.');
        break;
      case 'Virtual club':
        out.push('Use a shared project document, explicit agendas, optional camera use, clear turn-taking, and asynchronous contribution options.');
        if(!has(cfg,'Devices and internet')) priority(priorities,'required','Confirm equitable device and internet access or choose another format.','The virtual format depends on reliable access or an equivalent offline pathway.');
        break;
      case 'Lunch or after-school club':
        out.push('Keep the meeting routine predictable and use the 45-minute lesson plan unless the group has two dedicated meetings for each lesson.');
        out.push('Prepare materials before students arrive so short sessions are spent on learning design rather than account setup or logistics.');
        break;
    }
    return out;
  }

  function gradeAndExperience(cfg,priorities){
    const out=[];
    if(cfg.grade==='upper-elementary'){
      out.push('Use short directions, concrete examples, visible checklists, structured roles, and paper-first prototyping.');
      if(['Gem or chatbot building available','Advanced application development available'].includes(cfg.tech)) priority(priorities,'required','Verify age, account, school, and family requirements before students use the selected building platform.','Younger students may need adult-managed access or a paper simulation instead of independent accounts.');
    } else if(cfg.grade==='middle') out.push('Use structured templates and role rotation while leaving the core learning problem, strategy, and product decisions with students.');
    else if(cfg.grade==='high') out.push('Expect students to explain their reasoning, compare alternatives, document revisions, and take the lead in testing and presentation with advisor approval.');
    else out.push('Use age-appropriate scaffolds within the same team and prevent older students from becoming the permanent builders or presenters.');

    if(cfg.experience==='new'){
      out.push('Model one small example before students begin and keep the first project to one learning breakdown, one main strategy, and one small prototype.');
      if(cfg.lessonPattern==='one'&&cfg.tech==='Advanced application development available') priority(priorities,'strong','Use a simpler prototype during the five-lesson pilot.','Five 45-minute sessions should prioritize empathy, learning analysis, testing, and revision rather than full application development.');
    } else if(cfg.experience==='mixed') out.push('Pair experienced and newer students for modeling, but rotate roles so technical experience does not become permanent control of the project.');
    else out.push('Increase challenge through better evidence, comparison of prototype versions, edge cases, and more independent reasoning—not just more features.');
    return out;
  }

  function adultRecommendations(cfg,teams,priorities){
    const out=[];
    const capacity={one:2,two:4,'tech-mentor':3,multiple:6}[cfg.adults]||2;
    if(cfg.adults==='one') out.push('Use common checkpoints, peer critique, and a visible help queue so one advisor is not the only source of feedback.');
    if(cfg.adults==='two') out.push('Divide attention between facilitation and logistics/access/technology, while using the same student-facing expectations.');
    if(cfg.adults==='tech-mentor') out.push('Keep educational, privacy, and accessibility decisions with the advisor; the technical mentor supports feasibility and debugging.');
    if(cfg.adults==='multiple') out.push('Assign clear adult roles and use one shared set of lesson goals so students do not receive conflicting directions.');
    if(teams.count>capacity) priority(priorities,'required','Reduce the number of simultaneously active teams or add adult support.',`The selected adult support is unlikely to cover ${teams.count} teams during interviews, tool use, testing, and checkpoints.`);
    if(cfg.adults==='one'&&cfg.teamSize>12) priority(priorities,'strong','Add another adult or reduce the number of students in this pilot cycle.','One advisor will have difficulty giving timely attention to multiple teams during testing and accessibility decisions.');
    return out;
  }

  function technologyRecommendations(cfg,priorities){
    const out=[];
    if(cfg.tech==='Paper and low-tech only') out.push('Use paper, cards, role-play, printed materials, and physical prototypes. AI can still be discussed or used by the advisor for demonstrations without becoming the student product.');
    else if(cfg.tech==='Approved AI assistant available') out.push('Use AI for brainstorming, critique, examples, or draft materials only when it supports the learning goal. Students should verify outputs and keep identifiable learner information out of prompts.');
    else if(cfg.tech==='Gem or chatbot building available') out.push('Begin with a paper conversation or prompt skeleton before opening the platform. Define what the AI should do, what it should not do, and how students will test it.');
    else if(cfg.tech==='Advanced application development available'){
      out.push('Require a low-resolution learning interaction before coding. Advanced development should be optional and should not displace testing or reflection on how learning works.');
      if(!has(cfg,'Technical support')) priority(priorities,'required','Add technical support or choose a simpler build path.','Advanced development without support can consume the time needed for the learning-design process.');
    } else {
      out.push('Begin with paper-first work and confirm approved tools, accounts, privacy, accessibility, and sharing settings before students use digital platforms.');
      priority(priorities,'required','Confirm the technology plan before students enter accounts, upload content, or build a digital prototype.','The first lessons can begin while technology decisions are being finalized.');
    }
    if(cfg.tech!=='Paper and low-tech only'&&cfg.tech!=='Not yet confirmed'&&!has(cfg,'Devices and internet')) priority(priorities,'required','Confirm equitable device and internet access or change the technology plan.','The selected technology depends on devices or connectivity that are not marked as available.');
    return out;
  }

  function stakeholderRecommendations(cfg,priorities){
    const out=[];
    if(cfg.client==='Advisor is the teacher-client') out.push('Use a real challenge from your own teaching. During Empathize, describe what you observe and what successful performance looks like, but let students determine the eventual solution.');
    else if(cfg.client==='Another teacher is identified and available') out.push('Schedule the teacher-client for an early Empathize conversation and a later prototype or testing check-in. Brief them to describe the need rather than choose the product.');
    else if(cfg.client==='Potential teacher-client identified'){
      out.push('Confirm the teacher-client before students finalize the learning problem.');
      priority(priorities,'strong','Confirm the teacher-client before Lesson 2 is completed.','Students need an authentic instructional perspective before they lock the problem definition.');
    } else {
      out.push('Identify either yourself or another teacher as the teacher-client before students finalize the problem.');
      priority(priorities,'required','Identify the teacher-client before Lesson 2 is completed.','The project should be anchored in a real learning challenge rather than a preselected app idea.');
    }
    if(cfg.family==='Information sent') out.push('Follow up with confirmed timing, access needs, testing expectations, and sharing-event information as those details become available.');
    else if(cfg.family==='Draft prepared'){
      out.push('Send the family communication before interviews, learner testing, or account-based tool use.');
      priority(priorities,'strong','Send the prepared family communication.','Families need a clear explanation of the League, AI use, privacy expectations, support options, and participation.');
    } else {
      out.push('Prepare a plain-language family message explaining what students will do, how AI may or may not be used, privacy expectations, and how families can request support.');
      priority(priorities,'required','Complete family communication before interviews, learner testing, or public sharing.','Family communication is part of the advisor role and should not be left until the event.');
    }
    if(!has(cfg,'Peer learners or testers')) priority(priorities,'strong','Identify an appropriate peer learner or another approved testing pathway before Lesson 5.','Students need someone appropriate to test with if they are going to make claims about usability or learning behavior.');
    return out;
  }

  function accessRecommendations(cfg,priorities){
    const out=[];
    const parsed=parseAccessNeeds(cfg.access);
    if(!cfg.access||/^(none|n\/a|na|not known|to be determined)/i.test(cfg.access)) out.push('Ask students and families about access, language, device, scheduling, and participation needs before finalizing how the lessons will run. An empty field should not be treated as evidence that no support is needed.');
    else out.push('Confirm the stated needs directly with the student or family and ask what support is actually helpful.');
    parsed.forEach(x=>out.push(`${x.category}: ${x.recommendation}`));
    if(cfg.access&&!has(cfg,'Accessibility support')) priority(priorities,'strong','Identify who will help coordinate the stated accessibility or participation needs.','Needs are listed, but accessibility support is not marked as available.');
    if(parsed.some(x=>x.category==='Language access')&&!has(cfg,'Translation or interpretation')) priority(priorities,'strong','Confirm translation or interpretation support.','Language access is mentioned, but translation or interpretation is not marked as available.');
    if(cfg.format!=='Virtual club'&&!has(cfg,'Meeting space')) priority(priorities,'required','Confirm an accessible meeting space.','The selected format depends on a physical meeting location that is not marked as available.');
    if(!has(cfg,'Paper prototyping materials')) priority(priorities,'strong','Prepare basic paper prototyping materials.','Paper, cards, sticky notes, and markers are useful even when the eventual product is digital.');
    return out;
  }

  function lessonPatternRecommendations(cfg,priorities){
    const out=[];
    if(cfg.lessonPattern==='one'){
      out.push('Use the 45-minute Lesson Plan on each facilitator page. Keep each team focused on one learning breakdown and one small prototype question.');
      out.push('Protect a small amount of between-session time for scheduling interviews, finishing a prototype, or preparing a test when needed.');
      if(cfg.experience==='new') priority(priorities,'helpful','Use the examples and support options built into each lesson.','The single-session version moves quickly, so new teams benefit from stronger scaffolding and a tightly bounded project.');
      if(cfg.teamSize>12) priority(priorities,'strong','Use smaller teams and common checkpoints, or add another adult.','The five 45-minute sessions leave limited time for one advisor to troubleshoot many groups individually.');
    } else {
      out.push('Use the 90-minute Lesson Plan on each facilitator page. It is already divided into two 45-minute sessions.');
      out.push('Use Session 1 for teaching, modeling, and first attempts; use Session 2 for deeper student work, feedback, and the stage checkpoint.');
      out.push('The second session is additional working time within the same five-lesson sequence, not a separate curriculum.');
    }
    return out;
  }

  function buildPlan(raw){
    const cfg=normalize(raw), priorities=[], assumptions=[];
    const teams=teamStructure(cfg);
    const formatRecs=formatRecommendations(cfg,teams,priorities);
    const studentRecs=gradeAndExperience(cfg,priorities);
    const adultRecs=adultRecommendations(cfg,teams,priorities);
    const techRecs=technologyRecommendations(cfg,priorities);
    const stakeholderRecs=stakeholderRecommendations(cfg,priorities);
    const accessRecs=accessRecommendations(cfg,priorities);
    const lessonRecs=lessonPatternRecommendations(cfg,priorities);
    const contact=cfg.lessonPattern==='one'?{sessions:5,hours:3.75,text:'5 × 45-minute sessions (about 3.75 contact hours)'}:{sessions:10,hours:7.5,text:'10 × 45-minute sessions across five lessons (about 7.5 contact hours)'};

    if(!has(cfg,'Protected project work time')) priority(priorities,'strong','Protect project work time during or between lesson meetings.','Students need reliable time for interviews, prototyping, testing, and revision inside the five-lesson sequence.');
    if(!clientReady(cfg)) add(assumptions,'The project problem should remain provisional until a teacher-client is confirmed.');
    if(cfg.tech==='Not yet confirmed') add(assumptions,'Begin paper-first until an approved technology plan is confirmed.');

    const required=priorities.filter(x=>x.level==='required').length;
    const strong=priorities.filter(x=>x.level==='strong').length;
    const status=required?{level:'blocked',label:'Setup required',title:'Complete key setup before interviews, digital building, learner testing, or public sharing.',summary:`The planner identified ${required} required action${required===1?'':'s'} and ${strong} strong recommendation${strong===1?'':'s'}. You can still begin preparation while those items are resolved.`}:strong?{level:'adjust',label:'Ready with adjustments',title:'The five-lesson plan is workable with a few adjustments.',summary:`The planner identified ${strong} strong recommendation${strong===1?'':'s'} but no launch-blocking conflict.`}:{level:'ready',label:'Ready to begin',title:'Your selections support a feasible five-lesson starting plan.',summary:'Continue to confirm school requirements and student/family needs as the group moves through the lessons.'};
    const order={required:0,strong:1,helpful:2}; priorities.sort((a,b)=>order[a.level]-order[b.level]);

    return {cfg,status,teams,contact,formatRecs,studentRecs,adultRecs,techRecs,stakeholderRecs,accessRecs,lessonRecs,priorities,assumptions};
  }

  function listHtml(items){return items&&items.length?`<ul class="check-list">${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="plan-empty">No additional recommendation.</p>'}
  function sectionHtml(title,items,note=''){return `<section class="plan-section"><h3>${esc(title)}</h3>${note?`<p class="plan-note">${esc(note)}</p>`:''}${listHtml(items)}</section>`}

  function toHtml(plan){
    const c=plan.cfg;
    const config=[
      ['Students',c.teamSize],['Grade band',label('grade',c.grade)],['Experience',label('experience',c.experience)],['Club format',c.format],['Teacher-client',c.client],['Technology',c.tech],['Family communication',c.family],['Lesson schedule','Five-week / five-lesson sequence'],['Lesson length',label('lessonPattern',c.lessonPattern)],['Estimated contact time',plan.contact.text]
    ].map(([k,v])=>`<div><small>${esc(k)}</small><strong>${esc(v)}</strong></div>`).join('');
    const lessonCards=LESSONS.map(l=>`<a class="plan-lesson-link" href="${l.href}"><span>${l.n}</span><div><strong>Lesson ${l.n} · ${esc(l.title)}</strong><small>${esc(l.subtitle)} · Use the ${c.lessonPattern==='one'?'45-minute':'90-minute / two-session'} plan</small></div></a>`).join('');
    const pri=plan.priorities.length?plan.priorities.map(p=>`<div class="plan-priority ${esc(p.level)}"><strong>${p.level==='required'?'Required':p.level==='strong'?'Strong recommendation':'Helpful'}: ${esc(p.text)}</strong><span>${esc(p.reason)}</span></div>`).join(''):'<p class="plan-empty">No major setup conflict was identified.</p>';
    return `
      <section class="plan-status-card ${esc(plan.status.level)}"><span class="plan-status-label">${esc(plan.status.label)}</span><h3>${esc(plan.status.title)}</h3><p>${esc(plan.status.summary)}</p></section>
      <section class="plan-section"><h3>Your setup</h3><div class="plan-config">${config}</div><h4>Available supports</h4>${listHtml(c.supports)}${c.access?`<h4>Access or participation needs you entered</h4><p>${esc(c.access)}</p>`:''}</section>
      <section class="plan-section"><h3>Recommended team structure</h3><p class="plan-note">${esc(plan.teams.text)}</p>${listHtml(plan.teams.roles)}</section>
      ${sectionHtml('How to run the selected format',plan.formatRecs)}
      ${sectionHtml('Scaffolding for this group',plan.studentRecs)}
      ${sectionHtml('Adult facilitation',plan.adultRecs)}
      ${sectionHtml('Technology and building',plan.techRecs)}
      ${sectionHtml('Teacher-client and family communication',plan.stakeholderRecs)}
      ${sectionHtml('Accessibility and participation',plan.accessRecs)}
      ${sectionHtml('Using the five-lesson schedule',plan.lessonRecs)}
      <section class="plan-section"><h3>Go to the five facilitator lessons</h3><p class="plan-note">The planner does not create a separate calendar. Use these lesson pages as the implementation sequence.</p><div class="plan-lesson-links">${lessonCards}</div></section>
      <section class="plan-section"><h3>Priority actions</h3><div class="plan-priority-list">${pri}</div></section>
      ${plan.assumptions.length?sectionHtml('Items to confirm',plan.assumptions):''}`;
  }

  function heading(title,items){return `${title}\n${(items||[]).map(x=>`- ${x}`).join('\n')}`}
  function toText(plan){
    const c=plan.cfg;
    const lessons=LESSONS.map(l=>`${l.n}. Lesson ${l.n} · ${l.title} — ${l.subtitle} (${c.lessonPattern==='one'?'use the 45-minute plan':'use the 90-minute/two-session plan'})`).join('\n');
    const pri=plan.priorities.length?plan.priorities.map((p,i)=>`${i+1}. [${p.level.toUpperCase()}] ${p.text}\n   Why: ${p.reason}`).join('\n'):'No major setup conflict identified.';
    return `STUDENT AI LEARNING INNOVATION LEAGUE — CLUB PLAN\n\nSTATUS\n${plan.status.label}: ${plan.status.title}\n${plan.status.summary}\n\nSETUP\n- Students: ${c.teamSize}\n- Grade band: ${label('grade',c.grade)}\n- Experience: ${label('experience',c.experience)}\n- Club format: ${c.format}\n- Teacher-client: ${c.client}\n- Technology: ${c.tech}\n- Family communication: ${c.family}\n- Schedule: Five-week / five-lesson sequence\n- Lesson length: ${label('lessonPattern',c.lessonPattern)}\n- Estimated contact time: ${plan.contact.text}\n- Available supports: ${c.supports.join(', ')||'None selected'}\n- Access or participation needs: ${c.access||'To be confirmed with students and families'}\n\n${heading('TEAM STRUCTURE',[plan.teams.text,...plan.teams.roles])}\n\n${heading('FORMAT RECOMMENDATIONS',plan.formatRecs)}\n\n${heading('STUDENT SCAFFOLDING',plan.studentRecs)}\n\n${heading('ADULT FACILITATION',plan.adultRecs)}\n\n${heading('TECHNOLOGY AND BUILDING',plan.techRecs)}\n\n${heading('TEACHER-CLIENT AND FAMILY COMMUNICATION',plan.stakeholderRecs)}\n\n${heading('ACCESSIBILITY AND PARTICIPATION',plan.accessRecs)}\n\n${heading('USING THE FIVE-LESSON SCHEDULE',plan.lessonRecs)}\n\nFIVE FACILITATOR LESSONS\n${lessons}\n\nPRIORITY ACTIONS\n${pri}${plan.assumptions.length?`\n\n${heading('ITEMS TO CONFIRM',plan.assumptions)}`:''}`;
  }

  function readForm(form){
    const val=id=>document.getElementById(id)?.value?.trim()||'';
    return {
      teamSize:val('plan-team-size'),grade:val('plan-grade'),experience:val('plan-experience'),
      format:form.querySelector('input[name="plan-format-choice"]:checked')?.value||'Small-group team',
      lessonPattern:form.querySelector('input[name="plan-lesson-pattern"]:checked')?.value||'one',
      adults:val('plan-adults'),client:val('plan-client'),tech:val('plan-tech'),family:val('plan-family'),access:val('plan-access'),
      supports:[...form.querySelectorAll('input[name="plan-support"]:checked')].map(x=>x.value)
    };
  }

  function download(name,text){const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}

  function init(){
    const form=document.getElementById('club-plan-form'); if(!form||form.dataset.plannerReady==='true') return; form.dataset.plannerReady='true';
    const output=document.getElementById('club-plan-output'), status=document.getElementById('club-plan-status'); let currentText='';
    const wizardSteps=[...form.querySelectorAll('.club-plan-step')], progress=[...form.querySelectorAll('[data-club-step-jump]')], stepStatus=document.getElementById('club-plan-step-status');
    const names=['Confirm readiness','Choose a format','Recruit students and connect people','Form and facilitate the team','Select a schedule','Review and generate']; let current=1;
    function show(step,scroll=true){current=Math.max(1,Math.min(wizardSteps.length,Number(step)||1));wizardSteps.forEach(p=>{const active=Number(p.dataset.clubStep)===current;p.hidden=!active;p.classList.toggle('is-active',active)});progress.forEach(b=>{const n=Number(b.dataset.clubStepJump);b.classList.toggle('is-current',n===current);b.classList.toggle('is-complete',n<current);b.setAttribute('aria-current',n===current?'step':'false')});if(stepStatus)stepStatus.textContent=`Step ${current} of ${wizardSteps.length} · ${names[current-1]}`;if(scroll)form.querySelector(`[data-club-step="${current}"]`)?.scrollIntoView({behavior:'smooth',block:'start'})}
    form.querySelectorAll('.club-step-next').forEach(b=>b.addEventListener('click',()=>show(current+1)));
    form.querySelectorAll('.club-step-back').forEach(b=>b.addEventListener('click',()=>show(current-1)));
    progress.forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.clubStepJump))));
    form.querySelectorAll('.format-choice-card input').forEach(input=>input.addEventListener('change',()=>{const group=input.name;form.querySelectorAll(`input[name="${group}"]`).forEach(i=>i.closest('.format-choice-card')?.classList.toggle('is-selected',i.checked))}));
    show(1,false);
    function generate(){const plan=buildPlan(readForm(form));currentText=toText(plan);output.innerHTML=toHtml(plan);status.textContent=`${plan.status.label}. Your club plan is ready.`;output.scrollIntoView({behavior:'smooth',block:'start'});return plan}
    document.getElementById('generate-club-plan')?.addEventListener('click',generate);
    document.getElementById('copy-club-plan')?.addEventListener('click',async()=>{if(!currentText)generate();try{await navigator.clipboard.writeText(currentText);status.textContent='Plan copied.'}catch(e){status.textContent='Select and copy the generated plan manually.'}});
    document.getElementById('download-club-plan')?.addEventListener('click',()=>{if(!currentText)generate();download('learning-league-club-plan.txt',currentText);status.textContent='Plan downloaded.'});
    document.getElementById('reset-club-plan')?.addEventListener('click',()=>{form.reset();currentText='';output.innerHTML='<p class="generated-plan-placeholder">Complete the five setup steps, then generate your club plan.</p>';status.textContent='Planner reset.';form.querySelectorAll('.format-choice-card input').forEach(i=>i.closest('.format-choice-card')?.classList.toggle('is-selected',i.checked));show(1)});
  }

  return {normalize,parseAccessNeeds,buildPlan,toHtml,toText,init};
});
