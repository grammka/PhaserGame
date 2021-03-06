var Game = {

	vars: {
		game: null,
		group: null
	},

	methods: {

		preload: function () {
			Game.vars.game.load.tilemap('tilemap', 'data/js/map.json', null, Phaser.Tilemap.TILED_JSON);
			Game.vars.game.load.image('sprite-ground', 'data/img/sprite-ground.png');
			Game.vars.game.load.spritesheet('sprite-trees', 'data/img/sprite-trees.png', 32, 64);
			Game.vars.game.load.spritesheet('hero', 'data/img/mummy.png?4', 64, 96);
			Game.vars.game.load.spritesheet('poring', 'data/img/poring.png', 64, 64);

			//Game.methods.pixelPerfect();
		},

		create: function () {
			Game.vars.game.stage.backgroundColor = '#787878';

			Map.init();
			Controls.init();

			Game.vars.game.physics.startSystem(Phaser.Physics.ARCADE);
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
