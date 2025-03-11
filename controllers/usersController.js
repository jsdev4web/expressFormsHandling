const { body, validationResult } = require("express-validator");

// controllers/usersController.js
const usersStorage = require("../storages/usersStorage");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "must be a email address";
const ageErr = "must be num btw 18 - 120";
const bioErr = "Needs to be 200 characters"


const validateUser = [
    body("firstName").trim()
      .isAlpha().withMessage(`First name ${alphaErr}`)
      .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
    body("lastName").trim()
      .isAlpha().withMessage(`Last name ${alphaErr}`)
      .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
    body("email").trim()
      .isEmail().withMessage(`Email ${emailErr}`),
    body("age").trim()
      .isFloat({ min: 18, max: 120}).withMessage(`Age ${ageErr}`),
    body("bio").trim()
      .isLength({ min: 200 }).withMessage(`bio ${bioErr}`),
  ];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersCreatePost = (req, res) => {
  const { firstName, lastName, email, age, bio } = req.body;
  usersStorage.addUser({ firstName, lastName, email, age, bio });
  res.redirect("/");
};

// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
    validateUser,
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("createUser", {
          title: "Create user",
          errors: errors.array(),
        });
      }
      const { firstName, lastName, email, age, bio } = req.body;
      usersStorage.addUser({ firstName, lastName, email, age, bio });
      res.redirect("/");
    }
  ];

  exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render("updateUser", {
      title: "Update user",
      user: user,
    });
  };
  
  exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
      const user = usersStorage.getUser(req.params.id);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
          title: "Update user",
          user: user,
          errors: errors.array(),
        });
      }
      const { firstName, lastName, email, age, bio } = req.body;
      usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
      res.redirect("/");
    }
  ];

  // Tell the server to delete a matching user, if any. Otherwise, respond with an error.
exports.usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect("/");
  };
  
  exports.usersSearchGet = (req, res) => {
    const search = req.query.search;
    console.log(search)
    //this goes into the createUser Page form and needs 
    //to grab the search varibale

    //I need to match it to a email variable in the list
    //that is already made up

    //path= createUser.ejs > usersRouter.js > usersController.js
    //Controller goes to form says 

    //I cant get access to variables from create form > controller&storage
      res.render("searchUser",{
        users: usersStorage.getUsers(),
        search: search,
        title: "user search",

    })
    
  };

