import React, { Component } from 'react';
import Excalidraw, { exportToCanvas } from '@excalidraw/excalidraw';
import axios from 'axios';
import { v4 } from 'uuid';

import './App.css';

class App extends Component {

  constructor(){
    super();
    this.id = v4();
    this.ref = React.createRef();
    this.state={
      zenMode: false,
      viewMode: false,
      gridMode: false,
      latestState: [],
      latestElement: []
    }
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentDidMount() {
    setInterval(
      ()=>{
        const canvas = exportToCanvas({
          elements: this.state.latestElement,
          appState: this.state.latestState,
        });

        canvas.toBlob((blob)=>{

          var data = new FormData();
          data.append('img', blob, this.id+'.jpeg');
  
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          };
  
          axios.post('/api/save', data, config).then(response => {
            console.log(response.data)
          });
        },
        'image/jpeg',
        0.5,
        );

      },
      10000
    );
  }

  handleOnChange(element, state){
    this.setState({
      latestElement: element,
      latestState: state
    });
  }

  render() {
    return (
      <div className="holder">
        <h1> Excalidraw </h1>
        <div>
          <button
            onClick={() => {
              this.ref.current.resetScene();
            }}
          >
            Reset Scene
          </button>
          <label>
            <input
              type="checkbox"
              checked={this.state.viewMode}
              onChange={() => this.setState({viewMode: !this.state.viewMode})}
            />
            View mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.zenMode}
              onChange={() => this.setState({zenMode: !this.state.zenMode})}
            />
            Zen mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.gridMode}
              onChange={() => this.setState({gridMode: !this.state.gridMode})}
            />
            Grid mode
          </label>
        </div>
        <div className="drawboard">
          <Excalidraw
            ref={this.ref}
            onChange={this.handleOnChange}
            viewModeEnabled={this.state.viewMode}
            zenModeEnabled={this.state.zenMode}
            gridModeEnabled={this.state.gridMode}
          />
        </div>
      </div>
    );
  }
}

export default App;