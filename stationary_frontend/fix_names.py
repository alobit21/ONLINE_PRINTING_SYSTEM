import os
import glob

# Rename files
rename_map = {
    'Button.tsx': 'LegacyButton.tsx',
    'Card.tsx': 'LegacyCard.tsx',
    'Skeleton.tsx': 'LegacySkeleton.tsx',
    'Input.tsx': 'LegacyInput.tsx',
    'Select.tsx': 'LegacySelect.tsx'
}

for old_name, new_name in rename_map.items():
    old_path = f"src/components/ui/{old_name}"
    new_path = f"src/components/ui/{new_name}"
    if os.path.exists(old_path):
        os.rename(old_path, new_path)

# Update imports
def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content.replace('ui/Button', 'ui/LegacyButton')
    new_content = new_content.replace('ui/Card', 'ui/LegacyCard')
    new_content = new_content.replace('ui/Skeleton', 'ui/LegacySkeleton')
    new_content = new_content.replace('ui/Input', 'ui/LegacyInput')
    new_content = new_content.replace('ui/Select', 'ui/LegacySelect')

    new_content = new_content.replace("'./Button'", "'./LegacyButton'")
    new_content = new_content.replace('"/Button"', '"/LegacyButton"')
    new_content = new_content.replace("'./Card'", "'./LegacyCard'")
    new_content = new_content.replace("'./Skeleton'", "'./LegacySkeleton'")
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            update_file(os.path.join(root, file))

