# Skill-Barter-DApp (SkillzzyFi)

A decentralized application (DApp) for skill exchange and learning content marketplace built on blockchain technology. This platform allows users to share, sell, and purchase educational content while leveraging smart contracts for secure transactions.

## Project Overview

SkillzzyFi is a decentralized platform that enables:
- Content creators to upload and monetize their educational content
- Learners to purchase and access quality educational materials
- Dynamic pricing based on content popularity and platform volume
- Secure transactions through smart contracts
- Direct peer-to-peer skill exchange

## Technology Stack

### Frontend
- React.js
- Vite (Build tool)
- CSS3 for styling
- Web3 integration for blockchain interaction
- React Context for state management

### Backend
- Node.js
- Express.js
- Python (Flask) for additional server functionality
- IPFS for decentralized content storage

### Blockchain
- Ethereum Smart Contracts (Solidity)
- Web3.js for blockchain interaction
- Dynamic pricing mechanism
- Smart contract events for tracking transactions

## Smart Contract Features

The DApp's smart contract (SkillSwap.sol) includes:
- Content management (upload, purchase, access control)
- Dynamic pricing system based on purchase volume
- Balance management for creators and buyers
- Notification system for platform interactions
- Access control mechanisms
- Platform volume tracking

## Key Features

1. *Content Management*
   - Upload educational content with metadata
   - Set base prices for content
   - Track content ownership and access rights

2. *Marketplace Functionality*
   - Browse available content
   - Purchase access to content
   - Dynamic price adjustments based on popularity

3. *User Features*
   - Wallet integration
   - Profile management
   - Content creator dashboard
   - Purchase history

4. *Platform Services*
   - Forum for community interaction
   - Course video streaming
   - Service listings
   - Exploration section

## Project Structure


├── backend/               # Node.js and Flask backend servers
│   ├── app.py            # Flask application
│   ├── server.js         # Node.js server
│   ├── static/           # Static assets
│   └── templates/        # HTML templates
├── contract/             # Smart contract files
│   └── SkillSwap.sol     # Main smart contract
└── frontend/            # React frontend application
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── contexts/     # React contexts
    │   ├── contracts/    # Contract ABIs and addresses
    │   └── pages/        # Application pages
    └── public/           # Public assets


## Setup Instructions

1. Clone the repository
bash
git clone https://github.com/jyotiska222/Skill-Barter-DApp.git
cd Skill-Barter-DApp


2. Install frontend dependencies
bash
cd frontend
npm install


3. Install backend dependencies
bash
cd ../backend
npm install
pip install -r requirements.txt


4. Start the development servers
bash
# Frontend
cd frontend
npm run dev

# Backend (Node.js)
cd backend
node server.js

# Backend (Flask)
cd backend
python app.py


## Contributing

Feel free to contribute to this project by:
1. Forking the repository
2. Creating your feature branch
3. Committing your changes
4. Pushing to your branch
5. Creating a Pull Request

## License

This project is licensed under the MIT License.