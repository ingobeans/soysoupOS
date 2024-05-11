class ProgramSource extends Program {
  load(args, outputShell) {
    if (fileSystem.pathExists(args) == false || !fileSystem.isFile(args)) {
      outputShell.print("path doesn't exist or is not a file");
      return;
    }
    outputShell.print(fileSystem.readFile(args));
  }
}
