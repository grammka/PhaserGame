var Controls = {

	vars: {},

	methods: {

		calculatePath: function () {
			var tileX = Map.vars.layers.collisions.getTileX(Map.vars.cellMarker.x),
				tileY = Map.vars.layers.collisions.getTileY(Map.vars.cellMarker.y),
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
