$(document).ready(function () {
    FastClick.attach(document.body);
    InitializeView('app.ui.Menu');
	
    document.addEventListener("deviceready", onDR, false);
});

function onDR(){
	alert('s1');
    document.addEventListener("backbutton", backKeyDown, true);
    //boot your app...
}
function backKeyDown() { 
    // do something here if you wish
     alert('go back!');
}