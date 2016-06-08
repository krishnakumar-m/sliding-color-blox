var colorMaster = ['Violet','Indigo','Blue','Green','Yellow','Orange','Red'];
var W,H,um = 3,bmu=5;
var Shape = function(x, y, dx, dy, color)
    {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.color = color;
    };
    
Shape.prototype.move = function()
    {
	this.x += this.dx;
	this.y += this.dy;
    };
    
var Ball = function(x, y, dx, dy, color,r)
    {
	Shape.call(this, x, y, dx, dy, color);
	this.r = r;
    };

var Block = function(x, y, dx, dy, color,w, h)
    {
	Shape.call(this, x, y, dx, dy, color);
	this.w = w;
	this.h = h;
    };
    
    
Ball.prototype = Object.create(Shape.prototype);
Block.prototype = Object.create(Shape.prototype);

// Wraparound right
Block.prototype.right = function()
    {
	var xs = this.x + this.w - W;
	return (xs > 0) ?xs: (this.x + this.w);
    };

Block.prototype.bottom = function()
    {
	return this.y + this.h;
    };

Block.prototype.move = function()
    {
	this.x += this.dx;
	if(this.x>W) { this.x = 0;}
	else if(this.x<0) {this.x = W;}
	this.y += this.dy;
    };
    
Block.prototype.draw = function()
    {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	var xs = this.x + this.w - W;
	if (xs > 0)
	    {
		ctx.rect(this.x, this.y, W - this.x, this.h);
		ctx.fill();
		ctx.rect(0, this.y, xs, this.h);
		ctx.fill();
	    }
	else
	    {
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.fill();
	    }

    };

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.fill();
};
    
    
Ball.prototype.bounceX = function()
    {
	this.dx = -this.dx;
    };
Ball.prototype.bounceY = function()
    {
	this.dy = -this.dy;
    };
Ball.prototype.offLimitsX = function()
    {
	var newX = this.x + this.dx;
	return (newX < 0) || (newX > board.width - board.blockWidth);
    };
Ball.prototype.offLimitsY = function()
    {
	var newY = this.y + this.dy;
	return newY < 0 || newY >= board.height - board.blockHeight;
    };


var score = {
    multiplier : 0,
    block : 10,
    minus : -1,
    total : 0
    };

var tun = {
    top : 0,
    bottom : 0,
    width : 21,
    height : 16,
    distance : 20,
    nel : [],
    blocks :[],
    dontmove :false,
    ball : null,
    init : function()
	{
	    cvs = document.getElementById('tnlcvs');
	    ctx = cvs.getContext('2d');
	    W = cvs.width = window.innerWidth;
	    this.bottom = H = cvs.height = window.innerHeight;
	    blockWidth = W/6;
	    blockHeight = H/20;
	    
	    
	    this.generate();
	    this.ball = new Ball(W/2, H-150,-bmu,-bmu,'white',10);
	    bindEvents();
	    var self = this;
	    var hndl = window.setInterval(function()
		{
		    self.collisionCheck();
		    self.ball.move();
		    if (self.ball.y <= (self.bottom/2))
			{
			    self.moveUp();
		        }
		    self.display();
		    
		   
		  if (self.ball.y > H)
	                {
			    window.clearInterval(hndl);
			}
		}, 300);
	},
    generate : function()
	{
	    for (var i=0;i < H ;i+=4*blockHeight)
		{
		    this.generateRow(i);
		}
	},

    moveUp : function()
	{
	    var createNew = false;
	   /* this.top--;
	    this.bottom = this.top + H;*/
	    for(i=this.blocks.length-1;i>=0;i--) {
		//this.blocks[i].dy = um;
		this.blocks[i].y+=um;
		 if(this.blocks[i].y > this.bottom) {
                     this.blocks.splice(i,1);
		     createNew = true;
                 }
	    }
	    if(createNew) {
	        this.generateRow(0);
	    }
	},

    generateRow : function(x)
	{
	    for(var j=0;j<W;j+=(blockWidth)) {
		this.blocks.push(new Block(j,x,0,0,colorMaster[Math.floor(Math.random()*7)],blockWidth,blockHeight));
            }
	},
    collisionCheck : function()
	{
	    var ballNextX = this.ball.x + this.ball.dx;
	    var ballNextY = this.ball.y + this.ball.dy;
	    
	    if (ballNextX + this.ball.r > W || ballNextX < this.ball.r)
		{
		    this.ball.bounceX();
		} 
	    
           var newBall = new Ball(ballNextX,ballNextY,0,0,'',this.ball.r);
	   for(i=this.blocks.length-1;i>0;i--) {
	       var thisBlock = this.blocks[i];
	       var result = collisionTest(newBall,thisBlock);
               if(result) {
		   
		   if(this.ball.color == thisBlock.color) {
		       this.blocks.splice(i,1);
		   } else {
		       this.ball.color = thisBlock.color;
		       if(result.dx) {
			   this.ball.bounceX();
		       }
		       if(result.dy) {
		           this.ball.bounceY();
		       }
		   }
		   
		   break;
	       }
           }
		
	  /*  var thisBlock = this.nel[ballNextY - this.bottom].charAt(ballNextX);
	    if (thisBlock != '#' && thisBlock != ' ')
		{
		    if (thisBlock == ball.color)
			{
			    var str = this.nel[ballNextY - this.bottom];
			    this.nel[ballNextY - this.bottom] = str.substr(0, ballNextX) + ' ' + str.substr(ballNextX + 1);
			    score.multiplier = score.multiplier + ball.dy;
			    if (score.multiplier < 0)
				{
				    score.multiplier = 0;
				}
			    score.total += score.block * score.multiplier;
			    if (score.total < 0)
				{
				    score.total = 0;
				}
			    document.getElementById('score').innerHTML = score.total;
			}
		    else
			{
			    //ball.color = thisBlock;
			    ball.color = this.nel[ballNextY - this.bottom].charAt(ball.x);
			    ball.bounceY();
			    score.total += score.minus;
			    if (score.total < 0)
				{
				    score.total = 0;
				}
			    document.getElementById('score').innerHTML = score.total;
			}
		}
	    else if (ballNextY <= 0 || ballNextY >= top)
		{
		    ball.bounceY();
		    //collide = true;
		} 

	    //if(!collide) {
	    ball.move();*/
	    //}
	},
	
	display : function() {
	    ctx.clearRect(0,0,W,H);
	    for(i=0;i<this.blocks.length;i++) {
		
		this.blocks[i].draw();
	    }
	    this.ball.draw();
	}

    };
    
    function bindEvents() {
     /*document.getElementById('tnlcvs').onmousedown = function(event) {
    hndl = window.setInterval(function() {
      console.log('mousedown ' + event.clientX);
      for (i = 0; i < tun.blocks.length; i++) {
        tun.blocks[i].dx = ((event.clientX > W / 2) ? um : -um);
        tun.blocks[i].move();
      }
    }, 200);
  }
  document.getElementById('tnlcvs').onmouseup = function() {
    window.clearInterval(hndl);
    for (i = 0; i < tun.blocks.length; i++) {
      tun.blocks[i].dx = 0;
    }
  };*/
     document.getElementById('tnlcvs').ontouchstart = function(event) {
         for(i=0;i<tun.blocks.length;i++) {
	   var touchX = event.changedTouches[0].pageX;
           tun.blocks[i].dx=((touchX>W/2)?um:-um);
	   tun.blocks[i].move();
         }
     };
     document.getElementById('tnlcvs').ontouchend = function() {
        for(i=0;i<tun.blocks.length;i++) {
           tun.blocks[i].dx=0;
         }
     };
     
    }
    
    
    function collisionTest(circle,rect) {
	var distX = Math.abs(circle.x - rect.x - rect.w/2);
	var distY = Math.abs(circle.y - rect.y - rect.h/2);
	
	if(distX > (circle.r+ rect.w/2)) {
	    return null;
	}
	if(distY > (circle.r+ rect.h/2)) {
	    return null;
	}
	if(distX <= rect.w/2) {
	    return {dx : false,dy : true};
	}
	if(distY <= rect.h/2) {
	    return {dx : true,dy : false};
	}
	
	
	var dx = distX - rect.w/2;
	var dy = distY - rect.h/2;
	if((dx*dx + dy*dy)<= (circle.r*circle.r)) {
	    return {dx : true,dy : true};
	} else {
	    null;
	}
    }
