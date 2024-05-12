class ProgramSource extends Program {
  insert(origString, stringToAdd, indexPosition) {
    return (
      origString.slice(0, indexPosition) +
      stringToAdd +
      origString.slice(indexPosition)
    );
  }
  removeCharacter(str, index) {
    index -= 1;
    if (index < 0 || index >= str.length) {
      return str;
    }
    return str.slice(0, index) + str.slice(index + 1);
  }

  onKeypress(event) {
    console.log(event.key.length);
    if (event.key.length == 1) {
      this.currentLineInput = this.insert(
        this.currentLineInput,
        event.key,
        this.selectionIndex
      );
      this.selectionIndex += 1;
    } else if (event.key == "Enter") {
      if (event.shiftKey) {
        this.currentLineInput = this.insert(
          this.currentLineInput,
          "\n",
          this.selectionIndex
        );
        this.selectionIndex += 1;
      } else {
        this.shell.println(">" + this.currentLineInput);
        executeCommand(this.currentLineInput, this.shell);

        this.currentLineInput = "";
        this.currentInputTotal = "";
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
  load(args, outputShell) {
    var self = this;
    this.outputShell = outputShell;
    this.shell = new Shell(function (text) {
      console.log(text);
      //self.text = text;
      self.flush();
    });

    this.currentLineInput = "";
    this.currentInputTotal = "";
    this.selectionIndex = 0;

    this.shell.text =
      "booted soysoupOS v" + systemVersion + "\ntype 'help' for help";
    this.commandHistory = [];
    this.historyIndex = -1;

    this.flush();
  }
  flush() {
    this.outputShell.text =
      this.shell.text +
      "\n>" +
      this.insert(this.currentLineInput, "|", this.selectionIndex);
    this.outputShell.flush();
  }
}
