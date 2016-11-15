'use strict';
/**
* Copyright 2016 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
app.factory('WorkItems', function () {
	var o = {
		items: [],
		curItem: {},
		weather: {}
	}

	o.addItem = function(item){
		o['items'].push(item);
	}

	o.removeItem = function(item){
		var index = o['items'].indexOf(item);
		if (index > -1) {
			o['items'].splice(index, 1);
		}
	}

	o.clearItems = function() {
		o['items'] = [];
	}

	o.setWorkItem = function(workItem){
		o['curItem'] = workItem;
	}

	o.removeWorkItem = function(){
		o['curItem'] = {};
	}

	o.clearWeather = function(){
		o['weather'] = [];
	}

	o.setWeather = function(weather){
		o['weather'] = weather;
	}

	return o;
});
