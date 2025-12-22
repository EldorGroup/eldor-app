const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// בסיס נתונים של הלקוחות - כאן אתה מוסיף או מעדכן לקוחות
let clients = [
    { 
        phone: "0501234567", 
        name: "ישראל ישראלי", 
        balance: "482,410", 
        profit: "12.4%", 
        route: "הפלא השמיני",
        code: "1234" 
    },
    { 
        phone: "0540000000", 
        name: "לקוח VIP", 
        balance: "1,250,000", 
        profit: "8.7%", 
        route: "הכנסה פאסיבית",
        code: "5555" 
    }
];

// API לכניסת לקוח
app.post('/api/send-code', (req, res) => {
    const { phone } = req.body;
    const client = clients.find(c => c.phone === phone);
    if (client) {
        console.log(`קוד נשלח ל-${phone}: ${client.code}`);
        return res.sendStatus(200);
    }
    res.status(401).send("מספר לא מורשה");
});

app.post('/api/verify-code', (req, res) => {
    const { phone, code } = req.body;
    const client = clients.find(c => c.phone === phone && c.code === code);
    if (client) {
        return res.json(client);
    }
    res.status(401).send("קוד שגוי");
});

// --- פונקציות אדמין (לשימוש עתידי בממשק ניהול) ---
app.get('/api/admin/all-clients', (req, res) => res.json(clients));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Eldor Server running on port ${PORT}`));
