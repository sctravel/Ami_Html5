/**
 * Created by xitu on 1/11/2017.
 */
var td = new Array(),      //保存每个格子的地鼠
    playing = false,       //游戏是否开始
    score = 0,             //分数
    total = 0,
    beat = 0,              //鼠标点击次数
    success = 0,           //命中率
    knock = 0,             //鼠标点中老鼠图片次数
    gameInterId = null,        //指定setInterval()的变量
    gameTimerId = null;         //指定setTimeout()的变量

//游戏结束
function GameOver(){
    timeStop();
    playing = false;
    clearMouse();
}

//主动停止所有计时
function timeStop(){
    clearInterval(gameInterId);//clearInterval()方法返回setInterval()方法的id
    clearTimeout(gameTimerId);//clearTime()方法返回setTimeout()的id
}

//随机循环显示老鼠图片
function show(){
    if(playing)
    {
        if(total == 10) {
            GameOver();
            return;
        }
        var current = Math.floor(Math.random()*6);
        //这里的路径也需要根据自己的实际文件路径来修改
        document.getElementById("td["+current+"]").innerHTML = '<img src="assets/Images/Target_Off.png" height="100%" width="100%">';
        ++total;
        //使用setTimeout()实现2秒后隐藏老鼠图片
        setTimeout("document.getElementById('td["+current+"]').innerHTML=''",1500);
    }
}

//清除所有老鼠图片
function clearMouse(){
    for(var i=0;i<=5;i++)
    {
        document.getElementById("td["+i+"]").innerHTML="";
    }
}

//点击事件函数，判断是否点中老鼠
function hit(id){
    if(playing==false)
    {
        return;
    }
    else
    {
        beat +=1;
        if(document.getElementById("td["+id+"]").innerHTML!="")
        {
            score += 1;
            knock +=1;
            success = knock/beat;
            document.getElementById("td["+id+"]").innerHTML="";
        }
        else
        {
            score += -1;
            success = knock/beat;

        }
    }
}

//游戏开始
function GameStart(){
    playing = true;
    show();
    interId = setInterval("show()",1500);
}