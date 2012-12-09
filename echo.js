var EchoServer = new function() {
    var api_key = "BPWRSUCGLJMZST7RN";
    var geocoder = new google.maps.Geocoder();
    this.obtainArtists = function(latitude, longitude, callback) {
	// Build the location query URL
	var range = 1;
	var max_lat = latitude + range;
	var min_lat = latitude - range;
	var max_long = longitude + range;
	var min_long = longitude - range;
	var sort_factor = "song_hotttnesss-desc";
	var url_song = "http://developer.echonest.com/api/v4/song/search" + 
	    "?api_key=" + api_key + "&format=json&max_longitude=" + max_long + 
	    "&min_longitude=" + min_long + "&max_latitude=" + max_lat + 
	    "&min_latitude=" + min_lat + "&sort=" + sort_factor + 
	    "&results=100";
	// stores the unique artists
	var uniqueArtists = [];
	// this function does the actual artists obtaining
	var handler = function(callback) {
	    var getLocations = function(index, callback) {
		var finish = function(callback) {
		    callback(uniqueArtists);
		};
		var url = "http://developer.echonest.com/api/v4/artist/profile"
		    + "?api_key=" + api_key + "&format=json&name=" + 
		    uniqueArtists[index].name + "&bucket=artist_location" + 
		    "&bucket=familiarity&bucket=hotttnesss&bucket=songs";
		console.log(encodeURI(url));
		$.getJSON(encodeURI(url), function(data) {
		    var address=data.response.artist.artist_location.location;
		    uniqueArtists[index].artist_location = 
			data.response.artist.artist_location;
		    uniqueArtists[index].familiarity = 
			data.response.artist.familiarity;
		    uniqueArtists[index].hotttnesss = 
			data.response.artist.hotttnesss;
		    uniqueArtists[index].songs = data.response.artist.songs;
		    geocoder.geocode({'address': address}, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
			    uniqueArtists[index].lat = results[0].geometry.location.lat();
			    uniqueArtists[index].lon = results[0].geometry.location.lng();
			    if (index < uniqueArtists.length-1) {
				setTimeout(function(){getLocations(index+1, callback)}, 250);
			    } else {
				finish(callback);
			    }
			}
			else
			    setTimeout(function(){getLocations(index, callback)}, 250);
		    });
		});
	    };
	    $.getJSON(url_song, function(data) {
		// check for a successful response
		if (data.response.status.code == 0) {
		    var songs = data.response.songs;
		    for (l=0; l<songs.length; l++) {
			var isUnique = true;
			for (m=0; m<uniqueArtists.length && isUnique; m++) {
	    		    if (songs[l].artist_id === uniqueArtists[m].id)
	    			isUnique = false;
			}
			if (isUnique) {
	    		    uniqueArtists.push({'name':songs[l].artist_name,
						'id':songs[l].artist_id});
			}
		    }
		    getLocations(0, callback);
		} else {
		    // an error has occured with the request; try again soon
		    setTimeout(function(){handler(callback);}, 500);
		}
	    });
	}
	handler(callback);
    }
};
