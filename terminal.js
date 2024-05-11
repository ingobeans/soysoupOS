const inputElement = document.getElementById("prompt");
const terminalElement = document.getElementById("terminal");
const promptSpanElement = document.getElementById("prompt-span");
const outputElement = document.getElementById("output");

function printOut(text, color = "inherit") {
  outputElement.innerHTML = "";
  text = text.trim();

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
    color = "#ff7676";
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
    //printOut(">" + value, "#999999");
    defaultShell.println(">" + value);
    if (value) {
      executeCommand(value);
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
    return; // haven't reimplemented tab completion yet.
    event.preventDefault();
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

setPrefix(">");
defaultShell.println(
  "booted soysoupOS v" + systemVersion + "\ntype 'help' for help"
);
