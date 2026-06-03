const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SmartHome API is running!' });
});

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/groceries',     require('./routes/groceries'));
app.use('/api/expenses',      require('./routes/expenses'));
app.use('/api/tasks',         require('./routes/tasks'));
app.use('/api/household',     require('./routes/household'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/suggestions',   require('./routes/suggestions'));
app.use('/api/bills',         require('./routes/bills'));
app.use('/api/location',      require('./routes/location'));
app.use('/api/recipes',       require('./routes/recipes'));
app.use('/api/emergency',     require('./routes/emergency'));
app.use('/api/chat',          require('./routes/chat'));

module.exports = app;