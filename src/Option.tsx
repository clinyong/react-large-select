import * as React from "react";

export interface OptionValue {
  value: string;
  label: string;
}

export interface OptionProps extends OptionValue {
  style: React.CSSProperties;
  onClick: (value: OptionValue) => void;
}

export class Option extends React.PureComponent<OptionProps, {}> {
  onClick = () => {
    const { value, label } = this.props;
    this.props.onClick({
      value,
      label
    });
  };

  render() {
    const { style, label } = this.props;
    return (
      <li className="large-select-option" style={style} onClick={this.onClick}>
        <span className="large-select-option-value">{label}</span>
      </li>
    );
  }
}
