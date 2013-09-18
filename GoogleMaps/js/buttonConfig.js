
function setButtons()
{

		
		$("#Insertion").click(function() {
			setOpMode("Insertion");		
			setInfoWindowNull();
		});
		$("#Removal").click(function() {
			setOpMode("Removal");
			setInfoWindowNull();
		});
		$("#DisplayXML").click(function() {
			opMode = "DisplayXML";
			showNodesXml();
			setInfoWindowNull();
		});
		var radioSize = 155;
	   $('#insertionBackground').buttonset().find('label').width(radioSize);
	   $( "#radio" ).buttonset().find('label').width(radioSize);
	   $( "#radioBackground" ).buttonset().find('label').width(radioSize);
	   $( "#accordion" ).accordion({
		
			heightStyle: "content",
			icons: false
		});
	
		$("#dapRadio").click(function() 
		{
			setInsertionType("DAP")
		});
		$("#meterRadio").click(function()
		{
			setInsertionType("meter")
		});

	
	$("#lineRadio").click(function()
	{
		setRadioMode("Line");
		setLinesVisible();
		setCirclesInvisible();
	});
	$("#radiusRadio").click(function()
	{
		setRadioMode("Radius");
		setLinesInvisible();
		setCirclesVisible();
	});
}