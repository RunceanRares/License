/************************************************************************************/
/*	The Experiment
/************************************************************************************/

Experiment = {			// Explicatie despre experiment
	id				: 'minimal-model-time-response',		// Unique ID
	
	name			: 'Time response of minimal model',
	about			: '',
	
	model			: Models[0],
	controller		: false,
	
	
	html_content	: `
		<div class="experiment-settings">
			<button class="red-button run-experiment">RUN</button>
		</div>
		<div class="graphs">
			<div class="loading-graphs"></div>
			<div class="graph">
			</div>
			<div class="graph-controls">
				<button>NO</button>
			</div>
		</div>
	`,
	
	
	onOpen: function() {
		
		
	},
	
	
	
	close: function(){
	},
	
	
	
	prepare: function() {
		
	},
	
	
	
	run: function() {	
		var experiment = this;
		
		// initialize the simulation
		Simulation.initialize({
			start_time		: 0,
			stop_time		: 10800,
			sampling_time	: 1,
		});
		
		
		// set initial conditions
		this.model.setInitialConditions({
			G			: 320,
			X			: 0,
			I			: 0
		});
		
		// input and outputs
		var inputs = [1, 0],
			outputs = [0, 0, 0];
		
		// calculate outputs
		while ( Simulation.current_time <= Simulation.stop_time ) {
			outputs = experiment.model.compute(inputs);
			Simulation.data.push([Simulation.current_time, outputs[0]]);
			Simulation.current_time += Simulation.sampling_time;
		}
		
		// draw the chart
		experiment.drawChart();
	},
	
	
	
	drawChart: function() {
		var experiment = this;
		
		var chart_data = new google.visualization.DataTable();
		chart_data.addColumn('number', 'Time');
		chart_data.addColumn('number', 'Blood Glucose Concentration');
		chart_data.addRows(Simulation.data);

		var options = {
			hAxis		: {
			  title			: 'Time',
			  minValue 		: 0,
			},
			vAxis 		: {
				title 		: "Blood Glucose Concentration",
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

		
		var chart_container = $('#experiments-container').children('.open').children('.graphs').children('.graph')[0];
		var chart = new google.visualization.LineChart(chart_container);
		chart.draw(chart_data, options);
		
		//var imgUri = chart.getImageURI();
		// do something with the image URI, like:
		//window.open(imgUri);
	
	}
	
	
}




/************************************************************************************/










