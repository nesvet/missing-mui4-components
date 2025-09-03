import { Component } from "react";
import { clsx } from "clsx";
import { Button } from "@material-ui/core/esm";
import { GetApp as GetAppIcon } from "@material-ui/icons/esm";
import { createStyles, theme } from "$styles";
import { InputFile } from "../InputFile";


const borderWidth = theme.spacing(.5);

const classes = createStyles(({ spacing, palette, transitions, alpha, zIndex }) => ({
	
	root: {
		position: "relative",
		display: "flex",
		flexFlow: "column nowrap",
		alignItems: "stretch",
		
		"&$readyToDrop": {
			
			"& > *": {
				pointerEvents: "none"
			},
			
			"& $children": {
				opacity: .25
			}
		}
	},
	
	withChildren: {},
	readyToDrop: {},
	
	children: {
		flex: "1 1 auto"
	},
	
	dropzone: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		display: "flex",
		flexFlow: "column nowrap",
		zIndex: zIndex.drawer,
		
		"$withChildren &": {
			pointerEvents: "none"
		},
		
		"$withChildren:not($readyToDrop) &": {
			display: "none"
		},
		
		"$withChildren:$readyToDrop &": {
			opacity: .75
		}
	},
	
	dropzonePadded: {
		padding: spacing(2)
	},
	
	button: {
		flex: "1 1 auto",
		minWidth: "unset",
		padding: 0,
		border: `${borderWidth}px dashed ${palette.divider}`,
		borderRadius: spacing(2),
		transitionProperty: "color, background-color border-color",
		transitionDuration: transitions.duration.shortest,
		
		"$readyToDrop &": {
			backgroundColor: alpha(palette.text.primary, .04)
		},
		
		"& .MuiTouchRipple-root": {
			top: -borderWidth,
			right: -borderWidth,
			bottom: -borderWidth,
			left: -borderWidth
		}
	},
	
	icon: {
		width: spacing(6),
		height: spacing(6),
		opacity: .5
	}
	
}), "Dropzone");


export class Dropzone extends Component {
	
	state = {
		isReadyToDrop: false
	};
	
	handleDragStart = event => {
		event.stopPropagation();
		event.dataTransfer.effectAllowed = "link";
		
	};
	
	handleDragOver = event => {
		event.preventDefault();
		event.stopPropagation();
		event.dataTransfer.dropEffect = "link";
		
	};
	
	handleDragEnter = ({ dataTransfer }) => dataTransfer.items.length && this.setState({ isReadyToDrop: true });
	
	handleDragLeave = ({ target }) => target === this.node && this.setState({ isReadyToDrop: false });
	
	handleDrop = event => {
		event.preventDefault();
		event.stopPropagation();
		
		this.setState({ isReadyToDrop: false });
		
		if (event.dataTransfer.files.length) {
			const [ file ] = event.dataTransfer.files;
			
			const { types, extensions, onFile } = this.props;
			
			if (
				(!types && !extensions) ||
				types?.includes(file.type) ||
				extensions?.includes(file.name.replace(/.+\./, ""))
			)
				onFile?.(file);
		}
		
	};
	
	handleRef = node => (this.node = node);
	
	handleClick = ({ button }) => !button && this.inputFileNode.click();
	
	handleInputFileRef = node => (this.inputFileNode = node);
	
	handleInputFileChange = file => {
		this.props.onFile?.(file);
		this.inputFileNode.value = null;
		
	};
	
	
	render() {
		
		const { className, classes: classesProperty, padded, types, extensions, children, disabled } = this.props;
		const { isReadyToDrop } = this.state;
		
		const enabled = !disabled || null;
		
		return (
			<div
				className={clsx(
					classes.root,
					children && classes.withChildren,
					isReadyToDrop && classes.readyToDrop,
					classesProperty?.root,
					className
				)}
				onDragEnter={enabled && this.handleDragEnter}
				onDragLeave={enabled && this.handleDragLeave}
				onDragOver={enabled && this.handleDragOver}
				onDragStart={enabled && this.handleDragStart}
				onDrop={enabled && this.handleDrop}
				ref={this.handleRef}
			>
				{children && (
					<div
						className={clsx(
							classes.children,
							classesProperty?.children
						)}
					>
						{children}
					</div>
				)}
				{enabled && (
					<div
						className={clsx(
							classes.dropzone,
							padded && classes.dropzonePadded,
							classesProperty?.dropzone
						)}
					>
						<InputFile
							extensions={extensions}
							types={types}
							onChange={this.handleInputFileChange}
							ref={this.handleInputFileRef}
						/>
						<Button
							className={clsx(
								classes.button,
								classesProperty?.button
							)}
							onClick={this.handleClick}
							onDragEnter={this.handleDragEnter}
						>
							<GetAppIcon
								className={clsx(
									classes.icon,
									classesProperty?.icon
								)}
							/>
						</Button>
					</div>
				)}
			</div>
		);
	}
}
