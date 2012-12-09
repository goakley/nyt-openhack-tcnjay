jQuery(document).ready(
    function ($)
    {
        var songs = [],
            default_data = {
                'api_key': api_key,
                'format': 'json'
            },

            echonest_url = 'http://developer.echonest.com/api/v4/',
            song_url = echonest_url + 'song/search',
            artist_songs_url = echonest_url + 'artist/songs',

            fisher_yates = function (myArray)
            {
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
            },

            create_playlist = function ()
            {
                var songs_shuffled = fisher_yates(songs);

                console.log(songs_shuffled);

                return songs_shuffled;
            };

        $.each(artists,
            function (index, item)
            {
                $.ajax(
                    {
                        data: $.extend({}, default_data, {
                                'id': item.id,
                                'start': 0,
                                'results': 3
                            }
                        ),
                        type: 'get',
                        url: artist_songs_url,

                        success: function (resp, status, xhr)
                        {
                            var num_songs = resp.response.songs.length;
                            $.each(resp.response.songs,
                                function (idx, itm)
                                {
                                    $.ajax(
                                        {
                                            data: $.extend({}, default_data, {
                                                    'artist': item.artist,
                                                    'title': itm.title,
                                                    'start': 0,
                                                    'results': 1
                                                }
                                            ),
                                            type: 'get',
                                            url: song_url,

                                            success: function (resp, status, xhr)
                                            {
                                                songs.push(resp.response.songs[0]);

                                                if (artists.length - 1 === index && num_songs - 1 === idx)
                                                {
                                                    create_playlist();
                                                }
                                            }
                                        }
                                    );
                                }
                            );
                        }
                    }
                );
            }
        );
    }
);
