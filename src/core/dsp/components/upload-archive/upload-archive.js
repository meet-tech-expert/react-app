import React from "react";
import {
  TextInput,
  FormLayout,
  Button,
  CalendarNew,
  TextArea
} from "@nokia-csf-uxr/csfWidgets";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./upload-archive.styl";

import JSZip from 'jszip/dist/jszip.min.js';

class UploadArchive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDateValue: null,
      selectedFile: null,
      uploadFileName: null,
      zipFile: null,
    };
  }

  handleSelectedFile = event => {
  	let filename = event.target.files[0].name;
    console.log(filename);
    let ext = filename.split('.').pop();
    if(ext != 'zip'){
		alert('Please select only zip file');
		return false;
	}
    this.setState({ uploadFileName: filename });
    this.setState({ zipFile: event.target.files[0] });
  };
  
  
  
  onChangeStartDate = data => {
    if (data.type === "onDateChange") {
      this.setState({ startDateValue: data.value });
    }
    if (data.type === "onToggle") {
      this.setState({ isStartOpen: data.value });
    }
  };
  
  render() {
    console.log("upload archive");
    return (
      <div className="container">
        <h3 className="center"> Please select archive file</h3>
        <hr />
        <form className="" action="#">
          <div className="form-group row">
            <label class="col-form-label col-form-label-sm col-sm-1">
              Archive
            </label>
            <div className="col-sm-4">
              <input
                id="choose-file-id"
                className="inputfile"
                type="file"
                name="myFile"
                accept="zip"
                onChange={this.handleSelectedFile}
              />
              <div className="upload-row">{this.state.uploadFileName}</div>
            </div>
            <label htmlFor="choose-file-id">
              <strong className="iconUpload">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="17"
                  viewBox="0 0 20 17"
                >
                  <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" />
                </svg>{" "}
                Browse
              </strong>
            </label>
          </div>
          <div className="form-group row">
            <label className="col-form-label col-form-label-sm col-sm-1">
              Model:
            </label>
            <div className="col-sm-4">
              <TextInput id="modal" className="input form-control form-control-sm" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-form-label col-form-label-sm col-sm-1">
              Start date:
            </label>
            <div className="col-sm-4">
              <CalendarNew
                id="uploadStartDateId"
                position="top"
                isTimeFormat24Hr={false}
                defaultIsOpen={false}
                closeOnClickOutside
                locale="en"
                field={{
                  isVisible: true,
                  width: 476,
                  hasOutline: true,
                  dateIsBlockedMessage: "Date is inactive",
                  dateIsRequiredMessage: "Date is required",
                  toolTip: true,
                  toolTipText: "Search Start Date",
                  displayTooltipOnFocus: true
                }}
                timePicker={{ isVisible: true, isSecondPickerVisible: true }}
                header={{ yearFormat: "YYYY", dateFormat: "YYYY-MM-DD" }}
                date={this.state.startDateValue}
                modal={{ isModal: false }}
                required={true}
                onChange={this.onChangeStartDate}
              />
            </div>
          </div>
          <Button
            text="Upload"
            onClick={() => this.props.changeAppMode("submit", this.state)}
            id="upload-btn"
          />
        </form>
      </div>
    );
  }
}

class UploadMainArchive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMode: "upload",
      uploadData: null
    };
  }
  changeAppMode = (newMode, data) => {
    //console.log(newMode);
    //console.log(data);
    this.setState({ currentMode: newMode });
    this.setState({ uploadData: data });
  };
  render() {
    console.log(this.state.currentMode);
    switch (this.state.currentMode) {
      case "upload":
        return <UploadArchive changeAppMode={this.changeAppMode} />;
        break;
      case "submit":
        return (
          <SubmitArchive
            changeAppMode={this.changeAppMode}
            uploadData={this.state.uploadData}
          />
        );
        break;
    }
  }
}
class SubmitArchive extends React.Component {
  convert = str => {
    if (str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2),
        hours = ("0" + date.getHours()).slice(-2),
        minutes = ("0" + date.getMinutes()).slice(-2);
      return (
        [date.getFullYear(), mnth, day].join("/") + " " + hours + ":" + minutes
      );
    }
    return "";
  };
  
  readZipFile = file => {
  	JSZip.loadAsync(file).then(function(zip) {
            zip.forEach(function (relativePath, zipEntry) {
                //console.log(zipEntry.name);
				  var ext = zipEntry.name.split('.').pop();
                  //console.log(ext);
                  if(ext == 'txt'){
				  	zip.file(zipEntry.name).async("string").then(function (data) {
					  //console.log(data);
					  var t  = document.getElementById('uploadTextArea'); 
					  var heading = document.createElement('h6'); 
					  heading.innerHTML = zipEntry.name;
					  t.appendChild(heading);
					  var elChild = document.createElement('div');
					  elChild.className = "alert alert-success";
					  elChild.innerHTML = "<p>"+data+"</p>";
					  t.appendChild(elChild);
					});
				  }
                
            });
            
        },function (e) {
            console.log(e.message);
    });
  };
  
  render() {
    return (
      <div className="container">
        <h3 className="center">Data Submit Successfully</h3>
        <hr />
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Archive file name: </strong>
            <span>{this.props.uploadData.uploadFileName}</span>
            <span>{this.readZipFile(this.props.uploadData.zipFile)}</span>
          </li>
          <li className="list-group-item">
            <strong>Operation period: </strong>
            <span>{this.convert(this.props.uploadData.startDateValue)}</span>
          </li>
        </ul>
        <div id="uploadTextArea" className="well"></div>
        <Button
          text="Back"
          onClick={() => this.props.changeAppMode("upload", null)}
        />

        <Button text="Submit" id="upload-btn-button" />
      </div>
    );
  }
}
export default UploadMainArchive;