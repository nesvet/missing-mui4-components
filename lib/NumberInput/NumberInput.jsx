import { Component } from "react";
import { clsx } from "clsx";
import {
	Button,
	ButtonGroup,
	InputAdornment,
	TextField
} from "@material-ui/core/esm";
import {
	KeyboardArrowDown as KeyboardArrowDownIcon,
	KeyboardArrowUp as KeyboardArrowUpIcon
} from "@material-ui/icons/esm";
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
	
	#handleDecrementClick = ({ ctrlKey, metaKey, shiftKey }) => {
		this.inputNode.stepDown(shiftKey ? 100 : ((ctrlKey || metaKey) ? 10 : 1));
		
		const { value, valueAsNumber } = this.inputNode;
		
		if (value !== this.state.value) {
			this.props.onChange?.(valueAsNumber);
			this.props.onInput?.(valueAsNumber);
			
			this.setState({ value });
		}
		
	};
	
	#handleIncrementClick = ({ ctrlKey, metaKey, shiftKey }) => {
		this.inputNode.stepUp(shiftKey ? 100 : ((ctrlKey || metaKey) ? 10 : 1));
		
		const { value, valueAsNumber } = this.inputNode;
		
		if (value !== this.state.value) {
			this.props.onChange?.(valueAsNumber);
			this.props.onInput?.(valueAsNumber);
			
			this.setState({ value });
		}
		
	};
	
	#handleFocus = event => {
		event.target.select();
		
		this.props.onFocus?.(event);
		
		this.state.focused = true;
		
	};
	
	#handleBlur = event => {
		this.props.onBlur?.(event);
		
		this.setState({ focused: false });
		
	};
	
	#handleChange = ({ target: { value, valueAsNumber } }) => {
		
		const { min, max, onChange, onInput } = this.props;
		
		if (!Number.isNaN(valueAsNumber) && valueAsNumber === Math.max(Math.min(valueAsNumber, max), min)) {
			onChange?.(valueAsNumber);
			onInput?.(valueAsNumber);
		}
		
		this.setState({ value });
		
	};
	
	/* Prevent from increment/decrement by wheel */
	#handleWheel = event => {
		if (event.target === document.activeElement) {
			event.target.blur();
			event.stopPropagation();
			
			setTimeout(() => event.target.focus(), 0);
		}
		
	};
	
	inputNode;
	#handleInputRef = inputNode => { this.inputNode = inputNode; };
	
	
	static getDerivedStateFromProps({ value }, { focused }) {
		return focused ? null : { value };
	}
	
	
	render() {
		
		const {
			className,
			onFocus, // eslint-disable-line no-unused-vars
			onBlur, // eslint-disable-line no-unused-vars
			onChange, // eslint-disable-line no-unused-vars
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
			<Button tabIndex="-1" onClick={this.#handleIncrementClick}>
				<KeyboardArrowUpIcon />
			</Button>
		);
		
		const decrementButton = (
			<Button tabIndex="-1" onClick={this.#handleDecrementClick}>
				<KeyboardArrowDownIcon />
			</Button>
		);
		
		return (
			<TextField
				className={clsx(classes.root, compact ? classes.compact : classes.normal, className)}
				type="number"
				value={value}
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
				onBlur={this.#handleBlur}
				onChange={this.#handleChange}
				onFocus={this.#handleFocus}
				onWheel={this.#handleWheel}
				disabled={disabled}
				inputRef={this.#handleInputRef}
				{...TextFieldProps}
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
