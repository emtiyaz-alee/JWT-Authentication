import express from 'express';
import { stringToHash, varifyHash } from 'bcrypt-inzi';
let router = express.Router()
import jwt from 'jsonwebtoken';
import { client } from '../../mongodb.mjs'

const userdb = client.db("test").collection("users");


// Login

router.post('/login', async (req, res, next) => {
    if (
        !req.body.email
        || !req.body.password

    ) {
        res.status(403);
        res.send(`Parameter is missing  Example:
        email
        password
 `);
        return;
    }


    try {
        req.body.password = req.body.password.toLowerCase()
        const result = await userdb.findOne({ email: req.body.email })
        console.log("result", result)

        
        if (!result) {
            res.status(450).send("user not found")
        }
        else {
            
            let isMatch = varifyHash(req.body.password, result.password)
            if (isMatch) {

                var token = jwt.sign({
                    email: req.body.email,
                    createdOn: new Date().getTime()
                }, process.env.SECRET)

               
                res.cookie('token', token, {httpOnly:true})
                res.send({
                    message: "Login successfully",
                   
                })
            }
            else {
                res.send("login failed")
            }
        }
    }
    catch (e) {
        console.log('server error', e)

        res.status(500).send("Server error")
    }


})


// Signup 
router.post('/signup', async (req, res, next) => {

    let Hashpassword = await stringToHash(req.body.password)

    if (!req.body.firstName
        || !req.body.lastName
        || !req.body.email
        || !Hashpassword

    ) {
        res.status(403);
        res.send(`Parameter is missing  Example:
        firstName
        lastName
        email
        password
 `);
        return;
    }
    req.body.password = req.body.password.toLowerCase()
    try {
        const result = await userdb.findOne({ email: req.body.email })
        console.log("result", result)

        // email not found
        if (!result) {

            const insertResponse = await userdb.insertOne({

                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: Hashpassword,

            });
            console.log("inserted Response", insertResponse)
            res.status(200).send('signup successfully...');
            

        }
        //email found
        else {
            res.status(403).send({ message: "Email already exists" })
        }
    }
    catch (e) {
        console.log('server error', e)

        res.status(500).send("Server error")
    }


})


export default router

