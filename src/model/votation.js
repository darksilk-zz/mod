const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const votationSchema = Schema({
  poll_id: String,
  question: String,
  answer: String,
  municipio: String,
  estado: String,
  sex: String,
  age: String
});

module.exports = mongoose.model('Votation', votationSchema);

/*const answersSchema = Schema({
    answers: [{}]
});
const QuestionSchema = Schema({
    question: { type: String, required: true },
    //answers: [answersSchema]
    answers: { type: [answersSchema] } 
});

module.exports = mongoose.model('Poll', QuestionSchema);*/