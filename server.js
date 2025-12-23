const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// הגדרה שהשרת יקרא את הקבצים מתוך תיקיית public
app.use(express.static(path.join(__dirname, 'public')));

// בכל פעם שמישהו נכנס לאתר, הוא יקבל את index.html המעוצב
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log('Eldor Group Server is running on port ' + port);
});
