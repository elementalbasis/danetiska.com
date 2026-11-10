# Audana

LaTeX cards for the Danetian Academy. Default output: 4:5 portrait,
540 × 675 PDF points, rendered at 144 dpi to 1080 × 1350 pixels.
Charis SIL, ivory and charcoal, gold rules, and rectangular Academy logos.
The package selects the white or black wordmark for the chosen background.

## Install and build

Extract the archive at the website repository root. It contains:

- `assets/audana/`: package, shared build rules, fonts, and logos.
- `assets/social_media/north-wind-and-sun/`: complete six-slide example.

Run `make` in the post directory to build its PDF; run `make images` for PNGs.
Requires XeLaTeX, latexmk, the usual LaTeX packages including PGF/TikZ,
and Poppler for PNG export. LuaLaTeX also works when invoked directly:
`lualatex post.tex` (repeat until references stabilize).

Each post owns its text and typography options. Shared design changes belong
in Audana, not in individual post files. Fonts and logos resolve relative to
the loaded package, independently of the post's working directory.

## Minimal post

```latex
\documentclass{article}
\usepackage{../../audana/audana}

\audanasetup{
  title={Tramontovos Ventos i Suls},
  subtitle={The North Wind and the Sun}
}

\begin{document}
\audanacover
\audanabilingual
  {Posti tosio, Suls bryne lukeiostet, ide voiazjonts
   immediate djystre apokypiostet mantam.}
  {After this, the Sun shone warmly, and immediately
   the traveller took off his coat.}
\audanaendcard
\end{document}
```

The accompanying Makefile only needs:

```make
include ../../audana/post.mk
```

Paths above assume `assets/social_media/<post>/`. For deeper post directories,
adjust the package and Makefile include paths accordingly.

## Commands

| Command | Purpose |
| --- | --- |
| `\audanasetup{keys}` | Set shared metadata and typography defaults. |
| `\audanacover[ keys ]` | Dark cover; optional `cover-title` allows a deliberate line break. |
| `\audanabilingual[ keys ]{original}{translation}` | One reading slide with the shared title and subtitle. Original text is italic. |
| `\audanaendcard[ keys ]` | Centered logo, closing line, website, and handle. No header, footer, corner branding, or page number. |

Options are local to a command when passed in square brackets. Each command
creates exactly one page. Page totals update automatically through latexmk.
Long bilingual passages raise a package error instead of silently overlapping
the footer; split the passage or choose smaller type.

## Options

| Key | Default |
| --- | --- |
| `title`, `subtitle` | Empty; set once per post. |
| `cover-title` | Uses `title`; may contain `\\` for a cover-only line break. |
| `theme` | `light`; the cover defaults to `dark`. |
| `academy` | `DANETIAN ACADEMY` |
| `website` | `danetiska.com` |
| `handle` | `@danetiska` |
| `closing` | `Follow for more` |
| `text-size`, `text-leading` | `25`, `32.5` |
| `translation-size`, `translation-leading` | `16.5`, `22` |
| `logo-black`, `logo-white` | Bundled rectangular PDF logos. |

Sizes and leading are PDF points. Larger type is useful for short passages:

```latex
\audanabilingual[
  text-size=32, text-leading=41.6,
  translation-size=20, translation-leading=27
]{Original text.}{Translation.}
```

## Reference cards

The established `dacard`, `datable`, `dadesc`, `dalabel`, `dahead`, `daform`,
`dameaning`, `dagloss`, `danote`, and `dasubhead` interfaces remain available.
They use the same page frame and font as bilingual slides. Existing sources
should change their package import to Audana. The old `DABlue` and `DAGreen`
color names remain aliases for neutral Academy colors so older posts compile.

```latex
\begin{dacard}{Eight cases}{NOUNS}
\begin{datable}{KCC}
Case & Singular & Plural \\
\midrule
Nom. & viros & viroi \\
Acc. & virom & virons \\
\end{datable}
\end{dacard}
```

Charis SIL is redistributed under the SIL Open Font License; see
`fonts/OFL.txt`. The Academy logos are project assets, not part of that font license.
