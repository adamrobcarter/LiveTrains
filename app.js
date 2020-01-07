window.addEventListener("load", function() {
	console.log("Hello World!");
	
	var selected = null;
	
	var crs = 'SHF'
	var load = function(crs){
		console.log("getting departures for " + crs);
		$.ajax("https://huxley.apphb.com/all/" + crs + "/10?accessToken=3c6cc25e-5d90-4be5-a3fb-7c05f05348c5")
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
				
			} else {
				$("#results tbody").append("<p>There are no departures from this station</p>");
			}
		})
		.fail(function(data) {
			console.log("request failed");
			console.log(data);
		})
		.always(function() {
		});
	}

	
	$(document).keyup(function(e){
		console.log(e.key);
		switch(e.key){
			case "SoftRight":
			case "Shift":
				console.log("go");
				load($("#crs-input").val().toUpperCase());
				
				break;
			case "SoftLeft":
			case "Control":
				$("#train-popup").hide();
				$("#crs-input").focus();
				$(".nav").text("");
				$(".nav#centre").text("view");
				$(".nav#right").text("go");
				break;
			
			case "ArrowDown":
				if(!selected){
					selected = $($("#results tr")[0]).attr("data-selected","true");
					$(".nav#centre").text("view");
				} else {
					selected.attr("data-selected","false");
					selected = selected.next().attr("data-selected","true");
				}
				break;
				
			case "ArrowUp":
				selected.attr("data-selected","false");
				selected = selected.prev().attr("data-selected","true");
				
				break;
			case "Enter":
				openDetail(selected.attr("data-trainId"));
				e.preventDefault()
				break;
				
		}
		console.log(selected);
	});
	
	$("#train-popup").hide();
	
	$("#crs-input").focus();
	
	var openDetail = function(id){
		console.log(id);
		//var id = s_element.attr("data-trainId");
					
		$.ajax("https://huxley.apphb.com/service/" + id + "?accessToken=3c6cc25e-5d90-4be5-a3fb-7c05f05348c5")
		.done(function(resp){
			console.log(resp);
			$("#train-popup").show();
			$("#calling tbody").empty();
			if(resp.previousCallingPoints){
				resp.previousCallingPoints[0].callingPoint.forEach(function (point, index) {
					$("#calling tbody").append("<tr class='train ontime passed'><td>" + point.st + "</td><td><div>" + point.locationName + "<div></td><td>" + point.et + "</td></tr>");
				});
			}
			$("#calling tbody").append("<tr class='train ontime actual'><td>" + resp.std + "</td><td><div>" + resp.locationName + "<div></td><td>" + resp.etd + "</td></tr>");
			resp.subsequentCallingPoints[0].callingPoint.forEach(function (point, index) {
				$("#calling tbody").append("<tr class='train ontime'><td>" + point.st + "</td><td><div>" + point.locationName + "<div></td><td>" + point.et + "</td></tr>");
			});
			$(".nav").text("");
			$(".nav#left").text("back");
		});
	}
});
