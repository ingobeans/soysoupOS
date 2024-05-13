class MultitextInput extends CommandlineInput {
  customKeyEvent(event) {
    // make CTRL + X 'submit' the input, rather than enter

    if (event.key == "x" && event.ctrlKey) {
      this.onSubmit();
      return true;
    }
  }

  flush() {
    //overwrite the flush function to also include the message at the bottom

    super.flush();
    // the normal code can still run, just need to add a print at end of file
    this.outputShell.println("[use CTRL+X to save and exit]");
  }
}

class ProgramSource extends Program {
  onKeypress(event) {
    this.prompt.onKeypress(event);
  }
  async load(args) {
    if (!args || fileSystem.isValidParentDirectory(args) != true) {
      this.outputShell.println(error("path doesn't exist"));
      this.quit();
      return;
    }

    if (fileSystem.isFile(args) != true) {
      fileSystem.createFile(args, "");
    }

    this.prompt = new MultitextInput(this.outputShell);
    this.outputShell.text = "";
    var contents = fileSystem.readFile(args);

    this.prompt.prompt("", true).then((newContents) => {
      fileSystem.writeFile(args, newContents);
      this.outputShell.println("saved modified file to " + args);
      this.quit();
    });
    this.prompt.currentLineInput = contents;
    this.prompt.selectionIndex = contents.length;
    this.prompt.flush();
  }
}
