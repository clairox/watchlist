export interface LoginData {
	email: string;
	password: string;
}

export interface SignupData extends LoginData {
	firstName: string;
	lastName: string;
}

export interface MovieData {
	id: string;
	title: string;
	posterURL: string;
	releaseDate: string;
}

export interface Watchlist {
	id: string;
	createdAt: Date;
	owner_id: string;
	name: string;
	default: boolean;
	poster_url?: string;
}

export interface WatchlistItem {
	id: number;
	title: string;
	release_date: number;
	poster_url: string;
	watched: boolean;
	favorite: boolean;
}
