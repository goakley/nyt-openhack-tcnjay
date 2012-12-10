
    if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
	    var current_value = $("#form_location_text").val();
	    if (current_value.length == 0) {
		$("#form_location_text").val(position.coords.latitude + "," + 
					     position.coords.longitude);
	    }
	});
    }
var map = new google.maps.Map(document.getElementById('map'),
			      {center:(new google.maps.LatLng(0,0)),
			       zoom:3,
			       mapTypeId:google.maps.MapTypeId.HYBRID});
google.maps.event.trigger(map, 'resize', function(){});

var oms = new OverlappingMarkerSpiderfier(map);

$("#form_location").submit(function(event){
    $("#form_location").children('input[type=submit]').attr('disabled',
							    'disabled');
    var input = $("#form_location_text").val();
    $("#form_location_text").val("");
    event.preventDefault();
    $("#notif").text("Please Wait...");
    MusicMap.extractLocation(input, function(lat, lon) {
	var latlon = new google.maps.LatLng(lat,lon);
	var circle = new google.maps.Circle({center:latlon,
					     fillColor:'red', fillOpacity:0.1,
					     strokeWeight:1,
					     radius:111120,
					     map:map});
	map.setCenter(latlon);
	map.setZoom(8);
	console.log("YO I GOT HERE");
	/*	var usualColor = 'eebb22';
		var spiderfiedColor = 'ffee22';
		var iconWithColor = function(color) {
		return 'http://chart.googleapis.com/chart?chst=d_map_xpin_letter&chld=pin|+|' +
		color + '|000000|ffff00';
		}*/
	oms.addListener('click', function(marker) {
		    var info = "<h1>"+this.artist.name+" (" + 
			this.artist.artist_location.location + ")</h1>";
		    info += "<ul>"
		    for (var i = 0; i < this.artist.songs.length; i++)
			info += "<li>" + this.artist.songs[i].title + "</li>";
		    info += "</ul>";
		    $("#songs").html(info);
		    event.stop();
	});
	EchoServer.obtainArtists(lat, lon, function(artists) {
	    $("#notif").html("&nbsp");
	    for (var i = 0; i < artists.length; i++) {
		console.log(artists[i].name + " " + artists[i].lat + " " + artists[i].lon);
		var marker = new google.maps.Marker({
		    position:(new google.maps.LatLng(artists[i].lat,
						     artists[i].lon)),
		    title:artists[i].name,
		    clickable:true,
		    map:map
		});
		marker.artist = artists[i];
		oms.addMarker(marker);
		oms.addListener('spiderfy', function(markers) {

		});
		oms.addListener('unspiderfy', function(markers) {

		});
		
		/*google.maps.event.addListener(marker, 'click', function(event){
		  var info = "<h1>"+this.artist.name+" (" + 
		  this.artist.artist_location.location + ")</h1>";
		  info += "<ul>"
		  for (var i = 0; i < this.artist.songs.length; i++)
		  info += "<li>" + this.artist.songs[i].title + "</li>";
		  info += "</ul>";
		  $("#songs").html(info);
		  event.stop();
		  });*/
	    }
	    $("#form_location").children('input[type=submit]').removeAttr('disabled');
	});
    });
});

    MusicMap = {};
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
    };
