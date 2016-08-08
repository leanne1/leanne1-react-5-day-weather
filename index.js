
class WeatherModel {
	constructor(options) {
		this.data = options.data;
		this.normalized = null;
		this.groupedByDay = null;
		this.lo = this.null;
		this.hi = this.null;
		this.icon = this.null;
		this.desc = this.null;
		this.date = this.null;

		this.getters = {
			lo: 'getLoForDay',
			hi: 'getHiForDay',
			desc: 'getDescriptionForDay',
			icon: 'getIconForDay',
			date: 'getPrettyDateForDay'
		};
	}
	normalize(data = this.data) {
		this.normalized = data.list.reduce((data, item) => {
			data[item.dt] = item;
			return data;
		}, {});
		return this;
	}
	groupByDay() {
		let day;
		this.groupedByDay = Object
			.keys(this.normalized)
			.sort()
			.reduce((prev, dateTime, i) => {
				if(i % 8 === 0) {
					day = i/8;
					prev[day] = {};
				}
				prev[day][dateTime] = this.normalized[dateTime];
				return prev;
			}, {});
		return this;
	}
	getForAllDays(value, fn = this.getters[value]){
		this[value] = Object
			.keys(this.groupedByDay)
			.sort()
			.map(day => this[fn](day));
		return this;
	}
	getMostCommon(arr) {
		const obj = arr.reduce((prev, item) => {
			prev[item] = prev[item] === undefined ? [] : prev[item];
			prev[item].push(item);
			return prev;
		}, {});
		const sortedObj = Object
			.keys(obj)
			.sort((a, b) => {
				return obj[a].length > obj[b].length;
			})
			.reverse();
		return sortedObj[0];
	}
	getLoForDay(day){
		const dayLo = Object
			.keys(this.groupedByDay[day])
			.map(key => this.groupedByDay[day][key].main.temp_min);
		return Math.min(...dayLo);
	}
	getHiForDay(day){
		const dayHi = Object
			.keys(this.groupedByDay[day])
			.map(key => this.groupedByDay[day][key].main.temp_max);
		return Math.max(...dayHi);
	}
	getIconForDay(day){
		const dayIcon = Object
			.keys(this.groupedByDay[day])
			.map(key => this.groupedByDay[day][key].weather[0].id);
		return this.getMostCommon(dayIcon)
	}
	getDescriptionForDay(day){
		const dayDesc = Object
			.keys(this.groupedByDay[day])
			.map(key => this.captialiseFirstChar(this.groupedByDay[day][key].weather[0].description));
		return this.getMostCommon(dayDesc)
	}
	getPrettyDateForDay(day){
		const UTCDate = Object
			.keys(this.groupedByDay[day])
			.map(key => this.groupedByDay[day][key].dt)[0];
		const d = new Date(UTCDate*1000);
		return [d.getUTCDate(), this.getPrettyMonth(d.getMonth()), d.getFullYear()];
	}
	captialiseFirstChar(str) {
		return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
	}
	getPrettyMonth(month){
		const prettyMonths = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];
		return prettyMonths[month];
	}
	getModel(...props) {
		return Object
			.keys(this.groupedByDay)
			.reduce((model, currDay) => {
				model[currDay] = {};
				props.forEach(prop => {
					model[currDay][prop] = this[prop][currDay];
				});
				return model;
			}, {});
	}
}
const data = {"city":{"id":2643743,"name":"London","coord":{"lon":-0.12574,"lat":51.50853},"country":"GB","population":0,"sys":{"population":0}},"cod":"200","message":0.0426,"cnt":40,"list":[{"dt":1470528000,"main":{"temp":290.21,"temp_min":290.21,"temp_max":291.625,"pressure":1031.6,"sea_level":1039.26,"grnd_level":1031.6,"humidity":76,"temp_kf":-1.41},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":12},"wind":{"speed":4.36,"deg":223.002},"sys":{"pod":"n"},"dt_txt":"2016-08-07 00:00:00"},{"dt":1470538800,"main":{"temp":289.67,"temp_min":289.67,"temp_max":290.725,"pressure":1030.63,"sea_level":1038.21,"grnd_level":1030.63,"humidity":80,"temp_kf":-1.06},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"02n"}],"clouds":{"all":8},"wind":{"speed":4.71,"deg":232.506},"sys":{"pod":"n"},"dt_txt":"2016-08-07 03:00:00"},{"dt":1470549600,"main":{"temp":290.5,"temp_min":290.5,"temp_max":291.203,"pressure":1030.36,"sea_level":1037.84,"grnd_level":1030.36,"humidity":86,"temp_kf":-0.71},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":64},"wind":{"speed":4.92,"deg":238},"rain":{"3h":0.025},"sys":{"pod":"d"},"dt_txt":"2016-08-07 06:00:00"},{"dt":1470560400,"main":{"temp":294.42,"temp_min":294.42,"temp_max":294.771,"pressure":1030.35,"sea_level":1037.82,"grnd_level":1030.35,"humidity":67,"temp_kf":-0.35},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":8},"wind":{"speed":5.62,"deg":253.5},"rain":{"3h":0.02},"sys":{"pod":"d"},"dt_txt":"2016-08-07 09:00:00"},{"dt":1470571200,"main":{"temp":297.38,"temp_min":297.38,"temp_max":297.38,"pressure":1029.65,"sea_level":1037.15,"grnd_level":1029.65,"humidity":51,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":5.81,"deg":258.001},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-07 12:00:00"},{"dt":1470582000,"main":{"temp":298.172,"temp_min":298.172,"temp_max":298.172,"pressure":1028.57,"sea_level":1035.94,"grnd_level":1028.57,"humidity":42,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":6.02,"deg":260.001},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-07 15:00:00"},{"dt":1470592800,"main":{"temp":296.516,"temp_min":296.516,"temp_max":296.516,"pressure":1027.56,"sea_level":1035.06,"grnd_level":1027.56,"humidity":39,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":5.77,"deg":259.003},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-07 18:00:00"},{"dt":1470603600,"main":{"temp":292.668,"temp_min":292.668,"temp_max":292.668,"pressure":1026.94,"sea_level":1034.32,"grnd_level":1026.94,"humidity":47,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":5.11,"deg":255.504},"rain":{},"sys":{"pod":"n"},"dt_txt":"2016-08-07 21:00:00"},{"dt":1470614400,"main":{"temp":289.634,"temp_min":289.634,"temp_max":289.634,"pressure":1025.99,"sea_level":1033.49,"grnd_level":1025.99,"humidity":61,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":5.81,"deg":255.5},"rain":{},"sys":{"pod":"n"},"dt_txt":"2016-08-08 00:00:00"},{"dt":1470625200,"main":{"temp":287.725,"temp_min":287.725,"temp_max":287.725,"pressure":1024.93,"sea_level":1032.56,"grnd_level":1024.93,"humidity":77,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":48},"wind":{"speed":6.31,"deg":261.507},"rain":{"3h":0.005},"sys":{"pod":"n"},"dt_txt":"2016-08-08 03:00:00"},{"dt":1470636000,"main":{"temp":289.798,"temp_min":289.798,"temp_max":289.798,"pressure":1024.81,"sea_level":1032.34,"grnd_level":1024.81,"humidity":73,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":36},"wind":{"speed":6.27,"deg":272.505},"rain":{"3h":0.01},"sys":{"pod":"d"},"dt_txt":"2016-08-08 06:00:00"},{"dt":1470646800,"main":{"temp":292.524,"temp_min":292.524,"temp_max":292.524,"pressure":1025.84,"sea_level":1033.28,"grnd_level":1025.84,"humidity":51,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":12},"wind":{"speed":5.98,"deg":285.002},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-08 09:00:00"},{"dt":1470657600,"main":{"temp":294.565,"temp_min":294.565,"temp_max":294.565,"pressure":1025.96,"sea_level":1033.37,"grnd_level":1025.96,"humidity":46,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":36},"wind":{"speed":5.56,"deg":280.003},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-08 12:00:00"},{"dt":1470668400,"main":{"temp":294.937,"temp_min":294.937,"temp_max":294.937,"pressure":1025.63,"sea_level":1033.07,"grnd_level":1025.63,"humidity":42,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":32},"wind":{"speed":5.58,"deg":283},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-08 15:00:00"},{"dt":1470679200,"main":{"temp":293.167,"temp_min":293.167,"temp_max":293.167,"pressure":1026,"sea_level":1033.48,"grnd_level":1026,"humidity":43,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":48},"wind":{"speed":5.11,"deg":290.002},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-08 18:00:00"},{"dt":1470690000,"main":{"temp":290.81,"temp_min":290.81,"temp_max":290.81,"pressure":1026.86,"sea_level":1034.36,"grnd_level":1026.86,"humidity":49,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":88},"wind":{"speed":4.22,"deg":301.501},"rain":{},"sys":{"pod":"n"},"dt_txt":"2016-08-08 21:00:00"},{"dt":1470700800,"main":{"temp":289.027,"temp_min":289.027,"temp_max":289.027,"pressure":1027.6,"sea_level":1035.1,"grnd_level":1027.6,"humidity":60,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":76},"wind":{"speed":4.34,"deg":318.002},"rain":{},"sys":{"pod":"n"},"dt_txt":"2016-08-09 00:00:00"},{"dt":1470711600,"main":{"temp":286.642,"temp_min":286.642,"temp_max":286.642,"pressure":1027.82,"sea_level":1035.36,"grnd_level":1027.82,"humidity":67,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":4.21,"deg":321.501},"rain":{},"sys":{"pod":"n"},"dt_txt":"2016-08-09 03:00:00"},{"dt":1470722400,"main":{"temp":285.774,"temp_min":285.774,"temp_max":285.774,"pressure":1028.71,"sea_level":1036.32,"grnd_level":1028.71,"humidity":74,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":36},"wind":{"speed":4.02,"deg":318.501},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-09 06:00:00"},{"dt":1470733200,"main":{"temp":289.946,"temp_min":289.946,"temp_max":289.946,"pressure":1029.61,"sea_level":1037.12,"grnd_level":1029.61,"humidity":57,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"02d"}],"clouds":{"all":8},"wind":{"speed":4.46,"deg":326.506},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-09 09:00:00"},{"dt":1470744000,"main":{"temp":291.629,"temp_min":291.629,"temp_max":291.629,"pressure":1029.44,"sea_level":1037.04,"grnd_level":1029.44,"humidity":52,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":64},"wind":{"speed":4.56,"deg":316.501},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-09 12:00:00"},{"dt":1470754800,"main":{"temp":291.327,"temp_min":291.327,"temp_max":291.327,"pressure":1029.51,"sea_level":1036.94,"grnd_level":1029.51,"humidity":52,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":80},"wind":{"speed":5.22,"deg":311.001},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-09 15:00:00"},{"dt":1470765600,"main":{"temp":291.446,"temp_min":291.446,"temp_max":291.446,"pressure":1029.42,"sea_level":1036.99,"grnd_level":1029.42,"humidity":49,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":92},"wind":{"speed":5.21,"deg":313.504},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-09 18:00:00"},{"dt":1470776400,"main":{"temp":289.248,"temp_min":289.248,"temp_max":289.248,"pressure":1030.14,"sea_level":1037.64,"grnd_level":1030.14,"humidity":56,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":64},"wind":{"speed":4.52,"deg":311.5},"rain":{},"sys":{"pod":"n"},"dt_txt":"2016-08-09 21:00:00"},{"dt":1470787200,"main":{"temp":286.804,"temp_min":286.804,"temp_max":286.804,"pressure":1029.96,"sea_level":1037.48,"grnd_level":1029.96,"humidity":66,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":3.76,"deg":309.503},"rain":{},"sys":{"pod":"n"},"dt_txt":"2016-08-10 00:00:00"},{"dt":1470798000,"main":{"temp":284.558,"temp_min":284.558,"temp_max":284.558,"pressure":1028.82,"sea_level":1036.55,"grnd_level":1028.82,"humidity":74,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"02n"}],"clouds":{"all":8},"wind":{"speed":3.37,"deg":285.009},"rain":{},"sys":{"pod":"n"},"dt_txt":"2016-08-10 03:00:00"},{"dt":1470808800,"main":{"temp":284.816,"temp_min":284.816,"temp_max":284.816,"pressure":1028.18,"sea_level":1035.71,"grnd_level":1028.18,"humidity":75,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":32},"wind":{"speed":3.91,"deg":280.501},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-10 06:00:00"},{"dt":1470819600,"main":{"temp":288.947,"temp_min":288.947,"temp_max":288.947,"pressure":1027.23,"sea_level":1034.68,"grnd_level":1027.23,"humidity":59,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":32},"wind":{"speed":4.71,"deg":278.504},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-10 09:00:00"},{"dt":1470830400,"main":{"temp":292.233,"temp_min":292.233,"temp_max":292.233,"pressure":1025.62,"sea_level":1033.09,"grnd_level":1025.62,"humidity":53,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":36},"wind":{"speed":5.37,"deg":278.502},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-10 12:00:00"},{"dt":1470841200,"main":{"temp":289.486,"temp_min":289.486,"temp_max":289.486,"pressure":1025.48,"sea_level":1033.03,"grnd_level":1025.48,"humidity":72,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":68},"wind":{"speed":5.76,"deg":316.504},"rain":{"3h":0.65},"sys":{"pod":"d"},"dt_txt":"2016-08-10 15:00:00"},{"dt":1470852000,"main":{"temp":290.384,"temp_min":290.384,"temp_max":290.384,"pressure":1026.72,"sea_level":1034.22,"grnd_level":1026.72,"humidity":58,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":80},"wind":{"speed":4.71,"deg":11.5025},"rain":{"3h":0.07},"sys":{"pod":"d"},"dt_txt":"2016-08-10 18:00:00"},{"dt":1470862800,"main":{"temp":286.728,"temp_min":286.728,"temp_max":286.728,"pressure":1029.05,"sea_level":1036.6,"grnd_level":1029.05,"humidity":66,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":12},"wind":{"speed":3.33,"deg":30.0031},"rain":{"3h":0.01},"sys":{"pod":"n"},"dt_txt":"2016-08-10 21:00:00"},{"dt":1470873600,"main":{"temp":282.257,"temp_min":282.257,"temp_max":282.257,"pressure":1030.06,"sea_level":1037.77,"grnd_level":1030.06,"humidity":87,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":1.22,"deg":31.5039},"rain":{},"sys":{"pod":"n"},"dt_txt":"2016-08-11 00:00:00"},{"dt":1470884400,"main":{"temp":280.838,"temp_min":280.838,"temp_max":280.838,"pressure":1030.35,"sea_level":1037.98,"grnd_level":1030.35,"humidity":89,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":92},"wind":{"speed":1.01,"deg":253},"rain":{},"sys":{"pod":"n"},"dt_txt":"2016-08-11 03:00:00"},{"dt":1470895200,"main":{"temp":283.759,"temp_min":283.759,"temp_max":283.759,"pressure":1030.85,"sea_level":1038.46,"grnd_level":1030.85,"humidity":78,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":80},"wind":{"speed":1.27,"deg":221.5},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-11 06:00:00"},{"dt":1470906000,"main":{"temp":290,"temp_min":290,"temp_max":290,"pressure":1030.82,"sea_level":1038.42,"grnd_level":1030.82,"humidity":62,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":3.12,"deg":240.002},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-11 09:00:00"},{"dt":1470916800,"main":{"temp":292.416,"temp_min":292.416,"temp_max":292.416,"pressure":1029.48,"sea_level":1036.91,"grnd_level":1029.48,"humidity":53,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":4.01,"deg":251.501},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-11 12:00:00"},{"dt":1470927600,"main":{"temp":293.121,"temp_min":293.121,"temp_max":293.121,"pressure":1028.1,"sea_level":1035.61,"grnd_level":1028.1,"humidity":43,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":80},"wind":{"speed":5.02,"deg":262.5},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-11 15:00:00"},{"dt":1470938400,"main":{"temp":291.984,"temp_min":291.984,"temp_max":291.984,"pressure":1026.89,"sea_level":1034.4,"grnd_level":1026.89,"humidity":57,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":92},"wind":{"speed":5.46,"deg":262.503},"rain":{},"sys":{"pod":"d"},"dt_txt":"2016-08-11 18:00:00"},{"dt":1470949200,"main":{"temp":290.98,"temp_min":290.98,"temp_max":290.98,"pressure":1026.14,"sea_level":1033.62,"grnd_level":1026.14,"humidity":61,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":80},"wind":{"speed":6.07,"deg":259.504},"rain":{},"sys":{"pod":"n"},"dt_txt":"2016-08-11 21:00:00"}]};
const weatherModel = new WeatherModel({ data });
const weather = weatherModel
	.normalize()
	.groupByDay()
	.getForAllDays('lo')
	.getForAllDays('hi')
	.getForAllDays('icon')
	.getForAllDays('desc')
	.getForAllDays('date')
	.getModel('lo', 'hi', 'icon', 'desc', 'date');

console.log('WEATHER!!!!!', weather);

/*
 //TODO
 - Abstract getAllLo / getAllHi etc. to a reduce repetition
 - Convert WeatherModel into a functional pipeline - no mutating
 - Icon + desc doesn't take into account day / night
 */