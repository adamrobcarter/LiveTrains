window.addEventListener("load", function() {
	var selected = null;
	
	var leftPress = null;
	var centrePress = null;
	var rightPress = null;
	var arrowUp = null;
	var arrowDown = null;
	
	var crs = getUrlParameter("crs");
	crs = crs.replace(".","/to/");
	
	console.log("getting departures for " + crs);
	$.ajax("https://huxley.apphb.com/departures/" + crs + "/25?accessToken=3c6cc25e-5d90-4be5-a3fb-7c05f05348c5")
	.done(function(resp) {
		if(resp.filtercrs){
			$("#dep-for").text(resp.locationName + " (" + resp.crs + ") to " + resp.filterLocationName + " (" + resp.filtercrs + ")");
		} else {
			$("#dep-for").text(resp.locationName + " (" + resp.crs + ")");
		}
		console.log(resp);
		$("#results tbody").empty();
		selected = null;
		if (resp.trainServices && resp.trainServices.length > 0) {
			resp.trainServices.forEach(function (train, index) {
				var trainStr = "<tr class='train'><td>" + train.std + "</td><td><div>" + train.destination[0].locationName
				trainStr += train.destination[1] ? " and others" : "";
				trainStr += train.destination[0].via ? "<span class='via'> " + train.destination[0].via + "</span>" : "";
				trainStr += "<span class='platform'>" 
				trainStr += train.platform ? train.platform : "";
				trainStr += "</span></div></td>";
				if(train.isCancelled){
					trainStr += "<td>cancelled</td></tr>";
				} else {
					trainStr += "<td>" + train.etd.toLowerCase() + "</td></tr>";
				}
				$("#results tbody").append(trainStr);
				$("#results tbody tr:last-child").attr("data-trainId",train.serviceIdUrlSafe);
			});
			
			selected = $($("#results tr")[0]).attr("data-selected","true");
			
		} else {
			$("#results tbody").append("<p>There are no departures from this station</p>");
		}
		$("#results-page .page-container").scrollTop(0);
	})
	.fail(function(data) {
		console.log("request failed");
		console.log(data);
	})
	.always(function() {
	});
	
	arrowUp = function() {
		console.log("arrow up");
		if(selected.prev().is("tr")){
			selected.attr("data-selected","false");
			selected = selected.prev().attr("data-selected","true");
			console.log(selected.offset().top - $(window).scrollTop());
			console.log(selected.outerHeight());
			if(selected.offset().top - $(window).scrollTop() < 30){
				console.log(- selected.outerHeight() + $(window).scrollTop());
				$(window).scrollTop( - selected.outerHeight() + $(window).scrollTop() );
			}
		}
	}
	arrowDown = function() {
		console.log("arrow down");
		if(selected.next().is("tr")){
			selected.attr("data-selected","false");
			selected = selected.next().attr("data-selected","true");
			console.log(selected.offset().top - $(window).scrollTop());
			console.log(selected.outerHeight());
			if(selected.offset().top - $(window).scrollTop() > 200){
				console.log(selected.outerHeight() + $(window).scrollTop());
				$(window).scrollTop( selected.outerHeight() + $(window).scrollTop()	);
			}
		}
	}
	
	$(document).keypress(function(e){
		console.log(e.key);
		switch(e.key){
			case "SoftRight":
			case "Shift":
				break;
			case "SoftLeft":
			case "Control":
				window.location.href = 'index.html';
				break;
			
			case "ArrowDown":
			case "]":
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
				
		}
	});
});
