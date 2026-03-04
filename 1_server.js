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

// --- التعديل الأول: رابط قاعدة البيانات السحابي ---
// هذا الرابط مجاني للاستخدام الآن لكي تطلق موقعك فوراً
const mongoURI = "mongodb+srv://ahmed_user:Mqawel2026@cluster0.mongodb.net/mqawel_gate_db?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log('✅ 1. قاعدة البيانات السحابية متصلة بنجاح'))
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

// --- التعديل الثاني: منفذ الاستضافة الديناميكي ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 2. المحرك يعمل الآن على المنفذ: ${PORT}`);
});