let Assignment = require('../model/assignment');
let usersRoute = require('../routes/users');
// Récupérer tous les assignments (GET)
function getAssignmentsSansPagination(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}

function getAssignmentsByRendu(req, res) {
    let isRendu = req.params.rendu;

    Assignment.find({rendu: isRendu}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

function getAssignments(req, res) {
    var aggregateQuery = Assignment.aggregate();
    
    Assignment.aggregatePaginate(aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, assignments) => {
        if (err) {
          res.send(err);
        }
        res.send(assignments);
      }
    );
   }
   
// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.idAuthor = req.body.idAuthor;
    assignment.idMatiere = req.body.idMatiere;
    assignment.note = req.body.note;
    assignment.remarque = req.body.remarque;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
async function updateAssignment(req, res) {
    let isAdmin = await usersRoute.checkConnection(req,res);
    if(!isAdmin) res.status(403).send("Only admin can update assignments");
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: assignment.nom + 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
async function deleteAssignment(req, res) {
    let isAdmin = await usersRoute.checkConnection(req,res);
    if(!isAdmin) res.status(403).send("Only admin can update assignments");
    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}



module.exports = { getAssignments, getAssignmentsByRendu, postAssignment, getAssignment, updateAssignment, deleteAssignment };
