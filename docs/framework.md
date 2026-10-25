# Website framework

This is a Jekyll site. It uses plain CSS, Liquid includes and small JavaScript
modules; no client framework or CSS build step is required.

## Where design decisions belong

`assets/css/theme.css` is the source for the palette, corner radius, spacing,
type scale, font families, line heights, reading measure, site width, shadows
and timing. Change a token to change every component using that role.
Use semantic color tokens, never a local hex value. Use the spacing and type
scales instead of introducing another near-identical measurement.

`base.css` owns document defaults, responsive media, form controls, keyboard
focus, visibility and reduced motion. `components.css` owns shared page
introductions, section headings, actions, form layouts and social links.
`cards.css` owns every card; `prose.css` owns reading typography and article
figures. The remaining files own named features such as the dictionary, Bible,
calendar, navigation and approved footer. `main.css` is the only import manifest.
Calendar cell rules live together because their adjoining grid borders require
square corners. Zero radius is a structural reset, not another radius scale.

Breakpoints remain literal pixels because custom properties cannot be used in
media query conditions. Image aspect ratios, icon dimensions, calendar columns,
and optical geometry are structural values, rather than spacing tokens. Do not
turn every distinct number into a token: tokens represent shared design roles.

## HTML components

- `default` renders one document head, primary navigation, main landmark and
  footer. All other layouts inherit this shell. Global assets belong in
  `head.html`; feature-only scripts stay with the feature that needs them.
- `standalone` supplies a shared page heading and reading document. Use
  `wide: true` for interactive tools that need the full content width.
- `post` uses the same heading and reading measure, a byline, optional cover,
  prose content and a single bottom pagination area.
- `section` adds the data-driven contents sidebar and breadcrumbs to a reading
  document. Section ordering belongs in front matter and `_data/sections.yaml`.
- `page-heading.html` is the single page introduction component.
- `card.html item=...` renders articles, Library collections and project links.
  It accepts `heading` (default 2) and `featured`. Articles supply `cover`,
  `excerpt`, `tags` and `date`; collections supply `label`, `description`,
  `action` and optional `details`. Projects supply `image` and `fit: contain`.
  Cards without images have no media slot. Do not invent missing-image URLs.
  Card images are decorative unless `cover_alt` supplies additional meaning.
- `library.html` renders bibliography entries and compact resource lists.
- `pagination.html` owns previous/next markup; its callers supply the items.
- `calendar-header.html` renders all three calendar view headers.
- `search.html language="en"` or `language="es"` renders the same search form.

Use complete includes instead of copying their markup into another page. Keep
page content in Markdown; avoid inline presentation and nested main landmarks.

## Data and behavior

Navigation labels and active sections: `_data/navigation.yaml`.
Library entrances and tools: `_data/library.yaml`.
Affiliated projects: `_data/projects.yaml`.
Bibliographic records: `_data/bibliography.yaml`.
Social platforms: `_data/social.yaml`, with the existing local SVG sprite.
Article categories: `_data/article_filters.yaml`, shared by filters and cards.
Search labels, modes, translations and lexicon URLs: `_data/search.yaml`.
Contact email: `_config.yaml`.

Both dictionaries use `dictionary.js`; their data selects the lexicon and
language. Exact, prefix, contains, suffix, translation, suggestion, random and
URL lookup behavior share one engine. Results messages use text content.
`filter.js` sets the semantic `hidden` property, rather than injecting CSS.

All date features import `calendar/calendar-arithmetic.js`. Gregorian, Julian
and Danetian calendars supply month rules and epochs to shared conversion and
date-shifting functions. Calendar views, today's date, article dates and the
calculator use those same functions and month names. Invalid calculator inputs
produce validation feedback rather than entering a conversion loop.

## Checks

With Ruby, Jekyll and the plugins listed in `_config.yaml` installed:

```sh
jekyll build --config _config.yaml
python3 tests/check_site.py _site
node --test tests/calendar.test.mjs
```

Validated with Jekyll 4.3.2. The explicit config argument matters: this repository uses `_config.yaml`.
The generated-page audit checks shared landmarks, IDs, referenced local assets,
and token rules. Calendar tests cover epochs, signed years, round trips, leap
month transitions and invalid input. Browser verification should cover home,
articles, Library, a reading page, both dictionaries, Calendar and Bible at
narrow and wide widths whenever shared components change.

Keep content and dataset sources separate from presentation refactors. Existing
page URLs, dictionary data, Bible text and article content are preserved.

## Interaction and heading styles

Headings use `--font-heading`, which defaults to the site sans serif. Dictionary
lemmas, expressions and inline lemmas use `--font-body` independently so editorial
heading changes cannot change the dictionary's typeface. Section titles use the
shared `--text-2xl` size.

Pressed buttons share the charcoal surface in `components.css`. Feature styles
must not override that background with a transparent fill. Navigation links are text links:
they turn gold on hover, while the current section remains dark and underlined,
including on hover. The active section is determined by the existing navigation
data and exposed through `aria-current`. Links use the original gold hover color.
Calendar and focus colors use the same shared gold palette. Dictionary and search
controls retain their existing semantic colors.

Section headings connect directly to resource lists so the first row has the
same padding as subsequent rows. Card groups retain their shared spacing below
section headings.
