systemFiles = '{"type": "directory", "content": {"soysoup": {"type": "directory", "content": {"cat.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args, outputShell) {\\n    if (fileSystem.pathExists(args) == false || !fileSystem.isFile(args)) {\\n      outputShell.print(\\"path doesn\'t exist or is not a file\\");\\n      return;\\n    }\\n    outputShell.print(fileSystem.readFile(args));\\n  }\\n}\\n"}, "echo.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args, outputShell) {\\n    outputShell.print(args);\\n  }\\n}\\n"}, "files.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args, outputShell) {\\n    var g = \\"1\\";\\n    if (fileSystem.pathExists(\\"soysoup/files_counter.txt\\") == false) {\\n      fileSystem.createFile(\\"soysoup/files_counter.txt\\", \\"0\\");\\n    } else {\\n      g = fileSystem.readFile(\\"soysoup/files_counter.txt\\");\\n    }\\n\\n    outputShell.print(\\n      \\"this is the file browser app. it has been opened \\" + g + \\" times.\\"\\n    );\\n\\n    fileSystem.writeFile(\\n      \\"soysoup/files_counter.txt\\",\\n      (Number(g) + 1).toString()\\n    );\\n  }\\n}\\n"}, "ls.soup": {"type": "file", "content": "class ProgramSource extends Program {\\n  load(args, outputShell) {\\n    if (\\n      fileSystem.pathExists(args) == false ||\\n      fileSystem.isFile(args) == true\\n    ) {\\n      outputShell.print(\\"path doesn\'t exist or is not a directory\\");\\n      return;\\n    }\\n    outputShell.print(fileSystem.readDirectory(args).join(\\"\\\\n\\"));\\n  }\\n}\\n"}}}, "home": {"type": "directory", "content": {"downloads": {"type": "directory", "content": {}}, "documents": {"type": "directory", "content": {}}, "programs": {"type": "directory", "content": {}}}}}}'