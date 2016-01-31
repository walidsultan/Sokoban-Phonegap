$(document).ready(function () {
    FastClick.attach(document.body);
    InitializeView('app.ui.Menu');
	
	document.addEventListener("deviceready", onDeviceReady, false);
});

function onDeviceReady () {	
	document.addEventListener("backbutton", backKeyDown, true);
}

function backKeyDown() {
	$(window).trigger('returnBack');
}



