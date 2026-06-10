import { TemplateConfig, lebenslaufConfig } from "./config";
import { getCvData, Variant } from "./shared";
import path from "path";
import fs from "fs";

function buildPhotoTag(photoPath: string | null): string {
  if (!photoPath) return "";

  const abs = path.resolve(photoPath);
  if (!fs.existsSync(abs)) {
    return `<div class="photo-placeholder">Photo</div>`;
  }

  const ext = path.extname(abs).slice(1);
  const mime = ext === "jpg" ? "jpeg" : ext;
  const b64 = fs.readFileSync(abs).toString("base64");
  return `<img class="photo" src="data:image/${mime};base64,${b64}" alt="Photo" />`;
}

export function buildLebenslaufHtml(
  variant: Variant,
  overrides: Partial<TemplateConfig> = {},
): string {
  const c = { ...lebenslaufConfig, ...overrides };
  const d = getCvData(variant, "de");

  const photo = buildPhotoTag(c.photoPath);

  const sidebar = `
    ${photo}

    <div class="sidebar-section">
      <div class="sidebar-title">Persönliche Daten</div>
      <div class="sidebar-item"><b>Staatsangehörigkeit:</b> ${d.personal.nationality}</div>
      <div class="sidebar-item"><b>Adresse:</b> ${d.personal.address}</div>
      <div class="sidebar-item"><b>Telefon:</b> ${d.phone}</div>
      <div class="sidebar-item"><b>E-Mail:</b> <a href="mailto:${d.email}">${d.email}</a></div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">Links</div>
      <div class="sidebar-item"><a href="https://${d.portfolio}">${d.portfolio}</a></div>
      <div class="sidebar-item"><a href="https://${d.github}">${d.github}</a></div>
      <div class="sidebar-item"><a href="https://${d.linkedin}">${d.linkedin}</a></div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">Sprachen</div>
      ${d.languages.map((l) => `<div class="sidebar-item">${l.name}: ${l.level}</div>`).join("\n")}
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">Skills</div>
      ${d.skills
        .map(
          (group) => `
      <div class="skill-group-label">${group.label}</div>
      <div class="sidebar-skills">
        ${group.values.map((s) => `<span class="skill-chip">${s}</span>`).join("\n")}
      </div>`,
        )
        .join("\n")}
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">Zertifikate</div>
      ${d.certifications.map((cert) => `<div class="sidebar-item">${cert}</div>`).join("\n")}
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">Ausbildung</div>
      <div class="sidebar-item"><b>${d.education.institution}</b></div>
      <div class="sidebar-item">${d.education.degree}</div>
      <div class="sidebar-item">${d.education.period}</div>
    </div>
  `;

  const mainExperience = d.experience
    .map((exp) => {
      const companyLine =
        exp.company === "Freelance"
          ? `<div class="main-exp-company">${exp.title}</div>`
          : `<div class="main-exp-company">${exp.company}</div>
           <div class="main-exp-title">${exp.title}</div>`;

      const bullets = exp.bullets.map((b) => `<li>${b}</li>`).join("\n");
      return `
      <div class="main-exp-entry">
        ${companyLine}
        <div class="main-exp-period">${exp.period}${exp.location ? ` · ${exp.location}` : ""}</div>
        <ul>${bullets}</ul>
      </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Lato:wght@300;400;700&display=swap');

  @page {
    margin: 0;
  }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    font-family: 'Lato', ${c.font};
    font-size: ${c.bodySize};
    color: ${c.colorText};
    line-height: 1.4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    margin: 0;
    padding: 0;
    /* Paint the sidebar column across every printed page, even where
       sidebar content ends before the main column does. */
    background: linear-gradient(90deg, ${c.colorSidebarBg} 30%, #ffffff 30%);
  }

  a { color: #93c5fd; text-decoration: none; }

  .page {
    display: grid;
    grid-template-columns: 30% 70%;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .sidebar {
    background: ${c.colorSidebarBg};
    padding: 10pt 14pt 18pt;
    /* Clone padding onto every page fragment so the second page gets
       top padding too. */
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }

  .photo {
    width: 100%;
    max-width: 118pt;
    border-radius: 3pt;
    margin-bottom: 14pt;
    display: block;
    box-shadow: 0 3pt 10pt rgba(0, 0, 0, 0.4);
    border: 1.5pt solid rgba(255,255,255,0.15);
  }

  .photo-placeholder {
    width: 100%;
    max-width: 118pt;
    aspect-ratio: 1;
    background: #1e3a8a;
    border-radius: 3pt;
    margin-bottom: 14pt;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #bfdbfe;
    font-size: 9pt;
    border: 1pt solid rgba(255,255,255,0.2);
  }

  .sidebar-section { margin-bottom: 13pt; }

  .sidebar-title {
    font-size: ${c.headingSize};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1pt;
    border-bottom: 1pt solid rgba(255,255,255,0.25);
    padding-bottom: 3pt;
    margin-bottom: 7pt;
    color: #ffffff;
  }

  .sidebar-item {
    font-size: 8pt;
    margin-bottom: 2.5pt;
    line-height: 1.5;
    word-break: break-word;
    color: #bfdbfe;
  }

  .sidebar-item a { color: #93c5fd; }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 4pt;
  }

  .sidebar-link svg {
    flex-shrink: 0;
    fill: #93c5fd;
    opacity: 0.9;
  }

  .sidebar-item b { font-weight: 700; color: #e0e7ff; }

  .skill-group-label {
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6pt;
    color: #e0e7ff;
    margin: 6pt 0 3pt;
  }

  .sidebar-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 4pt;
  }

  .skill-chip {
    font-size: 7.5pt;
    color: #dbeafe;
    background: rgba(255, 255, 255, 0.07);
    border: 0.5pt solid rgba(255, 255, 255, 0.16);
    border-radius: 3pt;
    padding: 1.5pt 5pt;
    line-height: 1.3;
  }

  /* ── Main ── */
  .main {
    padding: 10pt 20pt 18pt 18pt;
    background: #ffffff;
    /* Clone padding onto every page fragment so the second page gets
       top padding and page breaks keep bottom padding. */
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }

  .main-name {
    font-size: ${c.nameSize};
    font-weight: 700;
    letter-spacing: 1.5pt;
    margin-bottom: 2pt;
    color: ${c.colorAccent};
    text-transform: uppercase;
  }

  .main-title {
    font-size: 9.5pt;
    color: #1e3a8a;
    margin-bottom: 10pt;
    font-weight: 300;
    letter-spacing: 0.4pt;
  }

  .main-divider {
    border: none;
    border-top: 2pt solid ${c.colorAccent};
    margin: 8pt 0;
  }

  .main-summary {
    font-size: 8.5pt;
    line-height: 1.55;
    color: #374151;
    margin-bottom: 4pt;
  }

  .main-section-title {
    font-size: ${c.headingSize};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8pt;
    margin-bottom: 7pt;
    color: ${c.colorAccent};
  }

  .main-exp-entry { margin-bottom: 10pt; }

  .main-exp-company {
    font-weight: 700;
    font-size: 9.5pt;
    color: ${c.colorText};
  }

  .main-exp-title {
    font-size: 8.5pt;
    color: #334155;
    font-weight: 400;
    font-style: italic;
  }

  .main-exp-period {
    font-size: 7.5pt;
    color: #475569;
    margin-bottom: 3pt;
    margin-top: 1pt;
    font-weight: 300;
    letter-spacing: 0.2pt;
  }

  ul {
    list-style: none;
    margin: 3pt 0 0 0;
    padding: 0;
  }

  li {
    position: relative;
    padding-left: 9pt;
    margin-bottom: 2pt;
    line-height: 1.45;
    font-size: 8.5pt;
    color: #374151;
  }

  li::before {
    content: "";
    position: absolute;
    left: 1pt;
    top: 4.5pt;
    width: 2.5pt;
    height: 2.5pt;
    border-radius: 50%;
    background: ${c.colorAccent};
  }
</style>
</head>
<body>

<div class="page">
  <div class="sidebar">
    ${sidebar}
  </div>

  <div class="main">
    <div class="main-name">${d.name.toUpperCase()}</div>
    <div class="main-title">${d.title}</div>

    <hr class="main-divider" />
    <div class="main-section-title">Profil</div>
    <p class="main-summary">${d.summary}</p>

    <hr class="main-divider" />
    <div class="main-section-title">Berufserfahrung</div>
    ${mainExperience}
  </div>
</div>

</body>
</html>`;
}
