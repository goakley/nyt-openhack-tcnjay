
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
    MusicMap.extractLocation(input, function(lat, lon) {
	alert(lat + "," + lon);
	//obtain_artists(lat, lon, function(){});
    });
});




function MusicMap(lat, lon) {
    this.latitude = lat;
    this.longitude = lon;
}

MusicMap.extractLocation = function(input, callback) {
    var regex = new RegExp("[-+]?[0-9]*\.?[0-9]+,[-+]?[0-9]*\.?[0-9]+");
    var parsed_input = input.match(regex);
    if (parsed_input) {
	parsed_input = parsed_input[0].split(",");
	callback(parsed_input[0], parsed_input[1]);
    } else {
	alert("Extracting Location");
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address="
	    + encodeURIComponent(parsed_input) + "&sensor=false";
	$.getJSON(url, function(data) {
	    alert("GOTTEN");
	    var location = data['results']['geometry']['location'];
	    callback(location['lat'], location['lon']);
	});
    }
}
