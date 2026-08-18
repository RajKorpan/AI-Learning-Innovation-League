(()=>{
  const FLOW_KEY='leagueGuidedFlowV1';
  function getSaved(){
    try{return JSON.parse(localStorage.getItem(FLOW_KEY)||'{}')||{}}catch(e){return {}}
  }
  function saveStep(key,step){
    const all=getSaved(); all[key]=step;
    try{localStorage.setItem(FLOW_KEY,JSON.stringify(all))}catch(e){}
  }
  function focusPanel(panel){
    const h=panel?.querySelector('.guided-screen-heading h2, h2, h3');
    if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}
  }
  function setupFlow(flow){
    if(flow.dataset.guidedReady==='true') return;
    flow.dataset.guidedReady='true';
    const key=flow.dataset.guidedKey||location.pathname;
    const panels=[...flow.querySelectorAll(':scope > .guided-panel-stack > [data-guided-panel]')];
    const status=flow.querySelector(':scope > .guided-progress-card [data-guided-status]');
    const meter=flow.querySelector(':scope > .guided-progress-card [data-guided-meter]');
    const navLabel=flow.querySelector(':scope > .guided-nav [data-guided-nav-label]');
    const prev=flow.querySelector(':scope > .guided-nav [data-guided-prev]');
    const next=flow.querySelector(':scope > .guided-nav [data-guided-next]');
    const overviewBtn=flow.querySelector(':scope > .guided-progress-card [data-guided-overview]');
    const overview=flow.querySelector(':scope > [data-guided-overview-panel]');
    let current=1;
    const saved=getSaved()[key];
    if(Number(saved)>=1&&Number(saved)<=panels.length) current=Number(saved);

    function show(step,{scroll=true,focus=true,updateUrl=true}={}){
      const n=Math.max(1,Math.min(panels.length,Number(step)||1)); current=n;
      panels.forEach((p,i)=>{
        const on=i===n-1;
        p.hidden=!on;
        p.setAttribute('aria-hidden',on?'false':'true');
      });
      const title=panels[n-1]?.dataset.guidedTitle||`Step ${n}`;
      if(status)status.textContent=`Step ${n} of ${panels.length} · ${title}`;
      if(navLabel)navLabel.textContent=`${n} of ${panels.length}`;
      if(meter)meter.style.width=`${(n/panels.length)*100}%`;
      if(prev)prev.disabled=n===1;
      if(next){
        next.hidden=n===panels.length;
        next.textContent=n===panels.length?'Done':`Next: ${panels[n]?.dataset.guidedTitle||'continue'} →`;
      }
      flow.querySelectorAll('[data-guided-jump]').forEach(b=>{
        const on=Number(b.dataset.guidedJump)===n;
        b.classList.toggle('is-current',on);
        b.setAttribute('aria-current',on?'step':'false');
      });
      saveStep(key,n);
      if(overview){overview.hidden=true; overviewBtn?.setAttribute('aria-expanded','false');}
      if(scroll){flow.scrollIntoView({behavior:'smooth',block:'start'});}
      if(focus) setTimeout(()=>focusPanel(panels[n-1]),scroll?350:0);
      if(updateUrl) history.replaceState(null,'',location.pathname+location.search+(panels[n-1].querySelector('[id]')?`#${panels[n-1].querySelector('[id]').id}`:''));
      window.dispatchEvent(new CustomEvent('league:guided-step',{detail:{key,step:n,title}}));
    }
    prev?.addEventListener('click',()=>show(current-1));
    next?.addEventListener('click',()=>show(current+1));
    overviewBtn?.setAttribute('aria-expanded','false');
    overviewBtn?.addEventListener('click',()=>{
      if(!overview)return;
      const open=overview.hidden;
      overview.hidden=!open;
      overviewBtn.setAttribute('aria-expanded',String(open));
      overviewBtn.textContent=open?'Hide steps':'See all steps';
    });
    flow.querySelectorAll('[data-guided-jump]').forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.guidedJump))));

    function panelForHash(hash){
      if(!hash)return null;
      let target=null;
      try{target=document.querySelector(hash)}catch(e){}
      if(!target)return null;
      return target.closest('[data-guided-panel]');
    }
    const hashPanel=panelForHash(location.hash);
    if(hashPanel) current=panels.indexOf(hashPanel)+1||current;
    show(current,{scroll:false,focus:false,updateUrl:false});

    document.addEventListener('click',e=>{
      const a=e.target.closest('a[href^="#"]');
      if(!a)return;
      const p=panelForHash(a.getAttribute('href'));
      if(p&&flow.contains(p)){
        e.preventDefault();
        show(panels.indexOf(p)+1);
      }
    });
  }

  function sessionLabelFor(detail,panel){
    let node=detail.closest('.activity-guide-list');
    if(!node)return '';
    let prev=node.previousElementSibling;
    while(prev&&prev!==panel){
      if(prev.classList?.contains('session-divider')) return prev.textContent.trim();
      prev=prev.previousElementSibling;
    }
    return '';
  }
  function setupActivityPanel(panel){
    if(panel.dataset.activityCarouselReady==='true')return;
    panel.dataset.activityCarouselReady='true';
    const items=[...panel.querySelectorAll('details.activity-guide')];
    if(items.length<2)return;
    const heading=panel.querySelector('.lesson-plan-heading');
    const controls=document.createElement('div');
    controls.className='lesson-activity-carousel';
    controls.innerHTML='<div><span class="kicker">Lesson Plan</span><strong data-activity-status></strong></div><div class="lesson-activity-buttons"><button type="button" class="button secondary small" data-activity-prev>← Previous activity</button><button type="button" class="button primary small" data-activity-next>Next activity →</button></div>';
    heading?.insertAdjacentElement('afterend',controls);
    let index=0;
    const dividers=[...panel.querySelectorAll('.session-divider')];
    function show(i,{scroll=false}={}){
      index=Math.max(0,Math.min(items.length-1,i));
      items.forEach((item,n)=>{item.hidden=n!==index;item.open=n===index;});
      dividers.forEach(d=>d.hidden=true);
      const session=sessionLabelFor(items[index],panel);
      if(session){
        let list=items[index].closest('.activity-guide-list');
        let prev=list?.previousElementSibling;
        while(prev&&prev!==panel){
          if(prev.classList?.contains('session-divider')){prev.hidden=false;break;}
          prev=prev.previousElementSibling;
        }
      }
      const title=items[index].querySelector('.activity-summary-copy strong')?.textContent.trim()||`Activity ${index+1}`;
      const s=controls.querySelector('[data-activity-status]');
      if(s)s.textContent=`${session?session+' · ':''}Activity ${index+1} of ${items.length} · ${title}`;
      controls.querySelector('[data-activity-prev]').disabled=index===0;
      controls.querySelector('[data-activity-next]').hidden=index===items.length-1;
      if(scroll)controls.scrollIntoView({behavior:'smooth',block:'center'});
    }
    controls.querySelector('[data-activity-prev]').addEventListener('click',()=>show(index-1,{scroll:true}));
    controls.querySelector('[data-activity-next]').addEventListener('click',()=>show(index+1,{scroll:true}));
    show(0);
  }
  function setupActivityCarousels(){
    document.querySelectorAll('.lesson-plan-panel').forEach(setupActivityPanel);
    document.querySelectorAll('[data-lesson-length]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(()=>{
      document.querySelectorAll('.lesson-plan-panel:not([hidden])').forEach(p=>{
        const first=p.querySelector('details.activity-guide:not([hidden])')||p.querySelector('details.activity-guide');
        first?.scrollIntoView({block:'nearest'});
      });
    },0)));
  }
  function setupSupportAccordions(){
    document.querySelectorAll('.support-accordion-list').forEach(list=>{
      list.querySelectorAll(':scope > details').forEach(d=>d.addEventListener('toggle',()=>{
        if(!d.open)return;
        list.querySelectorAll(':scope > details').forEach(other=>{if(other!==d)other.open=false;});
      }));
    });
  }
  function setupLessonModeAwareness(){
    document.querySelectorAll('[data-lesson-mode]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(()=>{
      const panel=document.querySelector(`[data-lesson-mode-panel="${btn.dataset.lessonMode}"]`);
      const flow=panel?.querySelector('[data-guided-flow]');
      if(flow) flow.scrollIntoView({behavior:'smooth',block:'start'});
    },30)));
  }
  document.querySelectorAll('[data-guided-flow]').forEach(setupFlow);
  setupActivityCarousels();
  setupSupportAccordions();
  setupLessonModeAwareness();
})();
