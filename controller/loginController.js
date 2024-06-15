
const loginmodel = require('../models/auth')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const login = (async (req, res) => {
    try {
        const { email, password } = req.body;
        const secretKey = process.env.SECRETKEY

        console.log('body......', req.body)
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await loginmodel.findOne({ email, password });
        console.log('usersss==>>', user)

        if (!user) {
            return res.status(404).json({ message: 'Email or Password is Wrong' });
        }

        const token = jwt.sign(
            { userId: user._id },
            secretKey,
            { expiresIn: '7h' }
        );

        res.status(200).json({ token, message: 'Login successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

const validateToken = (req, res, next) => {
    const token = req.header('token');
    const secretkey = process.env.SECRETKEY

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, secretkey);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};


module.exports = { login, validateToken };