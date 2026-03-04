const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();

// إعدادات أساسية
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// نظام الجلسات (لحماية الدخول)
app.use(session({
    secret: 'mqawel-2026-secret',
    resave: false,
    saveUninitialized: true
}));

// الاتصال بقاعدة البيانات (سيتم إنشاؤها تلقائياً باسم mqawel_gate_db)
mongoose.connect('mongodb://127.0.0.1:27017/mqawel_gate_db')
    .then(() => console.log('✅ 1. قاعدة البيانات متصلة'))
    .catch(err => console.error('❌ خطأ في القاعدة:', err));

// --- المسارات ---

// يفتح صفحة الدخول (ملف رقم 2)
app.get('/', (req, res) => {
    res.render('2_login'); 
});

// يفتح لوحة التحكم (ملف رقم 3)
app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    res.render('3_dashboard', { user: req.session.user });
});

// استقبال بيانات الدخول
app.post('/auth', (req, res) => {
    const { name } = req.body;
    if (name) {
        req.session.user = { name }; 
        return res.json({ success: true });
    }
    res.json({ success: false });
});

app.listen(3000, () => {
    console.log('🚀 2. المحرك يعمل الآن على: http://localhost:3000');
});