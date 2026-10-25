# Stylesheet conventions

Edit `theme.css` to change the site's appearance:

- `--radius` is the single corner radius for cards, images, code, and controls.
- `--color-*` defines the shared palette. Components use semantic names such as
  `--color-text-muted`, `--color-surface-subtle`, and `--color-border` instead of
  literal color values. Dictionary colors retain distinct linguistic meanings;
  code output retains its contrasting dark surface.
- Font families, content widths, shadows, and animation timing also live here.
- `--link-color` and `--link-hover` derive from the palette.

`main.css` loads the theme first, then global defaults in `base.css`, then shared
component rules in `components.css`, followed by component-specific files.
`calendar/calendar.css` is loaded separately on the calendar page; it uses the
same site theme and shared calendar rules in `calendar-base.css`.

Keep component files focused on their layout and meaningful differences. Extend
an existing selector group in `components.css` when another element needs the
same rounding, card border, control styling, or button interaction. Do not copy
the declarations or create a component-specific palette/radius.

Calendar headers and grid cells deliberately use square corners so adjoining
cells form one continuous grid. These zero-radius resets are structural, not a
second rounding scale. Responsive breakpoints remain literal pixel values:
CSS custom properties cannot be used in media-query conditions.

Global box sizing, viewport containment, and responsive media belong to
`base.css`; post navigation belongs to `post-view.css`; equation scrolling
belongs to `equations.css`. There is no trailing override/fix stylesheet.

The refactor preserves the existing effective body font and line height (1.35),
which previously came from an accidental global rule in `dictionary.css`.
The new theme consolidates similar grays, gives controls the shared 0.5rem
radius (including formerly pill-shaped filters), and keeps search-button text
readable on its light hover background.
