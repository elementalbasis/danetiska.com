"""Compose indicative periphrases from auxiliaries and supplied participles.

Participles retain their supplied citation form. This module does not infer
participial gender/number agreement or add unrequested moods.
"""
from copy import deepcopy
from itertools import product


def combine(auxiliary, participle):
    auxiliaries = auxiliary if isinstance(auxiliary, list) else [auxiliary]
    participles = participle if isinstance(participle, list) else [participle]
    forms = list(dict.fromkeys(f'{a} {p}' for a, p in product(auxiliaries, participles)))
    return forms[0] if len(forms) == 1 else forms


def add_periphrastic_tenses(table, go, be):
    """Return a copy with fut, plup, and futperf under each voice's ind.

    Use active present imi and active aorist bum as the auxiliaries in both
    voices. The lexical verb supplies the voice-specific participle. Existing
    manually supplied periphrastic tenses take precedence.
    """
    result = deepcopy(table)
    present_go = go['act']['ind']['pres']
    aorist_be = be['act']['ind']['aor']
    for voice in ('act', 'pas'):
        if voice not in result:
            continue
        forms = result[voice]
        participles = forms.get('part', {})
        for tense, auxiliary, participle_key in (
            ('fut', present_go, 'pres'),
            ('plup', aorist_be, 'perf'),
            ('futperf', present_go, 'perf'),
        ):
            participle = participles.get(participle_key)
            if not participle:
                continue
            indicative = forms.setdefault('ind', {})
            if tense not in indicative:
                indicative[tense] = {person: combine(word, participle)
                                     for person, word in auxiliary.items()}
    return result
