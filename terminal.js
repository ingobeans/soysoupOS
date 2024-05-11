const inputElement = document.getElementById("prompt");
const terminalElement = document.getElementById("terminal");
const promptSpanElement = document.getElementById("prompt-span");
const outputElement = document.getElementById("output");

function printOut(text, color = "inherit") {
  outputElement.innerHTML = "";

  if (!text) {
    return;
  }

  text = text.split("\n");
  text.forEach((message) => {
    printOutLine(message);
  });
}

function printOutLine(text, color = "inherit") {
  if (text.startsWith("error: ")) {
    color = "rgb(255, 101, 101)";
  }
  if (text.startsWith(">")) {
    color = "#999999";
  }
  var textElement = document.createElement("p");
  textElement.innerText = text;
  textElement.innerHTML = textElement.innerHTML.replace(
    /(https:\/\/\S+)/,
    '<a href="$1" target="_blank">$1</a>'
  );
  // replace URLs with clickable URLs

  textElement.classList.add("text-output");
  textElement.style = "color: " + color;
  //terminalElement.insertBefore(textElement, inputElement.parentElement);
  outputElement.appendChild(textElement);
  window.scrollTo(0, document.body.scrollHeight);
}

function setPrefix(prefix) {
  promptSpanElement.innerText = prefix;
  promptSpanElement.appendChild(inputElement);
}

let commandHistory = [];
let historyIndex = -1;

inputElement.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    let value = inputElement.value;
    console.log('"' + value + '"');
    defaultShell.println(">" + value);
    if (value.endsWith("\\")) {
      currentInput = currentInput + value.substring(0, value.length - 1) + "\n";
    } else if (currentInput + value) {
      executeCommand(currentInput + value);
      currentInput = "";
    }
    inputElement.value = "";

    if (value != "") {
      commandHistory.unshift(value);
      historyIndex = -1;
    }
  }

  // for history navigation:
  else if (event.key === "ArrowUp") {
    event.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      inputElement.value = commandHistory[historyIndex];
      inputElement.setSelectionRange(
        inputElement.value.length,
        inputElement.value.length
      );
    }
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      inputElement.value = commandHistory[historyIndex];
      inputElement.setSelectionRange(
        inputElement.value.length,
        inputElement.value.length
      );
    } else if (historyIndex === 0) {
      historyIndex = -1;
      inputElement.value = "";
      // show empty input at top of history
    }
  }

  // for auto completions
  else if (event.key === "Tab") {
    event.preventDefault();
    var selectionIndex = inputElement.selectionStart;
    inputElement.value =
      inputElement.value.slice(0, selectionIndex) +
      "    " +
      inputElement.value.slice(selectionIndex);

    inputElement.selectionStart = selectionIndex + 4;
    inputElement.selectionEnd = selectionIndex + 4;
    return; // will replace tab indenting with tab completions later on
    let value =
      inputElement.value.split(" ")[inputElement.value.split(" ").length - 1]; // auto complete the last word in input only
    if (value == "") {
      return;
    }

    let directoryContents = fileSystem.readDirectory("");

    for (const content of directoryContents) {
      if (content.startsWith(value)) {
        inputElement.value =
          inputElement.value.substring(
            0,
            inputElement.value.length - value.length
          ) + content;
        break;
      }
    }
  }
});

function setFocusToPrompt() {
  inputElement.focus();
}
function keyPressed(event) {
  const selection = window.getSelection().toString().trim();
  // check to stop focus being moved while the user is selecting text
  // without this check, the user can't copy paste text, as the focus is moved from the text selection to input box

  if (!selection && document.activeElement !== inputElement) {
    setFocusToPrompt();
  }
}

document.addEventListener("keydown", keyPressed);

var currentInput = "";

setPrefix(">");
defaultShell.println(
  "booted soysoupOS v" + systemVersion + "\ntype 'help' for help"
);
