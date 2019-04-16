const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = Schema({
  question: String,
  description: String, 
  dateStart: String,
  dateEnd: String,
  dateStarEpoch: String, 
  dateEndEpoch: String,
  active: Number,
  created_at: Date,
  created_by: String,
  answers: [{}]
});

module.exports = mongoose.model('Polls', pollSchema);

/*const answersSchema = Schema({
    answers: [{}]
});

const QuestionSchema = Schema({
    question: { type: String, required: true },
    //answers: [answersSchema]
    answers: { type: [answersSchema] } 
});

module.exports = mongoose.model('Poll', QuestionSchema);*/