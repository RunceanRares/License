/************************************************************************************/
/*	SIMULATION	
/************************************************************************************/

var Simulation = {
	start_time		: 0,
	stop_time		: 0,
	current_time	: 0,
	sampling_time	: 0,
	
	data			: false,
	
	
	
	initialize : function(settings) {
		
		this.start_time = settings.start_time;
		this.stop_time = settings.stop_time;
		this.sampling_time = settings.sampling_time;
		
		this.current_time	= this.start_time;
		
		this.data 			= [];
		
	}
	
};

	

/************************************************************************************/










