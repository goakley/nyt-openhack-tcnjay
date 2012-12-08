
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
	var current_value = $("#form_location_text").val();
	if (current_value && current_value.length() > 0) {
	    $("form_location_text").val(position.coords.latitude + "," + 
					position.coords.longitude);
	}
    });
}

$("#form_location").submit(function(event) {
    var input = $("#form_location_text").val();
    $("#form_location_text").val("");
    event.preventDefault();
    extractLocation(input, function(lat, lon) {
	obtain_artists(lat, lon, function(){});
    });
});


function extractLocation(input, callback) {
    var regex = new RegExp("[-+]?[0-9]*\.?[0-9]+,[-+]?[0-9]*\.?[0-9]+");
    var parsed_input = input.match(regex)[0];
    if (parsed_input) {
	parsed_input = parsed_input.split(",");
	callback(parsed_input[0], parsed_input[1]);
    } else {
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address="
	    + encodeURIComponent(parsed_input) + "&sensor=false";
	$.getJSON(url, function(data) {
	    var location = data['results']['geometry']['location'];
	    callback(location['lat'], location['lon']);
	});
    }
}
