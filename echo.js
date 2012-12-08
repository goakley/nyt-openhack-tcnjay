var uniqueArtists = [];
var longi;
var lati;
var api_key = "BPWRSUCGLJMZST7RN";

wrapper = function(callback) {
var max_long, min_long, max_lat, min_lat, url;
latitude = 34.0522; //40.7142;
longitude =  -118.2428; //-74.0064;
range = 20;
max_lat = latitude + range;
min_lat = latitude - range;
max_long = longitude + range;
min_long = longitude - range;
sort_factor = "song_hotttnesss-desc";
max_hot = .9;
results = 20;

url1 = "http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "&format=json&results=";
url2 = "&max_longitude=" + max_long + "&min_longitude=" + min_long + "&max_latitude=" + max_lat + "&min_latitude=" + min_lat + "&sort=" + sort_factor + "&song_max_hotttnesss=" + max_hot;
	handler(url1, results, url2, callback);
};

function Artist(nName, nLatitude, nLongitude) {
	this.name = nName;
	this.latitude = nLatitude;
	this.longitude = nLongitude;
};

handler = function(url1, results, url2, callback) {
	$.getJSON(url1+results+url2, function(data) {
		songs = data.response.songs;
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
		getLocations();
	});
};

getLocations = function(url) {
	$.each(uniqueArtists, function(i, val) {
		url = "http://developer.echonest.com/api/v4/artist/profile?api_key=" + api_key + "&format=json&name=" + uniqueArtists[i].name + "&bucket=artist_location";	
		$.getJSON(url, function(data) {
			input = data.response.artist.artist_location.location;
		    var regex = new RegExp("[-+]?[0-9]*\.?[0-9]+,[-+]?[0-9]*\.?[0-9]+");
		    var parsed_input = input.match(regex);
		    if (parsed_input) {
				parsed_input = parsed_input[0].split(",");
				callback(parsed_input[0], parsed_input[1]);
		    } else {
				var url = "https://maps.googleapis.com/maps/api/geocode/json?address="
			    + encodeURIComponent(parsed_input) + "&sensor=false";
				$.getJSON(url, function(data) {
				    var location = data['results']['geometry']['location'];
				    uniqueArtists[i].latitude = location['lat'];
				    uniqueArtists[i].longitude = location['lon'];
				    console.log(i);
				    if (i == uniqueArtists.length-1)
				    	finish();
				});
			}
		});
	});
};

finish = function() {
	for (k=0; k<uniqueArtists.length; k++)
	console.log("Name: " + uniqueArtists[k].name+ ", Lat: "+uniqueArtists[k].latitude+", Long: "+uniqueArtists[k].longitude);
	console.log(uniqueArtists.length);
};

// function extractLocation(index, input) {
//     var regex = new RegExp("[-+]?[0-9]*\.?[0-9]+,[-+]?[0-9]*\.?[0-9]+");
//     var parsed_input = input.match(regex);
//     if (parsed_input) {
// 	parsed_input = parsed_input[0].split(",");
// 	callback(parsed_input[0], parsed_input[1]);
//     } else {
// 	var url = "https://maps.googleapis.com/maps/api/geocode/json?address="
// 	    + encodeURIComponent(parsed_input) + "&sensor=false";
// 	$.getJSON(url, function(data) {
// 	    var location = data['results']['geometry']['location'];
// 	    uniqueArtists[index].latitude = location['lat'];
// 	    uniqueArtists[index].longitude = location['lon'];
		
// 	});
//     }
// };