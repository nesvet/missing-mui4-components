import { Component } from "react";
import clsx from "clsx";
import MuiDialog from "@material-ui/core/esm/Dialog";
import MuiDialogTitle from "@material-ui/core/esm/DialogTitle";
import DialogContent from "@material-ui/core/esm/DialogContent";
import DialogActions from "@material-ui/core/esm/DialogActions";
import Typography from "@material-ui/core/esm/Typography";
import Button from "@material-ui/core/esm/Button";
import { createStyles, theme } from "$styles";


const classes = createStyles(({ spacing, palette, shape, alpha }) => ({
	
	root: {
		
		"& .MuiBackdrop-root": {
			backgroundColor: "rgba(0, 0, 0, 0.15)",
			backdropFilter: `blur(${spacing(.25)}px)`
		},
		
		"& .MuiDialog-container": {
			transition: "none !important"
		}
	},
	
	relative: {
		
		"&, & .MuiBackdrop-root": {
			position: "absolute !important"
		}
	},
	
	paper: {
		borderRadius: shape.borderRadius * 2.5,
		overflow: "hidden"
	},
	
	overflow: {
		overflowY: "overlay",
		marginRight: -spacing(.25),
		paddingRight: spacing(.25)
	},
	
	title: {
		position: "sticky",
		top: 0,
		right: 0,
		left: 0,
		paddingTop: spacing(2.75),
		backgroundColor: alpha(palette.background.paper, .7),
		backdropFilter: `blur(${spacing(1)}px)`,
		zIndex: 1
	},
	
	subtitle: {
		marginTop: spacing(1.5),
		lineHeight: 1.4,
		whiteSpace: "pre-wrap"
	},
	
	content: {
		"--gap": spacing(2)+"px",
		display: "flex",
		flexFlow: "column nowrap",
		gap: "var(--gap)",
		paddingTop: `calc(var(--gap) - ${spacing(1)}px)`,
		overflow: "visible",
		
		"& > .MuiFormLabel-root": {
			marginBottom: -spacing(.5)
		}
	},
	
	actions: {
		position: "sticky",
		right: 0,
		bottom: 0,
		left: 0,
		padding: spacing(1),
		backgroundColor: alpha(palette.background.paper, .7),
		backdropFilter: `blur(${spacing(1)}px)`,
		zIndex: 1,
		
		"& .MuiButtonBase-root": {
			padding: [ spacing(1), spacing(2) ]
		}
	},
	
	actionsSpace: {
		flexGrow: 1
	}
	
}), "Dialog");

const dialogClasses = {
	root: classes.root,
	paper: classes.paper
};


export const DialogTitle = ({ className, ...restProps }) => (
	<Typography
		className={clsx(classes.title, className)}
		variant="h3"
		component={MuiDialogTitle}
		disableTypography
		{ ...restProps }
	/>
);


export const DialogSubtitle = ({ className, ...restProps }) => (
	<Typography className={clsx(classes.subtitle, className)} variant="h6" { ...restProps } />
);


export default class Dialog extends Component {
	constructor(props, initialState) {
		super(props);
		
		this.initialState = initialState;
		
		this.state = {
			isOpened: false,
			...initialState
		};
		
	}
	
	closeButtonLabel = "Закрыть";
	
	classes = {};
	
	maxWidth = this.props.maxWidth ?? "sm";
	
	fullWidth = this.props.fullWidth ?? true;
	
	transitionDuration = this.props.transitionDuration ?? { enter: theme.transitions.duration.enteringScreen, exit: 0 };
	
	isRelative = this.props.relative ?? false;
	
	open = (...args) => {
		this.onOpen?.(...args);
		this.props.onOpen?.(...args);
		this.setState({ isOpened: true, ...this.handleOpenState?.(...args) });
		
	};
	
	close = () => {
		
		if (this.state.isOpened) {
			this.onClose?.();
			this.props.onClose?.();
			this.setState({ isOpened: false, ...this.initialState });
			setTimeout(() => document.activeElement.blur(), 0);
		}
		
	};
	
	shouldComponentUpdate(_, nextState) {
		return this.state.isOpened || nextState.isOpened;
	}
	
	
	render() {
		
		const { isOpened } = this.state;
		
		if (isOpened) {
			this.renderedTitle = this.renderTitle ? this.renderTitle() : (
				<DialogTitle className={this.classes.title}>
					
					{this.getTitle ? this.getTitle() : this.title}
					
					{this.renderSubtitle ? this.renderSubtitle() : (this.getSubtitle || this.subtitle) && (
						<DialogSubtitle className={this.classes.subtitle}>
							{this.getSubtitle ? this.getSubtitle() : this.subtitle}
						</DialogSubtitle>
					)}
					
				</DialogTitle>
			);
			
			this.renderedContent = this.renderContent();
			
			this.renderedCloseButton =
				this.closeButton === false ?
					null :
				this.renderCloseButton ?
					this.renderCloseButton() :
				(
					<Button onClick={this.close} tabIndex={this.closeButtonTabIndex}>
						{this.closeButtonLabel}
					</Button>
				);
			
			this.renderedActions = (this.renderedCloseButton || this.renderActions) ? (
				<DialogActions className={clsx(classes.actions, this.classes.actions)}>
					{this.renderedCloseButton ? (<>
						{this.renderedCloseButton}
						<div className={classes.actionsSpace} />
					</>) : null}
					{this.renderActions?.()}
				</DialogActions>
			) : null;
			
		}
		
		return (
			<MuiDialog
				className={clsx(this.className, this.isRelative && classes.relative)}
				classes={dialogClasses}
				open={isOpened}
				onClose={this.close}
				fullWidth={this.fullWidth}
				maxWidth={this.maxWidth}
				keepMounted
				disablePortal={this.isRelative ?? false}
				transitionDuration={this.transitionDuration}
			>
				<div className={classes.overflow}>
					
					{this.renderedTitle}
					
					<DialogContent className={clsx(classes.content, this.classes.content)}>
						{this.renderedContent}
					</DialogContent>
					
					{this.renderedActions}
					
				</div>
			</MuiDialog>
		);
	}
	
	
	static Title = DialogTitle;
	
	static Subtitle = DialogSubtitle;
	
}
