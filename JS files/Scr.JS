var Isopen = false; 

function ShowOpption(){
   
     
    if (Isopen == false) {
        Isopen = true;
        document.getElementById("TEST").style.visibility  = "visible";
        document.getElementById("ok").style.visibility = "hidden";
        document.getElementById("ok2").style.visibility = "hidden";
    }
    
    else{

        Isopen = false;
        document.getElementById("TEST").style.visibility = "hidden"; 
        document.getElementById("ok").style.visibility = "visible";
        document.getElementById("ok2").style.visibility = "visible";
    }
 
}


var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) 
    {
        elem.requestFullscreen();
    } 
  else if (elem.webkitRequestFullscreen) 
    { 
        elem.webkitRequestFullscreen();
    } 
  else if (elem.msRequestFullscreen)
    { 
        elem.msRequestFullscreen();
    }
    document.getElementById("gameStart").style.backgroundPositionY = "10%";
}
function test(){
    document.getElementById("testt").style.visibility  = "hidden";
}

var open = false;
document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27 & open == false) {
        open = true;
        Isopen = true;
        document.getElementById("TEST").style.visibility  = "visible";   
    }
    if((evt.keyCode == 27 & open == true)) {
        open = false;
        document.getElementById("TEST").style.visibility  = "hidden"; 
    }
};

