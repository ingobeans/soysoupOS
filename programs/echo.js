class ProgramSource extends Program {
  load(args, outputShell) {
    console.log(outputShell);
    outputShell.print(args);
  }
}
