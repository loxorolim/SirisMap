
function setButtons()
{

		
		$("#Insertion").click(function() {
			//setOpMode("Insertion");		
			//setInfoWindowNull();
			//$('#configMessage').html(getConfigurations());
		});
		$("#Removal").click(function(event) {
			
			//event.preventDefault(); // the magic

		    setOpMode("Removal");
		    map.setOptions({ draggableCursor: "undefined, auto" })
			setInfoWindowNull();
			$('#configMessage').html(getConfigurations());
		//	event.stopPropagation();
		
			$("#Removal").removeClass("ui-state-focus");
			event.stopImmediatePropagation(); 
			event.preventDefault();
		});
		$("#DisplayXML").click(function() {
			showNodesXml();
			setInfoWindowNull();
		});
		$("#Technology").click(function() {
			setInfoWindowNull();
		});
		$("#Scenario").click(function() {
			setInfoWindowNull();
		});
		$( "#RFMesh" ).click(function() {
			setInfoWindowNull();
			setRFMesh();
		});
		var radioSize = 155;
	   $('#insertionBackground').buttonset().find('label').width(radioSize);
	   $('#powerbackground').buttonset().find('label').width(76);
	   $('#scenarioBackground').buttonset().find('label').width(radioSize);
	   $('#technologyBackground').buttonset().find('label').width(radioSize);
	   $('#configMessage').html(getConfigurations());
	  // $('#RFMesh').button();
	    
		
	
	$('#dialog').dialog({
	closeOnEscape: false,
	resizable: false,
	position: { 
    
    my: 'top',
    at: 'top',
    of: $('#dialogBackground')
  }
});

	$('#legendaDialog').dialog({
	closeOnEscape: false,
	resizable: false,
	width: 277,
		position: { 
    
    my: 'top',
    at: 'top',
    of: $('#legenda')
	}


});

        $(function () {
	        $("#menu").menu();
        });
	   $( "#radioBackground" ).buttonset().find('label').width(122);
	   $( "#accordion,#techAccordion" ).accordion({
			
			active: false,
			collapsible: true,
			heightStyle: "content",
			icons: false
			
			
		});

		//Faz com que os botoes nao permaneçam pressionados em alguns browsers tipo IE10
		$("#over_map").find("button").click(function () {
			$(this).removeClass("ui-state-focus");
			
		});
		$("#over_map").find("h3").click(function () {
			$(this).removeClass("ui-state-focus");
			
		});

		
	
		$("#dapRadio").click(function() 
		{
			setOpMode("Insertion");		
			setInfoWindowNull();
			setInsertionOptions("DAP")
			map.setOptions({ draggableCursor: "url(dapcursor.png) 12 12, auto" });
			$('#configMessage').html(getConfigurations());
		});
		$("#meterRadio").click(function()
		{
			setOpMode("Insertion");		
			setInfoWindowNull();
			setInsertionOptions("Meter");
			map.setOptions({ draggableCursor: "url(metercursor.png) 11 11, auto" })
			$('#configMessage').html(getConfigurations());
		});
		
		$("#metropolitanRadio").click(function() 
		{
			setScenario("Metropolitan")
			$('#configMessage').html(getConfigurations());
		});
		$("#urbanRadio").click(function()
		{
			setScenario("Urban")
			$('#configMessage').html(getConfigurations());
		});
		$("#ruralRadio").click(function() 
		{
			setScenario("Rural")
			$('#configMessage').html(getConfigurations());
		});

		
		$("#ZigBee").click(function() 
		{
			setCurrentTech("ZigBee");
			setInsertionOptions("DAP")
			setDapsToTechnology();
			$('#configMessage').html(getConfigurations());
			
		});
		$("#80211").click(function()
		{		
			setCurrentTech("w80211");
			setInsertionOptions("DAP")
			setDapsToTechnology();
			$('#configMessage').html(getConfigurations());
		});

		$("#z0dbm").click(function() 
		{
			setdbm("dbm0");
			$('#configMessage').html(getConfigurations());
		});
		$("#z6dbm").click(function() 
		{
			setdbm("dbm6");
			$('#configMessage').html(getConfigurations());
		});
		$("#z12dbm").click(function() 
		{
			setdbm("dbm12");
			$('#configMessage').html(getConfigurations());
		});
		$("#z18dbm").click(function() 
		{
			setdbm("dbm18");
			$('#configMessage').html(getConfigurations());
		});
		$("#z24dbm").click(function() 
		{
			setdbm("dbm24");
			$('#configMessage').html(getConfigurations());
		});
		$("#z30dbm").click(function() 
		{
			setdbm("dbm30");
			$('#configMessage').html(getConfigurations());
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
