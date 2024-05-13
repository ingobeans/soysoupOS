class ProgramSource extends Program {
  load(args) {
    var helpMessage = `cd - navigate to another directory
cat - read contents of file
echo - print a string to shell
edit - edit file by path
exit - close terminal instance
help - prints this
ls - list contents of directory
proc - list or terminate processes
pwd - prints working directory
reload - reset file system
cls - clears the terminal
terminal - open new instance of terminal`;
    this.outputShell.println(helpMessage);
    this.quit();
  }
}
