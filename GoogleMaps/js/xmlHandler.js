function showNodesXml()
{
	var init = "&lt?xml version=\"1.0\" encoding=\"utf-8\"?&gt" + "<br>&ltNodes&gt";
	var meters = "";
	var daps = "";
	var fin = "";
	var markers = getAllMarkers();
	for ( i = 0; i < markers.length; i++)
	{	
		if(markers[i].type == "meter")
		{
			meters += "<br>&nbsp&ltmeter&gt" 
			+ "<br>&nbsp&nbsp&ltLatitude&gt" + markers[i].position.lat() + "&lt\/Latitude&gt"
			+ "<br>&nbsp&nbsp&ltLongitude&gt" + markers[i].position.lng() + "&lt\/Longitude&gt" 
			+ "<br>&nbsp&lt\/meter&gt";
		}

		else 
		if(markers[i].type == "DAP")
		{
			daps += "<br>&nbsp&ltDAP&gt" 
			+ "<br>&nbsp&nbsp&ltLatitude&gt" + markers[i].position.lat() + "&lt\/Latitude&gt" 
			+ "<br>&nbsp&nbsp&ltLongitude&gt" + markers[i].position.lng() + "&lt\/Longitude&gt" 
			+ "<br>&nbsp&nbsp&ltTechnology&gt" + markers[i].teleTech + "&lt\/Technology&gt" 
			+ "<br>&nbsp&nbsp&ltsetInsertionOptions&gt" + markers[i].setInsertionOptions + "&lt\/setInsertionOptions&gt" 
			+ "<br>&nbsp&lt\/DAP&gt";
		}
	}
	fin += "<br>&lt\/Nodes&gt";
	$("#xmltext").html(init+meters+daps+fin);
}
function loadNodesFromXml()
{
	$(document).ready(function()
	{
		$.ajax(
		{
			type : "GET",
			url : "test2.xml",
			dataType : "xml",
			success : function(xml)
			{
				//$("node[name='x']");
				$(xml).find('meter').each(function()
				{
					var latitude = $(this).find('Latitude').text();
					var longitude = $(this).find('Longitude').text();
					placeMeter(latitude, longitude);
				})
				$(xml).find('DAP').each(function()
				{
					var latitude = $(this).find('Latitude').text();
					var longitude = $(this).find('Longitude').text();
					var technology = $(this).find('Technology').text();
					var setInsertionOptions = parseInt($(this).find('setInsertionOptions').text(),10);
					
					// loadMarker(latitude,longitude);
					placeDAP(latitude, longitude, technology, setInsertionOptions);
				});
			}
		});
	});
}
function loadReachFromTable(tech,scenario, dbm)
{
	var ret;
	$(document).ready(function()
	{
		$.ajax(
		{
			async: false,
			type : "GET",
			url : "table.xml",
			dataType : "xml",
			success : function(xml)
			{
				$(xml).find(tech).each(function()
				{   				
					$(this).find(scenario).each(function()
					{
						$(this).find(dbm).each(function()
						{
							ret = parseInt($(this).find('Reach').text(),10);
							
						})
						
					})
				})
			}
		});
	});
	return ret;

}
