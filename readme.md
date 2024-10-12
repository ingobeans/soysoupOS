# soysoupOS
![image](https://github.com/user-attachments/assets/05a70bb9-92f2-4045-8c74-f6cc2d05c1e0)
soysoupOS is widely regarded by me as the operating system of the future.

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

The load method is called when the program first is launched, it receives the `args` argument which contains the launch parameters as a string. When the program is launched, it has the properties of `outputShell`, `cwd` and `filePath` assigned. The outputShell can be used to write to the terminal, as we do in this example.

Finally, we call `this.quit()`. This will 'close' the program and pass control back to the terminal. It **won't** break code execution, so don't use it instead of return, in those scenarios, first call `quit()`, then return.

If we want to create a program which gets input from the user, we can use a `CommandLineInput`, which is a tool that allows basic prompting of the user.

```js
class ProgramSource extends Program {
  async load(args) {
    this.myPrompt = new CommandlineInput(this.outputShell);

    var name = await this.myPrompt.prompt("What is your name?: ", false);
    var age = await this.myPrompt.prompt("How old are you: ", false);

    this.outputShell.println(`Howdy ${name}, aged ${age}`);

    this.quit();
  }
  onKeypress(event) {
    this.myPrompt.onKeypress(event);
  }
}
```

First of all, the `load` method is async, this is so we can await the prompt to finish.
Secondly we define `this.myPrompt` of `CommandLineInput`. It requires the shell, so we pass it the `outputShell`.
We then prompt the user two questions, with the `prompt` method of `myPrompt`. It requires parameters `question`, and `allowMultiline`.
Then we just print the results and quit the program.

Though, for the prompt to work, we need to pass it keypress events. When a key is pressed, the event is sent to the currently running program's `onKeypress` method. In this method we need to forward the event to the prompt, for it to register, which is exactly what we do in the example.

## Running / installing the program

After the code is written, you can get the program to the website in two ways.

### Option A:

To temporarily write the program to a file, you can use `edit [filename]` in the terminal. You can then enter the path to the file to run it.

### Option B (bundled install):

If you want to include a program in the default filesystem, this is the right option.
Download the source and navigate to the soy_filesystem folder. This folder contains the base file system. Any file or directory created will exist in their relative paths when running soysoup, as long as you run `filesystem_bundler.py` (in the project root), to compile the filesystem to be included.

You can write your programs in the soy_filesystem, with either the .soup extension, or .js, which gets converted to .soup when the filesystem is compiled.
