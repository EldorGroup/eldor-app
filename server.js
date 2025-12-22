const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// הגדרת תיקיית הקבצים הסטטיים
app.use(express.static(path.join(__dirname, 'public')));

let clients = [
    { phone: "0501234567", name: "ישראל ישראלי", balance: "482,410", profit: "12.4%", route: "הפלא השמיני", code: "1234" }
];
let leads = [];

// API למשיכת נתונים (Admin)
app.get('/api/admin/data', (req, res) => {
    res.json({ clients, leads });
});

// פונקציות הוספה ומחיקה
app.post('/api/admin/add-client', (req, res) => {
    clients.push(req.body);
    res.sendStatus(200);
});

app.post('/api/admin/delete-client', (req, res) => {
    clients = clients.filter(c => c.phone !== req.body.phone);
    res.sendStatus(200);
});

// כניסת לקוח
app.post('/api/send-code', (req, res) => {
    const client = clients.find(c => c.phone === req.body.phone);
    if (client) return res.sendStatus(200);
    res.status(401).send("Not found");
});

app.post('/api/verify-code', (req, res) => {
    const client = clients.find(c => c.phone === req.body.phone && c.code === req.body.code);
    if (client) return res.json(client);
    res.status(401).send("Wrong code");
});

// יצירת קשר
app.post('/api/contact', (req, res) => {
    leads.unshift({ ...req.body, date: new Date().toLocaleString() });
    res.sendStatus(200);
});

// ניתוב כללי - אם דף לא נמצא, שינסה להגיש את index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
