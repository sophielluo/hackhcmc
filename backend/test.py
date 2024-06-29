import os
import requests

# The URL of the Flask server
upload_url = "http://localhost:3100/upload"

# The path to the folder containing the images
folder_path = "./test_il/images"

# Iterate through all the files in the folder
for filename in os.listdir(folder_path):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
        # Construct the full file path
        file_path = os.path.join(folder_path, filename)
        
        # Read the image file
        with open(file_path, 'rb') as f:
            files = {'image': (filename, f, 'image/*')}
            
            # Send the POST request
            response = requests.post(upload_url, files=files)
            
            # Print the response from the server
            print(f'Uploading {filename}: Status Code: {response.status_code}, Response: {response.text}')