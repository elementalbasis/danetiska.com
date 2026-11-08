#!/usr/bin/env python3
"""Build the website dictionary using the existing inflector Python interface."""
import argparse
from pathlib import Path
import sys
import warnings

from dictionary_tables import add_periphrastic_tenses


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('sources', type=Path, nargs='+')
    parser.add_argument('--inflector', type=Path, default=Path.home() / 'Projects/inflector',
                        help='existing inflector checkout (default: ~/Projects/inflector)')
    parser.add_argument('--models', type=Path)
    parser.add_argument('--template', type=Path, required=True)
    parser.add_argument('-o', '--output', type=Path)
    args = parser.parse_args()
    directory = args.inflector.expanduser().resolve()
    if directory.is_file():
        directory = directory.parent
    if not (directory / 'inflect.py').is_file() or not (directory / 'dictionary.py').is_file():
        parser.error(f'No inflector checkout at {directory}; set --inflector or INFLECTOR_DIR')
    sys.path.insert(0, str(directory))
    try:
        from dictionary import enrich_dictionary, load_dictionary
        from inflect import Rudros, Imi, Esmi
        from lexerat import render
        from jinja2 import TemplateError
        from yaml import YAMLError
    except ImportError as error:
        parser.exit(1, f'{error}. Install the inflector requirements and Lexerat[render].\n')
    try:
        entries = enrich_dictionary(load_dictionary(args.sources), directory=args.models)
        auxiliaries = None
        for entry in entries:
            if entry.kind != 'lemma':
                continue
            try:
                # Support the current inflector without requiring another repo patch.
                types = {definition.typ for definition in entry.definitions}
                if (not entry.infl and len(entry.forms) == 1 and entry.lemma.endswith('os')
                        and types & {'adj', 'adjective'}):
                    entry.inflections = Rudros(args.models).inflect(entry.forms)
                table = entry.inflections
                if table and ('act' in table or 'pas' in table):
                    if auxiliaries is None:
                        auxiliaries = (Imi(args.models).table, Esmi(args.models).table)
                    entry.inflections = add_periphrastic_tenses(table, *auxiliaries)
            except (ValueError, OSError, YAMLError) as error:
                warnings.warn(f'Could not complete table for {entry.lemma!r}: {error}',
                              RuntimeWarning)
        html = render(entries, args.template)
        if args.output:
            args.output.write_text(html, encoding='utf-8')
        else:
            print(html, end='')
    except (ValueError, OSError, YAMLError, TemplateError) as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()
