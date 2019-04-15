/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import api from "../../services/api";

import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";
/*import moment from "moment";
import "moment/locale/pt-br";*/

import Dropzone from "react-dropzone";
import socket from "socket.io-client";

import { MdInsertDriveFile } from "react-icons/md";
import logo from "../../assets/logo.svg";

import "./styles.css";

export default class Box extends Component {
  state = {
    box: {}
  };
  async componentDidMount() {
    this.subscribeToNewFiles();

    const box = this.props.match.params.id;

    const { data } = await api.get(`/boxes/${box}`);
    console.log(data);
    this.setState({ box: data });
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket("https://week-5-backend.herokuapp.com");

    io.emit("connectRoom", box);
    io.on("file", data => {
      this.setState({
        box: {
          ...this.state.box,
          files: [data, ...this.state.box.files]
        }
      });
    });
  };

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      const box = this.props.match.params.id;

      data.append("file", file);

      api.post(`boxes/${box}/files`, data);
    });
  };
  render() {
    const { box } = this.state;
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1> {box.title}</h1>
        </header>
        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>
        <ul>
          {box.files &&
            box.files.map(file => (
              <li key={file.id}>
                <a className="fileInfo" href={file.url} target="_blank">
                  <MdInsertDriveFile size={24} color="#a5cfff" />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  há{" "}
                  {distanceInWords(file.createdAt, new Date(), {
                    locale: pt
                  })}
                </span>
              </li>
            ))}

          <li>
            <a className="fileInfo" href=" ">
              <MdInsertDriveFile size={24} color="#a5cfff" />
              <strong>De.pdf</strong>
            </a>
            <span>ha 3 min</span>
          </li>
        </ul>
      </div>
    );
  }
}
