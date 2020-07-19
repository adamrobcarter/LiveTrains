window.addEventListener("load", function() {
	var arrowDown = null;
	
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

var processTime = function(time) {
	if(time == "On time"){
		return "on";
	} else if(time == "No report"){
		return "";
	} else if(time == "Cancelled"){
		return "cancelled";
	} else if(time == "Delayed"){
		return "delay";
	} else {
		return time;
	}
}

var howLate = function(t1, t2) {
	var d1 = Date.parse("1970-01-01 " + t1);
	var d2 = Date.parse("1970-01-01 " + t2);
	return d2 - d1;
}