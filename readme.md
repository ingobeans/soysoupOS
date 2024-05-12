# soysoupOS

soysoupOS is widely regarded by me as the operating system of the future. It is terminal based.

The system is based around executable '.soup' files. All commands runnable by the terminal is in fact, executable files. The terminal itself, is also an executable file.

## Making a program for soysoupOS

Programs are executable files, identified by the .soup file extension. Inside the file, you will find javascript code. The file should contain a class, called ProgramSource, which should extend from Program.

When the program is launched, the class' `load(args: string)` function will be called. Args is the arguments the program was launched with, in string format.

When the program is launched, it will also have 2 properties asigned, these being `outputShell`, and `filepath`. OutputShell is an object of class shell. Some basic use for the shell is to print. To do this, you can call either `this.outputShell.print(text: string, flush: boolean = true)` or `this.outputShell.println(text: string, flush: boolean = true)`. For more advanced control of the shell, the `this.outputShell.text` property along with the `this.outputShell.flush()` can be utilised.

```js
class ProgramSource extends Program {
  async load(args) {
    this.outputShell.println("hi world!");

    this.quit();
  }
}
```

The `this.quit()` calling is important, as it will 'close' the program and pass control back to the terminal. It **won't** break code execution, so don't use it instead of return, in those scenarios, first call quit(), then return.

If the user presses a key, the event will be sent to the class' `onKeypress(event)` function. If you just want to get user input via the terminal, you can use the `CommandlineInput` class. You can initialise a new object of this class to a variable, and pass the outputShell. You should also have the program's `onKeypress(event)` function forward the keypress to the variable, by in the `onKeypress(event)` calling the variable's `.onKeypress(event)`. Otherwise the prompt wont be able to receive key presses.

When you actually want to prompt the user, you can use the variable's `.prompt(question: string, multiline: number)` function. You can await this function, to retrieve the result (note that the calling function should be async). Example:

```js
class ProgramSource extends Program {
  onKeypress(event) {
    this.prompt.onKeypress(event);
  }
  async load(args) {
    this.prompt = new CommandlineInput(this.outputShell);

    var name = await this.prompt.prompt("What is your name?: ", false);
    var age = await this.prompt.prompt("How old are you: ", false);

    this.outputShell.println("Howdy, " + name + ", aged " + age);

    this.quit();
  }
}
```

Note that the load function is async, to allow awaiting the prompt. Also note the onKeypress, forwarding the key events to the prompt.

A tip if stuck is to read the contents of the executables in the soysoup (system) folder.

## Running / installing the program

After the code is written, you can get the program to the website in two ways.

### Option A (temporary):

To temporarily have the program as a file, you can `echo` the program in the terminal, and pipe the output to a file. You can then enter the path to the file to run it. **Do note:** if the program is placed in the soysoup directory, it can be ran by simply typing the name of the file (without the extension). This is equivalent to having an exe in path, in windows.
Example: `echo class ProgramSource extends Program {load(args) {this.outputShell.println("hi world!");this.quit();}}>my_program.soup`

### Option B (permanent install):

If you download the source, you will find the soy_filesystem folder. This folder contains the base file system. By creating a .soup (or .js file, they get converted automatically) there you can have it included by default. After making changes, run the filesystem_bundler.py (in the project root), to compile the filesystem to be included.
