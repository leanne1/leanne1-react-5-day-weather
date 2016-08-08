import React, { Component, PropTypes } from 'react';

export default class DayCard extends Component {
	static propTypes = {
		currentDay: PropTypes.string.isRequired,
		index: PropTypes.number.isRequired,
	};
	render() {
		const {
			currentDay,
			index
		} = this.props;

		return (
			<li key={index} className='col-xs-4 col-sm-2 card-day brand-primary'>
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
}
