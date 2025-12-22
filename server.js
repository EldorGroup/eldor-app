const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// מנסה להגיש קבצים מתיקיית public
app.use(express.static(path.join(__dirname, 'public')));
// מנסה להגיש קבצים מהתיקייה הראשית (ליתר ביטחון)
app.use(express.static(__dirname));

let clients = [
    { phone: "0501234567", name: "ישראל ישראלי", balance: "482,410", profit: "12.4%", route: "הפלא השמיני", code: "1234" }
];
let leads = [];

// API Admin
app.get('/api/admin/data', (req, res) => res.json({ clients, leads }));
app.post('/api/admin/add-client', (req, res) => { clients.push(req.body); res.sendStatus(200); });
app.post('/api/admin/delete-client', (req, res) => { clients = clients.filter(c => c.phone !== req.body.phone); res.sendStatus(200); });

// API Client
app.post('/api/send-code', (req, res) => {
    const client = clients.find(c => c.phone === req.body.phone);
    res.sendStatus(client ? 200 : 401);
});
app.post('/api/verify-code', (req, res) => {
    const client = clients.find(c => c.phone === req.body.phone && c.code === req.body.code);
    client ? res.json(client) : res.sendStatus(401);
});
app.post('/api/contact', (req, res) => {
    leads.unshift({ ...req.body, date: new Date().toLocaleString('he-IL') });
    res.sendStatus(200);
});

// נתיב מיוחד לדף הניהול - מוודא שהקובץ יישלח לא משנה איפה הוא
app.get('/admin-portal.html', (req, res) => {
    let filePath = path.join(__dirname, 'public', 'admin-portal.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            // אם לא מצא ב-public, מנסה בתיקייה הראשית
            res.sendFile(path.join(__dirname, 'admin-portal.html'));
        }
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
