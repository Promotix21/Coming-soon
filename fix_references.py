import os

BACKUP_DIR = 'backup_images'
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}

def fix_references():
    print("Scanning backup images to fix HTML references...")
    
    mapping = []
    
    if not os.path.exists(BACKUP_DIR):
        print("Backup directory not found!")
        return

    # Build mapping from backup files
    for root, _, files in os.walk(BACKUP_DIR):
        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in IMAGE_EXTENSIONS:
                file_name_no_ext = os.path.splitext(file)[0]
                new_file_name = file_name_no_ext + ".webp"
                mapping.append((file, new_file_name))
    
    print(f"Found {len(mapping)} images in backup.")
    
    # Update HTML files
    html_files = []
    for root, _, files in os.walk('.'):
        if BACKUP_DIR in root:
            continue
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    count_files = 0
    total_replacements = 0
    
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            file_replacements = 0
            
            for old_name, new_name in mapping:
                if old_name in new_content:
                    new_content = new_content.replace(old_name, new_name)
                    file_replacements += 1
            
            if new_content != content:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {html_file} ({file_replacements} replacements)")
                count_files += 1
                total_replacements += file_replacements
                
        except Exception as e:
            print(f"Error updating {html_file}: {e}")

    print(f"Fixed references in {count_files} HTML files. Total replacements: {total_replacements}")

if __name__ == "__main__":
    fix_references()
