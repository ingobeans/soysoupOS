class ProgramSource extends Program {
  load(args) {
    this.terminal = executeFile(
      "soysoup/bin/terminal.soup",
      "",
      this.outputShell,
      ""
    )["instance"];
  }
}
