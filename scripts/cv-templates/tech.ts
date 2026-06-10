import { TemplateConfig, techConfig } from "./config";
import { cvData } from "./shared";

export function buildTechHtml(overrides: Partial<TemplateConfig> = {}): string {
  const c = { ...techConfig, ...overrides };
  const d = cvData;

  const skillsSection = [
    { label: "Frontend", values: d.skills.frontend },
    { label: "Backend &amp; CMS", values: d.skills.backend },
    { label: "Tools &amp; Infra", values: d.skills.tools },
  ]
    .map(
      ({ label, values }) =>
        `<div class="skill-row"><span class="skill-cat">${label}</span><span class="skill-vals">${values.join(" · ")}</span></div>`,
    )
    .join("\n");

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
    font-size: 8pt;
    color: var(--text-soft);
    display: flex;
    flex-wrap: wrap;
    gap: 0;
  }

  .contact span { white-space: nowrap; }
  .contact span + span::before { content: " · "; color: #d1d5db; }
  .contact a { color: var(--accent); }

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
    gap: 6pt;
    margin-bottom: 2.5pt;
    font-size: 8.5pt;
    line-height: 1.45;
  }

  .skill-cat {
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    min-width: 70pt;
  }

  .skill-vals {
    color: var(--text-mid);
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

  .certs {
    font-size: 8pt;
    color: var(--text-mid);
    margin-top: 5pt;
  }

  .certs b { font-weight: 600; color: var(--text); }
</style>
</head>
<body>

<div class="header-block">
  <div class="name">${d.name.toUpperCase()}</div>
  <div class="subtitle">${d.title}</div>
  <div class="contact">
    <span>${d.email}</span>
    <span>${d.phone}</span>
    <span><a href="https://${d.linkedin}">${d.linkedin}</a></span>
    <span><a href="https://${d.github}">${d.github}</a></span>
    <span><a href="https://${d.portfolio}">${d.portfolio}</a></span>
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
    <div class="certs"><b>Certifications:</b> ${d.certifications.join(" · ")}</div>
  </div>

</div>

</body>
</html>`;
}
