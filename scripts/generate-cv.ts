import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { buildTechHtml } from "./cv-templates/tech";
import { buildLebenslaufHtml } from "./cv-templates/lebenslauf";

type Variant = "tech" | "de" | "all";

function parseVariant(): Variant {
  const idx = process.argv.indexOf("--variant");
  if (idx === -1 || !process.argv[idx + 1]) return "all";
  const val = process.argv[idx + 1];
  if (val === "tech" || val === "de" || val === "all") return val;
  console.error(`Unknown variant "${val}". Use: tech, de, or all`);
  process.exit(1);
}

interface PdfJob {
  name: string;
  html: string;
  outPath: string;
  margins: { top: string; bottom: string; left: string; right: string };
}

async function main() {
  const variant = parseVariant();
  const outDir = path.resolve("public");
  fs.mkdirSync(outDir, { recursive: true });

  const jobs: PdfJob[] = [];

  if (variant === "tech" || variant === "all") {
    jobs.push({
      name: "Tech/ATS",
      html: buildTechHtml(),
      outPath: path.join(outDir, "cv-tech.pdf"),
      margins: { top: "20mm", bottom: "20mm", left: "18mm", right: "18mm" },
    });
  }

  if (variant === "de" || variant === "all") {
    jobs.push({
      name: "Lebenslauf",
      html: buildLebenslaufHtml(),
      outPath: path.join(outDir, "cv-de.pdf"),
      margins: { top: "0", bottom: "0", left: "0", right: "0" },
    });
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
