const router = require('express').Router();
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//importing model
const Admin = require('../Model/Admin');

//post to database
//REGISTERING NEW ADMIN
router.post('/register', async (req, res) => {

    
// VALIDATION CHECK IN THE DATA 
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

//CHECKING USER DUPLICATION
    const emailExist = await Admin.findOne({email: req.body.email});
    const emailExistMsg = {
        emailError : 'email already exist'
    }
    res.statusMessage = 'Email already exist';
    if(emailExist) {
        res.status(400).send(emailExistMsg).end();
    }
        

//CHECKING PASSWORD AND REPASSWORD MATCH
    const similarPwd = {
        pwdError : "Password doesn't match"
    }   
    res.statusMessage = "Password Doesn't match";
    if(req.body.password != req.body.repassword) return res.status(400).send(similarPwd).end();

//HASH PASSWORDS
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const hashedrePassword = await bcrypt.hash(req.body.repassword, salt);

//  CREATE A NEW ADMIN
    const admin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        repassword: hashedrePassword
    });
    try{
        const savedUser = await admin.save();
        res.send({admin : admin._id});
        console.log('admin added sucessfully');
    }catch(err){
        res.status(400).send(err);
    }
});

//LOGIN FOR ADMIN
router.post('/login', async (req,res)=>{

    // VALIDATION CHECK IN THE DATA 
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    //CHECKING IF USER EMAIL EXIST
    const admin = await Admin.findOne({email: req.body.email});
    const noEmail = {
        emailStatus : 'Email not found'
    }
    if(!admin) return res.send(noEmail);

    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password,admin.password);
    const noPass = {
        pwdStatus : 'Invalid password'
    }
    if(!validPass) return res.send(noPass);

    //SENDING USERNAME TO LOCAL STORAGE
    

    //CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({_id: admin._id}, process.env.TOKEN_SECRET);
    const dataToSend = {
        token:token,
        username:admin.name,
        id: admin._id,
        message:'Login succesfull'
    }
    res.header('auth-token', token).send(dataToSend);

    // localStorage.setItem('loginToken',token);

    // return res.send('sucessfully logged in');

});

router.get('/login', async (req,res)=>{
    try{
        const admin = await Admin.find();
        res.json(admin);
    }catch(err){
        res.json({message : err});
    }
})


module.exports = router;