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

## Social media links

The footer uses an institutional grid: Academy identity on the left, information
links in the middle, and the "Follow us" icons with the visible
`academia@danetiska.com` email on the right. Copyright and the ministry's
patronage mark share a lower strip separated by a rule. At narrower widths the
identity spans both columns; on small screens the columns stack in reading
order. The Academy identity and the lower copyright/patronage strip are centered
when stacked. `footer.css` owns this layout; `.social-links` in `components.css` owns
the shared social icon styles.

Edit `_data/social.yaml` to add, remove, or reorder social links. Only entries in
that list appear. Each entry has a readable `name`, an `icon` identifier, and the
account's full `url`. For example, to add a GitHub account alongside Reddit:

```yaml
- name: GitHub
  icon: github
  url: https://github.com/YOUR_ACCOUNT
```

Available icons: `reddit`, `github`, `mastodon`, `bluesky`, `instagram`, `youtube`,
`facebook`, `x`, `threads`, and `discord`.

`_includes/social-links.html` renders the list; `.social-links` in
`components.css` styles every platform together. Icons share the site's link
color, gold hover/focus treatment, and radius. The visible icons are small, with
larger 44px clickable areas at the default root font size. Each link has an
accessible platform name and a native tooltip. No per-platform CSS is needed.

The local SVG sprite in `assets/images/social-icons.svg` contains Simple Icons
artwork; its source and CC0 license are recorded alongside it. To support another
platform, add its 24-by-24 SVG artwork as a named `<symbol>` in that sprite, then
reference its identifier from the data list. All icons are served by the site; no third-party scripts, icon fonts,
or external icon service is required.
