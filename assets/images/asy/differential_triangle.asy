import graph;
import olympiad;
settings.tex="pdflatex";
texpreamble("\usepackage{physics}");

size(10cm);

// Plot window
real xmin = -1, xmax = 2;
real ymin = -1, ymax = 2;
limits((xmin,ymin),(xmax,ymax),Crop);
unitsize(1.2cm);

// Differential triangle
pair P = (0, 0);
pair Q = (1, sqrt(3));
pair H = (1, 0);
//fill(P--H--Q--cycle, gray(0.8)+opacity(0.25));
draw(rightanglemark(P, H, Q));
draw(anglemark(H, P, Q));
draw(P--Q--H--cycle, linewidth(1));
label("$\dd{s}$", midpoint(P--Q), WNW);
label("$\dd{x}$", midpoint(P--H), S);
label("$\dd{y}$", midpoint(H--Q), E);
label("$\theta$", P, 1.8N+2.5E);
