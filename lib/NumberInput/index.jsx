import { Component } from "react";
import clsx from "clsx";
import Button from "@material-ui/core/esm/Button";
import ButtonGroup from "@material-ui/core/esm/ButtonGroup";
import InputAdornment from "@material-ui/core/esm/InputAdornment";
import TextField from "@material-ui/core/esm/TextField";
import KeyboardArrowDownIcon from "@material-ui/icons/esm/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/esm/KeyboardArrowUp";
import { createStyles } from "$styles";


const classes = createStyles(({ spacing, palette }) => ({
	
	root: {
		
		"& .MuiInputBase-input": {
			flex: "1 1 auto",
			
			"&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
				"-webkit-appearance": "none",
				margin: 0
			}
		},
		
		"& .MuiInputAdornment-positionEnd": {
			marginLeft: 0,
			color: palette.text.secondary
		},
		
		"& .Mui-disabled": {
			
			"& .MuiInputAdornment-positionEnd": {
				color: palette.text.disabled
			}
		}
	},
	normal: {},
	compact: {},
	
	spinner: {
		marginLeft: spacing(.5),
		
		"& .MuiButton-root": {
			padding: 0,
			
			"&.Mui-disabled": {
				opacity: .5
			}
		},
		
		"$normal &": {
			
			"& .MuiButton-root": {
				height: spacing(3),
				minWidth: spacing(4)
			}
		},
		
		"$compact &": {
			
			"& .MuiButton-root": {
				minWidth: spacing(2.5),
				fontSize: "1em",
				
				"& .MuiSvgIcon-root": {
					fontSize: "inherit"
				}
			}
		}
	}
	
}), "NumberInput");


export class NumberInput extends Component {
	
	state = {
		value: Number.parseFloat(this.props.value) || "",
		focused: false
	};
	
	getNearestValidValue(index) {
		return Number.parseFloat(this.inputNode.validationMessage.match(/\d+((\.|,)\d+)?/g)[index].replace(/,/, "."));
	}
	
	handleDecrementClick = ({ ctrlKey, metaKey, shiftKey }) => {
		this.inputNode.stepDown(shiftKey ? 100 : (ctrlKey || metaKey) ? 10 : 1);
		
		const { value, valueAsNumber } = this.inputNode;
		
		if (value != this.state.value) {
			this.props.onChange(valueAsNumber);
			
			this.setState({ value });
		}
		
	};
	
	handleIncrementClick = ({ ctrlKey, metaKey, shiftKey }) => {
		this.inputNode.stepUp(shiftKey ? 100 : (ctrlKey || metaKey) ? 10 : 1);
		
		const { value, valueAsNumber } = this.inputNode;
		
		if (value != this.state.value) {
			this.props.onChange(valueAsNumber);
			
			this.setState({ value });
		}
		
	};
	
	handleFocus = event => {
		event.target.select();
		this.props.onFocus?.(event);
		
		this.setState({ focused: true });
		
	};
	
	handleBlur = event => {
		this.props.onBlur?.(event);
		
		this.setState({ focused: false });
		
	};
	
	handleChange = ({ target: { value, valueAsNumber } }) => {
		
		const { min, max, onChange } = this.props;
		
		if (!isNaN(valueAsNumber) && valueAsNumber == Math.max(Math.min(valueAsNumber, max), min))
			onChange(valueAsNumber);
		
		this.setState({ value });
		
	};
	
	/* Prevent from increment/decrement by wheel */
	handleWheel = event => {
		if (event.target == document.activeElement) {
			event.target.blur();
			event.stopPropagation();
			setTimeout(() => event.target.focus(), 0);
		}
		
	};
	
	handleInputRef = inputNode => this.inputNode = inputNode;
	
	
	static getDerivedStateFromProps({ value }, { focused }) {
		return focused ? null : { value };
	}
	
	
	render() {
		
		const {
			className,
			onFocus,
			onBlur,
			onChange,
			spinner,
			compact,
			inputEndAdornmentBefore,
			inputEndAdornmentAfter,
			inputProps = {},
			min,
			max,
			step,
			disabled,
			InputProps,
			...TextFieldProps
		} = this.props;
		const { value } = this.state;
		
		inputProps.step = step;
		inputProps.min = min;
		inputProps.max = max;
		
		const incrementButton = (
			<Button tabIndex="-1" onClick={this.handleIncrementClick}>
				<KeyboardArrowUpIcon />
			</Button>
		);
		
		const decrementButton = (
			<Button tabIndex="-1" onClick={this.handleDecrementClick}>
				<KeyboardArrowDownIcon />
			</Button>
		);
		
		return (
			<TextField
				className={clsx(classes.root, compact ? classes.compact : classes.normal, className)}
				type="number"
				InputProps={{
					endAdornment: (inputEndAdornmentBefore || spinner !== false || inputEndAdornmentAfter) ? (
						<InputAdornment position="end">
							{inputEndAdornmentBefore}
							{spinner !== false && (
								<ButtonGroup
									className={classes.spinner}
									color="inherit"
									disableElevation
									orientation={compact ? "vertical" : "horizontal"}
									variant="text"
									disabled={disabled}
								>
									{!compact && decrementButton}
									{incrementButton}
									{compact && decrementButton}
								</ButtonGroup>
							)}
							{inputEndAdornmentAfter}
						</InputAdornment>
					) : null,
					...InputProps
				}}
				inputProps={inputProps}
				onBlur={this.handleBlur}
				onChange={this.handleChange}
				onFocus={this.handleFocus}
				onWheel={this.handleWheel}
				disabled={disabled}
				{...TextFieldProps}
				value={value}
				inputRef={this.handleInputRef}
			/>
		);
	}
	
	
	static defaultProps = {
		step: 1,
		min: -Infinity,
		max: Infinity
	};
	
	static classes = classes;
	
}

export default NumberInput;
