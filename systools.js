const RESET_COLOR = "\u001b[0m";
const MUTED_COLOR = "\u001b[38;5;246m";
const GREEN_COLOR = "\u001b[38;5;10m";
const BLUE_COLOR = "\u001b[38;5;27m";
const ERROR_COLOR = "\u001b[38;5;196m";

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};

function error(text) {
  return ERROR_COLOR + "error: " + text + RESET_COLOR;
}

function insert(origString, stringToAdd, indexPosition) {
  return (
    origString.slice(0, indexPosition) +
    stringToAdd +
    origString.slice(indexPosition)
  );
}

class CommandlineInput {
  constructor(outputShell, useHistory = false) {
    this.outputShell = outputShell;
    this.useHistory = useHistory;

    this.messageHistory = [];
    this.historyIndex = -1;
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

  handleSubmit(text) {}

  removeCharacter(str, index) {
    index -= 1;
    if (index < 0 || index >= str.length) {
      return str;
    }
    return str.slice(0, index) + str.slice(index + 1);
  }
  completeCheck(event) {
    return event.key == "Enter" && !event.shiftKey;
  }

  onKeypress(event) {
    if (this.finished) {
      return;
    }
    if (this.completeCheck(event)) {
      this.outputShell.text =
        this.text +
        "\n" +
        MUTED_COLOR +
        this.question +
        this.currentLineInput +
        RESET_COLOR;
      this.promiseResolver(this.currentLineInput);
      this.finished = true;
      this.outputShell.flush();
      if (
        this.currentLineInput != "" &&
        this.messageHistory[0] != this.currentLineInput &&
        this.useHistory
      ) {
        this.messageHistory.unshift(this.currentLineInput);
      }
      this.historyIndex = -1;
      return;
    } else if (event.key.length == 1 && !event.ctrlKey) {
      this.currentLineInput = insert(
        this.currentLineInput,
        event.key,
        this.selectionIndex
      );
      this.selectionIndex += 1;
    } else if (event.key == "Enter") {
      if (this.allowMultiline) {
        this.currentLineInput = insert(
          this.currentLineInput,
          "\n",
          this.selectionIndex
        );
        this.selectionIndex += 1;
      }
    }

    // for history navigation:
    else if (event.key === "ArrowUp" && this.useHistory) {
      event.preventDefault();
      if (this.historyIndex < this.messageHistory.length - 1) {
        this.historyIndex++;
        this.currentLineInput = this.messageHistory[this.historyIndex];
        this.selectionIndex = this.currentLineInput.length;
      }
    } else if (event.key === "ArrowDown" && this.useHistory) {
      event.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.currentLineInput = this.messageHistory[this.historyIndex];
        this.selectionIndex = this.currentLineInput.length;
      } else if (this.historyIndex === 0) {
        this.historyIndex = -1;
        this.currentLineInput = "";
        // show empty input at top of history
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
      MUTED_COLOR +
      this.question +
      insert(this.currentLineInput, "|", this.selectionIndex) +
      RESET_COLOR;

    this.outputShell.flush();
  }
}
