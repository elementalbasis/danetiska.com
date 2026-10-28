# Run make from assets/lexicon (or: make -C assets/lexicon).
.DEFAULT_GOAL := all
.DELETE_ON_ERROR:

SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

PYTHON ?= python3
LEXERAT ?= $(HOME)/lexerat/lexerat.py
XELATEX ?= xelatex
INKSCAPE ?= inkscape

TEMPLATE_DIR ?= ../templates
HTML_TEMPLATE ?= $(TEMPLATE_DIR)/dictionary.html.j2
LATEX_TEMPLATE ?= $(TEMPLATE_DIR)/dictionary.tex.j2
STYLE := $(TEMPLATE_DIR)/danetian-dictionary.sty
IMAGES_DIR ?= ../images
DICT_LOGO := $(IMAGES_DIR)/dictionary_of_the_danetian_language_logo.svg
ACADEMY_LOGO := $(IMAGES_DIR)/danetiska_academia_logo.svg

PREAMBLE_DIR ?= $(HOME)/cordan/corpus
PREAMBLE_EN := $(PREAMBLE_DIR)/preambulom-dictzionariosio.eng
PREAMBLE_DNT := $(PREAMBLE_DIR)/preambulom-dictzionariosio.txt

# *.txt.ignore files are deliberately excluded.
SOURCES := $(sort $(wildcard raw/*.txt))
LATEX_HELPERS := $(wildcard $(TEMPLATE_DIR)/*.tex.j2)
HTML_HELPERS := $(wildcard $(TEMPLATE_DIR)/*.html.j2)

.PHONY: all html pdf clean clean-aux check-sources
all: html pdf

html: lexicon.html

pdf: dictionary.pdf

check-sources:
	@test -n "$(SOURCES)" || { echo 'No raw/*.txt vocabulary files found.' >&2; exit 1; }

lexicon.html: $(SOURCES) $(HTML_TEMPLATE) $(HTML_HELPERS) $(LEXERAT) Makefile | check-sources
	@temporary=$$(mktemp "$(CURDIR)/.lexicon-html.XXXXXX"); \
	trap 'rm -f -- "$$temporary"' EXIT; \
	$(PYTHON) "$(LEXERAT)" $(foreach source,$(SOURCES),"$(source)") \
	  --template "$(HTML_TEMPLATE)" -o "$$temporary"; \
	chmod 644 "$$temporary"; \
	mv -f -- "$$temporary" "$@"; \
	echo 'Built lexicon.html'

dictionary.pdf: $(SOURCES) $(LATEX_TEMPLATE) $(LATEX_HELPERS) $(STYLE) $(DICT_LOGO) $(ACADEMY_LOGO) $(PREAMBLE_EN) $(PREAMBLE_DNT) $(LEXERAT) Makefile | check-sources
	@build=$$(mktemp -d "$(CURDIR)/.dictionary-build.XXXXXX"); \
	trap 'rm -rf -- "$$build"' EXIT; \
	trap 'exit 130' INT; trap 'exit 143' TERM; \
	mkdir -p "$$build/assets" "$$build/frontmatter"; \
	cp "$(STYLE)" "$$build/danetian-dictionary.sty"; \
	ln -s "$(abspath $(PREAMBLE_EN))" "$$build/frontmatter/preamble-en.md"; \
	ln -s "$(abspath $(PREAMBLE_DNT))" "$$build/frontmatter/preamble-dnt.md"; \
	$(INKSCAPE) "$(DICT_LOGO)" --export-area-drawing --export-text-to-path \
	  --export-type=pdf --export-filename="$$build/assets/dictionary-logo.pdf"; \
	$(INKSCAPE) "$(ACADEMY_LOGO)" --export-area-drawing --export-text-to-path \
	  --export-type=pdf --export-filename="$$build/assets/academy-logo.pdf"; \
	$(PYTHON) "$(LEXERAT)" $(foreach source,$(SOURCES),"$(source)") \
	  --template "$(LATEX_TEMPLATE)" -o "$$build/dictionary.tex"; \
	for pass in 1 2 3; do \
	  echo "Typesetting dictionary (pass $$pass/3)..."; \
	  if ! (cd "$$build" && $(XELATEX) -shell-escape -interaction=nonstopmode \
	      -halt-on-error dictionary.tex > build-output.log 2>&1); then \
	    echo "XeLaTeX failed (pass $$pass)." >&2; \
	    tail -n 100 "$$build/build-output.log" >&2; exit 1; \
	  fi; \
	done; \
	mv -f -- "$$build/dictionary.pdf" "$@"; \
	echo 'Built dictionary.pdf'

# Remove debris from the old Makefile even when the PDF is already current.
pdf: clean-aux

clean-aux:
	@rm -f -- dictionary.tex dictionary.aux dictionary.log dictionary.out \
	  dictionary.toc dictionary.lof dictionary.lot dictionary.fls \
	  dictionary.fdb_latexmk dictionary.synctex.gz dictionary.xdv \
	  dictionary.bbl dictionary.blg dictionary.markdown.lua
	@rm -rf -- _markdown_dictionary

clean: clean-aux
	@rm -f -- dictionary.pdf lexicon.html
