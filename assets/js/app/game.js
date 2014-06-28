var Game = {

	vars: {
		game: null
	},

	methods: {

		preload: function () {
			Game.vars.game.load.tilemap('map', 'assets/js/json/map.json', null, Phaser.Tilemap.TILED_JSON);
			Game.vars.game.load.image('tiles', 'assets/img/tilesheet.png');
			Game.vars.game.load.spritesheet('hero', 'assets/img/hero.png', 48, 48);
			Game.vars.game.load.spritesheet('minion', 'assets/img/minion.png', 48, 48);
		},

		create: function () {
			Game.vars.game.stage.backgroundColor = '#787878';

			Map.init();
			Player.init();
			Controls.init();
		},

		update: function () {
			Map.vars.cellMarker.x = Map.vars.layers.objects.getTileX(Game.vars.game.input.activePointer.worldX) * 32;
			Map.vars.cellMarker.y = Map.vars.layers.objects.getTileY(Game.vars.game.input.activePointer.worldY) * 32;

			Player.methods.update();
		}

	},

	init: function () {

		Game.vars.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
			preload: Game.methods.preload,
			create: Game.methods.create,
			update: Game.methods.update
		});

	}

};

Game.init();
