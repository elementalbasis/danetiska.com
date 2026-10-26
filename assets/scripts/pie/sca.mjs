// Academy implementation of the documented SCA² notation. No user regex/eval.
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const lines = s => s.normalize('NFC').split(/\r?\n/).map((text,i)=>({text:text.trim(),line:i+1})).filter(x=>x.text&&!x.text.startsWith('*')&&!x.text.startsWith('//'));
export function compile(config={}) {
  const rewrites=lines(config.rewrites||'').map(({text,line})=>{
    const pair=text.split('|');
    if(pair.length!==2||!pair[0]||!pair[1]) throw Error(`Rewrite line ${line}: use source|replacement.`);
    return pair;
  });
  const rewrite=s=>rewrites.reduce((v,[a,b])=>v.split(a).join(b),s);
  const categories=new Map();
  for(const {text,line} of lines(rewrite(config.categories||''))) {
    const [key,...rest]=text.split('=');const value=rest.join('=');
    if([...key].length!==1||!value||rest.length!==1) throw Error(`Category line ${line}: use a single symbol, e.g. V=aeiou.`);
    if(categories.has(key)) throw Error(`Category line ${line}: ${key} is already defined.`);
    categories.set(key,[...value]);
  }
  function pattern(source,environment=false,boundary='(?:^|$)') {
    let i=0;
    function sequence(nested=false) {
      let out='';
      while(i<source.length) {
        const c=source[i++];
        if(c===')') {if(!nested)throw Error('Unmatched closing parenthesis.');return out;}
        if(c==='(') {if(!environment)throw Error('Optional elements belong in environments.');out+='(?:'+sequence(true)+')?';}
        else if(c==='[') {
          let options=[];
          while(i<source.length&&source[i]!==']') {const x=source[i++];options.push(...(environment&&categories.has(x)?categories.get(x):[x]));}
          if(source[i++]!==']'||!options.length)throw Error('Unclosed or empty bracket category.');
          out+='(?:'+options.map(x=>x==='#'&&environment?boundary:escape(x)).join('|')+')';
        } else if(c==='#'&&environment) out+=boundary;
        else if(c==='…'&&environment) out+='.*';
        else if(categories.has(c))out+='(?:'+categories.get(c).map(escape).join('|')+')';
        else out+=escape(c);
      }
      if(nested)throw Error('Unclosed optional environment.');return out;
    }
    return sequence();
  }
  const rules=[];
  for(const {text:raw,line} of lines(rewrite(config.changes||''))) {
    if(raw.startsWith('-*'))continue;
    try {
      const fields=raw.replace('→','/').split('/');
      if(fields.length<3||fields.length>4)throw Error('Use target/replacement/environment[/exception].');
      let [from,to,env,except]=fields;
      if(env==='²')env='_²';
      if(env.split('_').length!==2||except!==undefined&&except.split('_').length!==2)throw Error('Each environment needs exactly one underscore.');
      if(!from&&(!to||env==='_'))throw Error('Insertion needs a replacement and a context.');
      if(raw.length>500)throw Error('Rule exceeds 500 characters.');
      // Validate contexts now; gemination is compiled for the actual matched segment.
      for(const context of [env,except].filter(x=>x!==undefined)) for(const half of context.split('_'))pattern(half,true);
      const first=[...from][0], mapping=categories.get(first);
      const variants=mapping?mapping.map((c,index)=>({source:c+from.slice(first.length),index})): [{source:from,index:0}];
      rules.push({line,raw,env,except,to,mapping,variants:variants.map(v=>({...v,re:new RegExp('^(?:'+pattern(v.source)+')','u')}))});
    } catch(e) {throw Error(`Sound change line ${line}: ${e.message}`);}
  }
  function environment(context,word,start,end,match) {
    if(context===undefined)return false;
    const [left,right]=context.split('_');
    const repeat=[...match].at(-1)||'';
    const prepare=(s,boundary)=>pattern(s.replaceAll('²',repeat),true,boundary);
    return new RegExp('(?:'+prepare(left,'^')+')$','u').test(word.slice(0,start)) && new RegExp('^(?:'+prepare(right,'$')+')','u').test(word.slice(end));
  }
  function replacement(rule,match,index) {
    if(rule.to==='\\\\')return [...match].reverse().join('');
    let result='';
    for(const c of rule.to) {
      if(c==='²')result += [...result].at(-1)||'';
      else result+=rule.mapping&&categories.has(c)?categories.get(c)[index]||'':c;
    }
    return result;
  }
  function applyWord(word,trace) {
    for(const rule of rules) {
      let out='',cursor=0;
      while(cursor<=word.length) {
        let matched=false;
        for(const v of rule.variants) {
          const m=v.re.exec(word.slice(cursor));
          if(!m)continue;
          const end=cursor+m[0].length;
          if(!environment(rule.env,word,cursor,end,m[0])||environment(rule.except,word,cursor,end,m[0]))continue;
          out+=replacement(rule,m[0],v.index);matched=true;
          if(end>cursor){cursor=end;break;}
          // An insertion consumes a boundary once and then advances over the next code point.
          if(cursor<word.length){const cp=String.fromCodePoint(word.codePointAt(cursor));out+=cp;cursor+=cp.length;}else cursor++;
          break;
        }
        if(!matched) {
          if(cursor===word.length)break;
          const cp=String.fromCodePoint(word.codePointAt(cursor));out+=cp;cursor+=cp.length;
        }
      }
      if(Array.isArray(trace)&&out!==word)trace.push({rule:rule.raw,output:out});
      word=out;
      if(word.length>10000)throw Error('A rule expanded this form beyond 10,000 characters.');
    }
    return word;
  }
  function transform(input,trace) {
    const [word,...gloss]=String(input).normalize('NFC').replace(/^\*/, '').split(' ‣ ');
    let output=rewrite(word).split(/(\s+)/).map(w=>/\s/.test(w)?w:applyWord(w,trace)).join('');
    if(config.rewriteOutput!==false)for(const [a,b] of [...rewrites].reverse())output=output.split(b).join(a);
    return output+(gloss.length?' ‣ '+gloss.join(' ‣ '):'');
  }
  return {transform,ruleCount:rules.length};
}
