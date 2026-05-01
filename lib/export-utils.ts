interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

interface ExportData {
  [key: string]: string | number | null | undefined;
}

interface ExportOptions {
  filename?: string;
  metadata?: Array<{ label: string; value: string }>;
  orientation?: "portrait" | "landscape";
  sheetName?: string;
  title?: string;
}

function serializeValue(value: string | number | null | undefined) {
  return value == null ? "" : String(value);
}

function normalizeFilename(filename: string) {
  return filename.replace(/[<>:"/\\|?*]+/g, "-");
}

function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = normalizeFilename(filename);
  link.click();
  window.URL.revokeObjectURL(objectUrl);
}

function sanitizePdfText(value: string | number | null | undefined) {
  return serializeValue(value)
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "?")
    .trim();
}

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function pdfNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function wrapPdfText(
  value: string | number | null | undefined,
  maxChars: number,
) {
  const text = sanitizePdfText(value);

  if (!text) {
    return [""];
  }

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (word.length > maxChars) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }

      for (let index = 0; index < word.length; index += maxChars) {
        lines.push(word.slice(index, index + maxChars));
      }
      continue;
    }

    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxChars && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length <= 4) {
    return lines;
  }

  return [...lines.slice(0, 3), `${lines[3].slice(0, maxChars - 3)}...`];
}

function addPdfText(
  operations: string[],
  value: string,
  x: number,
  y: number,
  size: number,
  style: "regular" | "bold" = "regular",
) {
  operations.push(
    `BT /${style === "bold" ? "F2" : "F1"} ${size} Tf ${pdfNumber(x)} ${pdfNumber(y)} Td (${escapePdfText(value)}) Tj ET`,
  );
}

function buildSimplePdf(
  data: ExportData[],
  columns: ExportColumn[],
  options?: ExportOptions,
) {
  const isLandscape = options?.orientation === "landscape";
  const pageWidth = isLandscape ? 842 : 595;
  const pageHeight = isLandscape ? 595 : 842;
  const margin = 32;
  const title = sanitizePdfText(options?.title || "Export");
  const metadata = options?.metadata || [];
  const fontSize = isLandscape ? 7 : 8;
  const lineHeight = fontSize + 2;
  const cellPadding = 3;
  const availableWidth = pageWidth - margin * 2;
  const totalWeight = columns.reduce(
    (sum, column) => sum + (column.width || 16),
    0,
  );
  const columnWidths = columns.map(
    (column) => (availableWidth * (column.width || 16)) / totalWeight,
  );
  const pages: string[] = [];
  let operations: string[] = [];
  let y = pageHeight - margin;

  const drawHeader = (continued = false) => {
    operations = [];
    y = pageHeight - margin;
    addPdfText(
      operations,
      continued ? `${title} (continued)` : title,
      margin,
      y,
      16,
      "bold",
    );
    y -= 22;

    if (!continued && metadata.length > 0) {
      for (const item of metadata) {
        addPdfText(
          operations,
          `${sanitizePdfText(item.label)}: ${sanitizePdfText(item.value)}`,
          margin,
          y,
          9,
        );
        y -= 12;
      }
      y -= 4;
    }

    operations.push(
      `0.94 g ${pdfNumber(margin)} ${pdfNumber(y - 18)} ${pdfNumber(availableWidth)} 18 re f 0 g`,
    );

    let x = margin;
    columns.forEach((column, index) => {
      addPdfText(
        operations,
        sanitizePdfText(column.header).toUpperCase(),
        x + cellPadding,
        y - 12,
        fontSize,
        "bold",
      );
      x += columnWidths[index];
    });

    y -= 22;
  };

  const finishPage = () => {
    pages.push(operations.join("\n"));
  };

  drawHeader(false);

  const rows = data.length > 0 ? data : [{} as ExportData];

  rows.forEach((row) => {
    const rowLines = columns.map((column, index) =>
      wrapPdfText(
        row[column.key] ?? (data.length > 0 ? "" : "No records available."),
        Math.max(6, Math.floor(columnWidths[index] / (fontSize * 0.55))),
      ),
    );
    const rowHeight =
      Math.max(...rowLines.map((lines) => lines.length)) * lineHeight +
      cellPadding * 2;

    if (y - rowHeight < margin) {
      finishPage();
      drawHeader(true);
    }

    operations.push(
      `0.82 G ${pdfNumber(margin)} ${pdfNumber(y - rowHeight)} ${pdfNumber(availableWidth)} ${pdfNumber(rowHeight)} re S 0 G`,
    );

    let x = margin;
    rowLines.forEach((lines, columnIndex) => {
      lines.forEach((line, lineIndex) => {
        addPdfText(
          operations,
          line,
          x + cellPadding,
          y - cellPadding - fontSize - lineIndex * lineHeight,
          fontSize,
        );
      });
      x += columnWidths[columnIndex];
    });

    y -= rowHeight;
  });

  finishPage();

  const objects: string[] = ["", "", "", ""];
  const addObject = (content: string) => {
    objects.push(content);
    return objects.length;
  };

  const pageIds: number[] = [];
  pages.forEach((content) => {
    const contentId = addObject(
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    );
    const pageId = addObject(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    pageIds.push(pageId);
  });

  objects[0] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  objects[2] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";

  const header = "%PDF-1.4\n";
  let body = "";
  let offset = header.length;
  const offsets: number[] = [0];

  objects.forEach((object, index) => {
    const objectNumber = index + 1;
    const serialized = `${objectNumber} 0 obj\n${object}\nendobj\n`;
    offsets.push(offset);
    body += serialized;
    offset += serialized.length;
  });

  const xrefOffset = offset;
  const xref = [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets
      .slice(1)
      .map((item) => `${String(item).padStart(10, "0")} 00000 n `),
    "trailer",
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    String(xrefOffset),
    "%%EOF",
  ].join("\n");

  return `${header}${body}${xref}`;
}

export async function exportToExcel(
  data: ExportData[],
  columns: ExportColumn[],
  options?: ExportOptions,
) {
  if (typeof window === "undefined") {
    return;
  }

  const xlsx = await import("xlsx");
  const rows = data.map((row) =>
    Object.fromEntries(
      columns.map((column) => [column.header, serializeValue(row[column.key])]),
    ),
  );

  const worksheet = xlsx.utils.json_to_sheet(rows);
  worksheet["!cols"] = columns.map((column) => ({
    wch: column.width ?? Math.max(column.header.length + 4, 16),
  }));

  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(
    workbook,
    worksheet,
    options?.sheetName || options?.title || "Export",
  );

  const output = xlsx.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const filename = options?.filename || `${options?.title || "export"}.xlsx`;
  downloadBlob(
    new Blob([output], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename,
  );
}

export async function exportToPDF(
  data: ExportData[],
  columns: ExportColumn[],
  options?: ExportOptions,
) {
  if (typeof window === "undefined") {
    return;
  }

  const pdf = buildSimplePdf(data, columns, options);
  const filename = options?.filename || `${options?.title || "export"}.pdf`;

  downloadBlob(
    new Blob([pdf], {
      type: "application/pdf",
    }),
    filename,
  );
}
