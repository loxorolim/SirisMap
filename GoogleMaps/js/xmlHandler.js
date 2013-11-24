function showNodesXml()
{
	var init = "&lt?xml version=\"1.0\" encoding=\"utf-8\"?&gt" + "<br>&ltNodes&gt";
	var meters = "";
	var daps = "";
	var fin = "";
	var markers = getAllMarkers();
	for ( i = 0; i < markers.length; i++)
	{	
		if(markers[i].type == "Meter")
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
function loadInfoFromTable(tech,scenario,power,dst)
{
	var ret = [];
	$(document).ready(function()
	{
		$.ajax(
		{
			async: false,
			type : "GET",
			url : "modeloTabela.xml",
			dataType : "xml",
			success : function(xml)
			{
				
			
				$(xml).find("Technology[type = " +tech+ "]").each(function()
				{   				

					$(this).find("Scenario[type = "+scenario+"]").each(function()
					{
						$(this).find("Power[dbm = "+power+"]").each(function()
						{
							$(this).find("Distance").each(function()
							{
								var split = $(this).attr("range").split("-");
								var val1 = parseFloat(split[0],10);
								var val2 = parseFloat(split[1],10);
								if(val1 <= dst && dst < val2)
								{
									//alert(parseFloat($(this).find('TS').text(),10));
									//alert($(this).find('Color').text());

									ret.push(parseFloat($(this).find('TS').text(),10));
									ret.push($(this).find('Color').text());
									return ret;
									
								}
								//alert(parseFloat($(this).find('TS').text(),10));
								//alert($(this).find('Color').text());
							
							})
							
						})
						
					})
				})
			}
		});
	});
	return ret;

}
function loadTable()
{
	var ret = [];
	var table =[]
	
	
	$(document).ready(function()
	{
		$.ajax(
		{
			async: false,
			type : "GET",
			url : "modeloTabela.xml",
			dataType : "xml",
			success : function(xml)
			{
				
				var tech = [];
				$(xml).find("Technology").each(function()
				{   				
					//var sce = [];
					//sce.push($(this).attr("type"));
					//tech.push(sce);
					var x = {
						name: $(this).attr("type"),
						children: []
					}
					
					
					$(this).find("Scenario").each(function()
					{
					
						var y = {
							name: $(this).attr("type"),
							children: []
						}
						x.children.push(y);
						
						$(this).find("Power").each(function()
						{
							var z = {
								name: $(this).attr("dbm"),
								children: []
							}
							y.children.push(z);
								
							$(this).find("Distance").each(function()
							{
								var a = {
								name: $(this).attr("range"),
								children: []
								}
								var split = $(this).attr("range").split("-");
								var val1 = parseFloat($(this).find('TS').text(),10);
								var val2 = $(this).find('Color').text();
								a.children.push(val1);
								a.children.push(val2);							
								z.children.push(a);
								
								

							
							})
							
						})
						
					})
					table.push(x);
				})
				
			}
		});
	});
	return table;

}

