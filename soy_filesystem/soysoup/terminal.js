class ProgramSource extends Program {
  removeCharacter(str, index) {
    index -= 1;
    if (index < 0 || index >= str.length) {
      return str;
    }
    return str.slice(0, index) + str.slice(index + 1);
  }

  handleSubmit(text) {
    if (this.currentLineInput == "exit") {
      this.quit();
      this.currentLineInput = "";
      this.selectionIndex = 0;
      this.flush();
      return;
    }
    executeCommand(this.currentLineInput, this.shell);
  }

  onKeypress(event) {
    console.log(event.key.length);
    if (event.key.length == 1) {
      this.currentLineInput = insert(
        this.currentLineInput,
        event.key,
        this.selectionIndex
      );
      this.selectionIndex += 1;
    } else if (event.key == "Enter") {
      if (event.shiftKey) {
        this.currentLineInput = insert(
          this.currentLineInput,
          "\n",
          this.selectionIndex
        );
        this.selectionIndex += 1;
      } else {
        this.shell.println(">" + this.currentLineInput);
        this.handleSubmit(this.currentLineInput);

        this.currentLineInput = "";
        this.selectionIndex = 0;
      }
    } else if (event.key == "ArrowLeft") {
      this.selectionIndex = Math.max(0, this.selectionIndex - 1);
    } else if (event.key == "ArrowRight") {
      this.selectionIndex = Math.min(
        this.currentLineInput.length,
        this.selectionIndex + 1
      );
    } else if (event.key == "Backspace") {
      if (this.currentLineInput) {
        this.currentLineInput = this.removeCharacter(
          this.currentLineInput,
          this.selectionIndex
        );
        this.selectionIndex -= 1;
      }
    }
    console.log(event.key);
    console.log(this.selectionIndex);

    this.flush();
  }
  load(args) {
    var self = this;
    this.shell = new Shell(function (text) {
      self.flush();
    });

    this.currentLineInput = "";
    this.selectionIndex = 0;

    this.shell.text =
      "booted soysoupOS v" + systemVersion + "\ntype 'help' for help";
    this.commandHistory = [];
    this.historyIndex = -1;

    this.flush();
  }
  flush() {
    if (programs[0] == this) {
      this.outputShell.text =
        this.shell.text +
        "\n>" +
        insert(this.currentLineInput, "|", this.selectionIndex);
    } else {
      this.outputShell.text = this.shell.text;
    }
    this.outputShell.flush();
  }
}
