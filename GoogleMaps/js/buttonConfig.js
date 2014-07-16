
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
		$("#xml").click(function () {
		    showNodesKml();
		    showPolesXml();
		    $("#xmltextnodes").dialog("open");
		    $("#xmltextpoles").dialog("open");
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
	  // $('#configMessage').html(getConfigurations());
	   //$('#check').click(function (ev) { ev.preventDefault(); });
	  // $('#check').unbind('mouseout keyup mouseup hover');
    $('#checkHeatmap').button({
        icons: {
            primary: "ui-icon-check"
        }

    }).click(function () {
	       $(this).blur();
	       $.blockUI({ fadeIn: 0,  message: '<h1><img src="siri2.gif" /> Carregando </h1>' });
	       drawHeatmap = !drawHeatmap;
	       if (drawHeatmap){
	           heatmap.setMap(map);
	           $(this).button({
	               icons: {
	                   primary: "ui-icon-check"
	               }
	           })
	       }              
	           
	       else {
	           heatmap.setMap(null);
	           $(this).button({
	               icons: {
	                   primary: "ui-icon-closethick"
	               }
	           })
	       }
	           
	       //$('#check').button.removeClass("ui-state-focus ui-state-hover");
	       $.unblockUI();

	       
    });

    $('#autoPlanning').button().click(function () {
        

        $(this).blur();
        $.blockUI({  message: '<h1><img src="siri2.gif" /> Carregando </h1>' });
        // autoPlanningGrasp();
        setTimeout('applyPlanning()', 1000);
       // applyPlanning();

        //$('#check').button.removeClass("ui-state-focus ui-state-hover");
       // $.unblockUI();


    });
    $('#checkRFMesh').button({
        icons: {
            primary: "ui-icon-closethick"
        }

    }).click(function () {
        $(this).blur();
        $.blockUI({ fadeIn: 0, message: '<h1><img src="siri2.gif" /> Carregando </h1>' });
        if (meshEnabled) {
            resetMesh();
            $(this).button({
                icons: {
                    primary: "ui-icon-closethick"
                }
            })
        }

        else {
            //setRFMesh();
            connectViaMesh();         
            
            //markerCluster.clearMarkers();
            $(this).button({
                icons: {
                    primary: "ui-icon-check"
                }
            })
        }
        meshEnabled = !meshEnabled;

        //$('#check').button.removeClass("ui-state-focus ui-state-hover");
        $.unblockUI();


    });
    $('#checkCluster').button({
        icons: {
            primary: "ui-icon-check"
        }

    }).click(function () {
        $(this).blur();
        $.blockUI({ fadeIn: 0, message: '<h1><img src="siri2.gif" /> Carregando </h1>' });
        enableMarkerClusterer = !enableMarkerClusterer;
        if (enableMarkerClusterer) {
            clusterMap();
            $(this).button({
                icons: {
                    primary: "ui-icon-check"
                }
            })
        }

        else {
            unclusterMap();
            //markerCluster.clearMarkers();
            $(this).button({
                icons: {
                    primary: "ui-icon-closethick"
                }
            })
        }

        //$('#check').button.removeClass("ui-state-focus ui-state-hover");
        $.unblockUI();


    });
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
	   $("#xmltextnodes").dialog({
	       autoOpen: false,
	       show: {
	           effect: "scale",
	           duration: 1000
	       },
	       hide: {
	           effect: "scale",
	           duration: 1000
	       },
	       width: 680,
           height: 500
	   });
	   $("#xmltextpoles").dialog({
	       autoOpen: false,
	       show: {
	           effect: "scale",
	           duration: 1000
	       },
	       hide: {
	           effect: "scale",
	           duration: 1000
	       },
	       width: 680,
	       height: 500
	   });

       
	        $("#menu").menu();
       
	   $( "#radioBackground" ).buttonset().find('label').width(122);

		
	
		$("#dapRadio").click(function() 
		{
			setOpMode("Insertion");		
			setInfoWindowNull();
			setInsertionOptions("DAP")
			map.setOptions({ draggableCursor: "url(cursors/dapcursor.cur), auto" });
			
		});
		$("#meterRadio").click(function()
		{
			setOpMode("Insertion");		
			setInfoWindowNull();
			setInsertionOptions("Meter");
			map.setOptions({ draggableCursor: "url(cursors/metercursor.cur), default" })
			
		});
		$("#pole").click(function () {
		    setOpMode("Insertion");
		    setInfoWindowNull();
		    setInsertionOptions("Pole");
		    map.setOptions({ draggableCursor: "url(cursors/polecursor.cur), default" })
		   
		});
		$("#ZigBee").click(function () {
		    technology = "802_15_4";
		    refresh();
		});
		$("#80211a").click(function () {
		    technology = "802_11_a";
		    refresh();
		});
		$("#80211g").click(function () {
		    technology = "802_11_g";
		    refresh();
		});
		$("#urbanRadio").click(function () {
		    scenario = "Urbano";
		    refresh();
		});
		$("#suburbanRadio").click(function () {
		    scenario = "Suburbano";
		    refresh();
		});
		$("#ruralRadio").click(function () {
		    scenario = "Rural";
		    refresh();
		});
		
		//$("#metropolitanRadio").click(function() 
		//{
		//	setScenario("Metropolitan")

		//});
		//$("#urbanRadio").click(function()
		//{
		//	setScenario("Urban")

		//});
		//$("#ruralRadio").click(function() 
		//{
		//	setScenario("Rural")
		//	$('#configMessage').html(getConfigurations());
		//});

		
		//$("#ZigBee").click(function() 
		//{
		//	setCurrentTech("ZigBee");
		//	setInsertionOptions("DAP")
		//	setDapsToTechnology();
		//	$('#configMessage').html(getConfigurations());
			
		//});
		//$("#80211").click(function()
		//{		
		//	setCurrentTech("w80211");
		//	setInsertionOptions("DAP")
		//	setDapsToTechnology();
		//	$('#configMessage').html(getConfigurations());
		//});

		//$("#z0dbm").click(function() 
		//{
		//	setdbm("dbm0");
		//	$('#configMessage').html(getConfigurations());
		//});
		//$("#z6dbm").click(function() 
		//{
		//	setdbm("dbm6");
		//	$('#configMessage').html(getConfigurations());
		//});
		//$("#z12dbm").click(function() 
		//{
		//	setdbm("dbm12");
		//	$('#configMessage').html(getConfigurations());
		//});
		//$("#z18dbm").click(function() 
		//{
		//	setdbm("dbm18");
		//	$('#configMessage').html(getConfigurations());
		//});
		//$("#z24dbm").click(function() 
		//{
		//	setdbm("dbm24");
		//	$('#configMessage').html(getConfigurations());
		//});
		//$("#z30dbm").click(function() 
		//{
		//	setdbm("dbm30");
		//	$('#configMessage').html(getConfigurations());
		//});		
		
			
	
		
	
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
