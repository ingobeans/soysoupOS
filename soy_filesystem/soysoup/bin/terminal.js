class ProgramSource extends Program {
  onKeypress(event) {
    if (event.key == "v" && event.ctrlKey) {
      navigator.clipboard.readText()
        .then(text => {
          console.log('Pasted content: ', text);
          let charReplacements = {
            "\n": "Enter",
            " ": "Space",
          }
          for (let char of text) {
            if (charReplacements[char] !== undefined) {
              char = charReplacements[char]
            }
            let mockEvent = {
              key: char,
              ctrlKey: false,
              shiftKey: false,
            }
            this.onKeypress(mockEvent)
          }
        })

      return;
    }
    if (this.focusedProcess == undefined) {
      this.prompt.onKeypress(event);
    } else {
      if (event.key == "z" && event.ctrlKey) {
        this.focusedProcess.outputShell = new Shell(() => { });
        this.outputShell.println(
          "dropped focus from PID " + this.focusedProcess.pid
        );
        this.focusedProcess = undefined;
        this.startNewPrompt();
        return;
      } else if (event.key == "c" && event.ctrlKey) {
        this.focusedProcess.quit();
        this.focusedProcess.outputShell = new Shell(() => { });
        this.focusedProcess = undefined;
        this.startNewPrompt();
        return;
      }
      this.focusedProcess.onKeypress(event);
    }
  }
  async handleSubmit(text) {
    let args = parseToParts(text);
    if (args[0] == "exit") {
      this.quit();
      return;
    } else if (args[0] == "jobs") {
      var text = "";
      for (let index = 0; index < this.processes.length; index++) {
        const program = this.processes[index];
        text +=
          "\n" +
          program.pid +
          " - " +
          program.filepath.split("/")[program.filepath.split("/").length - 1];
      }
      this.outputShell.println(text);
      this.startNewPrompt();
      return;
    } else if (args[0] == "cd") {
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
    let newShell = this.outputShell;

    if (text.indexOf(">") != -1) {
      let splitted = splitAtLastOccurrence(text, ">");
      let self = this;
      let outputDestination = splitted[1];
      if (
        outputDestination &&
        this.isValidFilePath(outputDestination) &&
        this.isValidParentDirectory(outputDestination) == true
      ) {
        text = splitted[0];
        newShell = new Shell(function (text) {
          self.writeFile(outputDestination, removeAnsiCodes(text));
        });
      }
    }
    let runInBackground = false;

    if (text[text.length - 1] == "&") {
      text = text.slice(0, -1);
      runInBackground = true;
      newShell = new Shell(() => { });
    }
    let process = executeCommand(text, newShell, this.cwd);
    if (process != undefined) {
      let oldFocus = this.focusedProcess;
      this.processes.push(process["instance"]);
      if (runInBackground == false) {
        this.focusedProcess = process["instance"];
        await process["promise"];
        this.processes = removeItem(this.processes, process["instance"]);

        // only restore focuse IF this command is still the last active program
        if (this.focusedProcess == process["instance"]) {
          this.focusedProcess = oldFocus;
          this.startNewPrompt();
        }
      } else {
        process["promise"].then(
          function () {
            this.processes = removeItem(this.processes, process["instance"]);
          }.bind(this)
        );
        this.startNewPrompt();
      }
    } else {
      this.startNewPrompt();
    }
  }
  async startNewPrompt() {
    if (this.singleCommand === true) {
      this.quit();
      return;
    }
    let result = await this.prompt.prompt(">", true);
    this.handleSubmit(result);
  }
  load(args) {
    this.processes = [];
    this.focusedProcess = undefined;
    this.singleCommand = args != "";
    if (args != "") {
      this.handleSubmit(args);
      return;
    }
    this.prompt = new CommandlineInput(this.outputShell, true);

    this.outputShell.println(
      `soysoupOS v${systemVersion}\ntype 'help' for help`
    );

    this.startNewPrompt();
  }
}
