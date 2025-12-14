import os
import re

def scan_links():
    print("Scanning for links...")
    html_files = []
    for root, _, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))

    pattern = re.compile(r'href=["\']([^"\']+)["\']')
    
    suspect_links = []
    
    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                matches = pattern.findall(content)
                for link in matches:
                    # Criteria for "interesting" links to check
                    if '.php' in link or link == '#' or 'order' in link.lower() or 'menu' in link.lower() or 'cart' in link.lower():
                        # Filter out valid local links if needed
                        if link in ['menu.html', 'index.html']:
                            continue
                        suspect_links.append((file_path, link))
        except Exception as e:
            print(f"Error reading {file_path}: {e}")

    for f, l in suspect_links:
        print(f"{f}: {l}")

if __name__ == "__main__":
    scan_links()
