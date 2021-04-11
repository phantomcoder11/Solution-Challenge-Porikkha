const express = require('express');
const app = express();
const classroomRouter = require('./routers/classroom');
const teacherRouter = require('./routers/teacher');
const studentRouter = require('./routers/student');
const McqRouter = require('./routers/Mcq');
const FillUpRouter = require('./routers/FillUp');
const ObjExamRouter = require('./routers/objective_Exam');
const StudentObjRouter = require('./routers/studentObj');

const path = require('path');

const cors = require("cors");

const examRouter = require('./routers/exam');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/classroom', classroomRouter);
app.use('/teacher', teacherRouter);
app.use('/exam', examRouter);
app.use('/student', studentRouter);
app.use('/mcqs',McqRouter);
app.use('/fill_up',FillUpRouter);
app.use('/objective_exam',ObjExamRouter);
app.use('/student_objective_exam',StudentObjRouter);

//Serve the static assets if in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, ' client ', ' build ', 'index.html'));
  });
}

module.exports = app;
