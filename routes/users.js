var express = require('express');
var router = express.Router();
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + ".png")
  },
})

const upload = multer({ storage: storage })

const mongojs = require('mongojs')
const db = mongojs('bezeroakdb', ['bezeroak'])

let users = [];

db.bezeroak.find( function(err, userdocs) {
  if(err) {
    console.log(err)
  } else {
    users = userdocs
  }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("users", {
    title: "Users", 
    users: users
  });
});

router.get('/list', function(req, res, next) {
  res.json(users)
});


router.post("/new", upload.single('avatar'), (req, res, next) => {
  if(req.file === undefined){
    user = {"izena": req.body.izena, "abizena": req.body.abizena, "email": req.body.email, "id": Date.now() };
  } else {
    user = {"filename": req.file.filename, "izena": req.body.izena, "abizena": req.body.abizena, "email": req.body.email, "id": Date.now() };
  }
  
  users.push(user);
  db.bezeroak.insert(user, function (err,user) {
    if (err) {
      console.log(err)
    } else {
      console.log(user)
      res.json(user);
    }
  })
});

router.delete("/delete/:id", (req, res) => {
  users = users.filter(user => user._id != req.params.id);
  db.bezeroak.remove({_id: mongojs.ObjectId(req.params.id)}, function (err, user) {
    if (err) {
      console.log(err)
    } else {
      console.log(user)
    }
  })
  //console.log(req.params.id);
  //console.log(users)
  res.json(users);
});

router.put("/update/:id", upload.single('avatar'), (req, res) => {
  let user = users.find(user => user._id == req.params.id);
  if(!(req.file === undefined)){
    user.filename = req.file.filename
  }
  user.izena = req.body.izena;
  user.abizena = req.body.abizena;
  user.email = req.body.email;

  db.bezeroak.update({ _id: mongojs.ObjectId(req.params.id) },
    { $set: {filename: user.filename, izena: req.body.izena, abizena: req.body.abizena, email: req.body.email } },
    function (err, user) {
      if (err) {
        console.log(err)
      } else {
        console.log(user)
      }
    })
  
  res.json(user); 
})

module.exports = router;
