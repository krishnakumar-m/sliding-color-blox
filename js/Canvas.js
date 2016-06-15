
function Canvas(cvsid,w,h) {
	this.cvs = document.getElementById(cvsid);
	this.ctx = this.cvs.getContext('2d');
	this.width = this.cvs.width = w || 0;
	this.height = this.cvs.height = h || 0;
}

Canvas.prototype.rect = function(x,y,w,h,strokeStyle,fillStyle) {
	var ctx = this.ctx;
	ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
	if(fillStyle) {
	    ctx.fillStyle = fillStyle;
            ctx.fill();
	}
	if(strokeStyle) {
	    ctx.strokeStyle = strokeStyle;
	    ctx.stroke();
	}
};
 Canvas.prototype.circle = function(x,y,r,strokeStyle,fillStyle) {
	var ctx = this.ctx;
	ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.closePath();
	if(fillStyle) {
	    ctx.fillStyle = fillStyle;
            ctx.fill();
	}
	if(strokeStyle) {
	    ctx.strokeStyle = strokeStyle;
	    ctx.stroke();
	}
};
Canvas.prototype.clear = function() {
	this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);
};
Canvas.prototype.text = function(txt,x,y,style,font) {
	this.ctx.fillStyle = style;
	this.ctx.font=font;
	this.ctx.fillText(txt,x,y);
};

Canvas.prototype.roundRect = function(x, y, width, height, radius, fill, stroke) {

  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  this.ctx.beginPath();
  this.ctx.moveTo(x + radius.tl, y);
  this.ctx.lineTo(x + width - radius.tr, y);
  this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  this.ctx.lineTo(x + width, y + height - radius.br);
  this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  this.ctx.lineTo(x + radius.bl, y + height);
  this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  this.ctx.lineTo(x, y + radius.tl);
  this.ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  this.ctx.closePath();
  if (fill) {
    this.ctx.fillStyle = fill;
    this.ctx.fill();
  }
  if (stroke) {
    this.ctx.strokeStyle = fill;
    this.ctx.stroke();
  }

};
