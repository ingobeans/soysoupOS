const terminalElement = document.getElementById("terminal");
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

let commandHistory = [];
let historyIndex = -1;

document.addEventListener("keydown", function (event) {
  const selection = window.getSelection().toString().trim();
  // check to stop focus being moved while the user is selecting text
  // without this check, the user can't copy paste text, as the focus is moved from the text selection to input box

  if (selection || event.ctrlKey) {
    return;
  } else {
    defaultShell.onKeypress(event);
  }
});

document.addEventListener("paste", (event) => {
  clipboardText = event.clipboardData.getData("text");
  for (let index = 0; index < clipboardText.length; index++) {
    const character = clipboardText[index];
    defaultShell.onKeypress(character);
  }
  // make pasting text act as if each character was individually pressed
});

terminalPath = "soysoup/terminal.soup";
if (fileSystem.isFile(terminalPath) != true) {
  defaultShell.println("error: terminal is missing");
}
executeFile(terminalPath, "", defaultShell);
