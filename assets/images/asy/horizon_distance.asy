import graph;
import olympiad;

settings.tex="pdflatex";
texpreamble("\usepackage{physics}");

size(5cm);

pair O = (0, 0);
real r = 3;

draw(circle(O, r));
dot(O);

pair A = (0, 5);
pair B = (2.4, 1.8);
pair C = (-2.4, 1.8);
pair D = (0, 3);

draw(O--A--B--O--C--A);
dot(A); dot(B); dot(C); dot(D);
draw(rightanglemark(A, B, O));
draw(rightanglemark(A, C, O));
draw(anglemark(B, O, A));

label("$R$", midpoint(B--O), SE);
label("$R$", midpoint(O--D), W);
label("$h$", midpoint(D--A), SW);
label("$D$", midpoint(A--B), NNE);
label("$\theta$", O, 2*NNE);
