const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteControlSchema = Schema({
  person_id: String,
  polls:[{}]
});

module.exports = mongoose.model('VoteControl', voteControlSchema);

/*const answersSchema = Schema({
    answers: [{}]
});
const QuestionSchema = Schema({
    question: { type: String, required: true },
    //answers: [answersSchema]
    answers: { type: [answersSchema] } 
});

module.exports = mongoose.model('Poll', QuestionSchema);*/