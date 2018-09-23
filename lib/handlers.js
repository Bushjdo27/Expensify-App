/**
 * 
 * Handlers all request to server
 * 
 * 
 */

// Dependencies 
 const _data = require('./data');
 const helpers = require('./helpers')
 const handlers = {};


 // ======== User Handlers =========

 handlers.users = function(data , callback){
     // list method can be supported 
     const acceptableMethod = ['post','get','put','delete'];
     if(acceptableMethod.indexOf(data.method) > -1){
        handlers._user[data.method](data , callback);
     }else{
         callback(400,{Error: "Your method has not been supported"})
     }
 }

 handlers._user = {};

 // Required fields : firstName , lastName , phone , pass , tosAgreements
 
 handlers._user.post = function(data , callback){
     // Check required field
     
     let { firstName , lastName , phone , password , tosAgrement} = data.payload;
     firstName = typeof(firstName) === 'string' && firstName.trim().length > 0 ? firstName : false;
     lastName = typeof(lastName) === 'string' && lastName.trim().length > 0 ? lastName : false;
     phone = typeof(phone) === 'string' && phone.trim().length == 10 ? phone : false;
     password = typeof(password) === 'string' && password.trim().length > 0 ? password : false;
     tosAgrement = typeof(tosAgrement) === 'boolean' && tosAgrement == true ? tosAgrement : false;


     if(firstName && lastName && phone && password && tosAgrement){
        const hashedPassword = helpers.hash(password);
        if(hashedPassword){
            const objectUser = {
                firstName,
                lastName,
                phone,
                tosAgrement,
                hashedPassword
            }
            _data.create('users',phone,objectUser,function(err,data){
                if(!err){
                    callback(200 , {Success: "Create user successfylly"})
                }else{
                    callback(500 , {Error: "Could not create user"})
                }
            })
        }else{
            callback(500 , {Error: "Error when hashing password"})
        }
     }else{
         callback(400 , {Error : "Missing required field"})
     }

 }

 //Require field : phone
 handlers._user.get = function(data , callback){
     let {phone} = data.queryObject;

     phone = typeof(phone) === 'string' && phone.trim().length == 10 ? phone : false;
     if(phone){
        _data.read('users',phone,function(err , data){
            if(!err && data){
                // do not return password
                delete data.hashedPassword
                callback(200 , data)
            }else{
                callback(500 , {Error: "Could not find the specified file"})
            }
        })
     }else{
         callback(400 , {Error: "Missing required field"})
     }
 }

 //Required field : phone and least one all that field : firstName , lastName  , password , tosAgrement

 handlers._user.put = function(data, callback){
    let { firstName , lastName , phone , password , tosAgrement} = data.payload;
    firstName = typeof(firstName) === 'string' && firstName.trim().length > 0 ? firstName : false;
    lastName = typeof(lastName) === 'string' && lastName.trim().length > 0 ? lastName : false;
    phone = typeof(phone) === 'string' && phone.trim().length == 10 ? phone : false;
    password = typeof(password) === 'string' && password.trim().length > 0 ? password : false;
    tosAgrement = typeof(tosAgrement) === 'boolean' && tosAgrement == true ? tosAgrement : false;

    if(phone){
        _data.read('users',phone,function(err , data){
            if(!err){
                const newUserObject = {
                    firstName: firstName ? firstName : data.firstName,
                    lastName: lastName ? lastName : data.lastName,
                    phone : phone ? phone : data.phone,
                    password: password ? helpers.hash(password) : data.password,
                    tosAgrement: data.tosAgrement
                }
                console.log(newUserObject)
                _data.update('users',phone,newUserObject,function(err , data){
                    if(!err){
                        callback(200, newUserObject)
                    }else{
                        callback(500, {Error: "Error when update new content"})
                    }
                })
            }else{
                callback(500 , {Error : "Could not find the specified files"})
            }
        })
    }else{
        callback(400 , {Error: "Missing required field"})
    }

 }

 //Require field : phone
 handlers._user.delete = function(data, callback){
    let {phone} = data.queryObject;

    phone = typeof(phone) === 'string' && phone.trim().length == 10 ? phone : false;

    if(phone){
        _data.delete('users',phone,function(err){
            if(!err){
                callback(200 , {Success: "delete Success"})
            }else{
                callback(500,{Error: "Error when delete users"})
            }
        })
    }else{
        callback(400 , {Error: "Missing required field"})
    }
 }

 // ======== End User Handlers =========

 handlers.home = function(data , callback){
    // do something
    callback(200 , {message : "Welcome to my web app"})
 }
 module.exports = handlers;