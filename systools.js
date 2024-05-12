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
  constructor(outputShell) {
    this.outputShell = outputShell;
  }
  async prompt(question = ">", allowMultiline = true) {
    this.allowMultiline = allowMultiline;
    this.question = question;
    this.finished = false;

    this.currentLineInput = "";
    this.selectionIndex = 0;

    this.text = this.outputShell.text;

    this.flush();
    return new Promise((resolve) => {
      this.promiseResolver = resolve;
    });
  }

  // called by event listener
  handleSubmit(text) {
    this.promiseResolver(this.currentLineInput);
  }

  removeCharacter(str, index) {
    index -= 1;
    if (index < 0 || index >= str.length) {
      return str;
    }
    return str.slice(0, index) + str.slice(index + 1);
  }

  onKeypress(event) {
    if (this.finished) {
      return;
    }
    if (event.key.length == 1) {
      this.currentLineInput = insert(
        this.currentLineInput,
        event.key,
        this.selectionIndex
      );
      this.selectionIndex += 1;
    } else if (event.key == "Enter") {
      if (event.shiftKey) {
        if (this.allowMultiline) {
          this.currentLineInput = insert(
            this.currentLineInput,
            "\n",
            this.selectionIndex
          );
          this.selectionIndex += 1;
        }
      } else {
        this.outputShell.text =
          this.text + "\n" + this.question + this.currentLineInput;
        this.handleSubmit(this.currentLineInput);
        this.finished = true;
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
      "\n" +
      this.question +
      insert(this.currentLineInput, "|", this.selectionIndex);

    this.outputShell.flush();
  }
}
