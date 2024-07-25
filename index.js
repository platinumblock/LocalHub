//---------------------------------- UTILITY FUNCTIONS -----------------------------------------

function random(min, max) { //Returns random float between min and max
    return Math.random()*(max-min)+min;
}

//------------------------------------- RUN ON START ------------------------------------------

var languages=document.getElementsByClassName("iLanguage");
for(var i=0;i<languages.length;i++){
    languages[i].style.animationDelay=random(-10,0)+"s";
    languages[i].style.transform="rotate("+random(-20,20)+"deg)";
}