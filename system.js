fileSystem = new SoyFileSystem();

fileSystem.loadFromString(systemFiles);

function printConsole(string) {
  console.log(string);
  document.getElementById("output").innerText = string;
}

class Shell {
  constructor(outputFunction) {
    this.outputFunction = outputFunction;
    this.text = "";
  }
  print(text) {
    this.text = text;
  }
  flush() {
    console.log("flushing");
    this.outputFunction(this.text);
  }
}

var defaultShell = new Shell(printConsole);

class Program {
  quit() {
    const index = programs.indexOf(this);
    if (index > -1) {
      programs.splice(index, 1);
    }
    console.log("PID " + index + " quit");
  }
  load(args, outputShell) {}
  update() {}
}

function splitAtLastOccurrence(str, delimiter) {
  let lastIndex = str.lastIndexOf(delimiter);
  if (lastIndex === -1) {
    return [str];
  }
  let firstPart = str.substring(0, lastIndex);
  let secondPart = str.substring(lastIndex + delimiter.length);
  return [firstPart, secondPart];
}

var programs = [];

function executeFile(path, argsRaw, outputShell) {
  var data = fileSystem.readFile(path);
  if (data.includes("ProgramSource") == false) {
    outputShell.print("the program " + path + " is invalid.");
    return;
  }
  eval(data + "\nprograms.unshift(new ProgramSource)");
  programs[0].load(argsRaw, outputShell);
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
  var outputShell = defaultShell;

  if (command.indexOf(">") != -1) {
    var splitted = splitAtLastOccurrence(command, ">");
    var outputDestination = splitted[1];
    command = splitted[0];
    outputShell = new Shell(function (text) {
      if (fileSystem.isFile(outputDestination) != true) {
        fileSystem.createFile(outputDestination, text);
      } else {
        fileSystem.writeFile(outputDestination, text);
      }
    });
  }

  var args = parseToParts(command);
  var keyword = args.shift();

  if (fileSystem.readDirectory("soysoup").includes(keyword + ".soup")) {
    executeFile(
      "soysoup/" + keyword + ".soup",
      command.slice(keyword.length + 1),
      outputShell
    );
    outputShell.flush();
    return;
  }
  outputShell.print("unknown command");
  outputShell.flush();
}

const node = document.getElementById("input");
node.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    executeCommand(node.value);
    node.value = "";
  }
});
