const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Country = require('../countries.json');

const app_secret ="x/A?D(G+KbPeShVmYq3t6w9z$B&E)H@M";

const saltRounds = 10;

AYearFromNow = () => {
    return Math.round((new Date().getTime() + 525600*60 * 1000)/1000);
}

GeneratePayload = (usrObject) => {
var mainPayLoad;
var user = {};
var context = {};
    if (usrObject) {
        //return {'avatar':usr.profile_pic,}
        user = {'avatar':usrObject.profile_pic,'name':usrObject.name,'email':usrObject.email,'id':usrObject._id};
        context = {'user':user,'group':"a123-123-456-789"};
        mainPayLoad = {'context':context,'aud':"vatchit",'iss':"vatchitmeetUltra",'sub':"meet.vatchit.in",'room':"*",'exp':AYearFromNow()};
        //usr.token = JSON.stringify(mainPayLoad);
        return mainPayLoad;
    }
    else{
        return false;
    }

}

GenerateJwtToken = (usrObject) => {
    var payLoad = GeneratePayload(usrObject);
    
    if(payLoad)
    {
        console.log("=======-----========"+JSON.stringify(payLoad));
        return jwt.sign(payLoad, app_secret);
    }else{
        return payLoad;
    }
    
}

createUser = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a User',
        })
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    
    User.findOne({ email: user.email }).then(usr => {
    if (usr) {
      return res.status(400).json({ success: false, message: 'User with same email already exists!' });
    } else {
        User.findOne({ phone: user.phone }).then(usr => {
            if (usr) {
              return res.status(400).json({ success: false, message: 'User with same phone number already exists!' });
            } else {

                bcrypt.hash(user.password, saltRounds, function(err, hash) {
                    user.password = hash;
                    user
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            success: true,
                            id: user._id,
                            message: 'User created!',
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            error,
                            message: 'User not created!',
                        })
                    })
                });

              }
          })


      }
  })
	
}

updateUser = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }
        
         User.findOne({ email: body.email }).then(usr => {
	    if (usr._id != user.id) {
	      return res.status(400).json({ success: false, message: "Email cannot be updated, another user with same email already exists!" });
	    } else {

            User.findOne({ phone: body.phone }).then(usr => {
                if (usr._id != user.id) {
                  return res.status(400).json({ success: false, message: "Phone number cannot be updated, another user with same email already exists!" });
                } else {
                        bcrypt.hash(body.password, saltRounds, function(err, hash) {

                        body.password = hash;

                        user.name = body.name
                        user.country = body.country
                        user.email = body.email
                        user.phone = body.phone
                        user.password = body.password
                        user.profile_pic = body.profile_pic
                        user
                            .save()
                            .then(() => {
                                return res.status(200).json({
                                    success: true,
                                    id: user._id,
                                    message: 'User updated!',
                                })
                            })
                            .catch(error => {
                                return res.status(404).json({
                                    error,
                                    message: 'User not updated!',
                                })
                            })
                    });	
                }
            });
                
	      }
	  })
        
        
    })
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }

        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUserById = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUsers = async (req, res) => {
    await User.find({}, (err, users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!users.length) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, data: users })
    }).catch(err => console.log(err))
}

loginUsers = async (req, res) => {
    const body = req.body
    User.findOne({$or: [{email: body.email}, {phone: body.email}]}).then(usr => {
        if (usr) {
            bcrypt.compare(body.password, usr.password, function(err, result) {
                // result == true
                if(err){
                    return res.status(400).json({ success: false, message: "Something went wrong" });
                }
                else if (result){
                    var tk = GenerateJwtToken(usr);
                    if(tk)
                    {
                        return res.status(200).json({ success: true, tokenData: tk });
                    }else{
                        return res.status(400).json({ success: false, message: "Token Generation error", cause: tk });
                    }
                    
                }
                else{
                    return res.status(400).json({ success: false, message: "Invalid password" });
                }
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid Email or Phone" });
          }
      })

}


checkUserEmailOrPhone = async (req, res) => {
    const body = req.body
    User.findOne({$or: [{email: body.email}, {phone: body.email}]}).then(usr => {
        if (usr) {
            return res.status(200).json({ success: true, username: usr.name })
        } else {
            return res.status(400).json({ success: false, message: "Invalid Email address or Phone" });
          }
      })

}

countryData = async (req, res) => {
    if(Country){
        return res.status(200).json({ success: true, countries: Country })
    }
    else
    {
        return res.status(400).json({ success: false, message: "Something Went wrong while fetching country" })
    }
    
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    loginUsers,
    checkUserEmailOrPhone,
    countryData
}
