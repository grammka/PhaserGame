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
