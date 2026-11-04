/* Browser UI: no prices or fare rules belong here. */
(() => {
  'use strict';
  const F=LondonFares, E=LondonEngine, $=id=>document.getElementById(id);
  const cash=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(n/100);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const order=[1,2,3,4,5,6,0]; let selectedDays=[1,2,3], nextMap='from', weekMode=false, weekState=null;
  const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const pretty=value=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
  const minutes=id=>{const parts=$(id).value.split(':').map(Number);return parts.length===2?parts[0]*60+parts[1]:NaN;};
  const form=$('travel-form');
  let resultReady=false;
  $('native-share').hidden=typeof navigator.share!=='function';
  const mobileSummary=document.createElement('a');mobileSummary.className='mobile-result';mobileSummary.href='#results';mobileSummary.setAttribute('aria-label','View your travel cost comparison');document.body.append(mobileSummary);
  for(let i=1;i<=6;i++) for(const id of ['from-zone','to-zone']) $(id).add(new Option('Zone '+i,i));
  $('to-zone').value='2';
  for(const [key,p] of Object.entries(F.profiles)) $('profile').add(new Option(p.label,key));
  $('day-count').innerHTML=Array.from({length:7},(_,i)=>`<label><input type="radio" name="day-count" value="${i+1}" ${i===2?'checked':''}><span>${i+1}</span></label>`).join('');
  $('weekday-picker').innerHTML=order.map(d=>`<label><input type="checkbox" value="${d}" ${selectedDays.includes(d)?'checked':''}>${names[d].slice(0,3)}</label>`).join('');
  $('zone-map').innerHTML=Array.from({length:6},(_,i)=>`<button type="button" data-zone="${i+1}" aria-label="Select Zone ${i+1}" aria-pressed="false">${i+1}</button>`).join('');
  $('start-date').value=today();
  $('source-date').textContent=pretty(F.checked);
  document.querySelector('.source-stamp a').textContent='Checked '+pretty(F.checked);
  const sourceNames={adult:'Adult caps & Travelcards',student:'Student Travelcards',child:'11–15 Zip fares',zip16:'16+ Zip fares',railcard:'Railcard caps',bus:'Bus & tram fares',singles:'2026 single fare tables',discounts:'Discount eligibility',times:'Peak times & exceptions',caps:'Capping rules',november:'November fare changes',disabledRailcard:'Disabled Persons Railcard caps',holidays:'Bank holidays'};
  $('source-links').innerHTML=Object.entries(F.sources).map(([k,v])=>`<a href="${v}" target="_blank" rel="noopener">${sourceNames[k]} ↗</a>`).join('');
  const timeChoices={peak:[480,1050],offpeak:[600,1200],mixed:[480,1200]};
  function usualDay(){return {rail:$('trips').valueAsNumber,bus:$('extra-bus').valueAsNumber,from:Number($('from-zone').value),to:Number($('to-zone').value),via1:$('via-one').checked,tram:$('tram').checked,timing:'usual'};}
  function dayValue(day){return weekState[day].usual?usualDay():weekState[day];}
  function dayText(p){
    if(!p.rail&&!p.bus)return 'No travel';
    const rail=p.rail?p.rail+' Tube & rail '+(p.rail===1?'trip':'trips')+' · '+(p.from===p.to?'Zone '+p.from:'Zones '+Math.min(p.from,p.to)+'–'+Math.max(p.from,p.to)):'';
    const bus=p.bus?p.bus+' '+(p.tram?'tram/bus':'bus')+' '+(p.bus===1?'journey':'journeys'):'';
    return [rail,bus].filter(Boolean).join(' + ')+(p.via1&&p.from!==1&&p.to!==1?' · via Zone 1':'')+(p.timing&&p.timing!=='usual'?' · '+{peak:'8am / 5:30pm',offpeak:'10am / 8pm',mixed:'8am / 8pm'}[p.timing]:'');
  }
  const zoneOptions=Array.from({length:6},(_,i)=>`<option value="${i+1}">Zone ${i+1}</option>`).join('');
  $('week-plan').innerHTML=order.map(day=>{
    const stepper=(field,label)=>`<div class="journey-count-row"><label for="day-${day}-${field}">${label}</label><div class="stepper"><button type="button" data-count="day-${day}-${field}" data-change="-1" aria-label="Fewer ${label.toLowerCase()} on ${names[day]}">−</button><input id="day-${day}-${field}" type="number" min="0" max="12" value="0" inputmode="numeric" data-day="${day}" data-field="${field}"><button type="button" data-count="day-${day}-${field}" data-change="1" aria-label="More ${label.toLowerCase()} on ${names[day]}">+</button></div></div>`;
    return `<details class="day-card" data-weekday="${day}"><summary><span class="day-name">${names[day].slice(0,3)}</span><span class="day-description"></span><span aria-hidden="true">⌄</span></summary><div class="day-body"><div class="day-actions"><button type="button" class="text-button" data-usual-day="${day}">Use usual day</button><button type="button" class="text-button" data-off-day="${day}">No travel</button></div>${stepper('rail','Tube & rail trips')}${stepper('bus','Bus/tram journeys')}<div class="day-rail-fields"><div class="day-zones"><div><label for="day-${day}-from">Tube &amp; rail from</label><select id="day-${day}-from" data-day="${day}" data-field="from">${zoneOptions}</select></div><div><label for="day-${day}-to">Tube &amp; rail to</label><select id="day-${day}-to" data-day="${day}" data-field="to">${zoneOptions}</select></div></div><label class="check-row"><input type="checkbox" id="day-${day}-via1" data-day="${day}" data-field="via1"> Pass through Zone 1</label></div><label class="check-row"><input type="checkbox" id="day-${day}-tram" data-day="${day}" data-field="tram"> Includes trams</label><label class="day-time-label" for="day-${day}-timing">Travel times</label><select id="day-${day}-timing" data-day="${day}" data-field="timing"><option value="usual">Use usual times below</option><option value="peak">Rush hour · 8am / 5:30pm</option><option value="offpeak">Outside rush hour · 10am / 8pm</option><option value="mixed">A mix · 8am / 8pm</option></select><div class="day-copy"><button type="button" class="text-button" data-copy-day="${day}" data-target="weekdays">Copy to Mon–Fri</button><button type="button" class="text-button" data-copy-day="${day}" data-target="all">Copy to all 7 days</button></div></div></details>`;
  }).join('');
  function syncWeek(){
    $('regular-days').hidden=weekMode;$('week-panel').hidden=!weekMode;
    $('week-toggle').textContent=weekMode?'← Use the usual-day shortcut':'My days are different →';$('week-toggle').setAttribute('aria-expanded',weekMode);
    if(!weekMode)return;
    for(const day of order){const p=dayValue(day),card=document.querySelector(`[data-weekday="${day}"]`);card.querySelector('.day-description').textContent=dayText(p);card.querySelector('.day-rail-fields').hidden=p.rail===0;
      for(const field of ['rail','bus','from','to','via1','tram','timing']){const el=document.getElementById('day-'+day+'-'+field);if(el.type==='checkbox')el.checked=!!p[field];else el.value=p[field];}
    }
  }
  function input() {
    const busOnly=weekMode?order.every(day=>dayValue(day).rail===0):$('trips').valueAsNumber===0, timing=form.elements.timing.value;
    const times=timeChoices[timing];
    const custom=$('exact').checked||$('rail-type').value==='special';
    const p=F.profiles[$('profile').value];
    const out=$('custom-times').checked?minutes('out-time'):times[0],back=$('custom-times').checked?minutes('back-time'):times[1];
    const week=weekMode?Object.fromEntries(order.map(day=>{const p=dayValue(day),t=p.timing==='usual'?[out,back]:timeChoices[p.timing];return [day,{...p,out:t[0],back:t[1]}];})):null;
    return {week,railMode:$('rail-type').value,mode:busOnly?'bus':$('rail-type').value,from:Number($('from-zone').value),to:Number($('to-zone').value),via1:$('via-one').checked,days:weekMode?order.filter(day=>dayValue(day).rail||dayValue(day).bus):selectedDays.slice(),out,back,profile:$('profile').value,railcard:busOnly||p.half||p.child||p.free||p.older?'none':$('railcard').value,trips:busOnly?$('extra-bus').valueAsNumber:$('trips').valueAsNumber,extraBus:busOnly?0:$('extra-bus').valueAsNumber,tram:$('tram').checked,start:$('start-date').value,away:$('away').valueAsNumber,custom:{enabled:!busOnly&&custom,out:$('exact-out').value===''?NaN:Math.round($('exact-out').valueAsNumber*100),back:$('exact-back').value===''?NaN:Math.round($('exact-back').valueAsNumber*100)}};
  }
  function sync() {
    syncWeek();
    const busOnly=weekMode?order.every(day=>dayValue(day).rail===0):$('trips').valueAsNumber===0, p=F.profiles[$('profile').value];
    $('rail-fields').hidden=$('trips').valueAsNumber===0; $('bus-hint').hidden=!busOnly;
    $('time-fields').hidden=busOnly&&!p.older;
    $('rail-options').hidden=busOnly;
    const countLabel=n=>!Number.isFinite(n)?'Choose a number':n===0?'None':n===1?'1 · one way':n===2?'2 · there and back':n+' · one-way journeys';
    $('rail-count-description').textContent=countLabel($('trips').valueAsNumber);
    $('bus-count-description').textContent=countLabel($('extra-bus').valueAsNumber);
    document.querySelectorAll('[data-count]').forEach(button=>{const field=$(button.dataset.count);button.disabled=Number(button.dataset.change)<0?field.valueAsNumber<=0:field.valueAsNumber>=12;});
    $('exact-fields').hidden=!$('exact').checked&&$('rail-type').value!=='special';
    $('custom-time-fields').hidden=!$('custom-times').checked;
    $('railcard-field').hidden=!!(busOnly||p.half||p.child||p.free||p.older);
    $('profile-note').textContent=p.note;
    $('discount-summary').textContent=$('profile').value==='adult'?($('railcard').value==='none'?'Adult fare':'Railcard added'):'Discount selected';
    $('days-description').textContent=selectedDays.length===7?'Every day':selectedDays.length===0?'No travel days selected':order.filter(d=>selectedDays.includes(d)).map(d=>names[d].slice(0,3)).join(', ');
    document.querySelectorAll('#weekday-picker input').forEach(el=>el.checked=selectedDays.includes(Number(el.value)));
    document.querySelectorAll('[name="day-count"]').forEach(el=>el.checked=Number(el.value)===selectedDays.length);
    const lo=$('via-one').checked?1:Math.min(Number($('from-zone').value),Number($('to-zone').value)),hi=Math.max(Number($('from-zone').value),Number($('to-zone').value));
    document.querySelectorAll('[data-zone]').forEach(el=>el.setAttribute('aria-pressed',Number(el.dataset.zone)>=lo&&Number(el.dataset.zone)<=hi));
  }
  function render() {
    sync(); const s=input(), target=$('results');
    resultReady=false;$('copy-comparison').disabled=true;$('native-share').disabled=true;
    $('comparison-link').hidden=true;$('comparison-link-label').hidden=true;$('share-status').textContent='';
    const wasOpen=target.querySelector('.result-details')?.open;
    try {
      if(!s.days.length) throw Error('Choose at least one travel day to see your comparison.');
      if(!weekMode&&$('trips').valueAsNumber===0&&$('extra-bus').valueAsNumber===0) throw Error('Add at least one Tube & rail trip or bus/tram journey to compare your travel.');
      const r=E.compare(s);
      if(r.blocked) throw Error(r.blocked);
      resultReady=true;$('copy-comparison').disabled=false;$('native-share').disabled=false;
      window.LondonAnalytics?.result(r,weekMode);
      const isMonthly=r.winner==='monthly',isWeekly=r.winner==='weekly',tie=r.saving===0;
      const title=r.free?'Your pass covers this.':tie?'It’s a tie.':isMonthly?'Get a monthly '+(r.busOnly?'pass.':'Travelcard.'):isWeekly?'Mix weekly tickets & PAYG.':'Pay as you go.';
      mobileSummary.hidden=false;
      mobileSummary.textContent=(r.free?'Your pass covers this':tie?'Both options cost the same':(isMonthly?'Monthly pass':isWeekly?'Weekly tickets + PAYG':'PAYG')+' · save '+cash(r.saving))+'  ↓ View result';
      const intro=r.free?'No paid pass needed for this travel pattern. Check your pass is valid for your route and times.':isMonthly?'Your regular travel makes a monthly '+(r.busOnly?'Bus & Tram Pass':'Travelcard')+' the cheaper choice.':isWeekly?'Discounted 7-day tickets plus PAYG on the remaining days work out cheapest.':tie?'Both options cost the same for these journeys. PAYG lets you stay flexible.':'Tap in with '+(s.profile==='adult'&&s.railcard==='none'?'contactless or Oyster':'your eligible Oyster or pass')+'. For your usual week, you’ll spend less than buying a monthly pass.';
      const top=Math.max(r.payg,r.monthly,1);
      const rows=[{label:'Pay as you go',value:r.payg,key:'payg'},...(r.flexible<r.payg?[{label:'Weekly tickets + PAYG',value:r.flexible,key:'weekly'}]:[]),{label:r.busOnly?'Monthly Bus & Tram Pass':'Monthly Travelcard',value:r.monthly,key:'monthly'}];
      const end=new Date(r.end+'T12:00:00Z');end.setUTCDate(end.getUTCDate()-1);
      const period=pretty(s.start)+' – '+pretty(end.toISOString().slice(0,10));
      let warning=r.warnings.slice();
      const stale=today()>=F.reviewBy;
      target.innerHTML=`<div class="eyebrow">YOUR BETTER WAY TO TRAVEL</div><div class="recommend-badge">✓ ${r.free?'Free travel':tie?'Same price':'Best fit for your week'}</div><h2>${title}</h2><p class="result-intro">${intro}</p><div class="saving"><span class="saving-icon" aria-hidden="true">${r.free?'✓':'↗'}</span><div><strong>${r.free?cash(0):tie?'Same cost':cash(r.saving)+' less'}</strong><small>${r.free?'for these journeys':isMonthly?'than the cheapest flexible option, this month':'than a monthly '+(r.busOnly?'Bus & Tram Pass':'Travelcard')+', this month'}</small></div></div><div class="comparison-heading">YOUR MONTH, SIDE BY SIDE</div>${rows.map(row=>`<div class="comparison-row ${row.key===r.winner?'best':''}"><div class="comparison-label"><span>${row.label}${row.key===r.winner?'<b class="best-tag">BEST FIT</b>':''}</span><strong>${cash(row.value)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${(row.value/top*100).toFixed(2)}%"></div></div></div>`).join('')}<p class="result-footnote">${r.days} travel days · ${r.busOnly?'All London buses & trams':r.lo===r.hi?'Zone '+r.lo:'Zones '+r.lo+'–'+r.hi}<br>${period} · ${r.calendarDays} calendar days</p>${stale?'<p class="stale">Fares need a new check. This result uses the last verified prices.</p>':''}<details class="result-details" ${wasOpen?'open':''}><summary>How we worked it out <span>+</span></summary><dl><dt>Fare profile</dt><dd>${esc(r.profile)}</dd><dt>Journeys per travel day</dt><dd>${s.trips}</dd><dt>7-day ticket</dt><dd>${cash(r.weeklyTicket)}</dd><dt>Monthly pass</dt><dd>${cash(r.monthlyTicket)}</dd><dt>Weekly PAYG cap</dt><dd>${r.weeklyCap===null?'Not assumed':cash(r.weeklyCap)}</dd></dl><p>The month runs from the selected start date to the day before the same date next month. Shorter months use the last available date. Weekly caps reset on Monday. Weekly-ticket combinations are compared over the same dates.</p><ul>${warning.map(w=>`<li>${esc(w)}</li>`).join('')}</ul><p>Selected bank holidays count as travel days at off-peak rates. Days away remove the first selected dates. No travel outside this pattern is included.</p><div class="journey-list"><table><caption>PAYG before weekly caps</caption><thead><tr><th scope="col">Travel date</th><th scope="col">Daily cost</th></tr></thead><tbody>${r.records.filter(d=>d.active).map(d=>`<tr><td>${pretty(d.date)}${d.holiday?' · bank holiday':''}</td><td>${cash(d.cost)}</td></tr>`).join('')}</tbody></table></div><p><a href="#sources">See coverage and official sources ↓</a></p></details>`;
      const pattern=document.createElement('div');pattern.className='travel-pattern';
      const railCount=r.busOnly?0:s.trips,busCount=r.busOnly?s.trips:s.extraBus;
      pattern.textContent='Each travel day: '+[railCount?railCount+' Tube & rail '+(railCount===1?'trip':'trips'):'',busCount?busCount+' bus/tram '+(busCount===1?'journey':'journeys'):''].filter(Boolean).join(' + ')+'.';
      if(!r.busOnly&&busCount)pattern.textContent+=' These bus journeys are included in the Travelcard price.';
      if(r.weekSummary)pattern.innerHTML='<strong>Your planned week</strong><ul>'+r.weekSummary.map(day=>`<li><b>${names[day.weekday].slice(0,3)}</b> ${esc(dayText(day))}</li>`).join('')+'</ul>';
      target.querySelector('.comparison-heading').before(pattern);
      target.querySelector('.result-details dd:nth-of-type(2)').textContent=r.weekSummary?'Varies by day (see your week above)':railCount+' Tube & rail + '+busCount+' bus/tram';
      if(r.weeklyCapVaries)target.querySelector('.result-details dd:last-child').textContent='Varies by week';
      if(isWeekly) {
        const plan=document.createElement('div');plan.className='ticket-plan';
        plan.innerHTML='<strong>Your ticket plan</strong><ul>'+r.plan.filter(step=>step.cost>0).map(step=>`<li>${step.type==='weekly'?'Start a 7-day ticket on '+pretty(step.start):'Use PAYG: '+pretty(step.start)+' – '+pretty(step.end)} · ${cash(step.cost)}</li>`).join('')+'</ul>';
        target.querySelector('.result-footnote').before(plan);
      }
    } catch(err) {mobileSummary.hidden=false;mobileSummary.textContent='A little more detail needed ↓ View result';target.innerHTML=`<div class="eyebrow">LET’S CHECK YOUR DETAILS</div><h2>A little more detail.</h2><p class="error">${esc(err.message)}</p><p class="result-intro">Adjust your choices above or beside this result. <a href="https://tfl.gov.uk/fares/find-fares/tube-and-rail-fares/single-fare-finder" target="_blank" rel="noopener">Check a fare with TfL ↗</a></p>`;}
  }
  form.addEventListener('submit',e=>e.preventDefault());
  form.addEventListener('input',e=>{
    if(e.target.dataset.day!==undefined){const day=Number(e.target.dataset.day),field=e.target.dataset.field;weekState[day]={...dayValue(day),usual:false,[field]:e.target.type==='checkbox'?e.target.checked:e.target.type==='number'?e.target.valueAsNumber:field==='from'||field==='to'?Number(e.target.value):e.target.value};}
    if(e.target.name==='day-count') selectedDays=order.slice(0,Number(e.target.value));
    if(e.target.closest('#weekday-picker')) selectedDays=Array.from(document.querySelectorAll('#weekday-picker input:checked'),el=>Number(el.value));
    if(e.target.id==='rail-type'&&e.target.value==='special') $('exact').checked=true;
    render();
  });
  form.addEventListener('click',e=>{
    const usual=e.target.closest('[data-usual-day]'),off=e.target.closest('[data-off-day]'),copy=e.target.closest('[data-copy-day]');
    if(usual){weekState[Number(usual.dataset.usualDay)]={usual:true};render();return;}
    if(off){weekState[Number(off.dataset.offDay)]={...usualDay(),usual:false,rail:0,bus:0};render();return;}
    if(copy){const source={...dayValue(Number(copy.dataset.copyDay)),usual:false},targets=copy.dataset.target==='all'?order:[1,2,3,4,5];targets.forEach(day=>weekState[day]={...source});render();return;}
    const button=e.target.closest('[data-count]');if(!button)return;
    const field=$(button.dataset.count),value=Number.isFinite(field.valueAsNumber)?field.valueAsNumber:0;
    field.value=Math.max(0,Math.min(12,value+Number(button.dataset.change)));
    field.dispatchEvent(new Event('input',{bubbles:true}));
  });
  $('week-toggle').addEventListener('click',()=>{
    if(!weekState)weekState=Object.fromEntries(order.map(day=>[day,selectedDays.includes(day)?{usual:true}:{...usualDay(),usual:false,rail:0,bus:0}]));
    weekMode=!weekMode;render();
  });
  function toggle(button,panel){$(button).addEventListener('click',()=>{const open=$(panel).hidden;$(panel).hidden=!open;$(button).setAttribute('aria-expanded',open);});}
  toggle('map-toggle','map-panel');toggle('days-toggle','weekday-picker');
  $('zone-map').addEventListener('click',e=>{const button=e.target.closest('[data-zone]');if(!button)return;$(nextMap+'-zone').value=button.dataset.zone;nextMap=nextMap==='from'?'to':'from';render();});
  $('special-link').addEventListener('click',()=>{$('details').open=true;});
  function shareURL(){
    if(!resultReady)throw Error('Complete your comparison before sharing it.');
    const state={v:1,fares:F.version,values:Object.fromEntries(LondonSharing.values.map(id=>[id,$(id).value])),checks:Object.fromEntries(LondonSharing.checks.map(id=>[id,$(id).checked])),days:selectedDays.slice(),timing:form.elements.timing.value,weekMode,week:weekMode?Object.fromEntries(order.map(day=>[day,{...dayValue(day)}])):null};
    return LondonSharing.url(state,document.querySelector('link[rel="canonical"]').href);
  }
  $('copy-comparison').addEventListener('click',async()=>{
    try{const url=shareURL();$('comparison-link').value=url;try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(url);$('share-status').textContent='Copied! Send the link to reopen this comparison.';}catch{$('comparison-link').hidden=false;$('comparison-link-label').hidden=false;$('comparison-link').focus();$('comparison-link').select();$('share-status').textContent='Select and copy the comparison link above.';}window.LondonAnalytics?.share();}catch(e){$('share-status').textContent=e.message;}
  });
  $('native-share').addEventListener('click',async()=>{try{await navigator.share({title:'My London travel comparison',text:'Travelcard or pay as you go? Here is my travel week, with current estimates.',url:shareURL()});window.LondonAnalytics?.share();}catch(e){if(e.name!=='AbortError')$('share-status').textContent='Sharing is unavailable. Use “Copy my comparison link”.';}});
  function restoreComparison(){
    try{const state=LondonSharing.decode(location.hash);if(!state)return;for(const id of LondonSharing.values)$(id).value=state.values[id];for(const id of LondonSharing.checks)$(id).checked=state.checks[id];form.elements.timing.value=state.timing;selectedDays=state.days.slice();weekMode=state.weekMode;weekState=state.weekMode?Object.fromEntries(order.map(day=>[day,{...state.week[day],usual:false}])):null;
      $('shared-notice').hidden=false;$('shared-notice').textContent=state.fares===F.version?'Shared travel choices restored. All estimates have been recalculated.':'Shared travel choices restored using the latest available fare data; prices may differ from the original comparison.';
    }catch(e){$('shared-notice').hidden=false;$('shared-notice').textContent=e.message+' Your usual-day defaults are shown instead.';}
  }
  window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#compare=')){restoreComparison();render();}});
  $('reset').addEventListener('click',()=>{HTMLFormElement.prototype.reset.call(form);form.querySelectorAll('details').forEach(el=>el.open=false);selectedDays=[1,2,3];weekMode=false;weekState=null;$('start-date').value=today();$('to-zone').value='2';nextMap='from';$('shared-notice').hidden=true;if(location.hash.startsWith('#compare='))history.replaceState(null,'',location.pathname+location.search);render();});
  restoreComparison();
  render();
})();
