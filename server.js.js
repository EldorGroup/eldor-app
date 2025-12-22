const express = require('express');
const app = express();
app.use(express.json());

// נתוני המערכת - Eldor Group
let currentBalance = 50000;
let currentName = "ישראל ישראלי";
let stocks = 30, securities = 60, cash = 10;
let messages = [
    { date: "22/12/2025", title: "ברוכים הבאים", content: "ברוכים הבאים ל-Eldor Group. אנחנו כאן כדי לנהל את ההשקעות שלך בצורה החכמה ביותר." }
];
let transactions = [{ date: "22/12/2025", type: "הפקדה ראשונית", amount: "+50,000", status: "בוצע" }];
let pendingRequests = [];

// לוגו Eldor Group (HTML/CSS)
const logoHTML = `<div style="font-family: 'Segoe UI', sans-serif; font-weight: 800; font-size: 28px; color: #4ecca3; letter-spacing: 1px;">ELDOR <span style="color: #eee; font-weight: 300;">GROUP</span></div>`;

// 1. דף הכניסה (Login)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
        <head><meta charset="UTF-8"><title>Eldor Group | כניסה</title></head>
        <body style="font-family:sans-serif; background:#1a1a2e; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
            <div style="background:#16213e; padding:50px; border-radius:20px; box-shadow:0 15px 35px rgba(0,0,0,0.5); text-align:center; width:350px; border: 1px solid rgba(78, 204, 163, 0.2);">
                ${logoHTML}
                <p style="color:#888; margin-top:10px; font-size:14px;">Private Investment Management</p>
                <input type="tel" id="phone" placeholder="מספר טלפון" style="width:100%; padding:15px; margin:25px 0 15px; border:none; border-radius:10px; background:#1a1a2e; color:white; outline:none;">
                <button onclick="login()" style="width:100%; padding:15px; background:#4ecca3; color:#1a1a2e; border:none; border-radius:10px; cursor:pointer; font-weight:bold; font-size:16px;">כניסה למערכת</button>
            </div>
            <script>
                async function login() { window.location.href = '/dashboard.html'; }
            </script>
        </body>
        </html>
    `);
});

// 2. דף הדשבורד (Dashboard)
app.get('/dashboard.html', (req, res) => {
    let lastMsg = messages[0] ? messages[0].title : "אין הודעות חדשות";
    let tableRows = transactions.map(t => `<tr><td>${t.date}</td><td>${t.type}</td><td style="color:${t.amount.includes('+') ? '#4ecca3' : '#ff4d4d'}">${t.amount} ₪</td><td>${t.status}</td></tr>`).join('');
    
    res.send(`
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
        <head>
            <meta charset="UTF-8"><script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <style>
                body { font-family: sans-serif; background: #1a1a2e; color: #e9ecef; margin: 0; }
                header { background: #16213e; padding: 20px 50px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #0f3460; }
                .nav-btn { color: #4ecca3; text-decoration: none; font-weight: bold; margin-right: 20px; cursor:pointer; }
                .card { max-width: 900px; margin: 30px auto; background: #16213e; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
                .balance { font-size: 50px; color: #4ecca3; font-weight: bold; text-align: center; margin: 20px 0; font-family: monospace; }
                .charts-container { display: flex; justify-content: space-around; gap: 20px; margin-top: 30px; }
                .chart-box { flex: 1; background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 15px; border-bottom: 1px solid #0f3460; text-align: right; }
                .msg-box { background: #4ecca3; color: #1a1a2e; padding: 15px; border-radius: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            </style>
        </head>
        <body>
            <header>
                ${logoHTML}
                <nav>
                    <span class="nav-btn" onclick="window.location.href='/messages.html'">✉️ מרכז הודעות</span>
                    <span style="color:#888;">שלום, ${currentName}</span>
                </nav>
            </header>
            
            <div class="card">
                <div class="msg-box">
                    <span>📢 <b>עדכון אחרון:</b> ${lastMsg}</span>
                    <button onclick="window.location.href='/messages.html'" style="background:none; border:1px solid #1a1a2e; cursor:pointer; font-weight:bold; border-radius:5px;">קרא עוד</button>
                </div>
                
                <p style="text-align:center; color:#888;">שווי תיק נוכחי</p>
                <div class="balance" id="main-balance">₪${Number(currentBalance).toLocaleString()}</div>
                
                <div class="charts-container">
                    <div class="chart-box"><p style="text-align:center;">פיזור נכסים</p><canvas id="pieChart"></canvas></div>
                    <div class="chart-box"><p style="text-align:center;">מגמת צמיחה</p><canvas id="lineChart"></canvas></div>
                </div>
            </div>

            <div class="card">
                <h3>פעולות אחרונות</h3>
                <table><thead><tr><th>תאריך</th><th>פעולה</th><th>סכום</th><th>סטטוס</th></tr></thead><tbody>${tableRows}</tbody></table>
            </div>

            <script>
                let b = ${currentBalance};
                setInterval(() => { b += (Math.random()*4-2); document.getElementById('main-balance').innerText = "₪" + Math.floor(b).toLocaleString(); }, 3000);
                new Chart(document.getElementById('pieChart'), { type: 'doughnut', data: { labels: ['מניות', 'ניירות ערך', 'מזומן'], datasets: [{ data: [${stocks}, ${securities}, ${cash}], backgroundColor: ['#4ecca3', '#3498db', '#95a5a6'], borderWidth: 0 }] }, options: { plugins: { legend: { labels: { color: 'white' } } } } });
                new Chart(document.getElementById('lineChart'), { type: 'line', data: { labels: ['1','2','3','4','5'], datasets: [{ label: 'שווי', data: [${currentBalance*0.8}, ${currentBalance*0.85}, ${currentBalance*0.95}, ${currentBalance*0.92}, b], borderColor: '#4ecca3', tension: 0.4 }] }, options: { plugins: { legend: { display: false } } } });
            </script>
        </body>
        </html>
    `);
});

// 3. דף הודעות מפורט (Messages)
app.get('/messages.html', (req, res) => {
    let msgList = messages.map(m => `
        <div style="background:#16213e; padding:20px; border-radius:10px; margin-bottom:15px; border-right: 4px solid #4ecca3;">
            <small style="color:#888;">${m.date}</small>
            <h3 style="color:#4ecca3; margin:10px 0;">${m.title}</h3>
            <p style="margin:0;">${m.content}</p>
        </div>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
        <head><meta charset="UTF-8"><title>מרכז הודעות | Eldor Group</title></head>
        <body style="font-family:sans-serif; background:#1a1a2e; color:#eee; padding:30px;">
            <div style="max-width:700px; margin:auto;">
                <button onclick="window.location.href='/dashboard.html'" style="background:none; color:#4ecca3; border:1px solid #4ecca3; padding:10px; cursor:pointer; border-radius:5px; margin-bottom:20px;">חזרה לדשבורד</button>
                <h1 style="border-bottom: 2px solid #0f3460; padding-bottom:15px;">מרכז הודעות אישי</h1>
                ${msgList}
            </div>
        </body>
        </html>
    `);
});

// 4. דף ניהול (Admin)
app.get('/admin', (req, res) => {
    res.send(`
        <body style="font-family:sans-serif; direction:rtl; padding:30px; background:#f4f7f6;">
            <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:10px;">
                <h2>מערכת ניהול Eldor Group</h2>
                <hr>
                <h3>שליחת הודעה ללקוח:</h3>
                כותרת: <input type="text" id="mTitle" style="width:100%;"><br>
                תוכן: <textarea id="mContent" style="width:100%; height:80px;"></textarea><br>
                <button onclick="sendMsg()" style="background:#3498db; color:white; padding:10px; width:100%; border:none; cursor:pointer;">שלח הודעה</button>
                <hr>
                <h3>עדכון יתרה:</h3>
                <input type="number" id="bal" value="${currentBalance}"><br>
                <button onclick="updateBal()" style="background:#2ecc71; color:white; padding:10px; border:none; cursor:pointer;">עדכן יתרה</button>
            </div>
            <script>
                function sendMsg() {
                    fetch('/add-message', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ title: document.getElementById('mTitle').value, content: document.getElementById('mContent').value }) }).then(() => alert('הודעה נשלחה'));
                }
                function updateBal() {
                    fetch('/update-all', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ balance: document.getElementById('bal').value, s:30, se:60, c:10 }) }).then(() => alert('עודכן'));
                }
            </script>
        </body>
    `);
});

app.post('/add-message', (req, res) => {
    messages.unshift({ date: new Date().toLocaleDateString('he-IL'), title: req.body.title, content: req.body.content });
    res.json({success:true});
});
app.post('/update-all', (req, res) => { currentBalance = Number(req.body.balance); res.json({success:true}); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Eldor Group system live on port ${PORT}`));