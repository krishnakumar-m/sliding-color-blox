var colorMaster = ['Violet','Indigo','Blue','Green','Yellow','Orange','Red'];
var W,H;
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
	//alert([this.x,this.y,this.dx,this.dy,this.color,this.w,this.h].join(','));
	ctx.beginPath();
	ctx.fillStyle = this.color;
	var xs = this.x + this.w - W;
	//alert(xs);
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
	    H = cvs.height = window.innerHeight;
	    this.generate();
	    this.display();
	  //  bindEvents();
	    var self = this;
	    var hndl = window.setInterval(function()
		{
		  /*  if (self.dontmove)
			{
			    return;
			}
		    self.collisionCheck();*/
		    self.display();
		 /*   if (ball.y > (self.bottom + self.height / 2))
			{*/
			    self.moveUp();
			/*}
		    if (ball.y <= self.bottom)
			{
			    window.clearInterval(hndl);
			}*/
		}, 300);
	},
    generate : function()
	{
            var blockWidth = W/6;
	    var blockHeight = H/20;
	    
	    for (var i=0;i < H ;i+=4*blockHeight)
		{
		    for(var j=0;j<W;j+=(blockWidth)) {
			this.blocks.push(new Block(j,i,-1,1,colorMaster[Math.floor(Math.random()*7)],blockWidth,blockHeight));
		    }
		}
	},

    moveUp : function()
	{
	    /*this.bottom++;
	    this.nel.push(this.generateRow(this.height + this.bottom - 1));
	    this.nel.shift();*/
	    for(i=0;i<this.blocks.length;i++) {
		
		this.blocks[i].move();
	    }
	},

    generateRow : function(i)
	{
	    var str='';

	    if (i % 5 === 0)
		{
		    str += '<';
		    str += this.createWall();
		    str += '>';
		}
	    else
		{
		    str += '#';
		    for (k = 1;k < this.width - 1;k++)
			{
			    str += ' ';
			}
	            str += '#';
		}
	    return str;
	},
    createWall:function()
	{
	    var str="",k;
	    var len = colorMaster.length;
	    var prev = -1,indx;
	    for (k = 1;k < this.width - 1;k++)
		{
		    do{
			    indx = Math.floor(Math.random() * len);
			}while(prev == indx);
		    str += colorMaster[indx];
		    prev = indx;
		}
	    return str;
	},
    collisionCheck : function()
	{
	    var ballNextX = ball.x + ball.dx;
	    var ballNextY = ball.y + ball.dy;
	    var top = this.bottom + this.height - 1;
	    var collide = false;
	    if (ballNextX >= this.width - 1 || ballNextX <= 0)
		{
		    ball.bounceX();
		    //collide = true;
		} 
	    var thisBlock = this.nel[ballNextY - this.bottom].charAt(ballNextX);
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
	    ball.move();
	    //}
	},
	
	display : function() {
	    ctx.clearRect(0,0,W,H);
	    for(i=0;i<this.blocks.length;i++) {
		
		this.blocks[i].draw();
	    }
	}

    };
    
    function test() {
	
	tun.init();
	//alert(W);
	//alert(H);
	/*var ball = new Ball(50,200,1,1,'red',20);
	ball.draw();
	var block = new Block(W-7,20,1,1,'blue',25,30);
	block.draw();*/
    }