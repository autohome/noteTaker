const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');


const app = express();
const PORT = 3001;

const notesDB = require('./db/db.json')

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Invoke app.use() and serve static files from the '/public' folder
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Create a route that will serve up the `public/paths.html` page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get notes`);
    res.json(notesDB);
});

app.post('/api/notes', (req, res) => {
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

        fs.writeFile(`./db/db.json`, JSON.stringify(notesData) , (err) =>
        err
        ? console.error(err)
        : console.log(
            `Review for ${newNote.title} has been written to JSON file`
        )
    );

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    }
});

// const deleteNote = (id) =>
//   fetch(`/api/notes/${id}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

// Delete route that returns any specific note
app.delete('/api/notes/:id', (req, res) => {
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
                : console.log(`Review for ${newNote.title} has been written to JSON file`)
            )
        }
    }
    res.status(404).send('Review not found');
    } else {
        res.status(400).send('Review ID not provided');
    }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);