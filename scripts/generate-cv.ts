import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { buildTechHtml } from "./cv-templates/tech";
import { buildLebenslaufHtml } from "./cv-templates/lebenslauf";
import { Variant, Lang, contact } from "./cv-templates/shared";
import { CvDraft, MODEL, requestDraft, unknownSkills, validateDraft } from "./cv-templates/ai";

const VARIANTS: Variant[] = ["fullstack", "frontend", "reactnative", "dotnet", "backend"];
const LANGS: Lang[] = ["en", "de"];

const LANGS_BY_VARIANT: Record<Variant, Lang[]> = {
  fullstack: ["en", "de"],
  frontend: ["en", "de"],
  reactnative: ["en"],
  dotnet: ["en"],
  backend: ["en"],
};

const variantLabels: Record<Variant, string> = {
  fullstack: "Fullstack",
  frontend: "Frontend",
  reactnative: "ReactNative",
  dotnet: "DotNet",
  backend: "Backend",
};

function parseFlag<T extends string>(
  flag: string,
  allowed: readonly T[],
): T | "all" {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || !process.argv[idx + 1]) return "all";
  const val = process.argv[idx + 1];
  if (val === "all" || (allowed as readonly string[]).includes(val)) {
    return val as T | "all";
  }
  console.error(`Unknown ${flag} "${val}". Use: ${allowed.join(", ")}, or all`);
  process.exit(1);
}

function flagValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  const val = process.argv[idx + 1];
  if (!val || val.startsWith("--")) {
    console.error(`${flag} needs a value, e.g. ${flag} docs/applications/acme.md`);
    process.exit(1);
  }
  return val;
}

interface PdfJob {
  name: string;
  html: string;
  outPath: string;
  margins: { top: string; bottom: string; left: string; right: string };
}

const EN_MARGINS = { top: "20mm", bottom: "20mm", left: "18mm", right: "18mm" };

function loadDraft(draftPath: string): CvDraft {
  try {
    return validateDraft(JSON.parse(fs.readFileSync(draftPath, "utf8")));
  } catch (err) {
    throw new Error(`${path.relative(process.cwd(), draftPath)}: ${(err as Error).message}`);
  }
}

// Draft = the model's text for one posting. It's only (re)requested when missing or on --regenerate,
// so hand edits survive re-runs.
async function jobPdf(jobPath: string, regenerate: boolean): Promise<PdfJob> {
  const slug = path.basename(jobPath, path.extname(jobPath));
  const draftPath = path.resolve("docs/cv/drafts", `${slug}.json`);

  if (regenerate || !fs.existsSync(draftPath)) {
    const posting = fs.readFileSync(jobPath, "utf8");
    if (!posting.trim()) throw new Error(`${jobPath} is empty`);
    if (fs.existsSync(".env")) process.loadEnvFile(".env");
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not set. Add it to .env.");

    console.log(`Asking ${MODEL} to tailor the CV to ${jobPath}…`);
    const draft = await requestDraft(posting, apiKey);
    fs.mkdirSync(path.dirname(draftPath), { recursive: true });
    fs.writeFileSync(draftPath, JSON.stringify(draft, null, 2) + "\n");
    console.log(`✓ Draft → ${path.relative(process.cwd(), draftPath)} (edit it and re-run to re-render)`);
  }

  const draft = loadDraft(draftPath);
  for (const skill of unknownSkills(draft)) {
    console.warn(`  ⚠ Skill not found in CV facts, check it's true: ${skill}`);
  }
  return {
    name: `${slug} EN (AI draft)`,
    html: buildTechHtml("fullstack", {}, draft),
    outPath: path.resolve("docs/cv", `${contact.fileSlug}-CV-${slug}-EN.pdf`),
    margins: EN_MARGINS,
  };
}

async function main() {
  const variantArg = parseFlag("--variant", VARIANTS);
  const langArg = parseFlag("--lang", LANGS);
  const outDir = path.resolve("docs/cv");
  fs.mkdirSync(outDir, { recursive: true });

  // The site links CVs via site.json `cvFiles`; those must also be served from public/.
  const sitePath = path.resolve("content/site.json");
  const sitePdfs: string[] = [...new Set<string>(fs.existsSync(sitePath)
    ? Object.values(JSON.parse(fs.readFileSync(sitePath, "utf8")).cvFiles ?? {})
    : [])];

  const variants = variantArg === "all" ? VARIANTS : [variantArg];
  const langs = langArg === "all" ? LANGS : [langArg];

  const jobs: PdfJob[] = [];
  const jobPath = flagValue("--job");
  if (jobPath) jobs.push(await jobPdf(jobPath, process.argv.includes("--regenerate")));

  for (const variant of jobPath ? [] : variants) {
    const variantLangs = langs.filter((l) => LANGS_BY_VARIANT[variant].includes(l));
    for (const lang of variantLangs) {
      const fileName = `${contact.fileSlug}-CV-${variantLabels[variant]}-${lang.toUpperCase()}.pdf`;
      jobs.push(
        lang === "en"
          ? {
              name: `${variantLabels[variant]} EN (ATS)`,
              html: buildTechHtml(variant),
              outPath: path.join(outDir, fileName),
              margins: EN_MARGINS,
            }
          : {
              name: `${variantLabels[variant]} DE (Lebenslauf)`,
              html: buildLebenslaufHtml(variant),
              outPath: path.join(outDir, fileName),
              margins: { top: "0", bottom: "0", left: "0", right: "0" },
            },
      );
    }
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const job of jobs) {
    const page = await browser.newPage();
    await page.setContent(job.html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: job.outPath,
      format: "A4",
      printBackground: true,
      margin: job.margins,
    });
    await page.close();
    console.log(`✓ ${job.name} → ${path.relative(process.cwd(), job.outPath)}`);
    for (const url of sitePdfs) {
      if (path.basename(url) !== path.basename(job.outPath)) continue;
      const publicPath = path.join(path.resolve("public"), url);
      fs.mkdirSync(path.dirname(publicPath), { recursive: true });
      fs.copyFileSync(job.outPath, publicPath);
      console.log(`  ↳ copied to ${path.relative(process.cwd(), publicPath)}`);
    }
  }

  await browser.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
