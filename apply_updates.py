import os
import re

# SEO Configuration
SEO_DATA = {
    'index.html': {
        'title': 'Tandoor Indian Restaurant | Authentic Cuisine in Hayward',
        'desc': 'Experience the best Indian food in Hayward, CA. Tandoor Indian Restaurant offers authentic curries, tandoori dishes, and catering services. Order online now!',
        'schema_type': 'Restaurant'
    },
    'menu.html': {
        'title': 'Our Menu | Tandoor Indian Restaurant Hayward',
        'desc': 'Explore our diverse menu featuring Chicken Tikka Masala, Lamb Vindaloo, Fresh Naan, and specialized Vegetarian & Vegan Indian dishes.',
        'schema_type': 'Menu'
    },
    'catering.html': {
        'title': 'Catering Services | Tandoor Indian Restaurant',
        'desc': 'Planning an event? Tandoor Indian Restaurant provides exceptional catering for weddings, corporate events, and parties in the Bay Area.',
        'schema_type': 'Service'
    },
    'about.html': {
        'title': 'About Us | Tandoor Indian Restaurant Story',
        'desc': 'Since 1998, Tandoor Indian Restaurant has served authentic flavors crafted with passion and tradition in Hayward, California.',
        'schema_type': 'AboutPage'
    },
    'contact.html': {
        'title': 'Contact Us | Tandoor Indian Restaurant',
        'desc': 'Visit us at 27167 Mission Blvd, Hayward. Call for reservations or inquiries. Open daily for Lunch and Dinner.',
        'schema_type': 'ContactPage'
    }
}

GA_CODE = """
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>
"""

SCHEMA_TEMPLATE = """
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "%s",
      "name": "Tandoor Indian Restaurant",
      "image": "https://tandoorhayward.com/assets/tandoor-india-logo.webp",
      "@id": "",
      "url": "https://tandoorhayward.com",
      "telephone": "(510) 555-0123",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "27167 Mission Blvd",
        "addressLocality": "Hayward",
        "addressRegion": "CA",
        "postalCode": "94544",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 37.6400,
        "longitude": -122.0600
      },
      "priceRange": "$$"
    }
    </script>
"""

def update_files():
    files = [f for f in os.listdir('.') if f.endswith('.html')]
    
    for file in files:
        if file not in SEO_DATA: continue
        
        print(f"Processing {file}...")
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Inject GA (if not present)
        if 'Google Analytics' not in content:
            content = content.replace('</head>', f'{GA_CODE}\n</head>')

        # 2. Inject Ordering Script (if not present)
        if 'js/ordering.js' not in content:
            content = content.replace('</body>', '<script src="js/ordering.js"></script>\n</body>')

        # 3. Update Meta Tags (Simple string replacement for now, assumes standard structure)
        # Replacing Title
        if '<title>' in content:
            content = re.sub(r'<title>.*?</title>', f'<title>{SEO_DATA[file]["title"]}</title>', content)
        
        # Adding/Updating Description
        meta_desc = f'<meta name="description" content="{SEO_DATA[file]["desc"]}">'
        if '<meta name="description"' in content:
            content = re.sub(r'<meta name="description" content="[^"]*">', meta_desc, content)
        else:
            content = content.replace('<head>', f'<head>\n    {meta_desc}')

        # 4. Inject Schema
        if 'application/ld+json' not in content:
            schema_json = SCHEMA_TEMPLATE % (SEO_DATA[file].get('schema_type', 'WebPage'))
            content = content.replace('</head>', f'{schema_json}\n</head>')

        # 5. Link Updates (Smart Replacement)
        # Replace href="#" or href="#order" with javascript trigger
        # CAUTION: Do not touch menu.html links
        
        # Regex to find generic "Order" buttons that are placeholders
        # Looking for href="#" or href="#order" and adding class js-order-trigger
        
        def replace_link(match):
            full_tag = match.group(0)
            if 'menu.html' in full_tag or 'catering.html' in full_tag or 'index.html' in full_tag:
                return full_tag # Skip navigation links
            
            if 'href="#"' in full_tag or 'href="#order"' in full_tag:
                if 'class="' in full_tag:
                    return full_tag.replace('class="', 'class="js-order-trigger ')
                else:
                    return full_tag.replace('<a ', '<a class="js-order-trigger" ')
            return full_tag

        # Find all <a> tags
        content = re.sub(r'<a [^>]+>', replace_link, content)

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == "__main__":
    update_files()
