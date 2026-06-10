import { TemplateConfig, techConfig } from "./config";
import { getCvData, Variant } from "./shared";

export function buildTechHtml(
  variant: Variant,
  overrides: Partial<TemplateConfig> = {},
): string {
  const c = { ...techConfig, ...overrides };
  const d = getCvData(variant, "en");

  const icon = {
    pin: `<svg viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    mail: `<svg viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    phone: `<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
    github: `<svg viewBox="0 0 24 24"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
    globe: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>`,
  };

  const phoneTel = d.phone.replace(/[^\d+]/g, "");

  const skillsSection = d.skills
    .map(
      ({ label, values }) =>
        `<div class="skill-row"><span class="skill-cat">${label}</span><span class="skill-vals">${values
          .map((v) => `<span class="skill-chip">${v}</span>`)
          .join("")}</span></div>`,
    )
    .join("\n");

  const certBadge = `<svg viewBox="0 0 24 24"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>`;

  const certsList = d.certifications
    .map((cert) => `<span class="cert-item">${certBadge}${cert}</span>`)
    .join("");

  const languagesLine = d.languages
    .map((l) => `${l.name} <span class="lang-level">${l.level}</span>`)
    .join(`<span class="lang-sep">·</span>`);

  const experienceEntries = d.experience.map((exp, i) => {
    const isOldRole = i >= d.experience.length - 2;

    const header =
      exp.company === "Freelance"
        ? `<div class="exp-header">
            <span class="exp-company">${exp.title}</span>
            <span class="exp-period">${exp.period}</span>
          </div>`
        : `<div class="exp-header">
            <span class="exp-company">${exp.company}</span>
            <span class="exp-period">${exp.period}</span>
          </div>
          <div class="exp-role">${exp.title}</div>`;

    if (isOldRole) {
      return `<div class="exp-entry">${header}<ul><li>${exp.bullets[0] || ""}</li></ul></div>`;
    }

    const bullets = exp.bullets.map((b) => `<li>${b}</li>`).join("\n");
    return `<div class="exp-entry">${header}<ul>${bullets}</ul></div>`;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --accent:    #1d4ed8;
    --accent-lt: #dbeafe;
    --text:      #111827;
    --text-mid:  #374151;
    --text-soft: #6b7280;
    --rule:      #e5e7eb;
  }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 9pt;
    color: var(--text);
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body { margin: 0; padding: 0; }

  a { color: var(--accent); text-decoration: none; }


  /* ── Header ── */
  .header-block {
    padding-bottom: 10pt;
    border-bottom: 2pt solid var(--accent);
    margin-bottom: 11pt;
  }

  .name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 17pt;
    font-weight: 700;
    color: var(--text);
    letter-spacing: 0.8pt;
    margin-bottom: 2pt;
  }

  .subtitle {
    font-size: 9.5pt;
    font-weight: 300;
    color: var(--text-mid);
    letter-spacing: 0.3pt;
    margin-bottom: 6pt;
  }

  .contact {
    display: flex;
    flex-wrap: wrap;
    gap: 3pt 11pt;
    font-size: 8pt;
    color: var(--text-mid);
    margin-top: 1pt;
  }

  .contact-item {
    display: inline-flex;
    align-items: center;
    gap: 3.5pt;
    white-space: nowrap;
    color: var(--text-mid);
  }

  .contact-item svg {
    width: 8.5pt;
    height: 8.5pt;
    flex-shrink: 0;
    fill: none;
    stroke: var(--accent);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  /* ── Body ── */
  .body { padding: 0; }

  /* ── Section ── */
  .section { margin-bottom: 10pt; }

  .section-title {
    font-size: 7.5pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.2pt;
    color: var(--accent);
    border-left: 2.5pt solid var(--accent);
    padding-left: 5pt;
    margin-bottom: 6pt;
    line-height: 1.2;
  }

  .section-rule {
    border: none;
    border-top: 0.75pt solid var(--rule);
    margin: 9pt 0 9pt;
  }

  /* ── Summary ── */
  .summary {
    font-size: 9pt;
    line-height: 1.55;
    color: var(--text-mid);
    font-weight: 300;
  }

  /* ── Skills ── */
  .skill-row {
    display: flex;
    gap: 8pt;
    margin-bottom: 5pt;
    font-size: 8.5pt;
    line-height: 1.45;
    align-items: flex-start;
  }

  .skill-cat {
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    min-width: 70pt;
    padding-top: 2pt;
  }

  .skill-vals {
    display: flex;
    flex-wrap: wrap;
    gap: 4pt;
  }

  .skill-chip {
    font-size: 7.5pt;
    font-weight: 500;
    color: var(--accent);
    background: var(--accent-lt);
    border: 0.5pt solid #bfdbfe;
    border-radius: 3pt;
    padding: 1.5pt 6pt;
    line-height: 1.35;
    white-space: nowrap;
  }

  /* ── Experience ── */
  .exp-entry { margin-bottom: 9pt; }

  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1pt;
  }

  .exp-company {
    font-weight: 600;
    font-size: 9.5pt;
    color: var(--text);
  }

  .exp-role {
    font-size: 8.5pt;
    font-weight: 400;
    color: var(--text-mid);
    margin-bottom: 3pt;
  }

  .exp-period {
    font-size: 8pt;
    color: var(--text-soft);
    white-space: nowrap;
    font-weight: 300;
  }

  ul {
    margin: 2pt 0 0 12pt;
    padding: 0;
    list-style: none;
  }

  li {
    margin-bottom: 2pt;
    line-height: 1.45;
    font-size: 8.5pt;
    color: var(--text-mid);
    position: relative;
    padding-left: 8pt;
  }

  li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-size: 6pt;
    top: 1.5pt;
  }

  /* ── Education ── */
  .edu-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .edu-institution {
    font-weight: 600;
    font-size: 9pt;
  }

  .edu-degree {
    font-size: 8.5pt;
    color: var(--text-mid);
    margin-top: 1pt;
  }

  .edu-period {
    font-size: 8pt;
    color: var(--text-soft);
    white-space: nowrap;
    font-weight: 300;
  }

  .certs-label {
    font-size: 7pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.9pt;
    color: var(--text-soft);
    margin: 8pt 0 4pt;
  }

  .certs-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4pt 6pt;
  }

  .cert-item {
    display: inline-flex;
    align-items: center;
    gap: 4pt;
    font-size: 7.8pt;
    color: var(--text-mid);
    border: 0.5pt solid var(--rule);
    border-radius: 3pt;
    padding: 2pt 7pt;
    white-space: nowrap;
  }

  .cert-item svg {
    width: 8.5pt;
    height: 8.5pt;
    flex-shrink: 0;
    fill: none;
    stroke: var(--accent);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .lang-line {
    font-size: 8.2pt;
    color: var(--text);
    font-weight: 500;
  }

  .lang-level {
    color: var(--text-soft);
    font-weight: 400;
  }

  .lang-sep {
    color: #d1d5db;
    margin: 0 5pt;
  }
</style>
</head>
<body>

<div class="header-block">
  <div class="name">${d.name.toUpperCase()}</div>
  <div class="subtitle">${d.title}</div>
  <div class="contact">
    <span class="contact-item">${icon.pin}${d.location}</span>
    <a class="contact-item" href="mailto:${d.email}">${icon.mail}${d.email}</a>
    <a class="contact-item" href="tel:${phoneTel}">${icon.phone}${d.phone}</a>
    <a class="contact-item" href="https://${d.linkedin}">${icon.linkedin}${d.linkedin}</a>
    <a class="contact-item" href="https://${d.github}">${icon.github}${d.github}</a>
    <a class="contact-item" href="https://${d.portfolio}">${icon.globe}${d.portfolio}</a>
  </div>
</div>

<div class="body">

  <div class="section">
    <div class="section-title">Profile</div>
    <p class="summary">${d.summary}</p>
  </div>

  <hr class="section-rule" />

  <div class="section">
    <div class="section-title">Technical Skills</div>
    ${skillsSection}
  </div>

  <hr class="section-rule" />

  <div class="section">
    <div class="section-title">Experience</div>
    ${experienceEntries.join("\n")}
  </div>

  <hr class="section-rule" />

  <div class="section">
    <div class="section-title">Education</div>
    <div class="edu-row">
      <div>
        <div class="edu-institution">${d.education.institution}</div>
        <div class="edu-degree">${d.education.degree}</div>
      </div>
      <div class="edu-period">${d.education.period}</div>
    </div>
    <div class="certs-label">Certifications</div>
    <div class="certs-list">${certsList}</div>
    <div class="certs-label">Languages</div>
    <div class="lang-line">${languagesLine}</div>
  </div>

</div>

</body>
</html>`;
}
