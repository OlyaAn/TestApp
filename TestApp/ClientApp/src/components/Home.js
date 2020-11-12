import axios from 'axios'; 
import React, { Component } from 'react';
import { Progress,Button, Form, Segment, Popup, Grid, Divider, Label, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

export class Home extends Component {
  state = { 
    selectedFile: null,
    uploadingPercent: 0,
    analyzedFiles: null,
    errorMassage: null
  }; 
   
  onFileChange = event => { 
    this.setState({ uploadingPercent: 0 });
    this.setState({ analyzedFiles: null});
    this.setState({ selectedFiles: event.target.files }); 
  }; 

  onFileAnalyze = event => {
    this.setState({ uploadingPercent: 0 });
    axios.get("files").then(result =>  
      {  
        this.setState({ analyzedFiles: result.data});
      });
  }
   
  onFileUpload = () => { 
    if(this.state.selectedFiles){
      this.setState({ errorMassage: null });

      const formData = new FormData(); 
      for (var i = 0; i < this.state.selectedFiles.length; i++) {
        formData.append("documents", this.state.selectedFiles[i]);
      }
           
      const options = {
        onUploadProgress: (progressEvent) => {
          const {loaded, total} = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          this.setState({ uploadingPercent: percent });
        }
      };
    
      axios.post("files", formData, options).then(result =>  
      {  
        this.setState({ uploadingPercent: 100 });
      });
    }else{
      this.setState({ errorMassage: "Files wasn't select" });
    }
  }; 
  
  fileData = () => { 
    if(this.state.analyzedFiles){
      const items = [];
      for (let i = 0; i < this.state.analyzedFiles.length ; i ++) { 
        items.push( 
          <Segment> 
            <Label  color='blue' ribbon> {this.state.analyzedFiles[i].fileName} </Label>  
            <Popup trigger={<Button icon='info' />} >
              <p>File Size: {this.state.analyzedFiles[i].size}</p> 
              {this.state.analyzedFiles[i].author && this.state.analyzedFiles[i].author != "" && <p>File Author: {this.state.analyzedFiles[i].author}</p> }
              {this.state.analyzedFiles[i].path && this.state.analyzedFiles[i].path != "" && <p>File Path: {this.state.analyzedFiles[i].path}</p> }
            </Popup>
            <p>{this.state.analyzedFiles[i].body}</p> 
           
          </Segment> 
        ); 
      }
      return <Segment> {items} </Segment>
    }   
  }; 
   
  render() { 
   let uploadingPercent = this.state.uploadingPercent;
    return (
      <div> 
      <Segment placeholder>
      <Grid columns={2} relaxed='very' stackable>
        <Grid.Column>
        <Form>
          <Label>Select File/s</Label>
          <input type="file" onChange={this.onFileChange} action={{ icon: 'search' }} multiple accept=".doc,.docx,.xml,application/msword" /> 
          <Button onClick={this.onFileUpload} content='Upload'/>
        </Form> 
          {uploadingPercent > 0 && <Progress percent={uploadingPercent} />}
        </Grid.Column>
  
        <Grid.Column verticalAlign='middle'>
          <Button.Group basic>
            <Button onClick={this.onFileAnalyze} content="Analyze"  size='big' />
          </Button.Group>
        </Grid.Column>
      </Grid>
  
      <Divider vertical>And</Divider>
      {this.state.errorMassage && 
        <Message negative>
          <Message.Header>{this.state.errorMassage}</Message.Header>
        </Message>}
    </Segment>
    {this.fileData()}
    </div>
    ); 
  } 
}
