/************************************************************************************/
/*	MODEL
/************************************************************************************/


Model = {
	id				: 'minimal-model',		// Unique ID
	
	name			: 'Minimal model',
	about			: '',

	
	variables	: {
		G			: 0,			// Explicatie; initializare cu conditiile initiale (care pot fi suprascrise de setInitialConditions
		X			: 0,
		I			: 0
	},
	
	parameters	: {
		p1			: 0,			// Explicatie
		p2			: 0.025,		// Explicatie
		p3			: 0.000013,		// Explicatie
		n			: 0.0926,
		Gb			: 81,
		a			: 0.083333,
		b			: 0.083333
	},
	
	default_parameters_sets : [
		{
			about: '',
			values: {
				p1			: 0,
				p2			: 0.025,
				p3			: 0.000013,
				n			: 0.0926,
				Gb			: 81,
				a			: 0.083333,
				b			: 0.083333
			}
		}
	],
	
	inputs		: {				// Nu sunt folosite ... sunt listate aici pentru explicatii si trebuie sa se potriveasca cu cele de la "compute"
		u			: 0,		// Explicatie
		d			: 0			// Explicatie
	},
	
	
	
	setInitialConditions : function(variables) {
		var model = this;
		model.variables = $.extend( model.variables, variables );
	},
	

	
	compute: function(inputs) {
		// explicatie pentru inputs
		// inputs[0] : u(t)
		// inputs[1] : d(t)
		
		var model = this;
		
		model.variables.I = model.variables.I + Simulation.sampling_time * ( - model.parameters.n * model.variables.I + model.parameters.b * inputs[0] );
		model.variables.X = model.variables.X + Simulation.sampling_time * ( - model.parameters.p2 * model.variables.X + model.parameters.p3 * model.variables.I );
		model.variables.G = model.variables.G + Simulation.sampling_time * ( - model.parameters.p1 * model.variables.G - model.variables.G * model.variables.X + model.parameters.p1 * model.parameters.Gb + model.parameters.a * inputs[1] );
		
		return [model.variables.G, model.variables.X, model.variables.I];
	}
	
	
	
	
	
	
}
	

/************************************************************************************/










