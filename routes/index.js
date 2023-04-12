const api = require('express').Router();
// const api = express.Router();
// Helper method for generating unique ids
const uuid = require('../helpers/uuid');
const fs = require('fs');
const path = require("path");

const notesDB = require('../db/db.json')

// Sets up the Express app to handle data parsing
// api.use(express.urlencoded({ extended: true }));
// api.use(express.json());

// Invoke app.use() and serve static files from the '/public' folder
// api.use(express.static('public'));

api.get('/notes', (req, res) => {
    console.info(`${req.method} request received to get notes`);
    res.json(notesDB);
});

api.post('/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    
    // destructure the assignment for the items in req.body
    const { title, text } = req.body;

    // if all reqired props are present
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        }

        const response = {
            status: 'success',
            body: newNote,
        };
        // push new note
        const notesData = JSON.parse(fs.readFileSync('./db/db.json'))
        notesData.push(newNote)
        
        fs.writeFile(`./db/db.json`, JSON.stringify(notesData, null, 3) , (err) =>
            err
            ? console.error(err)
            : console.info(`Note for ${newNote.title} has been written to JSON file`)
        );
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    }
});

// Delete route that returns any specific note
api.delete('/notes/:id', (req, res) => {
    if (req.params.id) {
    console.info(`${req.method} request received to delete a single note`);
    const noteId = req.params.id;
    for (let i = 0; i < notesDB.length; i++) {
        const currentNote = notesDB[i];
        if (currentNote.id === noteId) {
            res.status(200).json(currentNote);
            const notesData = JSON.parse(fs.readFileSync('./db/db.json'))
            notesDB.splice(i, 1)
            fs.writeFile(`./db/db.json`, JSON.stringify(notesData) , (err) =>
            err
                ? console.error(err)
                : console.log(`Review for ${currentNote.title} has been written to JSON file`)
            )
        }
    }
    res.status(404).send('Review not found');
    } else {
        res.status(400).send('Review ID not provided');
    }
});
