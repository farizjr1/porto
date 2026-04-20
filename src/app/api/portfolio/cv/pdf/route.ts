import { getPortfolioData } from "@/lib/database";

export const dynamic = "force-static";

const escapePdfText = (value: string) => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const wrapLines = (text: string, maxChars = 90) => {
  const lines: string[] = [];

  text.split(/\r?\n/).forEach((line) => {
    if (line.length <= maxChars) {
      lines.push(line);
      return;
    }

    const words = line.split(" ");
    let current = "";

    words.forEach((word) => {
      if (!current) {
        current = word;
        return;
      }

      if (`${current} ${word}`.length > maxChars) {
        lines.push(current);
        current = word;
      } else {
        current = `${current} ${word}`;
      }
    });

    if (current) {
      lines.push(current);
    }
  });

  return lines;
};

const buildSimplePdf = (title: string, text: string) => {
  const contentLines = [title, "", ...wrapLines(text)];
  let y = 780;

  const textOperators = contentLines
    .map((line) => {
      const currentY = y;
      y -= 16;
      return `BT /F1 11 Tf 50 ${Math.max(currentY, 40)} Td (${escapePdfText(line)}) Tj ET`;
    })
    .join("\n");

  const objects: string[] = [];
  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");
  objects.push("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj");
  objects.push("3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj");
  objects.push("4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj");
  objects.push(`5 0 obj << /Length ${textOperators.length} >> stream\n${textOperators}\nendstream endobj`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });

  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "binary");
};

export async function GET() {
  const data = await getPortfolioData();
  const fileTitle = `${data.profile.fullName} - ATS CV`;
  const pdf = buildSimplePdf(fileTitle, data.profile.cvContent);
  const safeFilename = data.profile.fullName
    .toLowerCase()
    .replace(/[\r\n"\\]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeFilename || "cv"}-cv.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
