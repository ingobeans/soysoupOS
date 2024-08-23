class ProgramSource extends Program {
  load(args) {
    var helpMessage = `cd [directory]       - navigate to another directory
cat [file]           - read contents of file
echo [string]        - print a string to shell
edit [file]          - edit file by path
exit                 - close terminal instance
help                 - prints this
ls <directory>       - list contents of directory
mkdir [directory]    - create folder
proc list            - list processes
proc kill [pid]      - terminate process
pwd                  - prints working directory
reload               - reset file system
rm [file/directory]  - remove file or folder
mv [source file] [dest file]   - move or rename a file from source to destination
cls                  - clears the terminal
terminal             - open new instance of terminal`;
    this.outputShell.println(helpMessage);
    this.quit();
  }
}
