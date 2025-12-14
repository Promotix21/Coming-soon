import os
import zipfile

OUTPUT_ZIP = "tandoor-hayward-deploy.zip"
EXCLUDE_DIRS = {'.git', 'node_modules', 'backup_images', '.vercel', 'crm'} # Exclude CRM if it's separate or if user wants only the main site?
# User mentioned "website", likely includes everything needed for the site.
# 'crm' folder was there. Check if it's needed? 
# "crm/api/submit_inquiry.html" was the old path.
# I will include 'crm' just in case, but usually we want to be selective. 
# However, for a full deployment, usually we include everything in the root unless ignored.
# I will exclude 'backup_images' as it's large and not needed for prod.
# I will exclude '.git'.

# Let's verify 'crm' content briefly before deciding.
# Actually safer to include everything except known garbage.

def create_zip():
    print(f"Creating {OUTPUT_ZIP}...")
    
    with zipfile.ZipFile(OUTPUT_ZIP, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            
            for file in files:
                if file == OUTPUT_ZIP:
                    continue
                if file.endswith('.zip') or file.endswith('.py'): # Exclude scripts and zips
                    continue
                
                file_path = os.path.join(root, file)
                # Archive name should be relative to root
                arcname = os.path.relpath(file_path, '.')
                zipf.write(file_path, arcname)
                
    print(f"Successfully created {OUTPUT_ZIP}")

if __name__ == "__main__":
    create_zip()
