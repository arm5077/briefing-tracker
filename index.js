var express = require("express");
var mysql = require("mysql");
var app = express();

// Initialize database if it doesn't exist already
var connection = connectMySQL();
connection.query("CREATE DATABASE IF NOT EXISTS briefingtracker", function(err){ 
	if(err) throw err 
	console.log("Created `briefingtracker` database AND LOVED IT");
	
	connection.query("CREATE TABLE IF NOT EXISTS briefingtracker.scrollDepth (" + 
		"instance_id VARCHAR(50), user_id VARCHAR(50), tilesViewed INT, tilesTotal INT, timestamp DATETIME)", function(err){ 
		if(err) throw err 
		console.log("Created `scrollDepth` table AND LOVED IT EVEN MORE");
		connection.end();
	});
	
});



// Turn on server
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("We're live at port " + port + ".");
});

app.get("/scroll-depth", function(request, response){
	var connection = connectMySQL("briefingtracker");
	
	// Check to see if this instance of looking at the tool has already been recorded
	connection.query("SELECT * FROM scrollDepth WHERE instance_id = ?", 
	[request.query.instance_id || ""], function(err, rows){
		if( err ) throw err;
		// Looks like this person has already looked at a tile! Does this mean they're looking at another one??
		if( rows.length > 0 ){
			// Feeling powerful because the user looked at more tiles than they had previously!!
			rows = rows[0];
			if( rows.tilesViewed < parseInt(request.query.tilesViewed) ){
				connection.query("UPDATE scrollDepth SET tilesViewed = ? WHERE instance_id = ? ",
				[request.query.tilesViewed, request.query.instance_id], function(err){
					if( err ) throw err;
					console.log("Oh HELL yeah, user " +  request.query.user_id + " just looked at " + request.query.tilesViewed + " tiles!");
					connection.end();
				});
			}
			else {
				connection.end();
			}
		} 
		// OK, we have a new instance of someone using the tool! Let's mark it down
		else {
			connection.query("INSERT INTO scrollDepth (instance_id, user_id, tilesViewed, tilesTotal, timestamp) VALUES (?, ?, ?, ?, ?)",
			[request.query.instance_id || "a", request.query.user_id || "a", request.query.tilesViewed || 0, request.query.tilesTotal || 0, request.query.timestamp || "0000-00-00"], function(err){
				if( err ) throw err;
				console.log("Is Kanye the most overbooked? Yessir, because we just added another instance.");
				connection.end();
			});
		}
	});
	

});

function connectMySQL(database){
	database = database || "";
	// Open connection to mySQL database
	var connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL || "mysql://root@localhost/" + database);
	connection.on("error", function(err){  
		connection.end();
		 return setTimeout(function(){ return connectMySQL() },3000);
	});

	connection.connect( function(err){ if(err) throw err; });
	
	return connection;
}