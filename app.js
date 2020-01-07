window.addEventListener("load", function() {
	var selected = null;
	
	var leftPress = null;
	var centrePress = null;
	var rightPress = null;
	var arrowUp = null;
	var arrowDown = null;
	
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
	
	
	$("#crs-input").focus();

});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};