const express = require('express');
const jwt = require('jsonwebtoken');

const jwtSecretKey =  'my-private-secret-key';

const generateToken = (req) => {

    return jwt.sign({ userId: 1, rule: 'admin' }, jwtSecretKey);
};

const validateToken = (req, res, next) => {
    
    const token = (req.headers.authorization || '').replace(/bearer\s/i, '');
    console.log('validate token', {token});

    let tokenError = '';
    try {
        if (token === '')
            tokenError = 'Token is required';
        else {
            const tokenPayload = token && jwt.verify(token, jwtSecretKey);
            console.log('token payload', { tokenPayload });
        }
    }
    catch(error) {
        tokenError = error.message;
    }

    if (tokenError) {
        res.status(401).send(tokenError);
        return;
    }

    next();
};

const app = express();

app.get('/', (req, res) => {

    res.send('public');
});

app.get('/private', validateToken, (req, res) => {

    res.send('private');
});

app.get('/login', (req, res) => {

    const userOk = true;
    if (userOk) {

        const token = generateToken(req);
        res.send(token);
    }
    else
        res.status(401);
});

const PORT = process.env.PORT || 50001;
app.listen(PORT, e => console.log(`Server started in http://localhost:${PORT}`));