(()=>{
  const FLOW_KEY='leagueGuidedFlowV2';
  function saved(){try{return JSON.parse(localStorage.getItem(FLOW_KEY)||'{}')||{}}catch(e){return {}}}
  function save(key,step){const x=saved();x[key]=step;try{localStorage.setItem(FLOW_KEY,JSON.stringify(x))}catch(e){}}
  function setup(flow){
    const panels=[...flow.querySelectorAll(':scope > .guided-panel-stack > [data-guided-panel]')]; if(!panels.length)return;
    const key=flow.dataset.guidedKey||location.pathname; let current=Number(saved()[key]||1); current=Math.max(1,Math.min(panels.length,current));
    const status=flow.querySelector('[data-guided-status]'),meter=flow.querySelector('[data-guided-meter]'),label=flow.querySelector('[data-guided-nav-label]'),prev=flow.querySelector('[data-guided-prev]'),next=flow.querySelector('[data-guided-next]');
    function targetForHash(){if(!location.hash)return 0;try{const t=document.querySelector(location.hash);const p=t?.closest('[data-guided-panel]');return p?panels.indexOf(p)+1:0}catch(e){return 0}}
    const hashStep=targetForHash(); if(hashStep)current=hashStep;
    function show(n,{scroll=true,focus=true}={}){
      current=Math.max(1,Math.min(panels.length,n));
      panels.forEach((p,i)=>{const on=i===current-1;p.hidden=!on;p.setAttribute('aria-hidden',String(!on));});
      if(status)status.textContent=`Step ${current} of ${panels.length}`;
      if(label)label.textContent=`Step ${current} of ${panels.length}`;
      if(meter)meter.style.width=`${current/panels.length*100}%`;
      if(prev)prev.hidden=current===1;
      if(next){next.hidden=current===panels.length;next.textContent='Continue →';}
      save(key,current);
      if(scroll)flow.scrollIntoView({behavior:'smooth',block:'start'});
      if(focus){const h=panels[current-1].querySelector('h2,h3');if(h){h.tabIndex=-1;setTimeout(()=>h.focus({preventScroll:true}),250)}}
    }
    prev?.addEventListener('click',()=>show(current-1)); next?.addEventListener('click',()=>show(current+1));
    document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;let t;try{t=document.querySelector(a.getAttribute('href'))}catch(err){}const p=t?.closest('[data-guided-panel]');if(p&&flow.contains(p)){e.preventDefault();show(panels.indexOf(p)+1)}});
    show(current,{scroll:false,focus:false});
  }
  document.querySelectorAll('[data-guided-flow]').forEach(setup);
})();