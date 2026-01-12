
import json
import re
import sys

def normalize_text(text):
    """Normalize text for better matching."""
    return re.sub(r'\s+', ' ', text).strip().lower()

def load_new_descriptions(checkfile_path):
    """Load new descriptions from checkfile."""
    with open(checkfile_path, 'r', encoding='utf-8') as f:
        content = f.read()
        # Fix potential trailing commas which are invalid in JSON
        content = re.sub(r',\s*([}\]])', r'\1', content)
        try:
            data = json.loads(content)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            sys.exit(1)
            
    items_map = {}
    
    if "restaurant_menu" in data:
        menu_data = data["restaurant_menu"]
        for category, items in menu_data.items():
            for item in items:
                name = item.get("item")
                desc = item.get("description")
                if name and desc:
                    items_map[normalize_text(name)] = desc
    
    # Manual mappings for mismatched names (HTML Name -> Checkfile Name)
    manual_mappings = {
        "samosa chaana": "samosa chana",
        "vegetable pakora (1lb)": "pakora (gobhi, aloo, paneer, mix veg, chilli) 1lb",
        "paneer pakora (1lb)": "paneer pakora 1lb",
        "chili paneer": "chilli paneer",
        "lamb rogan josh": "rogan josh",
        "channa masala": "chana masala",
        "mixed vegetable curry": "mix veg",
        "plain basmati rice": "basmati rice",
        "naan": "plain naan",
        "puri": "poori (2)",
        "paratha": "plain paratha",
        "gobhi paratha": "paratha (aloo, gobhi, mooli)",
        "aloo paratha": "paratha (aloo, gobhi, mooli)",
        "paratha (mooli)": "paratha (aloo, gobhi, mooli)",
        "salted lassi": "lassi (sweet or salted)",
        "sweet lassi": "lassi (sweet or salted)",
        "gulab jamun": "gulab jamun (2)"
    }

    # Apply manual mappings
    for html_name, checkfile_name in manual_mappings.items():
        if checkfile_name in items_map:
            items_map[html_name] = items_map[checkfile_name]

    return items_map

def update_html(html_path, items_map):
    """Update HTML file with new descriptions using regex."""
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    updated_count = 0
    not_found_count = 0
    
    def replace_desc(match):
        nonlocal updated_count, not_found_count
        full_match = match.group(0)
        name_group = match.group(1)
        # item-desc group is group 2 inside the lookahead or match
        
        # Extract the name from the h3 tag
        # The regex below will capture:
        # Group 1: The item name
        # Group 2: The stuff between name and desc
        # Group 3: The existing description
        
        name_clean = re.sub(r'\s+', ' ', name_group).strip()
        normalized_name = normalize_text(name_clean)
        
        new_desc = items_map.get(normalized_name)
        
        if new_desc:
            updated_count += 1
            print(f"Updating '{name_clean}'")
            # Return the replacement string
            # We reconstruct the part: match.group(0) is everything from <h3... to ...</p>
            # We want to replace group 3 with new_desc
            return f'{match.group(1)}{match.group(2)}{new_desc}'
        else:
            # Try to report what wasn't found
            # print(f"No match for '{name_clean}'") # Verbose
            not_found_count += 1
            return full_match # No change

    # Regex logic:
    # Find <h3 class="item-name"> (Capture Name) </h3>
    # (Capture anything in between, lazy)
    # <p class="item-desc"> (Capture Description) </p>
    
    # We use a pattern that captures the name, the middle part, and the description text.
    pattern = re.compile(
        r'(<h3\s+class="item-name">([^<]+)</h3>)'  # Group 1: Full H3, Group 2: Name text
        r'([\s\S]*?)'                               # Group 3: Content between H3 and P
        r'(<p\s+class="item-desc">)([^<]*)(</p>)',  # Group 4: Opening P, Group 5: Desc text, Group 6: Closing P
        re.IGNORECASE | re.MULTILINE
    )
    
    # Re-writing the replace logic because group numbering changed
    def replacement_func(match):
        nonlocal updated_count, not_found_count
        
        full_h3 = match.group(1)
        name_text = match.group(2)
        middle_part = match.group(3)
        opening_p = match.group(4)
        old_desc = match.group(5)
        closing_p = match.group(6)
        
        normalized_name = normalize_text(name_text)
        new_desc = items_map.get(normalized_name)
        
        if new_desc:
            updated_count += 1
            print(f"Updated '{name_text.strip()}'")
            return f'{full_h3}{middle_part}{opening_p}{new_desc}{closing_p}'
        else:
            not_found_count += 1
            print(f"Skipping '{name_text.strip()}' (not in checkfile)")
            return match.group(0)

    new_content = pattern.sub(replacement_func, html_content)

    print(f"\nTotal items updated: {updated_count}")
    print(f"Total items skipped: {not_found_count}")

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

if __name__ == "__main__":
    checkfile_path = "checkfile .md"
    menu_html_path = "menu.html"
    
    print("Loading new descriptions...")
    new_descriptions = load_new_descriptions(checkfile_path)
    print(f"Loaded {len(new_descriptions)} items from checkfile.")
    
    print("Updating menu.html...")
    update_html(menu_html_path, new_descriptions)
