var express = require('express');
var app     = express();

var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
var multer     = require('multer'); 
var dbUri='mongodb://localhost/passportJsApp';
var db=mongoose.connect(dbUri);
var cookieParser = require('cookie-parser');
var session      = require('express-session');

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'this is the secret' }));
app.use(multer());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

var userSchema= new mongoose.Schema({
    username: {type : String , required :true},
    password: {type : String, required : true},
    firstName: String,
    lastName: String,
    email: String,
    roles:{type: String, enum: ['STUDENT','FACULTY','ADMIN','USER'], default: 'USER'}
});

var userModel= mongoose.model("userModel",userSchema);
userModel.createUser=createUser;
userModel.findUserById=findUserById;
userModel.findUserByCredentials=findUserByCredentials;
//userModel.findAllUsers=findAllUsers;
module.export=userModel;

/*var aakash=new userModel({
    username: 'aakash',
    password: 'aakash',
    firstName: 'aakash',
    lastName: 'chandhoke',
    email: 'aakash.chandhoke24@gmail.com',
    roles:['admin','faculty']
});

aakash.save();*/

passport.use(new LocalStrategy(
function(username, password, done)
{
        userModel.findOne({username:username,password:password},function(err,user){ //assynchronus call 
            if(user)
            {
                return done(null,user);                 
            }
            return done(null,false);
        });
        
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var auth = function(req, res, next)
{
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};

/*function findAllUsers(){
    return userModel.find();    
}*/

function findUserByCredentials(username,password){
    return userModel.findOne({username:username,password:password});
}

function findUserById(id){
    return userModel.findById(id);
}

function createUser(user){
 return userModel.create(user);
}

app.get('/loggedin', function(req, res)
{
    res.send(req.isAuthenticated() ? req.user : '0');
});

app.get('/isAdmin', function(req, res)
{
    res.send(req.isAuthenticated() && req.user.roles=='ADMIN' ? req.user : '0');
});
    
app.post('/login', passport.authenticate('local'), function(req, res)
{
    res.send(req.user);
});

app.post('/logout', function(req, res)
{
    req.logout();
    res.send(200);
});  

app.post('/register',function(req,res){
    var newUser=new userModel(req.body);
    newUser.save(function(err,user){
        req.login(user,function(err,user){
            if(err){
                return next(err);
            }
            res.json(user);
        });
    });
}); 

//Admin Functions

//Getting users by admin
app.get('/admin/user',function(req,res){
    if(req.user && req.user.roles=='ADMIN')
    {
        userModel.find()
        .then(function(user){
            res.json(user);
        });
    }
    else
    {
        res.send(401);
    }
});

//unregistering users
app.delete('/user/:userId',function(req,res){
    //if(req.user && req.user._id==req.params.userId)
   // {
        userModel.remove({_id:req.user._id})
        .then(function(user){
            res.send(200);
        });
    /*}
    else
    {
        res.send(401);
    }*/
});

//deleting from admin
app.delete('/admin/user/:userId',function(req,res){
    if(req.user && req.user.roles=='ADMIN')
    {
        userModel.remove({_id:req.params.userId})
        .then(function(user){
            res.json(user);
        });
    }
    else
    {
        res.send(401);
    }
});

app.listen(3000);
