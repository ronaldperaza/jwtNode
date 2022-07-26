const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { schemaRegister, schemaLogin  } = require('../schemas/user.schema')


const registerUser = async (req, res) => {

    const { error } = schemaRegister.validate(req.body)

    if ( error ) {
        return res.status(400).json(
            { error: error.details[0].message } //este data viene de la respuesta de error del joi
        )
    }
   
    const isEmailExist = await User.findOne({ email: req.body.email })
    if (isEmailExist) {
        return res.status(400).json(
            { error: "Email is already register"}
        )
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
    })
    try {
        const savedUser = await user.save();
        res.json({
            data: savedUser
        })
    } catch (error) {
        res.status(400).json({error})
    }
}

const loginUser = async (req, res) => {

    const { error } = schemaLogin.validate(req.body)

    if (error) {
        return res.status(400).json(
            { error: error.details[0].message } //este data viene de la respuesta de error del joi
        )
    }

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json(
            { error: "User not found" }
        )
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).json({ error: 'password is not valid' })

    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.TOKEN_SECRET)

    res.header('auth-token', token).json({
        data: {token}
    })

}

const dashboard = (req, res) => {
    res.json({
        data: {
            title: 'welcome to dashboard',
            user: req.user
        }
    })
}

module.exports = { 
    registerUser, 
    schemaRegister,
    loginUser,
    dashboard
}