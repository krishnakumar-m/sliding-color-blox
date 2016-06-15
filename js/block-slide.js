var colorMaster = [
    '#F7E700','#EB1E1E','#11CF7F','#53B7E6','#F067A7','#8623A1'
    ];
var W,H,um = 3,bmu=1,viewPort;

var Shape = function(x,y,dx,dy,color) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.color = color;
    };

Shape.prototype.move = function() {
	this.x += this.dx * this.speed;
	this.y += this.dy * this.speed;
    };

var Ball = function(x,y,dx,dy,color,r) {
	Shape.call(this, x, y, dx, dy, color);
	this.r = r;
	this.speed = bmu;
    };

var Block = function(x,y,dx,dy,color,w,h) {
	Shape.call(this, x, y, dx, dy, color);
	this.w = w;
	this.h = h;
    };


Ball.prototype = Object.create(Shape.prototype);
Block.prototype = Object.create(Shape.prototype);

// Wraparound right
Block.prototype.right = function() {
	var xs = this.x + this.w - W;
	return (xs > 0) ?xs: (this.x + this.w);
    };

Block.prototype.bottom = function() {
	return this.y + this.h;
    };

Block.prototype.move = function() {
	this.x += this.dx;
	if(this.x > W) { this.x = 0;}
	else if(this.x < 0) {this.x = W;}
	this.y += this.dy;
    };

Block.prototype.draw = function() {
	var xs = this.x + this.w - W;
if (xs > 0) {
   var rad = {tl: 10, tr: 0, br: 0, bl: 10};
   viewPort.roundRect(this.x, this.y,W - this.x, this.h, rad, this.color);
   
    rad = {tl: 0, tr: 10, br: 10, bl: 0};
    viewPort.roundRect(0, this.y, xs, this.h, rad, this.color);
    
  } else {
    //ctx.rect(this.x, this.y, this.w, this.h);
  //  ctx.fill();
  viewPort.roundRect(this.x, this.y, this.w, this.h, 10, this.color);
  }

    };

Ball.prototype.draw = function() {
	viewPort.circle(this.x, this.y, this.r, null, this.color);
    };


Ball.prototype.bounceX = function() {
	this.dx = -this.dx;
    };
Ball.prototype.bounceY = function() {
	this.dy = -this.dy;
    };


var score = {
    multiplier : 1,
    block : 10,
    minus : 1,
    total : 0,
    init : function() {
	    this.multiplier = 1;
	    this.total = 0;
	},
    display : function() {
	    viewPort.text(this.total, W / 2, H / 2, 'rgba(255,255,255,0.5)', '30px Verdana');
	},
    breakBlock : function() {
	    score.multiplier = score.multiplier - tun.ball.dy;
	    if(score.multiplier < 1) {
		    score.multiplier = 1;
		}
	    score.total += score.block * score.multiplier;
	    if(score.total < 0) {
		    score.total = 0;
		}
	    this.display();
	},
    bounce : function() {
	    score.total -= score.minus;
	    if(score.total < 0) {
		    score.total = 0;
		}
	    this.display();
	}
    };
var sounds = {
    snds : {},
    init : function(arr) {
	    if(!window.Audio) {
		    return;
		}
	    for(var i=0;i < arr.length;i++) {
		     var aSound = new Audio();
		    aSound.setAttribute('src','sounds/'+arr[i] + '.ogg');
		    this.snds[arr[i]] = aSound;
		}
	},
    play : function(snd) {
	    if(window.Audio) {
		    this.snds[snd].play();
		}
	}

    };
var tun = {
    blocks :[],
    ball : null,
    init : function() {
	    this.blocks = [];
	    viewPort = new Canvas('tnlcvs', window.innerWidth, window.innerHeight);
	    W = window.innerWidth;
	    this.bottom = H =  window.innerHeight;
	    blockWidth = Math.ceil(W / 6);
	    blockHeight = H / 20;
            sounds.init(['BreakBlock','Bounce','GameOver']);
	    score.init();
	    this.generate();

	    this.ball = new Ball(W / 2, H - 150, -1, -1, 'White', 10);
	    // bindEvents();
	    /*var self = this;
	    var hndl = window.setInterval(function() {

		    if(self.ball.y <= (H / 2)) {
			    self.moveUp();
		        }

		    self.collisionCheck();
		    self.ball.speed = bmu + Math.floor(score.total / 100);
		    self.ball.move();
		    self.display();

		    if(self.ball.y > H) {
			    window.clearInterval(hndl);
			    self.gameover(score.total);
			    sounds.play('GameOver');
			}
		}, 300);*/
		tun.hndl = window.requestAnimationFrame(loop);
	},
    generate : function() {
	    for(var i=0;i < H ;i += 4 * blockHeight) {
		    this.generateRow(i);
		}
	},

    moveUp : function() {
	    var createNew = false;

	    for(i = this.blocks.length - 1;i >= 0;i--) {
		    this.blocks[i].y += um;
		    if(this.blocks[i].y > this.bottom) {
			    this.blocks.splice(i, 1);
			    createNew = true;
			}

		}
	    if(createNew) {
		    this.generateRow(0);
		}
	},

    generateRow : function(x) {
	    var len = colorMaster.length;
	    var prev = -1,now;
	    for(var j=0;j < W;j += (blockWidth)) {
		    do {
			    now = Math.floor(Math.random() * len);
			}while(prev === now);
		    this.blocks.push(new Block(j, x, 0, 0, colorMaster[now], blockWidth, blockHeight));
		    prev = now;
		}
	},
    collisionCheck : function() {
	    var ballNextX = this.ball.x + this.ball.dx * this.ball.speed;
	    var ballNextY = this.ball.y + this.ball.dy * this.ball.speed;

	    if(ballNextX + this.ball.r > W || ballNextX < this.ball.r) {
		    this.ball.bounceX();
		} 

	    if(ballNextY < this.ball.r) {
		    this.ball.bounceY();
		}
	    var newBall = new Ball(ballNextX, ballNextY, 0, 0, '', this.ball.r), result;
	    for(i = this.blocks.length - 1;i > 0;i--) {
		    var thisBlock = this.blocks[i];
		    if(thisBlock.right() < thisBlock.x) {
			    result = collisionTest(newBall, new Block(0, thisBlock.y, 0, 0, '', thisBlock.right(), thisBlock.h)) || collisionTest(newBall, new Block(thisBlock.x, thisBlock.y, 0, 0, '', thisBlock.w - thisBlock.right(), thisBlock.h));
			}
		    else {
			    result = collisionTest(newBall, thisBlock);
			}


		    if(result) {

			    if(this.ball.color === thisBlock.color) {
				    this.blocks.splice(i, 1);
				    score.breakBlock();
				    sounds.play('BreakBlock');
				}
			    else {
				    this.ball.color = thisBlock.color;
				    if(result.dx) {
					    this.ball.bounceX();
					}
				    if(result.dy) {
					    this.ball.bounceY();
					}
				    score.bounce();
				    sounds.play('Bounce');
				}

			    break;
			}
		}
	},

    display : function() {
	    viewPort.clear();
	    for(i = 0;i < this.blocks.length;i++) {
		    this.blocks[i].draw();
		}
	    this.ball.draw();
	    score.display();
	},
    gameover : function(score) {
	    document.getElementById('intro').style.display = 'none';
	    document.getElementById('tnlcvs').style.display = 'none';
	    document.getElementById('gameover').style.display = 'block';
	    document.getElementById('score').innerHTML = 'You scored ' + score;
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
		var touchX = event.touches[0].pageX;
		if(typeof hndlt !== 'undefined') {
			window.clearInterval(hndlt);
		    }
		hndlt = window.setInterval(function() {
			for(var i = 0;i < tun.blocks.length;i++) {
				tun.blocks[i].dx = ((touchX > W / 2) ?um: -um);
				tun.blocks[i].move();
			    }
		    }, 200);
	    };
	document.getElementById('tnlcvs').ontouchend = function() {
		window.clearInterval(hndlt);
		for(var i = 0;i < tun.blocks.length;i++) {
			tun.blocks[i].dx = 0;
		    }
	    };

	document.body.addEventListener('touchmove', function(event) {
		event.preventDefault();
	    }, false);


	document.getElementById('start').ontouchstart = function() {
		document.getElementById('intro').style.display = 'none';
		document.getElementById('tnlcvs').style.display = 'block';
		tun.init();
	    };
	    
	document.getElementById('restart').ontouchstart = function() {
		document.getElementById('gameover').style.display = 'none';
		document.getElementById('tnlcvs').style.display = 'block';
		tun.init();
	    };
	document.getElementById('email').ontouchstart = function() {
	        var sub = 'Feedback about SlideBlox';
		window.open('mailto:krishnakumarm777@gmail.com?subject='+encodeURI(sub));
	    };

       /* document.getElementById('restart').onclick = function() {
		document.getElementById('gameover').style.display = 'none';
		document.getElementById('tnlcvs').style.display = 'block';
		tun.init();
	    };
	document.getElementById('tweet').onclick = function() {
	        var msg = 'I scored '+score.total+' points in #SlideBlox. Can you beat that?';
		window.open('https://m.twitter.com?status='+encodeURI(msg),'_blank');
	    };*/
    }


function collisionTest(circle,rect) {
	var distX = Math.abs(circle.x - rect.x - rect.w / 2);
	var distY = Math.abs(circle.y - rect.y - rect.h / 2);

	if(distX > (circle.r + rect.w / 2)) {
		return null;
	    }
	if(distY > (circle.r + rect.h / 2)) {
		return null;
	    }
	if(distX <= rect.w / 2) {
		return {dx : false,dy : true};
	    }
	if(distY <= rect.h / 2) {
		return {dx : true,dy : false};
	    }


	var dx = distX - rect.w / 2;
	var dy = distY - rect.h / 2;
	if((dx * dx + dy * dy) <= (circle.r * circle.r)) {
		return {dx : true,dy : true};
	    }
	else {
		return null;
	    }

    }
    
    function loop() {
      tun.collisionCheck();
      tun.ball.speed = bmu + Math.floor(score.total / 100);
      tun.ball.move();
      if (tun.ball.y <= (tun.bottom / 2)) {
        tun.moveUp();
      }
      tun.display();


      if (tun.ball.y > H) {
        window.cancelAnimationFrame(tun.hndl);
        tun.gameover(score.total);
	sounds.play('GameOver');
      }
      hndl = window.requestAnimationFrame(loop);
}
    
