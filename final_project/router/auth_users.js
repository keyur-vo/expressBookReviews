const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let user = users.find(user => user.username === username);
  if(user){
    return true;
  }else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let user = users.find(user => user.username === username && user.password === password);
  if(user){
    return true;
  }else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
      const password = req.body.password;
  
      // Check if username or password is missing
      if (!username || !password) {
          return res.status(404).json({ message: "Error logging in" });
      }
  
      // Authenticate user
      if (authenticatedUser(username, password)) {
          // Generate JWT access token
          let accessToken = jwt.sign({
              data: password
          }, 'access', { expiresIn: 60 * 60 });
  
          // Store access token and username in session
          req.session.authorization = {
              accessToken, username
          }
          return res.status(200).send({message:"User successfully logged in"});
      } else {
          return res.status(400).json({ message: "Invalid Login. Check username and password" });
      }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(books[req.params.isbn]){
    let review = req.body.review;
    let user = req.session.authorization.username;
    books[req.params.isbn].reviews[user] = review;
    res.status(200).json({message: "Review added successfully"});
  }else{
    res.status(404).json({message: "Book not found"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(books[req.params.isbn]){
    let user = req.session.authorization.username;
    if(Object.keys(books[req.params.isbn].reviews).filter(key => key === user).length > 0){
      delete books[req.params.isbn].reviews[user];
      return res.status(200).json({message: "Review deleted successfully"});
    }else{
      return res.status(404).json({message: "Review not found"});
    }
  }else{
    res.status(404).json({message: "Book not found"});
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
