import os
import re

gtm_head = """<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WW7TJ68D');</script>
<!-- End Google Tag Manager -->"""

gtm_body = """<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WW7TJ68D"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->"""

html_files = ["index.html", "dashboard.html", "dsa.html"]

for file in html_files:
    file_path = os.path.join("c:/Users/DELL/getplaced.ai", file)
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove any existing GTM tags to prevent duplicates if script runs twice
    content = re.sub(r'<!-- Google Tag Manager -->.*?<!-- End Google Tag Manager -->\n?', '', content, flags=re.DOTALL)
    content = re.sub(r'<!-- Google Tag Manager \(noscript\) -->.*?<!-- End Google Tag Manager \(noscript\) -->\n?', '', content, flags=re.DOTALL)

    # Insert head snippet just after <head>
    content = re.sub(r'(<head.*?>)', r'\1\n' + gtm_head, content, count=1, flags=re.IGNORECASE)
    
    # Insert body snippet just after <body>
    content = re.sub(r'(<body.*?>)', r'\1\n' + gtm_body, content, count=1, flags=re.IGNORECASE)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("GTM snippets injected into HTML files successfully.")
