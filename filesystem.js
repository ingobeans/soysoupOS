let illegal_file_characters = ["\n", ":", "<", ">", '"', "|", "?", "*", "\\"];
let illegal_dir_characters = ["\n", ":", "<", ">", '"', "|", "?", "*", "\\", "."];

class SoyFileSystem {
  constructor() {
    this.root = {
      type: "directory",
      content: {},
    };
  }
  resolveBackSteps(path) {
    const segments = this.getPathSegments(path);
    const resolvedSegments = [];

    for (const segment of segments) {
      if (segment === "..") {
        if (resolvedSegments.length > 0) {
          resolvedSegments.pop(); // Move up one directory
        }
      } else if (segment !== ".") {
        // Ignore current directory references
        resolvedSegments.push(segment);
      }
    }

    return this.normalizePath(resolvedSegments.join("/"));
  }
  normalizePath(path) {
    return this.getPathSegments(path.trim()).join("/") + "/";
  }

  createFile(path, content) {
    const segments = this.getPathSegments(path);
    const fileName = segments.pop();
    const directory = this.traverse(segments);

    if (
      !directory ||
      directory.content[fileName] ||
      !path ||
      !this.isValidFileName(fileName)
    ) {
      console.error("File already exists or invalid path.");
      return;
    }

    directory.content[fileName] = {
      type: "file",
      content: content,
    };
  }
  pathExists(path) {
    const segments = this.getPathSegments(path);
    if (segments.length == 0) {
      return true; // to ensure root is flagged as valid path
    }
    const fileName = segments.pop();
    const directory = this.traverse(segments);

    if (
      !directory ||
      !directory.content[fileName] ||
      illegal_file_characters.some((v) => path.includes(v))
    ) {
      return false;
    }

    return true;
  }

  createDirectory(path) {
    const segments = this.getPathSegments(path);
    const directoryName = segments.pop();
    const directory = this.traverse(segments);

    if (
      !directory ||
      directory.content[directoryName] ||
      illegal_dir_characters.some((v) => path.includes(v))
    ) {
      console.error("Directory already exists or invalid path.");
      return;
    }

    directory.content[directoryName] = {
      type: "directory",
      content: {},
    };
  }
  deletePath(path) {
    const segments = this.getPathSegments(path);
    if (segments.length == 0) {
      this.root.content = {};
    }
    const fileName = segments.pop();
    const parentPath = this.getParentDirectory(path);
    const parentSegments = this.getPathSegments(parentPath);
    const parentDirectory = this.traverse(parentSegments);

    if (!parentDirectory || !parentDirectory.content[fileName]) {
      console.error("File or directory not found or invalid path.");
      return;
    }

    delete parentDirectory.content[fileName];
  }
  isValidFileName(filename) {
    return (
      !illegal_file_characters.some((v) => filename.includes(v)) &&
      /\..+/.test(filename)
    );
  }
  isValidFilePath(path) {
    const segments = this.getPathSegments(path);
    const fileName = segments.pop();
    const directory = this.traverse(segments);

    if (
      !directory ||
      (directory.content[fileName] &&
        directory.content[fileName].type === "directory") ||
      !this.isValidFileName(fileName)
    ) {
      return false;
    }
    return true;
  }
  readFile(path) {
    const segments = this.getPathSegments(path);
    const fileName = segments.pop();
    const directory = this.traverse(segments);

    if (
      !directory ||
      !directory.content[fileName] ||
      directory.content[fileName].type !== "file"
    ) {
      console.error("File not found or invalid path.");
      return null;
    }

    return directory.content[fileName].content;
  }
  isValidParentDirectory(path) {
    const parentPath = this.getParentDirectory(path);
    const segments = this.getPathSegments(parentPath);
    const parentDirectory = this.traverse(segments);

    return (
      parentDirectory !== null &&
      parentDirectory !== undefined &&
      parentDirectory.type === "directory"
    );
  }
  traverse(segments) {
    let current = this.root;

    for (const segment of segments) {
      if (current.type !== "directory" || !current.content[segment]) {
        return null;
      }

      current = current.content[segment];
    }

    return current;
  }
  writeFile(path, content) {
    const segments = this.getPathSegments(path);
    const fileName = segments.pop();
    const directory = this.traverse(segments);

    if (
      !directory ||
      !directory.content[fileName] ||
      directory.content[fileName].type !== "file"
    ) {
      console.error("File not found or invalid path.");
      return;
    }

    directory.content[fileName].content = content;
  }

  readDirectory(path) {
    const segments = this.getPathSegments(path);
    const directory = this.traverse(segments);

    if (
      !directory ||
      directory.type !== "directory" ||
      illegal_dir_characters.some((v) => path.includes(v))
    ) {
      console.error("Directory not found or invalid path.");
      return null;
    }

    return Object.keys(directory.content);
  }
  isFile(path) {
    const segments = this.getPathSegments(path);
    const fileName = segments.pop();
    const directory = this.traverse(segments);

    return (
      directory &&
      directory.content[fileName] &&
      directory.content[fileName].type === "file"
    );
  }
  getParentDirectory(path) {
    const segments = this.getPathSegments(path);

    if (
      segments.length === 0 ||
      (segments.length === 1 && segments[0] === "")
    ) {
      return path;
    }

    segments.pop();
    var newPath = "/" + segments.join("/") + "/";
    if (newPath == "//") {
      newPath = "/";
    }
    return newPath;
  }
  moveFile(sourcePath, destinationPath) {
    const sourceSegments = this.getPathSegments(sourcePath);
    const sourceFileName = sourceSegments.pop();
    const sourceDirectory = this.traverse(sourceSegments);

    if (
      !sourceDirectory ||
      !sourceDirectory.content[sourceFileName] ||
      sourceDirectory.content[sourceFileName].type !== "file"
    ) {
      console.error("Source file not found or invalid path.");
      return;
    }

    const destSegments = this.getPathSegments(destinationPath);
    const destFileName = destSegments.pop();
    const destDirectory = this.traverse(destSegments);

    if (
      !destDirectory ||
      destDirectory.content[destFileName] ||
      !this.isValidFileName(destFileName)
    ) {
      console.error("Destination path is invalid or file already exists.");
      return;
    }

    destDirectory.content[destFileName] =
      sourceDirectory.content[sourceFileName];

    delete sourceDirectory.content[sourceFileName];
  }

  getPathSegments(path) {
    return path.split("/").filter((segment) => segment !== "");
  }
  exportToString() {
    return JSON.stringify(this.root);
  }

  loadFromString(data) {
    try {
      this.root = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
    }
  }
}
