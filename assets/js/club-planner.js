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

  const DRAFT_KEY='leagueClubPlannerDraftV2';
  const STAGES=[
    {n:1,title:'Empathize',purpose:'Understand the learner'},
    {n:2,title:'Define',purpose:'Find the real learning problem'},
    {n:3,title:'Ideate',purpose:'Choose a way to help'},
    {n:4,title:'Prototype',purpose:'Build something small enough to test'},
    {n:5,title:'Test + Share',purpose:'Try it, improve it, and share what the team learned'}
  ];
  const LABELS={
    adults:{one:'One facilitator',two:'Two adults or co-facilitators','tech-mentor':'Facilitator plus technical mentor',multiple:'Multiple classroom adults or mentors'},
    meetingPattern:{one:'One 45-minute meeting per stage',two:'Two 45-minute meetings per stage'}
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const label=(group,key)=>(LABELS[group]&&LABELS[group][key])||key||'';

  function normalize(raw={}){
    return {
      readiness:Array.from(new Set(raw.readiness||[])),
      tech:raw.tech||'Not yet confirmed', adults:raw.adults||'one', requirements:(raw.requirements||'').trim(),
      access:(raw.access||'').trim(), supports:Array.from(new Set(raw.supports||[])), needs:(raw.needs||'').trim(),
      format:raw.format||'Club', formatOther:(raw.formatOther||'').trim(), meetingPattern:raw.meetingPattern||'one',
      delivery:raw.delivery||'In-person', groupSize:Math.max(1,Math.min(80,Number(raw.groupSize)||1)),
      teamArrangement:raw.teamArrangement||'One team', recruitNotes:(raw.recruitNotes||'').trim(),
      teamSize:Math.max(1,Math.min(12,Number(raw.teamSize)||1)), roles:raw.roles||'Rotate flexible roles',
      decisions:raw.decisions||'Discuss, then seek agreement', techBalance:raw.techBalance||'Rotate or share technical work',
      inclusion:(raw.inclusion||'').trim(), schedule:Array.isArray(raw.schedule)?raw.schedule.slice(0,5):[]
    };
  }
  function parseAccessNeeds(text){ return text&&String(text).trim()?[String(text).trim()]:[]; }
  function buildPlan(raw){ return {cfg:normalize(raw)}; }
  function displayFormat(c){return c.format==='Another format'&&c.formatOther?c.formatOther:c.format;}
  function scheduleLines(c){
    return STAGES.map((s,i)=>{
      const entry=c.schedule[i]||{};
      const bits=[entry.a, c.meetingPattern==='two'?entry.b:''].filter(Boolean);
      return `${s.n}. ${s.title} — ${bits.length?bits.join(' + '):'Not scheduled yet'}`;
    });
  }
  function list(items,empty='None entered'){
    const clean=(items||[]).filter(Boolean);
    return clean.length?`<ul>${clean.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p class="plan-empty">${esc(empty)}</p>`;
  }
  function summaryRow(title,html,step){
    return `<section class="streamlined-summary-row"><div><h4>${esc(title)}</h4>${html}</div><button class="planner-edit-link" data-club-step-jump="${step}" type="button">Edit</button></section>`;
  }
  function toHtml(plan){
    const c=plan.cfg;
    const formatHtml=`<p><strong>${esc(displayFormat(c))}</strong> · ${esc(c.delivery)} · ${esc(label('meetingPattern',c.meetingPattern))}</p><p>${esc(c.groupSize)} students approximately · ${esc(c.teamArrangement)}</p>`;
    const teamHtml=`<p><strong>${esc(c.teamSize)} students per team</strong></p><ul><li>${esc(c.roles)}</li><li>${esc(c.decisions)}</li><li>${esc(c.techBalance)}</li></ul>${c.inclusion?`<p><strong>Participation/inclusion:</strong> ${esc(c.inclusion)}</p>`:''}`;
    const scheduleHtml=`<ul>${scheduleLines(c).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
    const techHtml=`<p><strong>${esc(c.tech)}</strong> · ${esc(label('adults',c.adults))}</p>`;
    const supportHtml=`${c.access?`<p><strong>Known needs:</strong> ${esc(c.access)}</p>`:'<p class="plan-empty">No access or participation needs entered yet.</p>'}<p><strong>Available:</strong></p>${list(c.supports,'No supports selected yet.')}`;
    const requirementsHtml=c.requirements?`<p>${esc(c.requirements)}</p>`:'<p class="plan-empty">No school or platform notes entered yet.</p>';
    const needsHtml=c.needs?`<p>${esc(c.needs)}</p>`:'<p class="plan-empty">No additional materials or support entered yet.</p>';
    const recruitHtml=c.recruitNotes?`<p>${esc(c.recruitNotes)}</p>`:'<p class="plan-empty">No recruitment notes entered.</p>';
    return [
      summaryRow('Format',formatHtml,2),
      summaryRow('Recruitment',recruitHtml,3),
      summaryRow('Team structure',teamHtml,4),
      summaryRow('Meeting schedule',scheduleHtml,5),
      summaryRow('Technology and adult support',techHtml,1),
      summaryRow('Known access and support needs',supportHtml,1),
      summaryRow('School or platform requirements',requirementsHtml,1),
      summaryRow('Materials or support still needed',needsHtml,1)
    ].join('');
  }
  function toText(plan){
    const c=plan.cfg;
    return `STUDENT AI LEARNING INNOVATION LEAGUE — CLUB PLAN\n\nFORMAT\n${displayFormat(c)} · ${c.delivery}\n${label('meetingPattern',c.meetingPattern)}\nApproximately ${c.groupSize} students · ${c.teamArrangement}\n\nRECRUITMENT NOTES\n${c.recruitNotes||'None entered'}\n\nTEAM STRUCTURE\n${c.teamSize} students per team\n- ${c.roles}\n- ${c.decisions}\n- ${c.techBalance}${c.inclusion?`\n- Participation/inclusion: ${c.inclusion}`:''}\n\nMEETING SCHEDULE\n${scheduleLines(c).join('\n')}\n\nTECHNOLOGY AND ADULT SUPPORT\n${c.tech}\n${label('adults',c.adults)}\n\nKNOWN ACCESS AND SUPPORT NEEDS\n${c.access||'None entered yet'}\nAvailable supports: ${c.supports.join(', ')||'None selected yet'}\n\nSCHOOL OR PLATFORM REQUIREMENTS\n${c.requirements||'None entered yet'}\n\nMATERIALS OR SUPPORT STILL NEEDED\n${c.needs||'None entered yet'}\n\nBefore you begin, confirm that your plan meets your local safety, privacy, accessibility, and school requirements.`;
  }
  function readForm(form){
    const val=id=>document.getElementById(id)?.value?.trim()||'';
    return {
      readiness:[...form.querySelectorAll('input[name="plan-readiness"]:checked')].map(x=>x.value),
      tech:val('plan-tech'),adults:val('plan-adults'),requirements:val('plan-requirements'),access:val('plan-access'),needs:val('plan-needs'),
      supports:[...form.querySelectorAll('input[name="plan-support"]:checked')].map(x=>x.value),
      format:form.querySelector('input[name="plan-format-choice"]:checked')?.value||'Club',formatOther:val('plan-format-other'),
      meetingPattern:val('plan-meeting-pattern'),delivery:val('plan-delivery'),groupSize:val('plan-group-size'),teamArrangement:val('plan-team-arrangement'),
      recruitNotes:val('plan-recruit-notes'),teamSize:val('plan-team-size'),roles:val('plan-roles'),decisions:val('plan-decisions'),techBalance:val('plan-tech-balance'),inclusion:val('plan-inclusion'),
      schedule:STAGES.map(s=>({a:val(`plan-date-${s.n}a`),b:val(`plan-date-${s.n}b`)}))
    };
  }
  function download(name,text){const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}

  function init(){
    const form=document.getElementById('club-plan-form'); if(!form||form.dataset.plannerReady==='true') return; form.dataset.plannerReady='true';
    const output=document.getElementById('club-plan-output'), status=document.getElementById('club-plan-status');
    const wizardSteps=[...form.querySelectorAll('.club-plan-step')], progress=[...form.querySelectorAll('.club-plan-progress [data-club-step-jump]')], stepStatus=document.getElementById('club-plan-step-status');
    const names=['Readiness','Format','Recruit','Team','Schedule','Review']; let current=1, currentText='';
    const set=(id,v)=>{const el=document.getElementById(id);if(el&&v!=null)el.value=v;};
    function updateChoiceStyles(){form.querySelectorAll('.planner-choice-chip input').forEach(i=>i.closest('.planner-choice-chip')?.classList.toggle('is-selected',i.checked));}
    function updateConditionalFields(){
      const custom=form.querySelector('input[name="plan-format-choice"]:checked')?.value==='Another format';
      const wrap=document.getElementById('plan-format-other-wrap'); if(wrap) wrap.hidden=!custom;
      const two=document.getElementById('plan-meeting-pattern')?.value==='two';
      form.querySelectorAll('.planner-second-meeting').forEach(i=>i.hidden=!two);
    }
    function saveDraft(){try{const d=readForm(form);d.step=current;localStorage.setItem(DRAFT_KEY,JSON.stringify(d));}catch(e){}}
    function restoreDraft(){
      let d=null;try{d=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null');}catch(e){} if(!d)return 1;
      const c=normalize(d);
      ['tech','adults','requirements','access','needs','formatOther','meetingPattern','delivery','groupSize','teamArrangement','recruitNotes','teamSize','roles','decisions','techBalance','inclusion'].forEach(k=>{
        const ids={tech:'plan-tech',adults:'plan-adults',requirements:'plan-requirements',access:'plan-access',needs:'plan-needs',formatOther:'plan-format-other',meetingPattern:'plan-meeting-pattern',delivery:'plan-delivery',groupSize:'plan-group-size',teamArrangement:'plan-team-arrangement',recruitNotes:'plan-recruit-notes',teamSize:'plan-team-size',roles:'plan-roles',decisions:'plan-decisions',techBalance:'plan-tech-balance',inclusion:'plan-inclusion'}; set(ids[k],c[k]);
      });
      form.querySelectorAll('input[name="plan-readiness"]').forEach(i=>i.checked=c.readiness.includes(i.value));
      form.querySelectorAll('input[name="plan-support"]').forEach(i=>i.checked=c.supports.includes(i.value));
      form.querySelectorAll('input[name="plan-format-choice"]').forEach(i=>i.checked=i.value===c.format);
      c.schedule.forEach((x,i)=>{set(`plan-date-${i+1}a`,x?.a||'');set(`plan-date-${i+1}b`,x?.b||'');});
      return Math.max(1,Math.min(6,Number(d.step)||1));
    }
    function renderSummary(){const plan=buildPlan(readForm(form));output.innerHTML=toHtml(plan);currentText=toText(plan);}
    function show(step,scroll=true){
      current=Math.max(1,Math.min(wizardSteps.length,Number(step)||1));
      wizardSteps.forEach(p=>{const active=Number(p.dataset.clubStep)===current;p.hidden=!active;p.classList.toggle('is-active',active);});
      progress.forEach(b=>{const n=Number(b.dataset.clubStepJump);b.classList.toggle('is-current',n===current);b.classList.toggle('is-complete',n<current);b.setAttribute('aria-current',n===current?'step':'false');});
      if(stepStatus) stepStatus.textContent=`Step ${current} of 6 · ${names[current-1]}`;
      updateConditionalFields(); if(current===6)renderSummary(); saveDraft();
      if(scroll) form.querySelector(`[data-club-step="${current}"]`)?.scrollIntoView({behavior:'smooth',block:'start'});
    }
    form.addEventListener('click',e=>{
      const next=e.target.closest('.club-step-next'), back=e.target.closest('.club-step-back'), jump=e.target.closest('[data-club-step-jump]');
      if(next){e.preventDefault();show(current+1);return;} if(back){e.preventDefault();show(current-1);return;}
      if(jump){e.preventDefault();show(Number(jump.dataset.clubStepJump));}
    });
    form.addEventListener('input',()=>{updateConditionalFields();saveDraft();if(current===6)renderSummary();});
    form.addEventListener('change',()=>{updateChoiceStyles();updateConditionalFields();saveDraft();if(current===6)renderSummary();});
    const restored=restoreDraft(); updateChoiceStyles(); updateConditionalFields(); show(restored,false);
    document.getElementById('copy-club-plan')?.addEventListener('click',async()=>{renderSummary();try{await navigator.clipboard.writeText(currentText);status.textContent='Plan copied.';}catch(e){status.textContent='Select and copy the plan manually.';}});
    document.getElementById('download-club-plan')?.addEventListener('click',()=>{renderSummary();download('learning-league-club-plan.txt',currentText);status.textContent='Plan downloaded.';});
    document.getElementById('reset-club-plan')?.addEventListener('click',()=>{form.reset();try{localStorage.removeItem(DRAFT_KEY);}catch(e){}currentText='';updateChoiceStyles();updateConditionalFields();status.textContent='Planner reset.';show(1);});
  }
  return {normalize,parseAccessNeeds,buildPlan,toHtml,toText,init};
});
