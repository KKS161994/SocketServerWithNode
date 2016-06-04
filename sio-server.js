var express = require("express");
var app = express();
var server=app.listen(process.env.PORT || 5000);
var io = require("socket.io")(server);
var mongodb=require('mongodb');

var mongoClient=mongodb.MongoClient;

var url='mongodb://Aksharahasan:shasha9305@ds047095.mlab.com:47095/chatdb';


app.use(express.static("./public"));

io.on("connection", function(socket) {
	mongoClient.connect(url,function(err,db){
    if(err){
        console.log("Unable to connect to the mongodb server . Error :",err);
    }else{
        console.log("Connection Established",url);

        var collection=db.collection('users');

        collection.find({name:'connection'}).toArray(function(err,result){
            if(err){
                console.log("Error:",err);
            }else if(result.length){

                var connected=result[0].connected;
                connected++;
                console.log('Found:',connected);
                collection.update({name:'connection'},{$set:{connected:connected}},function(err,numupdated){
            if(err){
                console.log(err);
            }else if (numupdated) {
                console.log('Updated Successfully %d document',numupdated);
                var msg=""
                if(connected>1){
                	msg="There are "+ connected + " participants";
                }else{
                	msg="There are "+ connected + " participant";
                }
                socket.broadcast.emit("message","",msg)
            }else{
                console.log('No document found ');
            }

            db.close();
        });
            }else{
                console.log('No document(s) found with defined "find" criteria!');
            }
            //db.close();
        })
    }
});

    socket.on("chat", function(user,message) {
    	socket.broadcast.emit("message", user,message);
    });

    socket.on("disconnect",function(){

    	mongoClient.connect(url,function(err,db){
    if(err){
        console.log("Unable to connect to the mongodb server . Error :",err);
    }else{
        console.log("Connection Established",url);

        var collection=db.collection('users');

        collection.find({name:'connection'}).toArray(function(err,result){
            if(err){
                console.log("Error:",err);
            }else if(result.length){
                
                var connected=result[0].connected;
                connected--;
                console.log('Found:',connected);
                collection.update({name:'connection'},{$set:{connected:connected}},function(err,numupdated){
            if(err){
                console.log(err);
            }else if (numupdated) {
                console.log('Updated Successfully %d document',numupdated);
                var msg=""
                if(connected>1){
                	msg="Now,there are "+ connected + " participants";
                }else{
                	msg="Now,there are "+ connected + " participant";
                }

                socket.broadcast.emit("message","",msg)
            }else{
                console.log('No document found ');
            }

            db.close();
        });
            }else{
                console.log('No document(s) found with defined "find" criteria!');
            }
            //db.close();
        })
    }
});

    })

	socket.emit("message","","Welcome to Cyber Chat");

});

