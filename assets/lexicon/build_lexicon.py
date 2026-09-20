#!/usr/bin/env python3
"""Build HTML and XeLaTeX from Danetian @tag(...) dictionary files. Python 3 only."""
import argparse
import collections
import html
import json
from pathlib import Path
import re
import sys
import unicodedata

LANG = {
    'pie': 'PIE', 'lat': 'Lat.', 'grc': 'Anc. Gr.', 'grk': 'Anc. Gr.',
    'rus': 'Rus.', 'eng': 'Eng.', 'fra': 'Fr.', 'dnt': 'Dan.',
    'dan': 'Danish', 'ger': 'Ger.', 'ita': 'It.', 'cat': 'Cat.',
    'ara': 'Ar.', 'per': 'Pers.', 'bg': 'Bulg.', 'kyr': 'Kyrg.',
    'tur': 'Turk.', 'protrk': 'Proto-Turkic', 'protung': 'Proto-Tungusic',
    'av': 'Av.',
}
TWO_ARGS = {'grc', 'grk', 'rus', 'ara', 'per', 'bg', 'kyr', 'av', 'ex'}
ZERO_ARGS = {'cf', 'etc', 'ono', 'unknown'}
ONE_ARGS = (set(LANG) - TWO_ARGS) | {'par', 'field', 'reg', 'chem'}
TYPES = set('m f n mf v adj adv num pron conj intj suf prep+gen prep+acc prep+loc prep+abl prep+dat prep+ins'.split())
TAG = re.compile(r'@([a-z]+)(?:\[([^\]]+)\])?\(')
NAME = re.compile(r'[A-Za-z]+')
WORD = re.compile(r'[\w.:-]+', re.UNICODE)


def balanced(s, start, left, right):
    if start >= len(s) or s[start] != left:
        raise ValueError('expected ' + left)
    depth = 1
    for i in range(start + 1, len(s)):
        if s[i] == left:
            depth += 1
        elif s[i] == right:
            depth -= 1
            if depth == 0:
                return s[start + 1:i], i + 1
    raise ValueError('unclosed ' + left)


def tags(line):
    result, i = [], 0
    while i < len(line):
        if line[i].isspace():
            i += 1
            continue
        m = TAG.match(line, i)
        if not m:
            raise ValueError('unexpected text near ' + repr(line[i:i + 35]))
        value, i = balanced(line, m.end() - 1, '(', ')')
        result.append((m[1], m[2], value))
    return result


def inline(s):
    """Parse nested inline notation; text nodes keep literal punctuation."""
    nodes, i = [], 0
    while i < len(s):
        c = s[i]
        if c in '$&':
            if i + 1 < len(s) and s[i + 1] == '{':
                value, j = balanced(s, i + 1, '{', '}')
            else:
                m = WORD.match(s, i + 1)
                if not m:
                    nodes.append(('text', c)); i += 1; continue
                value, j = m[0], m.end()
            nodes.append(('gloss' if c == '$' else 'silent', inline(value)))
            i = j
        elif c == '\\':
            m = NAME.match(s, i + 1)
            if not m:
                nodes.append(('text', c)); i += 1; continue
            name, j, args = m[0], m.end(), []
            while j < len(s) and s[j] == '{':
                value, j = balanced(s, j, '{', '}')
                args.append(inline(value))
            nodes.append(('macro', name, args)); i = j
        elif c == '{':
            value, i = balanced(s, i, '{', '}')
            nodes.append(('group', inline(value)))
        elif c == '}':
            raise ValueError('unexpected closing brace')
        else:
            j = i + 1
            while j < len(s) and s[j] not in '$&\\{}':
                j += 1
            nodes.append(('text', s[i:j])); i = j
    return nodes


def plain(nodes):
    return ''.join(n[1] if n[0] == 'text' else
                   plain(n[1]) if n[0] in ('gloss', 'silent', 'group') else
                   ' '.join(plain(a) for a in n[2]) for n in nodes)


def tex(s):
    escapes = {'\\': r'\textbackslash{}', '{': r'\{', '}': r'\}',
               '$': r'\$', '&': r'\&', '#': r'\#', '%': r'\%',
               '_': r'\_', '~': r'\textasciitilde{}', '^': r'\textasciicircum{}'}
    return ''.join(escapes.get(c, c) for c in s)


def render(nodes, fmt):
    esc = html.escape if fmt == 'html' else tex
    out = []
    for n in nodes:
        kind = n[0]
        if kind == 'text':
            out.append(esc(n[1])); continue
        if kind == 'group':
            out.append(render(n[1], fmt)); continue
        if kind in ('gloss', 'silent'):
            value = render(n[1], fmt)
            if fmt == 'html':
                out.append('<span class="' + ('gloss' if kind == 'gloss' else 'silent-gloss') +
                           '"' + (' hidden' if kind == 'silent' else '') + '>' + value + '</span>')
            elif kind == 'gloss':
                out.append(value)
            else:
                # Remove the separators introduced only for a hidden index term.
                while out and not out[-1].rstrip(' ,;'):
                    out.pop()
                if out:
                    out[-1] = out[-1].rstrip(' ,;')
            continue
        name, raw = n[1], n[2]
        args = [render(a, fmt) for a in raw]
        if name in LANG and args:
            label = LANG[name]
            form = args[0]
            if name in ('pie', 'protrk', 'protung'):
                form = '*' + form
            translit = args[1] if len(args) > 1 else ''
            if fmt == 'html':
                attrs = ' dir="rtl"' if name in ('ara', 'per', 'av') else ''
                out.append(esc(label) + ' <i' + attrs + '>' + form + '</i>' +
                           (' <i>' + translit + '</i>' if translit else ''))
            else:
                script = 'arabic' if name in ('ara', 'per') else 'avestan' if name == 'av' else 'greek' if name in ('grc', 'grk') else 'roman'
                out.append(r'\LexLanguage{' + tex(label) + '}{' + script + '}{' + form + '}{' + translit + '}')
        elif name in ('par', 'field', 'reg') and args:
            out.append(('(' + args[0] + ')') if name == 'par' else
                       ('<i>(' + args[0] + ')</i>' if fmt == 'html' else r'\textit{(' + args[0] + ')}'))
        elif name == 'ex' and len(args) == 2:
            out.append(('<span class="sample-phrase"><i>' + args[0] + '</i> “' + args[1] + '”</span>') if fmt == 'html' else r'\textit{' + args[0] + '} “' + args[1] + '”')
        elif name == 'chem' and args:
            out.append('(atomic number ' + args[0] + ')')
        elif name in ZERO_ARGS:
            out.append({'cf': 'cf.', 'etc': 'etc.', 'ono': 'onomatopoeic', 'unknown': 'unknown'}[name])
        else:
            # Unknown notation is visible rather than silently discarded.
            out.append(esc('\\' + name) + ''.join('{' + a + '}' for a in args))
        # Preserve unexpected extra arguments instead of losing source content.
        expected = 2 if name in TWO_ARGS else 0 if name in ZERO_ARGS else 1
        if name in LANG or name in ONE_ARGS or name in TWO_ARGS or name in ZERO_ARGS:
            if len(args) > expected:
                out.extend(' {' + a + '}' for a in args[expected:])
    return ''.join(out)


def check_inline(nodes, where, warnings):
    for n in nodes:
        if n[0] in ('gloss', 'silent', 'group'):
            check_inline(n[1], where, warnings)
        elif n[0] == 'macro':
            name, args = n[1:]
            expected = 2 if name in TWO_ARGS else 1 if name in ONE_ARGS else 0 if name in ZERO_ARGS else None
            if expected is None:
                warnings.append(f'{where}: unknown inline macro \\{name}')
            elif len(args) != expected:
                warnings.append(f'{where}: \\{name} expects {expected} argument(s), got {len(args)}')
            if name == 'grk':
                warnings.append(f'{where}: \\grk treated as alias of \\grc; correct source spelling when convenient')
            for a in args:
                check_inline(a, where, warnings)


def ref(s):
    m = re.fullmatch(r'(.*?)\[(\d+)\]', s.strip())
    return (m[1], int(m[2])) if m else (s.strip(), None)


def sort_key(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s.casefold()) if not unicodedata.combining(c)).lstrip('-')


def load(paths):
    entries, synonyms, warnings = [], [], []
    for path in paths:
        for lineno, line in enumerate(path.read_text(encoding='utf-8').splitlines(), 1):
            if not line.strip() or line.lstrip().startswith('%'):
                continue
            where = f'{path}:{lineno}'
            try:
                ts = tags(line)
                if ts[0][0] == 'syn':
                    if len(ts) != 1:
                        raise ValueError('synonym group must occupy its own line')
                    synonyms.append(([ref(x) for x in ts[0][2].split(',')], where)); continue
                if ts[0][0] not in ('key', 'expr'):
                    raise ValueError('entry must start with @key or @expr')
                entry = {'lemma': ts[0][2], 'kind': ts[0][0], 'where': where, 'fields': [], 'links': [], 'senses': [], 'synonyms': [], 'expressions': []}
                reserved = {int(i) for t, i, v in ts if t == 'def' and i and i.isdigit()}
                next_id, used, current_type = 1, set(), ''
                for index, (tag, option, value) in enumerate(ts[1:], 1):
                    if tag == 'link':
                        entry['links'].extend(ref(x) for x in value.split(',')); continue
                    if tag in ('key', 'expr'):
                        warnings.append(f'{where}: additional @{tag}; retained as a note (possible @ety typo)')
                        tag = 'note'
                    if tag not in ('ety', 'pp', 'infl', 'typ', 'def', 'note', 'see', 'rel', 'syn'):
                        raise ValueError('unknown tag @' + tag)
                    if option is not None and (tag not in ('def', 'infl') or not option.isdigit()):
                        raise ValueError('unsupported option on @' + tag)
                    nodes = inline(value); check_inline(nodes, where, warnings)
                    field = {'tag': tag, 'option': option, 'nodes': nodes, 'raw': value}
                    if tag == 'typ':
                        current_type = value
                        if value not in TYPES:
                            warnings.append(f'{where}: unknown grammatical type {value}')
                    if tag == 'def':
                        while next_id in reserved or next_id in used:
                            next_id += 1
                        sid = int(option) if option else next_id
                        if sid in used:
                            raise ValueError('duplicate sense number ' + str(sid))
                        used.add(sid); field['id'] = sid; field['type'] = current_type
                        entry['senses'].append(field)
                    entry['fields'].append(field)
                entries.append(entry)
            except ValueError as e:
                raise ValueError(f'{where}: {e}') from e
    bylemma = collections.defaultdict(list)
    for i, e in enumerate(entries):
        e['id'] = f'entry-{i + 1}'
        if e['kind'] == 'key':
            bylemma[e['lemma']].append(e)
    for lemma, es in bylemma.items():
        if len(es) > 1:
            warnings.append(f'duplicate headword {lemma}: preserved as {len(es)} separate entries')
    for e in entries:
        if e['kind'] == 'expr':
            for lemma, sid in e['links']:
                if lemma in bylemma:
                    for parent in bylemma[lemma]:
                        parent['expressions'].append(e)
                else:
                    warnings.append(f'{e["where"]}: unresolved expression link {lemma}')
    for members, where in synonyms:
        for lemma, sid in members:
            if lemma not in bylemma:
                warnings.append(f'{where}: unresolved synonym {lemma}'); continue
            for e in bylemma[lemma]:
                if sid and sid not in {s['id'] for s in e['senses']}:
                    warnings.append(f'{where}: unresolved sense {lemma}[{sid}]')
                e['synonyms'].append((sid, [(l, s) for l, s in members if (l, s) != (lemma, sid)]))
    return sorted(entries, key=lambda e: sort_key(e['lemma'])), synonyms, warnings, bylemma


def reference(r, fmt, bylemma):
    lemma, sid = r
    label = lemma + (f' [{sid}]' if sid is not None else '')
    if fmt == 'html':
        target = bylemma.get(lemma)
        return ('<a href="#' + target[0]['id'] + (f'-sense-{sid}' if sid else '') + '">' + html.escape(label) + '</a>') if target else html.escape(label)
    return tex(label)


def entry_html(e, bylemma):
    out = [f'<article class="entry" id="{e["id"]}">', '<h1 class="lemma">' + html.escape(e['lemma']) + '</h1>']
    if e['kind'] == 'expr':
        out.append('<p class="pos">expression</p>')
    opened = False
    for f in e['fields']:
        tag, value = f['tag'], render(f['nodes'], 'html')
        if tag == 'typ': continue
        if tag == 'def':
            if not opened: out.append('<section class="sense-block"><ol>'); opened = True
            out.append(f'<li id="{e["id"]}-sense-{f["id"]}" value="{f["id"]}"><span class="pos">' + html.escape(f['type']) + '</span> ' + value + '</li>')
        else:
            if opened: out.append('</ol></section>'); opened = False
            if tag == 'infl':
                stems = [x.strip() for x in f['raw'].split(',')]
                out.append('<div class="infl" data-inflection-template="' + html.escape(f['option'] or '') + '" data-root1="' + html.escape(stems[0], quote=True) + '" data-root2="' + html.escape(stems[-1], quote=True) + '"></div>')
            else:
                cls = {'ety': 'etymology', 'pp': 'principal-parts'}.get(tag, tag)
                out.append('<p class="' + cls + '">' + value + '</p>')
    if opened: out.append('</ol></section>')
    for sid, rs in e['synonyms']:
        out.append('<p class="related-words-group">Synonyms' + (f' (sense {sid})' if sid else '') + ': ' + ', '.join(reference(r, 'html', bylemma) for r in rs) + '</p>')
    if e['expressions']:
        out.append('<section class="expr-block"><h3>Expressions</h3><ul>')
        for ex in e['expressions']:
            out.append('<li><a href="#' + ex['id'] + '">' + html.escape(ex['lemma']) + '</a> — ' + '; '.join(render(s['nodes'], 'html') for s in ex['senses']) + '</li>')
        out.append('</ul></section>')
    out.append('</article>')
    return '\n'.join(out)


def entry_tex(e, bylemma):
    out = [r'\LexEntry{' + tex(e['lemma']) + '}']
    if e['kind'] == 'expr': out.append(r'\LexType{expression}')
    for f in e['fields']:
        tag, value = f['tag'], render(f['nodes'], 'tex')
        if tag == 'ety': out.append(r'\LexEtymology{' + value + '}')
        elif tag == 'typ': out.append(r'\LexType{' + value.replace('+', ' + ') + '}')
        elif tag == 'pp': out.append(r'\LexParts{' + value + '}')
        elif tag == 'infl': continue  # Metadata drives website tables; no invented TeX paradigms.
        elif tag == 'def':
            out.append(r'\LexSense{' + (str(f['id']) if len(e['senses']) > 1 or f['option'] else '') + '}{' + value + '}')
        else: out.append(r'\LexNote{' + value + '}')
    for sid, rs in e['synonyms']:
        out.append(r'\LexNote{Syn.' + (f' ({sid})' if sid else '') + ': ' + ', '.join(reference(r, 'tex', bylemma) for r in rs) + '}')
    if e['expressions']:
        out.append(r'\LexNote{Expressions: ' + '; '.join(tex(x['lemma']) for x in e['expressions']) + '}')
    out.append(r'\par')
    return '\n'.join(out)


def index_terms(nodes):
    for n in nodes:
        if n[0] in ('gloss', 'silent'):
            yield plain(n[1])
        elif n[0] == 'group':
            yield from index_terms(n[1])
        elif n[0] == 'macro':
            for a in n[2]:
                yield from index_terms(a)


def write_if_changed(path, text):
    if not path.exists() or path.read_text(encoding='utf-8') != text:
        temp = path.with_suffix(path.suffix + '.tmp')
        temp.write_text(text, encoding='utf-8'); temp.replace(path)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--input', type=Path, default=Path('raw') if Path('raw').is_dir() else Path('.'))
    ap.add_argument('--output', type=Path, default=Path('build'))
    ap.add_argument('--check', action='store_true')
    args = ap.parse_args()
    paths = sorted(p for p in args.input.glob('*.txt') if p.name.lower() not in ('readme.txt', 'lexicon.txt', 'sample.txt'))
    if not paths: ap.error(f'no dictionary .txt files in {args.input}')
    try: entries, synonyms, warnings, bylemma = load(paths)
    except (ValueError, OSError) as e:
        print(e, file=sys.stderr); return 1
    for w in warnings: print('Warning: ' + w, file=sys.stderr)
    count = sum(len(e['senses']) for e in entries)
    print(f'{len(entries)} entries; {count} definitions; {len(synonyms)} synonym groups.')
    if args.check: return 0
    args.output.mkdir(parents=True, exist_ok=True)
    # HTML stays a fragment so existing site wrappers can consume it.
    write_if_changed(args.output / 'lexicon.html', '\n\n'.join(entry_html(e, bylemma) for e in entries) + '\n')
    write_if_changed(args.output / 'lexicon.tex', '\n\n'.join(entry_tex(e, bylemma) for e in entries) + '\n')
    reverse = collections.defaultdict(set)
    for e in entries:
        for sense in e['senses']:
            for term in index_terms(sense['nodes']):
                reverse[term].add((e['lemma'], sense['id'] if len(e['senses']) > 1 else None))
    reverse_tex = []
    for term in sorted(reverse, key=sort_key):
        refs = sorted(reverse[term], key=lambda r: (sort_key(r[0]), r[1] or 0))
        reverse_tex.append(r'\LexEntry{' + tex(term) + '} ' + '; '.join(reference(r, 'tex', bylemma) for r in refs) + r'.\par')
    write_if_changed(args.output / 'english.tex', '\n\n'.join(reverse_tex) + '\n')
    write_if_changed(args.output / 'counts.tex', f'\\newcommand{{\\EntryCount}}{{{len(entries):,}}}\n\\newcommand{{\\SenseCount}}{{{count:,}}}\n')
    write_if_changed(args.output / 'warnings.txt', '\n'.join(warnings) + '\n')
    write_if_changed(args.output / 'source-records.json', json.dumps({'files': [str(p) for p in paths], 'entries': entries, 'synonym_groups': synonyms}, ensure_ascii=False, indent=2) + '\n')
    return 0


if __name__ == '__main__':
    sys.exit(main())
