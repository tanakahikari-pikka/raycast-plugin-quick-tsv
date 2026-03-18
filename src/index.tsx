import { useState, useEffect } from "react";
import { Form, Action, ActionPanel, showToast, Toast, Clipboard } from "@raycast/api";

interface TSVData {
  headers: string[];
  rows: string[][];
}

export default function Command() {
  const [tsvContent, setTsvContent] = useState<string>("");
  const [parsedData, setParsedData] = useState<TSVData | null>(null);
  const [error, setError] = useState<string>("");

  // Load clipboard content on mount
  useEffect(() => {
    loadClipboard();
  }, []);

  const loadClipboard = async () => {
    try {
      const clipboard = await Clipboard.readText();
      if (clipboard) {
        setTsvContent(clipboard);
        parseAndValidateTSV(clipboard);
      }
    } catch (err) {
      setError("Failed to read clipboard");
    }
  };

  const parseAndValidateTSV = (text: string) => {
    try {
      setError("");
      const lines = text.trim().split("\n");

      if (lines.length === 0) {
        setError("Empty content");
        setParsedData(null);
        return;
      }

      const headers = lines[0].split("\t");
      const rows = lines.slice(1).map((line) => line.split("\t"));

      // Validate consistency
      const invalidRows = rows.filter((row) => row.length !== headers.length);
      if (invalidRows.length > 0) {
        setError(
          `Found ${invalidRows.length} rows with inconsistent column count`
        );
      }

      setParsedData({ headers, rows });
    } catch (err) {
      setError("Failed to parse TSV");
      setParsedData(null);
    }
  };

  const handleTsvChange = (value: string) => {
    setTsvContent(value);
    parseAndValidateTSV(value);
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.copy(text);
    showToast({
      style: Toast.Style.Success,
      title: "Copied to clipboard",
    });
  };

  const copyAsJson = async () => {
    if (!parsedData) return;

    const json = JSON.stringify(
      parsedData.rows.map((row) =>
        Object.fromEntries(parsedData.headers.map((h, i) => [h, row[i] || ""]))
      ),
      null,
      2
    );

    await copyToClipboard(json);
  };

  const copyAsMarkdown = async () => {
    if (!parsedData) return;

    const { headers, rows } = parsedData;
    let markdown = `| ${headers.join(" | ")} |\n`;
    markdown += `| ${headers.map(() => "---").join(" | ")} |\n`;
    markdown += rows.map((row) => `| ${row.join(" | ")} |`).join("\n");

    await copyToClipboard(markdown);
  };

  const copyAsCSV = async () => {
    if (!parsedData) return;

    const { headers, rows } = parsedData;
    const escapeCSV = (field: string) => {
      if (field.includes(",") || field.includes('"') || field.includes("\n")) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    let csv = headers.map(escapeCSV).join(",") + "\n";
    csv += rows.map((row) => row.map(escapeCSV).join(",")).join("\n");

    await copyToClipboard(csv);
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action title="Reload from Clipboard" onAction={loadClipboard} />
          {parsedData && (
            <>
              <Action title="Copy as JSON" onAction={copyAsJson} />
              <Action title="Copy as Markdown" onAction={copyAsMarkdown} />
              <Action title="Copy as CSV" onAction={copyAsCSV} />
              <Action
                title="Copy Original TSV"
                onAction={() => copyToClipboard(tsvContent)}
              />
            </>
          )}
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="tsvContent"
        title="TSV Data"
        placeholder="Paste your TSV data here..."
        value={tsvContent}
        onChange={handleTsvChange}
      />

      {error && <Form.Description text={`⚠️ ${error}`} />}

      {parsedData && (
        <>
          <Form.Description
            text={`✓ Parsed: ${parsedData.headers.length} columns, ${parsedData.rows.length} rows`}
          />

          <Form.Separator />

          <Form.Description title="Preview" text="" />
          <Form.Description
            text={`Headers: ${parsedData.headers.join(" | ")}`}
          />

          {parsedData.rows.slice(0, 3).map((row, idx) => (
            <Form.Description key={idx} text={`Row ${idx + 1}: ${row.join(" | ")}`} />
          ))}

          {parsedData.rows.length > 3 && (
            <Form.Description
              text={`... and ${parsedData.rows.length - 3} more rows`}
            />
          )}
        </>
      )}
    </Form>
  );
}
