
import os

files = ['index.html', 'menu.html', 'about.html', 'contact.html', 'catering.html']

for file_path in files:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    new_lines = []
    for line in lines:
        # Remove Reserve Table lines
        if '#reserve' in line:
            continue
            
        # Remove Gallery lines
        if '>Gallery<' in line or 'href="#gallery"' in line:
            continue
            
        # Fix order.html -> menu.html
        if 'href="order.html"' in line:
            line = line.replace('href="order.html"', 'href="menu.html"')
            
        # Fix index.html#about -> about.html
        if 'href="index.html#about"' in line:
            line = line.replace('href="index.html#about"', 'href="about.html"')
            
        new_lines.append(line)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

print("Link cleanup complete.")
