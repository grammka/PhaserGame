var Controls = {

	vars: {},

	methods: {

		calculatePath: function () {
			var tileX = Map.vars.layers.ground.getTileX(Map.vars.cellMarker.x),
				tileY = Map.vars.layers.ground.getTileY(Map.vars.cellMarker.y),
				playerX = Math.round(Player.vars.body.x / 32),
				playerY = Math.round(Player.vars.body.y / 32);

			if (tileX == playerX && tileY == playerY) return;

			Map.vars.pathfinder.setCallbackFunction(function(path) {
				if (path) Player.methods.moveTo(path);
			});

			Map.vars.pathfinder.preparePathCalculation([playerX, playerY], [tileX, tileY]);
			Map.vars.pathfinder.calculatePath();
		}

	},

	init: function () {

		Game.vars.game.input.onDown.add(Controls.methods.calculatePath, this);

	}

};

var Game = {

	vars: {
		game: null,
		group: null
	},

	methods: {

		preload: function () {
			Game.vars.game.load.tilemap('map', 'data/js/tiles.json', null, Phaser.Tilemap.TILED_JSON);
			Game.vars.game.load.image('tiles', 'data/img/sprite2.png?4');
			Game.vars.game.load.spritesheet('hero', 'data/img/mummy.png?4', 64, 96);
			Game.vars.game.load.spritesheet('poring', 'data/img/poring.png', 64, 64);

			//Game.methods.pixelPerfect();
		},

		create: function () {
			Game.vars.game.stage.backgroundColor = '#787878';

			Map.init();
			Controls.init();

			Game.vars.game.physics.startSystem(Phaser.Physics.ARCADE);

			Game.methods.createGroup();
		},

		update: function () {
			Map.methods.update();
			Player.methods.update();
			Poring.methods.update();

			Game.vars.group.sort('y', Phaser.Group.SORT_ASCENDING);
		},

		render: function () {
			Game.vars.game.debug.text('Player z-depth: ' + Player.vars.body.z, 10, 20);
		},
		
		
		
		createGroup: function () {
			Game.vars.group = Game.vars.game.add.group();
			Game.vars.group.add(Player.vars.body);
			Game.vars.group.add(Poring.vars.body);

			//Player.vars.player = Game.vars.group.create(6 * 32, 6 * 32, 'hero');
			//Map.vars.layers.trees = Game.vars.group.create(6 * 32, 6 * 32, Map.vars.layers.trees);
		},
		
		pixelPerfect: function () {
			Game.vars.game.scale.maxWidth = Math.round(Game.vars.game.canvas.width / Game.vars.game.device.pixelRatio);
			Game.vars.game.scale.maxHeight = Math.round(Game.vars.game.canvas.height / Game.vars.game.device.pixelRatio);
			Game.vars.game.scale.minWidth = Math.round(Game.vars.game.canvas.width / Game.vars.game.device.pixelRatio);
			Game.vars.game.scale.minHeight = Math.round(Game.vars.game.canvas.height / Game.vars.game.device.pixelRatio);
			Game.vars.game.scale.refresh();
		}

	},

	init: function () {

		Game.vars.game = new Phaser.Game(640, 640, Phaser.AUTO, '', {
			preload: Game.methods.preload,
			create: Game.methods.create,
			update: Game.methods.update,
			render: Game.methods.render
		});

	}

};

Game.init();

var Map = {

	vars: {
		map: null,
		cellMarker: null,
		layers: {},
		pathfinder: null
	},

	methods: {

		create: function () {
			Map.vars.map = Game.vars.game.add.tilemap('map');
			Map.vars.map.addTilesetImage('sprite', 'tiles');

			// Layers
			Map.vars.layers.collisions = Map.vars.map.createLayer('collisions');
			Map.vars.layers.ground = Map.vars.map.createLayer('ground');

			// Cell Marker
			Map.vars.cellMarker = Game.vars.game.add.graphics();
			Map.vars.cellMarker.lineStyle(1, 0x00FF00, 1);
			Map.vars.cellMarker.drawRect(0, 0, 30, 30);

			// Layers
			Map.vars.layers.trees = Map.vars.map.createLayer('trees');

			// Player
			Player.init();

			// Poring
			Poring.init();

			// Path Finder
			Map.vars.pathfinder = Game.vars.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
			Map.vars.pathfinder.setGrid(Map.vars.map.layers[0].data, [0]);
			Map.vars.pathfinder._easyStar.enableDiagonals();
		},

		update: function () {
			Map.vars.cellMarker.x = Map.vars.layers.ground.getTileX(Game.vars.game.input.activePointer.worldX) * 32;
			Map.vars.cellMarker.y = Map.vars.layers.ground.getTileY(Game.vars.game.input.activePointer.worldY) * 32;
		}

	},

	init: function () {

		this.methods.create();

	}

};

var Player = {

	vars: {
		body: null,
		sprite: null,

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
			Player.vars.body = Game.vars.game.add.sprite(2 * 32, 2 * 32, '');
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
			Poring.vars.body = Game.vars.game.add.sprite(9 * 32, 6 * 32);
			Poring.vars.sprite = Game.vars.game.add.sprite(16, -32, 'poring');
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

function Animation () {

	var Animation;

	Animation = {



	};

	return Animation;

}


function Bestiary () {

	var Bestiary, Cell;

	Cell = {
		cat: {
			id: 1,
			name: 'Cat',
			life: 200,
			moveSpeed: 100,
			atkPower: 100,
			atkSpeed: 10
		}
	};

	Bestiary = {

		get: function (name) {
			return Cell[name];
		}

	};

	return Bestiary;

}


function Entity (params) {

	var Entity;


	Entity = {

		_create: function () {

		},

		_update: function () {

		},

		_move: function () {

		},

		_attack: function () {

		},

		_animate: function () {

		},

		_alive: function () {

		},

		_die: function () {

		}

	};

	return Entity;

}

