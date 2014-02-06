var lines = [];
var dashedLines = [];

var ID = 0;

var meshMaxJumps = 7;

var map;
var markerCluster;
var elevator;
var insertListener;

var allMarkers = [];
var disconnectedMeters = [];
var oneHopMeters = [];
var meters = [];
var daps = [];
var routers = [];
var infowindow = new google.maps.InfoWindow();
var opMode = "Insertion";
var radioMode = "Line";
var dbm = "dbm0";
var meshEnabled = false;
var markerPair = [];
var markerConnections = [];


var circles = [];
var request;


var scenario = "Metropolitan";
var currentTech = "w80211";
var currentIns = "DAP";
var table = [];
