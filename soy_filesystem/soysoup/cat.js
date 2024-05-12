class ProgramSource extends Program {
  load(args, outputShell) {
    if (fileSystem.pathExists(args) == false || !fileSystem.isFile(args)) {
      outputShell.println("error: path doesn't exist or is not a file");
      return;
    }
    outputShell.println(fileSystem.readFile(args));
    this.quit();
  }
}
