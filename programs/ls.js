class ProgramSource extends Program {
  load(args) {
    if (
      fileSystem.pathExists(args) == false ||
      fileSystem.isFile(args) == true
    ) {
      printConsole("path doesn't exist or is invalid");
      return;
    }
    printConsole(fileSystem.readDirectory(args).join("\n"));
  }
}
