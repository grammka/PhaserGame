var Player = {

	vars: {
		body: null,
		sprite: null,
		startPosition: [4, 4],

		path: null,
		currPathStep: null,

		tween: null,
		tweenSpeed: 300,
		tweenActive: false,
		tweenCompleteTimer: null,

		frames: {
			moveFacingDown:     [0,1,2,3,4,5,6,7],
			moveFacingUp:       [8,9,10,11,12,13,14,15],
			standFacingDown:    [16,17,18,19,20,21],
			standFacingUp:      [24,25,26,27,28,29]
		},
		frameAnimateSpeed: 6,
		standAnimateActive: false,
		facing: null
	},

	methods: {

		create: function () {
			Player.vars.body = Game.vars.game.add.sprite(Player.vars.startPosition[0] * 32, Player.vars.startPosition[1] * 32, '');
			Player.vars.sprite = Game.vars.game.add.sprite(16, -64, 'hero');
			Player.vars.body.addChild(Player.vars.sprite);

			Game.vars.game.physics.enable(Player.vars.body);
			Game.vars.game.camera.follow(Player.vars.body);

			Player.vars.body.body.moves = false;
			Player.vars.sprite.anchor.setTo(.5,0);

			Player.vars.sprite.animations.add('walk-down', Player.vars.frames.moveFacingDown);
			Player.vars.sprite.animations.add('walk-up', Player.vars.frames.moveFacingUp);
			Player.vars.sprite.animations.add('stand-down', Player.vars.frames.standFacingDown);
			Player.vars.sprite.animations.add('stand-up', Player.vars.frames.standFacingUp);
		},



		flipSpriteFrame: function (delta) {
			Player.vars.sprite.scale.x = delta;
		},
		
		getFacing: function () {
			var newFacing,
				dX = Player.vars.body.deltaX,
				dY = Player.vars.body.deltaY;

			if (!dX && !dY) return;

			if (dX != 0)
				newFacing = dX < 0 ? 'LEFT' : 'RIGHT';

			if (dY != 0)
				newFacing = dY < 0 ? 'UP' : 'DOWN';

			if (dX != 0 && dY != 0)
				newFacing = dX < 0 ? (dY > 0 ? 'LEFTDOWN' : 'LEFTUP') : (dY > 0 ? 'RIGHTDOWN' : 'RIGHTUP');


			if (newFacing == Player.vars.facing) return;

			Player.vars.facing = newFacing;

			switch (Player.vars.facing) {

				case 'RIGHT':
					Player.methods.flipSpriteFrame(-1);
					Player.vars.sprite.animations.play('walk-down', Player.vars.frameAnimateSpeed, true);
					break;

				case 'LEFT':
					Player.methods.flipSpriteFrame(1);
					Player.vars.sprite.animations.play('walk-down', Player.vars.frameAnimateSpeed, true);
					break;

				case 'UP':
					Player.vars.sprite.animations.play('walk-up', Player.vars.frameAnimateSpeed, true);
					break;

				case 'DOWN':
					Player.vars.sprite.animations.play('walk-down', Player.vars.frameAnimateSpeed, true);
					break;

				case 'RIGHTUP':
					Player.methods.flipSpriteFrame(-1);
					Player.vars.sprite.animations.play('walk-up', Player.vars.frameAnimateSpeed, true);
					break;

				case 'RIGHTDOWN':
					Player.methods.flipSpriteFrame(-1);
					Player.vars.sprite.animations.play('walk-down', Player.vars.frameAnimateSpeed, true);
					break;

				case 'LEFTUP':
					Player.methods.flipSpriteFrame(1);
					Player.vars.sprite.animations.play('walk-up', Player.vars.frameAnimateSpeed, true);
					break;

				case 'LEFTDOWN':
					Player.methods.flipSpriteFrame(1);
					Player.vars.sprite.animations.play('walk-down', Player.vars.frameAnimateSpeed, true);
					break;
			}
			
		},

		tween: function (tween) {
			var stepCoo = Player.vars.path[Player.vars.currPathStep++];

			return stepCoo ? Player.methods.tween(tween.to(Player.vars.body, Player.vars.tweenSpeed / 1000, {
				x: stepCoo.x * 32,
				y: stepCoo.y * 32,
				ease: Linear.easeNone,
				onStart: function () {
					if (Player.vars.tweenCompleteTimer) {
						clearTimeout(Player.vars.tweenCompleteTimer);
					}

					Player.vars.tweenActive = true;
					Player.vars.standAnimateActive = false;
				},
				onComplete: function () {
					Player.vars.tweenCompleteTimer = setTimeout(function () {
						Player.vars.tweenActive = false;
						Player.vars.facing = null;
					}, 100);
				},
				onUpdate: Player.methods.getFacing
			})) : tween;
		},

		moveTo: function (path) {
			Player.vars.currPathStep = 0;
			Player.vars.path = path;

			if (Player.vars.tween) Player.vars.tween.kill();

			Player.vars.tween = new TimelineLite();
			Player.methods.tween(Player.vars.tween);
		},



		update: function () {

			if (!Player.vars.tweenActive && !Player.vars.standAnimateActive) {
				Player.vars.standAnimateActive = true;
				Player.vars.sprite.animations.play('stand-down', Player.vars.frameAnimateSpeed, true);
			}

		}

	},

	init: function () {

		this.methods.create();

	}

};
