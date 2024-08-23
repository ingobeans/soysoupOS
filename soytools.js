const ansi_up = new AnsiUp();

const RESET_COLOR = "\u001b[0m";
const MUTED_COLOR = "\u001b[38;5;246m";
const GREEN_COLOR = "\u001b[38;5;10m";
const BLUE_COLOR = "\u001b[38;5;27m";
const ERROR_COLOR = "\u001b[38;5;196m";

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};

function updateFont() {
  font = window.getComputedStyle(document.body).font;
  fontSize = parseFloat(window.getComputedStyle(document.body).fontSize);
}
let font = undefined;
let fontSize = undefined;
updateFont();

function removeItem(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
function getTextWidth(ctx, text) {
  ctx.font = font;
  var metrics = ctx.measureText(text);
  return metrics.width;
}
function drawAnsiText(ctx, x, y, text, color) {
  if (text.includes("\n")) {
    var texts = text.split("\n");
    texts.forEach(function (text_piece, index) {
      drawAnsiText(ctx, x, y + index * 18, text_piece, color);
    });
    return;
  }
  if (text.includes("\u001b[")) {
    ansi_up.append_buffer(text);
    let offset = 0;
    while (true) {
      var packet = ansi_up.get_next_packet();
      if (packet.kind == 0) break;
      if (packet.kind == 0) continue;
      if (packet.kind == 1) {
        drawAnsiText(
          ctx,
          x + offset,
          y,
          packet.text,
          ansi_up.fg != null ? rgbToString(ansi_up.fg.rgb) : color
        );
        offset += getTextWidth(ctx, packet.text);
      } else if (packet.kind == 5) {
        ansi_up.process_ansi(packet);
      }
    }
    return;
  }
  screenCtx.font = font;
  screenCtx.fillStyle = color;
  ctx.fillText(text, x, y);
}
function error(text) {
  return ERROR_COLOR + "error: " + text + RESET_COLOR;
}
function removeAnsiCodes(str) {
  const ansiRegex = /\u001b\[.*?m/g;
  return str.replace(ansiRegex, "");
}

function ansiToRgb(str) {
  let text = str;
  if (text.startsWith("\u001b[")) {
    text = text.slice(2);
  }
  ansi_up.process_ansi({ text: text });
  return ansi_up.fg.rgb;
}

function rgbToString(rgb) {
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
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
    this.selectionIndex -= 1;
    return str.slice(0, index) + str.slice(index + 1);
  }
  onSubmit() {
    this.outputShell.setText(
      this.text +
        "\n" +
        MUTED_COLOR +
        this.question +
        this.currentLineInput +
        RESET_COLOR
    );

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
  }
  customKeyEvent(event) {
    // function gets called in onKeypress
    // return true to block default event
    // here custom functionality can be added, such as the enter key submitting the prompt

    if (event.key == "Enter" && !event.shiftKey) {
      this.onSubmit();
      return true;
    }
  }
  writeCharacter(character) {
    this.currentLineInput = insert(
      this.currentLineInput,
      character,
      this.selectionIndex
    );
    this.selectionIndex += character.length;
  }
  onKeypress(event) {
    if (this.finished) {
      return;
    }
    if (this.customKeyEvent(event)) {
      return;
    } else if (event.key.length == 1 && !event.ctrlKey) {
      this.writeCharacter(event.key);
    } else if (event.key == "Enter") {
      if (this.allowMultiline) {
        this.writeCharacter("\n");
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
      }
    }

    this.flush();
  }
  flush() {
    this.outputShell.setText(
      this.text +
        "\n" +
        MUTED_COLOR +
        this.question +
        insert(this.currentLineInput, "|", this.selectionIndex) +
        RESET_COLOR
    );

    this.outputShell.flush();
  }
}
