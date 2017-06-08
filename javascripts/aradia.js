//aradia has several states
//alive  --linear path. Blacks and Burgundies.
//dead  --linear, path. Pastel versions of blacks adn burgundies with white.
//frog/sprite  --burgundy and white. shortlived.
//robot  --non-linear path.  grey and blue and red.
//god/fairy  red and burgundy. non linear path. (somehow organizes other paths??? maid of time...)

//any individual aradia doesn't have to hit all states, but has to hit them in order. no skipping.
//guaranteed to have at least one godtier by the time all 1001 have spawned. 

//drawing is multicolored line, like a streak. like trollian timeline???
//  arrows pointint in direction of motion at both ends.

//first objective, draw a single aradia going linear vertical. have multiple colors (3).
// two arrows. animation.


//has an array of each "tick" in the timeline, which includes x/y position (relative to start)
//and state. each tick is a set of 3 pixels
//play with rendering 3 pixels via fillRect or via ImageData (which is faster???)

function Aradia(x,y, pixels_per_aradia){
	//where did i start?
	this.x0 = x;
	this.y0 = y;
	//where am i now?
	this.x = x;
	this.y = y;
	const ALIVE = 0;
	const GHOST = 1;
	const SPRITE=2;
	const ROBOT = 3;
	const GOD = 4;
	this.state = ALIVE;
	this.pixels_per_aradia = pixels_per_aradia;
	this.isDoomed = false; //automatically doomed if you time travel without a closed loop.
	
	this.tick = function(canvas){
		//console.log("t0ck");
		this.y = this.y - (1*this.pixels_per_aradia);
		//has a random chance of increasing in state until GOD.
		//there should be a nonzero chance of an alive aradia making it to the scratch.
		this.possiblyChangeState();
		//once ROBOT or greater, has a random chance of time traveling
		//(i.e. changing x and y completely)
		//GOD has greatest chance of time traveling.
		this.possiblyTimeTravel(canvas);
		//then, render your three pixels at your current x/y.
		this.renderCurrentPixels(canvas);
	}
	
	this.possiblyChangeState = function(){
		if(this.state < 4){
			if(this.state < 3 && Math.random() > 0.96){
				this.state ++;
			}else if(this.state == 3 && this.isDoomed == false &&  Math.random() > 0.999){
				this.state ++; //doomed aradias can't godtier.
			} 
		}
	}
	
	this.possiblyTimeTravel = function(canvas){
		if(this.state ==3){ //robo aradias spam time travel, but god aradia goes linear.
			//put x and y between 0 and 
			if(Math.random() > 0.75){
				this.randomPosition(canvas);
			}
		}
	}
	
	//when you time travel, only your y position changes if you're in a stable loop.
	//more rarely, your x position will change and you'll immediately become doomed and
	//ineligible for godhood.
	this.randomPosition = function(canvas){
		// make sure X is valid (i.e. divisible by 3*pixels_per_aradia)
		if(Math.random() > 0.95){ //nonstable time loop.
			this.x = Math.floor(Math.random() * canvas.width) + 0;
			var unit = 3 * this.pixels_per_aradia;
			this.x = Math.ceil(this.x/(1.0*unit)) * unit;
			this.isDoomed = true;
			//console.log("A doomed aradia is born.");
		}
		
		
		
		this.y = Math.floor(Math.random() * canvas.height) + 0 ;
	}
	
	
	this.renderCurrentPixels = function(canvas){
		switch(this.state){
			case 0:
				this.renderALIVE(canvas);
				break;
			case 1:
				this.renderGHOST(canvas);
				break;
			case 2:
				this.renderSPRITE(canvas);
				break;
			case 3:
				this.renderROBOT(canvas);
				break;
			case 4:
				this.renderGOD(canvas);
				break;
		}
	}
	this.renderALIVE = function(canvas){

		this.renderPixelThruRect(canvas,this.x,this.y,"#000000");
		this.renderPixelThruRect(canvas,this.x+(1 * this.pixels_per_aradia),this.y,"#a10000");
		this.renderPixelThruRect(canvas,this.x+(2 * this.pixels_per_aradia),this.y,"#000000");
	}
	
	this.renderGHOST = function(canvas){
		this.renderPixelThruRect(canvas,this.x,this.y,"#aaaaaa");
		this.renderPixelThruRect(canvas,this.x+(1 * this.pixels_per_aradia),this.y,"#a17878");
		this.renderPixelThruRect(canvas,this.x+(2 * this.pixels_per_aradia),this.y,"#aaaaaa");
	}
	
	this.renderSPRITE = function(canvas){
		this.renderPixelThruRect(canvas,this.x,this.y,"#a10000");
		this.renderPixelThruRect(canvas,this.x+(1 * this.pixels_per_aradia),this.y,"#FFFFFF");
		this.renderPixelThruRect(canvas,this.x+(2 * this.pixels_per_aradia),this.y,"#a10000");
	}
	
	this.renderROBOT = function(canvas){
		this.renderPixelThruRect(canvas,this.x,this.y,"#666666");
		if(this.isDoomed){
			this.renderPixelThruRect(canvas,this.x+(1 * this.pixels_per_aradia),this.y,"#ff0000");
		}else{
			this.renderPixelThruRect(canvas,this.x+(1 * this.pixels_per_aradia),this.y,"#0000aa");
		}
		this.renderPixelThruRect(canvas,this.x+(2 * this.pixels_per_aradia),this.y,"#666666");
	}
	
	this.renderGOD = function(canvas){
		this.renderPixelThruRect(canvas,this.x,this.y,"#a10000");
		this.renderPixelThruRect(canvas,this.x+(1 * this.pixels_per_aradia),this.y,"#FF0000");
		this.renderPixelThruRect(canvas,this.x+(2 * this.pixels_per_aradia),this.y,"#a10000");
	}
	
	//speed test this l8r
	this.renderPixelThruRect = function(canvas,x,y,color){
		//console.log("Rendering pixel at: " + x + "," + y + " with color: " + color );
		var ctx = canvas.getContext("2d");
		ctx.fillStyle=color;
		ctx.fillRect(x,y,this.pixels_per_aradia,this.pixels_per_aradia);
		//ctx.fill();
	}
}