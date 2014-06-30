var Game = {

	vars: {
		game: null,
		group: null
	},

	methods: {

		preload: function () {
			Game.vars.game.load.tilemap('map', 'assets/js/json/tiles.json?2', null, Phaser.Tilemap.TILED_JSON);
			Game.vars.game.load.image('tiles', 'assets/img/sprite.png?2');
			Game.vars.game.load.spritesheet('hero', 'assets/img/mummy.png', 64, 96);
		},

		create: function () {
			Game.vars.game.stage.backgroundColor = '#787878';

			Map.init();
			Player.init();
			Controls.init();

			Game.vars.game.physics.startSystem(Phaser.Physics.ARCADE);
			Game.vars.game.physics.enable(Player.vars.player);

			Game.methods.createGroup();
		},

		createGroup: function () {
			Game.vars.group = Game.vars.game.add.group();

			//Player.vars.player = Game.vars.group.create(6 * 32, 6 * 32, 'hero');
			//Map.vars.layers.trees = Game.vars.group.create(6 * 32, 6 * 32, Map.vars.layers.trees);
		},

		update: function () {
			Map.methods.update();
			Player.methods.update();
		}

	},

	init: function () {

		Game.vars.game = new Phaser.Game(640, 640, Phaser.AUTO, '', {
			preload: Game.methods.preload,
			create: Game.methods.create,
			update: Game.methods.update
		});

	}

};

Game.init();
