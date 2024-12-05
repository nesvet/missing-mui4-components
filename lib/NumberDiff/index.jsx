import { Component } from "react";
import clsx from "clsx";
import { createStyles } from "$styles";


const classes = createStyles(({ palette }) => ({
	
	root: {
		color: palette.text.primary
	},
	
	positive: {
		color: palette.success.main
	},
	
	negative: {
		color: palette.error.main
	}
	
}), "NumberDiff");


export class NumberDiff extends Component {
	
	shouldComponentUpdate({ number }) {
		return this.props.number != number;
	}
	
	render() {
		
		const { component: Component = "span", className, number, before, after, invert, persist } = this.props;
		
		return (!number && !persist) ? null : (
			<Component className={clsx(classes.root, invert ? (number < 0 ? classes.positive : number > 0 && classes.negative) : (number > 0 ? classes.positive : number < 0 && classes.negative), className)}>
				{before}
				{number && (number > 0 ? `+${number}` : `−${-number}`)}
				{after}
			</Component>
		);
	}
	
}

export default NumberDiff;
