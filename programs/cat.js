class ProgramSource extends Program {
  load(args) {
    if (fileSystem.pathExists(args) == false || !fileSystem.isFile(args)) {
      printConsole("path doesn't exist or is not a file");
      return;
    }
    printConsole(fileSystem.readFile(args));
  }
}
