import graph;
import olympiad;
import markers;
settings.tex="pdflatex";
texpreamble("\usepackage{physics}");

size(10cm);

// Plot window
real xmin = -2, xmax = 2;
real ymin = -2, ymax = 2;
limits((xmin,ymin),(xmax,ymax),Crop);
unitsize(1.2cm);

// Differential triangle
pair P = (-1, -1);
pair Q = (1, 1);
draw(P--Q, red+linewidth(1));
label("$\dd{s}$", P--Q, NW, red);
dot(P, red);
dot(Q, red);

pair Pa = (-1.1, -1.1);
pair Pb = (-1.9, -1.8);
pair Qa = (1.1, 1.1);
pair Qb = (1.8, 1.9);
pair Oa = (0, -0.2);
pair Ob = (0, -1.3);
draw(Pa--Pb, linewidth(.7), Arrow);
label("$-\mathbf{T}$", Pa--Pb, NW);
draw(Qa--Qb, linewidth(.7), Arrow);
label("$\mathbf{T}+\dd{\mathbf{T}}$", Qa--Qb, W);
draw(Oa--Ob, linewidth(.7), Arrow);
label("$\dd{\mathbf{w}}$", Oa--Ob, E);
