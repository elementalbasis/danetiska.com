const root=document.querySelector('#pie-tool');
const $=id=>document.getElementById(id);
const all=selector=>document.querySelectorAll(selector);
function applyStatus(text) {for(const id of ['sca-status','pie-apply-status'])$(id).textContent=text;}
function applying(value) {for(const button of all('[data-pie-apply]'))button.disabled=value;}
const storageKey='academy.pie.sca2.v1';
const empty={categories:'V=aeiouāēīōūéóáíúḗṓ',rewrites:'',changes:'',rewriteOutput:true};
let worker, pendingWorker, previewWorker, page=0,total=0,request=0,searchTimer,applied,appliedMessage;
function node(tag,text,className) {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
function switchTab(id,focus=false) {
  for(const name of ['dictionary','sca']) {
    const selected=name===id,tab=$(name+'-tab');
    tab.setAttribute('aria-selected',String(selected));tab.setAttribute('aria-pressed',String(selected));tab.tabIndex=selected?0:-1;
    $(name+'-panel').hidden=!selected;
  }
  if(focus)$(id+'-tab').focus();
}
for(const id of ['dictionary','sca']) {
  $(id+'-tab').onclick=()=>switchTab(id);
  $(id+'-tab').onkeydown=e=>{
    if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {e.preventDefault();switchTab(e.key==='Home'?'dictionary':e.key==='End'?'sca':id==='dictionary'?'sca':'dictionary',true);}
  };
}
$('edit-rules').onclick=()=>{switchTab('sca');$('sca-changes').focus();};
function readDraft() {return {categories:$('sca-categories').value,rewrites:$('sca-rewrites').value,changes:$('sca-changes').value,rewriteOutput:$('sca-rewrite-output').checked};}
function draftMatchesApplied() {
  if(!applied)return false;
  const draft=readDraft();
  return ['categories','rewrites','changes'].every(key=>draft[key]===(applied[key]||''))&&draft.rewriteOutput===(applied.rewriteOutput!==false);
}
function syncDraftStatus() {
  if(!draftMatchesApplied())applyStatus('Some sound changes haven’t been applied yet.');
  else applyStatus(pendingWorker?'Applying rules to the dictionary…':appliedMessage);
}
function fillDraft(c) {for(const key of ['categories','rewrites','changes'])$('sca-'+key).value=c[key]||'';$('sca-rewrite-output').checked=c.rewriteOutput!==false;syncDraftStatus();}
for(const key of ['categories','rewrites','changes'])$('sca-'+key).addEventListener('input',syncDraftStatus);
$('sca-rewrite-output').addEventListener('change',syncDraftStatus);
function showRules(c,count) {
  $('rule-count').textContent=`${count} sound change${count===1?'':'s'} applied`;
  const box=$('applied-rules');box.replaceChildren();
  for(const [key,title] of [['categories','Categories'],['rewrites','Rewrite rules'],['changes','Sound changes']])if(c[key].trim()) {
    const group=node('div');group.append(node('h3',title),node('pre',c[key]));box.append(group);
  }
  if(!count)box.append(node('p','No sound changes applied. Forms retain their source spelling.','muted'));
  box.append(node('p',c.rewriteOutput?'Rewrite rules reversed on output.':'Rewrite rules apply to input only.','muted'));
}
function search(reset=false) {
  if(!worker)return;
  if(reset)page=0;
  $('pie-results').setAttribute('aria-busy','true');
  worker.postMessage({type:'search',request:++request,query:$('pie-query').value,pos:$('pie-pos').value,page});
}
function renderTable(rows,word,index) {
  const scroll=node('div',undefined,'pie-table-scroll');scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label',`${word}: paradigm ${index+1}`);
  const table=node('table',undefined,'infl-table');table.append(node('caption',`Inflection of ${word}${index?' · '+(index+1):''}`));
  const body=node('tbody');
  for(const row of rows) {
    const tr=node('tr');
    for(const cell of row) {
      const el=node(cell.h?'th':'td',/^\s*[-–—]\s*$/.test(cell.text)?'':cell.text||'');
      el.rowSpan=cell.r;el.colSpan=cell.c;
      if(cell.h&&cell.c===1&&row[0]===cell)el.scope='row';
      tr.append(el);
    }
    body.append(tr);
  }
  table.append(body);scroll.append(table);return scroll;
}
function renderEntry(e,renderedLemmas) {
  const article=node('article',undefined,'entry');article.append(node('h2',e.word||'∅','lemma'),node('p',e.pos,'pos'));
  const ol=node('ol',undefined,'sense-block');
  for(const sense of e.senses) {
    if(!sense.glosses.length)continue;
    const li=node('li',sense.glosses.join('; '));
    if(sense.tags.length)li.prepend(node('span',`(${sense.tags.join(', ')}) `,'qualifier'));
    ol.append(li);
  }
  article.append(ol);
  if(e.tables.length&&!renderedLemmas.has(e.url)) {
    const detail=node('details',undefined,'pie-paradigm');detail.append(node('summary','Inflection tables'));
    // Tables are constructed only when expanded, keeping long result pages light.
    detail.addEventListener('toggle',()=>{
      if(detail.open&&detail.children.length===1)e.tables.forEach((t,i)=>detail.append(renderTable(t,e.word,i)));
    });
    article.append(detail);renderedLemmas.add(e.url);
  } else if(!e.tables.length&&e.forms.length) {
    const detail=node('details',undefined,'pie-paradigm');detail.append(node('summary','Recorded inflections'));
    detail.append(node('p','The expanded table was unavailable for this entry. These are the forms and grammatical labels recorded in the extract.','muted'));
    const seen=new Set(),rows=[[{h:true,text:'Grammatical form',r:1,c:1},{h:true,text:'Result',r:1,c:1}]];
    for(const form of e.forms) {
      const label=form.tags.join(', '),key=label+'\0'+form.form;
      if(seen.has(key))continue;seen.add(key);
      rows.push([{h:true,text:label||'Form',r:1,c:1},{h:false,text:form.form,r:1,c:1}]);
    }
    detail.append(renderTable(rows,e.word,0));article.append(detail);
  }
  const p=node('p',undefined,'pie-entry-source'),a=node('a','Wiktionary entry & history');a.href=e.url;a.target='_blank';a.rel='noopener';p.append(a);article.append(p);
  return article;
}
function receive(message) {
  if(message.type==='results'&&message.request===request) {
    page=message.page;total=message.total;
    for(const nav of all('[data-pie-pagination]'))nav.hidden=total===0;
    const seen=new Set();$('pie-results').replaceChildren(...message.results.map(e=>renderEntry(e,seen)));
    $('pie-results').setAttribute('aria-busy','false');
    $('pie-status').textContent=total?`${total.toLocaleString()} ${total===1?'entry':'entries'} · showing ${page*12+1}–${Math.min(page*12+12,total)}`:'No entries found. Try an English meaning or a shorter form.';
    for(const label of all('[data-pie-page]'))label.textContent=total?`Page ${page+1} of ${Math.ceil(total/12)}`:'';
    for(const button of all('[data-pie-prev]'))button.disabled=page===0;
    for(const button of all('[data-pie-next]'))button.disabled=(page+1)*12>=total;
  } else if(message.type==='error') {$('pie-status').textContent=message.message;$('pie-results').setAttribute('aria-busy','false');}
}
function apply(c,initial=false) {
  pendingWorker?.terminate();
  const candidate=new Worker(new URL('./worker.mjs',import.meta.url),{type:'module'});pendingWorker=candidate;
  applyStatus('Applying rules to the dictionary…');applying(true);
  if(initial)$('pie-status').textContent='Loading the expanded dictionary…';
  const timeout=setTimeout(()=>fail('These rules took too long to process. Simplify the draft and apply again.'),60000);
  function fail(message) {clearTimeout(timeout);candidate.terminate();if(pendingWorker===candidate)pendingWorker=null;applying(false);applyStatus(message);if(initial){$('pie-status').textContent=message;$('pie-results').setAttribute('aria-busy','false');}}
  candidate.onerror=()=>fail('The dictionary could not start. Check the connection and apply again.');
  candidate.onmessage=({data:m})=>{
    if(m.type==='error')return fail(m.message);
    if(m.type!=='ready')return;
    clearTimeout(timeout);worker?.terminate();worker=candidate;pendingWorker=null;worker.onmessage=({data})=>receive(data);applied=c;
    showRules(c,m.rules);applying(false);
    try {localStorage.setItem(storageKey,JSON.stringify(c));appliedMessage='Applied and saved in this browser.';} catch {appliedMessage='Applied. This browser could not save the rules.';}
    syncDraftStatus();
    search(true);if(!initial&&draftMatchesApplied())switchTab('dictionary');
  };
  candidate.postMessage({type:'apply',config:c,url:root.dataset.dictionary});
}
$('sca-form').onsubmit=e=>{e.preventDefault();apply(readDraft());};
$('dictionary-apply').onclick=()=>apply(readDraft());
$('pie-search').onsubmit=e=>{e.preventDefault();clearTimeout(searchTimer);search(true);};
$('pie-query').oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>search(true),180);};
$('pie-pos').onchange=()=>search(true);
function changePage(delta) {clearTimeout(searchTimer);page+=delta;search();$('pie-status').scrollIntoView({block:'start'});}
for(const button of all('[data-pie-prev]'))button.onclick=()=>changePage(-1);
for(const button of all('[data-pie-next]'))button.onclick=()=>changePage(1);
$('sca-example').onclick=()=>{fillDraft({...empty,changes:'* Illustrative changes, not a historical reconstruction\nḱ/s/_\nǵ/z/_\no/a/_\nó/á/_\nbʰ/b/_\ndʰ/d/_\ngʰ/g/_\nh₁//_\nh₂/a/_\nh₃/o/_'});};
$('sca-clear').onclick=()=>{fillDraft(empty);};
$('sca-export').onclick=()=>{
  const url=URL.createObjectURL(new Blob([JSON.stringify({format:'academy-sca2-v1',...readDraft()},null,2)],{type:'application/json'}));
  const a=node('a');a.href=url;a.download='pie-sound-changes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
$('sca-import').onchange=async e=>{
  try {
    const file=e.target.files[0];if(!file)return;if(file.size>100000)throw Error('Rule file must be smaller than 100 KB.');
    const c=JSON.parse(await file.text());
    for(const key of ['categories','rewrites','changes'])if(typeof c[key]!=='string')throw Error('Choose an Academy rule export containing categories, rewrites, and changes.');
    fillDraft(c);
  }catch(error){$('sca-status').textContent=error.message;}
  e.target.value='';
};
$('sca-preview').onclick=()=>{
  previewWorker?.terminate();previewWorker=new Worker(new URL('./worker.mjs',import.meta.url),{type:'module'});
  const timeout=setTimeout(()=>{previewWorker.terminate();$('sca-preview-output').textContent='Preview timed out. Simplify the draft rules.';},10000);
  previewWorker.onmessage=({data:m})=>{clearTimeout(timeout);$('sca-preview-output').textContent=m.type==='error'?m.message:m.results.join('\n');previewWorker.terminate();};
  previewWorker.postMessage({type:'preview',config:readDraft(),words:$('sca-test').value});
};
for(const pos of ['adj','adv','conj','det','infix','intj','noun','num','particle','phrase','prefix','pron','root','suffix','verb']) {
  const names={adj:'Adjective',adv:'Adverb',conj:'Conjunction',det:'Determiner',intj:'Interjection',num:'Numeral',pron:'Pronoun'};
  const option=node('option',names[pos]||pos[0].toUpperCase()+pos.slice(1));option.value=pos;$('pie-pos').append(option);
}
let initial=empty;
try {const saved=JSON.parse(localStorage.getItem(storageKey));if(saved&&['categories','rewrites','changes'].every(k=>typeof saved[k]==='string'))initial=saved;}catch{}
fillDraft(initial);apply(initial,true);
fetch(root.dataset.source).then(r=>{if(!r.ok)throw Error();return r.json();}).then(s=>{$('pie-source').textContent=`${s.lemmas.toLocaleString()} headwords · ${s.entries.toLocaleString()} entries · ${s.forms.toLocaleString()} recorded forms. Wiktionary snapshot: ${s.snapshot}; expanded ${s.extracted}. Rendered tables retrieved ${s.retrieved}.`;}).catch(()=>{});
