import axios from "../lib/axiosInstance";

const tmdbPath = process.env.REACT_APP_TMDB_REQUEST_URL;
const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

export const searchMovie = async (searchText) => {
	return await axios
		.get(
			`${tmdbPath}search/multi?api_key=${tmdbApiKey}&query=${encodeURIComponent(
				searchText
			)}`
		)
		.then((res) => {
			const results = res.data.results.filter(
				(item) =>
					item.media_type === "movie" || item.media_type === "tv"
			);
			return results;
		});
};
