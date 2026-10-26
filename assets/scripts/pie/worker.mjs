import {compile} from './sca.mjs';
let data, entries=[], engine, config, cache;
const normalize=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replaceAll('*','');
const label=s=>s.replaceAll('-', ' ');
// Sort the displayed forms, ignoring affix dashes and optional-segment parentheses.
const alphabet=new Intl.Collator('en');
const sortKey=s=>s.replace(/[\p{Dash_Punctuation}()]/gu,'');
function convert(s) {if(!cache.has(s))cache.set(s,engine.transform(s));return cache.get(s);}
function inlinePie(s) {return s.replace(/\*{1,2}([\p{L}\p{M}₁₂₃ʰʷ-]+(?:\([\p{L}\p{M}₁₂₃ʰʷ-]+\))?)/gu,(_,w)=>convert(w));}
function convertParts(parts) {
  const merged=[];
  for(const [text,pie] of parts) {
    if(merged.length&&merged.at(-1)[1]===pie)merged.at(-1)[0]+=text;
    else merged.push([text,pie]);
  }
  return merged.map(([s,pie])=>pie?convert(s):inlinePie(s)).join('');
}
self.onmessage=async({data:message})=>{
  try {
    if(message.type==='apply') {
      if(!data){const response=await fetch(message.url);if(!response.ok)throw Error('Dictionary download failed. Please retry.'); data=await response.json();}
      engine=compile(message.config);config=message.config;cache=new Map();
      entries=data.entries.map((e,id)=>{
        const word=convert(e.word);
        const forms=e.forms.filter(f=>!['-','—','?'].includes(f.form)).map(f=>convert(f.form));
        return {id,word,pos:e.pos,search:normalize([word,e.word,...forms,...e.senses.flatMap(s=>s.glosses)].join('\n'))};
      }).sort((a,b)=>alphabet.compare(sortKey(a.word),sortKey(b.word)));
      postMessage({type:'ready',count:entries.length,rules:engine.ruleCount,config});
    } else if(message.type==='search') {
      const q=normalize(message.query.trim()),pos=message.pos;
      let matches=entries.filter(e=>(!pos||e.pos===pos)&&(!q||e.search.includes(q)));
      // Exact transformed headwords first, followed by inflection/gloss matches.
      if(q)matches.sort((a,b)=>Number(normalize(b.word)===q)-Number(normalize(a.word)===q));
      const page=Math.max(0,Math.min(message.page,Math.ceil(matches.length/12)-1));
      const results=matches.slice(page*12,page*12+12).map(index=>{
        const e=data.entries[index.id];
        return {id:index.id,word:index.word,pos:e.pos,senses:e.senses.map(s=>({...s,glosses:s.glosses.map(g=>inlinePie(g))})),url:'https://en.wiktionary.org/wiki/'+encodeURIComponent('Reconstruction:Proto-Indo-European/'+e.word),tables:(data.tables[e.word]||[]).map(rows=>rows.map(row=>row.map(c=>({...c,text:convertParts(c.p),p:undefined})))),forms:e.forms.map(f=>({form:['-','—'].includes(f.form)?'':f.form==='?'?'?':convert(f.form),tags:f.tags.map(label)}))};
      });
      postMessage({type:'results',request:message.request,total:matches.length,page,results});
    } else if(message.type==='preview') {
      const previewEngine=compile(message.config);
      postMessage({type:'preview',results:message.words.split(/\r?\n/).filter(Boolean).map(w=>previewEngine.transform(w))});
    }
  } catch(e){postMessage({type:'error',message:e.message,action:message.type});}
};
