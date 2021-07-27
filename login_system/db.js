var mysql=require('mysql');
 var connection=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   database:'loginapp'
 });
connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('MY sql Connected!:)');
   }
 });  
module.exports = connection;