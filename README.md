Kanasu Bee House
Hybrid Acoustic–Vision AI Platform for Smart Apiculture

3rd Runner-Up — Design and Innovation Clinic 2026, CMTI Bengaluru

Overview
Kanasu Bee House is an AI-driven beehive monitoring system that integrates acoustic analysis, computer vision, and IoT to enable real-time assessment of hive health. The system goes beyond traditional sensor-based monitoring by combining sound and image-based intelligence to provide accurate and actionable insights for beekeepers.

Key Features

AI and Analytics
The system uses acoustic machine learning with RMS-based feature extraction to analyze bee sound patterns and detect abnormal behavior. It also incorporates convolutional neural networks (CNN) for image-based analysis of hive conditions. A hybrid decision system combines both audio and visual outputs to generate a Bee Health Score, simplifying interpretation for users.

Web Dashboard
The platform includes an interactive web dashboard that provides real-time data monitoring and graphical analytics. It features Bee Scan AI for instant health detection, along with digital health cards and reports. Additional tools include a chatbot for user assistance, a honey production calculator, and a learning centre for educational content.

IoT System
The hardware system is built using an ESP32 microcontroller integrated with sensors such as DHT22 for temperature and humidity, MQ135 for air quality, and a load cell with HX711 for weight monitoring. It also includes an RTC module for time tracking, an OLED display for local output, and buzzer and LED components for alerts.

Cloud and Deployment
Firebase is used for real-time database management, while machine learning models for both acoustic and image analysis are deployed using Render. The frontend is developed using HTML, CSS, JavaScript, and Chart.js.

System Architecture

Sensors → ESP32 → Cloud (Firebase) → ML Models (Render) → Acoustic and Image Analysis → Hybrid Decision System → Web Dashboard

Workflow

The system continuously collects environmental and hive data using sensors. Acoustic signals are processed using machine learning models, while images are analyzed using CNN-based models. The outputs are combined to generate a Bee Health Score, which is displayed on the web dashboard along with insights and alerts for the user.

Tech Stack

Hardware: ESP32, DHT22, MQ135, Load Cell (HX711), RTC, OLED
Software: Machine Learning (Acoustic and CNN), Firebase, Render
Frontend: HTML, CSS, JavaScript, Chart.js

Impact

Kanasu Bee House enables early detection of hive stress, disease, and environmental risks. It reduces manual monitoring effort and supports data-driven, sustainable beekeeping practices.

Links

Live Demo: https://tejas08-hub.github.io/Kanasu-Bee-House/
GitHub Repository: https://github.com/Tejas08-hub/Kanasu-Bee-House

Acknowledgment

We thank CMTI Bengaluru for organizing the Design and Innovation Clinic 2026 and for providing the opportunity to present and showcase our work.
