illegal_file_characters = ["\n", ":", "<", ">", '"', "|", "?", "*", "\\"];
illegal_dir_characters = ["\n", ":", "<", ">", '"', "|", "?", "*", "\\", "."];

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
      illegal_file_characters.some((v) => path.includes(v)) ||
      !fileName.includes(".")
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

  readFile(path) {
    const segments = this.getPathSegments(path);
    const fileName = segments.pop();
    const directory = this.traverse(segments);

    if (
      !directory ||
      !directory.content[fileName] ||
      directory.content[fileName].type !== "file" ||
      illegal_file_characters.some((v) => path.includes(v))
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

    return parentDirectory !== null && parentDirectory.type === "directory";
  }

  writeFile(path, content) {
    const segments = this.getPathSegments(path);
    const fileName = segments.pop();
    const directory = this.traverse(segments);

    if (
      !directory ||
      !directory.content[fileName] ||
      directory.content[fileName].type !== "file" ||
      illegal_file_characters.some((v) => path.includes(v))
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
  rename(oldPath, newName) {
    const segments = this.getPathSegments(oldPath);
    const oldName = segments.pop();
    const directory = this.traverse(segments);

    if (
      !directory ||
      !directory.content[oldName] ||
      illegal_file_characters.some((v) => path.includes(v))
    ) {
      console.error("File or directory not found or invalid path.");
      return;
    }

    const isDirectory = directory.content[oldName].type === "directory";
    if (isDirectory && illegal_dir_characters.some((v) => path.includes(v))) {
      console.error("Invalid directory name");
      return;
    } else if (!isDirectory && !newName.includes(".")) {
      console.error("Missing file extension");
      return;
    }

    if (directory.content[newName]) {
      console.error("A file or directory with the new name already exists.");
      return;
    }

    directory.content[newName] = directory.content[oldName];
    delete directory.content[oldName];

    if (isDirectory) {
      const parentPath = this.getParentDirectory(oldPath);
      const parentSegments = this.getPathSegments(parentPath);
      const parentDirectory = this.traverse(parentSegments);

      if (parentDirectory) {
        parentDirectory.content[newName] = directory.content[newName];
        delete parentDirectory.content[oldName];
      }
    }
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
