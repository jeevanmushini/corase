import os

directory = "corase/src"
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(".tsx"):
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()

            new_content = ""
            changed = False
            for line in content.split("\n"):
                if "<h1" in line or "motion.h1" in line:
                    if "text-foreground" in line:
                        line = line.replace("text-foreground", "text-brand-red")
                        changed = True
                    elif "text-white" in line:
                        line = line.replace("text-white", "text-brand-red")
                        changed = True
                    elif "className=\"" in line and "text-brand-red" not in line:
                        line = line.replace('className="', 'className="text-brand-red ')
                        changed = True
                new_content += line + "\n"
            
            if new_content.endswith("\n") and not content.endswith("\n"):
                new_content = new_content[:-1]
                
            if changed:
                with open(path, "w") as f:
                    f.write(new_content)
                print(f"Updated H1 in {path}")

print("Done")
