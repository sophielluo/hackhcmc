from flask import Flask, request, Response, json
from PIL import Image
import io
import requests
import psycopg2
import os
from dotenv import load_dotenv
from ultralytics import YOLO
from io import BytesIO
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from collections import Counter, defaultdict
import base64
from flask_cors import CORS
import logging
from storage3 import create_client

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

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

CORS(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

model1 = YOLO("./best-2.pt")
model2 = YOLO("./best.pt") 

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )
    return conn

@app.route('/upload', methods=['POST'])
def upload_image():
    if not request.files:
        return Response('No images uploaded', status=400, mimetype='text/plain')

    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')

    if supabase_url is None or supabase_key is None:
        return Response('Supabase URL or Key not set in environment variables', status=500, mimetype='text/plain')

    bucket = 'images'

    for key in request.files:
        file = request.files[key]
        img_bytes = file.read()

        # Upload image to Supabase
        image_name = file.filename

        # Skip .DS_Store file
        if image_name == '.DS_Store':
            continue

        files = {
            'file': (image_name, img_bytes, 'image/*')  # Specify the correct MIME type
        }
        headers = {
            'apikey': supabase_key,
            'Authorization': f'Bearer {supabase_key}'
        }
        upload_url = f'{supabase_url}/storage/v1/object/{bucket}/{image_name}'
        
        response = requests.post(upload_url, files=files, headers=headers)
        
        if response.status_code != 200:
            try:
                error_details = response.json()
            except ValueError:
                error_details = response.content.decode()
            return Response(f'Failed to upload image {image_name} to Supabase: {error_details}', status=500, mimetype='text/plain')
        
        # Store image metadata in Supabase
        image_url = f'{supabase_url}/storage/v1/object/public/{bucket}/{image_name}'
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO images_metadata (name, image_url) VALUES (%s, %s)',  # Updated table name
            (image_name, image_url)
        )
        conn.commit()
        cursor.close()
        conn.close()

    return Response('All images uploaded successfully', status=200, mimetype='text/plain')

@app.route('/run-model', methods=['GET'])
def run_model():
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')
    url = f'{supabase_url}/storage/v1'
    headers = {"apiKey": supabase_key, "Authorization": f"Bearer {supabase_key}"}
    storage_client = create_client(url, headers, is_async=False)
    bucket = 'images'

    # Retrieve list of images from Supabase
    response = storage_client.from_(bucket).list()

    image_list = response
    if not image_list:
        return Response('No images found in Supabase bucket', status=400, mimetype='text/plain')

    # Download images from Supabase
    images = []
    for image_info in image_list:
        image_name = image_info['name']

        # Skip placeholder or non-image files
        if image_name == '.emptyFolderPlaceholder' or not image_info['metadata']['mimetype'].startswith('image'):
            continue
    
        image_url = f'{supabase_url}/storage/v1/object/public/{bucket}/{image_name}'
        image_response = requests.get(image_url, headers=headers)
        if image_response.status_code == 200:
            image_bytes = BytesIO(image_response.content)
            try:
                img = Image.open(image_bytes).convert('RGB')
                images.append(img)
            except IOError:
                print(f'Failed to identify image file: {image_name}')
        else:
            print(f'Failed to download image {image_name}')

    # Run both YOLO models on the images
    logging.debug(f'Running model1 on {len(images)} images')
    results1 = model1.predict(source=images, save=True)
    
    logging.debug(f'Running model2 on {len(images)} images')
    results2 = model2.predict(source=images, save=True)

    brand_counts1 = {brand: Counter() for brand in brand_mapping.keys()}
    brand_counts2 = {brand: Counter() for brand in brand_mapping.keys()}

    logging.debug(f'Brand counts model1: {brand_counts1}')
    logging.debug(f'Brand counts model2: {brand_counts2}')

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
    for idx, result in enumerate(results1):
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
    colors = ["#008200", "#6a994e", "#a7c957","#f2e8cf"]

    # Prepare data for pie chart
    brand_totals = {brand: sum(counts.values()) for brand, counts in brand_counts.items()}
    brands_pie = list(brand_totals.keys())
    totals = list(brand_totals.values())

    # Colors for the pie chart
    colors_pie = ["#008200", "#6a994e", "#a7c957","#f2e8cf", "#bc4749", "#db504a","#ff6f59"]

    # Define class names for location classification
    location_class_names = {
        0: 'bar',
        1: 'restaurant',
        2: 'grocery_store',
        3: 'supermarket'
    }

    # Count occurrences of each class
    class_counts = {name: 0 for name in location_class_names.values()}
    for result in results2:
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
    # ax1.set_title('Number of Instances Detected for Each Brand and General Category')
    ax1.legend(title='Category', loc='upper right')
    ax1.tick_params(axis='x', rotation=45)
    plt.tight_layout()

    # Save plot for model1 to a bytes buffer
    buffer1 = BytesIO()
    plt.savefig(buffer1, format='png')
    buffer1.seek(0)
    img_str1 = base64.b64encode(buffer1.read()).decode()

    # Plotting the pie chart for brands in a separate figure
    fig2, ax2 = plt.subplots(figsize=(10, 7))
    ax2.pie(totals, labels=brands_pie, autopct='%1.1f%%', startangle=90, colors=colors_pie)
    ax2.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.

    # Save plot for model2 to a bytes buffer
    buffer2 = BytesIO()
    plt.savefig(buffer2, format='png')
    buffer2.seek(0)
    img_str2 = base64.b64encode(buffer2.read()).decode()

    # Plotting the pie chart for location distribution in a separate figure
    fig3, ax3 = plt.subplots(figsize=(8, 8))
    labels = class_counts.keys()
    sizes = class_counts.values()

    ax3.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140, colors=colors)
    ax3.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.

    # Save plot for model2 to a bytes buffer
    buffer3 = BytesIO()
    plt.savefig(buffer3, format='png')
    buffer3.seek(0)
    img_str3 = base64.b64encode(buffer3.read()).decode()

    return json.dumps({"plot1": img_str1, "plot2": img_str2, "plot3": img_str3, "compliance_percentage": int(compliance_percentage), "overall_percentage": int(overall_percentage)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3100)