systemFiles = '{"type": "directory", "content": {"home": {"type": "directory", "content": {"documents": {"type": "directory", "content": {}}, "downloads": {"type": "directory", "content": {}}, "programdata": {"type": "directory", "content": {}}}}, "soysoup": {"type": "directory", "content": {"bar.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  showProgressBar(percent) {\\n    this.outputShell.text =\\n      \\"[\\" + \\"#\\".repeat(percent) + \\"-\\".repeat(100 - percent) + \\"]\\";\\n    this.outputShell.flush();\\n  }\\n  load(args) {\\n    var self = this;\\n    for (let percent = 0; percent <= 101; percent++) {\\n      setTimeout(function () {\\n        if (percent == 101) {\\n          self.outputShell.println(\\"finished the important task!\\");\\n          self.quit();\\n          return;\\n        }\\n        self.showProgressBar(percent, self.outputShell);\\n      }, 40 * percent);\\n    }\\n  }\\n}\\n"}, "cat.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    if (fileSystem.pathExists(args) == false || !fileSystem.isFile(args)) {\\n      this.outputShell.println(\\"error: path doesn\'t exist or is not a file\\");\\n      this.quit();\\n      return;\\n    }\\n    this.outputShell.println(fileSystem.readFile(args));\\n    this.quit();\\n  }\\n}\\n"}, "cls.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    this.outputShell.text = \\"\\";\\n    this.outputShell.flush();\\n    this.quit();\\n  }\\n}\\n"}, "echo.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    this.outputShell.println(args);\\n    this.quit();\\n  }\\n}\\n"}, "edit.soup": {"type": "file", "content": "class MultitextInput extends CommandlineInput {\\n  completeCheck(event) {\\n    return event.key == \\"x\\" && event.ctrlKey;\\n  }\\n}\\n\\nclass ProgramSource extends Program {\\n  onKeypress(event) {\\n    this.prompt.onKeypress(event);\\n  }\\n  async load(args) {\\n    if (!args || fileSystem.isValidParentDirectory(args) != true) {\\n      this.outputShell.println(\\"error: path doesn\'t exist\\");\\n      this.quit();\\n      return;\\n    }\\n\\n    if (fileSystem.isFile(args) != true) {\\n      fileSystem.createFile(args, \\"\\");\\n    }\\n\\n    this.prompt = new MultitextInput(this.outputShell);\\n    this.outputShell.text = \\"\\";\\n    var contents = fileSystem.readFile(args);\\n\\n    this.prompt.prompt(\\"\\", true).then((newContents) => {\\n      fileSystem.writeFile(args, newContents);\\n      this.outputShell.println(\\"saved modified file to \\" + args);\\n      this.quit();\\n    });\\n    this.prompt.currentLineInput = contents;\\n    this.prompt.selectionIndex = contents.length;\\n    this.prompt.flush();\\n  }\\n}\\n"}, "grid.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  onKeypress(event) {\\n    if (event.key == \\"a\\") {\\n      this.x -= 1;\\n    }\\n    if (event.key == \\"d\\") {\\n      this.x += 1;\\n    }\\n    if (event.key == \\"w\\") {\\n      this.y -= 1;\\n    }\\n    if (event.key == \\"s\\") {\\n      this.y += 1;\\n    }\\n    this.x = this.x.clamp(0, 49);\\n    this.y = this.y.clamp(0, 6);\\n    this.draw();\\n  }\\n  load(args) {\\n    this.x = 25;\\n    this.y = 3;\\n    this.draw();\\n  }\\n  draw() {\\n    var grid = (\\"-\\".repeat(50) + \\"\\\\n\\").repeat(7);\\n    var indexPosition = this.y * 51 + this.x;\\n    grid = grid.slice(0, indexPosition) + \\"#\\" + grid.slice(indexPosition + 1);\\n    this.outputShell.text = grid + \\"\\\\n\\\\n[use WASD to move]\\";\\n    this.outputShell.flush();\\n  }\\n}\\n"}, "help.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    var helpMessage = `cat - read contents of file\\necho - print a string to shell\\nedit - edit file by path\\nexit - close terminal instance\\nhelp - prints this\\nls - list contents of directory\\nproc - list or terminate processes\\nreload - reset file system\\ncls - clears the terminal\\nterminal - open new instance of terminal`;\\n    this.outputShell.println(helpMessage);\\n    this.quit();\\n  }\\n}\\n"}, "ls.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    if (\\n      fileSystem.pathExists(args) == false ||\\n      fileSystem.isFile(args) == true\\n    ) {\\n      this.outputShell.println(\\n        \\"error: path doesn\'t exist or is not a directory\\"\\n      );\\n      this.quit();\\n      return;\\n    }\\n    this.outputShell.println(fileSystem.readDirectory(args).join(\\"\\\\n\\"));\\n    this.quit();\\n  }\\n}\\n"}, "proc.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    var parts = parseToParts(args);\\n    if (\\n      !args ||\\n      (parts[0] != \\"list\\" && parts[0] != \\"kill\\") ||\\n      (parts[0] == \\"kill\\" && parts.length == 1)\\n    ) {\\n      this.outputShell.println(\\n        `error: missing or incorrect args. use \'proc list\' to list processes or \'proc kill <process ID>\' to terminate a process.`\\n      );\\n      // invalid args if args is empty, if the first argument is not list or kill, or if the first argument is kill but there is no argument for process ID\\n      this.quit();\\n      return;\\n    }\\n    if (parts[0] == \\"list\\") {\\n      var text = \\"running processes:\\";\\n      for (let index = 0; index < programs.length; index++) {\\n        const program = programs[index];\\n        text +=\\n          \\"\\\\n\\\\t\\" +\\n          index +\\n          \\" - \\" +\\n          program.filepath.split(\\"/\\")[program.filepath.split(\\"/\\").length - 1];\\n      }\\n      this.outputShell.println(text);\\n    } else if (parts[0] == \\"kill\\") {\\n      programs.splice(Number(parts[1]), 1);\\n      this.outputShell.println(\\"killed process with ID \\" + parts[1]);\\n    }\\n    this.quit();\\n  }\\n}\\n"}, "reload.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    fileSystem.loadFromString(systemFiles);\\n    this.quit();\\n  }\\n}\\n"}, "terminal.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  onKeypress(event) {\\n    this.prompt.onKeypress(event);\\n  }\\n  async handleSubmit(text) {\\n    if (text == \\"exit\\") {\\n      this.quit();\\n      return;\\n    }\\n    await executeCommand(text, this.outputShell);\\n    this.startNewPrompt();\\n  }\\n  async startNewPrompt() {\\n    var result = await this.prompt.prompt(\\">\\", true);\\n    this.handleSubmit(result);\\n  }\\n  load(args) {\\n    this.prompt = new CommandlineInput(this.outputShell, true);\\n    this.outputShell.text =\\n      \\"booted soysoupOS v\\" + systemVersion + \\"\\\\ntype \'help\' for help\\";\\n\\n    this.startNewPrompt();\\n  }\\n}\\n"}, "test.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  onKeypress(event) {\\n    this.prompt.onKeypress(event);\\n  }\\n  async load(args) {\\n    this.prompt = new CommandlineInput(this.outputShell);\\n\\n    var name = await this.prompt.prompt(\\"What is your name?: \\", false);\\n\\n    var age = await this.prompt.prompt(\\"How old are you: \\", false);\\n    this.outputShell.println(\\"Howdy, \\" + name + \\", aged \\" + age);\\n\\n    this.quit();\\n  }\\n}\\n"}}}}}'