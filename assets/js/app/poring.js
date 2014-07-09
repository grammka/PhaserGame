var Poring = {

	vars: {
		body: null,
		sprite: null,

		path: null,
		currPathStep: null,

		tween: null,
		tweenSpeed: 750,
		tweenTimer: null,
		tweenActive: false,

		frames: {
			standFacingDown:    [0,1,2,3],
			standFacingUp:      [4,5,6,7],
			moveFacingDown:     [8,9,10,11,12,13,14,15],
			moveFacingUp:       [16,17,18,19,20,21,22]
		},
		frameAnimateSpeed: 13,
		currFrame: null
	},

	methods: {

		create: function () {
			Poring.vars.body = Game.vars.group.create(9 * 32, 6 * 32);
			Poring.vars.sprite = Game.vars.group.create(16, -32, 'poring');
			Poring.vars.body.addChild(Poring.vars.sprite);

			Poring.vars.sprite.anchor.setTo(.5,0);

			Game.vars.game.physics.enable(Poring.vars.body);

			Poring.vars.sprite.animations.add('walk-down', Poring.vars.frames.moveFacingDown);
			Poring.vars.sprite.animations.add('walk-up', Poring.vars.frames.moveFacingUp);
			Poring.vars.sprite.animations.add('stand-down', Poring.vars.frames.standFacingDown);
			Poring.vars.sprite.animations.add('stand-up', Poring.vars.frames.standFacingUp);
		},



		flipSpriteFrame: function (delta) {
			Poring.vars.sprite.scale.x = delta;
		},

		tween: function (tween) {
			var stepCoo = Poring.vars.path[Poring.vars.currPathStep++];

			return stepCoo ? Poring.methods.tween(tween.to({
				x: stepCoo.x * 32,
				y: stepCoo.y * 32
			}, Poring.vars.tweenSpeed, Phaser.Easing.Linear.None, true)) : tween;
		},

		moveTo: function (path) {
			Poring.vars.currPathStep = 0;
			Poring.vars.path = path;
			Poring.vars.tween = Game.vars.game.add.tween(Poring.vars.body.body);

			Poring.methods.tween(Poring.vars.tween).start();

			// Tween timer
			Poring.vars.tweenActive = true;
			if (Poring.vars.tweenTimer) clearTimeout(Poring.vars.tweenTimer);
			Poring.vars.tweenTimer = setTimeout(function () {
				Poring.vars.tweenActive = false;
			}, Poring.vars.tweenSpeed * path.length);
		},
		


		update: function () {
			if (Poring.vars.tweenActive) {

				switch (Poring.vars.body.body.facing) {

					case Phaser.RIGHT:
						Poring.methods.flipSpriteFrame(-1);
						Poring.vars.sprite.animations.play('walk-down', Poring.vars.frameAnimateSpeed, true);
						Poring.vars.currFrame = 'RIGHT';
						break;

					case Phaser.LEFT:
						Poring.methods.flipSpriteFrame(1);
						Poring.vars.sprite.animations.play('walk-down', Poring.vars.frameAnimateSpeed, true);
						Poring.vars.currFrame = 'LEFT';
						break;

					case Phaser.UP:
						Poring.vars.sprite.animations.play('walk-up', Poring.vars.frameAnimateSpeed, true);
						Poring.vars.currFrame = 'UP';
						break;

					case Phaser.DOWN:
						Poring.vars.sprite.animations.play('walk-down', Poring.vars.frameAnimateSpeed, true);
						Poring.vars.currFrame = 'DOWN';
						break;

					case Phaser.RIGHTUP:
						Poring.methods.flipSpriteFrame(-1);
						Poring.vars.sprite.animations.play('walk-up', Poring.vars.frameAnimateSpeed, true);
						Poring.vars.currFrame = 'RIGHTUP';
						break;

					case Phaser.RIGHTDOWN:
						Poring.methods.flipSpriteFrame(-1);
						Poring.vars.sprite.animations.play('walk-down', Poring.vars.frameAnimateSpeed, true);
						Poring.vars.currFrame = 'RIGHTDOWN';
						break;

					case Phaser.LEFTUP:
						Poring.methods.flipSpriteFrame(1);
						Poring.vars.sprite.animations.play('walk-up', Poring.vars.frameAnimateSpeed, true);
						Poring.vars.currFrame = 'LEFTUP';
						break;

					case Phaser.LEFTDOWN:
						Poring.methods.flipSpriteFrame(1);
						Poring.vars.sprite.animations.play('walk-down', Poring.vars.frameAnimateSpeed, true);
						Poring.vars.currFrame = 'LEFTDOWN';
						break;
				}

				//console.debug(Poring.vars.currFrame);

			} else {
				Poring.vars.sprite.animations.play('stand-down', 7, true);

				if (Poring.vars.sprite.animations.currentAnim && Poring.vars.sprite.animations.currentAnim.isPlaying) {
					//Poring.vars.sprite.animations.currentAnim.stop();

				}
			}
		}

	},

	init: function () {

		this.methods.create();

	}

};
