import { useState } from "react";
import { Form, Action, ActionPanel, showToast, Toast, Clipboard, Alert, confirmAlert } from "@raycast/api";

interface Row {
  id: string;
  cells: string[];
}

export default function Command() {
  const [headers, setHeaders] = useState<string[]>(["Name", "Email", "Status"]);
  const [rows, setRows] = useState<Row[]>([
    { id: "1", cells: ["", "", ""] },
  ]);

  const generateTSV = (): string => {
    const headerLine = headers.join("\t");
    const dataLines = rows.map((row) => row.cells.join("\t"));
    return [headerLine, ...dataLines].join("\n");
  };

  const copyTSV = async () => {
    const tsv = generateTSV();
    await Clipboard.copy(tsv);
    showToast({
      style: Toast.Style.Success,
      title: "TSV copied to clipboard! 📋",
    });
  };

  const addRow = () => {
    const newRow: Row = {
      id: Date.now().toString(),
      cells: Array(headers.length).fill(""),
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = async (id: string) => {
    if (rows.length <= 1) {
      await showToast({
        style: Toast.Style.Warning,
        title: "Cannot delete the last row",
      });
      return;
    }

    const ok = await confirmAlert({
      title: "Delete row?",
      primaryAction: { title: "Delete", style: Alert.ActionStyle.Destructive },
    });

    if (ok) {
      setRows(rows.filter((r) => r.id !== id));
    }
  };

  const updateCellValue = (rowId: string, colIndex: number, value: string) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              cells: row.cells.map((cell, i) => (i === colIndex ? value : cell)),
            }
          : row
      )
    );
  };

  const updateHeader = (colIndex: number, value: string) => {
    setHeaders(headers.map((h, i) => (i === colIndex ? value : h)));
  };

  const addColumn = () => {
    const newColCount = headers.length + 1;
    setHeaders([...headers, `Column ${newColCount}`]);
    setRows(rows.map((row) => ({ ...row, cells: [...row.cells, ""] })));
  };

  const deleteColumn = async (colIndex: number) => {
    if (headers.length <= 1) {
      await showToast({
        style: Toast.Style.Warning,
        title: "Cannot delete the last column",
      });
      return;
    }

    const ok = await confirmAlert({
      title: `Delete column "${headers[colIndex]}"?`,
      primaryAction: { title: "Delete", style: Alert.ActionStyle.Destructive },
    });

    if (ok) {
      setHeaders(headers.filter((_, i) => i !== colIndex));
      setRows(
        rows.map((row) => ({
          ...row,
          cells: row.cells.filter((_, i) => i !== colIndex),
        }))
      );
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action title="Copy TSV to Clipboard" onAction={copyTSV} />
          <Action
            title="Add Row"
            onAction={addRow}
            shortcut={{ modifiers: ["cmd"], key: "n" }}
          />
          <Action
            title="Add Column"
            onAction={addColumn}
            shortcut={{ modifiers: ["cmd", "shift"], key: "n" }}
          />
        </ActionPanel>
      }
    >
      <Form.Section title="Column Headers">
        {headers.map((header, idx) => (
          <Form.TextField
            key={`header-${idx}`}
            id={`header-${idx}`}
            title={`Column ${idx + 1}`}
            value={header}
            onChange={(value) => updateHeader(idx, value)}
            actions={
              <ActionPanel>
                <Action
                  title="Delete This Column"
                  style={Action.Style.Destructive}
                  onAction={() => deleteColumn(idx)}
                />
              </ActionPanel>
            }
          />
        ))}
      </Form.Section>

      <Form.Separator />

      <Form.Section title={`Data Rows (${rows.length})`}>
        {rows.map((row, rowIdx) => (
          <div key={row.id}>
            {rowIdx > 0 && <Form.Separator />}

            <Form.Description
              title={`Row ${rowIdx + 1}`}
              text={
                rows.length > 1
                  ? `[Delete]（Cmd+Delete）`
                  : "Last row - cannot delete"
              }
            />

            {headers.map((header, colIdx) => (
              <Form.TextField
                key={`cell-${row.id}-${colIdx}`}
                id={`cell-${row.id}-${colIdx}`}
                title={header}
                value={row.cells[colIdx] || ""}
                onChange={(value) => updateCellValue(row.id, colIdx, value)}
                placeholder={`Enter ${header}`}
              />
            ))}

            {rows.length > 1 && (
              <Form.Description text="" />
            )}
          </div>
        ))}
      </Form.Section>

      <Form.Separator />

      <Form.Section title="Preview & Output">
        <Form.Description
          title="Current TSV"
          text={`Headers: ${headers.join(" | ")}\nRows: ${rows.length}`}
        />

        <Form.TextArea
          id="preview"
          title="TSV Content"
          value={generateTSV()}
          onChange={() => {}}
          enableMarkdown={false}
        />
      </Form.Section>
    </Form>
  );
}
