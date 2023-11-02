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
  password: "Shiva@1802",
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

app.get("/subjectsssss/:course", (req, res) => {
  const course = req.params.course;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(`select * from subjects_3 where course_id=${course};`, function (error, results, fields) {
    if (error) throw error;
    // connected!
    res.json(results);
  });
  console.log("SUBJECTS QUERIED AT", new Date().toString());
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

//get all topics from exp table
app.get("/settingtopicsfromexp", (req, resss) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(`SELECT distinct subject_id, subjects_3.total FROM mceme.exp inner join mceme.subjects_3 on mceme.exp.subject_id = mceme.subjects_3.sub_id order by subject_id ;`,
  function (error, results, fields) {
    if (error) throw error; 
    resss.json(results)

    results.map((item,idx)=>{
      // get topics from exp table
      con.query("USE mceme;", (err, res, fields) => {});
      con.query(`SELECT id, subject_id FROM mceme.exp where subject_id=${item.subject_id};`,
      function (error, results, fields) {
        if (error) throw error; 
        console.log(results, 'results')
        results.map((item,idx)=>{
          // get topics from exp table
          con.query("USE mceme;", (err, res, fields) => {});
          con.query(`update mceme.exp set count = ${idx+1} where id = ${item.id};`,
          function (error, results, fields) {
            if (error) throw error; 
            // resss.json(results)
          })
          console.log(item.id, 'item')
        })
       
      }
    );
      
    })


  });
});

app.get("/settingtopicsfromexp_2", (req, resss) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(`SELECT distinct subject_id, subjects_3.total FROM mceme.exp_2 inner join mceme.subjects_3 on mceme.exp_2.subject_id = mceme.subjects_3.sub_id order by subject_id ;`,
  function (error, results, fields) {
    if (error) throw error; 
    resss.json(results)

    results.map((item,idx)=>{
      // get topics from exp_2 table
      con.query("USE mceme;", (err, res, fields) => {});
      con.query(`SELECT id, subject_id FROM mceme.exp_2 where subject_id=${item.subject_id};`,
      function (error, results, fields) {
        if (error) throw error; 
        console.log(results, 'results')
        results.map((item,idx)=>{
          // get topics from exp_2 table
          con.query("USE mceme;", (err, res, fields) => {});
          con.query(`update mceme.exp_2 set count = ${idx+1} where id = ${item.id};`,
          function (error, results, fields) {
            if (error) throw error; 
            // resss.json(results)
          })
          console.log(item.id, 'item')
        })
       
      }
    );
      
    })


  });
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
    `INSERT INTO subjects_3 (sub_name, total_theory, total_practical, total_itp, total_ld,  course_id, total_evng_classes, room_name, running_status) values ('${sub_name}', ${total_theory}, ${total_practical}, ${total_itp}, ${total_ld}, ${course_id}, ${total_evng_classes},'${room_name}', ${0})`,
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

// api route to get notifications

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





app.delete("/deleteNotification/:id", (req, res) => {
  const id = req.params.id;
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `DELETE FROM notifications WHERE id="${id}"`,
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      res.json(results);
    }
  );
});


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
    "select * from subjects_3 where running_status=0;",
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
   
    terminal_obj,
    enabling_obj,
    learning_obj,
    blooms_level,
    LD,
    theory_cnt,
    practical_cnt,
    itp_cnt,
    evening_classes,
    sub_id,
    course_id,
  } = data;

  let tempLD = LD;
  let temptheory_cnt = theory_cnt;
  let temppractical_cnt = practical_cnt;
  let tempitp_cnt = itp_cnt;
let tempevening_classes = evening_classes;
con.query("USE mceme;", (err, res, fields) => {});

  while(tempLD--){
  con.query(
    `INSERT INTO exp ( terminal_obj, enabling_obj, learning_objl, blooms_level, LD, theory_cnt, practical_cnt, itp_cnt, evening_cnt, subject_id,topic_status, course_id) values ( '${terminal_obj}', '${enabling_obj}', '${learning_obj}', ${blooms_level}, ${1}, ${0}, ${0}, ${0}, ${0}, ${sub_id},${0},${course_id})`,
   
  );
  }


  while(temptheory_cnt--){
  con.query(
    `INSERT INTO exp ( terminal_obj, enabling_obj, learning_objl, blooms_level, LD, theory_cnt, practical_cnt, itp_cnt, evening_cnt, subject_id,topic_status, course_id) values ( '${terminal_obj}', '${enabling_obj}', '${learning_obj}', ${blooms_level}, ${0}, ${1}, ${0}, ${0}, ${0}, ${sub_id},${0},${course_id})`,
   
  );
  }


  while(temppractical_cnt--){
  con.query(
    `INSERT INTO exp ( terminal_obj, enabling_obj, learning_objl, blooms_level, LD, theory_cnt, practical_cnt, itp_cnt, evening_cnt, subject_id,topic_status, course_id) values ( '${terminal_obj}', '${enabling_obj}', '${learning_obj}', ${blooms_level}, ${0}, ${0}, ${1}, ${0}, ${0}, ${sub_id},${0},${course_id})`,
    
  );
  }

  while(tempitp_cnt--){
  con.query(
    `INSERT INTO exp ( terminal_obj, enabling_obj, learning_objl, blooms_level, LD, theory_cnt, practical_cnt, itp_cnt, evening_cnt, subject_id,topic_status, course_id) values ( '${terminal_obj}', '${enabling_obj}', '${learning_obj}', ${blooms_level}, ${0}, ${0}, ${0}, ${1}, ${0},${sub_id},${0}, ${course_id})`,
   
  );
  }

  while(tempevening_classes--){
  con.query(
    `INSERT INTO exp ( terminal_obj, enabling_obj, learning_objl, blooms_level, LD, theory_cnt, practical_cnt, itp_cnt, evening_cnt, subject_id,topic_status, course_id) values ( '${terminal_obj}', '${enabling_obj}', '${learning_obj}', ${blooms_level}, ${0}, ${0}, ${0}, ${0}, ${1},${sub_id},${0}, ${course_id})`,
   
  );
  }
  
  

  
   
  

  
});

app.get("/topic/:id/:course_id", (req, resi) => {
  const course_id = req.params.course_id;
  const id = req.params.id;
  console.log("subjectid broooo",id);
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from exp where subject_id=${id} and course_id=${course_id};`,
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      resi.json(results);
    }
  );
  console.log("TOPIC BY SUB_ID QUERIED AT", new Date().toString());
});


// get the topic by sub_id
app.get("/topic/:id", (req, resi) => {
  const id = req.params.id;
  console.log("subjectid broooo",id);
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from exp where subject_id=${id};`,
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
    `DELETE FROM exp WHERE id=${id}`,
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

app.get("/uncompletedSubjects", (req, resi) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from subjects_3 where running_status=0;`,
    function (error, results, fields) {
      if (error) throw error;
      // connected!
      resi.json(results);
    }
  );
  console.log("RUNNING SUBJECTS QUERIED AT", new Date().toString());
});
app.get("/completedSubjects", (req, resi) => {
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `select * from subjects_3 where running_status=1;`,
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






app.get('/getCompletedSubjectNames', (req, resi) => {

var resultsArr = []
  
  con.query("USE mceme;", (err, res, fields) => {});
  con.query("select distinct subject_id from exp;", function (error, results, fields) {
    if (error) throw error; 
    console.log(results, 'subject ids')
    results.map((id,idx)=>{

      con.query(
        `(SELECT if (
          (SELECT COUNT(*) FROM exp WHERE subject_id = ${id.subject_id} AND topic_status = 1) = 
          (SELECT COUNT(*) FROM exp WHERE subject_id = ${id.subject_id})
          , 1 ,0)  as CompletedSubject)`,
        function async (error, results, fields) {
          if (error) throw error;
          resultsArr.push([...results, sub_id = id.subject_id])
          if(results[0].CompletedSubject==1){
            con.query("USE mceme;", (err, res, fields) => {});
            con.query(
              `UPDATE subjects_3 SET running_status=1 WHERE sub_id=${id.subject_id}`,
              (err, res, fields) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(
                    "RUNNING SUBJECT STATUS CHANGED TO 1 @",
                    new Date().toString()
                  );
                }
              }
            );
          }


      console.log(results,+id.subject_id+ 'sdfjklasdjflkajdf')

          // connected!

        
          
        }
      );
     
        
    })
    resi.json(resultsArr)

      console.log(resultsArr, 'resultsArr')

  });

  con.query("select distinct subject_id from exp_2;", function (error, resultsss, fields) {
    if (error) throw error; 
    resultsss.map((id,idx)=>{
  
      con.query(
        `(SELECT if (
          (SELECT COUNT(*) FROM exp_2 WHERE subject_id = ${id.subject_id} AND topic_status = 1) = 
          (SELECT COUNT(*) FROM exp_2 WHERE subject_id = ${id.subject_id})
          , 1 ,0)  as CompletedSubject)`,
        function (error, resultsss, fields) {
          if (error) throw error;
          console.log(resultsss,+id.subject_id+ 'sdfjklasdjflkajdf')
          if(resultsss[0].CompletedSubject==1){
            con.query("USE mceme;", (err, res, fields) => {});
            con.query(
              `UPDATE subjects_3 SET running_status=1 WHERE sub_id=${id.subject_id}`,
              (err, res, fields) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(
                    "RUNNING SUBJECT STATUS CHANGED TO 1 @",
                    new Date().toString()
                  );
                }
              }
            );
          }
          resultsArr.push(resultsss)

          // connected!
          // resultsArr.push(results)
        }
      );
        
    })
    
  });
 
  console.log("COMPLETED SUBJECTS QUERIED AT", new Date().toString());
}); 



// api route to get first subject topics from exp table

app.get("/getFirstSubjectTopics", (req, resi) => {
  let array24 = [];
  con.query("USE mceme;", (err, res, fields) => {});

  con.query(
    `SELECT * FROM mceme.exp inner join mceme.subjects_3 on mceme.exp.subject_id = mceme.subjects_3.sub_id where topic_status =0 order by subject_id limit 24;`,
    function (error, results, fields) {
      if (error) throw error;
      else{
        // console.log("firstsubjects data",results);
      }
      // console.log(results);
     // connected!
      let topics = results;
      console.log("topics  of 1st subject",topics);
    // for(let i=0;i<24;i++){
    //   if (topics[i] === undefined) {
    //     // api to change the running subject status to 1

    //     con.query("USE mceme;", (err, res, fields) => {});
    //     con.query(
    //       `UPDATE subjects_3 SET running_status=1 WHERE sub_id=${id}`,

    //       (err, res, fields) => {
    //         if (err) {
    //           console.log(err);
    //         } else {
    //           console.log(
    //             "RUNNING SUBJECT STATUS CHANGED TO 1 @",
    //             new Date().toString()
    //           );
    //         }
    //       }
    //     );
    //     break;

    //   }
    //   array24.push(topics[i]);
    // }
    // console.log(array24);

    resi.json(topics)
    }
  );
  console.log("TOPIC BY SUB_ID QUERIED AT", new Date().toString());
}
);


// api route to get second subject topics from exp table

app.get("/getSecondSubjectTopics", (req, resi) => {
       
  let array18 = [];
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `SELECT * FROM mceme.exp_2 inner join mceme.subjects_3 on mceme.exp_2.subject_id = mceme.subjects_3.sub_id where topic_status =0 order by subject_id limit 18 ;`,
    function (error, results, fields) {
      if (error) throw error;
      else{
      
      }
      let topics = results;
      console.log("topics  of 2nd subject",topics);
      // console.log(results);
     // connected!
      // let topics = results;
    // for(let i=0;i<18;i++){
    //   if (topics[i] === undefined) {
    //     // api to change the running subject status to 1

    //     con.query("USE mceme;", (err, res, fields) => {});
    //     con.query(
    //       `UPDATE subjects_3 SET running_status=1 WHERE sub_id=${id}`,
    //       (err, res, fields) => {
    //         if (err) {
    //           console.log(err);
    //         } else {
    //           console.log(
    //             "RUNNING SUBJECT STATUS CHANGED TO 1 @",
    //             new Date().toString()
    //           );
    //         }
    //       }
    //     );
    //     break;

    //   }
    //   array18.push(topics[i]);
    // }
    // console.log(array18);
    resi.json(topics)
    }
  );
  console.log("TOPIC BY SUB_ID QUERIED AT", new Date().toString());
}
);

// api route tp get the saved time table from the client

app.post("/savetimetable", (req, ress) => {


  const data = req.body;
  // destructuring the data
  const {
    firstSubjectTopics,
    secondSubjectTopics,
  } = data;
firstSubjectTopics.map((item,idx)=>{
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `UPDATE exp SET topic_status=1 WHERE id=${item.id}`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
      } else {
        console.log(
          "TOPIC STATUS CHANGED TO 1 @",
          new Date().toString()
        );
      }
    }
  );
}
)
secondSubjectTopics.map((item,idx)=>{
  con.query("USE mceme;", (err, res, fields) => {});
  con.query(
    `UPDATE exp_2 SET topic_status=1 WHERE id=${item.id}`,
    (err, res, fields) => {
      if (err) {
        console.log(err);
      } else {
        console.log(
          "TOPIC STATUS CHANGED TO 1 @",
          new Date().toString()
        );
      }
    }
  );
}
)




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

