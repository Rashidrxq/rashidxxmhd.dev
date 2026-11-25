# Muhammed Rashid P P · Developer portfolio

I'm a full-stack developer from Kozhikode, Kerala. I build React and Next.js interfaces and the APIs behind them. This portfolio opens with an animated wall of code drawn from my projects. Step into the editor to see how an order moves through an ERP, how a résumé upload works, or what happens when a CFO delays a supplier payment.

[Visit the live portfolio](https://rashidxxmhd-dev.vercel.app/) · [Open the project editor](https://rashidxxmhd-dev.vercel.app/site/) · [LinkedIn](https://www.linkedin.com/in/rashidxxmhd)

## Explore the editor

Press **Enter** on the intro. In the project list, use **↑** and **↓** to select an entry and **Enter** to open it. On a phone, tap **~/Projects**, swipe through the list, and tap an entry. Open `whoami` for my background and contact links, or `themes/` to switch between eight color palettes.

## Featured projects

| Project | What you can explore |
| --- | --- |
| [SalesOrder ERP](https://github.com/Rashidrxq/SalesOrder-ERP-REMEX) | Follow a sales order through store approval, production, billing, and dispatch, with a separate view for each team. |
| [Job-Agent](https://github.com/Rashidrxq/Job-Agent) | Manage job listings, upload PDF or DOCX résumés, and track applications in a React and Express workspace. |
| [WE CARE](https://github.com/Rashidrxq/we-care) | Browse clinic departments and treatments, then try the demo appointment flow. |
| [AVIPATH](https://github.com/Rashidrxq/AVIAN-PROJECT) | Explore bird species, migration patterns, and poultry health in a Flutter app backed by Flask. |
| [Evil CFO Simulator](https://github.com/Rashidrxq/Evil-CFO-Simulator) | See how cutting maintenance or delaying supplier payments changes cash, trust, and operational risk over several turns. |
| [Knee MRI ACL Detector](https://github.com/Rashidrxq/knee-mri-acl-detector) | Explore a local Streamlit research prototype that displays model output for knee MRI series. |

## Run locally

The portfolio uses static HTML, CSS, JavaScript modules, and Canvas. From a terminal with Git and Python 3 installed, run

```sh
git clone https://github.com/Rashidrxq/rashidxxmhd.dev.git
cd rashidxxmhd.dev
python3 serve.py
```

Open [the local portfolio](http://localhost:8767/). On Windows, you can start the server with `py -3 serve.py`.

## Update and deploy

1. Edit [`portfolio.config.json`](./portfolio.config.json) to update the bio, links, work experience, or project descriptions. Put new project previews in [`site/shots/`](./site/shots/) and reference them in the project entry.
2. Run `node scripts/build-data.mjs` to regenerate the portfolio content. The Git activity calendar is a saved snapshot of my commits to the six featured repositories through November 26, 2026.
3. Preview the changes locally, then commit the configuration and generated files together. A push to `main` triggers Vercel to run `python3 scripts/package-site.py` and publish `dist/`.

The editor and code wall are adapted from [Pavan Joshi’s developer portfolio template](https://github.com/pavanjoshi914/dev-portfolio-template).
