// SyrveCloud configuration
const SYRVECLOUD_URL = 'https://api-eu.iiko.services/api/1/';
const SYRVECLOUD_API_LOGIN = '5d978faf-b45'


// Require packages and set the port 
const express = require('express');
const port = 3002;
const app = express();

// Start the server 
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});


/* возвращает токен авторизации в SyrveCloud API */
app.get('/auth', (request, response) => {
    console.log(`URL: ${request.url}`);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;' },
        body: JSON.stringify({ "apiLogin": SYRVECLOUD_API_LOGIN })
    };

    const result = fetch(`${SYRVECLOUD_URL}access_token`, requestOptions)
        .then((result) => result.json())
        .then((data) => response.send(data));
});