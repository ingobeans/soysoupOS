systemVersion = "0.4.0";

fileSystem = new SoyFileSystem();

fileSystem.loadFromString(systemFiles);

function handleProgramError(e) {
  var msg = e.toString();
  switch (msg) {
    case "ReferenceError: WindowComponent is not defined":
      return "program was designed to run in a desktop environment";
    case "ReferenceError: ProgramSource is not defined":
      return "program has no entry point";
    default:
      return msg;
  }
}

class Shell {
  constructor(outputFunction) {
    this.outputFunction = outputFunction;
    this.text = "";
  }
  onKeypress(key) {}
  print(text, flush = true) {
    this.setText(this.text + text);

    if (flush) {
      this.flush();
    }
  }
  setText(text) {
    this.text = text;
  }
  println(text, flush = true) {
    if (this.text == "") {
      this.setText(this.text + text);
    } else {
      this.setText(this.text + "\n" + text);
    }

    if (flush) {
      this.flush();
    }
  }
  flush() {
    this.outputFunction(this.text);
  }
}

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
    console.log("PID " + this.pid + " quit");
  }
  dirExists(path) {
    var actualPath = getActualPath(path, this.cwd);
    return (
      fileSystem.pathExists(actualPath) && fileSystem.isFile(actualPath) != true
    );
  }
  pathExists(path) {
    var actualPath = getActualPath(path, this.cwd);

    return fileSystem.pathExists(actualPath);
  }
  fileExists(path) {
    var actualPath = getActualPath(path, this.cwd);

    return (
      fileSystem.pathExists(actualPath) && fileSystem.isFile(actualPath) == true
    );
  }
  isValidParentDirectory(path) {
    var actualPath = getActualPath(path, this.cwd);

    return fileSystem.isValidParentDirectory(actualPath);
  }
  isValidFilePath(path) {
    var actualPath = getActualPath(path, this.cwd);
    return fileSystem.isValidFilePath(actualPath);
  }
  readFile(path) {
    var actualPath = getActualPath(path, this.cwd);

    if (
      !fileSystem.isValidParentDirectory(actualPath) ||
      fileSystem.isFile(actualPath) != true
    ) {
      console.error("Invalid path.");
      return;
    }
    return fileSystem.readFile(actualPath);
  }

  writeFile(path, content) {
    var actualPath = getActualPath(path, this.cwd);

    if (!fileSystem.isValidParentDirectory(actualPath)) {
      console.error("Invalid path.");
      return;
    }
    if (fileSystem.isFile(actualPath) != true) {
      fileSystem.createFile(actualPath, content);
      return;
    }
    fileSystem.writeFile(actualPath, content);
  }

  deleteItem(path) {
    var actualPath = getActualPath(path, this.cwd);
    if (
      !fileSystem.isValidParentDirectory(actualPath) ||
      !fileSystem.pathExists(actualPath)
    ) {
      console.error("Invalid path.");
      return;
    }
    fileSystem.deletePath(actualPath);
  }

  readDirectory(path) {
    var actualPath = getActualPath(path, this.cwd);

    if (
      !fileSystem.pathExists(actualPath) ||
      fileSystem.isFile(actualPath) == true
    ) {
      console.error("Invalid path.");
      return;
    }
    return fileSystem.readDirectory(actualPath);
  }

  createDirectory(path) {
    var actualPath = getActualPath(path, this.cwd);

    if (!fileSystem.isValidParentDirectory(actualPath)) {
      console.error("Invalid path.");
      return;
    }
    return fileSystem.createDirectory(actualPath);
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

function getDrawnPrograms() {
  var p = [];
  programs.forEach(function (program) {
    if (typeof program.window === "object") {
      p.push(program);
    }
  });
  return p;
}

var newProgramInstance = null;

function getProgram(pid) {
  for (program in programs) {
    if (program.pid == pid) {
      return program;
    }
  }
}

function generateNewProcessId() {
  return Math.floor(Math.random() * 9999);
}

function createProgramInstance(path, argsRaw, outputShell, cwd, exitResolve) {
  var data = fileSystem.readFile(path);
  try {
    eval(data + "\nnewProgramInstance = new ProgramSource()");
  } catch (e) {
    if (e) {
      let msg =
        "the program " + path + " couldn't run.\n" + handleProgramError(e);
      console.error(msg);
      outputShell.println(error(msg));
      return;
    }
  }
  newProgramInstance.outputShell = outputShell;
  newProgramInstance.cwd = cwd;
  newProgramInstance.filepath = path;
  newProgramInstance.exitResolve = exitResolve;
  newProgramInstance.pid = generateNewProcessId();
  return newProgramInstance;
}

function executeFile(path, argsRaw, outputShell, cwd) {
  var exitResolve = undefined;
  var promise = new Promise((resolve) => {
    exitResolve = resolve;
  });
  let instance = createProgramInstance(
    path,
    argsRaw,
    outputShell,
    cwd,
    exitResolve
  );
  programs.unshift(instance);
  instance.load(argsRaw, outputShell);

  return { promise: promise, pid: instance.pid, instance: instance };
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

function getActualPath(text, cwd) {
  // function to get an absolute path to a path that could either be local or absolute
  let path = "";
  if (!text) {
    return fileSystem.normalizePath(cwd);
  }
  text = fileSystem.normalizePath(text);
  if (text.startsWith("/")) {
    path = text;
  } else {
    path = fileSystem.normalizePath(cwd + text);
  }
  path = fileSystem.resolveBackSteps(path);
  return path;
}

function executeCommand(command, outputShell, cwd) {
  if (!command) {
    return;
  }
  var args = parseToParts(command);
  var keyword = args.shift();

  if (!keyword) {
    return;
  }

  var path = getActualPath(fileSystem.normalizePath(keyword), cwd);

  if (fileSystem.isFile("soysoup/" + keyword + ".soup")) {
    path = "soysoup/" + keyword + ".soup";
  }
  if (fileSystem.isFile(path)) {
    return executeFile(
      path,
      command.slice(keyword.length + 1),
      outputShell,
      cwd
    );
  }

  outputShell.println(error("unknown command '" + keyword + "'"));
}
