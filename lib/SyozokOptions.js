import './SyozokOptions.scss';
import React from 'react';
import classnames from 'classnames';
import keycodes from 'keycodes';
export default class SyozokOptions extends React.Component
{
	static defaultProps = {
		buka: [], 
		onSelect: syozok => {}, 
		show: true, 
		selected: null, 
	};
	render()
	{
		const {
			buka, 
			show, 
			selected, 
		} = this.props;

		const display = this.display = buka.map((buka, i) =>
		{
			buka.no = i + 1;
			buka.selected = buka.syozok === selected; 
			return buka;
		});
		return (show && 
			<div 
				ref={e => this.dom = e}
				className="syozok-options"
			>
			{display.map(({
				syozok, 
				bukm, 
				selected, 
			}, i) => 
				<div key={i} 
					className={classnames('syozok-option', {
						selected, 
					})}
					onClick={e => this.syozokOptionClick(syozok)}
				>
					<span className="syozok">{syozok}</span>
					<span className="bukm">{bukm}</span>
				</div>
			)}
			</div>
		);
	}
	isShowing()
	{
		return this.props.show;
	}
	emitSelect(syozok)
	{
		this.props.onSelect(syozok);
	}
	syozokOptionClick(syozok)
	{
		this.emitSelect(syozok);
	}

	scroll(delta)
	{
		const { buka, selected } = this.props;
		let index = buka.findIndex(b => b.syozok === selected);
		index += delta;
		index = Math.max(0, index);
		index = Math.min(buka.length - 1, index);

		if (0 <= index < buka.length)
		{
			this.emitSelect(buka[index].syozok)
		}

	}
	getBuka()
	{
		return this.props.buka;
	}
	getSelected()
	{
		return this.props.selected;
	}
}