
wrapper = function() {
var max_long, min_long, max_lat, min_lat, url
max_lat = 40.7142 + 20;
min_lat = 40.7142 - 20;
max_long = -74.0064 + 20;
min_long = -74.0064 - 20;
//artist_hot_min = .2
//song_hot_min = .2
sort_factor = "song_hotttnesss-desc";

url = "http://developer.echonest.com/api/v4/song/search?api_key=BPWRSUCGLJMZST7RN&format=json&results=50&max_longitude=" + max_long + "&min_longitude=" + min_long + "&max_latitude=" + max_lat + "&min_latitude=" + min_lat + "&sort=" + sort_factor;
$.getJSON(url, function(data) {
	songs = data.response.songs;
	for (i=0; i<songs.length; i++)
		console.log(songs[i].artist_name + " - " + songs[i].title);
});
};
