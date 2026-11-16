// Load the Express framework library to create a local network server
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to automatically parse incoming JSON data payloads inside network requests
app.use(express.json());

// Serve static web pages from a public folder directory so everything loads locally
app.use(express.static('public'));

// Temporary server-side database array memory cache holding register profiles
let userDatabase = [];

// 1. ENDPOINT FOR REGISTRATION: Receives profile metrics and saves them securely
app.post('/api/register', (req, res) => {
    const { username, email, password, teach, learn } = req.body;

    // Data validation check: Ensure no parameters are empty
    if (!username || !email || !password || !teach || !learn) {
        return res.status(400).json({ message: "Server Log: All text inputs must be populated." });
    }

    // Uniqueness validation check: Prevent duplicate account signatures
    const userExists = userDatabase.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (userExists) {
        return res.status(400).json({ message: "Data Conflict: That username profile is already registered." });
    }

    // Build the data profile tracking object layout map structure
    const dynamicNewProfile = {
        username,
        email,
        password,
        teach,
        learn,
        incomingRequests: [],
        acceptedConnections: [],
        uploadedVideos: {} // Maps target partner tokens to video asset files
    };

    userDatabase.push(dynamicNewProfile);
    return res.status(201).json({ message: "Profile committed safely into database matrix memory!" });
});

// 2. ENDPOINT FOR GATEWAY LOGIN: Verifies credentials to authorize tracking access tokens
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const accountFound = userDatabase.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    
    if (!accountFound) {
        return res.status(401).json({ message: "Access Denied: Invalid credentials submitted." });
    }

    // Return the authorized account record snapshot data object payload structure details
    return res.status(200).json({ message: "Authentication successful!", user: accountFound });
});

// 3. ENDPOINT TO FETCH COMPATIBLE MATCHES: Performs text validation scans automatically
app.get('/api/matches/:username', (req, res) => {
    const activeUsername = req.params.username;
    const targetUser = userDatabase.find(u => u.username === activeUsername);

    if (!targetUser) return res.status(404).json({ message: "Profile tracking match error." });

    // Filter array records for matches: Where target user's target competency matches peer's expertise
    const derivedSystemMatches = userDatabase.filter(u => 
        u.username !== targetUser.username && 
        u.teach.toLowerCase() === targetUser.learn.toLowerCase()
    );

    return res.status(200).json(derivedSystemMatches);
});

// Fire up the network listener routing engine server on your local machine port grid
app.listen(PORT, () => {
    console.log(`[SERVER ACTIVE]: Access workspace layout terminal at: http://localhost:${PORT}`);
});


