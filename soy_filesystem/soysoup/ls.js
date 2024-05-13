class ProgramSource extends Program {
  load(args) {
    if (
      fileSystem.pathExists(args) == false ||
      fileSystem.isFile(args) == true
    ) {
      this.outputShell.println(
        error("path doesn't exist or is not a directory")
      );
      this.quit();
      return;
    }
    var text = "";
    var path = fileSystem.normalizePath(args);
    fileSystem.readDirectory(args).forEach((item) => {
      var isFile = fileSystem.isFile(path + item);
      console.log(path + item);
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
