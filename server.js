const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());

// הגדרת תיקיית הקבצים הסטטיים
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// --- הגדרות אבטחת אדמין ---
// שנה את אלו למה שאתה רוצה שיהיה שם המשתמש והסיסמה שלך
const ADMIN_USER = "EldorAdmin";
const ADMIN_PASS = "Eldor2025!"; 

// --- חיבור למסד הנתונים MongoDB Atlas ---
const mongoURI = "mongodb+srv://eldorgrup_db_user:4I1lpDEVOChxJq9W@cluster0.7zgc8to.mongodb.net/?appName=Cluster0"; 

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB Atlas Successfully!"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// --- הגדרת מבנה הנתונים (Schemas) ---
const clientSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    name: String,
    balance: String,
    profit: String,
    route: String,
    code: String
});

const leadSchema = new mongoose.Schema({
    name: String,
    phone: String,
    date: { type: String, default: () => new Date().toLocaleString('he-IL') }
});

const Client = mongoose.model('Client', clientSchema);
const Lead = mongoose.model('Lead', leadSchema);

// --- API לאימות כניסת אדמין ---
app.post('/api/admin/login', (req, res) => {
    const { user, pass } = req.body;
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        res.sendStatus(200);
    } else {
        res.status(401).send("Unauthorized");
    }
});

// --- API לניהול נתונים (אדמין) ---
app.get('/api/admin/data', async (req, res) => {
    try {
        const clients = await Client.find();
        const leads = await Lead.find().sort({ _id: -1 });
        res.json({ clients, leads });
    } catch (err) {
        res.status(500).send("Error fetching data");
    }
});

app.post('/api/admin/add-client', async (req, res) => {
    try {
        const { phone } = req.body;
        await Client.findOneAndUpdate({ phone }, req.body, { upsert: true, new: true });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send("Error adding client");
    }
});

app.post('/api/admin/delete-client', async (req, res) => {
    try {
        await Client.findOneAndDelete({ phone: req.body.phone });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send("Error deleting client");
    }
});

// --- API לממשק לקוח ---
app.post('/api/send-code', async (req, res) => {
    try {
        const client = await Client.findOne({ phone: req.body.phone });
        if (client) res.sendStatus(200);
        else res.status(401).send("Client not found");
    } catch (err) {
        res.status(500).send("Server error");
    }
});

app.post('/api/verify-code', async (req, res) => {
    try {
        const client = await Client.findOne({ phone: req.body.phone, code: req.body.code });
        if (client) res.json(client);
        else res.status(401).send("Wrong code");
    } catch (err) {
        res.status(500).send("Server error");
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const newLead = new Lead(req.body);
        await newLead.save();
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send("Error saving lead");
    }
});

// --- ניתוב דפים ---
app.get('/admin-portal.html', (req, res) => {
    res.sendFile(path.join(publicPath, 'admin-portal.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(publicPath, 'login.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Eldor Group Server running on port ${PORT}`));
