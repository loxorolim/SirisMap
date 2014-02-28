
function setButtons()
{

		
		$("#Insertion").click(function() {

		});
		$("#Removal").click(function (event)
		{
			


		    setOpMode("Removal");
		    map.setOptions({ draggableCursor: "url(cursors/removecursor.cur), default" });
			setInfoWindowNull();
			$('#configMessage').html(getConfigurations());

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
		$("#help").click(function () {
		    $("#dialog").dialog("open");
		    //$.blockUI({
		    //    message: $('#displayBox'),
		    //    onOverlayClick: $.unblockUI,
		    //    css: {
		    //        top: ($(window).height() - 451) / 2 + 'px',
		    //        left: ($(window).width() - 654) / 2 + 'px',
		    //        width: '654px',
            //        height: '451px'
		    //    }
		        
		    //});
		});


		var radioSize = 155;
	   $('#insertionBackground').buttonset().find('label').width(radioSize);
	   $('#powerbackground').buttonset().find('label').width(76);
	   $('#scenarioBackground').buttonset().find('label').width(radioSize);
	   $('#technologyBackground').buttonset().find('label').width(radioSize);
	   $('#configMessage').html(getConfigurations());
	  // $('#RFMesh').button();
	   $("#dialog").dialog({
	       autoOpen: false,
	       show: {
	           effect: "scale",
	           duration: 1000
	       },
	       hide: {
	           effect: "scale",
	           duration: 1000
	       },
	       width: 680
	   });

       
	        $("#menu").menu();
       
	   $( "#radioBackground" ).buttonset().find('label').width(122);

		
	
		$("#dapRadio").click(function() 
		{
			setOpMode("Insertion");		
			setInfoWindowNull();
			setInsertionOptions("DAP")
			map.setOptions({ draggableCursor: "url(cursors/dapcursor.cur), auto" });
			$('#configMessage').html(getConfigurations());
		});
		$("#meterRadio").click(function()
		{
			setOpMode("Insertion");		
			setInfoWindowNull();
			setInsertionOptions("Meter");
			map.setOptions({ draggableCursor: "url(cursors/metercursor.cur), default" })
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
