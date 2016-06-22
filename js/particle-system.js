
var config = {
    minVelX : -5,
    minVelY :-1,
    maxVelX : 5,
    maxVelY :1,
    minAccX : 0,
    minAccY :0,
    maxAccX : 0,
    maxAccY : 0,
    minSize : 5,
    maxSize : 15,
    minLife : 5,
    maxLife : 60,
    startColor : {r:255,g:255,b:0},
    endColor : {r:255,g:0,b:0}
    
};

function getRandomInt(min, max) {
	//var min = range.MIN, max = range.MAX;
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



function Particle(x,y,ctx,config) {
	this.loc = new Point(x, y);
	this.vel = new Point(getRandomInt(config.minVelX,config.maxVelX) , getRandomInt(config.minVelY,config.maxVelY));

	this.acc = new Point(getRandomInt(config.minAccX,config.maxAccX), getRandomInt(config.minAccY,config.maxAccY));

	this.size = getRandomInt(config.minSize,config.maxSize);
	this.maxLife = this.life = getRandomInt(config.minLife,config.maxLife);
	this.ctx = ctx;
	this.startColor = config.startColor || {r:0,g:0,b:0};
	this.endColor = config.endColor || {r:255,g:255,b:255};
	this.color = {r:this.startColor.r, g:this.startColor.g,b:this.startColor.b};

	this.colorRange = {};
	this.colorRange.r = this.endColor.r - this.startColor.r;
	this.colorRange.g = this.endColor.g - this.startColor.g;
	this.colorRange.b = this.endColor.b - this.startColor.b;

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

function ParticleSystem(max,x,y,ctx,config,loop) {
	this.particles = [];
	this.count = max;
	this.x = x;
	this.y = y;
        this.config = config;
	this.ctx = ctx;
	this.init = function() {
		var i;
		for(i = 0;i < this.count;i++) {

			this.particles[i] = new Particle(this.x, this.y, this.ctx, this.config);

		    }
	    };

	this.init();
	this.update = function () {
		var i;
		
		for(i = this.count - 1;i >= 0 ;i--) {
			this.particles[i].update();

			if(this.particles[i].life <= 0 || this.particles[i].size <= 0) {
				if(this.loop) {
					this.particles[i] = new Particle(this.x, this.y, this.ctx, this.config);
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
