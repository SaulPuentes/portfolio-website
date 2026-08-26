import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { getCvData, contact } from "./cv-templates/shared";

// Body = markdown between the first `---` rule and the notes section.
// Header (name, contact) is not parsed — it comes from the CV data so both stay in sync.
function extractBody(md: string): string {
  const parts = md.split(/^---$/m);
  if (parts.length < 3) {
    console.error("Expected `---` rules around the letter body.");
    process.exit(1);
  }
  return parts[1].trim();
}

function inline(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2">$1</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function toHtml(body: string): string {
  return body
    .split(/\n\s*\n/)
    .map((block) => `<p>${inline(block.trim().replace(/\s*\n\s*/g, " "))}</p>`)
    .join("\n");
}

function buildHtml(bodyHtml: string, subject: string): string {
  const d = getCvData("fullstack", "en");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root { --accent: #1d4ed8; --text: #111827; --text-mid: #374151; }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 10pt;
    color: var(--text-mid);
    line-height: 1.6;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  a { color: var(--accent); text-decoration: none; }
  strong { color: var(--text); font-weight: 600; }

  .header-block {
    padding-bottom: 10pt;
    border-bottom: 2pt solid var(--accent);
    margin-bottom: 16pt;
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
    letter-spacing: 0.3pt;
    margin-bottom: 6pt;
  }

  .contact {
    display: flex;
    flex-wrap: wrap;
    gap: 3pt 11pt;
    font-size: 8pt;
  }

  .subject {
    font-size: 9pt;
    font-weight: 600;
    color: var(--text);
    text-transform: uppercase;
    letter-spacing: 1.2pt;
    border-left: 2.5pt solid var(--accent);
    padding-left: 5pt;
    margin-bottom: 14pt;
  }

  p { margin-bottom: 9pt; font-weight: 300; }
  p:last-child { margin-bottom: 0; }
</style>
</head>
<body>
  <div class="header-block">
    <div class="name">${d.name}</div>
    <div class="subtitle">${d.title} · ${d.location}</div>
    <div class="contact">
      <span>${d.phone}</span>
      <span><a href="mailto:${d.email}">${d.email}</a></span>
      <span><a href="https://${d.linkedin}">${d.linkedin}</a></span>
      <span><a href="https://${d.github}">${d.github}</a></span>
      <span><a href="https://${d.portfolio}">${d.portfolio}</a></span>
    </div>
  </div>
  <div class="subject">${subject}</div>
  ${bodyHtml}
</body>
</html>`;
}

const LETTERS_DIR = "docs/cover-letters";

// Arg is a company slug ("meltwater") or a path. No arg builds every letter in the folder;
// `_`-prefixed files (the template) are skipped.
function resolveInputs(arg: string | undefined): string[] {
  if (!arg) {
    return fs
      .readdirSync(LETTERS_DIR)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      .map((f) => path.join(LETTERS_DIR, f));
  }
  const candidate = arg.endsWith(".md")
    ? arg
    : path.join(LETTERS_DIR, `${arg}.md`);
  if (!fs.existsSync(candidate)) {
    console.error(`No letter at ${candidate}`);
    process.exit(1);
  }
  return [candidate];
}

async function main() {
  const inputs = resolveInputs(process.argv[2]);
  const outDir = path.resolve("out");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const mdPath of inputs) {
    const md = fs.readFileSync(path.resolve(mdPath), "utf8");
    const title = md.match(/^#\s+(.+)$/m)?.[1] ?? "Cover Letter";
    const subject = title.replace(/^Cover Letter\s*—\s*/, "");
    const slug = path.basename(mdPath, ".md").replace(/[^a-z0-9-]/gi, "");
    const outPath = path.join(
      outDir,
      `${contact.fileSlug}-Cover-Letter-${slug.charAt(0).toUpperCase()}${slug.slice(1)}.pdf`,
    );

    const page = await browser.newPage();
    await page.setContent(buildHtml(toHtml(extractBody(md)), subject), {
      waitUntil: "networkidle0",
    });
    await page.pdf({
      path: outPath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "18mm", right: "18mm" },
    });
    await page.close();
    console.log(`✓ ${subject} → ${path.relative(process.cwd(), outPath)}`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
