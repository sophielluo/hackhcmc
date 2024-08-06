# HEINEKEN Vietnam Image Analysis Tool
# Team: YayHCM
<img width="1453" alt="image" src="https://github.com/user-attachments/assets/c2e65753-0b25-4515-b2b8-92a7aa4eb2fc">
<img width="1453" alt="image" src="https://github.com/user-attachments/assets/140bd9a4-9cc5-4021-805b-7158057c37d4">
<img width="1453" alt="image" src="https://github.com/user-attachments/assets/c34d7ab8-eaad-44e9-9091-6ea4781abf10">

## Overview
This repository contains the HEINEKEN Vietnam Image Analysis Tool, developed as part of hackhcmc Hackathon. Our mission is to create a tool that can automatically detect key elements in photos to streamline marketing and promotional activities.

The application allows users to upload photos, which are then analyzed using Machine Learning to detect various elements such as brand logos, products, consumer activities, and promotional materials. Each upload generates a detailed report, and a comprehensive dashboard provides an overview of all analyses.

## Features
- **Image Upload**: Users can upload images directly to the application for analysis.
- **Machine Learning Analysis**: Implements advanced ML algorithms to identify and classify different elements within the photos, including:
  - Brand logos (Heineken, Tiger, Bia Viet, and more)
  - Product types (beer bottles)
  - Promotional materials (posters, banners, billboards)
- **Reporting**: Generates detailed reports for each image upload, summarizing the detected elements.
- **Dashboard**: A user-friendly dashboard that provides a visual summary of the analyses, offering insights into brand visibility, promotional success, and consumer engagement.

## Technology Stack
- **Frontend**: React.js, Chakra UI 
- **Backend**: Node.js, Flask
- **Machine Learning**: YOLOv8
- **Database**: Supabase(PostgreSQL)


## Frontend 
  1.	Install dependencies:
npm install
npm install chokidar@latest webpack-dev-server@latest
npm install axios
	2.	Start the development server:
npm start

## Backend

  1.	Install dependencies:
pip install Flask
pip install Pillow
pip install torch
pip install requests
pip install psycopg2-binary
pip install python-dotenv
pip install numpy
pip install storage3
pip install Ultralytics
pip install Flask-Cors
  2. Start the development server:
Python3 app.py
