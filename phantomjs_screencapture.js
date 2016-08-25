/*


@author Destin Moulton

Requires phantomjs installation.

To run on linux: $ phantomjs screencapture.js

*/

var fauxBrowser = require('webpage').create();
var globalRule = "";


fauxBrowser.open('file:///home/destin/projects/coffee/nksrules/index.html', function(){
	fauxBrowser.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js", function(){
		for(var nksrule=0; nksrule<=255; nksrule++){
			

			var pageReturn = fauxBrowser.evaluate(function(passedRule){
				$('#nks-console-select').val(passedRule)
				$('#nks-console-button').click();
				return passedRule;
			},nksrule);
			console.log(pageReturn);

			fauxBrowser.clipRect = {
				top:0,
				left:150,
				width:757,
				height:377
			};

			fauxBrowser.render('captures/rule_'+nksrule+'.png');
		}
		phantom.exit();
	});
});
