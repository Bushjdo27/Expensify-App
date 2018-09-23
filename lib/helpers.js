/**
 * 
 * Helper function for all task
 * 
 */

 // Dependencies

 const crypto = require('crypto');
 const config = require('./config');



 const helpers = {};

 helpers.hash = function(str){
     if(typeof(str) === 'string' && str.trim().length > 0){
        const hasedPassword = crypto.createHmac('sha256',config.secretKey).update(str).digest('hex');
        return hasedPassword
     }else{
         return false;
     }
 }

 helpers.parseJsonToObject = function(str){
     try{
        const result = JSON.parse(str);
        return result;
     }catch(e){
         return false
     }
 }


 module.exports = helpers