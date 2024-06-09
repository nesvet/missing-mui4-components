import { Component, forwardRef } from "react";
import { clsx } from "clsx";
import { createStyles } from "$styles";


const classes = createStyles({
	
	root: {
		display: "none"
	}
	
}, "InputFile");


class InputFileComponent extends Component {
	
	#acceptMemo;
	#accept;
	
	handleChange = ({ target: { files: [ file ] } }) => file && this.props.onChange?.(file);
	
	
	render() {
		
		const { className, types, extensions, innerRef, onChange, ...restProps } = this.props;
		
		const acceptMemo = (types?.join("") ?? "") + (extensions?.join("") ?? "");
		if (this.#acceptMemo !== acceptMemo) {
			this.#acceptMemo = acceptMemo;
			this.#accept = (!types && !extensions) ? null : [ ...(types ?? []), ...(extensions?.map(extension => `.${extension}`) ?? []) ].join(",");
		}
		
		return (
			<input
				className={clsx(classes.root, className)}
				{...restProps}
				type="file"
				accept={this.#accept}
				onChange={this.handleChange}
				ref={innerRef}
			/>
		);
	}
}

export const InputFile = forwardRef((props, reference) => (
	<InputFileComponent {...props} innerRef={reference} />
));

InputFile.displayName = "InputFile";
