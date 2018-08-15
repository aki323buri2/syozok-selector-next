import './SyozokInput.scss';
import React from 'react';
import classnames from 'classnames';
import keycodes from 'keycodes';
import { CSSTransition } from 'react-transition-group';
export default class SyozokInput extends React.Component
{
	static defaultProps = {
		syozok: null, 
		onChange: syozok => {}, 
		bukmClick: () => {}, 
		homeIconClick: () => {}, 
		barsIconClick: () => {}, 
		resolveBukm: syozok => '', 
		resolveValid: syozok => false, 
		onKeyDown: e => {}, 
		wheel: e => {}, 
	};
	state = {
		value: '', 
	};
	static getDerivedStateFromProps(props, state)
	{
		const { syozok } = props;
		if (syozok !== state.syozok)
		{
			return { syozok, value: syozok === null ? '' : syozok + '' };
		}
		return null;
	}
	render()
	{
		const {
			value, 
		} = this.state;
		const {
			resolveBukm, 
			onKeyDown, 
		} = this.props;
		const dirty = this.isDirty();
		const valid = this.isValid();
		const bukm = this.getBukm();
		return (
			<div 
				className={classnames([
					'syozok-input', 
					'content is-small', 
				], {
					dirty, 
					valid, 
				})}
			>
				<div 
					className={classnames([
						'control', 
						'has-icons-left', 
						'has-icons-right',
						'content is-small', 
					])} 
				>
					<input  type="text"
						ref={e => this.input = e} 
						className="input is-small"
						value={value}
						onKeyDown={onKeyDown}
						onChange={this.onChange}
					/>
					
					<span 
						ref={e => this.bukm = e}
						className="bukm"
						onClick={this.bukmClick}
					>
						{bukm}
					</span>
					
					<span ref={e => this.homeIcon = e } className="icon is-left" onClick={this.homeIconClick}>
						<i className="fas fa-home"></i>
					</span>
					<span ref={e => this.barsIcon = e } className="icon is-right" onClick={this.barsIconClick}>
						<i className="fas fa-bars"></i>
					</span>
				</div>

				<SaveMenu
					show={dirty}
					okClick={this.okClick}
					cancelClick={this.cancelClick}
				/>
			</div>

		);
	}
	componentDidMount()
	{
		this.input.on('wheel', this.props.wheel);
		this.bukm.on('wheel', this.props.wheel);
	}
	componentWillUnmount()
	{
		this.input.off('wheel', this.props.wheel);
		this.bukm.off('wheel', this.props.wheel);
	}
	inputSetFocus = () =>
	{
		this.input.focus();
	}
	bukmClick = e =>
	{
		this.inputSetFocus();
		this.props.bukmClick();
	}
	homeIconClick = e =>
	{
		this.inputSetFocus();
		this.props.homeIconClick();
	}
	barsIconClick = e =>
	{
		this.inputSetFocus();
		this.props.barsIconClick();
	}
	onChange = e =>
	{
		const value = e.target.value;
		this.inputSetValue(value);
	}
	inputSetValue(value)
	{
		value = value === null ? '' : value + '';
		if (value === '')
		{
			this.setState({ value });
		}
		else
		{
			if (value.match(/^\d{0,3}$/) === null) return;
			this.setState({ value });
		}
	}
	toSyozok(value)
	{
		return value === '' ? null : value * 1;
	}
	isDirty()
	{
		return this.isValid() && this.inputValue() !== this.getSyozok();
	}
	inputValue()
	{
		return this.toSyozok(this.state.value);
	}
	getSyozok()
	{
		return this.props.syozok;
	}
	isValid(syozok)
	{
		if (syozok === undefined) syozok = this.inputValue();
		return this.props.resolveValid(syozok);
	}
	getBukm(syozok)
	{
		if (syozok === undefined) syozok = this.inputValue();
		return this.props.resolveBukm(syozok);
	}

	emitChange = syozok =>
	{
		this.props.onChange(syozok);
	}
	okClick = e =>
	{
		this.emitChange(this.inputValue());
	}
	cancelClick = e =>
	{
		this.inputSetValue(this.getSyozok());
	}
};

const transition = Component => props => (
	<CSSTransition
		timeout={500}
		in={props.show}
		classNames="dropdown"
		unmountOnExit
	>
		<Component {...props}/>
	</CSSTransition>
);
@transition
class SaveMenu extends React.Component
{
	render()
	{
		const { 
			show, 
			okClick, 
			cancelClick, 
		} = this.props;
		return ( 
			<div className="save-menu">
				<Button icon="database" onClick={okClick}>OK</Button>
				<Button icon="times" onClick={cancelClick}>キャンセル</Button>
			</div>
		);
	}
}
const Button = ({
	icon, 
	onClick, 
	children, 
}) => (
	<button className="button is-small" onClick={onClick}>
		<span className="icon">
			<i className={`fas fa-${icon}`}></i>
		</span>
		<span>
			{children}
		</span>
	</button>
);