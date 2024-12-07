pig = {
	canvas: null,//canvs 画布
	context: null,
	images: {},
	audio: {},//音频
	world: null,
	mouse: {x: undefined, y: undefined, pressed: false},//鼠标相关
	offset: [0, 0],
	fps: 60,//fps刷新频率
	audioChannels: [],//音频数组
	keysPressed: [],//按键输入
	maxFrameTime: 0.030,
}

pig.init = function(canvas_id) {//初始化
	canvas = document.getElementById(canvas_id) ;//图形容器 脚本操作
	this.canvas = canvas ;
	this.context = canvas.getContext('2d'); 
	//getContext("2d") 对象是内建的 HTML5 对象，
	//拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。
	this.world = new pig.World() ;//含添加实体，操作平台 the-world???
	this.canvas.onmousedown = pig._canvasMouseDown ;
	//onmousedown 事件会在鼠标按键被按下时发生。
	//<p onmousedown="myFunction()">Click the text!</p>
	document.onkeydown = pig.keyDown ;//具体的键盘按下事件
	document.onkeyup = pig.keyUp ;//具体的键盘抬起事件
	this.canvas.onmousemove = pig.mouseMove ;
	//在鼠标指针移到指定的元素后执行Javascript代码：
	//<div onmousemove="myFunction()">鼠标指针移动到这。</div>
	this.canvas.onmouseout = pig.mouseOut ;
	//在鼠标指针移出指定的对象时执行Javascript代码:
	//<img onmouseout="normalImg(this)" src="smiley.gif" alt="Smiley">

	if (document.defaultView && document.defaultView.getComputedStyle) {
		var paddingLeft = +(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'])      || 0 ;
		var paddingTop  = +(document.defaultView.getComputedStyle(canvas, null)['paddingTop'])       || 0 ;
		var borderLeft  = +(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'])  || 0 ;
		var borderTop   = +(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'])   || 0 ;
		pig.offset = [paddingLeft + borderLeft, paddingTop + borderTop] ;//框架大小
	}
	// var win = document.defaultView; 
	// 在浏览器中，该属性返回当前 document 对象所关联的 window 对象，如果没有，会返回 null。
	//getComputedStyle 返回的对象是 CSSStyleDeclaration 类型的对象。
	//https://www.runoob.com/w3cnote/window-getcomputedstyle-method.html
	pig.canvas.width = pig.canvas.clientWidth ;//宽度+左右边框
	pig.canvas.height = pig.canvas.clientHeight ;//高度+上下边框
//https://blog.csdn.net/qq_42089654/article/details/80515916
	this.camera = {x:0, y:0} ;//相机？？---what
} ;
//*********************单独的功能****************
//一、图片加载
//1.弹出错误提示
pig.imageError = function(url) {
	alert("Could not load " + url + ".") ;
} ;
//2.加载图片
pig.loadImage = function(url) {
	if(url in this.images)
		return this.images[url] ;
	var i = new Image() ;
	i.src = url ;
	i.onload = function() { i.valid = true ; }
	i.onerror = function() { i.valid = false ; pig.imageError(i.src) ; } ;
	this.images[url] = i ;
	return i ;
} ;
//二、音频加载
pig.loadAudio = function(url) {
	var channel = null ;
	//数组多个加载
	for(var a = 0; a < this.audioChannels.length; ++a) {// ++ i 是先加后赋值;i ++ 是先赋值后加
		channel = this.audioChannels[a] ;
		if(channel.ended) {
			//查看音频是否播放结束：
			//var x = document.getElementById("myAudio").ended;
			//js中音频的相关属性：https://www.runoob.com/jsref/dom-obj-audio.html
			channel.pause() ;//音频文件的暂停
			channel.currentTime = 0 ;
			channel.src = url ;
			return channel ;
		}
	}
	//单个音频加载
	channel = new Audio(url) ;
	this.audioChannels.push(channel) ;
	return channel ;
} ;

pig._mousePosition = function(e) {//鼠标的位置--此具体代码未懂
	var ox = 0 ;
	var oy = 0 ;
	var element = pig.canvas ;
	if (element.offsetParent) {
//https://www.runoob.com/jquery/traversing-offsetparent.html
//offsetParent() 方法返回第一个被定位的父元素。
//提示：元素可通过 jQuery 或 CSS 的 position 属性（relative、absolute 或 fixed）来定位。
		do {
			ox += element.offsetLeft;
			oy += element.offsetTop;
		} while ((element = element.parent)) ;
	}
	var mp = [e.pageX - ox + pig.offset[0], e.pageY - oy + pig.offset[1]] ;
	return mp ;
} ;
//等待重写的方法-鼠标-按键系列
pig._canvasMouseDown = function(event) {
	event.preventDefault() ;
	//event.preventDefault() 方法阻止元素发生默认的行为。
	pig.mouseDown() ;
} ;

pig.keyDown = function(event) {
	if(!pig.keysPressed[event.keyCode]) {
		pig.keysPressed[event.keyCode] = true ;
		pig.world.keyDown(event.keyCode) ;
	}
} ;

pig.keyUp = function(event) {
	pig.keysPressed[event.keyCode] = false ;
	pig.world.keyUp(event.keyCode) ;
} ;

pig.mouseDown = function() {
	pig.world.mouseDown() ;
	pig.mouse.pressed = true ;
} ;

pig.mouseMove = function(event) {
	var mousePos = pig._mousePosition(event) ;
	pig.mouse.x = mousePos[0] ;
	pig.mouse.y = mousePos[1] ;
} ;

pig.mouseOut = function(event) {
	pig.mouse.x = undefined ;
	pig.mouse.y = undefined ;
};
//播放音频？sfx
pig.playSfx = function(url) {
	new pig.Sfx(url).play() ;
};
//程序运行
pig.run = function() {
	var dtime = 1000 / pig.fps ;
	pig.time = Date.now() ;//读取目前的时间
	setInterval(pig.update, dtime) ;
	//每三秒（3000 毫秒）弹出 "Hello" :
//setInterval(function(){ alert("Hello"); }, 3000);
} ;

//设置背景
pig.setBackground = function(url) {
	pig.canvas.style.backgroundImage = 'url(' + url + ')' ;
	pig.context.clearRect(0, 0, pig.canvas.width, pig.canvas.height) ;
} ;

//
pig.setWorld = function(world) {
	pig._nextWorld = world;
};

pig.update = function() {
	var dtime = (Date.now() - pig.time) / 1000 ;
	if(dtime > pig.maxFrameTime)//框架最大刷新时间，这里不知何意思，dtime给了谁？
		dtime = pig.maxFrameTime;
	pig.time = Date.now();
	pig.world.update(dtime);//单个对象刷新
	pig.context.clearRect(0, 0, pig.canvas.width, pig.canvas.height);//清除画布
	pig.world.draw();
	pig.mouse.pressed = false;
	if(pig._nextWorld) {//新的world更新交替
		pig.world = pig._nextWorld;
		pig._nextWorld = null;
	}
};

//对象定义-未懂
pig.Object = function() {
	this.clone = function() {
		var f = function() {} ;
		f.prototype = this ;
		//prototype 属性允许您向对象添加属性和方法
//注意： Prototype 是全局属性，适用于所有的 Javascript 对象。
		var o = new f() ;
		return o ;
	} ;

	this.extend = function(data) {
		var o = this.clone() ;
		for(var k in data) {
			o[k] = data[k] ;
		}
		return o ;
	} ;
} ;

pig.Collision = function(other, rect) {
	this.other = other;
	this.rect = rect;
} ;

pig.World = function() {
	pig.Object.apply(this) ;

	this.entities = [] ;
	this.removed = [] ;
	this.maxID = 0 ;



	this.draw = function() {
		this.entities.sort(function(lhs, rhs) {
			if(!lhs.graphic)
				return -1 ;
			if(!rhs.graphic)
				return 1 ;
			if(lhs.graphic.z == rhs.graphic.z)
				return lhs.id - rhs.id ;
			return lhs.graphic.z - rhs.graphic.z ;
		}) ;
		for(var e = 0 ; e < this.entities.length; ++e) {
			this.entities[e].draw() ;
		}
	} ;

	this.filter = function(f) {
		var l = [] ;
		for(var e = 0; e < this.entities.length; ++e) {
			if(f(this.entities[e])) {
				l.push(this.entities[e]) ;
			}
		}
		return l ;
	} ;

	this.getType = function(type) {
		return this.filter(function(e) { return e.type == type ; }) ;
	} ;

	this.keyDown = function(key) {
		for(var e = this.entities.length-1; e >= 0; --e) {
			if(this.entities[e].keyDown(key))
				return ;
		}
	} ;

	this.keyUp = function(key) {
		for(var e = this.entities.length-1; e >= 0; --e) {
			if(this.entities[e].keyUp(key))
				return ;
		}
	} ;

	this.mouseDown = function() {
		for(var e = this.entities.length-1; e >= 0; --e) {
			if(this.entities[e].mouseDown())
				return ;
		}
	} ;
// 	this.entities = [] ;
//	this.removed = [] ;
	// this.maxID = 0 ;
	this.remove = function(e) {
		//e.removed() ;
		this.removed.push(e) ;
	} ;
	this.add = function(e) {
		this.entities.push(e) ;
		e.id = this.maxID++ ;
		e.world = this ;
		//e.added() ;
	} ;
	//新的方法 删除world数组里的最后一个值
this.remove_thelast=function(){
	if(this.maxID)
	{
		this.entities.pop();
		this.maxID--;
		

	}
};	

	this._update = function(dtime) {
		for(var e = 0; e < this.entities.length; ++e) {
			if(this.entities[e].graphic)
				this.entities[e].graphic.update(dtime) ;
			this.entities[e].update(dtime) ;
		}
		for(var r = 0; r < this.removed.length; ++r) {
			for(var e = 0; e < this.entities.length; ++e) {
				if(this.entities[e] == this.removed[r])
					this.entities.splice(e, 1) ;
			}
		}
		this.removed = [] ;
	} ;

	this.update = function(dtime) { this._update(dtime) ; } ;

	this.collide = function(rect)  {

		var collisions = Array();

		for (var i = 0; i < this.entities.length; i++)
		{
			var e = this.entities[i];
			if (e.graphic == null)
				continue;
			var entRect = new pig.Rect(e.graphic.x,e.graphic.y,e.graphic.w,e.graphic.h);
			if (rect.collideRect(entRect))
				collisions.push(new pig.Collision(e,entRect));
		}

		return collisions;
	} ;
}

pig.Entity = function() {
	pig.Object.apply(this) ;

	this.graphic = null ;
	this.type = "entity" ;

	this.world = null ;

	this.added = function() {} ;

	this.collide = function(rect) {
		return false ;
	} ;

	this.draw = function() {
		if(this.graphic && this.graphic.visible != false)
			this.graphic.draw() ;
	} ;

	this.keyDown = function(key) {} ;

	this.keyUp = function(key) {} ;

	this.mouseDown = function() {} ;

	this.removed = function() {} ;

	this.update = function(dtime) {} ;
}

pig.Graphic = function() {
	this.x = 0 ;
	this.y = 0 ;
	this.z = 0 ;
	this.visible = true;

	this.draw = function() {} ;

	this.update = function(dtime) {} ;
} ;

pig.Rect = function(x, y, w, h) {
	//rect() 方法创建矩形。(javascript)
	
	pig.Object.apply(this) ;
	this.x = x ;
	this.y = y ;
	this.w = w ;
	this.h = h ;

	this.bottom = function() { return this.y + this.h ; } ;

	this.collidePoint = function(point) {//用于收集所选择区域内的点击---audio(demo)
		return (
			point[0] >= this.x &&
			point[0] <  this.x + this.w &&
			point[1] >= this.y &&
			point[1] <  this.y + this.h
		) ;
	} ;

	this.collideRect = function(rect) {//判断矩形是否在内
		if(this.x > rect.x + rect.w)
			return false ;
		if(rect.x > this.x + this.w)
			return false ;
		if(this.y > rect.y + rect.h)
			return false ;
		if(rect.y > this.y + this.h)
			return false ;
		return true ;
	} ;
	
	this.intersects = function(rect) {
		return this.collideRect(rect);
	};

	this.left = function() { return this.x ; } ;

	this.place = function(pos) {
		this.x = pos[0] ;
		this.y = pos[1] ;
	} ;

	this.right = function() { return this.x + this.w ; } ;

	this.top = function() { return this.y ; } ;
}

pig.Circle = function(x, y, radius) {//画圆
	pig.Object.apply(this) ;

	this.x = x ;
	this.y = y ;
	this.radius = radius ;

	this.collideCircle = function(circle) {//圆在规定圆内，返回ture 否则false
		var dx = this.x - circle.x ;
		var dy = this.y - circle.y ;
		var sqDistance = dx*dx + dy*dy ;

		var r = this.radius + circle.radius ;
		var collide = (sqDistance <= r*r) ;
		return collide ;
	} ;

	this.collidePoint = function(point) {//点在规定圆内，返回ture 否则false
		var d = [point[0] - this.x, point[1] - this.y] ;
		return (d[0]*d[0] + d[1]*d[1] <= this.radius*this.radius) ;
	} ;

	this.place = function(pos) {//圆心位置
		this.x = pos[0] ;
		this.y = pos[1] ;
	} ;
} ;

pig.Graphiclist = function(graphics) {//图像数组
	pig.Graphic.apply(this) ;
	//新的单一图片

	this.graphics = graphics || [] ;

	this.draw = function() {
		pig.context.save() ;
		//save() 方法把当前状态的一份拷贝压入到一个保存图像状态的栈中。
		//这就允许您临时地改变图像状态，
		//然后，通过调用 restore() 来恢复以前的值。
		//pig.context.translate(this.x, this.y) ;
		//这条一开所有图片元素的起始点都会变化
		//translate() 方法为画布的变换矩阵添加水平的和垂直的偏移。
		//参数 dx 和 dy 添加给后续定义路径中的所有点。
		for(var g = 0; g < this.graphics.length; ++g) {
			this.graphics[g].draw() ;
		}
		pig.context.restore() ;
	};

	this.pop = function() {//删除存储的最后一个图片
		this.graphics.pop() ;
	};
	this.push = function(graphic) {//压入新的图片
		this.graphics.push(graphic) ;
	};
	
	this.move = function(dx, dy) {//移动图片的位置
		this.x += dx;
		this.y += dy;
		for(i=0;i<this.graphics.length;++i) {
			this.graphics[i].x += dx;
			this.graphics[i].y += dy;
		}
	};
	this.move_thelast=function(dx,dy){
			this.graphics[this.graphics.length-1].x += dx;
			this.graphics[this.graphics.length-1].y += dy;

	};
	
	this.place = function(pos) {
		var dx = pos[0]-this.x;
		var dy = pos[1]-this.y;
		this.move(dx, dy);
	};
	this.place_thelast=function(pos)
	{
		var dx = pos[0]-this.graphics[this.graphics.length-1].x;
		var dy = pos[1]-this.graphics[this.graphics.length-1].y;
		this.move_thelast(dx, dy);

	};

	this.remove = function(graphic) {
		for(var g = 0; g < this.graphics.length; ++g) {
			if(this.graphics[g] == graphic)
				this.graphics=this.graphics.slice(g) ;
			//slice 不会修改原数组，
			//只会返回一个浅复制了原数组中的元素的一个新数组。原数组的元素会按照下述规则拷贝：
			//https://www.runoob.com/jsref/jsref-slice-array.html
		}
	};
	//splice 才会修改数组
	this.remove_number=function(index,new_ditu){
		if(index<this.graphics.length)
			this.graphics.splice(index,1,new_ditu);
	}
	this.remove_number1=function(index){
		if(index<this.graphics.length)
			this.graphics.splice(index,1);
	}
	this.compare_jinbi=function(jinbizu_index,x,y){
		this.x=x;
		this.y=y;
		this.graphics[jinbizu_index].graphics.length;
		for(var i=0;i<this.graphics[jinbizu_index].graphics.length;i++)
		{
			if(this.graphics[jinbizu_index].graphics[i].x==this.x&&
				this.graphics[jinbizu_index].graphics[i].y==this.y)
				{
					this.graphics[jinbizu_index].graphics.splice(i,1);
					return 1;
				}

			
		}
				return 0;
 
	};

	this.shift = function() {
		this.graphics.shift() ;
		//shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
	};

	this.unshift = function(graphic) {
		this.graphics.unshift(graphic) ;
		//unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
	};

	this.update = function(dtime) {
		for(var g = 0; g < this.graphics.length; ++g) {
			this.graphics[g].update(dtime) ;//更新图片数组 update()???
		}
	};
	this.keyDown = function(key) {} ;

	this.keyUp = function(key) {} ;

	this.mouseDown = function() {} ;

};

pig.Canvas = function(x, y, w, h) {
	pig.Graphic.apply(this) ;

	this.x = x ;
	this.y = y ;
	this.w = w ;
	this.h = h  ;
	this.alpha = 1 ;//角度

	this.canvas = document.createElement('canvas') ;
	this.canvas.width = w ;
	this.canvas.height = h ;
	this.context = this.canvas.getContext('2d') ;

	this.draw = function() {
		pig.context.save() ;
		pig.context.globalAlpha = this.alpha ;

		if(this.ignoreCamera)
			pig.context.translate(Math.floor(this.x), Math.floor(this.y)) ;
		else
			pig.context.translate(Math.floor(this.x + pig.camera.x), Math.floor(this.y + pig.camera.y)) ;

		pig.context.drawImage(this.canvas, 0, 0) ;
		pig.context.restore() ;
	};

	this.update = function(dtime) {
		pig.context.clearRect(Math.floor(this.x - 1), Math.floor(this.y - 1), Math.floor(this.width + 1), Math.floor(this.height + 1)) ;
	}
} ;

pig.Canvas.createRect = function(x, y, w, h, colour) {
	var c = new pig.Canvas(x, y, w, h) ;
	c.context.fillStyle = colour ;
	c.context.fillRect(0, 0, w, h) ;
	return c ;
};

pig.Image = function(x, y, image) {
	pig.Graphic.apply(this) ;//定义图片为Graphic对象

	this._x = x ;
	this._y = y ;
	this.x = x ;
	this.y = y ;
	this.alpha = 1 ;

	if(!image)
		throw 'Image not specified.' ;

	this.image = pig.loadImage(image) ;

	this.draw = function() {
		if(!this.image.valid) return ;

		pig.context.save() ;
		pig.context.globalAlpha = this.alpha ;
		if(this.ignoreCamera)//根据视觉相机变化-6666
			pig.context.translate(Math.floor(this._x), Math.floor(this._y)) ;//向下取整
		else
			pig.context.translate(Math.floor(this._x + pig.camera.x), Math.floor(this._y + pig.camera.y)) ;
		pig.context.drawImage(this.image, 0, 0) ;
		pig.context.globalAlpha = 1 ;
		pig.context.restore() ;
	};

	this.place = function(pos) {
		this.x = pos[0] ;
		this.y = pos[1] ;
	};

	this.update = function(dtime) {
		pig.context.save() ;
		if(this.ignoreCamera)
			pig.context.translate(Math.floor(this._x), Math.floor(this._y)) ;
		else
			pig.context.translate(Math.floor(this._x + pig.camera.x), Math.floor(this._y + pig.camera.y)) ;
		pig.context.clearRect(0, 0, Math.round(this.width), Math.round(this.height)) ;
		pig.context.restore() ;
		this._x = this.x ;
		this._y = this.y ;
		this.width = this.image.width ;
		this.height = this.image.height ;
	};
};

pig.Sprite = function(x, y, image, frameW, frameH) {//运动的物体--important
	pig.Graphic.apply(this) ;

	this._x = x ;
	this._y = y ;
	this.x = x ;
	this.y = y ;
	this.origin = [0, 0] ;
	this.scale = 1 ;
	this.image = pig.loadImage(image) ;
	this.frame = 0 ;
	this.animations = {} ;
	this.animation = null ;
	this.fps = 0 ;
	this.time = 0 ;
	this.frameWidth = frameW ;
	this.frameHeight = frameH ;
	this.flip = false ;
	this.alpha = 1 ;
	this.angle = 0;

	this.add = function(animation, frames) {
		this.animations[animation] = frames ;
	} ;

	this.draw = function() {
		if(this.image.valid) {
			var fx = 0 ;
			var fy = 0 ;
			var ox = 0 ;
			var oy = 0 ;
			if(this.animation) {
				var frame = this.animation[this.frame] ;
				var rowLength = Math.floor(this.image.width / this.frameWidth) ;
				fx = (frame % rowLength) * this.frameWidth ;
				fy = Math.floor(frame / rowLength) * this.frameHeight ;
			}
			pig.context.save() ;
			pig.context.globalAlpha = this.alpha ;			
		
			this._x = this.x; this._y = this.y;
			if(this.ignoreCamera)
				pig.context.translate(Math.floor(this._x), Math.floor(this._y)) ;
			else
				pig.context.translate(Math.floor(this._x + pig.camera.x), Math.floor(this._y + pig.camera.y)) ;
			
			var midPointX =  this.w*0.5;
			var midPointY =  this.h*0.5;				
				
			pig.context.translate(midPointX, midPointY);
			pig.context.rotate(this.angle);
			pig.context.translate(-midPointX, -midPointY);
			
			if(this.flip) {
				pig.context.scale(-1, 1) ;
				pig.context.translate(-this.frameWidth, 0) ;
			}
			pig.context.drawImage(this.image, fx, fy, this.frameWidth, this.frameHeight, ox, oy, Math.floor(this.frameWidth * this.scale), Math.floor(this.frameHeight * this.scale)) ;
			pig.context.globalAlpha = 1 ;
			pig.context.restore() ;
		}
	} ;

	this.place = function(pos) {
		this.x = pos[0] ;
		this.y = pos[1] ;
	} ;

	this.play = function(animation, fps, loop) {
		this.animation = this.animations[animation] ;
		this.playing = animation;
		this.fps = fps;
		this.frame = 0;
		this.time = 0;
		this.loop = loop;
		if(loop == undefined)
			this.loop = true;
	};

	this.update = function(dtime) {
		pig.context.save() ;
		if(this.ignoreCamera)
			pig.context.translate(Math.floor(this._x), Math.floor(this._y)) ;
		else
			pig.context.translate(Math.floor(this._x + pig.camera.x), Math.floor(this._y + pig.camera.y)) ;
		pig.context.clearRect(0, 0, Math.floor(this.w), Math.floor(this.h)) ;
		pig.context.restore() ;
		this._x = this.x ;
		this._y = this.y ;
		this.w = this.frameWidth;
		this.h = this.frameHeight;
		this.time += dtime ;

		if(this.fps > 0 && this.time > 1 / this.fps) {
			++this.frame ;
			while(this.time > 1 / this.fps)
				this.time -= 1 / this.fps ;
			if(this.frame >= this.animation.length) {
				if(this.loop)
					this.frame -= this.animation.length;
				else
					this.frame = this.animation.length-1;
			}
		}
	} ;
} ;

pig.Tilemap = function(x, y, image, tw, th, gw, gh) {//见ISO.html中对网格的绘制
	pig.Graphic.apply(this) ;

	this.x = x ;
	this.y = y ;
	this.gridW = gw ;
	this.gridH = gh ;
	this.tileW = tw ;
	this.tileH = th ;

	this.image = pig.loadImage(image) ;
	this.canvas = null ;

	this.build = function() {
		this.canvas = new pig.Canvas(this.x, this.y, tw*gw, th*gh) ;
		//this.canvas = pig.Canvas.createRect(0, 0, tw*gw, th*gh, 'white') ;

		for(var y = 0; y < gh; ++y) {
			for(var x = 0; x < gw; ++x) {
				this.setTile(x, y, this.tile(x, y)) ;
			}
		}
	};

	this.draw = function() {
		if(this.canvas)
			this.canvas.draw() ;
	} ;

	this.tile = function(tx, ty) {
		if(tx < 0 || ty < 0 || tx >= this.gridW || ty >= this.gridH)
			return undefined ;
		return this.tiles[ty * this.gridW + tx] ;
	} ;

	this.setTile = function(tx, ty, tile) {
		if(tx < 0 || ty < 0 || tx >= this.gridW || ty >= this.gridH)
			return;
		this.tiles[ty * this.gridW + tx] = tile;
		
		var sheetW = Math.floor(this.image.width / this.tileW);
		var sheetH = Math.floor(this.image.height / this.tileH);
		var col = (tile-1) % (sheetW);
		var row = Math.floor((tile-1) / sheetW);

		if(this.canvas) {
			var sourceX = col * this.tileW;
			var sourceY = row * this.tileH;

			var destX = tx * this.tileW;
			var destY = ty * this.tileH;

			this.canvas.context.clearRect(destX, destY, this.tileW, this.tileH);
			this.canvas.context.drawImage(this.image, sourceX, sourceY, this.tileW, this.tileH, destX, destY, this.tileW, this.tileH);
		}
	};

	this.tiles = [] ;
	for(var y = 0; y < gh; ++y) {
		for(var x = 0; x < gw; ++x) {
			this.tiles.push(0) ;
		}
	}

	this.update = function(dtime) {
		pig.context.clearRect(Math.floor(this.x - 1), Math.floor(this.y - 1), Math.floor(this.width + 1), Math.floor(this.height + 1)) ;
		if(!this.canvas && this.image.valid) {
			this.build() ;
		}
	};
}

pig.Text = function(x, y, text, font, colour, size) {
	pig.Graphic.apply(this) ;
	this.x = x ;
	this.y = y ;
	this.text = text ;
	this.font = font || "sans" ;
	this.colour = colour || "white" ;
	this.size = size || 14 ;

	pig.context.textBaseline = 'top' ;
	pig.context.font = this.size + "px " + this.font ;
	pig.context.fillStyle = this.colour ;
	this.width = pig.context.measureText(text).width ;
	this.height = this.size ;

	this.draw = function() {
		this.width = pig.context.measureText(this.text).width ;
		pig.context.textBaseline = 'top' ;
		pig.context.font = this.size + "px " + this.font ;
		pig.context.fillStyle = this.colour ;
		pig.context.fillText(this.text, this.x, this.y) ;
	};

	this.update = function(time) {
		pig.context.clearRect(Math.floor(this.x - 1), Math.floor(this.y - 1), Math.floor(this.width + 1), Math.floor(this.height + 1)) ;

	};
} ;

pig.Sfx = function(sound) {
	pig.Object.apply(this) ;

	this.play = function() {
		this.sound = pig.loadAudio(sound) ;
		this.sound.play() ;
	}
};

pig.key = {
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,

	ZERO:  48,
	ONE:   49,
	TWO:   50,
	THREE: 51,
	FOUR:  52,
	FIVE:  53,
	SIX:   54,
	SEVEN: 55,
	EIGHT: 56,
	NINE:  57,

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	
	SPACE: 32
};
pig.version = 0.2 ;
