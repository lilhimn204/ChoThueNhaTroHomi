import { describe, it, expect, vi, beforeEach } from "vitest";
import { exportCsv } from "@/lib/export-csv";

describe("exportCsv", () => {
  let createObjectURLMock: ReturnType<typeof vi.fn>;
  let revokeObjectURLMock: ReturnType<typeof vi.fn>;
  let clickMock: ReturnType<typeof vi.fn>;
  let capturedBlob: Blob | undefined;

  beforeEach(() => {
    createObjectURLMock = vi.fn().mockReturnValue("blob:mock-url");
    revokeObjectURLMock = vi.fn();
    clickMock = vi.fn();

    vi.stubGlobal("URL", {
      createObjectURL: (blob: Blob) => {
        capturedBlob = blob;
        return (createObjectURLMock as (b: Blob) => string)(blob);
      },
      revokeObjectURL: revokeObjectURLMock,
    });

    vi.stubGlobal("document", {
      createElement: vi.fn().mockReturnValue({
        href: "",
        download: "",
        click: clickMock,
      }),
    });

    vi.stubGlobal("Blob", globalThis.Blob);
    capturedBlob = undefined;
  });

  it("creates a CSV blob with UTF-8 BOM", async () => {
    exportCsv({
      filename: "test-export",
      headers: ["Name", "Price"],
      rows: [["Phòng A", "3500000"]],
    });

    expect(capturedBlob).toBeDefined();
    const bytes = new Uint8Array(await capturedBlob!.arrayBuffer());
    // UTF-8 BOM: EF BB BF
    expect(bytes[0]).toBe(0xef);
    expect(bytes[1]).toBe(0xbb);
    expect(bytes[2]).toBe(0xbf);
    const text = await capturedBlob!.text();
    expect(text).toContain("Name,Price");
    expect(text).toContain("3500000");
  });

  it("escapes cells containing commas with double quotes", async () => {
    exportCsv({
      filename: "test",
      headers: ["Description"],
      rows: [["Hello, World"]],
    });

    const text = await capturedBlob!.text();
    expect(text).toContain('"Hello, World"');
  });

  it("escapes cells containing double quotes", async () => {
    exportCsv({
      filename: "test",
      headers: ["Note"],
      rows: [['She said "hi"']],
    });

    const text = await capturedBlob!.text();
    expect(text).toContain('"She said ""hi"""');
  });

  it("triggers download and revokes object URL", () => {
    exportCsv({
      filename: "test",
      headers: ["A"],
      rows: [["1"]],
    });

    expect(clickMock).toHaveBeenCalledOnce();
    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:mock-url");
  });

  it("includes date in filename", () => {
    const anchor = { href: "", download: "", click: vi.fn() };
    (document.createElement as ReturnType<typeof vi.fn>).mockReturnValue(anchor);

    exportCsv({
      filename: "report",
      headers: ["A"],
      rows: [],
    });

    const today = new Date().toISOString().slice(0, 10);
    expect(anchor.download).toBe(`report-${today}.csv`);
  });

  it("uses CRLF line endings", async () => {
    exportCsv({
      filename: "test",
      headers: ["H1"],
      rows: [["R1"], ["R2"]],
    });

    const text = await capturedBlob!.text();
    // BOM is a single character \uFEFF in the string
    const content = text.replace(/^\uFEFF/, "");
    const lines = content.split("\r\n");
    expect(lines).toHaveLength(3); // header + 2 rows
    expect(lines[0]).toBe("H1");
    expect(lines[1]).toBe("R1");
    expect(lines[2]).toBe("R2");
  });
});
