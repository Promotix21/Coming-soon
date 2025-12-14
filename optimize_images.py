import os
import shutil
from PIL import Image
import re

TARGET_DIRS = ['assets', 'uploads']
BACKUP_DIR = 'backup_images'
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}

def ensure_backup_dir():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        print(f"Created backup directory: {BACKUP_DIR}")

def get_unique_backup_path(original_path):
    # Maintain relative structure inside backup
    # original_path e.g. 'assets/img/foo.png'
    # backup_path e.g. 'backup_images/assets/img/foo.png'
    
    rel_path = os.path.relpath(original_path, '.')
    # Remove leading dots/slashes if any (though relpath usually handles it)
    if rel_path.startswith('..'):
        # Should not happen given we scan known dirs, but safety first
        rel_path = rel_path.lstrip('.').lstrip('\\').lstrip('/')
        
    backup_path = os.path.join(BACKUP_DIR, rel_path)
    os.makedirs(os.path.dirname(backup_path), exist_ok=True)
    return backup_path

def optimize_images():
    ensure_backup_dir()
    
    converted_files = [] # List of (original_filename, new_filename)
    
    total_original_size = 0
    total_new_size = 0
    count = 0

    print("Starting image optimization...")

    for target_dir in TARGET_DIRS:
        if not os.path.exists(target_dir):
            print(f"Directory not found: {target_dir}")
            continue

        for root, _, files in os.walk(target_dir):
            for file in files:
                ext = os.path.splitext(file)[1]
                if ext in IMAGE_EXTENSIONS:
                    file_path = os.path.join(root, file)
                    original_size = os.path.getsize(file_path)
                    
                    # Construct new filename
                    file_name_no_ext = os.path.splitext(file)[0]
                    new_file_name = file_name_no_ext + ".webp"
                    new_file_path = os.path.join(root, new_file_name)
                    
                    try:
                        # Convert to WebP
                        with Image.open(file_path) as img:
                            # Handle transparency for PNG
                            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                                img = img.convert('RGBA')
                            else:
                                img = img.convert('RGB')
                                
                            img.save(new_file_path, 'WEBP', quality=80)
                        
                        new_size = os.path.getsize(new_file_path)
                        total_original_size += original_size
                        total_new_size += new_size
                        
                        print(f"Converted: {file} ({original_size/1024:.1f}KB) -> {new_file_name} ({new_size/1024:.1f}KB)")
                        
                        # Move original to backup
                        backup_path = get_unique_backup_path(file_path)
                        shutil.move(file_path, backup_path)
                        
                        # Store for HTML update
                        # We store just filenames to replace in HTML content
                        converted_files.append((file, new_file_name))
                        count += 1
                        
                    except Exception as e:
                        print(f"Error converting {file_path}: {e}")

    print(f"\nOptimization complete. Processed {count} images.")
    if total_original_size > 0:
        saved = total_original_size - total_new_size
        print(f"Total Size: {total_original_size/1024/1024:.2f}MB -> {total_new_size/1024/1024:.2f}MB")
        print(f"Saved: {saved/1024/1024:.2f}MB ({(saved/total_original_size)*100:.1f}%)")
    
    return converted_files

def update_html_references(converted_files):
    print("\nUpdating HTML references...")
    
    # We will look for all .html files
    html_files = []
    for root, _, files in os.walk('.'):
        # Skip backup dir
        if BACKUP_DIR in root:
            continue
            
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))

    if not converted_files:
        print("No images converted, skipping HTML update.")
        return

    # Create a mapping for faster replacement
    # We replace filename.ext with filename.webp
    # BE CAREFUL: "banner.jpg" might be replaced in "banner.jpg.bak" if we are not careful, but we are scanning HTML only.
    # Also "my_banner.jpg" vs "banner.jpg". Simple string replace "banner.jpg" -> "banner.webp" in "my_banner.jpg" becomes "my_banner.webp", which is CORRECT usually.
    # BUT "small_banner.jpg" -> "small_banner.webp".
    # What if we have "img.jpg" and "big_img.jpg"? replacing "img.jpg" in "big_img.jpg" -> "big_img.webp". Correct.
    # What if we have "banner.jpg" and "banner.png"?
    # If we convert "banner.jpg" -> "banner.webp" and "banner.png" -> "banner.webp", we might have conflict if we just replace strings.
    # BUT the file system prevents two files with same name in same dir (unless we overwrote).
    # Since we move originals, we are fine.
    
    # Sort converted files by length of filename descending to avoid partial matches being replaced first?
    # e.g. Replace "super_image.jpg" before "image.jpg" 
    # to prevent "super_image.jpg" becoming "super_image.webp" via the "image.jpg" rule?
    # Actually, replacing "image.jpg" with "image.webp" inside "super_image.jpg" string gives "super_image.webp". Same result.
    # So order might not matter much for result correctness, but let's be safe.
    
    # However, we must be careful not to double replace if we run script twice (but we move originals, so we won't find them second time).
    
    files_processed = 0
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            changes_count = 0
            
            for old_name, new_name in converted_files:
                # Simple string replacement
                if old_name in new_content:
                    new_content = new_content.replace(old_name, new_name)
                    changes_count += 1
            
            if new_content != content:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {html_file} ({changes_count} replacements)")
                files_processed += 1
                
        except Exception as e:
            print(f"Error updating {html_file}: {e}")

    print(f"Updated {files_processed} HTML files.")

if __name__ == "__main__":
    converted = optimize_images()
    update_html_references(converted)
