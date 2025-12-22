const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// --- בסיס הנתונים (בזיכרון) ---
// כאן נשמרים הלקוחות והפניות. כשתעשה Restart לשרת ב-Render, הנתונים יתאפסו.
// בשלב מתקדם יותר נוכל לחבר את זה למסד נתונים קבוע.
let clients = [
    { 
        phone: "0501234567", 
        name: "ישראל ישראלי", 
        balance: "482,410", 
        profit: "12.4%", 
        route: "הפלא השמיני", 
        code: "1234" 
    }
];

let leads = []; // כאן נשמרים האנשים שהשאירו פרטים ב"צור קשר"

// --- נתיבים ללקוחות (Client Side) ---

// 1. שליחת קוד - בדיקה אם הטלפון קיים במערכת
app.post('/api/send-code', (req, res) => {
    const { phone } = req.body;
    const client = clients.find(c => c.phone === phone);
    if (client) {
        console.log(`קוד כניסה עבור ${phone} הוא: ${client.code}`);
        return res.sendStatus(200);
    }
    res.status(401).send("המספר אינו מופיע במערכת");
});

// 2. אימות קוד וכניסה לאזור אישי
app.post('/api/verify-code', (req, res) => {
    const { phone, code } = req.body;
    const client = clients.find(c => c.phone === phone && c.code === code);
    if (client) {
        return res.json(client); // מחזיר את כל פרטי הלקוח המעודכנים
    }
    res.status(401).send("קוד שגוי");
});

// 3. קבלת פנייה חדשה מ"צור קשר"
app.post('/api/contact', (req, res) => {
    const { name, phone } = req.body;
    const newLead = {
        name,
        phone,
        date: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })
    };
    leads.unshift(newLead); // מוסיף לראש הרשימה
    res.sendStatus(200);
});

// --- נתיבים למנהל (Admin Side) ---

// 1. קבלת כל המידע לדף הניהול
app.get('/api/admin/data', (req, res) => {
    res.json({ clients, leads });
});

// 2. הוספת לקוח חדש מהדשבורד
app.post('/api/admin/add-client', (req, res) => {
    const { name, phone, balance, profit, route, code } = req.body;
    
    // בדיקה אם הלקוח כבר קיים לפי טלפון
    const existingIndex = clients.findIndex(c => c.phone === phone);
    if (existingIndex !== -1) {
        clients[existingIndex] = { name, phone, balance, profit, route, code }; // עדכון קיים
    } else {
        clients.push({ name, phone, balance, profit, route, code }); // הוספת חדש
    }
    res.sendStatus(200);
});

// 3. מחיקת לקוח
app.post('/api/admin/delete-client', (req, res) => {
    const { phone } = req.body;
    clients = clients.filter(c => c.phone !== phone);
    res.sendStatus(200);
});

// הפעלת השרת
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
