var uniqueArtists = [];

wrapper = function(callback) {
var max_long, min_long, max_lat, min_lat, url
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

url1 = "http://developer.echonest.com/api/v4/song/search?api_key=BPWRSUCGLJMZST7RN&format=json&results=";
url2 = "&max_longitude=" + max_long + "&min_longitude=" + min_long + "&max_latitude=" + max_lat + "&min_latitude=" + min_lat + "&sort=" + sort_factor + "&song_max_hotttnesss=" + max_hot;
	handler(url1, results, url2, callback);
};

handler = function(url1, results, url2, callback) {
	$.getJSON(url1+results+url2, function(data) {
		songs = data.response.songs;
		artists = [];
		for (j=0; j<songs.length; j++)
			artists[j] = songs[j].artist_name;
		$.each(artists, function(i, el){
	    	if($.inArray(el, uniqueArtists) === -1) uniqueArtists.push(el);
		});
		if (uniqueArtists.length >= 20)
		{
			for (k=0; k<uniqueArtists.length; k++)
				console.log(uniqueArtists[k]);
			console.log(uniqueArtists.length);
		}
			//callback(uniqueArtists);
		else
			handler(url1, results+20, url2, callback);
	});
};