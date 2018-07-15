import * as React from "react";
import { Option, OptionValue } from "./Option";
import { ScrollList } from "@clinyong/react-scroll-list";
import * as throttle from "lodash.throttle";

const containerHeight = 256;

export interface LargeSelectState {
  open: boolean;
  selectValue: string;
  showList: OptionValue[];
  inputValue: string;
  clearVisible: boolean;
}

export interface LargeSelectProps {
  value?: string;
  showSearch?: boolean;
  list: OptionValue[];
  onChange?: (val: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  className?: string;
}

export type OptionValue = OptionValue;

export class LargeSelect extends React.PureComponent<
  LargeSelectProps,
  LargeSelectState
> {
  static Option = Option;
  containerNode: HTMLDivElement;
  input: HTMLInputElement;

  static defaultProps: Partial<LargeSelectProps> = {
    placeholder: ""
  };

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectValue: "",
      showList: [],
      inputValue: "",
      clearVisible: false
    };

    this.filterList = throttle(this.filterList.bind(this), 300);
  }

  hide = () => {
    this.setState({
      open: false,
      inputValue: "",
      showList: this.props.list
    });
  };

  toggle = e => {
    if (e.target !== this.input) {
      const { open } = this.state;
      this.setState({
        open: !open
      });

      if (open) {
        this.input.blur();
        this.hide();
      } else {
        this.input.focus();
      }
    }
  };

  globalClick = (e: any) => {
    if (!this.containerNode.contains(e.target)) {
      this.hide();
    }
  };

  onChange = (o: OptionValue) => {
    if (o.label !== this.state.selectValue) {
      this.setState({
        selectValue: o.label
      });
      this.props.onChange(o.value);
    }
  };

  rowRenderer = ({
    index, // Index of row within collection
    style // Style object to be applied to row (to position it)
  }) => {
    const { label, value } = this.state.showList[index];

    return (
      <Option
        key={index}
        style={style}
        onClick={this.onChange}
        label={label}
        value={value}
      />
    );
  };

  filterList = (val: string) => {
    val = val.toLowerCase();
    this.setState({
      showList: this.props.list.filter(item =>
        item.label.toLowerCase().includes(val)
      )
    });
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    this.setState({
      inputValue
    });

    this.filterList(inputValue);
  };

  clearSelectVal = (e: React.MouseEvent<any>) => {
    e.stopPropagation();
    this.hideClear();
    this.onChange({
      label: "",
      value: ""
    });
  };

  showClear = () => {
    const { selectValue, open } = this.state;

    this.setState({
      clearVisible: !open && !!selectValue
    });
  };

  hideClear = () => {
    this.setState({
      clearVisible: false
    });
  };

  mapPropstoState = (props: LargeSelectProps) => {
    let selectValue = "";
    if (props.value) {
      const item = props.list.find(item => item.value === props.value);
      if (item) {
        selectValue = item.label;
      }
    }

    this.setState({
      showList: props.list,
      selectValue
    });
  };

  componentWillReceiveProps(nextProps: LargeSelectProps) {
    this.mapPropstoState(nextProps);
  }

  componentDidMount() {
    this.mapPropstoState(this.props);
    document.addEventListener("click", this.globalClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.globalClick);
  }

  render() {
    const {
      open,
      selectValue,
      showList,
      inputValue,
      clearVisible
    } = this.state;
    const { style, placeholder, className } = this.props;

    let selectedCls = "large-select-select-value";
    if (!selectValue && placeholder) {
      selectedCls = selectedCls + " large-select-select-placeholder";
    }

    let containerCls = open
      ? "large-select-container-highlight"
      : "large-select-container";
    if (className) {
      containerCls = containerCls + " " + className;
    }

    return (
      <div
        className={containerCls}
        onClick={this.toggle}
        onMouseOver={this.showClear}
        onMouseLeave={this.hideClear}
        ref={c => (this.containerNode = c)}
        style={style}
      >
        <input
          type="text"
          className="large-select-search-input"
          ref={i => (this.input = i)}
          onChange={this.onInputChange}
          value={inputValue}
        />
        <div
          className={selectedCls}
          style={{ visibility: open ? "hidden" : "visible" }}
        >
          <span>{selectValue || placeholder}</span>
        </div>
        <ul
          className="large-select-option-list"
          style={{ height: open ? containerHeight : 0 }}
        >
          <ScrollList
            height={containerHeight}
            rowHeight={32}
            total={showList.length}
            rowRenderer={this.rowRenderer}
          />
        </ul>
        {clearVisible && (
          <span className="large-select-clear" onClick={this.clearSelectVal} />
        )}
      </div>
    );
  }
}
