export function getData(fen, successFn) {
	axios.get("https://explorer.lichess.ovh/lichess?variant=standard&speeds=rapid&ratings=1200,1700&fen=" + fen).then(successFn);
}

export function getUserData(fen, successFn) {
	const stream = fetch("https://explorer.lichess.ovh/player" +
			"?variant=standard&fen=" + fen +
			"&since=2024-01&speeds=blitz%2Crapid%2Cbullet&player=tvik7755&color=white&modes=rated&source=analysis");
	let result = null;
	stream
		.then(readStream(obj => {
			console.log("chunk received", obj);
			successFn(obj);
		}))
		.then(() => {
			console.log("stream completed");
		});
}

//https://gist.github.com/ornicar/a097406810939cf7be1df8ea30e94f3e

/* FOR THE BROWSER
Utility function to read a ND-JSON HTTP stream.
`processLine` is a function taking a JSON object. It will be called with each element of the stream.
`response` is the result of a `fetch` request.
See usage example in the next file.
*/

const readStream = processLine => response => {
	const stream = response.body.getReader();
	const matcher = /\r?\n/;
	const decoder = new TextDecoder();
	let buf = '';
  
	const loop = () =>
	  stream.read().then(({ done, value }) => {
		if (done) {
		  if (buf.length > 0) processLine(JSON.parse(buf));
		} else {
		  const chunk = decoder.decode(value, {
			stream: true
		  });
		  buf += chunk;
  
		  const parts = buf.split(matcher);
		  buf = parts.pop();
		  for (const i of parts.filter(p => p)) processLine(JSON.parse(i));
		  return loop();
		}
	  });
  
	return loop();
}

/* From browser or nodejs alike */

//const stream = fetch('https://lichess.org/api/tv/feed');
// or any other ND-JSON endpoint such as:
// const stream = fetch('https://lichess.org/api/games/user/neio',{headers:{Accept:'application/x-ndjson'}});

const onMessage = obj => console.log(obj);
const onComplete = () => console.log('The stream has completed');



export function calculatePercentages(data) {
	let allGames = data.white + data.black + data.draws;
	return {
		whiteWins: Math.round((data.white / allGames) * 100) + "%",
		blackWins: Math.round((data.black / allGames) * 100) + "%",
		draw: Math.round((data.draws / allGames) * 100) + "%"
	};
}