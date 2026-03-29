import sys
from pypdf import PdfReader

reader = PdfReader('../frontend/public/resume.pdf')
text = ""
for page in reader.pages:
    text += page.extract_text() + "\n"

with open('result.txt', 'w', encoding='utf-8') as f:
    f.write(text)
