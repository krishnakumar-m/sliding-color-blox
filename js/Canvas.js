
function Canvas(cvsid,w,h) {
	this.cvs = document.getElementById(cvsid);
	this.ctx = this.cvs.getContext('2d');
	this.cvs.width = w || 0;
	this.cvs.height = h || 0;
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
Canvas.prototype.text = function(txt,x,y,style) {
	this.ctx.fillStyle = style;
	this.ctx.fillText(txt,x,y);
};
