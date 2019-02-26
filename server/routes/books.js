/*
File Name: routers/books.js
Authors: Chandni Patel
Student id: 300990555
WebApp name: My Favourite Books
*/

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let passport = require('passport');

// define the book model
let book = require('../models/books');


function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
      return res.redirect('/login');
  }
  next();
}

/* GET books List page. READ */
router.get('/' , requireAuth, (req, res) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books,
        displayName: req.user ? req.user.displayName : ""
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', requireAuth, (req, res, next) => {

  res.render('books/add', {
    title: 'Add New Book',
    displayName: req.user ? req.user.displayName : ""
  });

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (requireAuth, req, res, next) => {
  console.log(req.body);
  let newBook = book({
    "Title": req.body.title,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre
  });

  book.create(newBook, (err, book) => {
    if(err) {
        console.log(err);
        res.end(err);1
    }
    else {
        // refresh the book list
        res.redirect('/books');
    }
});

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', requireAuth, (req, res, next) => {

  let id = req.params.id;

  book.findById(id, (err, bookObject) => {
    if(err) {
        console.log(err);
        res.end(err);
    }
    else
    {
        // show the edit view
        res.render('books/details', {
            title: 'Edit Book',
            books: bookObject,
            displayName: req.user ? req.user.displayName : ""
        });
    }
});
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {

  let id = req.params.id;

  let updatedBook = book({
    "_id": id,
    "Title": req.body.title,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre
  });

  book.update({_id: id}, updatedBook, (err) => {
      if(err) {
          console.log(err);
          res.end(err);
      }
      else {
          // refresh the contact list
          res.redirect('/books');
      }
  })

});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {

  let id = req.params.id;

  book.remove({_id: id}, (err) => {
      if(err) {
          console.log(err);
          res.end(err);
      }
      else {
          // refresh the contact list
          res.redirect('/books');
      }
  });
});


module.exports = router;
