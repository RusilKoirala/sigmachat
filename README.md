# SIGMA Chat - A Modern Real-time Chat Application

> A shit chat app for my frds

A sleek, modern real-time chat application built with React, Firebase, and Tailwind CSS. Features include real-time messaging, admin controls, downloadable Python games, and a Bhai Lang programming playground.

## 🚀 Features

### 💬 Real-time Chat
- **Instant messaging** with Firebase Firestore
- **User avatars** with automatic generation
- **Admin controls** with special commands
- **Profanity filtering** with customizable word lists
- **Spam protection** with rate limiting
- **Active user tracking** with online status
- **Message formatting** with markdown support
- **Link detection** and auto-linking
- **Code highlighting** with copy functionality

### 🎮 Downloadable Games
- **Snake Game** - Classic snake with modern graphics
- **Target Shooter** - Aim and shoot moving targets
- **Car Race** - Fast-paced racing action
- **Breakout** - Classic brick-breaking arcade game
- All games built with **Python + Pygame**
- **One-click download** with installation instructions

### 🛠️ System Tools
- **Game Optimizer** - Boost FPS and reduce input lag
- **System Monitor** - Real-time PC performance stats
- **Privacy Cleaner** - Clear traces and temp files
- **WiFi Password Tool** - View saved WiFi passwords

### 🇮🇳 Bhai Lang Playground
- **Interactive code editor** with syntax highlighting
- **Real-time execution** in browser
- **Example programs** to get started
- **Copy/paste functionality**
- Built with the official **bhailang npm package**

### 🔐 VIP Access
- **Exclusive content** for verified users
- **ID and password protection**
- **Advanced programming resources**
- **Special download access**

## 🎨 Design System

### Color Palette
- **Primary**: Slate-950 (deep dark background)
- **Secondary**: Slate-900 (cards and navigation)
- **Accent**: Blue-500 (brand color)
- **Text**: Slate-100 (primary), Slate-400 (secondary)
- **Borders**: Slate-700/800 with hover states

### UI Features
- **Glassmorphism effects** with backdrop blur
- **Consistent navigation** across all pages
- **Responsive design** for all screen sizes
- **Smooth animations** and transitions
- **Professional gradients** and shadows
- **Modern rounded corners** and spacing

## 🛡️ Security Features

### Admin System
- **Password-protected admin access** (obfuscated in code)
- **Special admin commands** hidden from public help
- **Admin-only message styling** with red accents
- **Secure session management**

### Content Filtering
- **Real-time profanity detection** with customizable filters
- **Spam protection** with rate limiting and penalties
- **Message validation** and sanitization
- **Safe link handling**

### Ad Blocker Detection
- **Strict enforcement** - blocks all app usage
- **Multiple detection methods** for reliability
- **User-friendly blocking message**
- **Bypass prevention**

## 📱 Responsive Design

### Mobile Support
- **Touch-friendly interface** with proper spacing
- **Responsive navigation** that adapts to screen size
- **Mobile-optimized chat** with swipe gestures
- **Adaptive ad placement** for different screen sizes

### Cross-Platform
- **Works on all modern browsers**
- **Consistent experience** across devices
- **Optimized for 720p, 1080p, and 4K displays**
- **Proper scaling** for all resolutions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase account and project
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sigma-chat.git
   cd sigma-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Copy your config to `src/ChatPage.jsx`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎮 Game Installation

### For Downloaded Python Games

1. **Install Python**
   ```bash
   # Download from python.org/downloads
   ```

2. **Install Pygame**
   ```bash
   pip install pygame
   ```

3. **Run any game**
   ```bash
   python snake_game.py
   python target_shooter.py
   python car_race.py
   python breakout_game.py
   ```

## 🔧 Configuration

### Admin Setup
- Change the admin password in `src/ChatPage.jsx`
- Update the base64 encoded password in `getAdminPassword()`

### Profanity Filter
- Modify word lists in `src/utils/profanityFilter.js`
- Adjust sensitivity and replacement text

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SigmaIcon.jsx   # Brand logo component
│   └── AdManager.jsx   # Advertisement management
├── utils/              # Utility functions
│   └── profanityFilter.js
├── ChatPage.jsx        # Main chat interface
├── MyCodesNew.jsx      # Downloads and tools page
├── BhaiLang.jsx        # Programming playground
├── App.jsx             # Main application component
└── main.jsx           # Application entry point

public/
└── downloads/          # Downloadable game files
    ├── snake_game.py
    ├── target_shooter.py
    ├── car_race.py
    └── breakout_game.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Firebase** for real-time database
- **Tailwind CSS** for styling system
- **Pygame** for game development
- **Bhai Lang** for the programming language
- **React** for the frontend framework

---

**Built with ❤️ for friends**

Check out the live demo of the final result:
[https://react-firechat-alterclass.netlify.app/](https://react-firechat-alterclass.netlify.app/).

[![React FireChat by AlterClass](https://alterclass.s3.eu-west-3.amazonaws.com/react-firechat.png)](https://react-car-configurator.netlify.app/)


## create-react-app

This project uses the popular
[create-react-app (CRA)](https://create-react-app.dev/) command to setup a
modern React application. This way we can focus on the code itself, and not
worry about configuring many build tools.

The
[package.json](https://github.com/AlterClassIO/react-firechat/blob/master/package.json)
file provides four scripts:

- `start`: Runs the app in the development mode.
- `build`: Builds the app for production to the build folder. It correctly
  bundles React in production mode and optimizes the build for the best
  performance.
- `test`: Launches the test runner in the interactive watch mode.
- `eject`: Remove create-react-app build dependency from your project.

## Instructions

1. Clone the project repository:
   `git clone https://github.com/AlterClassIO/react-firechat`

2. Navigate to the project folder: `cd react-firechat`

3. Install the dependencies: `npm install`

4. Start the app in the development mode: `npm start`

![Compiled successfully!](https://alterclass.s3.eu-west-3.amazonaws.com/react-firechat-compiled.png)

5. Open [http://localhost:3000](http://localhost:3000) to view your React
   application in the browser

![React starting point](https://alterclass.s3.eu-west-3.amazonaws.com/react-firechat.png)
