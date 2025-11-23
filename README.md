# UDMS Lab website (Jekyll)

This repository now contains a Jekyll-based static site for the **Ultrafast Dynamics & Materials Spectroscopy Laboratory (UDMS Lab)**. All content is stored in YAML files under `_data`, so updating text or adding new posts does not require React or a build step.

## Project layout
- `_config.yml` — site metadata and basic Jekyll settings.
- `_layouts/default.html` — single-page layout that renders all sections (Professor, Research, Publications, Members, News, Gallery).
- `_includes/nav.html` — reusable navigation bar.
- `_data/*.yml` — structured content for each section.
- `assets/css/style.css` — simple dark theme styling.
- `assets/img/` — images and favicon assets.

## Editing content
- **General info:** `_data/general.yml`
- **Professor profile:** `_data/professor.yml`
- **Research intro/highlights:** `_data/research.yml`
- **Publications:** `_data/publications.yml` (grouped by year)
- **Members:** `_data/members.yml`
- **News:** `_data/news.yml`
- **Gallery:** `_data/gallery.yml`

Use the same field names when adding items so the layout renders them automatically.

## Local preview
1. Install Ruby and Bundler (GitHub Pages-compatible setup):
   ```bash
   bundle install
   ```
2. Serve the site locally:
   ```bash
   bundle exec jekyll serve
   ```
3. Open `http://localhost:4000` to preview the site.

## Deployment
Push the branch to GitHub Pages (or any static host). The site builds with the standard GitHub Pages `github-pages` gem defined in the `Gemfile`.
