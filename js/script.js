var canvas, context;
var imgPlayer1, imgPlayer2,imgPlayer3, imgPlayer4,imgStand;
var iCellWidth = 80;
var iCellHeight = 60;
var lock=false;//To lock movement
var cell=1;
var GameOver = false;
var turn = 1;//At starting 1st player's turn
var plcount=3;//Number of Players
var winp =new Array(0,0,0);//1 for win
var isSecondInstanceRunning = false;
var kk=0;
function Player(x,y,w,h,image,i,cell,inc,id,start,win)
	{
	this.x = x;//topleft corner x pixel of cell
    this.y = y;//topleft corner y pixel of cell
	this.cell = cell;//cell num 1 to 100
    this.w = iCellWidth;//Width of single cell
    this.h = iCellHeight;//Height of single cell
    this.i=i;// Image identity
    this.image = image;// Image
    this.inc=inc;//Type of Move
    this.id=id;// Player Id
    this.start=start;//identify start
    this.win=win;
    
	}
    //Ladder Starting and distance to ending point.
	var ladderstart =new Array(4,9,20,40,28,51,63);
	var ladderdest =new Array(14,31,38,59,84,67,81);
	
	//Snake Starting and distance to ending point.
	var snakestart =new Array(99,95,89,64,17);
	var snakedest =new Array(78,75,26,60,7);

// functions
function clear() { // clear canvas function
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function changeturn(turn,plcount,winp)
	{
		return(turn + 1)%plcount;
	}

function drawScene(id,r)
	{ // main drawScene function
    clear();
    context.save();
    context.restore();
    // Draw player 1to three and standing area
    context.drawImage(imgStand, 0, 0, 10*iCellWidth, iCellHeight, 0, 10*iCellHeight, 10*iCellWidth, iCellHeight);
	context.drawImage(oPlayer1.image, oPlayer1.i*iCellWidth, 0, oPlayer1.w, oPlayer1.h, oPlayer1.x, oPlayer1.y, oPlayer1.w, oPlayer1.h);
    context.drawImage(oPlayer2.image, oPlayer2.i*iCellWidth, 0, oPlayer2.w, oPlayer2.h, oPlayer2.x, oPlayer2.y, oPlayer2.w, oPlayer2.h);
    context.drawImage(oPlayer3.image, oPlayer3.i*iCellWidth, 0, oPlayer3.w, oPlayer3.h, oPlayer3.x, oPlayer3.y, oPlayer3.w, oPlayer3.h);
	
	context.font="20px Verdana";
	if(r!=0)
		{
		//Random number 
		context.fillText("player"+id.toString()+" : "+r.toString(),425,630);
		if(r%10 !=1)
			id=id%3+1;
		}
	context.font="30px Verdana";
	context.fillText("player"+id.toString()+" Turn ",600,630);//Turn of player
	
	}

function findxy(cell)
	{//find xycells  ie 1,1 to 10,10
	 // cell =100  return 1,1 ; cell=15 return 6,9
    var mod=cell%10;
    var di=parseInt(cell/10);
    if(di%2==1)
             {
			 if(mod!=0)
				xcell=11-mod;
			 else
			xcell=10; 
			}
	 else 
            {
			if(mod!=0)
				xcell=mod;
			else
			  xcell=1;
	   		}
	  var ycell= 10-parseInt((cell-1)/10);
        return [xcell,ycell];
       }
function meat(dest,turn)
	{// To find 2 players in same cell
	if(dest == oPlayer1.cell && dest !=100 && turn != oPlayer1.id%winp.length)
		{
		oPlayer1.start = 0;
		oPlayer1.cell = 0;
		oPlayer1.x = 0*iCellWidth;
		oPlayer1.y =10*iCellHeight
		return true;
		}
	else if(dest == oPlayer2.cell && dest !=100 && turn != oPlayer2.id%winp.length)
		{
		oPlayer2.start = 0;
		oPlayer2.cell = 0;
		oPlayer2.x = 1*iCellWidth;
		oPlayer2.y =10*iCellHeight
		return true;
		}
	else if(dest == oPlayer3.cell && dest !=100 && turn != oPlayer3.id%winp.length)
		{
		oPlayer3.start = 0;
		oPlayer3.cell = 0;
		oPlayer3.x = 2*iCellWidth;
		oPlayer3.y =10*iCellHeight
		return true;
		}
	return false;
	}
function delay(time)
	{//Time delay between two key board input 
	var del=setInterval(function()
		{
		time -= 1;
		if(time<=0){
			lock=false;
			clearInterval(del);
			}
		
		},300);
	
	}
function findmove(cell, xcell, ycell,Player)
	{//find xycell of next move
	if(cell%20>10)
		{ // if cuurent pos at 10-20,40-50,60-70 or 80-90
		xcell -= 1;
		Player.i = 1;//left pic
		}
	if(cell%20==0)
		{// if cuurent pos at 20,40,60 or 80
		ycell -= 1;
		Player.i = 2;//topright pic
		}
	else if(cell%20<10)
		{// if cuurent pos at 1-10,20-30,40-50,60-70 or 80-90
		xcell += 1;
		Player.i = 0;//right pic
		}
	else if(cell%10==0)
		{// if cuurent pos at 10,30,50,70 or 90
		ycell -= 1;
		Player.i = 3;//topleft pic
		}
	return [xcell,ycell];
	}
function move(r,Player)
	{//Move player pic according to random number
	i=0;
	var fire=setInterval(function()
		{
		
		kk +=1;
		isSecondInstanceRunning =true;
		cell=Player.cell;//To get current cell of player
		if(i<r)
			{//check complete the r movements
			i +=1;
			if(Player.inc==1)
				{//regular movement (1 cell in single step)
				Player.cell +=1;
				if(cell != 0)
					{//if player start game
					position = findxy(cell);
					x = position[0];
					y = position[1];
					cellposition = findmove(cell,x,y,Player);
					xcell = cellposition[0];
					ycell = cellposition[1];
					Player.y = iCellHeight*(ycell-1);
					Player.x = iCellWidth*(xcell-1);
					}
				else{//First move move to cell one
					Player.y = iCellHeight*9;
					Player.x = 0;
				}
				cell = Player.cell;
				drawScene(Player.id,r);
				 }
			else if(Player.inc>1)
				{//Ladder movement
				l=Player.inc;
				d=ladderdest[l-2];
				s=ladderstart[l-2];
				
				//To get starting position(x,y) of Ladder
				position = findxy(s);
				sx = position[0];
				sy = position[1];
				//To get destination position(x,y) of Ladder
				position = findxy(d);
				x = position[0];
				y = position[1];
				if(sx<x)
					Player.i = 2;//topright
				else
					Player.i = 3;//topleft
				dx = x*iCellWidth;
				dy = y*iCellHeight;
				//[sx,sy] = findxy(s);
				position = findxy(s);
				sx = position[0];
				sy = position[1];
				sx = sx*iCellWidth;
				sy = sy*iCellHeight;
				xcell=(dx-sx)/5;
				ycell=(dy-sy)/5;
				Player.x +=xcell;
				Player.y +=ycell
				if(Player.y <dy-48)
					{//Last movement
					drawScene(Player.id,11);
					Player.cell=d;
					Player.inc=1;	
					isSecondInstanceRunning=false;
					clearInterval(fire);
					
					}
				else
					drawScene(Player.id,11);
				
				}
			else if(Player.inc<1)
				{// snake
				l=Player.inc;
				d=snakedest[-(l+2)];
				s=snakestart[-(l+2)];
				//To get destination position(x,y) of Snake
				position = findxy(d);
				x = position[0];
				y = position[1];
				//To get starting position(x,y) of Snake
				position = findxy(s);
				sx = position[0];
				sy = position[1];
				if(sx<x)
					Player.i = 4;//bottomleft
				else
					Player.i = 5; //bottomright
				dx = x*iCellWidth;
				dy = y*iCellHeight;
				
				sx = sx*iCellWidth;
				sy = sy*iCellHeight;
				
				xcell=(dx-sx)/5;// X length in single movement
				ycell=(dy-sy)/5;// Y length in single movement
				Player.x +=xcell;
				Player.y +=ycell;
				if(Player.y >dy-72)
					{//Last movement
					drawScene(Player.id,0);
					Player.cell=d;
					Player.inc=1;
					isSecondInstanceRunning=false;
					clearInterval(fire);
					}
				else
				drawScene(Player.id,0);
				}
			}
		  else
				{//After reach destination, check it contain snake or ladder.
				for (k=0;k<ladderstart.length;k++)
					{//check current possition contain ladder
					li=ladderstart[k];
					if(li==Player.cell)
						{
						Player.inc=2+k;
						li=ladderdest[k];
						move(li,Player);
						isSecondInstanceRunning=false;
						clearInterval(fire);
						} 
					
					}
				for (k=0;k<snakestart.length;k++)
					{//check current possition contain snake
					li=snakestart[k];
					if(li==Player.cell)
						{
						Player.inc=-2-k;
						li=snakedest[k];
						move(li,Player);
						isSecondInstanceRunning=false;
						clearInterval(fire);
						} 
					}
			
			
			if(Player.cell==100)
						{//check game Complete
						Player.i = 6; //win
						Player.win= 1;
						drawScene(Player.id,r);
						isSecondInstanceRunning=false;
						clearInterval(fire);
						}
			else{
				isSecondInstanceRunning=false;
				clearInterval(fire);}
			}
		
		},300);	
		//alert(fire);
		
		//alert(fire-kk);
		
  }
 
function start()
	{
    
   
    canvas = document.getElementById('scene');
    context = canvas.getContext('2d');
    
    //Image object for players and stand
    imgPlayer1 = new Image();
    imgPlayer1.src = 'images/player1.png';
    imgPlayer2 = new Image();
    imgPlayer2.src = 'images/player2.png';
    imgPlayer3 = new Image();
    imgPlayer3.src = 'images/player3.png';
    imgStand = new Image();
    imgStand.src = 'images/stand.png';
    //Create new players and assign initial values.
    oPlayer1 = new Player(0*iCellWidth, 10*iCellHeight, iCellWidth, iCellHeight, imgPlayer1,0,0,1,1,0,0);
    oPlayer2 = new Player(1*iCellWidth, 10*iCellHeight, iCellWidth, iCellHeight, imgPlayer2,0,0,1,2,0,0);
    oPlayer3 = new Player(2*iCellWidth, 10*iCellHeight, iCellWidth, iCellHeight, imgPlayer3,0,0,1,3,0,0);
    document.getElementById("scene").style.zIndex="1";
    
    imgStand.onload = function(){//wait to load image
  	drawScene(1,0);
  	var ii=setInterval(function()
            {
            if(isSecondInstanceRunning==false && (turn == 0 || turn == 2) && lock==false)
            	roll();
            //alert(ii);
            
            },300);
	};
    document.body.onkeydown = function(event)
    	{ 
    	switch (event.keyCode)
    		 {
        	 case 38:
        	 		if(lock==false)
        	 		{
        	 		roll();
        	 		}  
        	 	break;  	
        	 }
    	}
    }
    
    
function roll()
	{
	for(i=0;i<winp.length;i ++)
		{
		if(i%plcount==turn && winp[i%plcount]==1)
			{//Change turn if player was win.
			turn = changeturn(turn,plcount,winp);
			if(winp[turn]==1)
				{//For 3 players
				turn = changeturn(turn,plcount,winp);
				GameOver = true;
				alert("Game Over")
				}
			}
		 }
	if(!GameOver)
		{
		switch (turn)
			{//Identify the current Player
			case 1:
			 	Player = oPlayer1;
			 	break;
			case 2:
			 	Player = oPlayer2;
			 	break;
			case 0:
			 	Player = oPlayer3;
			 	break;
			}
 		lock=true;
 		var min = 1;
		var max = 6;
		var random = Math.floor(Math.random() * (max - min + 1)) + min;
	
		if(Player.cell+random<=100)
			{
			if(Player.cell+random==100)
				winp[Player.id%winp.length]=1;
			Player.inc=1;
			test=false;
			dest = random+Player.cell;
	
			for(i=0;i<ladderstart.length;i++)
				{
				if(Player.start == true && dest==ladderstart[i])
					{
					test=true;
					meat(ladderdest[i]);
					}
				}
			for(j=0;j<snakestart.length;j++)
				{
				if(Player.start == true && dest == snakestart[j])
					{
					test=true;
					if(!meat(snakedest[j]))
						turn = changeturn(turn,plcount,winp);
					//meat(snakedest[i]);
					}
				}
			if(test==true )
				delay(random+8);
			else if(Player.start == true)
				delay(random+2);
			else
				delay(1);
			if (random==1)
				{// Get 1 more turn
				Player.start=1; 
				meat(dest,turn);
				move(random,Player);
				}
			else if(test==true && Player.start==1)
				{//at starting of ladder, get 1 more turn
				meat(dest,turn);
				move(random,Player);
				}
			else 
				{// ordinary movement
				if(Player.start == 1)
					{
					move(random,Player);
					if(meat(dest,turn)==false)
						turn = changeturn(turn,plcount,winp);
					else
						{//Destination position contain another player
						alert(":(");
						meat(dest,turn);
						}
					}
				else
					turn = changeturn(turn,plcount,winp);	
					drawScene(Player.id,random);
				}	
			}   
		else
			{//destnation position>100
			drawScene(Player.id,random);
			turn = changeturn(turn,plcount,winp); 
			if(Player.win == 1)
				{
				Player.i = 6;
				Player.cell = 100;
				}
			lock=false;
			}  	 	
   	 		   
		}
	}
