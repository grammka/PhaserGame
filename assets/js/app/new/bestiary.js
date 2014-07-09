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

