import React, { Component, useState } from 'react';
import 'react-html5-camera-photo/build/css/index.css';
import axios from 'axios'
import { AXIOS_CONFIG } from '../constants';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
  @media only screen and (max-width: 800px) {
    padding: 16px;
  }
  > div {
    width: 700px;
    @media only screen and (max-width: 800px) {
      width: 100%;
      width: calc(100% - 32px);
    }
  }
`;

const FullWidth = styled.div`
  width: 100%;
`


export default function TextEditor() {
  const classes = useStyles();
  const [state, setState] = useState<any>({});
  const handleSubmit = (e: any) => {
    e.preventDefault();

    axios.post('posts/text', {
      title: state.title,
      text: state.text
    }, {...AXIOS_CONFIG});
    console.log(state);
  }

  return (
    <Content>
      <Card>
        <form noValidate onSubmit={handleSubmit} autoComplete="off">
          <FullWidth>
            <TextField
              className={classes.fullWidth}
              id="outlined-basic"
              label="Titel"
              margin="normal"
              variant="outlined"
              onChange={e => setState({...state, title: e.target.value})}
            />
          </FullWidth>
          <FullWidth>
            <TextField
              className={classes.fullWidth}
              id="outlined-multiline-static"
              label="Was ist heute passiert?"
              multiline
              rows="4"
              defaultValue=""
              margin="normal"
              variant="outlined"
              onChange={e => setState({...state, text: e.target.value})}
            />
          </FullWidth>
          <Button variant="outlined" type="submit">
            Posten
          </Button>
        </form>
      </Card>
    </Content>

  );
}