$(document).ready(function(){
	var instance_id = new Date().getTime();
	if(typeof s != "undefined") 
		var user_id = s.prop57 || "no_user_property";
	else
		var user_id = "no_user_property";

	$(".bupdate-story-pointer").click(function(){
		var obj = this;
		$.get("http://nj-briefing-tracker.herokuapp.com/article-button-press", {
			user_id: user_id, 
			instance_id: instance_id,
			index: $(obj).parent().attr("data-slide-index"),
			timestamp: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " " + (new Date().getHours() + 1) + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
		}, function(data){
			console.log(data);
		});
	});

		// Attach event to overall social button click
	$(".briefing-update .post-share-btn").click(function(){
		$.get("http://nj-briefing-tracker.herokuapp.com/social-click", {
			user_id: user_id,
			instance_id: instance_id,
			button: "overall",
			parent: $(this).parents(".briefing-update").first().find(".post-content p").html(),
			timestamp: makeTimestamp()
		}, function(data){
			console.log(data);
		});
	});

	// Attach event to facebook button click
	$(".briefing-update .link-facebook a").click(function(){
		$.get("http://nj-briefing-tracker.herokuapp.com/social-click", {
			user_id: user_id,
			instance_id: instance_id,
			button: "facebook",
			parent: $(this).parents(".briefing-update").first().find(".post-content p").html(),
			timestamp: makeTimestamp()
		}, function(data){
			console.log(data);
		});
	});

	// Attach event to twitter button click
	$(".briefing-update .link-twitter a").click(function(){
		$.get("http://nj-briefing-tracker.herokuapp.com/social-click", {
			user_id: user_id,
			instance_id: instance_id,
			button: "twitter",
			parent: $(this).parents(".briefing-update").first().find(".post-content p").html(),
			timestamp: makeTimestamp()
		}, function(data){
			console.log(data);
		});
	});	
});
