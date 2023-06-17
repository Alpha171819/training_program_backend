const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

app.use(cors());
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

app.get("/courses", (req, ress) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query("select * from courses;", function (error, results, fields) {
    if (error) throw error;
    // connected!
    ress.json(results);
  });
  console.log("COURSES QUERIED AT", new Date().toString());
});

app.get("/subjects", (req, res) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query("select * from subjects_3;", function (error, results, fields) {
    if (error) throw error;
    // connected!
    res.json(results);
  });
  console.log("SUBJECTS QUERIED AT", new Date().toString());
});

// get single subject by id
app.get("/subjects/:id", (req, res) => {
  const id = req.params.id;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from subjects_3 where sub_id=${id};`,
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      res.json(results);
    }
  );
  console.log("SUBJECTS QUERIED AT", new Date().toString());
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
  console.log(req.body);
  const {
    sub_name,
    total_theory,
    total_practical,
    total_itp,
    total_ld,
    course_id,
    total_evng_classes,
    room_name,
  } = req.body;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `INSERT INTO subjects_3 (sub_name, total_theory, total_practical, total_itp, total_ld,  course_id, total_evng_classes, room_name) values ('${sub_name}', ${total_theory}, ${total_practical}, ${total_itp}, ${total_ld}, ${course_id}, ${total_evng_classes},'${room_name}')`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
      } else {
        resi.status(200).json({ message: "success" });
      }
    }
  );
});


// api route to add notifications
app.post("/addNotification", (req, resi) => {
  console.log(req.body);
  const {
    id,
    name,
    date,
  } = req.body;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `INSERT INTO notifications (id, name, date, isTriggered) values ('${id}', '${name}', '${date}', 0)`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
      } else {
        resi.status(200).json({ message: "success" });
      }
    }
  );
});

// api route to get notification
app.get("/getNotification", (req, resi) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from notifications where isTriggered=0;`,
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      resi.json(results);
    }
  );
  console.log("NOTIFICATIONS QUERIED AT", new Date().toString());
});



app.post("/courses", (req, ress) => {
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
  con.query("USE mceme;", (err, res, fields) => {});

  con.query(
    `INSERT INTO courses (course_name, course_officer, course_strength, start_date, end_date, no_subjects) values ('${course_name}', '${course_officer}', '${course_strength}', '${start_date}', '${end_date}', '${no_subjects}')`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
        ress.status(500).json({ message: "error" });
      } else {
        ress.status(200).json({ message: "success" });
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

app.post("/instructors", (req, ress) => {
  // instructor table has columns rank, name, inst_code

  const data = req.body;
  const { rank, name, inst_code } = data;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `INSERT INTO \`mceme\`.\`instructors\` (\`rank\`, \`name\`, \`inst_code\`) VALUES ('${rank}', '${name}', '${inst_code}')`,
    (err, res, fields) => {
      if (err) {
        console.log(err.sqlMessage);
        ress.status(500).json({ message: "error" });
      } else {
        ress.status(200).json({ message: "success" });
      }
    }
  );
});

// api route to delete a subject from subjects table
app.delete("/subjects/:id", (req, ress) => {
  const id = req.params.id;
  console.log(id);
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(`DELETE FROM subjects_3 WHERE sub_id=${id}`, (err, res, fields) => {
    if (err) {
      console.log(err);
      ress.status(500).json({ message: "error" });
    } else {
      ress.status(200).json({ message: "deleted " + id });
    }
  });
});

// update subject by id
app.put("/subjects/:id", (req, ress) => {
  const id = req.params.id;
  const data = req.body;
  console.log(id);
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `UPDATE subjects_2 SET ? WHERE sub_id=${id}`,
    data,
    (err, res, fields) => {
      if (err) {
        ress.status(500).json({ message: "error" });
        console.log(err);
      } else {
        ress.status(200).json({ message: "updated " + id });
      }
    }
  );
});

// add api route to post instructors to database

app.post("/addPreferedSubjects", (req, ress) => {
  // instructor table has columns rank, name, inst_code

  const data = req.body;
  const { inst_id, sub_id } = data;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `INSERT INTO \`mceme\`.\`instructors_subjects\` (\`inst_id\`, \`sub_id\`) VALUES ('${inst_id}', '${sub_id}')`,
    (err, res, fields) => {
      if (err) {
        console.log(err.sqlMessage);
        ress.status(500).json({ message: "error" });
      } else {
        ress.status(200).json({ message: "success" });
      }
    }
  );
});

// add api route to insert into table instructors_subjects (inst_id, sub_id)

app.post("/addPreferedTopics", (req, ress) => {
  // instructor table has columns rank, name, inst_code

  const data = req.body;
  const { inst_id, sub_id } = data;
  // sub_id is an array of sub_ids

  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `INSERT INTO \`mceme\`.\`instructors_subjects\` (\`inst_id\`, \`sub_id\`) VALUES ('${inst_id}', '${sub_id}')`
  ),
    (err, res, fields) => {
      if (err) {
        console.log(err.sqlMessage);
        ress.status(500).json({ message: "error" });
      } else {
        ress.status(200).json({ message: "success" });
      }
    };
});

// get running subjects from running_subjects table
app.get("/runningSubjects", (req, res) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    "select * from running_subjects where status=0;",
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      res.json(results);
    }
  );
  console.log("RUNNING SUBJECTS QUERIED AT", new Date().toString());
});

// delete instructor by id
app.delete("/instructors/:id", (req, ress) => {
  const id = req.params.id;
  console.log(id);
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `DELETE FROM instructors WHERE inst_id=${id}`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
        ress.status(500).json({ message: "error" });
      } else {
        ress.status(200).json({ message: "deleted " + id });
      }
    }
  );
});

// get topics by subject id
app.get("/topics/:id", (req, resi) => {
  const id = req.params.id;

  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from topics_2 where sub_id=${id};`,
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      resi.json(results);
    }
  );
  console.log("TOPICS BY SUB_ID QUERIED AT", new Date().toString());
});

// get all topics
app.get("/topics", (req, resi) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from topic_reference_2;`,
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      resi.json(results);
    }
  );
  console.log("TOPICS QUERIED AT", new Date().toString());
});

app.post("/topic", (req, resi) => {
  const data = req.body;
  const {
    cnt,
    terminal_obj,
    enabling_obj,
    learning_obj,
    bloom_level,
    LD,
    theory_cnt,
    practical_cnt,
    itp_cnt,
    evng_classes,
    sub_id,
  } = data;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `INSERT INTO topics_2 (cnt, terminal_obj, enabling_obj, learning_obj, bloom_level, LD, theory_cnt, practical_cnt, itp_cnt, evng_classes, sub_id) values (${cnt}, '${terminal_obj}', '${enabling_obj}', '${learning_obj}', '${bloom_level}', '${LD}', ${theory_cnt}, ${practical_cnt}, ${itp_cnt}, ${evng_classes}, ${sub_id})`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
      } else {
        console.log("TOPIC ADDED @", new Date().toString());
        resi.status(200).json({ message: "success" });
      }
    }
  );
});

// get the topic by sub_id
app.get("/topic/:id", (req, resi) => {
  const id = req.params.id;

  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from topics_2 where sub_id=${id};`,
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      resi.json(results);
    }
  );
  console.log("TOPIC BY SUB_ID QUERIED AT", new Date().toString());
});

// delete topic by id
app.delete("/topic/:id", (req, ress) => {
  const id = req.params.id;
  console.log(id);
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `DELETE FROM topic_reference_2 WHERE id=${id}`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
        ress.status(500).json({ message: "error" });
      } else {
        ress.status(200).json({ message: "deleted " + id });
      }
    }
  );
});

// get the running subjects and query the subjects table to get the subject name

app.get("/runningSubjects", (req, resi) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from running_subjects where status=0;`,
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      resi.json(results);
    }
  );
  console.log("RUNNING SUBJECTS QUERIED AT", new Date().toString());
});

// api route to add topic to topic_reference table which is a clone of topics table
app.post("/addTopicReference", (req, ress) => {
  const data = req.body;
  const {
    cnt,
    terminal_obj,
    enabling_obj,
    learning_obj,
    bloom_level,
    LD,
    theory_cnt,
    practical_cnt,
    itp_cnt,
    evng_classes,
    sub_id,
  } = data;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `INSERT INTO topic_reference_2 (cnt, terminal_obj, enabling_obj, learning_obj, bloom_level, LD, theory_cnt, practical_cnt, itp_cnt, evng_classes, sub_id) values (${cnt}, '${terminal_obj}', '${enabling_obj}', '${learning_obj}', '${bloom_level}', '${LD}', ${theory_cnt}, ${practical_cnt}, ${itp_cnt}, ${evng_classes}, ${sub_id})`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
      } else {
        console.log("TOPIC ADDED @", new Date().toString());
        ress.status(200).json({ message: "success" });
      }
    }
  );
});

// get the 6 days topics from topic_reference table
app.get("/getSixDayTopics/:id", (req, resi) => {
  const id = req.params.id;
  let bigArray = [];
  let smallArray = [];
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from topic_reference_2 where sub_id=${id};`,
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      let topics = results;
      topics.map((topic, idx) => {
        while (topic.total > 0) {
          // add to smallArray
          smallArray.push({ id: topic.id, topic: topic.learning_obj });
          topic.total -= 1;
          if (smallArray.length == 4) {
            bigArray.push(smallArray);
            smallArray = [];
          }
        }
      });

      bigArray.push(smallArray);
      // remove duplicates from each array in bigArray
      bigArrayWithoutDuplicates = [];
      bigArray.forEach((arr) => {
        const unique = arr.filter(
          (obj, index) => arr.findIndex((item) => item.id === obj.id) === index
        );
        bigArrayWithoutDuplicates.push(unique);
      });

      resi.json(bigArrayWithoutDuplicates);
      // return topic;
    }
  );
  console.log("TOPIC BY SUB_ID QUERIED AT", new Date().toString());
});

// api route to get topic_reference table
app.get("/topicReference/:id", (req, resi) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from topic_reference_2 where sub_id=${req.params.id};`,
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      resi.json(results);
    }
  );
});

// api route to delete course from courses table
app.delete("/courses/:id", (req, ress) => {
  const id = req.params.id;
  console.log(id);
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(`DELETE FROM courses WHERE course_id=${id}`, (err, res, fields) => {
    if (err) {
      console.log(err);
      ress.status(500).json({ message: "error" });
    } else {
      ress.status(200).json({ message: "deleted " + id });
    }
  });
});

// api route to delete topic from topic_reference table
app.delete("/topicReference/:id", (req, ress) => {
  const id = req.params.id;
  console.log(id);
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `DELETE FROM topic_reference WHERE id=${id}`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
        ress.status(500).json({ message: "error" });
        console.log(
          "TOPIC FROM REFERENCE TABLE DELETED @",
          new Date().toString()
        );
      } else {
        ress.status(200).json({ message: "deleted " + id });
      }
    }
  );
});

// api to add users
app.post("/addUser", (req, ress) => {
  const data = req.body;
  const { name, username, password } = data;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `INSERT INTO users (name, email, password) values ('${name}', '${username}', '${password}')`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
      } else {
        console.log("USER ADDED @", new Date().toString());
        ress.status(200).json({ message: "success" });
      }
    }
  );
});

// api to get users
app.get("/users", (req, ress) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(`select * from users`, (err, res, fields) => {
    if (err) {
      console.log(err);
    } else {
      console.log("USERS QUERIED @", new Date().toString());
      ress.status(200).json(res);
    }
  });
});

// api to delete user
app.delete("/users/:id", (req, ress) => {
  const id = req.params.id;
  console.log(id);
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(`DELETE FROM users WHERE id=${id}`, (err, res, fields) => {
    if (err) {
      console.log(err);
      ress.status(500).json({ message: "error" });
    } else {
      ress.status(200).json({ message: "deleted " + id });
    }
  });
});
