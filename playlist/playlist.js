var api_key = "BPWRSUCGLJMZST7RN";


function create_songs(artists)
{

    var create_playlist = function(songs) {
	function fisher_yates(myArray) {
            var i = myArray.length;
            if ( i === 0 ) return false;
            while ( --i ) {
		var j = Math.floor( Math.random() * ( i + 1 ) );
		var tempi = myArray[i];
		var tempj = myArray[j];
		myArray[i] = tempj;
		myArray[j] = tempi;
            }
            return myArray;
	}
	var songs_shuffled = fisher_yates(songs);
	console.log(songs_shuffled);
	return songs_shuffled;
    },
    second_success = function (resp, status, xhr)
                  {
                                      songs.push(resp.response.songs[0]);

                                      if (artists.length - 1 === index && num_songs - 1 === idx)
                                      {
                      return create_playlist(songs);
                                      }
                  },
    first_success = function (resp, status, xhr)
               {
                   var num_songs = resp.response.songs.length;
                   for (var idx = 0; idx < num_songs; idx++)
                          {
                            var itm = resp.response.songs[idx];
              $.ajax({
                  data: $.extend({}, default_data, {
                                      'artist': item.artist,
                                      'title': itm.title,
                                      'start': 0,
                                      'results': 1
                                  }
                        ),
                  type: 'get',
                  url: song_url,

                  success: second_success
                              });
                          }
               };

    var songs = [],
    default_data = {
        'api_key': api_key,
        'format': 'json'
    },

    echonest_url = 'http://developer.echonest.com/api/v4/',
    song_url = echonest_url + 'song/search',
    artist_songs_url = echonest_url + 'artist/songs';

       for(var index = 0; index < artists.length; index++)
       {
        var item = artists[index];
           $.ajax({
               data: $.extend({}, default_data, {
                   'start': 0,
                   'id': item.id,
                   'results': 3
               }
			 ),
               type: 'get',
               url: artist_songs_url,

               success: first_success
            });
       }
}



