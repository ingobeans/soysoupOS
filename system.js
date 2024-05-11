fileSystem = new SoyFileSystem();

fileSystem.loadFromString(systemFiles);

class Program {
  quit() {
    const index = programs.indexOf(this);
    if (index > -1) {
      programs.splice(index, 1);
    }
    console.log("PID " + index + " quit");
  }
  load(args) {}
  update() {}
}

function printConsole(string) {
  console.log(string);
  document.getElementById("output").innerText = string;
}

var programs = [];

function executeFile(path, argsRaw) {
  eval(fileSystem.readFile(path) + "\nprograms.unshift(new ProgramSource)");
  programs[0].load(argsRaw);
}

function parseToParts(command) {
  let parts = [];
  let regex = /[^\s"]+|"([^"]*)"/gi;
  let match;
  while ((match = regex.exec(command)) !== null) {
    parts.push(match[1] ? match[1] : match[0]);
  }
  return parts;
}

function executeCommand(command) {
  var args = parseToParts(command);
  var keyword = args.shift();

  if (fileSystem.readDirectory("soysoup").includes(keyword + ".soup")) {
    executeFile(
      "soysoup/" + keyword + ".soup",
      command.slice(keyword.length + 1)
    );
    return;
  }
  printConsole("unknown command");
}

const node = document.getElementById("input");
node.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    executeCommand(node.value);
    node.value = "";
  }
});
