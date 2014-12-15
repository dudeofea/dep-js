function Dep(options){
	var dep_options = {
		nullArgs: true,
		groupedArgs: true
	};
	if(typeof options != 'undefined'){
		dep_options = options;
	}
	var dep_results = [];
	var dep_triggers = [];
	var final_callback = null;
	
	//TODO: all in one arg array option
	//TODO: add error callback that cancels the whole
	//		sequence if one is called

	//Check that all dependent functions
	//have been fired and returned
	var isSatisfied = function(){
		if(dep_triggers.length == 0){
			return false;
		}
		for (var i = 0; i < dep_triggers.length; i++) {
			if(dep_triggers[i] !== true){
				return false;
			}
		};
		//if all functions have returned, trigger the callback
		if(final_callback != null){
			if(dep_options['nullArgs'] === false){
				//remove args from functions with no args
				dep_results = dep_results.filter(function(e){
					return e !== null;
				})
			}
			if(dep_options['groupedArgs'] === false){
				var new_arr = [];
				for (var i = 0; i < dep_results.length; i++) {
					if("length" in dep_results[i]){
						for (var j = 0; j < dep_results[i].length; j++) {
							new_arr.push(dep_results[i][j]);
						}
					}else{
						new_arr.push(dep_results[i]);
					}
				}
				dep_results = new_arr;
			}
			final_callback.apply(null, dep_results);
		}
		return true;
	};

	//Add a dependency to the current list
	this.addDep = function(){
		var dep_i = dep_triggers.length;
		dep_triggers.push(false);	//not triggered
		dep_results.push(null);		//no result yet
		var new_dep = function(){
			//Store argument(s)
			if(arguments.length < 1){
				dep_results[dep_i] = null;
			}else if(arguments.length == 1){
				dep_results[dep_i] = arguments[0];
			}else{
				var args = Array.prototype.slice.call(arguments, 0);
				dep_results[dep_i] = args.sort();
			}
			//Set triggered
			dep_triggers[dep_i] = true;
			isSatisfied();
		}
		return new_dep;
	};

	//Calculate the result once all dependencies
	//are met using the callback function
	this.calc = function(callback){
		final_callback = callback;
		isSatisfied();
	};
}