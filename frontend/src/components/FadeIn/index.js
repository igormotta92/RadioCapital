import React from 'react';
import styled, { keyframes } from 'styled-components';

const BaseAnimation = styled.div`
  animation-duration: ${(props) => props.duration};
  animation-timing-function: ${(props) => props.timingFunction};
  animation-delay: ${(props) => props.delay};
  animation-iteration-count: ${(props) => props.iterationCount};
  animation-direction: ${(props) => props.direction};
  animation-fill-mode: ${(props) => props.fillMode};
  animation-play-state: ${(props) => props.playState};
  display: ${(props) => props.display};
`;
BaseAnimation.defaultProps = {
  duration: '1s',
  timingFunction: 'ease',
  delay: '0s',
  iterationCount: '1',
  direction: 'normal',
  fillMode: 'both',
  playState: 'running',
  display: 'block',
};

const FadeInAnimation = keyframes`  
  from { opacity: 0; }
  to { opacity: 1; }
`;
const FadeIn = styled(BaseAnimation)`
  animation-name: ${FadeInAnimation};
`;

export default FadeIn;
