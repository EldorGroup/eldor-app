const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

const allowedPhones = ['0505070041', '0502316686'];

app.use(express.json());

// פקודה קריטית: קודם בודקים את הכניסה, ורק אז נותנים גישה לתיקייה
app.post('/api/login', (req, res) => {
    const { phone } = req.body;
    if (allowedPhones.includes(phone)) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// הגדרת התיקייה הציבורית
app.use(express.static(path.join(__name, 'public')));

// דף הבית תמיד יהיה דף הכניסה
app.get('/', (req, res) => {
    res.sendFile(path.join(__name, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
