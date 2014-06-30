var Player = {

	vars: {
		player: null,
		tween: null,
		path: null,
		currPathStep: null
	},

	methods: {

		create: function () {
			Game.vars.game.camera.follow(Player.vars.player);
		},

		tween: function (tween) {
			var stepCoo = Player.vars.path[Player.vars.currPathStep++];

			return stepCoo ? Player.methods.tween(tween.to({
				x: stepCoo.x * 32,
				y: stepCoo.y * 32
			}, 100, Phaser.Easing.Linear.None)) : tween;
		},

		moveTo: function (path) {
			Player.vars.currPathStep = 0;
			Player.vars.path = path;
			Player.vars.tween = Game.vars.game.add.tween(Player.vars.player);

			Player.methods.tween(Player.vars.tween).start();
		},

		update: function () {
			//console.log(Player.vars.player.body.speed);

			// make sure our sprite is moving before determining which anim to play
			if (Player.vars.player.body.speed > 0) {
				console.log(Player.vars.player.body.facing);

				// find which direction the sprite is moving and play that anim at 10fps on a loop
				switch (Player.vars.player.body.facing) {
					case Phaser.RIGHT:
						Player.vars.player.animations.play("walk-right", 10, true);
						break;
					case Phaser.LEFT:
						Player.vars.player.animations.play("walk-left", 10, true);
						break;
					case Phaser.UP:
						Player.vars.player.animations.play("walk-up", 10, true);
						break;
					case Phaser.DOWN:
						Player.vars.player.animations.play("walk-down", 10, true);
						break;
				}
			}
			// if the sprite is not moving, get the current anim (if any) and stop it
			else {
				if (Player.vars.player.animations.currentAnim && Player.vars.player.animations.currentAnim.isPlaying) {
					Player.vars.player.animations.currentAnim.stop();
				}
			}
		}

	},

	init: function () {

		this.methods.create();

	}

};
