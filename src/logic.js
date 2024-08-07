export function getData(fen, successFn) {
	axios.get("https://explorer.lichess.ovh/lichess?variant=standard&speeds=rapid&ratings=2200,2500&fen=" + fen).then(successFn);
}