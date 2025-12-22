const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

const allowedPhones = ['0505070041', '0502316686'];
const activeCodes = new Map(); // כאן נשמור את הקודים זמנית

// 1. שלב ראשון: בדיקת טלפון ויצירת קוד
app.post('/api/send-code', (req, res) => {
    const { phone } = req.body;
    if (allowedPhones.includes(phone)) {
        const code = Math.floor(1000 + Math.random() * 9000).toString(); // קוד אקראי 4 ספרות
        activeCodes.set(phone, { code, expires: Date.now() + 5 * 60 * 1000 }); // תוקף ל-5 דקות
        
        console.log(`Code for ${phone}: ${code}`); // כרגע הקוד יופיע בלוגים של Render
        
        // כאן בעתיד נחבר שירות SMS. כרגע נחזיר הצלחה.
        res.json({ success: true, msg: 'קוד נשלח (בדוק לוגים)' });
    } else {
        res.status(401).json({ success: false, msg: 'מספר לא מורשה' });
    }
});

// 2. שלב שני: אימות הקוד
app.post('/api/verify-code', (req, res) => {
    const { phone, code } = req.body;
    const data = activeCodes.get(phone);

    if (data && data.code === code && Date.now() < data.expires) {
        activeCodes.delete(phone); // מחיקת הקוד לאחר שימוש
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, msg: 'קוד שגוי או פג תוקף' });
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
