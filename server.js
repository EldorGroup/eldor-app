const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// הוספת נתיב דינמי לתיקיית public
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.use(express.static(__dirname)); // גיבוי למקרה שהקובץ מחוץ לתיקייה

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

// פתרון לבעיית ה-Cannot GET: אם דף לא נמצא, הוא מחפש אותו בתיקיית public
app.get('/:page', (req, res) => {
    const page = req.params.page;
    if (page.endsWith('.html')) {
        res.sendFile(path.join(publicPath, page), (err) => {
            if (err) res.sendFile(path.join(__dirname, page));
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Eldor Group active on port ${PORT}`));
