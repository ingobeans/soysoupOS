systemFiles = '{"type": "directory", "content": {"home": {"type": "directory", "content": {"documents": {"type": "directory", "content": {}}, "downloads": {"type": "directory", "content": {}}, "programdata": {"type": "directory", "content": {}}}}, "soysoup": {"type": "directory", "content": {"bar.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  showProgressBar(percent, outputShell) {\\n    outputShell.text =\\n      \\"[\\" + \\"#\\".repeat(percent) + \\"-\\".repeat(100 - percent) + \\"]\\";\\n    outputShell.flush();\\n  }\\n  load(args, outputShell) {\\n    var self = this;\\n    for (let percent = 0; percent <= 101; percent++) {\\n      setTimeout(function () {\\n        if (percent == 101) {\\n          outputShell.println(\\"finished the important task!\\");\\n          return;\\n        }\\n        self.showProgressBar(percent, outputShell);\\n      }, 40 * percent);\\n    }\\n    this.quit();\\n  }\\n}\\n"}, "cat.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args, outputShell) {\\n    if (fileSystem.pathExists(args) == false || !fileSystem.isFile(args)) {\\n      outputShell.println(\\"error: path doesn\'t exist or is not a file\\");\\n      return;\\n    }\\n    outputShell.println(fileSystem.readFile(args));\\n    this.quit();\\n  }\\n}\\n"}, "cls.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args, outputShell) {\\n    outputShell.text = \\"\\";\\n    outputShell.flush();\\n    this.quit();\\n  }\\n}\\n"}, "echo.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args, outputShell) {\\n    outputShell.println(args);\\n    this.quit();\\n  }\\n}\\n"}, "help.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args, outputShell) {\\n    var helpMessage = `cat - read contents of file\\necho - print a string to shell\\nls - list contents of directory\\nreload - reset file system\\ncls - clears the terminal`;\\n    outputShell.println(helpMessage);\\n    this.quit();\\n  }\\n}\\n"}, "ls.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args, outputShell) {\\n    if (\\n      fileSystem.pathExists(args) == false ||\\n      fileSystem.isFile(args) == true\\n    ) {\\n      outputShell.println(\\"error: path doesn\'t exist or is not a directory\\");\\n      return;\\n    }\\n    outputShell.println(fileSystem.readDirectory(args).join(\\"\\\\n\\"));\\n    this.quit();\\n  }\\n}\\n"}, "reload.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args, outputShell) {\\n    fileSystem.loadFromString(systemFiles);\\n    this.quit();\\n  }\\n}\\n"}, "terminal.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  insert(origString, stringToAdd, indexPosition) {\\n    return (\\n      origString.slice(0, indexPosition) +\\n      stringToAdd +\\n      origString.slice(indexPosition)\\n    );\\n  }\\n  removeCharacter(str, index) {\\n    index -= 1;\\n    if (index < 0 || index >= str.length) {\\n      return str;\\n    }\\n    return str.slice(0, index) + str.slice(index + 1);\\n  }\\n\\n  onKeypress(event) {\\n    console.log(event.key.length);\\n    if (event.key.length == 1) {\\n      this.currentLineInput = this.insert(\\n        this.currentLineInput,\\n        event.key,\\n        this.selectionIndex\\n      );\\n      this.selectionIndex += 1;\\n    } else if (event.key == \\"Enter\\") {\\n      if (event.shiftKey) {\\n        this.currentLineInput = this.insert(\\n          this.currentLineInput,\\n          \\"\\\\n\\",\\n          this.selectionIndex\\n        );\\n        this.selectionIndex += 1;\\n      } else {\\n        this.shell.println(\\">\\" + this.currentLineInput);\\n        executeCommand(this.currentLineInput, this.shell);\\n\\n        this.currentLineInput = \\"\\";\\n        this.currentInputTotal = \\"\\";\\n        this.selectionIndex = 0;\\n      }\\n    } else if (event.key == \\"ArrowLeft\\") {\\n      this.selectionIndex = Math.max(0, this.selectionIndex - 1);\\n    } else if (event.key == \\"ArrowRight\\") {\\n      this.selectionIndex = Math.min(\\n        this.currentLineInput.length,\\n        this.selectionIndex + 1\\n      );\\n    } else if (event.key == \\"Backspace\\") {\\n      if (this.currentLineInput) {\\n        this.currentLineInput = this.removeCharacter(\\n          this.currentLineInput,\\n          this.selectionIndex\\n        );\\n        this.selectionIndex -= 1;\\n      }\\n    }\\n    console.log(event.key);\\n    console.log(this.selectionIndex);\\n\\n    this.flush();\\n  }\\n  load(args, outputShell) {\\n    var self = this;\\n    this.outputShell = outputShell;\\n    this.shell = new Shell(function (text) {\\n      console.log(text);\\n      //self.text = text;\\n      self.flush();\\n    });\\n\\n    this.currentLineInput = \\"\\";\\n    this.currentInputTotal = \\"\\";\\n    this.selectionIndex = 0;\\n\\n    this.shell.text =\\n      \\"booted soysoupOS v\\" + systemVersion + \\"\\\\ntype \'help\' for help\\";\\n    this.commandHistory = [];\\n    this.historyIndex = -1;\\n\\n    this.flush();\\n  }\\n  flush() {\\n    this.outputShell.text =\\n      this.shell.text +\\n      \\"\\\\n>\\" +\\n      this.insert(this.currentLineInput, \\"|\\", this.selectionIndex);\\n    this.outputShell.flush();\\n  }\\n}\\n"}}}}}'