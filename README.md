# Security Acronym Decoder

A searchable glossary for the alphabet soup of cybersecurity terms.

## What it is

Security Acronym Decoder is a static study tool for quickly translating common cybersecurity shorthand into plain-English definitions, context, and related terms. It helps learners move beyond memorizing jargon by making overlapping acronyms easier to search, compare, and revisit.

## Live demo

https://mtfucf.github.io/security-acronym-decoder/

## Features

- Big fuzzy-friendly search over acronym and expansion text
- Category filter chips for quick topic narrowing
- Result cards with definitions, context, and clickable related acronyms
- Deterministic acronym-of-the-day prompt when no search is active
- Local pinned study list plus keyboard shortcuts for search, navigation, pinning, and help

## How to run locally

```bash
cd projects/security-acronym-decoder
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Push to GitHub

This project ships as its own standalone repo. To push it to a GitHub account (e.g., a separate cybersecurity-portfolio account), follow these steps.

### 1) Authenticate with the target account

Preferred: use GitHub CLI multi-account auth.

```bash
gh auth login
gh auth switch
gh auth status
```

Per-repo git config keeps commits under the right identity even if your global git config points at another account:

```bash
git config user.name "Matthew Faber"
git config user.email "<your-github-username>@users.noreply.github.com"
```

The noreply email keeps your personal email private. Replace `<your-github-username>` with the target account username.

### 2) Initialize, commit, and push

From the workspace root:

```bash
cd projects/security-acronym-decoder
git init -b main
git config user.name "Matthew Faber"
git config user.email "<your-github-username>@users.noreply.github.com"
git add .
git commit -m "Initial commit"
gh repo create <your-github-username>/security-acronym-decoder --public --source=. --remote=origin --push --description "A searchable glossary for the alphabet soup of cybersecurity terms."
```

### 3) Enable GitHub Pages

- Go to repo **Settings → Pages**.
- Under **Build and deployment**, set **Source** to **GitHub Actions** (not **Deploy from a branch**).
- The first push triggers `.github/workflows/deploy-pages.yml`; wait about 30 seconds, then visit `https://<your-github-username>.github.io/security-acronym-decoder/`.

### 4) Updating later

```bash
git add . && git commit -m "Describe the change" && git push
```

## Deploy your own

This repo includes `.github/workflows/deploy-pages.yml` for the modern GitHub-native Pages flow.

1. Push the repo to GitHub.
2. Open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main` or run the workflow manually with **workflow_dispatch**.
4. After the workflow finishes, open `https://<your-github-username>.github.io/security-acronym-decoder/`.

## Tech stack

- HTML5
- CSS3 with custom properties and `prefers-color-scheme`
- Vanilla JavaScript
- Static JSON data
- GitHub Pages

## Project structure

```text
.
├── data/
│   └── security-acronyms.json
├── src/
│   └── app.js
├── styles/
│   └── main.css
├── index.html
├── README.md
└── TESTING.md
```

## Data notes

The glossary data is copied directly from `projects/_content-drops/security-acronyms.json` so the app stays reviewable and easy to update.

## Manual testing

See `TESTING.md` for the checklist used for local browser review.

## Author

**Matthew Faber**  
Matthew Faber builds hands-on cybersecurity portfolio projects that turn study material into practical demos.


