const terminalElement = document.getElementById("terminal");
const outputElement = document.getElementById("output");

function printOut(text, color = "inherit") {
  outputElement.innerHTML = "";

  if (!text) {
    return;
  }

  if (text.startsWith("\n")) {
    text = text.slice(1);
  }

  text = text.split("\n");
  text.forEach((message) => {
    printOutLine(message);
  });
}

function printOutLine(text) {
  var textElement = document.createElement("p");
  textElement.innerHTML = ansi_up.ansi_to_html(text);

  textElement.innerHTML = textElement.innerHTML.replace(
    /(https:\/\/\S+)/,
    '<a href="$1" target="_blank">$1</a>'
  );
  // replace URLs with clickable URLs

  textElement.classList.add("text-output");
  outputElement.appendChild(textElement);
  window.scrollTo(0, document.body.scrollHeight);
}

let commandHistory = [];
let historyIndex = -1;

document.addEventListener("keydown", function (event) {
  if (
    (event.key.length == 2 || event.key.length == 3) &&
    event.key.startsWith("F")
  ) {
    return;
  }
  defaultShell.onKeypress(event);

  if (event.ctrlKey && (event.key == "c" || event.key == "v")) {
    return;
  }
  event.preventDefault();
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
    defaultShell.println(error("terminal is missing"));
  }
  await executeFile(terminalPath, "", defaultShell);

  defaultShell.println("powered off soysoupOS");
}

createTerminal();
