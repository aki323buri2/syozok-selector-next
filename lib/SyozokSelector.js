import './SyozokSelector.scss';
import React from 'react';
import classnames from 'classnames';
import keycodes from 'keycodes';
import SyozokInput from './SyozokInput';
import SyozokOptions from './SyozokOptions';
export default class SyozokSelector extends React.Component
{
	static defaultProps = {
		buka: [], 
		syozok: null, 
		onChange: syozok => {}, 
	}
	state = {
		showOptions: false, 
	};
	render()
	{
		const { buka, syozok } = this.props;
		const { 
			showOptions, 
		} = this.state;

		const resolveBukm = syozok =>
		{
			const { bukm } = buka.find(b => b.syozok === syozok) || {};
			return bukm;
		};
		const resolveValid = syozok =>
		{
			return buka.find(b => b.syozok === syozok) !== undefined;
		}
		const selected = this.syozokInput ? this.syozokInput.inputValue() : null;
		return (
			<div className="syozok-selector content is-small">

				<SyozokInput
					ref={e => this.syozokInput = e}
					syozok={syozok}
					resolveBukm={resolveBukm}
					resolveValid={resolveValid}
					onChange={this.syozokInputChange}
					barsIconClick={this.syozokInputBarsIconClick}
					onKeyDown={this.syozokInputKeyDown}
					wheel={this.syozokInputWheel}
				/>

				<SyozokOptions
					ref={e => this.syozokOptions = e}
					show={showOptions}
					buka={buka}
					selected={selected}
					onSelect={this.syozokOptionsSelect}
					onBlur={this.syozokOptionsBlur}
				/>

			</div>
		);
	}
	componentDidMount()
	{
		document.on('mousedown', this.documentMousedown);
	}
	componentWillUnmount()
	{
		document.off('mousedown', this.documentMousedown);
	}
	
	emitChange(syozok)
	{
		this.props.onChange(syozok);
	}
	syozokInputChange = syozok =>
	{
		this.emitChange(syozok);
	}
	syozokOptionsBlur = () =>
	{
		this.hideOptions();
	}
	syozokOptionsSelect = syozok =>
	{
		this.syozokInput.inputSetValue(syozok);
		this.syozokInput.inputSetFocus();
		setTimeout(() =>
		{
			this.hideOptions();
		});
	}
	syozokInputBarsIconClick = () =>
	{
		this.showOptions(this.isOptionsShowing() === false);
	}
	isOptionsShowing()
	{
		return this.state.showOptions;
	}
	showOptions(show = true)
	{
		this.setState({ showOptions: show });
	}
	hideOptions()
	{
		this.showOptions(false);
	}

	syozokInputKeyDown = e =>
	{
		switch (keycodes(e.keyCode))
		{
		case 'enter': 
			if (this.syozokInput.isDirty())
			{
				this.syozokInput.okClick();
			}
			break;
		case 'esc': 
			if (this.syozokInput.isDirty())
			{
				this.syozokInput.cancelClick();
			}
			break;
		}
	}

	syozokInputWheel = e =>
	{
		const delta = e.deltaY < 0 ? -1 : 1;
		this.syozokOptions.scroll(delta);
	}

	// documentマウスダウン制御
	documentMousedown = e =>
	{
		const { clientX: x, clientY: y } = e.touches ? e.touches[0] : e;
		if (
			this.syozokOptions.isShowing() && 
			this.syozokOptions.dom.hittest(x, y) === false && 
			this.syozokInput.barsIcon.hittest(x, y) === false &&
			true
		)
		{
			this.hideOptions();
		}
	}
};
