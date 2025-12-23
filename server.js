const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// אומרים לשרת לחפש את האתר בתוך תיקיית public
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log('Server is live!');
});
