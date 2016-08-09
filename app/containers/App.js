import React, { Component, PropTypes } from 'react';
import { makeRequest, OW_URL, prettifyLocationString } from '../utils';
import { getInitialState } from '../model';
import { DayCard } from '../components';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			location: 'London,uk'
		};
	}
	componentWillMount() {
		this.fetchData();
	}
	fetchData() {
		const { location } = this.state;
		const url = `${OW_URL}${location}`;
		makeRequest(url)
			.then(getInitialState)
			.then(::this.updateWeather);
	}
	updateWeather(data) {
		this.setState({
			days: data
		});
	}
	renderDayCard(day, i) {
		const { days } = this.state;
		const currentDay = days[day];
		return (
			<DayCard currentDay={currentDay} key={i} />
		);
	}
	renderDays() {
		const { days } = this.state;
		return Object.keys(days).map((day, i) => ::this.renderDayCard(day, i));
	}
	renderView() {
		const { days } = this.state;
		return days ?
			(<ul className='row'>{ ::this.renderDays() }</ul>) :
			(<p>Fetching weather data, one moment please...</p>);
	}
	render() {
		const { location } = this.state;
		return (
			<section className='container-fluid'>
				<h1 className='h1'>{`5 day forecast for ${prettifyLocationString(location)}`}</h1>
				{ ::this.renderView() }
			</section>
		);
	}
}
