var express = require("express");
var mysql = require("mysql");
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Initialize database if it doesn't exist already
var connection = connectMySQL();

connection.query("CREATE TABLE IF NOT EXISTS scrollDepth (" + 
	"instance_id VARCHAR(50), user_id VARCHAR(50), tilesViewed INT, tilesTotal INT, timestamp DATETIME)", function(err){ 
	if(err) throw err 
	console.log("Created `scrollDepth` table AND LOVED IT");

	connection.query("CREATE TABLE IF NOT EXISTS socialClick (" + 
		"instance_id VARCHAR(50), user_id VARCHAR(50), button VARCHAR(50), parent VARCHAR(200), timestamp DATETIME)", function(err){ 
		if(err) throw err
		console.log("Created `socialClick` and tell you what, it... clicked!");
		
		connection.query("CREATE TABLE IF NOT EXISTS userVisits (" + 
			"instance_id VARCHAR(50), user_id VARCHAR(50), timestamp DATETIME)", function(err){
			if(err) throw err;
			console.log("Created `userVisits`. I'm getting tired of writing funny jokes.");
			
			connection.query("CREATE TABLE IF NOT EXISTS articleButtonClicks (" +
			"instance_id VARCHAR(50), user_id VARCHAR(50), indexNumber INT, timestamp DATETIME)", function(){
				if(err) throw err;
				console.log("Created `articleButtonClicks`. Why do I even bother?");				
				
				connection.query("CREATE TABLE IF NOT EXISTS headingClicks (" +
				"instance_id VARCHAR(50), user_id VARCHAR(50), heading VARCHAR(200), timestamp DATETIME)", function(err){
					if(err) throw err;
					console.log("Created `headingClicks`. Goodbye, cruel world.");				
					connection.end();						
				});
			});
		});
	});
});
	

// Turn on server
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("We're live at port " + port + ".");
});

app.use("/public", express.static(__dirname + "/scripts/"));

app.get("/scroll-depth", function(request, response){
	var connection = connectMySQL();
	
	// Check to see if this instance of looking at the tool has already been recorded
	connection.query("SELECT * FROM scrollDepth WHERE instance_id = ?", 
	[request.query.instance_id || ""], function(err, rows){
		if( err ) throw err;
		if( rows.length > 0 ){
			rows = rows[0];
			if( rows.tilesViewed < parseInt(request.query.tilesViewed) ){
				// Feeling powerful because the user looked at more tiles than they had previously!!
				connection.query("UPDATE scrollDepth SET tilesViewed = ? WHERE instance_id = ? ",
				[request.query.tilesViewed, request.query.instance_id], function(err){
					if( err ) throw err;
					console.log("Oh HELL yeah, user " +  request.query.user_id + " just looked at " + request.query.tilesViewed + " tiles!");
					connection.end();
					success(response);
				});
			}
			else {
				connection.end();
				success(response);
			}
		} 
		// OK, we have a new instance of someone using the tool! Let's mark it down
		else {
			connection.query("INSERT INTO scrollDepth (instance_id, user_id, tilesViewed, tilesTotal, timestamp) VALUES (?, ?, ?, ?, ?)",
			[request.query.instance_id || "a", request.query.user_id || "a", request.query.tilesViewed || 0, request.query.tilesTotal || 0, request.query.timestamp || "0000-00-00"], function(err){
				if( err ) throw err;
				console.log("Is Kanye the most overbooked? Yessir, because we just added another instance.");
				connection.end();
				success(response);
			});
		}
	});
});

app.get("/social-click", function(request, response){
	var connection = connectMySQL();
	connection.query("INSERT INTO socialClick (instance_id, user_id, button, parent, timestamp) VALUES(?, ?, ?, ?, ?)",
	[request.query.instance_id || "a", request.query.user_id || "a", request.query.button || "default", request.query.parent || "no parent", request.query.timestamp || "0000-00-00"], function(err){
		if( err ) throw err;
		console.log("Interviews are like confessions, and also, a user just clicked a social button!");
		connection.end();
		success(response);
	});

});

app.get("/user-visit", function(request, response){
	var connection = connectMySQL();
	connection.query("INSERT INTO userVisits (instance_id, user_id, timestamp) VALUES(?, ?, ?)",
	[request.query.instance_id || "a", request.query.user_id || "a", request.query.timestamp || "0000-00-00"], function(err){
		if( err ) throw err;
		console.log("SOMEONE IS LOOKING AT THIS TOOOOOOOOL!");
		connection.end();
		success(response);
	});	
});

app.get("/article-button-press", function(request, response){
	var connection = connectMySQL();
	connection.query("INSERT INTO articleButtonClicks (instance_id, user_id, indexNumber, timestamp) VALUES(?, ?, ?, ?)",
	[request.query.instance_id || "a", request.query.user_id || "a", request.query.index || 999, request.query.timestamp || "0000-00-00"], function(err){
		if( err ) throw err;
		console.log("Wow. An article reader clicked a briefing button. Wowwww.");
		connection.end();
		success(response);
	});
});

app.get("/heading-click", function(request, response){
	var connection = connectMySQL();
	connection.query("INSERT INTO headingClicks (instance_id, user_id, heading, timestamp) VALUES(?, ?, ?, ?)",
	[request.query.instance_id || "a", request.query.user_id || "a", request.query.heading || "undefined", request.query.timestamp || "0000-00-00"], function(err){
		if( err ) throw err;
		console.log("SOMEBODY is trying to filter THE BRIEFING. HOW DARE THEY?");
		connection.end();
		success(response);
	});
});

function success(response){
	response.status(200).json({message: "success!"});
}

function connectMySQL(database){
	database = database || "";
	// Open connection to mySQL database
	var connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL || "mysql://root@localhost/briefingtracker");
	connection.on("error", function(err){  
		console.log(err);
		connection.end();
		 return setTimeout(function(){ return connectMySQL() },3000);
	});

	connection.connect( function(err){ if(err) throw err; });
	
	return connection;
}