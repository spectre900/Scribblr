import axios from 'axios';
import download from 'downloadjs';
import React, { Component, createRef } from 'react';
import Excalidraw, { exportToCanvas } from '@excalidraw/excalidraw';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Container, ListGroup, ListGroupItem} from 'react-bootstrap';

import styles from './ExcalidrawApp.module.css';

class ExcalidrawApp extends Component {

  constructor(){

    super();
    this.state={
      zenMode: false,
      viewMode: false,
      gridMode: true,
      latestState: [],
      latestElement: [],
      images: []
    }
    
    this.ref = createRef();
    this.id = window.location.href.split('/').pop();

    this.download = this.download.bind(this);
    this.syncData = this.syncData.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  syncData(){
    
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
      }).catch((err)=>{
        console.log(err);
      });
    },
    'image/jpeg',
    0.5,
    );

    axios.get('/api/show').then((res)=>{
      this.setState({
        images: res.data.images
      });
    }).catch((err)=>{
      console.log(err);
    });

  }

  componentDidMount() {
    this.syncData();
    setInterval(this.syncData,10000);
  }

  handleOnChange(element, state){
    this.setState({
      latestElement: element,
      latestState: state
    });
  }

  download(name){
    fetch('/api/download/'+name).then((res)=>{
      res.blob().then((blob)=>{
        download(blob, name);
      })
    }).catch((err)=>{
      console.log(err);
    });
  }

  renderItems(name, index){
      return (
      <ListGroupItem className={styles.item}>
        {name}
        <button className={styles.download} onClick={() => this.download(name)} />
      </ListGroupItem>
      );
  }

  render() {
    return (
      <Container fluid className={styles.holder}>
        <Row>
         <Col xl={8}>
          <Row>
            <Col xl={6}>
              <h1 className={styles.header}>
                Excalidraw
              </h1>
            </Col>
            <Col xl={6} className={styles.modes}>
              <button 
                onClick={() => {this.ref.current.resetScene();}}
                className={styles.reset_button}
              >
                Reset Screen
              </button>
              <label className={styles.labels}>
                <input
                  type='checkbox'
                  className={styles.check}
                  checked={this.state.viewMode}
                  onChange={() => this.setState({viewMode: !this.state.viewMode})}
                />
                View mode
              </label>
              <label className={styles.labels}>
                <input
                  type='checkbox'
                  className={styles.check}
                  checked={this.state.zenMode}
                  onChange={() => this.setState({zenMode: !this.state.zenMode})}
                />
                Zen  mode
              </label>
              <label className={styles.labels}>
                <input
                  type='checkbox'
                  className={styles.check}
                  checked={this.state.gridMode}
                  onChange={() => this.setState({gridMode: !this.state.gridMode})}
                />
                Grid mode
              </label>
            </Col>
          </Row>
          <Row>
            <Col>
            <div className={styles.drawboard}>
              <Excalidraw
                ref={this.ref}
                onChange={this.handleOnChange}
                viewModeEnabled={this.state.viewMode}
                zenModeEnabled={this.state.zenMode}
                gridModeEnabled={this.state.gridMode}
              />
            </div>
            </Col>
          </Row>
         </Col>
         <Col xl={4}>
            <div className={styles.list}>
              <h1 className={styles.title}>
                Saved Images
              </h1>
              <ListGroup>
                {this.state.images.map(this.renderItems)}
              </ListGroup>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ExcalidrawApp;