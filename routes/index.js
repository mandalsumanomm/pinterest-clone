var express = require('express');
var router = express.Router();
const userModel = require('../models/users')
const postModel = require('../models/posts');
const passport = require('passport');
const upload = require('./multer');



// For creating login
const localStrategy = require("passport-local").Strategy;
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// Render upload page
router.get('/upload', isLoggedIn, function(req, res, next) {
  const successMsg = req.flash('success'); 
  res.render('upload', { user: req.user, successMsg }); 
});

//Explore page
router.get('/explore', isLoggedIn, async function (req, res, next) {
  const user = req.user;  
  res.render('explore', { user });
});


// Upload 
router.post('/upload', isLoggedIn, upload.single('file'), async function(req, res, next) {
  if (!req.file) {
    return res.status(400).send('No files were given.');
  }
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });
  user.posts.push(post._id);
  await user.save();
    
  res.json({ success: true, message: 'Your file has been uploaded successfully!' });
  
});


// Delete route
router.delete('/delete/:id', isLoggedIn, async function(req, res, next) {
  try {
    const postId = req.params.id;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

     await postModel.findByIdAndDelete(postId);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




// file Upload
router.get('/fileupload', isLoggedIn, function(req, res, next) {
  const successMsg = req.flash('success'); 
  res.render('editprofile', { user: req.user, successMsg }); 
});

// file Upload 
router.post('/fileupload', isLoggedIn, upload.single('image'), async function(req, res, next) {
 
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile');
});



// details file

router.get('/details/:postId', async function(req, res) {
  try {
    const postId = req.params.postId;
    const user = req.user;
    const post = await postModel.findById(postId).populate('user');

    if (!post) {
      return res.status(404).send('Post not found');
    }

    res.render('details', { post, user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});



// Search endpoint
router.get('/search', isLoggedIn, async (req, res) => {
  try {
    const query = req.query.q; 
    const regex = new RegExp(query, 'i'); 
    const searchResults = await postModel.find({ imageText: regex }).select('imageText image'); 
    res.json(searchResults); 
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Register
router.post('/register', function(req, res, next) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
    .then(function(registereduser) {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/profile');
      });
    });
});

// Login
router.get('/login', function(req, res, next) {
  res.render('login', {error: req.flash('error')});
});

//feed
router.get('/feed',  isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  const posts = await postModel.find()
  .populate('user');
  res.render('feed', {user, posts});
});

// Profile
router.get('/profile', isLoggedIn, async function(req, res) {
  try {
    const user = await userModel.findOne({
        username: req.session.passport.user
      })
      .populate('posts');
    res.render('profile', { user: user, posts: user.posts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit Username
router.post('/profile/edit-username', isLoggedIn, async function(req, res) {
  try {
    const newUsername = req.body.newUsername;
    const user = await userModel.findOneAndUpdate(
      { username: req.session.passport.user },
      { username: newUsername },
      { new: true }
    );

    res.redirect('/login');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



// Login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/feed',
  failureRedirect: '/login',
  failureFlash: true
}), function(req, res) {});


// Logout
router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
