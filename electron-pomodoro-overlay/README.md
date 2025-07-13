# Electron Pomodoro Overlay

This project is an Electron application that features a frameless, transparent, always-on-top overlay with a Pomodoro timer. It allows users to manage their time effectively using the Pomodoro technique.

## Project Structure

```
electron-pomodoro-overlay
├── src
│   ├── main.js         # Main process of the Electron application
│   ├── renderer.js     # Renderer process handling UI interactions
│   └── index.html      # HTML structure of the application
├── package.json        # Configuration file for npm
└── README.md           # Documentation for the project
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd electron-pomodoro-overlay
   ```

2. **Install dependencies:**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the application:**
   Use the following command to start the Electron application:
   ```bash
   npm start
   ```

## Usage

- The application features a Pomodoro timer set to 25 minutes by default.
- You can start, pause, and reset the timer using the provided buttons.
- The overlay is always on top, allowing you to keep track of your time while working on other tasks.
- To close the application, click the close button in the top right corner of the overlay.

## License

This project is licensed under the MIT License.