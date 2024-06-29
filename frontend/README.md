# HEINEKEN Vietnam Image Analysis Tool
# Team: YayHCM

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
