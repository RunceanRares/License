/************************************************************************************/
/*	The Experiment
/************************************************************************************/

var Experiment = {
	
	settings	: {
	},
	
	model		: {
		sampling_time	: 0,
		timer			: 0,
		
		params		: {
			p1			: 0,
			p2			: 0,
			p3			: 0,
			p4			: 0,
			Gb			: 0,
			a			: 0,
			b			: 0
		},
		
		vars		: {
			G			: 0,
			X			: 0,
			I			: 0
		},
		
		init : function() {
			var model = this;
			
			model.params.p1		= ( typeof Experiment.params.p_1 === "number" ) ? Experiment.params.p_1 : parseFloat(Experiment.params.p_1);
			model.params.p2		= ( typeof Experiment.params.p_2 === "number" ) ? Experiment.params.p_2 : parseFloat(Experiment.params.p_2);
			model.params.p3		= ( typeof Experiment.params.p_3 === "number" ) ? Experiment.params.p_3 : parseFloat(Experiment.params.p_3);
			model.params.p4		= ( typeof Experiment.params.p_4 === "number" ) ? Experiment.params.p_4 : parseFloat(Experiment.params.p_4);
			model.params.Gb		= ( typeof Experiment.params.G_b === "number" ) ? Experiment.params.G_b : parseFloat(Experiment.params.G_b);
			model.params.a		= ( typeof Experiment.params.V === "number" ) ? ( 1 / Experiment.params.V ) : ( 1 / parseFloat(Experiment.params.V) );
			
			model.params.b		= model.params.a;
			
			model.vars.G 		= ( typeof Experiment.params.G_0 === "number" ) ? Experiment.params.G_0 : parseFloat(Experiment.params.G_0);
			model.vars.X		= 0;
			model.vars.I		= 0;
			
			model.sampling_time	= ( typeof Experiment.params.T_e === "number" ) ? Experiment.params.T_e : parseFloat(Experiment.params.T_e);
			model.timer			= 0;
		},
		
		compute : function(inputs) {
			var model = this;
		
			model.vars.I = model.vars.I + model.sampling_time * ( - model.params.p4 * model.vars.I + model.params.b * inputs[0] );
			model.vars.X = model.vars.X + model.sampling_time * ( - model.params.p2 * model.vars.X + model.params.p3 * model.vars.I );
			model.vars.G = model.vars.G + model.sampling_time * ( - model.params.p1 * model.vars.G - model.vars.G * model.vars.X + model.params.p1 * model.params.Gb + model.params.a * inputs[1] );
			
			return [model.vars.G, model.vars.X, model.vars.I];
		}
	},
	
	controller	: {
		sampling_time	: 0,
		timer			: 0,
		
		params : { k1 :0,
		           k2: 0,
				   k3: 0 
				},


		vars			: {
			u				: 0	,
			e               :0,
			r               :0
		},
		
		init : function() {

			var controller = this;
			controller.sampling_time 	= ( typeof Experiment.params.T_e_c === "number" ) ? ( 60 * Experiment.params.T_e_c ) : ( 60 * parseFloat(Experiment.params.T_e_c) );
			controller.timer 			= controller.sampling_time;
			controller.vars.r           = 80;

			controller.params.k1		= ( typeof Experiment.params.k_1 === "number" ) ? Experiment.params.k_1 : parseFloat(Experiment.params.k_1);
			controller.params.k2		= ( typeof Experiment.params.k_2 === "number" ) ? Experiment.params.k_2 : parseFloat(Experiment.params.k_2);
			controller.params.k3		= ( typeof Experiment.params.k_3 === "number" ) ? Experiment.params.k_3 : parseFloat(Experiment.params.k_3);

		},
		
		compute : function(inputs) {
			var controller = this;
			
			/*Legea de reglare*/
            //var stari=

		    controller.vars.e = -controller.vars.r + Experiment.model.vars.G;

            controller.vars.u = controller.vars.e - (Experiment.model.vars.G * controller.params.k1 + Experiment.model.vars.X * controller.params.k2 + Experiment.model.vars.I * controller.params.k3);

            if(controller.vars.u <0 )
			 {
				 controller.vars.u = 0;
			 }
			//controller.vars.u = 10;
		}
	},
	
	params		: {
		
	},
	
	
	vars		: {
		start_time		: 0,
		stop_time		: 0,
		sampling_time	: 0,
	},
	
	sim_data	: [],

	
	
	init		: function(){
		var Exp = this;
		
		var form_fields = $('#parameters-form')[0].elements;
		$.each(form_fields, function(idx, elem){
			Exp.params[$(elem).attr('name')] = $(elem).val();
		});
		
		Exp.sim_data = [];
		
		Exp.model.init();
		Exp.controller.init();
		
	},
	
	run			: function() {
		
		Experiment.init();
		
		var start_time 		= 0,
			stop_time 		= parseFloat(Experiment.params.T_max) * 60,
			sampling_time 	= parseFloat(Experiment.params.T_e),
			time 			= 0;
		
		var u = 0,
			inputs	= [0, 0],
			outputs = [0, 0, 0];
		
		while ( time <= stop_time ) {
			if ( Experiment.controller.timer >= Experiment.controller.sampling_time ) {
				Experiment.controller.compute(1);
				Experiment.controller.timer = 0;
			} else {
				Experiment.controller.timer += sampling_time;
			}
			outputs = Experiment.model.compute([Experiment.controller.vars.u, 0]);
			Experiment.sim_data.push([time, outputs[0]]);
			time += sampling_time;
		}
		
		Experiment.drawChart();
		
	},
	
	
	drawChart	: function() {
		var Exp = this;
		
		var chart_data = new google.visualization.DataTable();
		chart_data.addColumn('number', 'Time');
		chart_data.addColumn('number', 'Concentratia de glucoza din sange');
		chart_data.addRows(Exp.sim_data);

		var options = {
			hAxis		: {
			  title			: 'Time',
			  minValue 		: 0,
			},
			vAxis 		: {
				title 		: "Concentratia de glucoza din sange",
				minValue 	: 0,
			},
			legend		: { 
				position	: 'top' 
			},
			series		: {
				1: {
					curveType: 'function'
				}
			},
			chartArea	: {
				top			: 80,
				bottom		: 80,
				left		: 80,
				right		: 40
			},
			//explorer	: { actions: ['dragToZoom', 'rightClickToReset'] },
			explorer	: {},
			fontName	: 'Verdana'
		};
		
		var chart_container = $('#graph')[0];
		var chart = new google.visualization.LineChart(chart_container);
		chart.draw(chart_data, options);
	}
	
};
	
/************************************************************************************/


