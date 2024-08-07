export function getData(fen, successFn) {
	axios.get("https://explorer.lichess.ovh/lichess?variant=standard&speeds=rapid&ratings=1200,1700&fen=" + fen).then(successFn);
}