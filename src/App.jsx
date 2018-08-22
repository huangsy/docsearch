import React, { Component } from 'react';
import { AutoComplete } from 'zent';
import axios from 'axios';
import each from 'lodash/each';
import trim from 'lodash/trim';
import map from 'lodash/map';
import isArray from 'lodash/isArray';
import './style.scss';

const titlePattern = /[h1|h2|h3|h4|h5|h6]/;

class App extends Component {
  state = {
    result: [],
    value: ''
  };

  componentDidMount() {
    axios.get('docs.json').then(response => {
      this.datasets = this.parse(response.data);
    });
  }

  highlight(source, target) {
    const index = source.indexOf(target);
    const len = target.length;
    if (index < 0) return source;
    return <span>{source.slice(0, index)}<span style={{ backgroundColor: 'yellow' }}>{target}</span>{source.slice(index + len)}</span>;
  }

  handleSearch = (value) => {
    let result = [];
    each(this.datasets, data => {
      let { title, desc, path, group } = data;
      const titleIndex = title ? title.indexOf(value) : -1;
      const descIndex = desc ? desc.indexOf(value) : -1;
      if (value && (titleIndex > -1 || descIndex > -1)) {
        desc = desc ? desc.slice(descIndex, descIndex + 50) : '';
        result.push({
          title: this.highlight(title, value),
          path,
          group,
          desc: this.highlight(desc, value)
        });
      }
    });
    this.setState({
      result,
      value
    });
  }

  handleSelect = (path) => {
    const { value } = this.state;
    path = path.replace(/^\d+-/, '');
    window.open(`http://bizcharts.net/products/bizCharts/${path}`);
    this.setState({
      value
    });
  }

  getJsonmlString(e) {
    for (var t = "", r = 1; r < e.length; r++)
        Array.isArray(e[r]) ? t += this.getJsonmlString(e[r]) : "string" == typeof e[r] && (t += e[r] + " ");
    return t
  }

  parse(datasets) {
    const result = [];
    let count = -1;
    let group = '';
    each(datasets, data => {
      const { path, jsonml } = data;
      each(jsonml.slice(1), item => {
        if (titlePattern.test(item[0]) && typeof item[1] === 'string') {
          const title = trim(item[1].replace(/\d+、/, ''));
          const hash = title.replace(/\s/, '-').toLowerCase();
          count++;
          if (item[0] === 'h1') {
            group = item[1];
          }
          result[count] = result[count] || {
            path: `${data.path}#${hash}`,
            title,
            group
          }
        } else if (count > -1 && item[0] !== 'pre') {
          result[count].desc += this.getJsonmlString(item);
        }
      });
    });
    return result;
  }

  parseDesc(data) {
    if (isArray(data)) {
      return this.parseDesc(data[1]);
    }
    if (typeof data === 'string') {
      return data;
    }
    return '';
  }

  render() {
    const { result, value } = this.state;
    const data = map(result, (item, index) => ({
      value: `${index}-${item.path}`,
      content: (
        <div>
          <p>{item.group} - {item.title}</p>
          <p>{item.desc}</p>
        </div>
      )
    }));
    return (
      <AutoComplete
        data={data}
        value={value}
        onSelect={this.handleSelect}
        onSearch={this.handleSearch}
        filterOption={() => true}
      />
    );
  }
}

export default App;