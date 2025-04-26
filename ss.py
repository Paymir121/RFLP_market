import os

def print_tree(path, prefix=""):
    pointers = ['├── ', '└── ']
    contents = [f for f in os.listdir(path) if not f.startswith('__pycache__')]
    contents = sorted(contents)
    for idx, item in enumerate(contents):
        pointer = pointers[0] if idx < len(contents) - 1 else pointers[1]
        item_path = os.path.join(path, item)
        print(prefix + pointer + item, end="")
        if os.path.isdir(item_path):
            print("/")
            new_prefix = prefix + ("│   " if idx < len(contents) -1 else "    ")
            print_tree(item_path, new_prefix)
        else:
            print("")

print_tree("backend")