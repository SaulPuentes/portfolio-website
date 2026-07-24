import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { buildTechHtml } from "./cv-templates/tech";
import { buildLebenslaufHtml } from "./cv-templates/lebenslauf";
import { Variant, Lang } from "./cv-templates/shared";

const VARIANTS: Variant[] = ["fullstack", "frontend", "reactnative"];
const EN_ONLY: Variant[] = ["reactnative"];
const LANGS: Lang[] = ["en", "de"];

const variantLabels: Record<Variant, string> = {
  fullstack: "Fullstack",
  frontend: "Frontend",
  reactnative: "ReactNative",
  dotnet: "DotNet",
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

interface PdfJob {
  name: string;
  html: string;
  outPath: string;
  margins: { top: string; bottom: string; left: string; right: string };
}

async function main() {
  const variantArg = parseFlag("--variant", VARIANTS);
  const langArg = parseFlag("--lang", LANGS);
  const outDir = path.resolve("public");
  fs.mkdirSync(outDir, { recursive: true });

  const variants = variantArg === "all" ? VARIANTS : [variantArg];
  const langs = langArg === "all" ? LANGS : [langArg];

  const jobs: PdfJob[] = [];

  for (const variant of variants) {
    const variantLangs = EN_ONLY.includes(variant)
      ? langs.filter((l) => l === "en")
      : langs;
    for (const lang of variantLangs) {
      const fileName = `Saul-Puentes-CV-${variantLabels[variant]}-${lang.toUpperCase()}.pdf`;
      jobs.push(
        lang === "en"
          ? {
              name: `${variantLabels[variant]} EN (ATS)`,
              html: buildTechHtml(variant),
              outPath: path.join(outDir, fileName),
              margins: { top: "20mm", bottom: "20mm", left: "18mm", right: "18mm" },
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
  }

  await browser.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
