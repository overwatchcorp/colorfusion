import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    // initialize state
    this.state = {
      file: {},
      result: '',
    };
    // bind this to methods
    this.processFile = this.processFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.processFile();
  }
  processFile() {
    // fetch from storage
    const result = this.state.result;
    const trial = /(?:Picture\t)([0-9]+)(?:\t[0-9]+)+\t\w+\t[0-9]\w+[0-9]+\tother\t[0-9]\r\W\w+\t[0-9]+\tResponse\t([0-9]+)\t[0-9]+\t[0-9]+[0-9]+\t[0-9]+\r\W\w+\t[0-9]+\tResponse\t([0-9]+)\t[0-9]+\t[0-9]+[0-9]+\t[0-9]+/g;
    let data;
    let values = [];
    do {
      data = trial.exec(result);
      if (data) {
        values.push(data.slice(1,4));
      }
    } while (data);
    if (values.length <= 0) return this.setState({ err: "Invalid file!" });
    return this.setState({ values, err: null });
  }
  handleChange(files) {
    // get file object from array
    const file = files[0];
    // craete file reader
    const reader = new FileReader();
    // when file has been read in, put it instate
    reader.onload = (e) => {
      this.setState({ result: e.target.result, name: file.name }, this.processFile);
    };
    // read in file as text
    reader.readAsText(file);
  }
  render() {
    let renderedValues = [];
    // haha random keys because fuck cacheing
    if (this.state.values) renderedValues = this.state.values.map((v) => (<tr key={Math.random()}>
      <td>{v[0]}</td>
      <td>{v[1]}</td>
      <td>{v[2]}</td>
    </tr>));
    return (
      <div className="App">
        <div className="container col-md-4 d-float justify-content-center align-items-middle">
          <div className="row mt-1">
            <div className="custom-file">
              <input type="file" onChange={ e => this.handleChange(e.target.files) } className="custom-file-input" id="input" />
              <label className="custom-file-label" htmlFor="input">
                {
                  (this.state.name) ?
                    this.state.name
                    : 'Choose file'
                }
              </label>
            </div>
          </div>
          {
            (this.state.err && this.state.name) ?
              <div className="alert alert-danger mt-3" role="alert">
                { this.state.err }
              </div>
              : null
          }
          { (renderedValues.length > 0) ?
          <div className="row mt-1">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th scope="col">Picture</th>
                  <th scope="col">Response 1</th>
                  <th scope="col">Response 2</th>
                </tr>
              </thead>
              <tbody>
                { renderedValues }
              </tbody>
            </table>
          </div>
          : null }
        </div>
        <div className="container-fluid text-right">
          <small>Made by <a href="https://github.com/overwatchcorp">Jasper Fung</a></small>
        </div>
      </div>
    );
  }
}

export default App;
