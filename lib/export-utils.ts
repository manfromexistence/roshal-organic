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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

  const printWindow = window.open("", "_blank", "noopener,noreferrer");

  if (!printWindow) {
    throw new Error("The export window was blocked by the browser.");
  }

  const title = options?.title || "Export";
  const metadata = options?.metadata || [];
  const orientation = options?.orientation || "portrait";
  const tableHeaders = columns
    .map((column) => `<th>${escapeHtml(column.header)}</th>`)
    .join("");
  const tableRows = data
    .map(
      (row) =>
        `<tr>${columns
          .map(
            (column) =>
              `<td>${escapeHtml(serializeValue(row[column.key]))}</td>`,
          )
          .join("")}</tr>`,
    )
    .join("");
  const metadataRows = metadata
    .map(
      (item) =>
        `<div class="meta-item"><span class="meta-label">${escapeHtml(item.label)}</span><span>${escapeHtml(item.value)}</span></div>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page { size: ${orientation}; margin: 16mm; }
      body { font-family: "JetBrains Mono", monospace; color: #111827; margin: 0; }
      .page { padding: 24px; }
      h1 { font-size: 20px; margin: 0 0 16px; }
      .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; margin-bottom: 20px; }
      .meta-item { border: 1px solid #d4d4d8; border-radius: 8px; padding: 10px 12px; }
      .meta-label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #6b7280; margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #d4d4d8; padding: 8px 10px; text-align: left; vertical-align: top; }
      th { background: #f4f4f5; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
      tbody tr:nth-child(even) { background: #fafafa; }
    </style>
  </head>
  <body>
    <div class="page">
      <h1>${escapeHtml(title)}</h1>
      ${metadataRows ? `<div class="meta">${metadataRows}</div>` : ""}
      <table>
        <thead>
          <tr>${tableHeaders}</tr>
        </thead>
        <tbody>
          ${tableRows || `<tr><td colspan="${columns.length}">No records available.</td></tr>`}
        </tbody>
      </table>
    </div>
  </body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
