fileSystem = new SoyFileSystem();

systemFiles =
  '{"type":"directory","content":{"soysoup":{"type":"directory","content":{"files.soy":{"type":"file","content":"files"},"test app.soy":{"type":"file","content":"test app"}}},"home":{"type":"directory","content":{"downloads":{"type":"directory","content":{}},"documents":{"type":"directory","content":{}},"programs":{"type":"directory","content":{}}}}}}';

fileSystem.loadFromString(systemFiles);

class Program {
  load() {}
  update() {}
}

class Window {
  test() {
    console.log("testo");
  }
}

function hi() {
  console.log(2 + 2 + 2);
}

var programs = [];

function executeFile(path) {
  eval(fileSystem.readFile(path) + "\nprograms.unshift(new Program)");
  programs[0].load();
}
