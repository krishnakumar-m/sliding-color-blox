var colors = {
    'V' : 'violet',
    'G':'green',
    'R':'red',
    'B':'blue',
    'Y':'yellow',
    'O':'orange',
    'I':'indigo',
    'W':'white',
    '#':'brown',
    '<':'brown',
    '>':'brown'
    };

var colorMaster = ['V','I','B','G','Y','O','R'];

var score = {
    multiplier : 0,
    block : 10,
    minus : -1,
    total : 0
};

var tun = {
    bottom : 0,
    width : 21,
    height : 12,
    distance : 20,
    nel : [],
    dontmove :false,
    init : function()
	{
	    /*this.cvs = document.getElementById('test');
	     this.ctx = this.cvs.getContext('2d');*/
	    this.generate();
	    this.display();
	    bindEvents();
	    var self = this;
	    var hndl = window.setInterval(function()
		{
		    if(self.dontmove) {
			return;
		    }
		    self.collisionCheck();
		    self.display();
		    if (ball.y > (self.bottom + self.height / 2))
			{
			    self.slideUp();
			}
		    if (ball.y <= self.bottom)
			{
			    window.clearInterval(hndl);
			}
		},1000);
	},
    generate : function()
	{

	    for (var i=0;i < this.height;i++)
		{
		    this.nel.push(this.generateRow(i));
		}
	},

    slideUp : function()
	{
	    this.bottom++;
	    this.nel.push(this.generateRow(this.height + this.bottom - 1));
	    this.nel.shift();
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
			    score.multiplier = score.multiplier+ball.dy;
			    if(score.multiplier<0) {
				score.multiplier = 0;
			    }
			    score.total+=score.block*score.multiplier;
			    if(score.total<0) {
				score.total = 0;
			    }
			    document.getElementById('score').innerHTML=score.total;
			}
		    else
			{
			    //ball.color = thisBlock;
			    ball.color = this.nel[ballNextY - this.bottom].charAt(ball.x);
			    ball.bounceY();
			    score.total+=score.minus;
			     if(score.total<0) {
				score.total = 0;
			    }
			    document.getElementById('score').innerHTML=score.total;
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
	}

    };

var ball = {
    x : 10,
    y : 3,
    dx : -1,
    dy : 1,
    move : function()
	{
	    this.x += this.dx;
	    this.y += this.dy;
	},
    bounceX : function()
	{
	    this.dx *= -1;
	},
    bounceY : function()
	{
	    this.dy *= -1;
	},
    color : 'W',
    display : function()
	{
	    var ypos = (tun.top - y + 1) * 5;
	    var xpos = x * 5;
	    tun.ctx.fillStyle = colors[this.color];
	    tun.ctx.fillArc(xpos, ypos, 10);
	}
    };

tun.display2 = function()
    {
	document.getElementById('tunnel').innerHTML = '';
	for (var i=this.height - 1;i >= 0;i--)
	    {
		var str ="";
		for (var j=0;j < this.width;j++)
		    {

			if (ball.x == j && ball.y == (tun.bottom + i))
			    {
				str += '<span class="ball" style="background-color:' + colors[ball.color] + '">&nbsp;</span>';
			    }
			else
			    {
				var ch = this.nel[i].charAt(j);
				if (ch == ' ')
				    {
					str += "&nbsp;";
				    }
				else
				    {
					var chr = '&nbsp;',clss=" ";
					if (ch == '<')
					    {
						chr = '<';
						clss = 'class="left" row=' + i;
					    }
					else if (ch == '>')
					    {
						chr = '>';
						clss = 'class="right" row=' + i;
					    }
					str += '<span ' + clss + ' style="color:black;background-color:' + colors[ch] + ';">' + chr + '</span>';
				    }
			    }
		    }
		document.getElementById('tunnel').innerHTML += (str + '\n');
	    }
	/*this.strokeStyle = 'red';
	 this.ctx.drawRect(0,0,this.width,this.height);*/

    };

tun.display = function()
    {
	document.getElementById('tunneltb').innerHTML = '';
	for (var i=this.height - 1;i >= 0;i--)
	    {
		var str ="<tr>";
		for (var j=0;j < this.width;j++)
		    {

			if (ball.x == j && ball.y == (tun.bottom + i))
			    {
				str += '<td class="ball" style="background-color:' + colors[ball.color] + '">&nbsp;</td>';
			    }
			else
			    {
				var ch = this.nel[i].charAt(j);
				if (ch == ' ')
				    {
					str += "<td>&nbsp;</td>";
				    }
				else
				    {
					var chr = '&nbsp;',clss=" ";
					if (ch == '<')
					    {
						chr = '<';
						clss = 'class="left" row=' + i;
					    }
					else if (ch == '>')
					    {
						chr = '>';
						clss = 'class="right" row=' + i;
					    }
					str += '<td ' + clss + ' style="color:black;background-color:' + colors[ch] + ';">' + chr + '</td>';
				    }
			    }
			    
		    }
		    str +='</tr>';
		document.getElementById('tunneltb').innerHTML += (str);
	    }
	/*this.strokeStyle = 'red';
	 this.ctx.drawRect(0,0,this.width,this.height);*/

    };
    
    
    
window.onerror = function(a, b, c, d, e)
    {
	alert([a,b,c,d,e].join(' '));
    };
function bindEvents()
    {

	document.getElementById('tunneltb').onclick = function(e)
	    {
		tun.dontmove = true;
		
		var moveLeft = e.clientX < window.innerWidth/2;
		if (ball.dy > 0)
		    {
			for (var y=ball.y;y < tun.height + tun.bottom;y++)
			    {
				var j = y - tun.bottom;
				var row = tun.nel[j];
				//strip left and right
				row = row.substring(1, tun.width - 1);
				if (!/^\s+$/.test(row))
				    {
					if (moveLeft)
					    {
						var leftChar =tun.nel[j].charAt(1);
						tun.nel[j] = '<' + tun.nel[j].substr(2, tun.width - 3) + leftChar + '>';
					    }
					else
					    {
						var rightChar =tun.nel[j].charAt(tun.width - 2);
						tun.nel[j] = '<' + rightChar + tun.nel[j].substr(1, tun.width - 3) + '>';
					    }
					break;
				    }
			    }
		    } else {
			for (var y=ball.y;y >= tun.bottom;y--)
			    {
				var j = y - tun.bottom;
				var row = tun.nel[j];
				//strip left and right
				row = row.substring(1, tun.width - 1);
				if (!/^\s+$/.test(row))
				    {
					if (moveLeft)
					    {
						var leftChar =tun.nel[j].charAt(1);
						tun.nel[j] = '<' + tun.nel[j].substr(2, tun.width - 3) + leftChar + '>';
					    }
					else
					    {
						var rightChar =tun.nel[j].charAt(tun.width - 2);
						tun.nel[j] = '<' + rightChar + tun.nel[j].substr(1, tun.width - 3) + '>';
					    }
					break;
				    }
			    }
		    }
		    tun.dontmove = false;
	    };

    }

function hasClass(elem, className)
    {
	return elem.className.split(' ').indexOf(className) > -1;
    }

