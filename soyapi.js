systemVersion = "0.6.0";

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
  onKeypress(key) { }
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
  renameFile(source, dest) {
    var actualSource = getActualPath(source, this.cwd);
    var actualDest = getActualPath(dest, this.cwd);
    fileSystem.moveFile(actualSource, actualDest);
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

  load(args) { }
  update() { }
  onKeypress(key) { }
  onMousedown(event) { }
}

function ImportSLL(filename) {
  let path = fileSystem.normalizePath(filename);
  let global_lib_path = fileSystem.normalizePath("soysoup/lib/" + filename);
  if (fileSystem.isFile(global_lib_path)) {
    path = global_lib_path;
  }
  return eval(fileSystem.readFile(path) + ";SLLSource");
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

var newProgramInstance = null;

function getProgram(pid) {
  for (let program of programs) {
    if (program.pid == pid) {
      return program;
    }
  }
}

function generateNewProcessId(requestedPID) {
  if (requestedPID !== undefined) {
    if (getProgram(requestedPID) === undefined) {
      return requestedPID;
    }
    console.error("PID " + requestedPID + " already in use");
    return undefined;
  }
  while (true) {
    let p = Math.floor(Math.random() * 9999);
    if (getProgram(p) === undefined) {
      return p;
    }
  }
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

function replacePlaceholders(text, argsRaw) {
  let args = argsRaw.split(" ");

  return text
    .replace(/\$(\d+)/g, (match, number) => {
      let index = parseInt(number, 10) - 1;
      return index < args.length ? args[index] : "";
    })
    .replace(/\$@/g, argsRaw);
}

function executeFile(path, argsRaw, outputShell, cwd) {
  let segments = fileSystem.getPathSegments(path);
  let filetype = segments[segments.length - 1].split(".")[1];

  if (filetype == "soy") {
    let contents = fileSystem.readFile(path);
    contents = replacePlaceholders(contents, argsRaw);
    for (let line of contents.split("\n")) {
      if (line.includes("#")) {
        line = line.split("#")[0];
      }
      line = line.trim();
      if (line == "") {
        continue;
      }
      executeFile("soysoup/bin/terminal.soup", line, outputShell, "");
    }
    return;
  }
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
  if (instance !== undefined) {
    programs.unshift(instance);
    instance.load(argsRaw, outputShell);

    return { promise: promise, pid: instance.pid, instance: instance };
  }
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
  if (text.startsWith("/")) {
    text = fileSystem.normalizePath(text);
    path = text;
  } else {
    text = fileSystem.normalizePath(text);
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

  if (fileSystem.isFile("soysoup/bin/" + keyword + ".soup")) {
    path = "soysoup/bin/" + keyword + ".soup";
  } else if (fileSystem.isFile("soysoup/bin/" + keyword + ".soy")) {
    path = "soysoup/bin/" + keyword + ".soy";
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
