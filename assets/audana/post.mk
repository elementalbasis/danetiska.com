# Include from a post's directory. Override POST to use another .tex basename.
AUDANA_DIR := $(patsubst %/,%,$(dir $(lastword $(MAKEFILE_LIST))))
POST ?= post
LATEXMK ?= latexmk

.PHONY: all images clean
all: $(POST).pdf

$(POST).pdf: $(POST).tex $(AUDANA_DIR)/audana.sty $(wildcard $(AUDANA_DIR)/logos/*.pdf) $(wildcard $(AUDANA_DIR)/fonts/*.ttf)
	$(LATEXMK) -xelatex -interaction=nonstopmode -halt-on-error $(POST).tex

images: $(POST).pdf
	mkdir -p images
	pdftoppm -r 144 -png $(POST).pdf images/$(POST)

clean:
	$(LATEXMK) -c $(POST).tex
