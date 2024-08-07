<template>
	<div>This is in progress</div>
	<div id="myBoard" style="width: 400px" />
</template>

<script>
const game = new Chess();
let board = null;

export default {
	data() {
		return {

		}
	},
	methods: {
		onDragStart(source, piece, position, orientation) {
			if (game.game_over()) {
				return false;
			}

			if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
					(game.turn() === 'b' && piece.search(/^w/) !== -1)) {
				return false;
			}
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
			var status = '';
			var moveColor = 'White';
			if (game.turn() === 'b') {
				moveColor = 'Black';
			}

			// checkmate?
			if (game.in_checkmate()) {
				status = 'Game over, ' + moveColor + ' is in checkmate.';
			}

			// draw?
			else if (game.in_draw()) {
				status = 'Game over, drawn position';
			}

			// game still on
			else {
				status = moveColor + ' to move';

			// check?
			if (game.in_check()) {
				status += ', ' + moveColor + ' is in check';
			}
			}

		//$status.html(status)
		//$fen.html(game.fen())
		//$pgn.html(game.pgn())
		}
	},
	mounted() {
		console.log("mounted");
		let config = {
			draggable: true,
			position: 'start',
			onDragStart: this.onDragStart,
			onDrop: this.onDrop,
			onSnapEnd: this.onSnapEnd
		}
		board = Chessboard('myBoard', config);
	}
}
</script>