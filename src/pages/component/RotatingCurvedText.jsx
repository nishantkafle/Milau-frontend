import React from 'react';
import ReactCurvedText from 'react-curved-text';


export default function App() {
  const [width] = React.useState(300);
  const [height] = React.useState(300);
  const [cx] = React.useState(150);
  const [cy] = React.useState(150);
  const [rx] = React.useState(100);
  const [ry] = React.useState(100);
  const [startOffset] = React.useState(0);
  const [reversed] = React.useState(false);
  const [text] = React.useState('Pranu-Collection ★ Pranu-Collection ★ Pranu-Collection ★');
  const [fontSize] = React.useState(24);

  return (
    <div className="App">
      <div className="exampleDemo">
        <div className="exampleWrapperDiv text-white">
          <ReactCurvedText
            width={width}
           className="rotating-curved-text text-white"
            height={height}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            startOffset={startOffset}
            reversed={reversed}
            text={text}
            textProps={{ style: { fontSize: fontSize, color: 'white', fontFamily: 'PT Sans, sans-serif' } }}
            svgProps={{ className: 'rotating-curved-text' }}
          />
        </div>
      </div>
    </div>
  );
}
