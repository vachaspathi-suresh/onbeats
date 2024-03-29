import React from 'react';
import styled, { keyframes } from 'styled-components';

const stretchdelay = keyframes`
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
`;

const LoadContainer = styled.div`
  width: 100px;
  height: 150px;
  text-align: center;
  font-size: 10px;
`;
const box = styled.div`
  background-color: ${props => props.color || '#00adb5'};
  height: 100%;
  width: 6px;
  display: inline-block;
  margin-left: 5px;
  animation: ${stretchdelay} ${props => props.speed || 1.2}s infinite ease-in-out;
`;

const BoxLoadingFirst = styled(box)`
  animation-delay: -1.2s;
`;

const BoxLoadingTwo = styled(box)`
  animation-delay: -1.1s;
`;

const BoxLoadingThree = styled(box)`
  animation-delay: -1s;
`;

const BoxLoadingFour = styled(box)`
  animation-delay: -0.9s;
`;

const BoxLoadingFive = styled(box)`
  animation-delay: -0.8s;
`;

const BoxLoadingSix = styled(box)`
  animation-delay: -0.7s;
`;

const BoxLoadingSeven = styled(box)`
  animation-delay: -0.6s;
`;

const BoxLoadingEight = styled(box)`
  animation-delay: -0.5s;
`;

const Loader = ({ style = commonStyle, color, speed, size="default" }) => {
  return (
    <LoadContainer style={style} size={size}>
      <BoxLoadingFirst color={color} speed={speed} />
      <BoxLoadingTwo color={color} speed={speed} />
      <BoxLoadingThree color={color} speed={speed} />
      <BoxLoadingFour color={color} speed={speed} />
      <BoxLoadingFive color={color} speed={speed} />
      <BoxLoadingSix color={color} speed={speed} />
      <BoxLoadingSeven color={color} speed={speed} />
      <BoxLoadingEight color={color} speed={speed} />
    </LoadContainer>
  );
};

const commonStyle = {
  margin: 'auto',
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0
};



export default Loader;