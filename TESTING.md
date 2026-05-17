# Manual Testing Guide

Project: **Security Acronym Decoder**  
Checklist date: **2026-05-16**

## P0 — must pass
- [ ] `python -m http.server 8080` serves `index.html`, `styles/main.css`, `src/app.js`, and `data/security-acronyms.json` with no broken links.
- [ ] Search matches acronym and expansion text using substring or fuzzy input.
- [ ] Category chips filter the result cards correctly.
- [ ] With no active search, the deterministic acronym-of-the-day card appears.
- [ ] Related acronym chips jump the search state to the chosen term.
- [ ] Arrow keys move through result cards, Enter pins the active card, `/` focuses search, and `?` opens help.
- [ ] Pinned acronyms persist in localStorage and can be cleared.
- [ ] Footer credits Matthew Faber and points to the GitHub source URL.

## P1 — should pass
- [ ] The layout remains readable at 375px, 768px, and 1440px widths.
- [ ] Keyboard focus is visible for search, chips, cards, pin buttons, related acronyms, and theme toggle.
- [ ] Theme toggle works in both light and dark modes.
- [ ] Chrome and Edge show no console errors on initial load.
- [ ] Hash deep links such as `#q=siem` restore the expected search state.
- [ ] Help overlay opens and closes without trapping the page in a broken state.

## P2 — nice to verify
- [ ] Pinned entries render in alphabetical order.
- [ ] Empty-state copy appears only when filters produce no matches.
- [ ] The daily card changes predictably by date and does not flicker on rerender.
