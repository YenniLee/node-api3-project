const express = require('express');
const User = require('./userDb');
const Post = require('../posts/postDb');

const router = express.Router();

// router.post('/', validateUser, (req, res) => {
//   const newUser = req.body;

//   User.insert(newUser)
//     .then(user => {
//       res.status(201).json(user);
//     })
//     .catch(err => {
//       res.status(500).json({ message: `${err} Unable to add new user.` })
//     })
// });

//****************endpoint to create new user -WORKS******************
router.post('/', validateUser, (req, res) => {
  res.status(201).json(req.user)
});


//*****************endpoint to add a post to a user - WORKS********************
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  Post.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "Unable to add new post." })
    })
});

//******endpoint to retrieve all users - WORKS*******
router.get('/', (req, res) => {
  User.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "Could not retrieve users data." })
    })
});

//**********endpoint to get user data - WORKS********
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

//******endpoint to get posts from user - WORKS******
router.get('/:id/posts', validateUserId, (req, res) => {
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
// router.delete('/:id', validateUserId, (req, res) => {
//   const { id } = req.params;
//   User.remove(id)
//     .then(deletedUser => {
//       res.status(204).json(deletedUser);
//     })
//     .catch(err => {
//       res.status(500).json({ message: "Unable to delete user." })
//     })
// });
router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params;

  User.remove(id)
    .then(deletedUser => {
      res.status(200).end()
    })
    .catch(err => {
      res.status(500).json({ message: `Unable to delete user. ${err}` })
    })
})

//endpoint to update user information - WORKS
router.put('/:id', (req, res) => {
  const { id } = req.params;
  User.update(id, req.body)
    .then(updatedUser => {
      res.status(200).json(updatedUser)
    })
    .catch(err => {
      if(!req.body.name) {
        res.status(400).json({ message: "The required name field does not exist." })
      } else {
        res.status(500).json({ message: `Unable to update the user information. ${err}` })
      }
    })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id)
    .then(user => {
      if(user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "Invalid user ID" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: `Unable to retrieve user info ${err}` })
    })
};

function validateUser(req, res, next) {
  User.insert(req.body)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      if (Object.keys(req.body).length === 0) {
          res.status(400).json({ message: "Missing user data." })
      } else if (!req.body.name) {
          res.status(400).json({ message: "Missing required name field." })
      } else {
          res.status(500).json({ meesage: `Unable to add user to database. ${err}` })
      }
    })
};

function validatePost(req, res, next) {
  const { text } = req.body;

  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Missing user data." })
  } else if (!text) {
    res.status(400).json({ message: "Missing required text field." })
  } else {
    Post.insert(req.body)
      .then(post => {
        req.post = post;
        next()
      })
      .catch(err => {
        res.status(500).json({ message: `Unable to add post to database. ${err}` })
      })
  }
};

module.exports = router;
