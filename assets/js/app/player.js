var Player = {

	vars: {
		player: null,
		tween: null,
		path: null,
		currPathStep: null
	},

	methods: {

		create: function () {
			// Player creating moved to MAP to get zIndex
			Game.vars.game.camera.follow(Player.vars.player);
		},

		tween: function (tween) {
			var stepCoo = Player.vars.path[Player.vars.currPathStep++];

			return stepCoo ? Player.methods.tween(tween.to({
				x: stepCoo.x * 32,
				y: stepCoo.y * 32
			}, 100, Phaser.Easing.Linear.None)) : tween;
		},

		moveTo: function () {
			Player.vars.tween = Game.vars.game.add.tween(Player.vars.player);

			Player.methods.tween(Player.vars.tween).start();
		},

		update: function () {

		}

	},

	init: function () {

		this.methods.create();

	}

};
