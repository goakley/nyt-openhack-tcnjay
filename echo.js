var uniqueArtists = [];
var longi;
var lati;
var api_key = "BPWRSUCGLJMZST7RN";
var geocoder = new google.maps.Geocoder();

obtainArtists = function(latitude, longitude, callback) {
var max_long, min_long, max_lat, min_lat, url;
//var latitude = 34.0522; //40.7142;
//var longitude =  -118.2428; //-74.0064;
var range = 20;
var max_lat = latitude + range;
var min_lat = latitude - range;
var max_long = longitude + range;
var min_long = longitude - range;
var sort_factor = "song_hotttnesss-desc";
var max_hot = .9;
var results = 20;

var url1 = "http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "&format=json&results=";
var url2 = "&max_longitude=" + max_long + "&min_longitude=" + min_long + "&max_latitude=" + max_lat + "&min_latitude=" + min_lat + "&sort=" + sort_factor + "&song_max_hotttnesss=" + max_hot;
	handler(url1, results, url2, callback);
};

function Artist(nName, nLatitude, nLongitude) {
	this.name = nName;
	this.latitude = nLatitude;
	this.longitude = nLongitude;
};

handler = function(url1, results, url2, callback) {
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
	    		uniqueArtists.push(new Artist(songs[l].artist_name));
	    	}
		}
		if (uniqueArtists.length < 20)
			handler(url1, results+20, url2, callback);
		else
			getLocations(0, callback);
	});
};

getLocations = function(index, callback) {
	url = "http://developer.echonest.com/api/v4/artist/profile?api_key=" + api_key + "&format=json&name=" + uniqueArtists[index].name + "&bucket=artist_location";
	$.getJSON(url, function(data) {
		address = data.response.artist.artist_location.location;
		geocoder.geocode({'address': address}, function (results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		    	uniqueArtists[index].latitude = results[0].geometry.location.lat();
		    	uniqueArtists[index].longitude = results[0].geometry.location.lng();
		    	console.log("Name: " + uniqueArtists[index].name+ ", Lat: "+uniqueArtists[index].latitude+", Long: "+uniqueArtists[index].longitude);
		    	if (index != uniqueArtists.length-1)
					setTimeout(function(){getLocations(index+1, callback)}, 250);
				else
					finish(callback);
		    }
		    else
		    	setTimeout(function(){getLocations(index, callback)}, 250);
		    
		});
	});
};

finish = function(callback) {
	callback(uniqueArtists);
};
