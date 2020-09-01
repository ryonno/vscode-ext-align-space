import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerCommand('extension.alignSpace', () => {

    const editor = vscode.window.activeTextEditor;

    if (editor !== undefined) {
      const createSumOfCharWidth = (sel: vscode.Selection) => [...editor.document.getText(
        new vscode.Selection(new vscode.Position(sel.start.line, 0), sel.start)
      )]
        .map(char => String(char).match(/^[\x01-\x7E\uFF65-\uFF9F]$/) ? 1 : 2)
        .reduce((acm, cur) => acm + cur, 0);
      const max = Math.max(...editor.selections.map(createSumOfCharWidth));
      editor.edit(edit => {
        editor.selections.forEach(sel => {
          const sum = createSumOfCharWidth(sel);
          edit.insert(sel.start, [...Array(max - sum)].map(_ => ' ').join(''));
        });
      });
    }
  });

  context.subscriptions.push(disposable);
}
