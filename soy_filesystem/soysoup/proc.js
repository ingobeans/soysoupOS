class ProgramSource extends Program {
  load(args) {
    var parts = parseToParts(args);
    if (!args || (parts[0] != "list" && parts[0] != "kill")) {
      this.outputShell.println(
        `error: missing or incorrect args. use 'proc list' to list processes or 'proc kill <process ID>' to terminate a process.`
      );
      this.quit();
      return;
    }
    if (parts[0] == "list") {
      var text = "running processes:";
      for (let index = 0; index < programs.length; index++) {
        const program = programs[index];
        text +=
          "\n\t" +
          index +
          " - " +
          program.filepath.split("/")[program.filepath.split("/").length - 1];
      }
      this.outputShell.println(text);
    }
    this.quit();
  }
}
