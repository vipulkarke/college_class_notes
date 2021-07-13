const e = require("express");
var express  = require("express");
const connection = require("./db");
var router = express.Router();


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

// login user 
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



module.exports=router;