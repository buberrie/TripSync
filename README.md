# Journey Planner Web Application

This project is a responsive, interactive journey planner built with Vue.js. Users can add multiple travel destinations, view summaries of each leg of the journey, and see travel information, including total distance, duration, and estimated fuel needed. The application provides an intuitive UI with animations, a suggestion feature for destination inputs, and dynamic map integration for displaying travel routes and directions.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Add and Remove Destinations**: Users can dynamically add multiple destinations with options to remove them as needed.
- **Auto-Suggestions for Destinations**: Real-time suggestions while typing the destination to make input selection easier.
- **Responsive Design**: Ensures seamless usage across devices with mobile-friendly layouts and elements.
- **Journey Summary**: Displays each segment of the journey, including origin, destination, distance, and duration.
- **Total Journey Summary**: Provides cumulative data on the total distance, time, and estimated fuel requirements.
- **Map Display**: Shows the travel route with directions, supporting a visual preview of the entire journey.

## Technologies

- **Vue.js**: Framework for building the UI components and managing application state.
- **Tailwind CSS**: Styling framework used for creating a responsive, modern design.
- **Google Maps API**: For generating auto-suggestions, fetching location data, and displaying the journey path on a map.
- **Local Storage**: Saves user-selected destinations to persist data across sessions.

## Setup and Installation

To run this project locally, ensure you have **Node.js** installed.

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/journey-planner.git
    cd journey-planner
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Configure API Keys**:
    - Get an API key from the [Google Cloud Console](https://console.cloud.google.com/) and enable Google Maps JavaScript API.
    - Create a `.env` file at the root and add your API key:
      ```plaintext
      VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
      ```

4. **Run the Application**:
    ```bash
    npm run dev
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Add Destinations**: Start typing your destination into the input field, and select from the auto-suggested options.
2. **Select Travel Mode**: The travel mode is set to "DRIVING" by default for fuel calculations and optimized routes.
3. **View Journey Summary**: After adding destinations, the app will show each journey segment with details, as well as a total summary of the trip.
4. **Map Directions**: The map displays a visual path of your journey, allowing you to see the entire route from start to finish.

## Project Structure

```plaintext
src/
├── assets/                # Images, icons, and other static files
├── components/            # Vue components for different parts of the UI
├── views/                 # Application views (e.g., main journey planner page)
├── App.vue                # Main app component
├── main.js                # Application entry point
├── router/                # Vue Router setup (if applicable)
├── store/                 # Vuex store (if used for state management)
└── utils/                 # Utility functions (e.g., distance calculations, map setup)
.env                       # Environment variables (e.g., API keys)
