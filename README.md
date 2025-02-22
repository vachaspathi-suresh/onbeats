# OnBeats

OnBeats is a web-based music player that allows users to stream songs stored in an AWS bucket. It features a user-friendly UI, queue management, lyrics support, and playlist creation. Some features, such as playlists, lyrics, and sharing, are exclusive to premium users. The app includes a subscription system using Stripe for payments.

## Features
- Stream music directly from AWS
- Queue management for seamless playback
- Lyrics display for supported songs
- Create and manage playlists (Premium feature)
- Subscription system using Stripe for payments
- Share music with friends (Premium feature)

## Live Demo
You can access OnBeats here: [OnBeats Web App](https://onbeats-app.web.app)

## Tech Stack
- **Frontend:** ReactJS
- **Backend:** Node.js
- **Database:** MongoDB
- **Storage:** AWS (for songs and cover images)
- **Payment API:** Stripe

## Installation
To run OnBeats locally, follow these steps:

### Prerequisites
- Node.js installed
- MongoDB instance running

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/vachaspathi-suresh/onbeats.git
   cd onbeats
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the backend directory with required credentials (MongoDB URI, AWS keys, Stripe keys, etc.).
4. Start the development server:
   ```sh
   npm start
   ```

## Contributing
We welcome contributions to improve OnBeats! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License
OnBeats is licensed under the MIT License. See [LICENSE](LICENSE) for details.

