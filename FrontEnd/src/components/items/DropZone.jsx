import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import IconeCloudUpload from '@material-ui/icons/CloudUpload';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';



const styles = theme => ({
  root: {

  },
  container: {
    height: 200,
    width: 400,
    //borderStyle: 'solid',
    borderRadius: 10,
    //borderWidth: 1,*/
    //backgroundColor: '#EEEEEE',
  },
  icon: {
    height: 100,
    width: 100,
    color: '#A1C1C4',
  },
  dropzone: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
    paddingTop: 10,
  }
});

const handleDropRejected = (...args) => console.log('reject', args);

class DropZone extends React.Component {
  constructor() {
    super()
    this.state = {
      accept: '',
      files: [],
      imgSrc: null,
    }
  }

  onDrop = (files, rejectedFiles) => {
    this.setState({ files: files });


    const fr = new FileReader();
    fr.addEventListener("load", () => {
      console.log(fr.result)
      this.setState({ imgSrc: fr.result });
    }, false)
    fr.readAsDataURL(files[0])

  }

  applyMimeTypes(event) {
    this.setState({
      accept: event.target.value
    });
  }

  render() {
    const { classes } = this.props;
    const { imgSrc } = this.state;

    const previewStyle = {
      display: 'inline',
      width: 100,
      height: 100,
    };

    const overlayStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: '2.5em 0',
      background: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      color: '#fff'
    };


    const previewStyle2 = {

      
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: '2.5em 0',
      //backgroundImage: url("../../img/backgroundImage-contry.jpg),
      textAlign: 'center',
    };

    const files = this.state.files.map((file, index) => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))

    const filesOP = this.state.files.map((file) => (
      <img
        alt="Preview"
        key={file.preview}
        src={file.name}
        style={previewStyle}
      />
    ))

    return (
      <section>
        <div
          className="dropzone"
          className={classes.container}

        >
          <Dropzone
            accept="image/*"
            multiple={false}
            onDrop={this.onDrop.bind(this)}

            onDropRejected={handleDropRejected}
            className={classes.container}

          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div {...getRootProps()} style={{ position: "relative" }}>
                <input {...getInputProps()} />
                {isDragActive && <div style={overlayStyle}>Drop files here</div>}
                

                <div style={previewStyle2}>
                  <Grid container direction={'column'} alignItems={'center'} alignContent={"center"}>
                    <Grid item>
                      <IconButton>
                        <IconeCloudUpload className={classes.icon} />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      Selectionner une nouvelle image
                    </Grid>
                  </Grid>
                </div>


              </div>
            )}
          </Dropzone>
        </div>
        {imgSrc ?
          <div>
            <img src={imgSrc} />
          </div>
          : ''
        }
        <aside>
            
          <ul>
            {
              //this.state.accepted.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>
          <h4>Rejected files</h4>
          {console.info(this.state.files)}
          <ul>{files}</ul>

          <div>{filesOP}</div>
        </aside>
      </section>
    );
  }
}

export default withStyles(styles)(DropZone);
