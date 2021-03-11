/*
 * Lash Debug JS
 */

$(document).ready(function() {
	addSizeMonitor();
});

$(window).resize(function(event) {
	updateSizeMonitor($(document).width());
});

function addSizeMonitor() {
	var sizeMonitor = $('<div class="size-monitor"/>')
		.append('<p id="debug_browser-width">width: 0px</p>')
		.append('<p class="visible-xs">[Mobile]</p>')
		.append('<p class="visible-sm">[Tablet]</p>')
		.append('<p class="visible-md">[Desktop]</p>')
		.append('<p class="visible-lg">[Large Desktop]</p>');
	sizeMonitor.prependTo('body');

	updateSizeMonitor($(document).width());
}

function updateSizeMonitor(width) {
	$('#debug_browser-width').text('width: ' + width + 'px');
}