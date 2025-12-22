const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

// רשימת מספרי הטלפון המורשים (הוספתי את המספרים שביקשת)
const allowedPhones = ['0505070041', '0502316686'];

app.use(express.json());
app.use(express.static(path.join(__name, 'public')));

// נתיב לבדיקת מספר הטלפון
app.post('/api/login', (req, res) => {
    const { phone } = req.body;
    if (allowedPhones.includes(phone)) {
        res.json({ success: true, message: 'התחברת בהצלחה!' });
    } else {
        res.status(401).json({ success: false, message: 'מספר טלפון לא מורשה' });
    }
});

// החזרת האפליקציה לכל נתיב אחר (עבור Single Page App)
app.get('*', (req, res) => {
    res.sendFile(path.join(__name, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
