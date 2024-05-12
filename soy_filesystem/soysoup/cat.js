class ProgramSource extends Program {
  load(args) {
    if (fileSystem.pathExists(args) == false || !fileSystem.isFile(args)) {
      this.outputShell.println(error("path doesn't exist or is not a file"));
      this.quit();
      return;
    }
    this.outputShell.println(fileSystem.readFile(args));
    this.quit();
  }
}
