systemVersion = "0.2.6";

fileSystem = new SoyFileSystem();

fileSystem.loadFromString(systemFiles);

function printConsole(string) {
  //console.log(string);
  printOut(string);
}

class Shell {
  constructor(outputFunction) {
    this.outputFunction = outputFunction;
    this.text = "";
  }
  onKeypress(key) {}
  print(text, flush = true) {
    this.text += text;

    if (flush) {
      this.flush();
    }
  }
  println(text, flush = true) {
    if (this.text == "") {
      this.text += text;
    } else {
      this.text += "\n" + text;
    }

    if (flush) {
      this.flush();
    }
  }
  flush() {
    this.outputFunction(this.text);
  }
}

var defaultShell = new Shell(printConsole);
defaultShell.onKeypress = function (key) {
  if (programs.length > 0) {
    programs[0].onKeypress(key);
  }
};

class Program {
  quit() {
    const index = programs.indexOf(this);
    if (index > -1) {
      programs.splice(index, 1);
    }
    if (this.exitResolve != undefined) {
      this.exitResolve();
    }
    this.outputShell.flush();
    console.log("PID " + index + " quit");
  }
  load(args) {}
  update() {}
  onKeypress(key) {}
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

function executeFile(path, argsRaw, outputShell, exitResolve) {
  var data = fileSystem.readFile(path);
  if (data.includes("ProgramSource") == false) {
    outputShell.println("error: the program " + path + " is invalid.");
    return;
  }
  eval(data + "\nprograms.unshift(new ProgramSource)");
  programs[0].outputShell = outputShell;
  programs[0].filepath = path;
  programs[0].exitResolve = exitResolve;
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

function executeCommand(command, shell = defaultShell) {
  if (!command) {
    return;
  }
  var outputShell = shell;

  if (command.indexOf(">") != -1) {
    var splitted = splitAtLastOccurrence(command, ">");
    var outputDestination = splitted[1];
    if (outputDestination) {
      command = splitted[0];
      outputShell = new Shell(function (text) {
        if (fileSystem.isFile(outputDestination) != true) {
          fileSystem.createFile(outputDestination, text);
        } else {
          fileSystem.writeFile(outputDestination, text);
        }
      });
    }
  }

  var args = parseToParts(command);
  var keyword = args.shift();

  var path = keyword;

  if (fileSystem.readDirectory("soysoup").includes(keyword + ".soup")) {
    path = "soysoup/" + keyword + ".soup";
  }
  if (fileSystem.isFile(path)) {
    var exitResolve = undefined;
    var promise = new Promise((resolve) => {
      exitResolve = resolve;
    });
    executeFile(
      path,
      command.slice(keyword.length + 1),
      outputShell,
      exitResolve
    );
    return promise;
  }

  outputShell.println("error: unknown command '" + keyword + "'");
  return;
}
