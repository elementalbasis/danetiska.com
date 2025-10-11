import graph;
settings.tex="pdflatex";
texpreamble("\usepackage{physics}");

size(10cm);
//currentlight.background = white;

// Catenary curve parameter
real a = 2;

// Plot window
real xmin = -6, xmax = 6;
real ymin = -2, ymax = 6;
limits((xmin,ymin),(xmax,ymax),Crop);
unitsize(0.8cm);

// Axes with ticks
draw((xmin,0)--(xmax,0), Arrows(6bp)); // x-axis
label("$x$", (xmax, 0), SW);
draw((0,ymin)--(0,ymax), Arrows(6bp)); // y-axis
label("$y$", (0, ymax), SE);

// Catenary curve
real f(real x) { return a * cosh(x/a) - a; }

// Draw curve
guide g = graph(f, xmin, xmax);
draw(g, red+linewidth(1));
clip(box((xmin, ymin), (xmax, ymax)));

// Differential triangle
real x0 = 2.5;
real h = 0.6;
pair P = (x0, f(x0));
pair Q = (x0+h, f(x0+h));
pair H = (x0+h, f(x0));
//draw(graph(f, x0, x0+h), blue+linewidth(1));
//label("$\dd{s}$", midpoint(P--Q), WNW);
//draw(P--H, blue+1bp);
//label("$\dd{x}$", midpoint(P--H), S);
//draw(H--Q, blue+1bp);
//label("$\dd{y}$", midpoint(H--Q), E);

// Label
label("$y = f(x)$", (-3, f(-3)), NE);
