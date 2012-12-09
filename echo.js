var EchoServer = new function() {
    var api_key = "BPWRSUCGLJMZST7RN";
    var geocoder = new google.maps.Geocoder();
    this.obtainArtists = function(latitude, longitude, callback) {
	// Build the location query URL
	var range = 10;
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
		    uniqueArtists[index].name + "&bucket=artist_location";
		$.getJSON(url, function(data) {
		    var address=data.response.artist.artist_location.location;
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
	    		    uniqueArtists.push({'artist':songs[l].artist_name,
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







    /*
      function EchoServer(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
      var max_results = 16;
      var range = 20;
      var max_lat = latitude + range;
      var min_lat = latitude - range;
      var max_long = longitude + range;
      var min_long = longitude - range;
      var sort_factor = "song_hotttnesss-desc";
      var max_hot = .9;
      var url1 = "http://developer.echonest.com/api/v4/song/search?api_key=" + 
      EchoServer.api_key + "&format=json&results=";
      var url2 = "&max_longitude=" + max_long + "&min_longitude=" + min_long + "&max_latitude=" + max_lat + "&min_latitude=" + min_lat + "&sort=" + sort_factor + "&song_max_hotttnesss=" + max_hot;
      var uniqueArtists = [];
      var handler = function(results, prev_len, callback) {
      var getLocations = function(index, callback) {
      var finish = function(callback) {
      callback(uniqueArtists);
      };
      var url = "http://developer.echonest.com/api/v4/artist/profile?api_key=" + EchoServer.api_key + "&format=json&name=" + uniqueArtists[index].name + "&bucket=artist_location";
      $.getJSON(url, function(data) {
      var address = data.response.artist.artist_location.location;
      EchoServer.geocoder.geocode({'address': address}, function (results, status) {
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
      $.getJSON(url1+results+url2, function(data) {
      var songs = data.response.songs;
      for (l=0; l<songs.length; l++) {
      var flag = true;
      for (m=0; m<uniqueArtists.length && flag; m++)
      {
      if (songs[l].artist_name === uniqueArtists[m].name)
      flag = false;
      }
      if (flag)
      {
      uniqueArtists.push({'artist':songs[l].artist_name,
      'id':songs[l].artist_id});
      }
      }
      if (uniqueArtists.length == prev_len) {
      getLocations(0, callback);
      return;
      }
      if (uniqueArtists.length < max_results)
      handler(results+20, uniqueArtists.length, callback);
      else
      getLocations(0, callback);
      });
      }
      this.obtainArtists = function(callback) {
      handler(8, 0, callback);
      }
      }
      EchoServer.api_key = "BPWRSUCGLJMZST7RN";
      EchoServer.geocoder = new google.maps.Geocoder();
    */