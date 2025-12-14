
import re

file_path = 'catering.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1. Extract Form Section (from approx 1608 to script end around 1700)
# Look for <div class="catering-form-container"
form_start_idx = -1
for i, line in enumerate(lines):
    if 'class="catering-form-container"' in line:
        form_start_idx = i
        break

if form_start_idx == -1:
    print("Could not find form start!")
    exit(1)

# Look for end of script after form
# The form has a <script> block after it. 
# Let's find the closing </section> of the catering-wrapper? 
# Or just grab until we see the "CSS" again which started around 1780.
# Actually, let's look for the </script> for the form handling.
form_end_idx = -1
script_count = 0
for i in range(form_start_idx, len(lines)):
    if '<script' in lines[i]:
        script_count += 1
    if '</script>' in lines[i]:
        # There is a script right after the form
        form_end_idx = i
        break

if form_end_idx == -1:
    print("Could not find form script end!")
    # Fallback: just grab 150 lines?
    form_end_idx = form_start_idx + 200

# We want the containing section too?
# Step 470 showed: <section class="catering-wrapper"> at 1601.
# The form container is at 1608.
# So let's grab from <section class="catering-wrapper"> (search backwards from form_start)
section_start_idx = -1
for i in range(form_start_idx, 0, -1):
    if '<section class="catering-wrapper">' in lines[i]:
        section_start_idx = i
        break

if section_start_idx != -1:
    form_start_idx = section_start_idx

# Verify end: The section closes after the script?
# Step 482 does not show </section> after script.
# It shows 1660: </section> BEFORE the script? 
# Step 482 line 1659 is </section>.
# Line 1662 is <script>.
# So the script is outside the section?
# If so, we should grab the script too.

form_content = lines[form_start_idx : form_end_idx + 1]


# 2. Extract Body Content (starts at 3301 <header class="header">, but <body> starts 3296)
# Ideally we want lines 3296 onwards.
body_start_idx = -1
for i in range(3000, len(lines)): # Search in the lower half
    if '<body' in lines[i]:
        body_start_idx = i
        break

if body_start_idx == -1:
    print("Could not find body start!")
    exit(1)

body_content = lines[body_start_idx:]

# 3. Find insertion point in body (Before Footer)
# footer starts with <footer class="footer"
footer_idx = -1
for i, line in enumerate(body_content):
    if '<footer' in line:
        footer_idx = i
        break

if footer_idx == -1:
    # Try finding the 'Ready to Plan' or just append at end?
    print("Could not find footer in body content!")
    footer_idx = len(body_content) - 1 # Insert at end?

# Insert Form Content
final_body = body_content[:footer_idx] + ["\n<!-- Inserted Form -->\n"] + form_content + ["\n"] + body_content[footer_idx:]

# 4. Reconstruct File
# Head: standard structure
head_content = [
    '<!DOCTYPE html>\n',
    '<html lang="en">\n',
    '<head>\n',
    '    <meta charset="UTF-8">\n',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n',
    '    <title>Catering | Tandoor Indian Restaurant</title>\n',  # Should extract title?
    '    <meta name="description" content="Tandoor Indian Restaurant Catering Services">\n',
    '    <link rel="icon" type="image/png" href="./assets/tandoor-india-logo.webp">\n',
    '    <link rel="stylesheet" href="css/main.css">\n',
    '    <link rel="stylesheet" href="css/catering.css">\n',
    '    <!-- Google Fonts & Libraries -->\n',
    '    <link rel="preconnect" href="https://fonts.googleapis.com">\n',
    '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n',
    '    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Inter:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">\n',
    '    <script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>\n',
    '    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>\n',
    '    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>\n',
    '    <!-- Schemas -->\n'
]

# Extract Schema/Analytics from the original file (lines 3258-3294 approx)
# Search for Google Analytics in lines 3000-3300
schema_block = []
in_schema = False
for i in range(3000, body_start_idx):
    if '<!-- Google Analytics -->' in lines[i] or '<script async src="https://www.googletagmanager' in lines[i]:
        in_schema = True
    if in_schema:
        schema_block.append(lines[i])

if not schema_block:
    # Use generic placeholder if not found
    schema_block = [
        '    <!-- Google Analytics -->\n',
        '    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>\n',
        '    <script>\n',
        '      window.dataLayer = window.dataLayer || [];\n',
        '      function gtag(){dataLayer.push(arguments);}\n',
        '      gtag("js", new Date());\n',
        '      gtag("config", "G-XXXXXXXXXX");\n',
        '    </script>\n'
    ]
else:
    # Ensure we close head
    pass

head_content.extend(schema_block)
head_content.append('</head>\n')


# Write Content
with open('catering.html', 'w', encoding='utf-8') as f:
    f.writelines(head_content)
    f.writelines(final_body)

print("Successfully reconstructed catering.html")
