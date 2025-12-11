require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const UserRoutes = require('./routes/userRoutes')
const quoteRoutes = require('./routes/quoteRoutes');
const journalRoutes = require('./routes/journalRoutes')
const BreathingExerciseRoutes = require('./routes/breathingExerciseRoutes')
const CompletedQuoteRoutes = require('./routes/completedQuoteRoutes');
const CompletedBreathingExerciseRoutes = require('./routes/completedBreathingExerciseRoutes')
const CompletedJournalRoutes = require('./routes/completedJournalRoutes')

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(session({
    secret: process.env.SECRET_KEY || 'secret@123619',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/api/users', UserRoutes)
app.use('/api/quotes', quoteRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/breathingExercise', BreathingExerciseRoutes)
app.use('/api/completedQuotes', CompletedQuoteRoutes);
app.use('/api/completedBreathingExercises', CompletedBreathingExerciseRoutes)
app.use('/api/completedJournal', CompletedJournalRoutes)

// Routes
app.get('/', (req, res) => {
    res.send('MindfulMinutes API is running fine...');
});

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app
