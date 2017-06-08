//keeps track off all timelines and renders them, one tick at a time.
function Skaia(canvas, buffer, pixels_per_aradia){
	this.canvas = canvas;
	this.buffer = buffer;
	this.aradias = [];
	this.initializedTickDone = false;
	this.pixels_per_aradia = pixels_per_aradia;
	//can be in 1001 aradia mode
	//or can display all trolls/humans in a given timeline in a row. (eventually.)
	//trolls/humans have chance of dying, and dave/aradia can time travel.
	
	this.addAradia = function(){
		//each aradia's initial y is at the bottom. (scratch at top???)
		//and initial x depends on where they are in the array. (times 3)
		this.aradias.push(new Aradia(this.aradias.length*3*this.pixels_per_aradia, this.canvas.height, this.pixels_per_aradia));
	}
	
	this.tick = function(){
		//console.log("tick");
		//in the first tick, simulate each aradia until they unlock time travel
		//after that, only simulate a few aradias at a time for real time animation
		this.initializedTickDone = true; //don't skip first part.
		if(this.initializedTickDone == false){
			console.log("At start, have this many Aradias: " + this.aradias.length);
			this.initialize();
			this.initializedTickDone = true;
			console.log("After init, have this many Aradias: " + this.aradias.length);
		}else{
			//console.log("going to loop aradias");
			if(this.aradias.length >0){
				this.tickXRandomAradias(100);
			}
		}
	}
	
	this.tickXRandomAradias = function(x){
		var aradias_to_remove = [];
		for(var j = 0; j<x; j++){
				var i = Math.floor(Math.random()*this.aradias.length);
				//console.log(i);
				//console.log("Aradia's length is: " + this.aradias.length)
				var aradia = this.aradias[i];
				aradia.tick(this.buffer);
				if(aradia.y <= 0){
					//console.log("mARKING aradia with y of: " + aradia.y);
					aradias_to_remove.push(aradia);
				}
		}
		for(var k = 0; k<aradias_to_remove.length; k ++ ){
			var aradia = aradias_to_remove[k];
			//TODO BUG!!!!!!!!!!!!!!!!! wHY ARE ARADIAS BEING REMOVED PRESCRATCH
			//console.log("Removing aradia with y of: " + aradia.y);
			this.removeFromArray(this.aradias, aradia); //scratched!!!
		}
	}
	
	this.initialize  = function(){
		var stillNonRobotAradias = true;
		var aradias_to_remove = [];
		var aradiasToInit = this.aradias.slice(0); //check this for copy issues.
		while(stillNonRobotAradias){
			stillNonRobotAradias = false;
			for(var i = 0; i<aradiasToInit.length; i++){
				var aradia = aradiasToInit[i];
				aradia.tick(this.buffer);
				if(aradia.state >= 3 || aradia.y <= 0){
					//this.removeFromArray(aradiasToInit, aradia);
					aradias_to_remove.push(aradia);
				}else{
					stillNonRobotAradias = true;
				}
			}
			
			for(var k = 0; k<aradias_to_remove.length; k ++ ){
				var aradia = aradias_to_remove[k];
			this.removeFromArray(aradiasToInit, aradia); //scratched!!!
			}
		}
	}
	
	this.removeFromArray = function (array, value) {
		var idx = array.indexOf(value);
		if (idx !== -1) {
			array.splice(idx, 1);
		}
		return array;
	}
	
	this.renderFromBuffer = function(){
    	this.canvas.getContext("2d").drawImage(this.buffer, 0, 0);
    }
	
	this.render = function(){
		if(this.initializedTickDone == false){
			this.drawBlackBackground(); //only first time (additive pixels???)
		}
		//do some stuff
		this.tick();
		this.renderFromBuffer();
		setTimeout(this.render.bind(this), 100);
	}
	
	this.drawBlackBackground = function(){
		var ctx = this.buffer.getContext("2d");
		ctx.rect(0,0,this.canvas.width,this.canvas.height);
		ctx.fillStyle="black";
		ctx.fill();
	}
}