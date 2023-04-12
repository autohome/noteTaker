const express = require('express');
const path = require('path');

const api = require('./routes/index.js')

const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Invoke app.use() and serve static files from the '/public' folder
app.use(express.static('public'));


// modular routing for /api
app.use('/api', api);

// Invoke app.use() and serve static files from the '/public' folder
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Create a route that will serve up the `public/paths.html` page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
