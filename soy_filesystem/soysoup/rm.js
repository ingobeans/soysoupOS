class ProgramSource extends Program {
  load(args) {
    if (!this.pathExists(args)) {
      this.outputShell.println(error("path doesn't exist"));
      this.quit();
      return;
    }

    this.deleteItem(args);
    this.quit();
  }
}
