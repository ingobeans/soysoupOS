class ProgramSource extends Program {
  onKeypress(event) {
    if (this.focusedProcess == undefined) {
      this.prompt.onKeypress(event);
    } else {
      this.focusedProcess.onKeypress(event);
    }
  }
  async handleSubmit(text) {
    let args = parseToParts(text);
    if (args[0] == "exit") {
      this.quit();
      return;
    }
    if (args[0] == "cd") {
      let targetPath = fileSystem.normalizePath(
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
    let newShell = new Shell(function () {}.bind(this.outputShell));
    newShell.setText = this.outputShell.setText.bind(this.outputShell);
    newShell.print = this.outputShell.print.bind(this.outputShell);
    newShell.println = this.outputShell.println.bind(this.outputShell);
    newShell.flush = this.outputShell.flush.bind(this.outputShell);

    if (text.indexOf(">") != -1) {
      let splitted = splitAtLastOccurrence(text, ">");
      let self = this;
      let outputDestination = splitted[1];
      if (outputDestination && this.isValidParentDirectory(outputDestination)) {
        text = splitted[0];
        newShell.outputFunction = function (text) {
          self.writeFile(outputDestination, removeAnsiCodes(text));
        };
      }
    }

    let process = executeCommand(text, newShell, this.cwd);
    if (process != undefined) {
      let oldFocus = this.focusedProcess;
      this.processes.push(process["instance"]);
      this.focusedProcess = process["instance"];
      await process["promise"];
      removeItem(this.processes, process["instance"]);

      // only restore focuse IF this command is still the last active program
      if (this.focusedProcess == process["instance"]) {
        this.focusedProcess = oldFocus;
      }
    }
    this.startNewPrompt();
  }
  async startNewPrompt() {
    let result = await this.prompt.prompt(">", true);
    this.handleSubmit(result);
  }
  load(args) {
    this.processes = [];
    this.focusedProcess = undefined;
    this.prompt = new CommandlineInput(this.outputShell, true);
    this.cwd = "/";
    this.outputShell.println(
      `soysoupOS v${systemVersion}\ntype 'help' for help`
    );

    this.startNewPrompt();
  }
}
