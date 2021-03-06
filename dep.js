function Dep(options){
	var dep_options = {
		nullArgs: true,			//return null args (true) or don't include in return list (false)
		groupedArgs: true,		//group args by function (true) or return each arg seperately (false)
		bundleArgs: false,		//bundle args into one big array (true) or return as separage groups/args (false)
	};
	if(typeof options != 'undefined'){
		dep_options = options;
	}
	var dep_results = [];
	var dep_triggers = [];
	var final_callback = null;
	
	//TODO: add error callback that cancels the whole
	//		sequence if one is called

	//TODO: make addDep() atomic

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
			if(dep_options['groupedArgs'] === false || dep_options['bundleArgs'] === true){
				//don't group args by the function call that sent them
				var new_arr = [];
				for (var i = 0; i < dep_results.length; i++) {
					if(dep_results[i] != null &&
					   typeof dep_results[i] !== "string" &&
					   "length" in dep_results[i]){
						for (var j = 0; j < dep_results[i].length; j++) {
							new_arr.push(dep_results[i][j]);
						}
					}else{
						new_arr.push(dep_results[i]);
					}
				}
				dep_results = new_arr;
			}
			if(dep_options['bundleArgs'] === true){
				//send all args in one big array
				final_callback(dep_results);
			}else{
				final_callback.apply(null, dep_results);
			}
		}
		return true;
	};

	//Add a dependency to the current list
	this.addDep = function(run_before){
		var dep_i = dep_triggers.length;
		dep_triggers.push(false);	//not triggered
		dep_results.push(null);		//no result yet
		//arguments for run before function
		var run_before_args = Array.prototype.slice.call(arguments, 1);	//cut out run_before
		var new_dep = function(){
			//Store argument(s)
			if(arguments.length < 1){
				dep_results[dep_i] = null;
			}else if(arguments.length == 1){
				dep_results[dep_i] = arguments[0];
			}else{
				//convert args into array (subarray of entire "array")
				var args = Array.prototype.slice.call(arguments, 0);
				dep_results[dep_i] = args.sort();
			}
			//run function if we have one
			if(run_before != null){
				run_before_args.unshift(dep_results[dep_i]);
				run_before.apply(null, run_before_args);
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