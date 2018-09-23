/**
 * 
 * Handler all CRUD for data to system
 * 
 */

 const fs = require('fs');
 const path = require('path');
 const helpers = require('./helpers')
 const lib ={};

 lib.baseDir = path.join(__dirname,'../.data/')

 console.log(lib.baseDir)

 lib.create = function(dir , file , data , callback){
    
    // Open file to manipulating

    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err , fd){
        // flag : wx  <=> open for write , if exist -> error

        if(!err && fd){
            fs.writeFile(fd , JSON.stringify(data) , function(err){
                if(!err){
                    fs.close(fd , function(err){
                        if(!err){
                            callback(false , {Success: "closing file success"})
                        }else{
                            callback(true , {Error: "Error when closing file"})
                        }
                    })
                }else{
                    callback(true , {Error: "Error when writing file"})
                }
            })
        }else{
            callback(true , {Error: "Error when opening file , maybe that file has been existing"})
        }

    })
 }

 lib.read = function(dir , file , callback){
     fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err , data){
         //data is content of file
         if(!err && data){
            const parseData = helpers.parseJsonToObject(data);
            callback(false , parseData)
         }else{
             callback(true , {Error : "Could not find the specified file"})
         }
     })
 }

 lib.update = function(dir , file , data , callback){
     // Open file to manipulate

     fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err , fd){
         if(!err && fd){
            fs.truncate(fd , function(err){
                if(!err){
                    fs.writeFile(fd , JSON.stringify(data) , function(err){
                        if(!err){
                            fs.close(fd , function(err){
                                if(!err){
                                    callback(false , {Success: "Close file successfully"})
                                }else{
                                    callback(true , {Error: "Error when closing file"})
                                }
                            })
                        }else{
                            callback(true , {Error : "Error when writing new content into that files"})
                        }
                    })
                }else{
                    callback(true , {Error : "Error when truncate"})
                }
            })
         }else{
             callback(true , {Error: 'Could not find the specified file'})
         }
     })
 }


 lib.delete = function(dir , file , callback){
     fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
         if(!err){ 
             callback(false , {Success: "file has been delete successfully"})

         }else{
             callback(true , {Error : "Error when delete file"})
         }
     })
 }

 module.exports = lib;