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
  if (event.ctrlKey) {
    return;
  } else {
    defaultShell.onKeypress(event);
  }
});

document.addEventListener("paste", (event) => {
  const clipboardText = event.clipboardData.getData("text");
  for (let index = 0; index < clipboardText.length; index++) {
    const character = clipboardText[index];
    const keydownEvent = new KeyboardEvent("keydown", {
      key: character,
      keyCode: character.charCodeAt(0),
      which: character.charCodeAt(0),
    });
    document.dispatchEvent(keydownEvent);
  }
  event.preventDefault();
});
// make pasting text act as if each character was individually pressed

async function createTerminal() {
  terminalPath = "soysoup/terminal.soup";
  if (fileSystem.isFile(terminalPath) != true) {
    defaultShell.println("error: terminal is missing");
  }
  await executeFile(terminalPath, "", defaultShell);

  defaultShell.println("powered off soysoupOS");
}

createTerminal();
