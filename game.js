
		var x = document.getElementById("myAudio");
		function playAudio()
{
     x.play();
}

function pauseAudio()
{
    x.pause();
}
			function imggroup(){
				pig.Graphiclist.apply(this) ;
				
				// this.push(new pig.Image(0,0,"gezi2.png"));
				// this.push(new pig.Image(0,0,"gezi1.png"));
				this.push(new pig.Image(0,0,"images/gezi.png"));
				this.push(new pig.Image(0,0,"images/gezi.png"));
				this.push(new jinbi(0,0));
				this.push(new pig.Image(0,0,"images/huaji.png"));
				this.push(new pig.Image(0,0,"images/start.png"));
				this.x=0;
				this.y=0;
				this.flag=0;
				this.scores=0;
				this.time=[];

				

				this.keyDown = function(key) {

					switch(key) {
						case pig.key.LEFT: this.x-=160; break ;
						case pig.key.RIGHT:this.x+=160 ; break ;
						case pig.key.UP: this.y-=160; break ;
						case pig.key.DOWN: this.y+=160; break ;
						case pig.key.A:
						{
							playAudio();
							this.remove_number1(4);
							this.time=starttime();
							document.getElementById("time1").innerHTML=0;
							document.getElementById("scores").innerHTML=0;

							this.flag=1;
							do{


							this.cx=(Math.floor(Math.random()*8))*160;
    						this.cy=(Math.floor(Math.random()*4))*160;
    					}while(this.cx==0&&this.cy==0);
    						this.remove_number(2,new jinbi(this.cx,this.cy));
    						this.remove_number(1,new pig.Image(this.cx,this.cy,"images/chukou1.png"));

						}
						break;

						default: break ;
					}
					if(!this.flag)
					{	
						this.x=0;
						this.y=0;
					}
					else if(this.flag==1)
					{	
						if(this.x<0)
							this.x=0;
						if(this.x>1120)
							this.x=1120;
						if(this.y<0)
							this.y=0;
						if(this.y>480)
							this.y=480;
						if(this.x==this.cx&&this.y==this.cy)
						{
							this.place_thelast([this.x,this.y]);
							//var r=confirm("过第一关了！");
								do{
							this.cx=(Math.floor(Math.random()*8))*160;
    						this.cy=(Math.floor(Math.random()*4))*160;
    					}while(this.cx==0&&this.cy==0);
							this.remove_number(2,new jinbi(this.cx,this.cy));

    						this.remove_number(1, new pig.Image(this.cx,this.cy,"images/chukou2.png"));

							this.flag=2;
						}
						
					}
					else if(this.flag==2)
					{	
						if(this.x<0)
							this.x=0;
						if(this.x>1120)
							this.x=1120;
						if(this.y<0)
							this.y=0;
						if(this.y>480)
							this.y=480;
						if(this.x==this.cx&&this.y==this.cy)
						{
							this.place_thelast([this.x,this.y]);
							//var r=confirm("过第二关了！");
								do{
							this.cx=(Math.floor(Math.random()*8))*160;
    						this.cy=(Math.floor(Math.random()*4))*160;
    					}while(this.cx==0&&this.cy==0);
							this.remove_number(2,new jinbi(this.cx,this.cy));

    						this.remove_number(1, new pig.Image(this.cx,this.cy,"images/chukou3.png"));


							this.flag=3;


						}


					}
					else if(this.flag==3)
					{
						if(this.x<0)
							this.x=0;
						if(this.x>1120)
							this.x=1120;
						if(this.y<0)
							this.y=0;
						if(this.y>480)
							this.y=480;
						if(this.x==this.cx&&this.y==this.cy)
						{
							this.place_thelast([this.x,this.y]);
							//var r=confirm("过第二关了！");
							gequ("audio/tongguan.ogg");
							pauseAudio();
							this.endtime=startTime();
						var time=(this.endtime[1]-this.time[1])*60+(this.endtime[2]-this.time[2]);
						document.getElementById("time1").innerHTML=time;
							this.flag=4;

						}
					}
					else if(this.flag==4)
					{
						

						pig.world.remove(this);
						gengxin();
					}
					else {
						this.x=0;
						this.y=0;
					}

					this.place_thelast([this.x,this.y]);
					if(this.compare_jinbi(2,this.x,this.y))
					{	
						gequ("audio/jinbi.ogg");
						this.scores=this.scores+1;
						document.getElementById("scores").innerHTML=this.scores;
					}
				}

			};
			function  jishi(time){
				this.time=time;
				this.time++;
			};
			function gequ(sound){
				pig.Sfx.apply(this);
				this.sound =new pig.Sfx(sound);
				this.sound.play();

			};

			function gengxin() {
			pig.setWorld.apply(this); 
			pig._nextWorld = pig.world.add(new imggroup());
};


			function jinbi(cx,cy){
		var jin_mine= new Array();				//先声明一维数组
    	this.x=0;
    	this.y=0;
    	this.cx=cx;
    	this.cy=cy;
    	pig.Graphiclist.apply(this);
    	for(var i=0;i<8;i++)
    	{
    		for(var j=0;j<4;j++)
    		{
    			this.x=i*160;
    			this.y=j*160;
    			if((this.x!=this.cx&&this.y!=this.cy)&&(this.x+this.y))
    			{

    				if(Math.floor(Math.random()*3)==2)
    				
    					this.push(new pig.Image(this.x,this.y,"images/jinbi.png"));
    			}

    		}
    	}
    		
    };

    function startTime(){
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();// 在小于10的数字前加一个‘0’
	m=checkTime(m);
	s=checkTime(s);
	document.getElementById('time2').innerHTML=h+":"+m+":"+s;
	t=setTimeout(function(){startTime()},500);
	return [h,m,s];
}
function backmusic(sound){
		pig.Sfx.apply(this);
		this.sound =new pig.Sfx(sound);
		this.sound.play();

}

function starttime(){
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();// 在小于10的数字前加一个‘0’
	m=checkTime(m);
	s=checkTime(s);
	return [h,m,s];

}

function checkTime(i){
	if (i<10){
		i="0" + i;
	}
	return i;
};


			function main() {
				
				pig.init('pig-canvas') ;
				pig.world.add(new imggroup());

				startTime();
				pig.run();
			};

