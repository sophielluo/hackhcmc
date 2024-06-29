import os
import requests
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
from ultralytics import YOLO
import matplotlib.pyplot as plt
from collections import Counter
from storage3 import create_client

# Load environment variables from .env file
load_dotenv()

supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')
url = f'{supabase_url}/storage/v1'
headers = {"apiKey": supabase_key, "Authorization": f"Bearer {supabase_key}"}
storage_client = create_client(url, headers, is_async=False)

# YOLO model
model = YOLO("./best-2.pt")

class_names = [
    "Logo_Heineken", "Logo_Larue", "Logo_Tiger", "Logo_Bivina", "Larue_Billboards",
    "Logo_BiaViet", "Larue_BeerBottles", "Logo_Strongbow", "Tiger_Billboards",
    "Tiger_Banners", "Tiger_BeerBottles", "Tiger_BeerKegs", "Biaviet_Banners",
    "Biaviet_BeerBottles", "Logo_Biaviet", "Heineken_BeerBottles", "Biaviet_Billboards",
    "Heineken_Banners", "Heineken_Billboards", "Strongbow_BeerBottles", "Bivina_Banners",
    "Logo_Bivina", "Bivina_BeerBottles", "Bivina_Billboards", "Logo_Edelweiss",
    "Edelweiss_BeerBottles", "Larue_Banners"
]

# Mapping of classes to brands and generalized categories
brand_mapping = {
    "Heineken": {"Logo": ["Logo_Heineken"], "Products": ["Heineken_BeerBottles"], "Promotional_Materials": ["Heineken_Banners", "Heineken_Billboards"]},
    "Larue": {"Logo": ["Logo_Larue"], "Products": ["Larue_BeerBottles"], "Promotional_Materials": ["Larue_Banners", "Larue_Billboards"]},
    "Tiger": {"Logo": ["Logo_Tiger"], "Products": ["Tiger_BeerBottles", "Tiger_BeerKegs"], "Promotional_Materials": ["Tiger_Banners", "Tiger_Billboards"]},
    "BiaViet": {"Logo": ["Logo_BiaViet"], "Products": ["Biaviet_BeerBottles"], "Promotional_Materials": ["Biaviet_Banners", "Biaviet_Billboards"]},
    "Strongbow": {"Logo": ["Logo_Strongbow"], "Products": ["Strongbow_BeerBottles"], "Promotional_Materials": []},
    "Bivina": {"Logo": ["Logo_Bivina"], "Products": ["Bivina_BeerBottles"], "Promotional_Materials": ["Bivina_Banners", "Bivina_Billboards"]},
    "Edelweiss": {"Logo": ["Logo_Edelweiss"], "Products": ["Edelweiss_BeerBottles"], "Promotional_Materials": []}
}

# Pass in is_async=True to create an async client
storage_client = create_client(url, headers, is_async=False)

supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')
bucket = 'images'
headers = {
    'apikey': supabase_key,
    'Authorization': f'Bearer {supabase_key}'
}
response = storage_client.from_(bucket).list()

if not response:
    print('No images found in Supabase bucket')
    raise Exception('No images found in Supabase bucket')

image_list = response
print(f'Image list retrieved: {image_list}')

# Download images from Supabase
images = []
for image_info in image_list:
    image_name = image_info['name']
    
    # Skip placeholder or non-image files
    if image_name == '.emptyFolderPlaceholder' or not image_info['metadata']['mimetype'].startswith('image'):
        print(f'Skipping non-image file: {image_name}')
        continue
    
    image_url = f'{supabase_url}/storage/v1/object/public/{bucket}/{image_name}'
    print(f'Downloading image from {image_url}')
    image_response = requests.get(image_url, headers=headers)
    
    if image_response.status_code == 200:
        image_bytes = BytesIO(image_response.content)
        try:
            img = Image.open(image_bytes).convert('RGB')
            images.append(img)
            print(f'Downloaded image: {image_name}')
        except IOError:
            print(f'Failed to identify image file: {image_name}')
    else:
        print(f'Failed to download image {image_name}')

if not images:
    print('No images were downloaded')
    raise Exception('No images were downloaded')

# Run YOLO model on the images
print(f'Running model on {len(images)} images')
results = model.predict(source=images, save=True)

brand_counts = {brand: Counter() for brand in brand_mapping.keys()}

print(f'Brand counts: {brand_counts}')

for result in results:
    if result.boxes:  # Check if there are any detected boxes
        for box in result.boxes:
            class_id = int(box.cls[0])  # Ensure class_id is an integer
            class_name = class_names[class_id]
            for brand, categories in brand_mapping.items():
                for category, classes in categories.items():
                    if class_name in classes:
                        brand_counts[brand][category] += 1

print(f'Brand counts after model run: {brand_counts}')

# Prepare data for plotting
brands = list(brand_counts.keys())
subcategories = ["Logo", "Products", "Promotional_Materials"]

# Colors for the subcategories
colors = ["#008200", "#66BB6A", "#e9edc9"]

# Plotting the stacked bar plot
fig, ax = plt.subplots(figsize=(12, 8))

bottom = [0] * len(brands)

for i, subcategory in enumerate(subcategories):
    values = [brand_counts[brand][subcategory] for brand in brands]
    ax.bar(brands, values, bottom=bottom, color=colors[i], label=subcategory)
    bottom = [bottom[j] + values[j] for j in range(len(values))]

ax.set_xlabel('Brand')
ax.set_ylabel('Count')
ax.set_title('Number of Instances Detected for Each Brand and General Category')
ax.legend(title='Category', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.xticks(rotation=45)
plt.tight_layout()

# Save plot to a file or display it
plt.savefig('brand_counts.png')
plt.show()