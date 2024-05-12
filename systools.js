Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};

function insert(origString, stringToAdd, indexPosition) {
  return (
    origString.slice(0, indexPosition) +
    stringToAdd +
    origString.slice(indexPosition)
  );
}

class CommandlineInput {
  constructor(onAnswer, outputShell, allowMultiline = true) {
    this.onAnswer = onAnswer;
    this.allowMultiline = allowMultiline;
    this.outputShell = outputShell;

    this.currentLineInput = "";
    this.selectionIndex = 0;

    this.text = this.outputShell.text;
    this.commandHistory = [];
    this.historyIndex = -1;

    this.flush();
  }

  removeCharacter(str, index) {
    index -= 1;
    if (index < 0 || index >= str.length) {
      return str;
    }
    return str.slice(0, index) + str.slice(index + 1);
  }

  handleSubmit(text) {
    this.onAnswer(text);
  }

  onKeypress(event) {
    if (event.key.length == 1) {
      this.currentLineInput = insert(
        this.currentLineInput,
        event.key,
        this.selectionIndex
      );
      this.selectionIndex += 1;
    } else if (event.key == "Enter") {
      if (event.shiftKey && this.allowMultiline) {
        this.currentLineInput = insert(
          this.currentLineInput,
          "\n",
          this.selectionIndex
        );
        this.selectionIndex += 1;
      } else {
        this.outputShell.text = this.text + "\n>" + this.currentLineInput;
        this.handleSubmit(this.currentLineInput);
        this.outputShell.flush();
        return;
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

    this.flush();
  }
  flush() {
    this.outputShell.text =
      this.text +
      "\n>" +
      insert(this.currentLineInput, "|", this.selectionIndex);

    this.outputShell.flush();
  }
}
