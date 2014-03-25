var f = 2400; //frequency [MHz] 
var h1 = //Tx antenna height [m]
var h2 = //Rx antenna height [m]
var d = //Tx-Rx distance [Km]
var env = //environment type

var Hm = Math.min(h1,h2);
var Hb = Math.max(h1,h2);

function Math.log10(n)
{
    return (Math.log(n)) / (Math.log(10));
}

// Correction factors
function a(Hm, f)
{
	return (1.1*Math.log10(f) - 0.7)*Math.min(10, Hm) - (1.56*Math.log10(f) - 0.8) + Math.max(0, 20*Math.log10(Hm/10));
}

function b(Hb, f)
{
	if (!SRD) //SRD = Short Range Device
		return Math.min(0, 20*log10(Hb/30));
	if (SRD) //Antenna heights need to bem 1.5~3m
		return 1.1*Math.log10(f) - 0.7)*Math.min(10, Hb) - (1.56*Math.log10(f) - 0.8) + Math.max(0, 20*Math.log10(Hb/10));
}

//Hata Model median loss function
function Loss( f , h1 , h2 , d, env )
	var L = 0;
	if (d <= 20) //Since d <= 20Km:
		var alpha = 1;
	if (d <= 0.04)
		L = 32.4 + Math.log10(f) + 10*Math.log10(Math.pow(d, 2) + (Math.pow(Hb - Hm,2))/106)
	if (d >= 0.1)
		if (env == urban)
		{
			if ((30 < f) && (f < 150))
				L = 69.9 + 26.2*Math.log10(150) - 20*Math.log10(150/f) - 13.82*Math.log10(Math.max(30, Hb)) + (44.9 - 6.55*Math.log10(Math.max(30, Hb)))*(Math.pow(Math.log10(d), alpha) - a(H_m) - b(H_b);
			if ((150 <  f) && (f < 1500))
				L = 69.6 + 26.2*log10(f) - 13.82*log10( max(30,H_b) ) + [44.9 - 6.55*log10( max(30,H_b) )]*(log10(d)^alpha) - a(H_m) - b(H_b);
			if ((1500 < f) && (f < 2000))
				L = 46.3 + 33.9*log10(f) - 13.82*log10( max(30,H_b) ) + [44.9 - 6.55*log10( max(30,H_b) )]*(log10(d)^alpha) - a(H_m) - b(H_b)
			if ((2000 < f) && (f < 3000))
				L = 46.3 + 33.9*log10(2000) + 10*log10(f/2000) - 13.82*log10(max(30,H_b)) + [44.9 - 6.55*log(max(30,H_b))] * (log10(d)^alpha) - a(H_m) - b(H_b)
		}

		if env == suburban

			L = Loss(urban) - 2*((log10( min( max(150,f),2000 ) )/28)^2) - 5.4


		if env == rural

			L = Loss(urban) - 4.78*((log10( min( max(150,f),2000 ) ))^2) + 18.33*log10( min( max(150,f),2000 ) ) - 40.94


	
	if 0.04 < d < 0.1

		L = Loss(0.04) +  ((log10(d) - log(0.04)) * (Loss(0.1) - Loss(0.4))) / (log10(0.1) - log10(0.04))

	return L;
}


//SEAMCAT standard deviation (all below roof)
deviation(d)
{
	if d <= 0.04
	
		Dev = 3.5

	if 0.04 < d <= 0.1
		
		Dev = 3.5 + ((17-3.5)*(d-0.04))/(0.1-0.04)

	if 0.1 > d <= 0.2
		
		Dev = 17

	if 0.2 < d <= 0.6

		Dev = 17 + ((9-17)*(d-0.2))/(0.6-0.2)
	
	if d > 0.6
	
		Dev = 9

return Dev
}


// Attenuation = Loss + gaussian_distribution(deviation)