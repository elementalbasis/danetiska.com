all:
	python ~/lexerat/lexerat.py raw/*.txt --template ~/lexerat/templates/dictionary.html.j2 > lexicon.html
	python ~/lexerat/lexerat.py raw/*.txt --template ~/lexerat/templates/dictionary.tex.j2 > dictionary.tex
	xelatex dictionary.tex
	xelatex dictionary.tex
	rm dictionary.{tex,toc,log,out,aux}
