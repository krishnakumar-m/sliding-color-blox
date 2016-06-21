
var PS ={};
PS.Config = {
    VEL_X : {MIN:-5,MAX:5},
    VEL_Y : {MIN:-1,MAX:1},
    ACC_X : {MIN:-1,MAX:1},
    ACC_Y : {MIN:-1,MAX:1},
    SIZE : {MIN:5, MAX:15},
    LIFE : {MIN:5,MAX:60},
    START_COLOR : {r:255,g:255,b:0},
    END_COLOR : {r:255,g:0,b:0}

    };


function getRandomInt(range) {
	var min = range.MIN, max = range.MAX;
	return Math.floor(Math.random() * (max - min + 1)) + min;
    }


function Point(x,y) {
	this.x = x;
	this.y = y;
	this.add = function(point) {
		this.x += point.x;
		this.y += point.y;
	    };
    }



function Particle(x,y,size,maxlife,ctx,startColor,endColor) {
	this.loc = new Point(x, y);
	this.vel = new Point(getRandomInt(PS.Config.VEL_X) , getRandomInt(PS.Config.VEL_Y));

	this.acc = new Point(getRandomInt(PS.Config.ACC_X), getRandomInt(PS.Config.ACC_Y));

	this.size = size;
	this.life = maxlife;
	this.maxLife = maxlife;
	this.ctx = ctx;
	this.startColor = startColor || {r:0,g:0,b:0};
	this.endColor = endColor || {r:255,g:255,b:255};
	this.color = {r:this.startColor.r, g:this.startColor.g,b:this.startColor.b};

	this.colorRange = {};
	this.colorRange["r"] = this.endColor.r - this.startColor.r;
	this.colorRange["g"] = this.endColor.g - this.startColor.g;
	this.colorRange["b"] = this.endColor.b - this.startColor.b;

	this.update = function() {

		this.vel.add(this.acc);

		this.loc.add(this.vel);

		this.life--;

		var ageRatio = this.life / this.maxLife;
		this.size = parseInt(this.size * ageRatio);

		this.color.r = this.startColor.r + Math.floor((this.colorRange.r + 1) * (1 - ageRatio));
		this.color.g = this.startColor.g + Math.floor((this.colorRange.g + 1) * (1 - ageRatio));
		this.color.b = this.startColor.b + Math.floor((this.colorRange.b + 1) * (1 - ageRatio));


	    };

	this.show = function() {
		this.ctx.beginPath();
		this.ctx.globalCompositeOperation = "lighter";
		this.ctx.arc(this.loc.x, this.loc.y, this.size, 0, 2 * Math.PI);
		this.ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.life / this.maxLife + ')';
		this.ctx.fill();
	    };
    }

function ParticleSystem(max,x,y,ctx,loop) {
	this.particles = [];
	this.count = max;
	this.x = x;
	this.y = y;

	this.ctx = ctx;
	this.init = function() {
		var i;
		for(i = 0;i < this.count;i++) {

			this.particles[i] = new Particle(this.x, this.y, getRandomInt(PS.Config.SIZE), getRandomInt(PS.Config.LIFE), this.ctx, PS.Config.START_COLOR, PS.Config.END_COLOR);

		    }
	    };

	this.init();
	this.update = function () {
		var i;
		
		for(i = this.count - 1;i >= 0 ;i--) {
			this.particles[i].update();

			if(this.particles[i].life <= 0 || this.particles[i].size <= 0) {
				if(this.loop) {
					this.particles[i] = new Particle(this.x, this.y, getRandomInt(PS.Config.SIZE), getRandomInt(PS.Config.LIFE), this.ctx, PS.Config.START_COLOR, PS.Config.END_COLOR);
				    }
				else {
					this.particles.splice(i, 1);
					
				    }
			    }
		    }	    
		    this.count = this.particles.length;
	    };

	this.show = function() {
		var i;
		for(i = 0;i < this.count;i++) {
			this.particles[i].show();
		    }
	    };
    }

    
    var partSys = {
	systems : [],
	hndl : null,
	lastTime : new Date().getTime(),
	init : function() {
	    this.systems = [];
	},
	add : function(system) {
	    this.systems.push(system);
	},
	update : function() {
	    var len = this.systems.length;
	    for(var i= len -1;i>=0;i--) {
		this.systems[i].update();
		if(this.systems[i].particles.length<=0) {
		    this.systems.splice(i,1);
		}
		
	    }
	},
	show : function() {
	    var len = this.systems.length;
	    for(var i= len -1;i>=0;i--) {
		this.systems[i].show();
            }
	},
	run : function() {
	    var now = new Date().getTime();
	    var elapsed = now - this.lastTime;
	    if(elapsed>=frameInterval) {
	        this.update();
	        this.show();
		this.lastTime = new Date().getTime();
	    }
	    window.requestAnimationFrame(this.run.bind(this));
	    
	}
	
    };
