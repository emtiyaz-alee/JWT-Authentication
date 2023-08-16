
import express from 'express';
import { ObjectId } from 'mongodb';
let router = express.Router()
import { client } from '../../mongodb.mjs'





const db = client.db("test");
const col = db.collection("posts");

// POST    /api/v1/post
router.post('/post', async (req, res, next) => {
    console.log('this is signup!', new Date());
    if (!req.body.title
        || !req.body.text
    ) {
        res.status(403);
        res.send(`Parameter is missing `);
        return;
    }


    const insertResponse = await col.insertOne({

        title: req.body.title,
        text: req.body.text,
    });
    console.log("inserted Response", insertResponse)
    res.send('post created');

})
// GET     /api/v1/posts
router.get('/posts', async (req, res, next) => {
    const cursor = col.find({})
    try {
        const result = await cursor.toArray()
        console.log("result", result)
        res.send(result);
    }
    catch (e) {
        console.log('Result not found', e)

        res.status(500).send("Database not found")
    }



})

// GET     /api/v1/post/:postId
router.get('/post/:postId', async (req, res, next) => {
    console.log('this is signup!', new Date());
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(401).send('Invalid post id')
    }
    
    const cursor = col.findOne({ _id: new ObjectId(req.params.postId) })
    try {
        const result = await cursor.toArray()
        console.log("result", result)
        res.send(result);
    }
    catch (e) {
        console.log('Result not found', e)

        res.status(500).send("Database not found")
    }





})

// PUT     /api/v1/post/:userId/:postId
router.put('/post/:postId', async (req, res, next) => {
    console.log('this is signup!', new Date());
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(401).send('Invalid post id')
    }
    if (
        !req.body.text
        && !req.body.title) {
        res.status(403).send(`example put body:
        `)
    }

    let toBeUpdated = {}

    if (req.body.title) { toBeUpdated.title = req.body.title }
    if (req.body.text) { toBeUpdated.text = req.body.text }

    try {
        const updateResponse = await col.updateOne({ _id: new ObjectId(req.params.postId) }, {
            $set: toBeUpdated
        })
        console.log("updateResponse", updateResponse)
        res.send("Post Updated");
    }
    catch (e) {
        console.log('Result not found', e)

        res.status(500).send("Database not found")
    }



})
// DELETE  /api/v1/post/:userId/:postId
router.delete('/post/:postId', async (req, res, next) => {

    if (!ObjectId.isValid(req.params.postId)) {
        res.status(401).send('Invalid post id')
    }


    try {
        const deleteResponse = await col.deleteOne({ _id: new ObjectId(req.params.postId) }, {

        })
        console.log("deleteResponse", deleteResponse)
        res.send("Post Deleted");
    }
    catch (e) {
        console.log('Result not found', e)

        res.status(500).send("Database not found")
    }
})

export default router