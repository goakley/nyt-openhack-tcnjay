
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
	this.carto_api = '72b847076e2f6312f9116a24bea7a27d44ac7f7e';
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

MusicMap.getMap = function (addresses)
{
	var map, map_carto_layer,
		url = 'http://musicmaps.cartodb.com/api/v2/sql';

	$.each(addresses,
		function (index, item)
		{
			var sql = 'INSERT INTO nearby_artists(artist, familiarity, lat, lon) VALUES (';
				sql += '"' + item.artist + '",';
				sql += item.familiarity + ',';
				sql += item.lat + ',';
				sql += item.lon;
			sql += ')';

			$.ajax(
				{
					'data': {
						'q': sql,
						'api_key': this.api_key
					},
					'type': 'get',
					'url': url,

					success: function (resp, success, xhr)
					{
						if (addresses.length - 1 === index)
						{
							map = new google.maps.Map($('#map')[0],
								{
									center: new google.maps.LatLng(this.latitude, this.longitude),
									zoom: 8,
									mapTypeId: google.maps.MapTypeId.ROADMAP
								}
							);

							map_carto_layer = new google.maps.CartoDBLayer(
								{
									map_canvas: 'map',
									map: map,
									username: 'musicmaps',
									password: 'tcnjrulez',
									query: 'SELECT * FROM nearby_artists'
								}
							);
						}
					}
				}
			);
		}
	);
};
