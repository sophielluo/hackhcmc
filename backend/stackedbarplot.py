from ultralytics import YOLO
import cv2
import matplotlib.pyplot as plt
from collections import Counter, defaultdict

# Define class names (assuming these are the classes you are detecting)
class_names = [
    "Logo_Heineken",
    "Logo_Larue",
    "Logo_Tiger",
    "Logo_Bivina",
    "Larue_Billboards",
    "Logo_BiaViet",
    "Larue_BeerBottles",
    "Logo_Strongbow",
    "Tiger_Billboards",
    "Tiger_Banners",
    "Tiger_BeerBottles",
    "Tiger_BeerKegs",
    "Biaviet_Banners",
    "Biaviet_BeerBottles",
    "Logo_Biaviet",
    "Heineken_BeerBottles",
    "Biaviet_Billboards",
    "Heineken_Banners",
    "Heineken_Billboards",
    "Strongbow_BeerBottles",
    "Bivina_Banners",
    "Logo_Bivina",
    "Bivina_BeerBottles",
    "Bivina_Billboards",
    "Logo_Edelweiss",
    "Edelweiss_BeerBottles",
    "Larue_Banners"
]

# Mapping of classes to brands and generalized categories
brand_mapping = {
    "Heineken": {
        "Logo": ["Logo_Heineken"],
        "Products": ["Heineken_BeerBottles"],
        "Promotional_Materials": ["Heineken_Banners", "Heineken_Billboards"]
    },
    "Larue": {
        "Logo": ["Logo_Larue"],
        "Products": ["Larue_BeerBottles"],
        "Promotional_Materials": ["Larue_Banners", "Larue_Billboards"]
    },
    "Tiger": {
        "Logo": ["Logo_Tiger"],
        "Products": ["Tiger_BeerBottles", "Tiger_BeerKegs"],
        "Promotional_Materials": ["Tiger_Banners", "Tiger_Billboards"]
    },
    "BiaViet": {
        "Logo": ["Logo_BiaViet"],
        "Products": ["Biaviet_BeerBottles"],
        "Promotional_Materials": ["Biaviet_Banners", "Biaviet_Billboards"]
    },
    "Strongbow": {
        "Logo": ["Logo_Strongbow"],
        "Products": ["Strongbow_BeerBottles"],
        "Promotional_Materials": []
    },
    "Bivina": {
        "Logo": ["Logo_Bivina"],
        "Products": ["Bivina_BeerBottles"],
        "Promotional_Materials": ["Bivina_Banners", "Bivina_Billboards"]
    },
    "Edelweiss": {
        "Logo": ["Logo_Edelweiss"],
        "Products": ["Edelweiss_BeerBottles"],
        "Promotional_Materials": []
    }
}

# Load the trained model
model = YOLO("./best-2.pt")

# Run inference on your images
results = model.predict(source="./test_il/images", save=False)

# Initialize a defaultdict of Counters to count the instances of each class per brand
# Initialize all brands with empty counters to ensure they appear on the plot
brand_counts = {brand: Counter() for brand in brand_mapping.keys()}

# Check if any detections were made and update the counter
for result in results:
    if result.boxes:  # Check if there are any detected boxes
        for box in result.boxes:
            class_id = int(box.cls[0])  # Ensure class_id is an integer
            class_name = class_names[class_id]
            for brand, categories in brand_mapping.items():
                for category, classes in categories.items():
                    if class_name in classes:
                        brand_counts[brand][category] += 1

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
plt.show()