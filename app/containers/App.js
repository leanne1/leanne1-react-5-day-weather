import React, { Component, PropTypes } from 'react';
import { makeRequest, OW_URL } from '../utils';
import { getInitialState } from '../model';

export default class App extends Component {
	static propTypes = {
	};
	static defaultProps = {

	};
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
		console.log('DAY', day)
		return (
			<li key={i} className='col-xs-4 col-sm-2 card-day brand-primary'>
				<dl>
					<dt>
						<span className='dna-invisible'>Date</span>
					</dt>
					<dt>{currentDay.date.join(' ')}</dt>
					<dt>Lo:</dt>
					<dd>{currentDay.lo} &deg;C</dd>
					<dt>Hi:</dt>
					<dd>{currentDay.hi} &deg;C</dd>
					<dt><span className='dna-invisible'>Description</span></dt>
					<dd>{currentDay.desc}</dd>
					<dt className='dna-invisible' aria-hidden='true'>Weather icon</dt>
					<dd>
						<i className={`wi wi-owm-${currentDay.icon}`}> </i>
					</dd>
				</dl>
			</li>
		);
	}
	renderDays() {
		const { days } = this.state;
		return Object.keys(days).map((day, i) => ::this.renderDayCard(day, i));
	}
	renderView() {
		const { days, location } = this.state;
		return days ?
			(<div>
				<h1 className='h1'>{`5 day forecast for ${location.split(',').join(', ')}`}</h1>
				<ul className='row'>{ ::this.renderDays() }</ul>
			</div>) :
			(<p>Fetching weather data, one moment please...</p>);
	}
	render() {
		return (
			<section className='container-fluid'>

				{ ::this.renderView() }
			</section>
		);
	}
}
