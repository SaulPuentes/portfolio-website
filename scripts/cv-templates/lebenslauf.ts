import { TemplateConfig, lebenslaufConfig } from "./config";
import { cvData } from "./shared";
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
  overrides: Partial<TemplateConfig> = {},
): string {
  const c = { ...lebenslaufConfig, ...overrides };
  const d = cvData;

  const photo = buildPhotoTag(c.photoPath);

  const sidebar = `
    ${photo}

    <div class="sidebar-section">
      <div class="sidebar-title">Persönliche Daten</div>
      <div class="sidebar-item"><b>Geburtsjahr:</b> ${d.personal.birthDate}</div>
      <div class="sidebar-item"><b>Staatsangehörigkeit:</b> ${d.personal.nationality}</div>
      <div class="sidebar-item"><b>Adresse:</b> ${d.personal.address}</div>
      <div class="sidebar-item"><b>Telefon:</b> ${d.phone}</div>
      <div class="sidebar-item"><b>E-Mail:</b> <a href="mailto:${d.email}">${d.email}</a></div>
      <div class="sidebar-item"><a href="https://${d.linkedin}">${d.linkedin}</a></div>
      <div class="sidebar-item"><a href="https://${d.github}">${d.github}</a></div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">Sprachen</div>
      ${d.languages.map((l) => `<div class="sidebar-item">${l.name}: ${l.level}</div>`).join("\n")}
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">Skills</div>
      ${[...d.skills.frontend, ...d.skills.backend, ...d.skills.tools].map((s) => `<div class="sidebar-item">${s}</div>`).join("\n")}
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

  body { margin: 0; padding: 0; }

  a { color: ${c.colorAccent}; text-decoration: none; }

  .page {
    display: grid;
    grid-template-columns: 30% 70%;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .sidebar {
    background: ${c.colorSidebarBg};
    padding: 20pt 14pt;
  }

  .photo {
    width: 100%;
    max-width: 120pt;
    border-radius: 4pt;
    margin-bottom: 14pt;
    display: block;
  }

  .photo-placeholder {
    width: 100%;
    max-width: 120pt;
    aspect-ratio: 1;
    background: #e5e7eb;
    border-radius: 4pt;
    margin-bottom: 14pt;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 9pt;
  }

  .sidebar-section { margin-bottom: 14pt; }

  .sidebar-title {
    font-size: ${c.headingSize};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6pt;
    border-bottom: 1.5pt solid ${c.colorAccent};
    padding-bottom: 3pt;
    margin-bottom: 6pt;
    color: ${c.colorText};
  }

  .sidebar-item {
    font-size: 8.5pt;
    margin-bottom: 2.5pt;
    line-height: 1.45;
    word-break: break-word;
  }

  .sidebar-item b { font-weight: 600; }

  /* ── Main ── */
  .main {
    padding: 20pt 18pt 20pt 16pt;
  }

  .main-name {
    font-size: ${c.nameSize};
    font-weight: 700;
    letter-spacing: 0.5pt;
    margin-bottom: 2pt;
  }

  .main-title {
    font-size: 10pt;
    color: #555;
    margin-bottom: 10pt;
  }

  .main-divider {
    border: none;
    border-top: 1.5pt solid ${c.colorAccent};
    margin: 8pt 0;
  }

  .main-section-title {
    font-size: ${c.headingSize};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8pt;
    margin-bottom: 6pt;
    color: ${c.colorText};
  }

  .main-exp-entry { margin-bottom: 10pt; }

  .main-exp-company {
    font-weight: 700;
    font-size: 10pt;
  }

  .main-exp-title {
    font-size: 9pt;
    color: #555;
  }

  .main-exp-period {
    font-size: 8pt;
    color: #888;
    margin-bottom: 3pt;
  }

  ul {
    margin: 3pt 0 0 14pt;
    padding: 0;
  }

  li {
    margin-bottom: 2pt;
    line-height: 1.4;
    font-size: 8.5pt;
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
    <div class="main-section-title">Berufserfahrung</div>
    ${mainExperience}
  </div>
</div>

</body>
</html>`;
}
