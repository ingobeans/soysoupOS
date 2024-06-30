systemFiles = '{"type": "directory", "content": {"home": {"type": "directory", "content": {"documents": {"type": "directory", "content": {"my_document.txt": {"type": "file", "content": "this is my document. \\n\\nit\'s mine, my own, my precious."}}}, "downloads": {"type": "directory", "content": {"horses.txt": {"type": "file", "content": "o------.    o------.    o------.    o------.    o------.    o------.\\n / \\\\ / \\\\     / \\\\ / \\\\     / \\\\ / \\\\     / \\\\ / \\\\     / \\\\ / \\\\     / \\\\ / \\\\\\n\\nthey are horses. they are on the move."}}}, "programdata": {"type": "directory", "content": {"game_save.txt": {"type": "file", "content": "score 0\\nhealth 4\\ncoins 3"}}}}}, "soysoup": {"type": "directory", "content": {"applications": {"type": "directory", "content": {"test.soup": {"type": "file", "content": "class ComponentTestRect extends Component {\\n  constructor(window, parent, width, height) {\\n    super(window, parent, width, height);\\n    this.x = 10;\\n    this.y = 10;\\n    this.anim = 0;\\n  }\\n  draw() {\\n    if (this.anim > 0) {\\n      this.anim -= 5;\\n    }\\n\\n    drawRect(\\n      this.ctx,\\n      0,\\n      0,\\n      this.width,\\n      this.height,\\n      \\"rgb(255,\\" + this.anim + \\", 255)\\"\\n    );\\n    super.draw();\\n  }\\n  onMousedown(event) {\\n    this.anim = 255;\\n    console.log(\\"clicked\\");\\n    super.onMousedown(event);\\n  }\\n}\\n\\nclass WindowSource extends ProgramWindow {\\n  constructor(parent) {\\n    super(parent, 550, 300);\\n    var testRect = new ComponentTestRect(this, this, 150, 150);\\n    this.addComponent(testRect);\\n    var testScroll = new ComponentScrollBox(this, this, 150, 260);\\n    var testRect2 = new ComponentTestRect(this, testScroll, 60, 60);\\n    testScroll.x = 160;\\n    testScroll.y = 40;\\n    testScroll.subcomponents.push(testRect2);\\n    this.addComponent(testScroll);\\n  }\\n}\\n\\nclass ProgramSource extends Program {\\n  load(args) {\\n    this.window = new WindowSource(this);\\n  }\\n}\\n"}}}, "bar.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  showProgressBar(percent) {\\n    this.outputShell.text =\\n      \\"[\\" + \\"#\\".repeat(percent) + \\"-\\".repeat(100 - percent) + \\"]\\";\\n    this.outputShell.flush();\\n  }\\n  load(args) {\\n    var self = this;\\n    for (let percent = 0; percent <= 101; percent++) {\\n      setTimeout(function () {\\n        if (percent == 101) {\\n          self.outputShell.println(\\"finished the important task!\\");\\n          self.quit();\\n          return;\\n        }\\n        self.showProgressBar(percent, self.outputShell);\\n      }, 40 * percent);\\n    }\\n  }\\n}\\n"}, "cat.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    if (!this.fileExists(args)) {\\n      this.outputShell.println(error(\\"path doesn\'t exist or is not a file\\"));\\n      this.quit();\\n      return;\\n    }\\n    this.outputShell.println(this.readFile(args));\\n    this.quit();\\n  }\\n}\\n"}, "cls.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    this.outputShell.text = \\"\\";\\n    this.outputShell.flush();\\n    this.quit();\\n  }\\n}\\n"}, "colors.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  onKeypress(event) {\\n    this.prompt.onKeypress(event);\\n  }\\n  async load(args) {\\n    this.outputShell.println(\\n      `i am default color ${GREEN_COLOR}i am green ${BLUE_COLOR}but i am blue ${ERROR_COLOR} yet i am the bestest color${RESET_COLOR}`\\n    );\\n\\n    this.quit();\\n  }\\n}\\n"}, "echo.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    this.outputShell.println(args);\\n    this.quit();\\n  }\\n}\\n"}, "edit.soup": {"type": "file", "content": "class MultitextInput extends CommandlineInput {\\n  customKeyEvent(event) {\\n    // make CTRL + X \'submit\' the input, rather than enter.\\n    // also make tab add indent\\n\\n    if (event.key == \\"x\\" && event.ctrlKey) {\\n      this.onSubmit();\\n      return true;\\n      // returning true means blocking the default handling of the key\\n    }\\n\\n    if (event.key == \\"Tab\\" && !event.ctrlKey) {\\n      console.log(\\"tab\\");\\n      this.writeCharacter(\\"  \\");\\n      this.flush();\\n      return true;\\n    }\\n  }\\n\\n  flush() {\\n    //overwrite the flush function to also include the message at the bottom\\n\\n    super.flush();\\n    // the normal code can still run, just need to add a print at end of file\\n    this.outputShell.println(\\"[use CTRL+X to save and exit]\\");\\n  }\\n}\\n\\nclass ProgramSource extends Program {\\n  onKeypress(event) {\\n    this.prompt.onKeypress(event);\\n  }\\n  async load(args) {\\n    if (!args || this.isValidParentDirectory(args) != true) {\\n      this.outputShell.println(error(\\"path doesn\'t exist\\"));\\n      this.quit();\\n      return;\\n    }\\n\\n    this.prompt = new MultitextInput(this.outputShell);\\n    this.outputShell.text = \\"\\";\\n    var contents = \\"\\";\\n\\n    if (this.fileExists(args) == true) {\\n      var contents = this.readFile(args);\\n    }\\n\\n    this.prompt.prompt(\\"\\", true).then((newContents) => {\\n      this.writeFile(args, newContents);\\n      this.outputShell.println(\\"saved modified file to \\" + args);\\n      this.quit();\\n    });\\n    this.prompt.currentLineInput = contents;\\n    this.prompt.selectionIndex = contents.length;\\n    this.prompt.flush();\\n  }\\n}\\n"}, "grid.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  onKeypress(event) {\\n    if (event.key == \\"a\\") {\\n      this.x -= 1;\\n    }\\n    if (event.key == \\"d\\") {\\n      this.x += 1;\\n    }\\n    if (event.key == \\"w\\") {\\n      this.y -= 1;\\n    }\\n    if (event.key == \\"s\\") {\\n      this.y += 1;\\n    }\\n    if (event.key == \\"q\\") {\\n      this.quit();\\n      return;\\n    }\\n    this.x = this.x.clamp(0, 49);\\n    this.y = this.y.clamp(0, 6);\\n    this.draw();\\n  }\\n  load(args) {\\n    this.x = 25;\\n    this.y = 3;\\n    this.draw();\\n  }\\n  draw() {\\n    var grid = (\\"-\\".repeat(50) + \\"\\\\n\\").repeat(7);\\n    var indexPosition = this.y * 51 + this.x;\\n    grid = grid.slice(0, indexPosition) + \\"#\\" + grid.slice(indexPosition + 1);\\n    this.outputShell.text = grid + \\"\\\\n\\\\n[use WASD to move, Q to exit]\\";\\n    this.outputShell.flush();\\n  }\\n}\\n"}, "help.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    var helpMessage = `cd - navigate to another directory\\ncat - read contents of file\\necho - print a string to shell\\nedit - edit file by path\\nexit - close terminal instance\\nhelp - prints this\\nls - list contents of directory\\nmkdir - create folder\\nproc - list or terminate processes\\npwd - prints working directory\\nreload - reset file system\\nrm - remove file or folder\\ncls - clears the terminal\\nterminal - open new instance of terminal`;\\n    this.outputShell.println(helpMessage);\\n    this.quit();\\n  }\\n}\\n"}, "ls.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    let path = getActualPath(args, this.cwd);\\n    if (!this.dirExists(path)) {\\n      this.outputShell.println(\\n        error(\\"path doesn\'t exist or is not a directory\\")\\n      );\\n      this.quit();\\n      return;\\n    }\\n    var text = \\"\\";\\n\\n    this.readDirectory(path).forEach((item) => {\\n      var isFile = this.fileExists(path + item);\\n      console.log(path + item);\\n      if (isFile == true) {\\n        text += GREEN_COLOR + item + \\"\\\\n\\";\\n      } else {\\n        text += BLUE_COLOR + item + \\"\\\\n\\";\\n      }\\n    });\\n    text = text.trim() + RESET_COLOR;\\n    this.outputShell.println(text);\\n    this.quit();\\n  }\\n}\\n"}, "mkdir.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    if (!this.isValidParentDirectory(args) || this.dirExists(args)) {\\n      this.outputShell.println(error(\\"path is invalid\\"));\\n      this.quit();\\n      return;\\n    }\\n\\n    this.createDirectory(args);\\n    this.quit();\\n  }\\n}\\n"}, "proc.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    var parts = parseToParts(args);\\n    if (\\n      !args ||\\n      (parts[0] != \\"list\\" && parts[0] != \\"kill\\") ||\\n      (parts[0] == \\"kill\\" && parts.length == 1)\\n    ) {\\n      this.outputShell.println(\\n        error(\\n          `missing or incorrect args. use \'proc list\' to list processes or \'proc kill <process ID>\' to terminate a process.`\\n        )\\n      );\\n      // invalid args if args is empty, if the first argument is not list or kill, or if the first argument is kill but there is no argument for process ID\\n      this.quit();\\n      return;\\n    }\\n    if (parts[0] == \\"list\\") {\\n      var text = \\"running processes:\\";\\n      for (let index = 0; index < programs.length; index++) {\\n        const program = programs[index];\\n        text +=\\n          \\"\\\\n\\\\t\\" +\\n          index +\\n          \\" - \\" +\\n          program.filepath.split(\\"/\\")[program.filepath.split(\\"/\\").length - 1];\\n      }\\n      this.outputShell.println(text);\\n    } else if (parts[0] == \\"kill\\") {\\n      programs.splice(Number(parts[1]), 1);\\n      this.outputShell.println(\\"killed process with ID \\" + parts[1]);\\n    }\\n    this.quit();\\n  }\\n}\\n"}, "pwd.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    this.outputShell.println(this.cwd);\\n    this.quit();\\n  }\\n}\\n"}, "reload.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    fileSystem.loadFromString(systemFiles);\\n    this.quit();\\n  }\\n}\\n"}, "rm.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    if (!this.pathExists(args)) {\\n      this.outputShell.println(error(\\"path doesn\'t exist\\"));\\n      this.quit();\\n      return;\\n    }\\n\\n    this.deleteItem(args);\\n    this.quit();\\n  }\\n}\\n"}, "terminal.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  onKeypress(event) {\\n    this.prompt.onKeypress(event);\\n  }\\n  async handleSubmit(text) {\\n    var args = parseToParts(text);\\n    if (args[0] == \\"exit\\") {\\n      this.quit();\\n      return;\\n    }\\n    if (args[0] == \\"cd\\") {\\n      var targetPath = fileSystem.normalizePath(\\n        getActualPath(args[1], this.cwd)\\n      );\\n      if (\\n        fileSystem.pathExists(targetPath) &&\\n        fileSystem.isFile(targetPath) != true\\n      ) {\\n        this.cwd = targetPath;\\n      } else {\\n        this.outputShell.println(\\n          error(\\"path doesn\'t exist or is not a directory\\")\\n        );\\n      }\\n      this.startNewPrompt();\\n      return;\\n    }\\n    var commandOutputShell = this.outputShell;\\n\\n    if (text.indexOf(\\">\\") != -1) {\\n      var splitted = splitAtLastOccurrence(text, \\">\\");\\n      var self = this;\\n      var outputDestination = splitted[1];\\n      if (outputDestination && this.isValidParentDirectory(outputDestination)) {\\n        text = splitted[0];\\n        commandOutputShell = new Shell(function (text) {\\n          self.writeFile(outputDestination, removeAnsiCodes(text));\\n        });\\n      }\\n    }\\n\\n    await executeCommand(text, commandOutputShell, this.cwd);\\n    this.startNewPrompt();\\n  }\\n  async startNewPrompt() {\\n    var result = await this.prompt.prompt(\\">\\", true);\\n    this.handleSubmit(result);\\n  }\\n  load(args) {\\n    this.prompt = new CommandlineInput(this.outputShell, true);\\n    this.cwd = \\"/\\";\\n    this.outputShell.println(\\n      `soysoupOS v${systemVersion}\\\\ntype \'help\' for help`\\n    );\\n\\n    this.startNewPrompt();\\n  }\\n}\\n"}, "test.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  async load(args) {\\n    this.myPrompt = new CommandlineInput(this.outputShell);\\n\\n    var name = await this.myPrompt.prompt(\\"What is your name?: \\", false);\\n    var age = await this.myPrompt.prompt(\\"How old are you: \\", false);\\n\\n    this.outputShell.println(`Howdy ${name}, aged ${age}`);\\n\\n    this.quit();\\n  }\\n  onKeypress(event) {\\n    this.myPrompt.onKeypress(event);\\n  }\\n}\\n"}}}}}'