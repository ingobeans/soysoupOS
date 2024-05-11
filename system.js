fileSystem = new SoyFileSystem();

systemFiles =
  '{"type":"directory","content":{"soysoup":{"type":"directory","content":{"files.soup":{"type":"file","content":"class Program {\\n  load() {\\n    var g = \\"1\\";\\n    if (fileSystem.pathExists(\\"soysoup/files_counter.txt\\") == false) {\\n      fileSystem.createFile(\\"soysoup/files_counter.txt\\", \\"0\\");\\n    } else {\\n      g = fileSystem.readFile(\\"soysoup/files_counter.txt\\");\\n    }\\n\\n    printConsole(\\n      \\"this is the file browser app. it has been opened \\" + g + \\" times.\\"\\n    );\\n\\n    fileSystem.writeFile(\\"soysoup/files_counter.txt\\", (Number(g) + 1).toString());\\n  }\\n}\\n"},"test app.soup":{"type":"file","content":"class Program {\\n    load(){\\n        printConsole(\\"this is the file browser app\\");\\n    }\\n}"}}},"home":{"type":"directory","content":{"downloads":{"type":"directory","content":{}},"documents":{"type":"directory","content":{}},"programs":{"type":"directory","content":{}}}}}}';

fileSystem.loadFromString(systemFiles);

class Program {
  load() {}
  update() {}
}

function printConsole(string) {
  console.log(string);
  document.getElementById("output").innerText = string;
}

var programs = [];

function executeFile(path) {
  eval(fileSystem.readFile(path) + "\nprograms.unshift(new Program)");
  programs[0].load();
}

function parseCommandToParts(command) {
  let parts = [];
  let regex = /[^\s"]+|"([^"]*)"/gi;
  let match;
  while ((match = regex.exec(command)) !== null) {
    parts.push(match[1] ? match[1] : match[0]);
  }
  return parts;
}

function executeCommand(command) {
  var args = parseCommandToParts(command);
  var keyword = args.shift();

  if (fileSystem.readDirectory("soysoup").includes(keyword + ".soup")) {
    executeFile("soysoup/" + keyword + ".soup");
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
