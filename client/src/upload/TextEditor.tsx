import React, { Component } from 'react';
import 'react-html5-camera-photo/build/css/index.css';
import axios from 'axios'
import { AXIOS_CONFIG } from '../constants';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Card from "../shared/Card";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fullWidth: {
      width: '100%'
    }
  }),
);

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  > div {
    width: 700px;
  }
`;

class TextEditor extends Component {
  render() {
    return (
      <Content>
        <Card>
          <form noValidate autoComplete="off">
            <div>
              <TextField
                id="outlined-basic"
                label="Titel"
                margin="normal"
                variant="outlined"
              />
            </div>
            <div>
              <TextField
                id="outlined-multiline-static"
                label="Was ist heute passiert?"
                multiline
                rows="4"
                defaultValue=""
                margin="normal"
                variant="outlined"
              />
            </div>
          </form>
        </Card>
      </Content>

    );
  }
}


export default TextEditor