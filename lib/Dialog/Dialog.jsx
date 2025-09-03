import { Component } from "react";
import { clsx } from "clsx";
import {
	Button,
	Dialog as MuiDialog,
	DialogActions,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	Typography
} from "@material-ui/core/esm/";
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
		"--gap": `${spacing(2)}px`,
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
		component={MuiDialogTitle}
		disableTypography
		variant="h3"
		{...restProps}
	/>
);


export const DialogSubtitle = ({ className, ...restProps }) => (
	<Typography className={clsx(classes.subtitle, className)} variant="h6" {...restProps} />
);


export class Dialog extends Component {
	constructor(props, initialState) {
		super(props);
		
		this.initialState = initialState;
		
		this.state = {
			isOpened: false,
			...initialState
		};
		
	}
	
	closeButtonLabel = this.props.closeButtonLabel;
	
	classes = {};
	
	maxWidth = this.props.maxWidth ?? "sm";
	
	fullWidth = this.props.fullWidth ?? true;
	
	transitionDuration = this.props.transitionDuration ?? { enter: theme.transitions.duration.enteringScreen, exit: 0 };
	
	isRelative = this.props.relative ?? false;
	
	open = (...arguments_) => {
		this.onOpen?.(...arguments_);
		this.props.onOpen?.(...arguments_);
		this.setState({ isOpened: true, ...this.handleOpenState?.(...arguments_) });
		
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
					(this.renderCloseButton ?
						this.renderCloseButton() :
						(
							<Button tabIndex={this.closeButtonTabIndex} onClick={this.close}>
								{this.closeButtonLabel}
							</Button>
						));
			
			this.renderedActions = (this.renderedCloseButton || this.renderActions) ? (
				<DialogActions className={clsx(classes.actions, this.classes.actions)}>
					{this.renderedCloseButton ? (
						<>
							{this.renderedCloseButton}
							<div className={classes.actionsSpace} />
						</>
					) : null}
					{this.renderActions?.()}
				</DialogActions>
			) : null;
			
		}
		
		return (
			<MuiDialog
				className={clsx(this.className, this.isRelative && classes.relative)}
				classes={dialogClasses}
				disablePortal={this.isRelative ?? false}
				fullWidth={this.fullWidth}
				keepMounted
				maxWidth={this.maxWidth}
				open={isOpened}
				transitionDuration={this.transitionDuration}
				onClose={this.close}
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
	
	
	static defaultProps = {
		closeButtonLabel: "Close"
	};
	
	static Title = DialogTitle;
	
	static Subtitle = DialogSubtitle;
	
}
