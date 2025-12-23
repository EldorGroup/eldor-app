const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// השורה הזו אומרת לשרת להגיש את כל הקבצים מתוך תיקיית public
app.use(express.static(path.join(__dirname, 'public')));

// השורה הזו היא התיקון - היא מכריחה את השרת לפתוח את ה-index.html כשנכנסים לכתובת הראשית
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// לכל מקרה של ניתוב אחר
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
