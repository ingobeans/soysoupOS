class ProgramSource extends Program {
  onKeypress(event) {
    this.prompt.onKeypress(event);
  }
  async handleSubmit(text) {
    if (text == "exit") {
      this.quit();
      return;
    }
    var commandOutputShell = this.outputShell;

    if (text.indexOf(">") != -1) {
      var splitted = splitAtLastOccurrence(text, ">");
      var outputDestination = splitted[1];
      if (
        outputDestination &&
        fileSystem.isValidParentDirectory(outputDestination)
      ) {
        text = splitted[0];
        commandOutputShell = new Shell(function (text) {
          if (fileSystem.isFile(outputDestination) != true) {
            fileSystem.createFile(outputDestination, text);
          } else {
            fileSystem.writeFile(outputDestination, text);
          }
        });
      }
    }

    await executeCommand(text, commandOutputShell);
    this.startNewPrompt();
  }
  async startNewPrompt() {
    var result = await this.prompt.prompt(">", true);
    this.handleSubmit(result);
  }
  load(args) {
    this.prompt = new CommandlineInput(this.outputShell, true);
    this.outputShell.text =
      "booted soysoupOS v" + systemVersion + "\ntype 'help' for help";

    this.startNewPrompt();
  }
}
