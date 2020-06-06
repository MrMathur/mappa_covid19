let canvas;

const mappa = new Mappa('Leaflet');
let trainMap;

let data, dataToShow = [];

preload = () => {
	data = loadTable('./data.csv', 'csv', 'header');
}

setup = () => {
	canvas = createCanvas(windowWidth,windowHeight);
	
	trainMap = mappa.tileMap({
		lat: 0,
		lng: 150,
		zoom: 3,
		style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
	});
	trainMap.overlay(canvas);

	for (let day_country of data.rows) {
		for (let prop of data.columns) {
			if (prop != "Province/State"  && prop != "Country/Region" && prop != "Lat" && prop != "Long") {
				if (day_country.obj[prop] > 20) {
					dataToShow.push({
						show: false,
						lat: day_country.obj.Lat,
						lon: day_country.obj.Long,
						date: prop,
						date_unix: (new Date(prop)).getTime()/1000,
						value: day_country.obj[prop]
					});
				}
			}
		}
	}
}

draw = () => {
	clear();

	fill(255);
	noStroke();
	rect(width/2,0,width/2,height);

	textSize(24);
	textAlign(CENTER, CENTER);
	fill(18);
	text("COVID'19 Recoveries", 3*width/4, 40);

	noFill();
	stroke(150);
	line(width/2+40,height-100,width-40,height-100);

	textSize(12);
	textAlign(CENTER, CENTER);
	fill(18);
	text("22 Jan", width/2+40, height-75);
	text("12 Mar", width - 40, height-75);

	fill(50,200,50,50);
	noStroke();

	let size = 2*trainMap.zoom();

	for (let circle of dataToShow) {
		let pixels = trainMap.latLngToPixel(circle.lat,circle.lon);

		if (pixels.x < (width/2 - size/2) && pixels.x > size/2) {
			ellipse(pixels.x,pixels.y,size,size);

			ellipse(timeToPixel(circle.date_unix),pixels.y,size,size);
		}	
	}	
}

let timeToPixel = (x) => {
	let minT = Math.min.apply(Math, dataToShow.map(function(o) { return o.date_unix; })),
		maxT = Math.max.apply(Math, dataToShow.map(function(o) { return o.date_unix; }));
	return map(x,minT,maxT,width/2+40,width-40);
}
