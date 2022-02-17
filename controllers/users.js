const User = require('../models/users')
const Token = require('../models/tokens')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const generateJWT = (user, secret, options) => {
    return jwt.sign(user, secret, options);
}

exports.register = async (req, res, next) => {
    try {
        if (!req.body.password && !req.body.username) {
           return res.status(400).send({ error: "Bad credentials" });
        }
        const candidate = await User.findOne({ username: req.body.username })
        if (candidate) {
            return res.status(400).send({ error: "Username already in use" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 3)
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
        });
        await user.save()
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err)
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        if (!req.body.password && !req.body.username) {
            return res.status(400).send({ error: "Bad credentials" });
        }
        const user = await User.findOne({username: req.body.username})
        if (!user || !user.isActivated) {
            return res.status(400).send({ error: "No activated users" });
        }
        const compare = await bcrypt.compare(req.body.password, user.password)
        if (!compare) {
            return res.status(403).send({error: "Bad password"})
        }

        const accessToken = generateJWT({user: user}, process.env.ACCESS_SECRET_KEY, {expiresIn: '1d'})

        const userToken = await Token.findOne({userId: user._id})
        if(!userToken) {
            const firstToken = new Token({userId:user._id, accessToken: accessToken})
            await firstToken.save()
            return res.json({
                username: user.username,
                accessToken,
            })
        }
        userToken.accessToken = accessToken
        await userToken.save()
        res.cookie('refreshToken', '123', {httpOnly: true, sameSite: 'None', secure: true})
        res.json({
            username: user.username,
            accessToken,
        })
    } catch (err) {
        console.log(err)
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const userToken = await Token.findOne({accessToken: token})
            const user = await User.findOne({_id: userToken.userId})
            if (!userToken || !user) {
                return res.status(401).send()
            }
            jwt.verify(token, process.env.ACCESS_SECRET_KEY,{maxAge: '1d'}, async (err, data) => {
                if (err) {
                    const accessToken = jwt.sign(
                        { user: user},
                        process.env.ACCESS_SECRET_KEY,
                        { expiresIn: '1d' }
                    );
                    userToken.accessToken = accessToken
                    await userToken.save()
                    return res.json({
                        user: user.username,
                        accessToken
                    });
                }
            });
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        next(err);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        console.log(req.cookies)
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_SECRET_KEY,{maxAge: '1d'}, (err, user) => {
                if (err) {
                    return res.sendStatus(401);
                }
                res.status(200).json({
                    user: user.user.username,
                })
            });
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        next(err);
    }
};

exports.getWelcome = async (req, res, next) => {
    return res.status(200).json({default: 'Welcome here'})
};
