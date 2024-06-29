from ultralytics import YOLO
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
model = YOLO("/Users/jack/Desktop/label/best.pt")

# Run inference on your images
results = model.predict(source="/Users/jack/Desktop/label/test_images", save=False)

# Initialize a defaultdict of Counters to count the instances of each class per brand
brand_counts = {brand: Counter() for brand in brand_mapping.keys()}

# Initialize variables to store total detected area and total image area
total_detected_area = 0
total_image_area = 0

# Initialize counters for pass and fail images
pass_count = 0
fail_count = 0

# Threshold for compliance
threshold = 8.0

# Check if any detections were made and update the counter
for idx, result in enumerate(results):
    # Get image dimensions
    img_height, img_width = result.orig_shape

    # Calculate the total area of detected boxes for the current image
    image_detected_area = 0
    if result.boxes:  # Check if there are any detected boxes
        for box in result.boxes:
            class_id = int(box.cls[0])  # Ensure class_id is an integer
            class_name = class_names[class_id]
            for brand, categories in brand_mapping.items():
                for category, classes in categories.items():
                    if class_name in classes:
                        brand_counts[brand][category] += 1

            x1, y1, x2, y2 = box.xyxy[0]  # Access the coordinates directly
            box_width = x2 - x1
            box_height = y2 - y1
            box_area = box_width * box_height
            image_detected_area += box_area

    # Calculate the percentage of detected area for the current image
    image_area = img_width * img_height
    detected_percentage = (image_detected_area / image_area) * 100 if image_area > 0 else 0

    # Check if the image passes or fails based on the threshold
    if detected_percentage > threshold:
        pass_count += 1
    else:
        fail_count += 1

    # Accumulate the total detected area and total image area
    total_detected_area += image_detected_area
    total_image_area += img_width * img_height

# Calculate the overall percentage of detected areas
overall_percentage = (total_detected_area / total_image_area) * 100 if total_image_area > 0 else 0

# Calculate the compliance score percentage
total_images = pass_count + fail_count
compliance_percentage = (pass_count / total_images) * 100 if total_images > 0 else 0

# Prepare data for plotting
brands = list(brand_counts.keys())
subcategories = ["Logo", "Products", "Promotional_Materials"]

# Colors for the subcategories
colors = ["#143601", "#008200", "#aad576"]

# Prepare data for pie chart
brand_totals = {brand: sum(counts.values()) for brand, counts in brand_counts.items()}
brands_pie = list(brand_totals.keys())
totals = list(brand_totals.values())

# Colors for the pie chart
colors_pie = ["#143601", "#1a4301", "#245501", "#538d22", "#73a942", "#aad576", "#008200"]

# Load the YOLO model for location classification
model_location = YOLO('/Users/jack/Desktop/label/classification.pt')  # Replace with the correct model file if necessary

# Define class names for location classification
location_class_names = {
    0: 'bar',
    1: 'restaurant',
    2: 'grocery_store',
    3: 'supermarket'
}

# Make predictions on new images
location_results = model_location.predict(source="/Users/jack/Desktop/label/test_images", save=False)

# Count occurrences of each class
class_counts = {name: 0 for name in location_class_names.values()}
for result in location_results:
    if hasattr(result, 'probs') and result.probs is not None:
        # Get the class index with the highest probability
        highest_confidence_index = result.probs.top1
        class_name = location_class_names[highest_confidence_index]
        class_counts[class_name] += 1

# Plotting the stacked bar plot in a separate figure
fig1, ax1 = plt.subplots(figsize=(12, 8))

bottom = [0] * len(brands)

for i, subcategory in enumerate(subcategories):
    values = [brand_counts[brand][subcategory] for brand in brands]
    ax1.bar(brands, values, bottom=bottom, color=colors[i], label=subcategory)
    bottom = [bottom[j] + values[j] for j in range(len(values))]

ax1.set_xlabel('Brand')
ax1.set_ylabel('Count')
ax1.set_title('Number of Instances Detected for Each Brand and General Category')
ax1.legend(title='Category', bbox_to_anchor=(1.05, 1), loc='upper left')
ax1.tick_params(axis='x', rotation=45)
plt.tight_layout()

# Show the bar plot
plt.show()

# Plotting the pie chart for brands in a separate figure
fig2, ax2 = plt.subplots(figsize=(10, 7))
ax2.pie(totals, labels=brands_pie, autopct='%1.1f%%', startangle=90, colors=colors_pie)
ax2.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
ax2.set_title('Distribution of Detections by Brand')

# Show the pie chart
plt.show()

# Plotting the pie chart for location distribution in a separate figure
fig3, ax3 = plt.subplots(figsize=(8, 8))
labels = class_counts.keys()
sizes = class_counts.values()

ax3.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140)
ax3.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
ax3.set_title('Distribution of Locations for Test Images')

# Show the pie chart
plt.show()

# Print the overall percentage and compliance score
print(f"Overall detected area as percentage of total image size: {overall_percentage:.2f}%")
print(f"Compliance score: {compliance_percentage:.2f}% ({pass_count}/{total_images} images passed)")