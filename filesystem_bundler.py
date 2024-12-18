import os, json

def create_file_dict(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    return {"type": "file", "content": content}

def create_directory_dict(directory_path):
    directory_dict = {"type": "directory", "content": {}}
    for entry in os.listdir(directory_path):
        entry_path = os.path.join(directory_path, entry)
        if os.path.isfile(entry_path):
            directory_dict["content"][entry] = create_file_dict(entry_path)
        elif os.path.isdir(entry_path):
            directory_dict["content"][entry] = create_directory_dict(entry_path)
    return directory_dict

folder_path = "soy_filesystem"
soy_file_system_dict = create_directory_dict(folder_path)

result = repr(json.dumps(soy_file_system_dict))

with open("programs.js","w",encoding="utf-8") as f:
    f.write(f"systemFiles = {result}")