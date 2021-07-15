const e = require("express");
var express  = require("express");
const connection = require("./db");
var router = express.Router();
const multer = require('multer');
const fs = require("fs");
var uuid = require('uuid')
var alert = require("alert");

//tupple for login
// const credential={
//     email:"admin@gmail.com",
//     password:"admin"
// }


//logincheck
router.post('/login',(req,res)=>{
connection.connect(function(err) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email,password);
    var sql = 'SELECT email,password FROM users where email = ? and password = ?';
    connection.query(sql, [email, password], function(error, results, fields) {
        if (results.length > 0) {
            req.session.user = email;
            res.redirect('/route/dashboard');
        } else {
            res.end('Invalid Email or Password please check.')
        }
        res.end();
    });
  });
});

// user login using tupple 
// router.post('/login',(req,res)=>{
//     if(req.body.email == credential.email && req.body.password == credential.password){
//         req.session.user = req.body.email;
//        res.redirect('/route/dashboard');
//     }else{
//         res.end('invalid username')
        
//     }
// });

// route for dashboard
router.get('/dashboard',(req,res)=>{
 if(req.session.user){
     res.render('dashboard',{user:req.session.user});
 }else{
     res.send("Unauthorize User");
 }
});

// //route for register 
router.post('/register',(req,res)=>{    
        // console.log("Connected!");
        console.log(req.body.username);
        var sql = "INSERT INTO users  (username,name,email,password) VALUES ('"+req.body.username+"','"+req.body.name+"','"+req.body.email+"', '"+req.body.rpassword+"')";
        connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
   // });
});


//routeforupload
var storage = multer.diskStorage({
    destination: function(req, file,callback){
        var dir = "./upload";

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null,dir);
    },
    filename:function(req,file,callback){
        callback(null,file.originalname);
    }
});

var upload = multer({storage:storage}).array('files',20);
router.post('/upload',(req,res,next)=>{
    upload(req,res,function(err){
    if(err){
        return res.send("something went wrong ");  
    }
     alert('upload complete');
    res.render('dashboard',{user:req.session.user});
 })
});




// router.get('/showfiles',(req,res)=>{
//     res.render('showfiles')
// });

router.post('/showfiles',(req,res,next)=>{
    // res.render('showfiles',{user:req.session.user});
let directory_name = "./upload";

// Function to get current filenames
// in directory
let filenames = fs.readdirSync(directory_name);

console.log("\nFilenames in directory:");
filenames.forEach((file) => {
    req.file
    res.write('<html><head></head><body><table><tr>  ' +file);
    res.write('</tr>        </table>    </body>    </html>');           
    console.log("File:", file);
    console.log("File:", file);
});
});

//new route for upload files and images




module.exports=router;