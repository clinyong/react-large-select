A react select component to display large lists of options.

## Install

```
$ npm install react-large-select --save
```

## Usage

```jsx
import { LargeSelect } from "react-large-select";

import "react-large-select/dist/index.css";

const list = [];

for (let i = 0; i < 10000; i++) {
  list.push({
    label: "" + i,
    value: "" + i
  });
}

const selectStyle = {
  width: 200
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      value: ""
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({
      value
    });
  }

  render() {
    return (
      <div style={{ margin: 50 }}>
        <LargeSelect
          list={list}
          value={this.state.value}
          onChange={this.onChange}
          style={selectStyle}
        />
      </div>
    );
  }
}
```

## Related

- [react-scroll-list](https://github.com/clinyong/react-scroll-list)
