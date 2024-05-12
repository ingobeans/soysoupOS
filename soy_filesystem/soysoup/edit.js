class MultitextInput extends CommandlineInput {}

class ProgramSource extends Program {
  onKeypress(event) {
    this.prompt.onKeypress(event);
  }
  async load(args) {
    if (fileSystem.pathExists(args) == false || !fileSystem.isFile(args)) {
      this.outputShell.println("error: path doesn't exist or is not a file");
      this.quit();
      return;
    }

    this.prompt = new MultitextInput(this.outputShell);
    this.outputShell.text = "";
    var contents = fileSystem.readFile(args);

    this.prompt.prompt("", true).then((newContents) => {
      fileSystem.writeFile(args, newContents);
      this.outputShell.flush();
      this.quit();
    });
    this.prompt.currentLineInput = contents;
    this.prompt.selectionIndex = contents.length;
    this.prompt.flush();
  }
}
