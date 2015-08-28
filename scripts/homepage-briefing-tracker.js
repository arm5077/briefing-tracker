var tilesTotal = $(".briefing-update").length;
var tilesViewed = 0;
var instance_id = new Date().getTime();
if(typeof s != "undefined") 
	var user_id = s.prop57 || "no_user_property";
else
	var user_id = "no_user_property";

// Attach an event to each tile detecting if it has entered the viewport
$(".briefing-update").waypoint(function(){
	if( tilesViewed < $(this.element).index() + 1 ){
		tilesViewed = $(this.element).index() + 1;
		
		$.get("http://nj-briefing-tracker.herokuapp.com/scroll-depth", {
			user_id: user_id, 
			instance_id: instance_id,
			tilesTotal: tilesTotal,
			tilesViewed: tilesViewed,
			timestamp: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " " + (new Date().getHours() + 1) + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
		}, function(data){
			console.log(data);
		});
	}
}, {
	offset: "100%"
});

// Attach event to overall social button click
$(".post-share-btn").click(function(){
	$.get("http://nj-briefing-tracker.herokuapp.com/social-click", {
		user_id: user_id,
		instance_id: instance_id,
		button: "overall",
		timestamp: makeTimestamp()
	}, function(data){
		console.log(data);
	});
});

function makeTimestamp(){
	return new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " " + (new Date().getHours() + 1) + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
}