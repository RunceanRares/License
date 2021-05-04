/************************************************************************************/
/* The Application object */
/************************************************************************************/

var Application = {
	
	status				: {
		charts_loaded		: false,
	},
	
	simulation			: {
		data				: []
	},
	
	commands		: {
		run				: function(){
			$('#graph-loader').addClass('on');
			setTimeout(function(){
				Experiment.run();
				setTimeout(function(){
					$('#graph-loader').removeClass('on');
				}, 500);
            }, 500);
            $("#graph").css('height', '400px');
		}
	},
	
	
	
	
	/////////////////////////////////////////////////////////////////////////////////
	// CREATE : this is called before DOM is ready (it doesn't depend on HTML content)
	/////////////////////////////////////////////////////////////////////////////////
	create: function() {
		var App = this;
		
		// Google charts
		google.charts.load('current', {
			'packages': ['corechart']
		});
		google.charts.setOnLoadCallback(function(){
			App.status.charts_loaded = true;
			App.build();
		});
		
	},
	
	
	
	/////////////////////////////////////////////////////////////////////////////////
	// LOAD SCRIPTS : load external scripts
	/////////////////////////////////////////////////////////////////////////////////
	loadScripts: function(){
	},
	
	
	
	/////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE : this is called when DOM is ready ( = document.ready)
	/////////////////////////////////////////////////////////////////////////////////
	initialize: function() {
		var App = this;
		
		// Load custom scripts (dinamically)
		//App.loadScripts();
		
		// Initialize UI
		App.initializeUI();
     
	},
	
	
	
	/////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE USER INTERFACE
	/////////////////////////////////////////////////////////////////////////////////
	initializeUI: function() {
		var App = this;
		
		
		
		
		// Experiment's settings menu (form)
		
		$('.dataset-select-toggle').on('click', function(e){
			e.preventDefault();
			var $select = $(this).parent();
			$select.toggleClass('open');
			return false;
		});
		
		$('.load-dataset').on('click', function(e){
			e.preventDefault();
			var $select = $(this).closest('.dataset-select');
			var dataset_group = $select.data('dataset-group'),
				dataset_idx = $(this).data('dataset'),
				$params_group = $($select.data('params-group'));
			var dataset = Datasets[dataset_group][dataset_idx];
			for(var key in dataset) {
				var $input = $('#param___' + key);
				$input.val(dataset[key]);
			}
			$select.children('.current-dataset').text('Dataset: ' + $(this).text());
			$select.removeClass('open');
			return false;
		});
		
		$('.parameters-group').find('input').on('change', function(){
			var $params_group = $(this).closest('.parameters-group'),
				$select = $params_group.find('.dataset-select');
			if ( $select.length > 0 ) {
				$select.children('.current-dataset').text('Dataset: Custom');
			}
			return true;
		});
		
		////////
		
		
		
		// Cummand buttons
		$('.cmd').on('click', function(e){
			var cmd = $(this).data('cmd');
			App.call(App.commands[cmd]);
		});
		////////
		
		
	},
	


	/////////////////////////////////////////////////////////////////////////////////
	// BUILD : this is called when everything is loaded
	/////////////////////////////////////////////////////////////////////////////////
	build: function() {
		var App = this;
	},
	
	
	
	
	/////////////////////////////////////////////////////////////////////////////////
	// START : this is called when everything is loaded and prepared
	/////////////////////////////////////////////////////////////////////////////////
	start: function() {
		var App = this;
	},
	
	
	
	
	/////////////////////////////////////////////////////////////////////////////////
	// CALL 
	/////////////////////////////////////////////////////////////////////////////////
	call: function(fcn){
		if ( typeof fcn === 'function' ) {
			return fcn();
		} else {
			alert("Cannot execute command: '" + fcn + "'. Function does not exists");
			return false;
		}
	}

};
/************************************************************************************/

Application.create();

$(document).ready(function() {
	Application.initialize();
});

$(window).load(function(){
	Application.start();
});

/************************************************************************************/










