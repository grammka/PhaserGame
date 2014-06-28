var Controls = {

	vars: {},

	methods: {

		calculatePath: function () {
			var tilex = Map.vars.layers.ground1.getTileX(Map.vars.cellMarker.x),
				tiley = Map.vars.layers.ground1.getTileY(Map.vars.cellMarker.y);

			Map.vars.pathfinder.setCallbackFunction(function(path) {
				Player.vars.currPathStep = 0;
				Player.vars.path = path || [];

				Player.methods.moveTo();
			});

			console.log([Player.vars.player.x / 32, Player.vars.player.y / 32]);

			Map.vars.pathfinder.preparePathCalculation([Player.vars.player.x / 32, Player.vars.player.y / 32], [tilex, tiley]);
			Map.vars.pathfinder.calculatePath();
		}

	},

	init: function () {

		Game.vars.game.input.onDown.add(Controls.methods.calculatePath, this);

	}

};
