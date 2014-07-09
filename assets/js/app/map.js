var Map = {

	vars: {
		map: null,
		cellMarker: null,
		layers: {},
		pathfinder: null
	},

	methods: {

		create: function () {
			Map.vars.map = Game.vars.game.add.tilemap('tilemap');
			Map.vars.map.addTilesetImage('sprite-ground', 'sprite-ground');
			//Map.vars.map.addTilesetImage('sprite-trees', 'sprite-trees');

			// Ground Layer
			Map.vars.layers.ground = Map.vars.map.createLayer('ground');
			Map.vars.layers.ground.resizeWorld();

			// Cell Marker
			Map.vars.cellMarker = Game.vars.game.add.graphics();
			Map.vars.cellMarker.lineStyle(1, 0x00FF00, 1);
			Map.vars.cellMarker.drawRect(0, 0, 30, 30);

			// Layers
			Map.vars.layers.collisions = Map.vars.map.createLayer('collisions');
			Map.vars.layers.collisions.resizeWorld();
//			Map.vars.layers.trees = Map.vars.map.createLayer('trees');
//			Map.vars.layers.trees.resizeWorld();


			Game.vars.group = Game.vars.game.add.group();

			// Player
			Player.init();

			// Poring
			Poring.init();

//			Game.vars.group.add(Player.vars.body);
//			Game.vars.group.add(Poring.vars.body);

			for (var lineId in Map.vars.map.layers[2].data) {
				var vline = Map.vars.map.layers[2].data[lineId];

				for (var cellId in vline) {
					var cell = vline[cellId];

					if (cell.index > 0) {
						Game.vars.group.create(32 * cell.x, 32 * cell.y - 32, 'sprite-trees');
					}
				}
			}



			// Path Finder
			Map.vars.pathfinder = Game.vars.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
			Map.vars.pathfinder.setGrid(Map.vars.map.layers[2].data, [0]);
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
