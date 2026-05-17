# Copilot instructions for Security Acronym Decoder

Security Acronym Decoder is a focused cybersecurity portfolio project owned by Matthew Faber. The goal is straightforward: A static search tool for decoding common security acronyms, short forms, and overlapping terms so learners can move from memorizing jargon to understanding context quickly. Deployment target is GitHub Pages. The stack is HTML5, CSS3, Vanilla JavaScript, JSON data files, GitHub Pages. Keep the repo easy to review, easy to explain in an interview, and easy to deploy from a clean branch.

When helping here, bias toward the smallest useful implementation. Preserve the deliberate no-build-step approach for the frontend. If the project uses Azure Functions, keep Node tooling isolated to `api/` and do not introduce root-level package management. Prefer plain HTML, CSS, and vanilla JavaScript that a recruiter can understand quickly by opening the repo.

What Copilot should help with:
- Keep acronym data easy to read, sort, and review in plain files.
- Build fast search and clear result presentation without overcomplicating the UI.
- Use copy that explains terms in plain English rather than repeating more jargon.

Domain guardrail: The glossary should reduce confusion, especially where multiple acronyms overlap across cloud, SOC, governance, and security operations contexts. Treat copy, labels, and examples as reviewable cybersecurity content, not filler text.

What to avoid:
- Do not let entries devolve into circular acronym definitions.
- Do not change the JSON data shape casually once lookup code depends on it.
- Do not add build tooling to a static glossary project.

Keep README examples, testing steps, and placeholder UI text aligned whenever scope changes. This project has no secret-bearing runtime configuration in-repo. If you add data files later, keep them human-readable and stable so Matthew or another reviewer can audit the content without reverse engineering generated output.
