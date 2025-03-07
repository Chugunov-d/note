require('dotenv').config();
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const app = express()
const { body, validationResult } = require('express-validator');

app.use(express.json())
app.use(cors({
    origin:'*',
}))


const jwt = require('jsonwebtoken');
const {authenticateToken} = require('./utils')


const pool = new Pool({
  user: `${process.env.USER}`,
  host: `${process.env.HOST}`,
  database: `${process.env.DATABASE}`,
  password: `${process.env.DB_PASSWORD}`,
  port: process.env.DB_PORT,
});


// Регистрация
app.post('/register', 
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').notEmpty().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { fullName, email, password } = req.body;

      // Проверка существующего пользователя
      const userExists = await pool.query(
        'SELECT email FROM users WHERE email = $1',
        [email]
      );

      if (userExists.rows.length > 0) {
        return res.status(409).json({ message: 'Пользователь уже существует' });
      }

      // Хеширование пароля
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Создание пользователя
      const newUser = await pool.query(
        `INSERT INTO users (full_name, email, password_hash) 
         VALUES ($1, $2, $3) 
         RETURNING id, email, full_name, created_at`,
        [fullName, email, hashedPassword]
      );

      // Генерация JWT
      const token = jwt.sign(
        { id: newUser.rows[0].id, email: newUser.rows[0].email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({
        token,
        user: {
          id: newUser.rows[0].id,
          fullName: newUser.rows[0].full_name,
          email: newUser.rows[0].email,
          createdAt: newUser.rows[0].created_at
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Авторизация
app.post('/login', 
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Поиск пользователя
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'Неверные учетные данные' });
      }

      const user = result.rows[0];
      
      // Проверка пароля
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(400).json({ message: 'Неверные учетные данные' });
      }

      // Генерация JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          createdAt: user.created_at
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Защищенный роут
app.get('/profile', authenticateToken, async (req, res) => {
    try {
      const user = await pool.query(
        'SELECT id, email, full_name, created_at FROM users WHERE id = $1',
        [req.user.id]
      );
      
      if (user.rows.length === 0) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
  
      res.json({
        user: user.rows[0]
    });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
});


app.get('/notes', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id; // userId берется из JWT токена
  
      const notes = await pool.query(
        'SELECT id, title, content, tags, isPinned, userId, createdOn FROM notes WHERE userId = $1',
        [userId]
      );
  
      res.json(notes.rows);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.post('/add-note', authenticateToken, async (req, res) => {
    try {
      const { title, content, tags, isPinned } = req.body;
      const userId = req.user.id; // userId берется из JWT токена
  
      if (!title || !content) {
        return res.status(400).json({ error: true, message: 'Title and content are required' });
      }
  
      const newNote = await pool.query(
        `INSERT INTO notes (title, content, tags, isPinned, userId) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, title, content, tags, isPinned, userId, createdOn`,
        [title, content, tags || [], isPinned || false, userId]
      );
  
      res.status(201).json(newNote.rows[0]);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.put('/update-note/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params; // ID заметки
      const { title, content, tags, isPinned } = req.body;
      const userId = req.user.id; // userId берется из JWT токена
  
      // Проверяем, принадлежит ли заметка пользователю
      const note = await pool.query(
        'SELECT id FROM notes WHERE id = $1 AND userId = $2',
        [id, userId]
      );
  
      if (note.rows.length === 0) {
        return res.status(404).json({ message: 'Заметка не найдена или у вас нет прав на её изменение' });
      }
  
      // Обновляем заметку
      const updatedNote = await pool.query(
        `UPDATE notes 
         SET title = $1, content = $2, tags = $3, isPinned = $4 
         WHERE id = $5 
         RETURNING id, title, content, tags, isPinned, userId, createdOn`,
        [title, content, tags || [], isPinned || false, id]
      );
  
      res.json(updatedNote.rows[0]);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
});


app.delete('/delete-note/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params; // ID заметки
      const userId = req.user.id; // userId берется из JWT токена
  
      // Проверяем, принадлежит ли заметка пользователю
      const note = await pool.query(
        'SELECT id FROM notes WHERE id = $1 AND userId = $2',
        [id, userId]
      );
  
      if (note.rows.length === 0) {
        return res.status(404).json({ message: 'Заметка не найдена или у вас нет прав на её удаление' });
      }
  
      // Удаляем заметку
      await pool.query('DELETE FROM notes WHERE id = $1', [id]);
  
      res.status(204).send(); // 204 No Content
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
});


app.get('/note/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // ID заметки
    const userId = req.user.id; // userId берется из JWT токена

    const note = await pool.query(
      'SELECT id, title, content, tags, isPinned, userId, createdOn FROM notes WHERE id = $1 AND userId = $2',
      [id, userId]
    );

    if (note.rows.length === 0) {
      return res.status(404).json({ message: 'Заметка не найдена' });
    }

    res.json(note.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.patch('/update-note-pinned/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // ID заметки
    const { isPinned } = req.body; // Новое значение isPinned
    const userId = req.user.id; // userId берется из JWT токена

    // Проверяем, принадлежит ли заметка пользователю
    const note = await pool.query(
      'SELECT id FROM notes WHERE id = $1 AND userId = $2',
      [id, userId]
    );

    if (note.rows.length === 0) {
      return res.status(404).json({ message: 'Заметка не найдена или у вас нет прав на её изменение' });
    }

    // Обновляем только поле isPinned
    const updatedNote = await pool.query(
      `UPDATE notes 
       SET isPinned = $1 
       WHERE id = $2 
       RETURNING id, title, content, tags, isPinned, userId, createdOn`,
      [isPinned, id]
    );

    res.json(updatedNote.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});



// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});