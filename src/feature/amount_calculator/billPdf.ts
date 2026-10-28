import { Directory, File } from "expo-file-system";
import * as Print from "expo-print";

import type { AmountRecord } from "./types";
import { formatAmount } from "./utils";

export type CompanyDetails = {
  initials: string;
  name: string;
  tagline: string;
  address: string;
  phone: string;
};

export type BillPdfInfo = {
  record: AmountRecord;
  company: CompanyDetails;
  billNumber: string;
  billDate: string;
};

// Folder the user picked earlier in this session, so they are asked only once.
let savedDirectory: Directory | null = null;

function buildBillHtml({
  record,
  company,
  billNumber,
  billDate,
}: BillPdfInfo): string {
  const rows = [
    ["Actual Amount", `₹ ${formatAmount(record.amount)}`],
    [
      `Percentage (${record.percentage}%)`,
      `₹ ${formatAmount(record.percentageAmount)}`,
    ],
    ["Total Amount", `₹ ${formatAmount(record.total)}`],
    ["Weight", `${record.kg} kg`],
    ["Number of Packs", `${record.packs}`],
  ];

  const rowsHtml = rows
    .map(
      ([label, value], index) => `
        <tr class="${index % 2 === 1 ? "alt" : ""}">
          <td>${label}</td>
          <td class="value">${value}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { margin: 0; }
  body { font-family: Helvetica, Arial, sans-serif; color: #1E293B; margin: 0; padding: 32px; }
  .company { display: flex; align-items: center; gap: 14px; }
  .logo { width: 58px; height: 58px; border-radius: 12px; background: #173A70; color: #FFFFFF;
          font-size: 22px; font-weight: 900; display: flex; align-items: center; justify-content: center; }
  .company-name { color: #173A70; font-size: 18px; font-weight: 900; }
  .tagline { color: #475569; font-size: 12px; font-weight: 600; margin-top: 3px; }
  .info { color: #64748B; font-size: 11px; margin-top: 3px; }
  .divider { height: 2px; background: #173A70; margin: 18px 0; }
  .heading { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; }
  .invoice { font-size: 26px; font-weight: 900; color: #172554; letter-spacing: 1px; }
  .meta { text-align: right; }
  .meta-label { font-size: 11px; color: #64748B; }
  .meta-value { font-size: 13px; font-weight: 800; margin-top: 2px; }
  .meta-gap { margin-top: 8px; }
  .section { color: #173A70; font-size: 13px; font-weight: 900; letter-spacing: 0.7px; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; border: 1px solid #DCE5F0; font-size: 13px; }
  th { background: #173A70; color: #FFFFFF; font-size: 12px; font-weight: 800; text-align: left; padding: 10px 12px; }
  th.value, td.value { text-align: right; }
  td { padding: 10px 12px; border-bottom: 1px solid #E2E8F0; color: #334155; }
  td.value { font-weight: 700; color: #1E293B; }
  tr.alt td { background: #F8FAFC; }
  tr.total td { color: #15803D; font-size: 15px; font-weight: 900; border-bottom: none; }
  .signatures { display: flex; justify-content: space-between; gap: 20px; margin: 64px 0 22px; }
  .sign { flex: 1; text-align: center; }
  .sign-line { border-top: 1px solid #64748B; margin-bottom: 8px; }
  .sign-label { font-size: 11px; color: #475569; }
  .sign-company { font-size: 10px; font-weight: 700; color: #334155; margin-top: 4px; }
  .footer-divider { height: 1px; background: #E2E8F0; margin-bottom: 14px; }
  .footer { color: #173A70; font-size: 13px; font-weight: 800; text-align: center; }
</style>
</head>
<body>
  <div class="company">
    <div class="logo">${company.initials}</div>
    <div>
      <div class="company-name">${company.name}</div>
      <div class="tagline">${company.tagline}</div>
      <div class="info">${company.address}</div>
      <div class="info">Phone: ${company.phone}</div>
    </div>
  </div>

  <div class="divider"></div>

  <div class="heading">
    <div class="invoice">INVOICE</div>
    <div class="meta">
      <div class="meta-label">Bill No.</div>
      <div class="meta-value">${billNumber}</div>
      <div class="meta-label meta-gap">Date</div>
      <div class="meta-value">${billDate}</div>
    </div>
  </div>

  <div class="section">AMOUNT DETAILS</div>
  <table>
    <tr><th>Description</th><th class="value">Value</th></tr>
    ${rowsHtml}
    <tr class="total">
      <td>Total Bill Amount</td>
      <td class="value">₹ ${formatAmount(record.finalValue)}</td>
    </tr>
  </table>

  <div class="signatures">
    <div class="sign">
      <div class="sign-line"></div>
      <div class="sign-label">Customer Signature</div>
    </div>
    <div class="sign">
      <div class="sign-line"></div>
      <div class="sign-label">Authorized Signature</div>
      <div class="sign-company">For ${company.name}</div>
    </div>
  </div>

  <div class="footer-divider"></div>
  <div class="footer">Thank you for your business!</div>
</body>
</html>`;
}

/**
 * Creates the bill PDF and saves it into a folder on the phone that the user
 * picks (for example "Download"). Returns the saved file name.
 */
export async function downloadBillPdf(info: BillPdfInfo): Promise<string> {
  // 1. Turn the bill HTML into a PDF (A4 size). base64 gives us the file
  //    contents as text, which is written reliably on Android.
  const { uri, base64 } = await Print.printToFileAsync({
    html: buildBillHtml(info),
    width: 595,
    height: 842,
    base64: true,
  });

  if (!base64) {
    throw new Error("PDF could not be created.");
  }

  const tempFile = new File(uri);
  const fileName = `${info.billNumber}.pdf`;

  try {
    // 2. Ask the user for a folder the first time.
    if (!savedDirectory) {
      savedDirectory = await Directory.pickDirectoryAsync();
    }

    // 3. Save the PDF into that folder.
    const target = savedDirectory.createFile(fileName, "application/pdf");
    await target.write(base64, { encoding: "base64" });
  } catch (error) {
    // Picker cancelled or folder access lost; ask again next time.
    savedDirectory = null;
    throw error;
  } finally {
    // 4. Remove the temporary copy.
    if (tempFile.exists) {
      tempFile.delete();
    }
  }

  return fileName;
}
