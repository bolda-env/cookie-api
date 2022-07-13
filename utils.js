const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;

// Create Account
function createAccount(req, res){
  const { create_username: username, email_address: emailAddress, create_password }  = req.body;
  console.log(req.body);

  MongoClient.connect('mongodb://localhost:27017/', function(err, db) {
    if (err) throw err;
    const cookieDB = db.db("cookie");

    cookieDB.collection("users").findOne({"username": username },
    (err, existUser)=>{
      if(err) throw err;

      // Check whether user exit.
      if(existUser){
        res.json({isState: false, msg: 'Username taken!'})
        return;
      }

      bcrypt.hash(create_password, 10, (err, encryptPwd)=>{
        cookieDB.collection("users").insertOne({username, emailAddress, encryptPwd}, (err, result)=>{
          if(err) throw err;
          console.log("Successfully insert user");
          db.close();
          res.json({isState: true, msg: 'ok', redirect: '/'})
        })
      })
    });
  });
}


function accessAccount(req, res){
  const { username, password }  = req.body;

  MongoClient.connect('mongodb://localhost:27017/', function(err, db) {
    if (err) throw err;
    const cookieDB = db.db("cookie");

    cookieDB.collection("users").findOne({"username": username},
    (err, existUser)=>{
      if(err) throw err;
      if(typeof existUser !== 'object'){
        bcrypt.compare(password, existUser.encryptPwd, function(err, isUser) {
          if(isUser) res.json({isState: true, msg: 'ok', redirect: '/'})
        });
      }else{
        console.log('Login: Account do not exist');
      }
    });
  });
}

exports.route ={createAccount, accessAccount};
