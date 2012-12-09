
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
	var current_value = $("#form_location_text").val();
	if (current_value.length == 0) {
	    $("#form_location_text").val(position.coords.latitude + "," + 
					position.coords.longitude);
	}
    });
}

$("#form_location").submit(function(event) {
    var input = $("#form_location_text").val();
    $("#form_location_text").val("");
    event.preventDefault();
    MusicMap.extractLocation(input, function(lat, lon) {
	(new EchoServer(lat, lon)).obtainArtists(function(artists) {
	    for (var i = 0; i < artists.length; i++) {
		artists[i]['familiarity'] = 32;
	    }
	    var songs = create_songs(artists);
	    console.log(songs);
	});
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
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address':input}, function(results, status) {
	    callback(results[0].geometry.location.lat(),
		     results[0].geometry.location.lng());
	});
    }
}
