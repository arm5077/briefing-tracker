var tilesTotal = $(".tile").length;
var tilesViewed = 0;
var instance_id = new Date().getTime();
if(typeof s != "undefined") 
	var user_id = s.prop25 || "andrew";
else
	var user_id = "andrew";

// Attach an event to each tile detecting if it has entered the viewport
$(".tile").waypoint(function(){
	if( tilesViewed < $(this.element).index() + 1 ){
		tilesViewed = $(this.element).index() + 1;
		
		$.get("http://localhost:3000/scroll-depth", {
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