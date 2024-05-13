class ProgramSource extends Program {
  load(args) {
    if (!this.fileExists(args)) {
      this.outputShell.println(error("path doesn't exist or is not a file"));
      this.quit();
      return;
    }
    this.outputShell.println(this.readFile(args));
    this.quit();
  }
}
