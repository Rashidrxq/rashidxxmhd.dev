# Muhammed Rashid P P · Developer portfolio

A personalized edition of [Pavan Joshi’s developer portfolio template](https://github.com/pavanjoshi914/dev-portfolio-template). The opening screen combines a short profile with excerpts from Rashid’s public project repositories. Enter opens a keyboard- and touch-navigable editor.

## Run locally

Run `python3 serve.py` in this directory and open <http://localhost:8767/>. The editor is also available at <http://localhost:8767/site/>.

## Customize

Edit `portfolio.config.json` for the profile, contact links, internship and projects. Run `node scripts/build-data.mjs` to regenerate the editor content, intro profile and themes. Project previews live in `site/shots/`. The Git activity calendar captures commits authored by Rashid on the default branches of the six featured repositories through November 26, 2026. The stack view counts the languages found in those repositories and tools listed for those projects.

## Deploy

Run `python3 scripts/package-site.py` and deploy the contents of `dist/` at the domain root. The site uses static HTML, CSS and JavaScript modules.
