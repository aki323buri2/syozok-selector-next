import './App.scss';
import React from 'react';
import { connect } from 'react-redux';
import SyozokSelector from '../lib/SyozokSelector';
@connect(state => state)
export default class App extends React.Component
{
	action(type, payload) 
	{
		return this.props.dispatch({ type, payload });
	}
	render()
	{
		const {
			buka, 
			fetchBukaPending, 
			fetchBukaError, 
			syozok, 
		} = this.props;

		return (
			<div className="app content is-small">
				
				<div className="field">
					<div className="field-title">しょぞくせれくたあ : </div>
					<div className="field-body">
						<SyozokSelector
							{...{
								buka, 
								fetchBukaPending, 
								fetchBukaError, 
								syozok, 
							}}
							onChange={syozok => this.action('SYOZOK', syozok)}
						/>
					</div>
				</div>
			</div>
		);
	}
};