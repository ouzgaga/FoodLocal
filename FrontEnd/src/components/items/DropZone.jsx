import React from 'react';
import Dropzone from 'react-dropzone';

import IconeCloudUpload from '@material-ui/icons/CloudUpload';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {

  },
  container: {
    height: 200,
    width: 400,
    borderStyle: 'solid',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#EEEEEE',
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
  },
  image: {
    maxWidth: 256,
    maxHeight: 256,
  },
});


class DropZone extends React.Component {
  constructor() {
    super()
    this.state = {
      accept: '',
      files: [],
      imgSrc: null,
      error: '',
    }
  }

  onDrop = (files, rejected) => {
    const { onChange } = this.props;

    if (rejected.length === 0) {
      this.setState({ files: files, error: '', });


      const fr = new FileReader();
      fr.addEventListener("load", () => {

        this.setState({ imgSrc: fr.result });
        console.info(fr.result);
        onChange(this.state.imgSrc);
      }, false);
      fr.readAsDataURL(files[0]);

    } else {
      this.setState({ error: <Typography color="error">Erreur, image non valide.</Typography> })
    }
  }

  applyMimeTypes(event) {
    this.setState({
      accept: event.target.value
    });
  }

  render() {
    const { classes } = this.props;
    const { imgSrc, error } = this.state;

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
      //padding: '2.5em 0',
      height: 200,
      width: 400,
      background: 'rgba(0,0,0,0.2)',
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

    return (
      <section>
        <div
          className={classes.container}
        >

          <Dropzone
            accept="image/*"
            multiple={false}
            onDrop={this.onDrop}

            className={classes.container}

          >
            {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
              <div {...getRootProps()} style={{ position: 'relative' }}>
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
                      Selectionner une nouvelle image (max 0.7Mb)
                      {isDragReject ?
                        <Typography color="error">Erreur, image non valide.</Typography>
                        : <Typography> </Typography>
                      }
                    </Grid>
                  </Grid>
                </div>
              </div>
            )}
          </Dropzone>

        </div>
        {imgSrc ?
          <div>
            <img src={imgSrc} className={classes.image} alt="nouvelle image" />
          </div>
          : ''
        }
        {error}


      </section>
    );
  }
}

export default withStyles(styles)(DropZone);
