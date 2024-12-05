import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "logkill.DeleteConsoleLog",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("no active editor");
        return;
      }

      const document = editor.document;
      const text = document.getText();

      // console.log を削除
      const newText = text.replace(/console\.log\(.*?\);?/g, "");
      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      );

      const updatedText = text
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();

          if (/^\s*console\.log\(.*\)\s*;?\s*(\/\/.*)?$/.test(trimmed)) {
            return "";
          }

          return line.replace(/console\.log\(.*\)\s*;?/g, "");
        })
        .filter((line) => line.trim() !== "")
        .join("\n");

      edit.replace(document.uri, fullRange, updatedText);

      vscode.workspace.applyEdit(edit).then(() => {
        vscode.window.showInformationMessage(
          "(=^・・^=) < goodbye console.log!!"
        );
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
