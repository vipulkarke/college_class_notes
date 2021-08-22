const e = require("express");
var express  = require("express");
const connection = require("./db");
var router = express.Router();
const multer = require('multer');
const fs = require("fs");
var uuid = require('uuid').v4;
// var alert = require("alert");
const  mongoose = require('mongoose');
const path = require("path");


mongoose.connect('mongodb://localhost:27017/userfiles?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',{
    useNewUrlParser: true, useUnifiedTopology:true
});

const mongoosedb = mongoose.connection;
console.log("mongoose db connected");
mongoosedb.on('error',console.log);


//////////////////////////////////////////////////multer file uploads///////////////////////////////////////////////
const Schema = mongoose.Schema;

const ImageSchema = new mongoose.Schema (
    {
        filePath: String,
    },
    {
        timestamps: true,
    },
);

const Image = mongoose.model('Image',ImageSchema);
console.log("error",Image);
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null,'uploads');
},
    filename:(req,file,cb) =>{
        const ext = path.extname(file.originalname);
        const id = uuid();
        const filePath = `images/${id}${ext}`;
        Image.create({filePath})
            .then(()=>{
                cb(null, filePath)
            });     
    }
});
const upload = multer({storage})

router.use('/images',express.static(path.join(__dirname,'uploads/images')))

console.log(__dirname)
router.get('/images',(req,res)=>{
    Image.find().then((images)=>{
        // console.log("show",images);
        return res.json({status: 'OK', images });
    });
});


router.post('/upload', upload.array('mfiles'),(req,res)=> {
    // return res.json({status: 'OK', uploaded: req.files.length})
   res.render('dash',{isAlert:true,user:req.session.user});

});

///////////////////////////////////////////////////////////////logincheck///////////////////////////////////////////////////////////
router.post('/login',(req,res)=>{
connection.connect(function(err) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email,password);
    var sql = 'SELECT email,password FROM users where email = ? and password = ?';
    connection.query(sql, [email, password], function(error, results,) {
        if (results.length > 0) {
            req.session.user = email;
            res.redirect('/route/dash');
        } else {
           res.render('base',{isAlert:true,user:req.session.user});
        //    res.render('/');
        }
        res.end();
    });
  });
});

////////////////////////////////////////////////////////////////// route for dashboard//////////////////////////////////////////////
router.get('/dashboard',(req,res)=>{
 if(req.session.user){
     res.render('dashboard',{user:req.session.user});
 }else{
     res.send("Unauthorize User");
 }
});


router.get('/',(req,res)=>{   
        res.render('/')    
      });
router.get('/base',(req,res)=>{   
res.render('base')    
});

router.get('/contact',(req,res)=>{   
    res.render('contact')    
    });

router.get('/about', (req, res)=>{
    console.log(req.query);
      const user = req.query.user;
      res.render('about', {user:user});
 })



 
 router.get('/dash',(req,res)=>{
    if(req.session.user){
        res.render('dash',{user:req.session.user});
    }else{
        res.send("Unauthorize User");
    }
   });
// router.get('/dash', (req, res)=>{
//     console.log(req.query);
//       const user = req.query.user;
//       res.render('dash', {user:user});
//  })

 router.get('/uploadfiles', (req, res)=>{
    console.log(req.query);
    const user = req.query.user;
    res.render('uploadfiles', {user:user});
})

//////////////////////////////////////////////////////////////////////route for register//////////////////////////////////////////
router.post('/register',(req,res)=>{            
        console.log(req.body.username);
        var sql = "INSERT INTO users  (username,name,email,password) VALUES ('"+req.body.username+"','"+req.body.name+"','"+req.body.email+"', '"+req.body.rpassword+"')";
        connection.query(sql, function (err, result) {
          if (err) {
          throw err;
        }else{
            res.redirect("/");
        //    alert("New User Registered \n Welcome to college ClassNotes "); 
        }
          console.log("1 record inserted");
        });
});
////////////////////////////////////////////////////////////////Route for contact///////////////////////////////////////////////

router.post('/contact',(req,res)=>{            
    var sql = "INSERT INTO feedback  (name,phoneno,email,comments) VALUES ('"+req.body.Name+"','"+req.body.PhoneNumber+"','"+req.body.FromEmailAddress+"', '"+req.body.Comments+"')";
    connection.query(sql, function (err, result) {
      if (err) {
      throw err;
    }else{
        // res.render('contact',{isAlert:true});
    //    alert("Thank you for using College ClassNotes "); 
       console.log("1 record inserted");
    }
    });
});

////////////////////////////////////////////////////////////////Route for showfiles///////////////////////////////////////////////
router.post('/show',(req,res,next)=>{
let directory_name = "./uploads/images";
let filenames = fs.readdirSync(directory_name);
console.log("\nFilenames in directory:");
filenames.forEach((file) => {
        req.file
    res.write('<html><head></head><body><table><tr>' +file );
    res.write('</tr></table></body></html>');
    console.log("File:", file);
});
});

module.exports=router;