
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
			setOpMode("DisplayXML");
			showNodesXml();
			setInfoWindowNull();
		});
		$("#Technology").click(function() {
			setOpMode("Technology");
			setInfoWindowNull();
		});
		$("#Scenario").click(function() {
			setOpMode("Technology");
			setInfoWindowNull();
		});
		var radioSize = 155;
	   $('#insertionBackground').buttonset().find('label').width(radioSize);
	   $('#dbBackgroundZigBee').buttonset().find('label').width(76);
	   $('#dbBackground80211').buttonset().find('label').width(76);
	   $('#scenarioBackground').buttonset().find('label').width(radioSize);
	   $('#technologyBackground').buttonset().find('label').width(radioSize);
	   $( "#radio" ).buttonset().find('label').width(radioSize);

	   $( "#radioBackground" ).buttonset().find('label').width(radioSize);
	   $( "#accordion,#techAccordion" ).accordion({
		
			collapsible: true,
			heightStyle: "content",
			icons: false
			
			
		});

		

		
	
		$("#dapRadio").click(function() 
		{
			setInsertionOptions("DAP")
		});
		$("#meterRadio").click(function()
		{
			setInsertionOptions("meter")
		});
		
		$("#urbanRadio").click(function() 
		{
			setScenario("Urban")
		});
		$("#denseUrbanRadio").click(function()
		{
			setScenario("DenseUrban")
		});
		$("#ruralRadio").click(function() 
		{
			setScenario("Rural")
		});

		
		$("#ZigBee").click(function() 
		{
			setCurrentTech("ZigBee");
			setInsertionOptions("DAP")
			setDapsToTechnology("ZigBee");
			
		});
		$("#80211").click(function()
		{		
			setCurrentTech("80211");
			setInsertionOptions("DAP")
			setDapsToTechnology("80211");
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