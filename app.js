window.addEventListener("load", function() {
	var selected = null;
	
	var leftPress = null;
	var centrePress = null;
	var rightPress = null;
	var arrowUp = null;
	var arrowDown = null;
	
	var load = function(){
		var crs = $("#crs-input").val().toUpperCase()
		console.log("getting departures for " + crs);
		$.ajax("https://huxley.apphb.com/all/" + crs + "/25?accessToken=3c6cc25e-5d90-4be5-a3fb-7c05f05348c5")
		.done(function(resp) {
			$("#dep-for").text(resp.locationName + " (" + resp.crs + ")");
			console.log(resp);
			$("#results tbody").empty();
			selected = null;
			if (resp.trainServices && resp.trainServices.length > 0) {
				resp.trainServices.forEach(function (train, index) {
					if(train.destination[0].crs != crs){
						if(train.cancelReason){
							$("#results tbody").append("<tr class='train cancelled'><td>" + train.std + "</td><td><div>" + train.destination[0].locationName + "</div></td><td>cancelled</td></tr>");
						} else {
							$("#results tbody").append("<tr class='train delayed'><td>" + train.std + "</td><td><div>" + train.destination[0].locationName + "</div></td><td>" + train.etd + "</td></tr>");
						}
						$("#results tbody tr:last-child").attr("data-trainId",train.serviceIdUrlSafe);
					}
				});
				
				selected = $($("#results tr")[0]).attr("data-selected","true");
				
			} else {
				$("#results tbody").append("<p>There are no departures from this station</p>");
			}
			$("#results-page .page-container").scrollTop(0);
			goToTrains();
		})
		.fail(function(data) {
			console.log("request failed");
			console.log(data);
		})
		.always(function() {
		});
	}
	
	var goToInput = function() {
		$("table#layout").css("left","0px");
		centrePress = load;
	}
	
	var goToTrains = function() {
		console.log("go to trains");
		$("table#layout").css("left","-240px");
		leftPress = goToInput;
		rightPress = loadDetail;
		
		arrowUp = function() {
			console.log("arrow up");
			selected.attr("data-selected","false");
			selected = selected.prev().attr("data-selected","true");
			console.log(selected.offset().top - $("#results-page .page-container").scrollTop());
			console.log(selected.outerHeight());
			if(selected.offset().top - $("#results-page .page-container").scrollTop() < 30){
				$("#results-page .page-container").scrollTop( 
					 - selected.outerHeight() + $("#results-page .page-container").scrollTop()
				);
			}
		}
		arrowDown = function() {
			console.log("arrow down");
			selected.attr("data-selected","false");
			selected = selected.next().attr("data-selected","true");
			console.log(selected.offset().top - $("#results-page .page-container").scrollTop());
			console.log(selected.outerHeight());
			if(selected.offset().top - $("#results-page .page-container").scrollTop() > 180){
				$("#results-page .page-container").scrollTop( 
					selected.outerHeight() + $("#results-page .page-container").scrollTop()
				);
			}
		}
		centrePress = loadDetail;
	}
	
	var goToDetail = function(){
		console.log("go to detail");
		$("table#layout").css("left","-480px");
		leftPress = goToTrains;
	}

	goToInput();
	
	$(document).keypress(function(e){
		console.log(e.key);
		switch(e.key){
			case "SoftRight":
			case "Shift":
				rightPress();
				//console.log("go");
				//load($("#crs-input").val().toUpperCase());
				
				break;
			case "SoftLeft":
			case "Control":
				leftPress();
				/*$("#train-popup").hide();
				popup = false;
				$("#crs-input").focus();
				$(".nav").text("");
				$(".nav#centre").text("view");
				$(".nav#right").text("go");*/
				break;
			
			case "ArrowDown":
				arrowDown();
				e.preventDefault();
				break;
				
			case "ArrowUp":
				arrowUp();
				e.preventDefault();
				break;
			case "Enter":
				console.log("enter")
				//openDetail(selected.attr("data-trainId"));
				centrePress();
				e.preventDefault();
				break;
				
		}
	});
	
	$("#crs-input").focus();
	
	var loadDetail = function(){
		var id = selected.attr("data-trainId");
					
		$.ajax("https://huxley.apphb.com/service/" + id + "?accessToken=3c6cc25e-5d90-4be5-a3fb-7c05f05348c5")
		.done(function(resp){
			console.log(resp);
			goToDetail();
			$("#calling tbody").empty();
			if(resp.isCancelled){
				$("#calling tbody").append("<tr class='cancel'><td colspan=3>" + resp.cancelReason + "</td></tr>");
			} else if(resp.delayReason) {
				$("#calling tbody").append("<tr class='cancel'><td colspan=3>" + resp.delayReason + "</td></tr>");
			}
				
			if(resp.previousCallingPoints){
				resp.previousCallingPoints[0].callingPoint.forEach(function (point, index) {
					$("#calling tbody").append("<tr class='train ontime passed'><td>" + point.st + "</td><td><div>" + point.locationName + "<div></td><td>" + point.at + "</td></tr>");
				});
			}
			$("#calling tbody").append("<tr class='train ontime actual'><td>" + resp.std + "</td><td><div>" + resp.locationName + "<div></td><td>" + resp.etd + "</td></tr>");
			resp.subsequentCallingPoints[0].callingPoint.forEach(function (point, index) {
				$("#calling tbody").append("<tr class='train ontime'><td>" + point.st + "</td><td><div>" + point.locationName + "<div></td><td>" + point.et + "</td></tr>");
			});
		});
	}
});
