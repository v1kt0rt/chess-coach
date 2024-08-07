<template>
	<div>This is in progress</div>
	<div id="myBoard" style="width: 400px" />
</template>

<script>
export default {
	mounted() {
		console.log("mounted");
		var board = Chessboard('myBoard', 'start');
	}
}
</script>