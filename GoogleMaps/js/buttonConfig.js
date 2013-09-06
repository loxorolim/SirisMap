/// <reference path="/js/jquery-1.10.2.min.js" />

function setButtons()
{

$("#btnInsertion").click(function()
	{
		opMode = "Insertion";
		$("#btnInsertion").attr("class", "orange");
		$("#btnRemoval").attr("class", "gray");
		//		$("#btnConnection").attr("class","gray");
		$("#btnDisplayXML").attr("class", "gray");
		//		if(markerPair.length > 0)
		//			toggleBounce(markerPair[0]);
		markerPair = [];
		infowindow.setMap(null);
	});
	$("#btnRemoval").click(function()
	{
		opMode = "Removal";
		$("#btnInsertion").attr("class", "gray");
		$("#btnRemoval").attr("class", "orange");
		//		$("#btnConnection").attr("class","gray");
		$("#btnDisplayXML").attr("class", "gray");
		//		if(markerPair.length > 0)
		//			toggleBounce(markerPair[0]);
		markerPair = [];
		infowindow.setMap(null);
	});
	$("#radioLine").click(function()
	{
		radioMode = "Line";
		$('#radioLine').attr("class", "orange");
		$("#radioRadius").attr("class", "gray");
		setLinesVisible();
		setCirclesInvisible();
	});
	$("#radioRadius").click(function()
	{
		radioMode = "Radius";
		$("#radioRadius").attr("class", "orange");
		$('#radioLine').attr("class", "gray");
		setLinesInvisible();
		setCirclesVisible();
	});
	/*	$("#btnConnection").click(function () {
	 opMode = "Connection";
	 $("#btnInsertion").attr("class","gray");
	 $("#btnRemoval").attr("class","gray");
	 $("#btnConnection").attr("class","orange");
	 $("#btnDisplayXML").attr("class","gray");
	 if(markerPair.length > 0)
	 toggleBounce(markerPair[0]);
	 markerPair = [];
	 infowindow.setMap(null);
	 });*/
	$("#btnDisplayXML").click(function()
	{
		opMode = "DisplayXML";
		showNodesXml();
		$("#btnInsertion").attr("class", "gray");
		$("#btnRemoval").attr("class", "gray");
		//		$("#btnConnection").attr("class","gray");
		$("#btnDisplayXML").attr("class", "orange");
		//		if(markerPair.length > 0)
		//			toggleBounce(markerPair[0]);
		markerPair = [];
		infowindow.setMap(null);
	});
	$("#btnUploadXML").click(function()
	{
		$("#upFile").trigger('click');
	});
	$("#btnUploadXML").mouseover(function()
	{
		$("#btnUploadXML").attr("class", "orange");
	});
	$("#btnUploadXML").mouseout(function()
	{
		$("#btnUploadXML").attr("class", "gray");
	});
}