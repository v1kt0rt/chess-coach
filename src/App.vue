<template>
	<div>This is a prototype for practicing openings<br/>based on Licess opening explorer.</div>
	<div id="myBoard" style="width: 400px" />
	<div>{{status}}</div>
	<div v-if="openingInfo!==null">Opening: {{openingInfo}}</div>
	<div v-if="stats!==null">Stats: {{stats}}</div>
	<div>Number of moves in DB: {{moves.length}}</div>
	<div v-if="moves.length>0">Choose a move:<br />
		<button @click="chooseMove(0)">Most popular</button>
		<button @click="chooseMove(1)">Second most popular</button>
		<button @click="chooseMove(2)">Third most popular</button>
	</div>
	<button class="control fas fa-chevron-left" disabled="true"/>&nbsp;
	<button class="control fas fa-sync" @click="onFlipClicked" />
</template>

<script>
import { getData } from "./logic.js";

const game = new Chess();
let board = null;

export default {
	data() {
		return {
			status: null,
			stats: null,
			openingInfo: null,
			moves: []
		}
	},
	methods: {
		chooseMove(index) {
			let move = this.moves[index];
			game.move(move.san);
			board.position(game.fen());
			this.updateStatus();
		},
		onFlipClicked() {
			board.flip();
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
			this.updateStatus()
		},
		onSnapEnd() {
			board.position(game.fen());
		},
		updateStatus() {
			let fen = game.fen();
			//getData("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR%20w%20KQkq%20-%200%201");
			getData(fen, this.updateOpeningInfo);
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
		//$fen.html(game.fen())
		//$pgn.html(game.pgn())
		},
		updateOpeningInfo(response) {
			let data = response.data;
			if (data.opening) {
				this.openingInfo = data.opening.eco + " " + data.opening.name;
			} else {
				this.openingInfo = null;
			}
			this.stats = "W:" + data.white + " B:" + data.black + " draw:" + data.draws;
			this.moves = data.moves;
		}
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
	}
}
</script>