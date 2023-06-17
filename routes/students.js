let Student = require('../model/student');

// Récupérer tous les students (GET)
function getStudentsSansPagination(req, res){
    Student.find((err, students) => {
        if(err){
            res.send(err)
        }

        res.send(students);
    });
}

function getStudents(req, res) {
    var aggregateQuery = Student.aggregate();
    
    Student.aggregatePaginate(aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, students) => {
        if (err) {
          res.send(err);
        }
        res.send(students);
      }
    );
   }
   
// Récupérer un student par son id (GET)
function getStudent(req, res){
    let studentId = req.params.id;

    Student.findOne({id: studentId}, (err, student) =>{
        if(err){res.send(err)}
        res.json(student);
    })
}

// Ajout d'un student (POST)
function postStudent(req, res){
    let student = new Student();
    student.id = req.body.id;
    student.name = req.body.name;
    student.firstname = req.body.firstname;
    student.class = req.body.class;
    student.year = req.body.year;
    student.picture = req.body.picture;

    console.log("POST student reçu :");
    console.log(student)

    student.save( (err) => {
        if(err){
            res.send('cant post student ', err);
        }
        res.json({ message: `${student.nom} saved!`})
    })
}

// Update d'un student (PUT)
function updateStudent(req, res) {
    console.log("UPDATE recu student : ");
    console.log(req.body);
    
    Student.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, student) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: student.name + 'updated'})
        }

      // console.log('updated ', student)
    });

}

// suppression d'un student (DELETE)
function deleteStudent(req, res) {

    Student.findByIdAndRemove(req.params.id, (err, student) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${student.nom} deleted`});
    })
}



module.exports = { getStudents, postStudent, getStudent, updateStudent, deleteStudent };
