import { Cookie } from 'set-cookie-parser';

export const parseCookies = (cookieInput: string): Cookie[] => {
	if (cookieInput === '') {
		return [];
	}

	const pairs = cookieInput.split(';');
	const splittedPairs = pairs.map((cookie) => cookie.split('='));
	const cookieArr: Cookie[] = splittedPairs.map((pair) => {
		return {
			name: decodeURIComponent(pair[0].trim()),
			value: decodeURIComponent(pair[1].trim())
		};
	});
	return cookieArr;
};
