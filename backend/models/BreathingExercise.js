// model breathingExercise
const mongoose = require('mongoose')

const BreathingExerciseSchema = new mongoose.Schema({
    exercise_title: { type: String },
    exercise_description: { type: String },
    videoUrl: { type: String }, 
    date_completed: { type: Date, default: Date.now },
})

module.exports = mongoose.model('BreathingExercise', BreathingExerciseSchema)