# soysoupOS

soysoupOS is widely regarded by me as the operating system of the future. It is terminal based.

The system is based around executable '.soup' files. All commands runnable by the terminal is in fact, executable files. The terminal itself, is also an executable file.

## Making a program for soysoupOS

Programs are executable files, identified by the .soup file extension. Executables are written in Javascript.

An example program could look like this:

```js
class ProgramSource extends Program {
  load(args) {
    this.outputShell.println("hi world!");

    this.quit();
  }
}
```

First we define the `ProgramSource` class. This is the 'entry point' for the program, without it, the program won't run. It should extend from `Program`.

The load function is called when the program first is launched, it receives the `args` argument which contains the launch parameters as a string. When the program is launched, it has the properties of `outputShell`, `cwd` and `filePath` assigned. The outputShell can be used to write to the terminal, as we do in this example.

Finally, we call `this.quit()`. This will 'close' the program and pass control back to the terminal. It **won't** break code execution, so don't use it instead of return, in those scenarios, first call quit(), then return.

If the user presses a key, the event will be sent to the class' `onKeypress(event)` function. If you just want to get user input via the terminal, you can use the `CommandlineInput` class. You can initialise a new object of this class to a variable, and pass the outputShell. You should also have the program's `onKeypress(event)` function forward the keypress to the variable, by in the `onKeypress(event)` calling the variable's `.onKeypress(event)`. Otherwise the prompt wont be able to receive key presses.

When you actually want to prompt the user, you can use the variable's `.prompt(question: string, multiline: boolean)` function. You can await this function, to retrieve the result (note that the calling function should be async). Example:

```js
class ProgramSource extends Program {
  onKeypress(event) {
    this.prompt.onKeypress(event);
  }
  async load(args) {
    this.prompt = new CommandlineInput(this.outputShell);

    var name = await this.prompt.prompt("What is your name?: ", false);
    var age = await this.prompt.prompt("How old are you: ", false);

    this.outputShell.println(`Howdy ${name}, aged ${age}`);

    this.quit();
  }
}
```

Note that the load function is async, to allow awaiting the prompt. Also note the onKeypress, forwarding the key events to the prompt.

## Running / installing the program

After the code is written, you can get the program to the website in two ways.

### Option A (temporary):

To temporarily write the program to a file, you can `echo` the program in the terminal, and pipe the output to a file. You can then enter the path to the file to run it.

Example: `echo class ProgramSource extends Program {load(args) {this.outputShell.println("hi world!");this.quit();}}>my_program.soup`

### Option B (permanent install):

If you download the source, you will find the soy_filesystem folder. This folder contains the base file system. Any file or directory created will exist when running soysoup, as long as you run `filesystem_bundler.py` (in the project root), to compile the filesystem to be included.

You can write your programs in the soy_filesystem, with either the .soup extension, or .js, which gets converted to .soup when the filesystem is compiled.
