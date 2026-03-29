# 🚀 Besti - Quick Start Guide

## Option 1: Windows Users (Easiest)\

### Step 1: Backend Setup
1. Run `setup-backend.bat` 
2. Edit `backend\.env` file and add your OpenAI API key
3. Done!

### Step 2: Frontend Setup
1. Run `setup-frontend.bat`
2. Done!

### Step 3: Run Everything
1. Run `start-dev.bat` to launch both servers
2. Open http://localhost:3000 in your browser
3. Start chatting!

---

## Option 2: Mac/Linux Users

### Step 1: Backend Setup
```bash
chmod +x setup-backend.sh
./setup-backend.sh
```
Edit `backend/.env` and add your OpenAI API key

### Step 2: Frontend Setup
```bash
chmod +x setup-frontend.sh
./setup-frontend.sh
```

### Step 3: Run Everything
```bash
chmod +x start-dev.sh
./start-dev.sh
```
Open http://localhost:3000 in your browser

---

## Option 3: Manual Setup (Any OS)

### Backend:
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env  # or: cp .env.example .env
# Edit .env and add your OpenAI API key
python main.py
```

### Frontend (in new terminal):
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Getting Your OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Click on "API keys" in the sidebar
4. Create a new API key
5. Copy it and paste into `backend/.env`

---

## 💬 Using Besti

1. **Open** http://localhost:3000
2. **Type** a message to your AI friend
3. **Customize** with the ⚙️ settings button to:
   - Change the AI's name
   - Adjust personality (tone, energy, response style)
4. **Create new chats** with the "+ New Chat" button
5. **Enjoy** your personalized AI companion!

---

## ✨ Quick Tips

- Messages are auto-saved to browser storage
- Settings persist across sessions
- The AI remembers previous messages in the same chat
- Try different personality combinations for variety!

---

## 🆘 Troubleshooting

### "Backend not connecting"
- Make sure `python main.py` is running in the backend terminal
- Check that your `.env` file has the API key
- Try accessing http://localhost:8000 directly

### "npm command not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "ModuleNotFoundError" in Python
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

---

## 📂 Project Files

```
Besti/
├── backend/                 # FastAPI backend
├── frontend/                # React frontend
├── setup-backend.bat/sh      # Setup scripts
├── setup-frontend.bat/sh
├── start-dev.bat/sh
├── README.md                # Full documentation
└── QUICK-START.md           # This file
```

---

## 🎯 Next Steps

After getting Besti running, try:

1. **Customize personalities**: Test all tone combinations
2. **Have real conversations**: See how the AI remembers context
3. **Explore the code**: Files are well-commented and modular
4. **Add features**: The codebase is designed for easy extensions

---

## 📞 Need Help?

Check the full README.md for:
- Detailed setup instructions
- API endpoint documentation
- Customization options
- Troubleshooting guide
- Production deployment info

Happy chatting! 🌟
