# Run from assets/lexicon/. All maintained code/TeX files live here.
.DEFAULT_GOAL := html
.DELETE_ON_ERROR:
PYTHON ?= python3
XELATEX ?= xelatex
XELATEX_FLAGS ?= -interaction=nonstopmode -halt-on-error -file-line-error
# Keep your existing raw/ layout, or put vocabulary .txt files in the root.
INPUT_DIR ?= $(if $(wildcard raw),raw,.)

.PHONY: all html pdf latex check prepare clean
all: html pdf

# One shared preparation step, even with make -j all.
# Content-aware writes retain timestamps when the data has not changed.
prepare: build_lexicon.py
	@$(PYTHON) build_lexicon.py --input "$(INPUT_DIR)" --output build

check:
	@$(PYTHON) build_lexicon.py --input "$(INPUT_DIR)" --check

html: prepare
	@cp build/lexicon.html lexicon.html
	@echo "Created lexicon.html"

latex: prepare
	@echo "Created build/lexicon.tex and build/english.tex; main document: dictionary.tex"

pdf: prepare dictionary.tex mystyle.sty fonts.tex
	@$(XELATEX) $(XELATEX_FLAGS) -output-directory=build dictionary.tex
	@$(XELATEX) $(XELATEX_FLAGS) -output-directory=build dictionary.tex
	@cp build/dictionary.pdf dictionary.pdf
	@echo "Created dictionary.pdf"

# Only generated files are removed. Vocabulary and maintained TeX stay intact.
clean:
	rm -rf -- build
	rm -f -- lexicon.html dictionary.pdf
