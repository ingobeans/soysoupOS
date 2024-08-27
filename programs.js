systemFiles = '{"type": "directory", "content": {"home": {"type": "directory", "content": {"documents": {"type": "directory", "content": {"my_document.txt": {"type": "file", "content": "this is my document. \\n\\nit\'s mine, my own, my precious."}}}, "downloads": {"type": "directory", "content": {"horses.txt": {"type": "file", "content": "o------.    o------.    o------.    o------.    o------.    o------.\\n / \\\\ / \\\\     / \\\\ / \\\\     / \\\\ / \\\\     / \\\\ / \\\\     / \\\\ / \\\\     / \\\\ / \\\\\\n\\nthey are horses. they are on the move."}}}, "programdata": {"type": "directory", "content": {"game_save.txt": {"type": "file", "content": "score 0\\nhealth 4\\ncoins 3"}}}}}, "soysoup": {"type": "directory", "content": {"bin": {"type": "directory", "content": {"bar.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  showProgressBar(percent) {\\n    this.outputShell.setText(\\n      \\"[\\" + \\"#\\".repeat(percent) + \\"-\\".repeat(100 - percent) + \\"]\\"\\n    );\\n    this.outputShell.flush();\\n  }\\n  load(args) {\\n    var self = this;\\n    for (let percent = 0; percent <= 101; percent++) {\\n      setTimeout(function () {\\n        if (percent == 101) {\\n          self.outputShell.println(\\"finished the important task!\\");\\n          self.quit();\\n          return;\\n        }\\n        self.showProgressBar(percent, self.outputShell);\\n      }, 40 * percent);\\n    }\\n  }\\n}\\n"}, "cat.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    if (!this.fileExists(args)) {\\n      this.outputShell.println(error(\\"path doesn\'t exist or is not a file\\"));\\n      this.quit();\\n      return;\\n    }\\n    this.outputShell.println(this.readFile(args));\\n    this.quit();\\n  }\\n}\\n"}, "cls.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    this.outputShell.setText(\\"\\");\\n    this.outputShell.flush();\\n    this.quit();\\n  }\\n}\\n"}, "colors.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  onKeypress(event) {\\n    this.prompt.onKeypress(event);\\n  }\\n  async load(args) {\\n    this.outputShell.println(\\n      `i am default color ${GREEN_COLOR}i am green ${BLUE_COLOR}but i am blue ${ERROR_COLOR}yet i am the bestest color${RESET_COLOR}... i am normal...`\\n    );\\n\\n    this.quit();\\n  }\\n}\\n"}, "echo.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    this.outputShell.println(args);\\n    this.quit();\\n  }\\n}\\n"}, "edit.soup": {"type": "file", "content": "class MultitextInput extends CommandlineInput {\\n  customKeyEvent(event) {\\n    // make CTRL + X \'submit\' the input, rather than enter.\\n    // also make tab add indent\\n\\n    if (event.key == \\"x\\" && event.ctrlKey) {\\n      this.onSubmit();\\n      return true;\\n      // returning true means blocking the default handling of the key\\n    }\\n\\n    if (event.key == \\"Tab\\" && !event.ctrlKey) {\\n      console.log(\\"tab\\");\\n      this.writeCharacter(\\"  \\");\\n      this.flush();\\n      return true;\\n    }\\n  }\\n\\n  flush() {\\n    //overwrite the flush function to also include the message at the bottom\\n\\n    super.flush();\\n    // the normal code can still run, just need to add a print at end of file\\n    this.outputShell.println(\\"[use CTRL+X to save and exit]\\");\\n  }\\n}\\n\\nclass ProgramSource extends Program {\\n  onKeypress(event) {\\n    this.prompt.onKeypress(event);\\n  }\\n  async load(args) {\\n    if (\\n      !args ||\\n      this.isValidParentDirectory(args) != true ||\\n      !this.isValidFilePath(args)\\n    ) {\\n      this.outputShell.println(error(\\"path doesn\'t exist\\"));\\n      this.quit();\\n      return;\\n    }\\n\\n    this.prompt = new MultitextInput(this.outputShell);\\n    this.outputShell.text = \\"\\";\\n    var contents = \\"\\";\\n\\n    if (this.fileExists(args) == true) {\\n      var contents = this.readFile(args);\\n    }\\n\\n    this.prompt.prompt(\\"\\", true).then((newContents) => {\\n      this.writeFile(args, newContents);\\n      this.outputShell.println(\\"saved modified file to \\" + args);\\n      this.quit();\\n    });\\n    this.prompt.currentLineInput = contents;\\n    this.prompt.selectionIndex = contents.length;\\n    this.prompt.flush();\\n  }\\n}\\n"}, "grid.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  onKeypress(event) {\\n    if (event.key == \\"a\\") {\\n      this.x -= 1;\\n    }\\n    if (event.key == \\"d\\") {\\n      this.x += 1;\\n    }\\n    if (event.key == \\"w\\") {\\n      this.y -= 1;\\n    }\\n    if (event.key == \\"s\\") {\\n      this.y += 1;\\n    }\\n    if (event.key == \\"q\\") {\\n      this.quit();\\n      return;\\n    }\\n    this.x = this.x.clamp(0, 49);\\n    this.y = this.y.clamp(0, 6);\\n    this.draw();\\n  }\\n  load(args) {\\n    this.x = 25;\\n    this.y = 3;\\n    this.draw();\\n  }\\n  draw() {\\n    var grid = (\\"-\\".repeat(50) + \\"\\\\n\\").repeat(7);\\n    var indexPosition = this.y * 51 + this.x;\\n    grid = grid.slice(0, indexPosition) + \\"#\\" + grid.slice(indexPosition + 1);\\n    this.outputShell.text = grid + \\"\\\\n\\\\n[use WASD to move, Q to exit]\\";\\n    this.outputShell.flush();\\n  }\\n}\\n"}, "help.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    var helpMessage = `cd [directory]       - navigate to another directory\\ncat [file]           - read contents of file\\necho [string]        - print a string to shell\\nedit [file]          - edit file by path\\nexit                 - close terminal instance\\nhelp                 - prints this\\nls <directory>       - list contents of directory\\nmkdir [directory]    - create folder\\nproc list            - list processes\\nproc kill [pid]      - terminate process\\npwd                  - prints working directory\\nreload               - reset file system\\nrm [file/directory]  - remove file or folder\\nmv [source file] [dest file]   - move or rename a file from source to destination\\ncls                  - clears the terminal\\nterminal             - open new instance of terminal`;\\n    this.outputShell.println(helpMessage);\\n    this.quit();\\n  }\\n}\\n"}, "ls.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    if (!this.dirExists(args)) {\\n      this.outputShell.println(\\n        error(\\"path doesn\'t exist or is not a directory\\")\\n      );\\n      this.quit();\\n      return;\\n    }\\n    let text = \\"\\";\\n\\n    this.readDirectory(args).forEach((item) => {\\n      let actualPath = getActualPath(item, getActualPath(args, this.cwd));\\n      let isFile =\\n        fileSystem.pathExists(actualPath) &&\\n        fileSystem.isFile(actualPath) == true;\\n      if (isFile == true) {\\n        text += GREEN_COLOR + item + \\"\\\\n\\";\\n      } else {\\n        text += BLUE_COLOR + item + \\"\\\\n\\";\\n      }\\n    });\\n    text = text.trim() + RESET_COLOR;\\n    this.outputShell.println(text);\\n    this.quit();\\n  }\\n}\\n"}, "mkdir.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    if (!this.isValidParentDirectory(args) || this.dirExists(args)) {\\n      this.outputShell.println(error(\\"path is invalid\\"));\\n      this.quit();\\n      return;\\n    }\\n\\n    this.createDirectory(args);\\n    this.quit();\\n  }\\n}\\n"}, "mv.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    let sourcePath = undefined;\\n    let destPath = undefined;\\n\\n    if (args.split(\\" \\").length == 2) {\\n      sourcePath = args.split(\\" \\")[0];\\n      destPath = args.split(\\" \\")[1];\\n    } else {\\n      this.outputShell.println(error(\\"wrong arguments\\"));\\n      this.quit();\\n      return;\\n    }\\n\\n    if (!sourcePath || !this.fileExists(sourcePath)) {\\n      this.outputShell.println(error(\\"source path doesn\'t exist\\"));\\n      this.quit();\\n      return;\\n    }\\n    if (\\n      !destPath ||\\n      this.isValidParentDirectory(destPath) != true ||\\n      !this.isValidFilePath(destPath) ||\\n      this.fileExists(destPath)\\n    ) {\\n      this.outputShell.println(\\n        error(\\"destination path is invalid or already exists\\")\\n      );\\n      console.log(\\n        !destPath,\\n        this.isValidParentDirectory(destPath) != true,\\n        !this.isValidFilePath(destPath),\\n        this.fileExists(destPath)\\n      );\\n      this.quit();\\n      return;\\n    }\\n    this.renameFile(sourcePath, destPath);\\n    this.quit();\\n  }\\n}\\n"}, "proc.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    var parts = parseToParts(args);\\n    if (\\n      !args ||\\n      (parts[0] != \\"list\\" && parts[0] != \\"kill\\") ||\\n      (parts[0] == \\"kill\\" && parts.length == 1)\\n    ) {\\n      this.outputShell.println(\\n        error(\\n          `missing or incorrect args. use \'proc list\' to list processes or \'proc kill <process ID>\' to terminate a process.`\\n        )\\n      );\\n      // invalid args if args is empty, if the first argument is not list or kill, or if the first argument is kill but there is no argument for process ID\\n      this.quit();\\n      return;\\n    }\\n    if (parts[0] == \\"list\\") {\\n      var text = \\"running processes:\\";\\n      for (let index = 0; index < programs.length; index++) {\\n        const program = programs[index];\\n        text +=\\n          \\"\\\\n\\\\t\\" +\\n          program.pid +\\n          \\" - \\" +\\n          program.filepath.split(\\"/\\")[program.filepath.split(\\"/\\").length - 1];\\n      }\\n      this.outputShell.println(text);\\n    } else if (parts[0] == \\"kill\\") {\\n      let program = getProgram(parts[1]);\\n      if (program !== undefined) {\\n        program.quit();\\n        programs = removeItem(programs, program);\\n        this.outputShell.println(\\"killed process with ID \\" + parts[1]);\\n      } else {\\n        this.outputShell.println(error(\\"no process with ID \\" + parts[1]));\\n      }\\n    }\\n    this.quit();\\n  }\\n}\\n"}, "pwd.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    this.outputShell.println(this.cwd);\\n    this.quit();\\n  }\\n}\\n"}, "reload.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    fileSystem.loadFromString(systemFiles);\\n    this.quit();\\n  }\\n}\\n"}, "rm.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    if (!this.pathExists(args)) {\\n      this.outputShell.println(error(\\"path doesn\'t exist\\"));\\n      this.quit();\\n      return;\\n    }\\n\\n    this.deleteItem(args);\\n    this.quit();\\n  }\\n}\\n"}, "service.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    var parts = parseToParts(args);\\n    if (parts.length < 1) {\\n      this.outputShell.println(error(\\"incorrect arguments\\"));\\n      this.quit();\\n      return;\\n    }\\n    if (parts[0] == \\"list\\") {\\n      let servicesText = \\"\\";\\n      for (let service of Object.keys(serviceManager.serviceInstances)) {\\n        let instance = serviceManager.serviceInstances[service];\\n        servicesText +=\\n          \\"\\\\n\\\\t\\" +\\n          instance.filepath\\n            .split(\\"/\\")\\n            [instance.filepath.split(\\"/\\").length - 1].split(\\".\\")[0];\\n      }\\n      this.outputShell.println(\\"services running: \\" + servicesText);\\n      this.quit();\\n    } else if (parts[0] == \\"start\\") {\\n      if (parts.length < 2) {\\n        this.outputShell.println(error(\\"incorrect arguments\\"));\\n        this.quit();\\n        return;\\n      }\\n      serviceManager.startService(parts[1], this.outputShell);\\n    } else if (parts[0] == \\"stop\\") {\\n      if (parts.length < 2) {\\n        this.outputShell.println(error(\\"incorrect arguments\\"));\\n        this.quit();\\n        return;\\n      }\\n      serviceManager.stopService(parts[1]);\\n    }\\n    this.quit();\\n  }\\n}\\n"}, "servicemanager.soup": {"type": "file", "content": "function setServiceManager(instance) {\\n  if (typeof serviceManagerPID === \\"undefined\\") {\\n    serviceManagerPID = instance.pid;\\n    serviceManager = instance;\\n  }\\n}\\n\\nclass ProgramSource extends Program {\\n  startService(name, shell) {\\n    if (this.services.includes(name)) {\\n      if (this.serviceInstances[name] === undefined) {\\n        this.serviceInstances[name] = executeFile(\\n          `soysoup/services/${name}.soup`,\\n          \\"\\",\\n          shell,\\n          \\"\\"\\n        )[\\"instance\\"];\\n      }\\n    }\\n  }\\n  stopService(name) {\\n    if (this.serviceInstances[name] !== undefined) {\\n      this.serviceInstances[name].quit();\\n    }\\n  }\\n  refreshServiceList() {\\n    this.services = [];\\n    for (let service of this.readDirectory(\\"/soysoup/services\\")) {\\n      this.services.push(service.split(\\".\\")[0]);\\n    }\\n  }\\n  load(args) {\\n    if (typeof serviceManagerPID === \\"undefined\\") {\\n      setServiceManager(this);\\n    } else {\\n      this.quit();\\n      return;\\n    }\\n    this.services = [];\\n    this.serviceInstances = {};\\n    this.refreshServiceList();\\n  }\\n}\\n"}, "terminal.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  onKeypress(event) {\\n    if (this.focusedProcess == undefined) {\\n      this.prompt.onKeypress(event);\\n    } else {\\n      if (event.key == \\"z\\" && event.ctrlKey) {\\n        this.focusedProcess.outputShell = new Shell(() => {});\\n        this.outputShell.println(\\n          \\"dropped focus from PID \\" + this.focusedProcess.pid\\n        );\\n        this.focusedProcess = undefined;\\n        this.startNewPrompt();\\n        return;\\n      } else if (event.key == \\"c\\" && event.ctrlKey) {\\n        this.focusedProcess.quit();\\n        this.focusedProcess.outputShell = new Shell(() => {});\\n        this.focusedProcess = undefined;\\n        this.startNewPrompt();\\n        return;\\n      }\\n      this.focusedProcess.onKeypress(event);\\n    }\\n  }\\n  async handleSubmit(text) {\\n    let args = parseToParts(text);\\n    if (args[0] == \\"exit\\") {\\n      this.quit();\\n      return;\\n    } else if (args[0] == \\"jobs\\") {\\n      var text = \\"\\";\\n      for (let index = 0; index < this.processes.length; index++) {\\n        const program = this.processes[index];\\n        text +=\\n          \\"\\\\n\\" +\\n          program.pid +\\n          \\" - \\" +\\n          program.filepath.split(\\"/\\")[program.filepath.split(\\"/\\").length - 1];\\n      }\\n      this.outputShell.println(text);\\n      this.startNewPrompt();\\n      return;\\n    } else if (args[0] == \\"cd\\") {\\n      let targetPath = fileSystem.normalizePath(\\n        getActualPath(args[1], this.cwd)\\n      );\\n      if (\\n        fileSystem.pathExists(targetPath) &&\\n        fileSystem.isFile(targetPath) != true\\n      ) {\\n        this.cwd = targetPath;\\n      } else {\\n        this.outputShell.println(\\n          error(\\"path doesn\'t exist or is not a directory\\")\\n        );\\n      }\\n      this.startNewPrompt();\\n      return;\\n    }\\n    let newShell = this.outputShell;\\n\\n    if (text.indexOf(\\">\\") != -1) {\\n      let splitted = splitAtLastOccurrence(text, \\">\\");\\n      let self = this;\\n      let outputDestination = splitted[1];\\n      if (\\n        outputDestination &&\\n        this.isValidFilePath(outputDestination) &&\\n        this.isValidParentDirectory(outputDestination) == true\\n      ) {\\n        text = splitted[0];\\n        newShell = new Shell(function (text) {\\n          self.writeFile(outputDestination, removeAnsiCodes(text));\\n        });\\n      }\\n    }\\n    let runInBackground = false;\\n\\n    if (text[text.length - 1] == \\"&\\") {\\n      text = text.slice(0, -1);\\n      runInBackground = true;\\n      newShell = new Shell(() => {});\\n    }\\n    let process = executeCommand(text, newShell, this.cwd);\\n    if (process != undefined) {\\n      let oldFocus = this.focusedProcess;\\n      this.processes.push(process[\\"instance\\"]);\\n      if (runInBackground == false) {\\n        this.focusedProcess = process[\\"instance\\"];\\n        await process[\\"promise\\"];\\n        this.processes = removeItem(this.processes, process[\\"instance\\"]);\\n\\n        // only restore focuse IF this command is still the last active program\\n        if (this.focusedProcess == process[\\"instance\\"]) {\\n          this.focusedProcess = oldFocus;\\n          this.startNewPrompt();\\n        }\\n      } else {\\n        process[\\"promise\\"].then(\\n          function () {\\n            this.processes = removeItem(this.processes, process[\\"instance\\"]);\\n          }.bind(this)\\n        );\\n        this.startNewPrompt();\\n      }\\n    } else {\\n      this.startNewPrompt();\\n    }\\n  }\\n  async startNewPrompt() {\\n    if (this.singleCommand === true) {\\n      this.quit();\\n      return;\\n    }\\n    let result = await this.prompt.prompt(\\">\\", true);\\n    this.handleSubmit(result);\\n  }\\n  load(args) {\\n    this.processes = [];\\n    this.focusedProcess = undefined;\\n    this.singleCommand = args != \\"\\";\\n    if (args != \\"\\") {\\n      this.handleSubmit(args);\\n      return;\\n    }\\n    this.prompt = new CommandlineInput(this.outputShell, true);\\n\\n    this.outputShell.println(\\n      `soysoupOS v${systemVersion}\\\\ntype \'help\' for help`\\n    );\\n\\n    this.startNewPrompt();\\n  }\\n}\\n"}, "test.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  async load(args) {\\n    this.myPrompt = new CommandlineInput(this.outputShell);\\n\\n    var name = await this.myPrompt.prompt(\\"What is your name?: \\", false);\\n    var age = await this.myPrompt.prompt(\\"How old are you: \\", false);\\n\\n    this.outputShell.println(`Howdy ${name}, aged ${age}`);\\n\\n    this.quit();\\n  }\\n  onKeypress(event) {\\n    this.myPrompt.onKeypress(event);\\n  }\\n}\\n"}}}, "boot.soy": {"type": "file", "content": "servicemanager&\\nservice start tty"}, "services": {"type": "directory", "content": {"carrot.soup": {"type": "file", "content": "let windowBorderWidth = 2;\\nlet topbarHeight = 30;\\nlet windowBackgroundColor = \\"#fff\\";\\nlet windowTitleTextColor = \\"#000\\";\\n\\nfunction getNewWindowPosition(width, height) {\\n  let step = 25;\\n  let offsetX = 0;\\n  let offsetY = 0;\\n  while (true) {\\n    let p = [\\n      Math.floor((canvas.width - width) / 2) + offsetX,\\n      Math.floor((canvas.height - height) / 2) + offsetY,\\n    ];\\n    let match = false;\\n    for (let program of getDrawnPrograms()) {\\n      if (program.window.x == p[0] && program.window.y == p[1]) {\\n        match = true;\\n      }\\n    }\\n    if (!match) {\\n      return p;\\n    } else {\\n      offsetX += step;\\n      offsetY += step;\\n    }\\n  }\\n}\\n\\nclass ConsoleHostWindow {\\n  load() {\\n    let pathSegments = this.parent.filepath.split(\\"/\\");\\n    this.title = pathSegments[pathSegments.length - 1].split(\\".\\")[0];\\n  }\\n  calcMaxLines() {\\n    return Math.floor(this.canvas.height / fontSize);\\n  }\\n  draw() {\\n    drawRect(\\n      this.ctx,\\n      0,\\n      0,\\n      this.ctx.canvas.width,\\n      this.ctx.canvas.height,\\n      \\"#000\\"\\n    );\\n    let lines = this.parent.outputShell.text.split(\\"\\\\n\\");\\n    let maxLines = this.calcMaxLines() - 1;\\n    let skipUntil = null;\\n    if (lines.length >= maxLines) {\\n      skipUntil = lines.length - maxLines;\\n    }\\n    for (let i = 0; i < lines.length; i++) {\\n      if (!(skipUntil !== null && i < skipUntil)) {\\n        let line = lines[i];\\n        drawAnsiText(\\n          this.ctx,\\n          0,\\n          fontSize * (i - skipUntil + 1),\\n          line,\\n          \\"#fff\\",\\n          \\"#000\\"\\n        );\\n      }\\n    }\\n  }\\n}\\n\\nfunction launchApplication(path, argsRaw, cwd) {\\n  // launches a program with a window & fresh shell\\n  let shell = new Shell(() => {});\\n  let process = executeFile(path, argsRaw, shell, cwd);\\n  if (process[\\"instance\\"].window == undefined) {\\n    process[\\"instance\\"].window = new ConsoleHostWindow();\\n  }\\n  setUpWindow(process[\\"instance\\"].window, process[\\"instance\\"]);\\n  return process;\\n}\\n\\nfunction setUpWindow(window, parent) {\\n  window.canvas = document.createElement(\\"canvas\\");\\n  window.canvas.width = 850;\\n  window.canvas.height = 450;\\n  [window.x, window.y] = getNewWindowPosition(\\n    window.canvas.width,\\n    window.canvas.height\\n  );\\n  window.parent = parent;\\n  window.ctx = window.canvas.getContext(\\"2d\\");\\n  window.load();\\n  window.setUp = true;\\n}\\n\\nfunction drawTopbar(ctx, window) {\\n  drawAnsiText(\\n    ctx,\\n    windowBorderWidth,\\n    windowBorderWidth + fontSize,\\n    window.title,\\n    windowTitleTextColor\\n  );\\n}\\n\\nclass CarrotGraphicsHandler extends GraphicsHandler {\\n  onKeypress(key) {\\n    let drawPrograms = getDrawnPrograms();\\n    if (drawPrograms.length > 0) {\\n      drawPrograms[0].onKeypress(key);\\n    }\\n  }\\n  draw() {\\n    drawRect(screenCtx, 0, 0, canvas.width, canvas.height, \\"#a0a1f0\\");\\n    for (let program of getDrawnPrograms()) {\\n      if (program.window.setUp !== true) {\\n        setUpWindow(program.window, program);\\n      }\\n      let windowBack = document.createElement(\\"canvas\\");\\n      let windowBackCtx = windowBack.getContext(\\"2d\\");\\n      windowBack.width = program.window.canvas.width + windowBorderWidth * 2;\\n      windowBack.height =\\n        program.window.canvas.height + windowBorderWidth * 2 + topbarHeight;\\n\\n      drawRect(\\n        windowBackCtx,\\n        0,\\n        0,\\n        windowBack.width,\\n        windowBack.height,\\n        windowBackgroundColor\\n      );\\n      drawTopbar(windowBackCtx, program.window);\\n      program.window.draw();\\n      windowBackCtx.drawImage(\\n        program.window.ctx.canvas,\\n        windowBorderWidth,\\n        windowBorderWidth + topbarHeight\\n      );\\n      screenCtx.drawImage(\\n        windowBack,\\n        program.window.x - windowBorderWidth,\\n        program.window.y - windowBorderWidth\\n      );\\n    }\\n  }\\n}\\n\\nclass ProgramSource extends Program {\\n  quit() {\\n    setGraphicsHandler();\\n    super.quit();\\n  }\\n  load(args) {\\n    this.programs = [];\\n    setGraphicsHandler(new CarrotGraphicsHandler());\\n    launchApplication(\\"soysoup/bin/terminal.soup\\", \\"\\", \\"\\");\\n  }\\n}\\n"}, "tty.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args) {\\n    this.terminal = executeFile(\\n      \\"soysoup/bin/terminal.soup\\",\\n      \\"\\",\\n      this.outputShell,\\n      \\"\\"\\n    )[\\"instance\\"];\\n  }\\n}\\n"}}}}}}}'