window.addEventListener("load", function() {
	var selected = null;
	
	var id = getUrlParameter("id");
				
	$.ajax("https://huxley.apphb.com/service/" + id + "?accessToken=3c6cc25e-5d90-4be5-a3fb-7c05f05348c5")
	.done(function(resp){
		console.log(resp);
		$("#calling tbody").empty();
			
		if(resp.previousCallingPoints){
			resp.previousCallingPoints[0].callingPoint.forEach(function (point, index) {
				var plat = point.platform ? point.platform : "";
				if(point.at){
					$("#calling tbody").append("<tr class='train ontime passed'><td>" + point.st + "</td><td><div>" + point.locationName + "<span class='platform'>" + plat + "</span><div></td><td>" + point.at.toLowerCase() + "</td></tr>");
				} else {
					$("#calling tbody").append("<tr class='train ontime to-pass'><td>" + point.st + "</td><td><div>" + point.locationName + "<span class='platform'>" + plat + "</span><div></td><td>" + point.et.toLowerCase() + "</td></tr>");
				}
			});
		}
		
		if(resp.isCancelled){
			$("#calling tbody").append("<tr class='cancel'><td colspan=3>" + resp.cancelReason + "</td></tr>");
		} else if(resp.delayReason) {
			$("#calling tbody").append("<tr class='cancel'><td colspan=3>" + resp.delayReason + "</td></tr>");
		}
		var scrollTo = 0;
		if($("#calling tbody tr").length){
			scrollTo = $("#calling tbody tr").last().offset().top;
		}
		
		$("#calling tbody").append("<tr class='train ontime actual'><td>" + resp.std + "</td><td><div>" + resp.locationName + "<div></td><td>" + resp.etd.toLowerCase() + "</td></tr>");
		resp.subsequentCallingPoints[0].callingPoint.forEach(function (point, index) {
			$("#calling tbody").append("<tr class='train ontime'><td>" + point.st + "</td><td><div>" + point.locationName + "<div></td><td>" + point.et.toLowerCase() + "</td></tr>");
		});
		
		var length = resp.length ? "Formed of " + resp.length.toString() + " carriages<br />" : "";
		$("#calling tbody").append("<tr class='cancel'><td colspan=3>" + length + "Operated by " + resp.operator + "</td></tr>");
		
		$(window).scrollTop(scrollTo);
	});
	
	$(document).keypress(function(e){
		console.log(e.key);
		switch(e.key){
			case "SoftRight":
			case "Shift":
				break;
			case "SoftLeft":
			case "Control":
				window.history.back()
				break;
			
			/*case "ArrowDown":
				arrowDown();
				e.preventDefault();
				break;
				
			case "ArrowUp":
				arrowUp();
				e.preventDefault();
				break;
			case "Enter":
				console.log("enter")
				window.location.href = "details.html?id=" + selected.attr("data-trainId");
				e.preventDefault();
				break;
				*/
		}
	});
});