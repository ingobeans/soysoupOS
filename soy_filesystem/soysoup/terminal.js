class ProgramSource extends Program {
  onKeypress(event) {
    this.prompt.onKeypress(event);
  }
  async handleSubmit(text) {
    var args = parseToParts(text);
    if (args[0] == "exit") {
      this.quit();
      return;
    }
    if (args[0] == "cd") {
      var targetPath = fileSystem.normalizePath(
        getActualPath(args[1], this.cwd)
      );
      if (
        fileSystem.pathExists(targetPath) &&
        fileSystem.isFile(targetPath) != true
      ) {
        this.cwd = targetPath;
      } else {
        this.outputShell.println(
          error("path doesn't exist or is not a directory")
        );
      }
      this.startNewPrompt();
      return;
    }
    var commandOutputShell = this.outputShell;

    if (text.indexOf(">") != -1) {
      var splitted = splitAtLastOccurrence(text, ">");
      var outputDestination = splitted[1];
      if (outputDestination && this.isValidParentDirectory(outputDestination)) {
        text = splitted[0];
        commandOutputShell = new Shell(function (text) {
          this.writeFile(outputDestination, text);
        });
      }
    }

    await executeCommand(text, commandOutputShell, this.cwd);
    this.startNewPrompt();
  }
  async startNewPrompt() {
    var result = await this.prompt.prompt(">", true);
    this.handleSubmit(result);
  }
  load(args) {
    this.prompt = new CommandlineInput(this.outputShell, true);
    this.cwd = "/";
    this.outputShell.text =
      "booted soysoupOS v" + systemVersion + "\ntype 'help' for help";

    this.startNewPrompt();
  }
}
