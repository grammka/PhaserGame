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

			Map.vars.map.addTilesetImage('tilesheet', 'tiles');

			Map.vars.layers.ground1 = Map.vars.map.createLayer('ground1');
			Map.vars.layers.ground2 = Map.vars.map.createLayer('ground2');

			Player.vars.player = Game.vars.game.add.sprite(640, 640, 'hero');

			// Cell Marker

			Map.vars.cellMarker = Game.vars.game.add.graphics();

			Map.vars.cellMarker.lineStyle(1, 0x00FF00, 1);
			Map.vars.cellMarker.drawRect(0, 0, 30, 30);

			Map.vars.layers.objects = Map.vars.map.createLayer('objects');

			Map.vars.layers.ground1.resizeWorld();


			// Path Finder

			Map.vars.pathfinder = Game.vars.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
			Map.vars.pathfinder.setGrid(Map.vars.map.layers[0].data, [0]);
		}

	},

	init: function () {

		this.methods.create();

	}

};
