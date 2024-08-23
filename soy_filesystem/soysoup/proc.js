class ProgramSource extends Program {
  load(args) {
    var parts = parseToParts(args);
    if (
      !args ||
      (parts[0] != "list" && parts[0] != "kill") ||
      (parts[0] == "kill" && parts.length == 1)
    ) {
      this.outputShell.println(
        error(
          `missing or incorrect args. use 'proc list' to list processes or 'proc kill <process ID>' to terminate a process.`
        )
      );
      // invalid args if args is empty, if the first argument is not list or kill, or if the first argument is kill but there is no argument for process ID
      this.quit();
      return;
    }
    if (parts[0] == "list") {
      var text = "running processes:";
      for (let index = 0; index < programs.length; index++) {
        const program = programs[index];
        text +=
          "\n\t" +
          program.pid +
          " - " +
          program.filepath.split("/")[program.filepath.split("/").length - 1];
      }
      this.outputShell.println(text);
    } else if (parts[0] == "kill") {
      programs.splice(Number(parts[1]), 1);
      this.outputShell.println("killed process with ID " + parts[1]);
    }
    this.quit();
  }
}
