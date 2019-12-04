const express = require('express');
const User = require('./userDb');
const Post = require('../posts/postDb');

const router = express.Router();

//endpoint to create new user -WORKS
router.post('/', (req, res) => {
  const newUser = req.body;

  User.insert(newUser)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: `${err} Unable to add new user.` })
    })
});

//endpoint to add a post to a user - WORKS
router.post('/:id/posts', (req, res) => {
  const { id } = req.params 
  Post.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "Unable to add new post." })
    })
});

//endpoint to retrieve all users - WORKS
router.get('/', (req, res) => {
  User.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "Could not retrieve users data." })
    })
});

//endpoint to get user data - WORKS
router.get('/:id', (req, res) => {
  const { id } = req.params;
  User.getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Could not fetch user data." })
    })
});

//endpoint to get posts from user - WORKS
router.get('/:id/posts', (req, res) => {
  const { id } = req.params;
  User.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: "Unable to get posts from user." })
    })
});

//endpoint to delete user - WORKS
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  User.remove(id)
    .then(deletedUser => {
      res.status(204).end();
    })
    .catch(err => {
      res.status(500).json({ message: "Unable to delete user." })
    })
});

//endpoint to update user information - WORKS
router.put('/:id', (req, res) => {
  const { id } = req.params;
  User.update(id, req.body)
    .then(updatedUser => {
      res.status(200).json({ message: "User updated successfully." })
    })
    .catch(err => {
      if(!req.body.name) {
        res.status(400).json({ message: "The required name field does not exist." })
      } else {
        res.status(500).json({ message: "Unable to update the user information." })
      }
    })
});

//custom middleware

function validateUserId(req, res, next) {
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
