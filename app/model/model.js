/**
 * Models
 */
export class WeatherModel {
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
		this.normalized = data.list
			.reduce((data, item) => {
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
			.reduce((dataset, dateTime, i) => {
				if(i % 8 === 0) {
					day = i/8;
					dataset[day] = {};
				}
				dataset[day][dateTime] = this.normalized[dateTime];
				return dataset;
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
		const obj = arr
			.reduce((prev, item) => {
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

/**
 * UI selectors
 */

export const getInitialState = data => {
	const weatherModel = new WeatherModel({ data });
	const weatherData = weatherModel
		.normalize()
		.groupByDay()
		.getForAllDays('lo')
		.getForAllDays('hi')
		.getForAllDays('icon')
		.getForAllDays('desc')
		.getForAllDays('date')
		.getModel('lo', 'hi', 'icon', 'desc', 'date');
	return Promise.resolve(weatherData);
};