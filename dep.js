function Dep(){
	var dep_results = [];
	var dep_triggers = [];
	var final_callback = null;

	//Check that all dependent functions
	//have been fired and returned
	var isSatisfied = function(){
		for (var i = 0; i < dep_triggers.length; i++) {
			if(dep_triggers[i] !== true){
				return false;
			}
		};
		if(final_callback != null){
			//TODO: fix this
			//final_callback(dep_results);
		}
		return true;
	};

	//Add a dependency to the current list
	this.addDep = function(){
		var dep_i = dep_triggers.length;
		dep_triggers.push(false);	//not triggered
		dep_results.push(null);		//no result yet
		var new_dep = function(){
			dep_results[dep_i] = arguments;
			dep_triggers[dep_i] = true;
			alert("dep callback: "+dep_i);
			isSatisfied();
		}
		return new_dep;
	};

	//Calculate the result once all dependencies
	//are met using the callback function
	this.calc = function(callback){
		final_callback = callback;
	};
}