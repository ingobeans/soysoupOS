import os, json

# script to bundle all js files in programs/ to a string that the filesystem can load

base = {"type":"directory","content":{"soysoup":{"type":"directory","content":{}},"home":{"type":"directory","content":{"downloads":{"type":"directory","content":{}},"documents":{"type":"directory","content":{}},"programs":{"type":"directory","content":{}}}}}}

programs = os.listdir("programs")

for program in programs:
    with open(f"programs/{program}","r",encoding="utf-8") as f:
        data = f.read()

    base["content"]["soysoup"]["content"][program.removesuffix(".js") + ".soup"] = {"type":"file","content":data}

result = repr(json.dumps(base))

with open("programs.js","w",encoding="utf-8") as f:
    f.write(f"systemFiles = {result}")