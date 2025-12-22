const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

const allowedPhones = ['0505070041', '0502316686'];

app.use(express.json());

app.post('/api/login', (req, res) => {
    const { phone } = req.body;
    if (allowedPhones.includes(phone)) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
