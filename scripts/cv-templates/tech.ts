import { TemplateConfig, techConfig } from "./config";
import { cvData } from "./shared";

export function buildTechHtml(overrides: Partial<TemplateConfig> = {}): string {
  const c = { ...techConfig, ...overrides };
  const d = cvData;

  const skillsSection = [
    `<b>Frontend:</b> ${d.skills.frontend.join(", ")}`,
    `<b>Backend &amp; CMS:</b> ${d.skills.backend.join(", ")}`,
    `<b>Tools &amp; Architecture:</b> ${d.skills.tools.join(", ")}`,
  ]
    .map((line) => `<div class="skill-row">${line}</div>`)
    .join("\n");

  const experienceEntries = d.experience.map((exp, i) => {
    const isOldRole = i >= d.experience.length - 2;
    const companyLine =
      exp.company === "Freelance"
        ? `<div class="exp-header">
            <span class="exp-title">${exp.title}</span>
            <span class="exp-period">${exp.period}</span>
          </div>`
        : `<div class="exp-header">
            <span class="exp-title">${exp.company} — ${exp.title}</span>
            <span class="exp-period">${exp.period}</span>
          </div>`;

    if (isOldRole) {
      const oneLiner = exp.bullets[0] || "";
      return `${companyLine}<ul><li>${oneLiner}</li></ul>`;
    }

    const bullets = exp.bullets.map((b) => `<li>${b}</li>`).join("\n");
    return `${companyLine}\n<ul>${bullets}</ul>`;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    font-family: ${c.font};
    font-size: ${c.bodySize};
    color: ${c.colorText};
    line-height: 1.4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    padding: 0;
    margin: 0;
  }

  a { color: ${c.colorAccent}; text-decoration: none; }

  .header {
    margin-bottom: 10pt;
  }

  .name {
    font-size: ${c.nameSize};
    font-weight: 700;
    letter-spacing: 0.5pt;
    margin-bottom: 2pt;
  }

  .subtitle {
    font-size: 10pt;
    color: #555;
    margin-bottom: 4pt;
  }

  .contact {
    font-size: 8.5pt;
    color: #555;
  }

  .contact a { color: ${c.colorAccent}; }
  .contact span + span::before { content: " · "; color: #999; }

  .divider {
    border: none;
    border-top: 1.5pt solid ${c.colorAccent};
    margin: 8pt 0;
  }

  .section-title {
    font-size: ${c.headingSize};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8pt;
    margin-bottom: 5pt;
    color: ${c.colorText};
  }

  .skill-row {
    margin-bottom: 2pt;
    line-height: 1.45;
  }

  .skill-row b { font-weight: 600; }

  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2pt;
    margin-top: 6pt;
  }

  .exp-header:first-child { margin-top: 0; }

  .exp-title { font-weight: 600; }
  .exp-period { font-size: 8.5pt; color: #666; white-space: nowrap; }

  ul {
    margin: 2pt 0 0 14pt;
    padding: 0;
  }

  li {
    margin-bottom: 1.5pt;
    line-height: 1.4;
  }

  .edu-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .certs {
    font-size: 8.5pt;
    color: #555;
    margin-top: 3pt;
  }
</style>
</head>
<body>

<div class="header">
  <div class="name">${d.name.toUpperCase()}</div>
  <div class="subtitle">${d.title} · Solutions Engineer</div>
  <div class="contact">
    <span>${d.email}</span>
    <span>${d.phone}</span>
    <span><a href="https://${d.linkedin}">${d.linkedin}</a></span>
    <span><a href="https://${d.github}">${d.github}</a></span>
    <span><a href="https://${d.portfolio}">${d.portfolio}</a></span>
  </div>
</div>

<hr class="divider" />
<div class="section-title">Professional Summary</div>
<p>${d.summary}</p>

<hr class="divider" />
<div class="section-title">Skills</div>
${skillsSection}

<hr class="divider" />
<div class="section-title">Experience</div>
${experienceEntries.join("\n")}

<hr class="divider" />
<div class="edu-row">
  <div>
    <div class="section-title" style="margin-bottom:2pt">Education</div>
    <div><b>${d.education.institution}</b> — ${d.education.degree}</div>
  </div>
  <div style="text-align:right">
    <div style="font-size:8.5pt;color:#666;margin-top:18pt">${d.education.period}</div>
  </div>
</div>

<div class="certs" style="margin-top:8pt">
  <b>Certifications:</b> ${d.certifications.join(" · ")}
</div>

</body>
</html>`;
}
