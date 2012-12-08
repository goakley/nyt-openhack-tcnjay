jQuery(document).ready(
	function ($)
	{
		var songs = [],
			default_data = {
				'api_key': api_key,
				'format': 'json',
				'bucket': 'id:spotify-WW'
			},

			echonest_url = 'http://developer.echonest.com/api/v4/',
			song_url = echonest_url + 'song/search',
			artist_songs_url = echonest_url + 'artist/songs';

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
							console.log(resp);

							$.each(resp.response.songs,
								function (idx, itm)
								{
									$.ajax(
										{
											data: $.extend({}, default_data, {
													'artist': item.artist,
													'title': itm.title
												}
											),
											type: 'get',
											url: song_url,

											success: function (resp, status, xhr)
											{
												console.log(resp);
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
