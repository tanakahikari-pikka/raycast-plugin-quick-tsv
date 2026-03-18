import { useState } from "react";
import { Form, Action, ActionPanel, showToast, Toast, Clipboard, Icon } from "@raycast/api";

function splitLine(line: string): string[] {
  return line.split(/\t|  +/);
}

function toTSV(input: string): string {
  return input
    .split("\n")
    .map((line) => splitLine(line).join("\t"))
    .join("\n");
}

function tsvToMarkdownTable(tsv: string): string {
  const lines = tsv.split("\n").filter((line) => line.length > 0);
  if (lines.length === 0) return "*Empty*";

  const table = lines.map(splitLine);
  const colCount = Math.max(...table.map((row) => row.length));

  const normalized = table.map((row) => {
    const padded = [...row];
    while (padded.length < colCount) padded.push("");
    return padded;
  });

  const colWidths = Array.from({ length: colCount }, (_, ci) =>
    Math.max(3, ...normalized.map((row) => (row[ci] || "").length))
  );

  const formatRow = (row: string[]) =>
    "| " + row.map((cell, i) => (cell || " ").padEnd(colWidths[i])).join(" | ") + " |";

  const separator = "| " + colWidths.map((w) => "-".repeat(w)).join(" | ") + " |";

  const [header, ...data] = normalized;
  return [formatRow(header), separator, ...data.map(formatRow)].join("\n");
}

const SAMPLE = "Name  Email  Status\nAlice  alice@example.com  Active";

export default function Command() {
  const [tsv, setTsv] = useState(SAMPLE);

  const copyTSV = async () => {
    await Clipboard.copy(toTSV(tsv));
    showToast({ style: Toast.Style.Success, title: "TSV copied to clipboard!" });
  };

  const pasteFromClipboard = async () => {
    const text = await Clipboard.readText();
    if (text) {
      setTsv(text);
      showToast({ style: Toast.Style.Success, title: "Pasted from clipboard" });
    }
  };

  const rowCount = tsv.split("\n").filter(Boolean).length;
  const colCount = Math.max(...tsv.split("\n").filter(Boolean).map((l) => splitLine(l).length), 0);

  return (
    <Form
      actions={
        <ActionPanel>
          <Action title="Copy TSV to Clipboard" icon={Icon.Clipboard} onAction={copyTSV} />
          <Action
            title="Paste from Clipboard"
            icon={Icon.Document}
            onAction={pasteFromClipboard}
            shortcut={{ modifiers: ["cmd", "shift"], key: "v" }}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="tsv-input"
        title="TSV Input"
        value={tsv}
        onChange={setTsv}
        placeholder={"2+ spaces to separate columns, Enter for new row\nName  Email  Status"}
      />

      <Form.Separator />

      <Form.Description title="Table Preview" text={tsvToMarkdownTable(tsv)} />
      <Form.Description title="Size" text={`${rowCount} rows x ${colCount} columns`} />
    </Form>
  );
}
