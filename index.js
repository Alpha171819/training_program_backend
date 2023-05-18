const express = require("express");
var bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const mysql = require("mysql");


app.use(cors())
app.listen(3131, () => {
  console.log("listening on 3131");
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "THankyou12@!",
});

app.use(bodyParser.json());

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/courses", (req, res) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query("select * from courses;", function (error, results, fields) {
    if (error) throw error;
    // connected!
    res.json(results);
  });
  console.log("COURSES QUERIED AT", new Date().toString());
});



app.get("/subjects", (req, res) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query("select * from subjects;", function (error, results, fields) {
    if (error) throw error;
    // connected!
    res.json(results);
  });
  console.log("SUBJECTS QUERIED AT", new Date().toString());

});

app.get("/topics", (req, res) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query("select * from topics;", function (error, results, fields) {
    if (error) throw error;
    // connected!
    res.json(results);
  });
  console.log("TOPICS QUERIED AT", new Date().toString());

});

app.get("/instructors", (req, res) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query("select * from instructors;", function (error, results, fields) {
    if (error) throw error;
    // connected!
    res.json(results);
  });
  console.log("INSTRUCTORS QUERIED AT", new Date().toString());
});

app.post("/subjects", (req, resi) => {
  const data = req.body;
  console.log(req.query)
  const { sub_name, total_theory, total_practical, total_itp, course_id } = req.query;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `INSERT INTO subjects (sub_name, total_theory, total_practical, total_itp, course_id) values ('${sub_name}', ${total_theory}, ${total_practical}, ${total_itp}, ${course_id})`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
      }else {
        resi.status(200).json({ message: "success" });
      }
    }
  );
});

app.post("/courses", (req, res) => {
  const data = req.body;
  const {
    course_name,
    course_officer,
    course_strength,
    start_date,
    end_date,
    no_subjects,
  } = data;
  // write query to insert the above data into courses table

  con.query(
    `INSERT INTO courses (course_name, course_officer, course_strength, start_date, end_date, no_subjects) values (${course_name}, ${course_officer}, ${course_strength}, ${start_date}, ${end_date}, ${no_subjects})`,
    (err, res, fields) => {
      if (err) {
        res.status(500).json({ message: "error" });
      } else {
        res.status(200).json({ message: "success" });
      }
    }
  );
});

app.post("/topics", (req, res) => {
  const data = req.body;
  const { topic_name, subject_id, topic_count } = data;
  // write query to insert the above data into topics table

  con.query(
    `INSERT INTO topics (topic_name, subject_id, topic_count) values (${topic_name}, ${subject_id}, ${topic_count})`,
    (err, res, fields) => {
      if (err) {
        res.status(500).json({ message: "error" });
      } else {
        res.status(200).json({ message: "success" });
      }
    }
  );
});

app.post("/instructors", (req, res) => {
  // instructor table has columns rank, name, inst_code
  const data = req.body;
  const { rank, name, inst_code } = data;

  con.query(
    `INSERT INTO instructors (rank, name, inst_code) values (${rank}, ${name}, ${inst_code})`,
    (err, res, fields) => {
      if (err) {
        res.status(500).json({ message: "error" });
      } else {
        res.status(200).json({ message: "success" });
      }
    }
  );
});



// api route to delete a subject from subjects table
app.delete("/subjects", (req, ress) => {
  const { sub_name } = req.query;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(`DELETE FROM subjects WHERE sub_name='${sub_name}'`, (err, res, fields) => {
    if (err) {
      ress.status(500).json({ message: "error" });
    } else {
      ress.status(200).json({ message: "deleted " + sub_name });
    }
  });
});