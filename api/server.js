// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express();

server.use(express.json());


//GET USERS
server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch( err => {
            res.status(500).json({
                message: 'error getting users',
                err: err.message
            })
        })
    
})

//WILDCARD * CATCHALL FOR ENDPOINTS

server.use('*', (req, res) => {

    res.status(404).json({
        message: 'not found'
    })
});


//POST A NEW USER

server.post('/api/users', (req, res) => {
    const user = req.body
    if (!user.name || !user.bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user"})
    } else {
    User.insert(user)
        .then(createdUser => {
            res.status(201).json(createdUser)
        })
            .catch( err => {
            res.status(500).json({
                message: "There was an error while saving the user to the database",
                err: err.message
            })
        })
         
    }    
})

//GET USER BY ID

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if(!user) {
            res.status(404).json({message: "The user with the specified ID does not exist"})
        }
        res.json(user)
    })
    .catch( err => {
        res.status(500).json({
            message: "The users information could not be retrieved",
            err: err.message
        })
    })
    
})



server.delete('/api/usesrs/:id', async (req, res) => {
   try {
   
    const possibleUser = await User.findById(req.params.id)
   
    if(!possibleUser) {
        res.status(404).json({
            message: "The user with the specified ID does not exist" 
            })
    } else {
        // same as         const deletedUser = await User.remove(req.params.id)

        const deletedUser = await User.remove(possibleUser.id)
        res.status(200).json(deletedUser)
    }
} catch (err) {
    res.status(500).json({
        message: "The users information could not be retrieved",
        err: err.message
    })
}
            
       
})


//Updating a user

server.put('/api/usesrs/:id', async (req, res) => {
    try {
        //verifying that the userid matches using the findbyid method set in the model module
    const possibleUser = await User.findById(req.params.id)
        if(!possibleUser) {
            res.status(404).json({
                message: "The user with the specified ID does not exist" 
                })
        } else {
            if (!req.body.name || !req.body.bio) {
            res.status(400).json({
              message:  "Please provide name and bio for the user" 
            })
        } else {
         const updatedUser = await  User.update(
             req.params.id, 
             req.body
         ) 
            res.status(200).json(updatedUser)
            
        }
    }


    }
    catch (err) {
        res.status(500).json({
            message: "The user information could not be modified",
            err: err.message
        })
    }
})

server.listen(9000, () => {
    console.log('server running on port 9000')
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
