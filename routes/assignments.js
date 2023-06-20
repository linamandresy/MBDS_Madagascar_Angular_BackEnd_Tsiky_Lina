const { ObjectId } = require('mongodb');
let Assignment = require('../model/assignment');
let usersRoute = require('../routes/users');
// Récupérer tous les assignments (GET)
function getAssignmentsSansPagination(req, res) {
    Assignment.find((err, assignments) => {
        if (err) {
            res.send(err)
        }

        res.send(assignments);
    });
}

function getAssignmentsByRendu(req, res) {
    let isRendu = (req.params.rendu==='true');

    // Assignment.find({ rendu: isRendu }, (err, assignment) => {
    //     if (err) { res.send(err) }
    //     res.json(assignment);
    // })

    var aggregateQuery = Assignment.aggregate([{
            $match:{ 
                rendu: isRendu 
            }
        }
        ,{
        $lookup: {
            from: 'matieres',
            localField: 'idMatiere',
            foreignField: '_id',
            as: 'matiere'
        }
    }, {
        $lookup: {
            from: 'students',
            localField: 'idAuthor',
            foreignField: '_id',
            as: 'auteur'
        }
    }
    ]);
    Assignment.aggregatePaginate(
        aggregateQuery,
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

function getAssignments(req, res) {
    var aggregateQuery = Assignment.aggregate([{
        $lookup: {
            from: 'matieres',
            localField: 'idMatiere',
            foreignField: '_id',
            as: 'matiere'
        }
    }, {
        $lookup: {
            from: 'students',
            localField: 'idAuthor',
            foreignField: '_id',
            as: 'auteur'
        }
    }
    ]);
    console.log(aggregateQuery);
    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, assignments) => {
            if (err) {
                res.send(err);
            }
            console.log(assignments);
            res.send(assignments);
        }
    );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;

    Assignment.findOne({ _id: ObjectId(assignmentId) }, (err, assignment) => {
        if (err) { res.send(err) }
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
    console.log(req.body);
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.idAuthor = ObjectId(req.body.idAuthor);
    assignment.idMatiere = ObjectId(req.body.idMatiere);
    assignment.note = req.body.note;
    assignment.remarque = req.body.remarque;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save((err) => {
        if (err) {
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!` })
    })
}

// Update d'un assignment (PUT)
async function updateAssignment(req, res) {
    try {
        let isAdmin = await usersRoute.checkConnection(req, res);
        if (!isAdmin) return res.status(403).send("Only admin can update assignments");
        console.log("UPDATE recu assignment : ");
        let assignment = {        
            id : req.body.id,
            nom : req.body.nom,
            dateDeRendu : req.body.dateDeRendu,
            rendu : req.body.rendu,
            idAuthor : ObjectId(req.body.idAuthor),
            idMatiere : ObjectId(req.body.idMatiere),
            note : req.body.note,
            remarque : req.body.remarque,
        };

        if(assignment.note<0 || assignment.note>20) {
            throw new Error('Note invalide');
        }

        // code pris sur stack overflow
        console.log(assignment);
        Assignment.findByIdAndUpdate(ObjectId(req.body._id), assignment, { new: true }, (err, assignment) => {
            if (err ) {
                console.log(err);
                if(!res.closed) res.send(err)
            } else {
                if(!res.closed) res.json({ message: assignment.nom + 'updated' })
            }

            // console.log('updated ', assignment)
        });
    } catch (error) {
        if(!res.closed) res.status(400).json({message:error.message});
    }

}

// suppression d'un assignment (DELETE)
async function deleteAssignment(req, res) {
    let isAdmin = await usersRoute.checkConnection(req, res);
    if (!isAdmin) return res.status(403).send("Only admin can update assignments");
    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: `${assignment.nom} deleted` });
    })
}



module.exports = { getAssignments, getAssignmentsByRendu, postAssignment, getAssignment, updateAssignment, deleteAssignment };
