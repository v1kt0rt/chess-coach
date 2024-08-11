<template>
	<div class="flex-container">
		<div id="top-fix-content">
			<div id="myBoard" />
			<div style="padding: 8px;">
				<button class="control fas fa-chevron-left" @click="onBackClicked" :disabled="moveStack.length == 1"/>&nbsp;
				<button class="control fas fa-sync" @click="onFlipClicked" />
				{{status}}
			</div>
			<div v-if="openingInfo!==null">{{openingInfo}}</div>
			<div v-if="whiteWins!==null">
				<table class="stats">
					<tr><th>Lichess</th><td class="white">{{whiteWins}}</td><td class="draw">{{draw}}</td><td class="black">{{blackWins}}</td></tr>
					<tr><th>Player</th><td class="white">{{pWhiteWins}}</td><td class="draw">{{pDraw}}</td><td class="black">{{pBlackWins}}</td></tr>
				</table>
			</div>
			
		</div>

		<div class="dynamic-content">
			<div class="dynamic-content-inner">
				<div v-if="moves.length>0">Number of moves in DB: {{moves.length}}</div>
				<div v-if="moves.length>0">Choose a move:<br />
					<button @click="chooseMove(0)">Most popular</button>
					<button @click="chooseMove(1)">Second most popular</button>
					<button @click="chooseMove(2)">Third most popular</button>
				</div>
				<br />
				<div>
					This is a prototype for practicing openings based on Licess opening explorer.
					It's under construction.
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getData, getUserData, calculatePercentages } from "./logic.js";

const game = new Chess();
let board = null;

export default {
	data() {
		return {
			status: null,
			stats: null,
			openingInfo: null,
			moveStack: [],
			moves: [],
			whiteWins: null,
			blackWins: null,
			draw: null,
			pWhiteWins: null,
			pBlackWins: null,
			pDraw: null,
		}
	},
	methods: {
		chooseMove(index) {
			let move = this.moves[index];
			game.move(move.san);
			board.position(game.fen());
			this.moveStack.push({ fen: game.fen() });
			this.updateStatus();
		},
		onKeyUp(e) {
			console.log('KEYPRESS EVENT', e);
			if (e.key === "ArrowLeft") {
				this.onBackClicked();
			}
			if (e.key === "f") {
				this.onFlipClicked();
			}
		},
		onFlipClicked() {
			board.flip();
		},
		onBackClicked() {
			if (this.moveStack.length == 1) {
				return;
			}
			this.moveStack.pop();
			let lastMove = this.moveStack.pop();
			let fen = lastMove.fen;
			game.load(fen);
			board.position(fen);
			this.moveStack.push({ fen: fen });
			this.updateStatus();
		},
		onDragStart(source, piece, position, orientation) {
			if (game.game_over()) {
				return false;
			}

			if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
					(game.turn() === 'b' && piece.search(/^w/) !== -1)) {
				return false;
			}
		},
		onChange(oldPos, newPos) {
			// do nothing
		},
		onDrop(source, target) {
			let move = game.move({
				from: source,
				to: target,
				promotion: 'q' // NOTE: always promote to a queen for example simplicity
			});
			if (move === null) {
				return "snapback";
			}
			this.moveStack.push({ fen: game.fen() });
			this.updateStatus()
		},
		onSnapEnd() {
			board.position(game.fen());
		},
		updateStatus() {
			let fen = game.fen();
			console.log("updateStatus");
			this.whiteWins = null;
			this.blackWins = null;
			this.draw = null;
			this.pWhiteWins = null;
			this.pBlackWins = null;
			this.pDraw = null;
			getData(fen, this.updateOpeningInfo);
			getUserData(fen, this.updateUserSpecificInfo)
			this.status = "";
			var moveColor = 'White';
			if (game.turn() === 'b') {
				moveColor = 'Black';
			}

			// checkmate?
			if (game.in_checkmate()) {
				this.status = 'Game over, ' + moveColor + ' is in checkmate.';
			}

			// draw?
			else if (game.in_draw()) {
				this.status = 'Game over, drawn position';
			}

			// game still on
			else {
				this.status = moveColor + ' to move';

				// check?
				if (game.in_check()) {
					this.status += ', ' + moveColor + ' is in check';
				}
			}
		},
		updateOpeningInfo(response) {
			let data = response.data;
			if (data.opening) {
				this.openingInfo = data.opening.eco + " " + data.opening.name;
			} else {
				this.openingInfo = null;
			}
			let p = calculatePercentages(data);
			this.whiteWins = p.whiteWins;
			this.blackWins = p.blackWins;
			this.draw = p.draw;
			this.moves = data.moves;
		},
		updateUserSpecificInfo(response) {
			console.log("user specific info received", response);
			let p = calculatePercentages(response);
			this.pWhiteWins = p.whiteWins;
			this.pBlackWins = p.blackWins;
			this.pDraw = p.draw;
		}
	},
	created() {
		window.addEventListener('keyup', this.onKeyUp);
	},
	beforeDestroy() {
		window.removeEventListener('keyup', this.onKeyUp);
	},
	mounted() {
		let config = {
			draggable: true,
			position: 'start',
			onDragStart: this.onDragStart,
			onDrop: this.onDrop,
			onSnapEnd: this.onSnapEnd,
			onChange: this.onChange
		}
		board = Chessboard('myBoard', config);
		this.moveStack.push({fen : game.fen() });
	}
}
</script>