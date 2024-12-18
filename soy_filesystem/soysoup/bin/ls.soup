class ProgramSource extends Program {
  load(args) {
    if (!this.dirExists(args)) {
      this.outputShell.println(
        error("path doesn't exist or is not a directory")
      );
      this.quit();
      return;
    }
    let text = "";

    this.readDirectory(args).forEach((item) => {
      let actualPath = getActualPath(item, getActualPath(args, this.cwd));
      let isFile =
        fileSystem.pathExists(actualPath) &&
        fileSystem.isFile(actualPath) == true;
      if (isFile == true) {
        text += GREEN_COLOR + item + "\n";
      } else {
        text += BLUE_COLOR + item + "\n";
      }
    });
    text = text.trim() + RESET_COLOR;
    this.outputShell.println(text);
    this.quit();
  }
}
