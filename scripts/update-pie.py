#!/usr/bin/env python3
"""Refresh expanded PIE data. Python stdlib only; cached HTML supports resumable runs."""
import argparse, concurrent.futures, datetime, hashlib, json, pathlib, re, time, urllib.request
from html.parser import HTMLParser
from urllib.parse import quote
ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = 'https://kaikki.org/dictionary/Proto-Indo-European/'
class Node:
    def __init__(self, tag='', attrs=(), parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []
    def text(self):
        return ''.join(c if isinstance(c,str) else c.text() for c in self.children)
    def find(self, tag):
        return [c for c in self.children if isinstance(c,Node) for c in ([c] if c.tag==tag else c.find(tag))]
class Tree(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True); self.root=Node(); self.current=self.root; self.feed(html)
    def handle_starttag(self, tag, attrs):
        n=Node(tag,attrs,self.current); self.current.children.append(n)
        if tag not in ('br','hr','img','meta','link','input','wbr'): self.current=n
    def handle_endtag(self, tag):
        n=self.current
        while n.parent and n.tag!=tag: n=n.parent
        if n.parent: self.current=n.parent
    def handle_data(self, data): self.current.children.append(data)
def parts(node, pie=False):
    if isinstance(node,str): return [[node,pie]] if node else []
    if node.tag in ('style','script','sup'): return []
    pie=pie or node.attrs.get('lang')=='ine-pro'
    if node.tag=='br': return [['\n',False]]
    return [p for c in node.children for p in parts(c,pie)]
def tables(html):
    result=[]
    for table in Tree(html).root.find('table'):
        # PIE inflection tables carry language-marked reconstructed forms.
        if not any(n.attrs.get('lang')=='ine-pro' for n in table.find('span')): continue
        rows=[]
        for row in table.find('tr'):
            if 'vsShow' in row.attrs.get('class','').split(): continue
            cells=[]
            for c in row.children:
                if not isinstance(c,Node) or c.tag not in ('td','th'): continue
                cells.append({'h':c.tag=='th','r':int(c.attrs.get('rowspan','1')),'c':int(c.attrs.get('colspan','1')),'p':parts(c)})
            if cells: rows.append(cells)
        if rows: result.append(rows)
    return result
def get(url):
    req=urllib.request.Request(url,headers={'User-Agent':'DanetianAcademy-PIELexicon/1.0 (https://danetiska.com; academia@danetiska.com)'})
    with urllib.request.urlopen(req,timeout=60) as r: return r.read()
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--source',type=pathlib.Path);ap.add_argument('--cache',type=pathlib.Path,default=ROOT/'.cache/pie');ap.add_argument('--index',type=pathlib.Path);ap.add_argument('--offline',action='store_true');ap.add_argument('--workers',type=int,default=6);args=ap.parse_args()
    args.cache.mkdir(parents=True,exist_ok=True)
    raw=args.source.read_bytes() if args.source else get(SOURCE+'kaikki.org-dictionary-ProtoIndoEuropean.jsonl')
    index=args.index.read_text() if args.index else get(SOURCE+'index.html').decode()
    dates=re.search(r'extracted on (\d{4}-\d{2}-\d{2}).*?dump dated (\d{4}-\d{2}-\d{2})',index,re.S)
    if not dates: raise ValueError('Source dates missing; refusing to publish unverified provenance')
    source_entries=[json.loads(x) for x in raw.splitlines() if x]
    entries=[]
    for e in source_entries:
        forms=[f for f in e.get('forms',[]) if f.get('source')=='inflection' and not set(f.get('tags',[])) & {'table-tags','inflection-template','error-unrecognized-form','romanization'}]
        entries.append({'word':e['word'],'pos':e['pos'],'senses':[{'glosses':s.get('glosses',[]),'tags':s.get('tags',[])} for s in e.get('senses',[])], 'forms':forms})
    words=sorted({e['word'] for e in entries if e['forms']})
    def fetch(word):
        path=args.cache/(hashlib.sha256(word.encode()).hexdigest()+'.html')
        for attempt in range(3):
            try:
                if not path.exists():
                    if args.offline: return word,[]
                    html=get('https://en.wiktionary.org/api/rest_v1/page/html/'+quote('Reconstruction:Proto-Indo-European/'+word,safe=''))
                    if b'<table' not in html: raise ValueError('No rendered tables')
                    path.write_bytes(html)
                return word,tables(path.read_text())
            except Exception as err:
                if attempt==2: return word,[]
                time.sleep(attempt+1)
    rendered={}
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for i,(word,t) in enumerate(pool.map(fetch,words),1):
            rendered[word]=t
            if i%50==0: print(f'Rendered tables: {i}/{len(words)}',flush=True)
    # A rendered page contains every part of speech, so keep tables keyed by lemma.
    out=ROOT/'assets/data/pie';out.mkdir(parents=True,exist_ok=True)
    payload={'entries':entries,'tables':rendered}
    (out/'dictionary.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':'))+'\n')
    metadata={'source':SOURCE,'download':SOURCE+'kaikki.org-dictionary-ProtoIndoEuropean.jsonl','retrieved':str(datetime.date.today()),'sha256':hashlib.sha256(raw).hexdigest(),'entries':len(entries),'lemmas':len({e['word'] for e in entries}),'forms':sum(len(e['forms']) for e in entries),'rendered':sum(bool(t) for t in rendered.values()),'missingTables':[w for w,t in rendered.items() if not t],'license':'CC BY-SA 4.0 and GFDL; Wiktionary contributors','snapshot':dates[2],'extracted':dates[1]}
    (out/'source.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(metadata),flush=True)
if __name__=='__main__': main()
