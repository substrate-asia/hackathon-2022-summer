import "./solar.css";
import { useRef, useEffect, useState } from "react";

const Ring = () => {
  const divRef = useRef(null);
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const handleArray = [
    "@GIGICHOI. RADI",
    "@GIGICHOI. RADI",
    "@GIGICHOI. RADI",
    "@GIGICHOI. RADI",
  ];

  useEffect(() => {
    const data = async () => {
      const getData = await divRef.current.getBoundingClientRect();
      const coordinates = await getData;
      setX(coordinates.x);
      setY(coordinates.y);
    };
    data().catch(console.log("error getting coordinates"));
  }, []);

  return (
    <div className="rd-rings-wrapper">
      <div className="rd-orbit" ref={divRef}></div>
      <div>
        <div
          className="rd-small-planet"
          style={{
            backgroundColor: "#D89FF8",
            transform: `translate(${x - x - 250}px, ${y - y}px)`,
          }}
        />
        <div
          className="rd-solar-handle-wrapper rd-med-solar-handle-wrapper"
          style={{
            backgroundColor: "#D89FF8",
            transform: `translate(${x - x - 350}px, ${y - y + 70}px)`,
            padding: '5px 15px',
            fontSize: '12px !important',
          }}
        >
          {handleArray[0]}
        </div>
        <div
          className="rd-small-planet2"
          style={{
            backgroundColor: "#F3C2C2",
            transform: `translate(${x - x - 150}px, ${y - y - 80}px)`,
          }}
        />
        <div
          className="rd-solar-handle-wrapper rd-small-solar-handle-wrapper"
          style={{
            backgroundColor: "#F3C2C2",
            transform: `translate(${x - x + 200}px, ${y - y + 70}px)`,
            padding: '5px 10px',
            fontSize: '10px !important',
          }}
        >
          {handleArray[1]}
        </div>

        <div
          className="rd-medium-planet"
          style={{
            backgroundColor: "#f6c3ad",
            transform: `translate(${x - x + 200}px, ${y - y - 5}px)`,
          }}
        />
        <div
          className="rd-solar-handle-wrapper rd-small-solar-handle-wrapper"
          style={{
            backgroundColor: "#B8B0D1",
            transform: `translate(${x - x - 320}px, ${y - y - 70}px)`,
            padding: '5px 10px',
            fontSize: '10px !important',
          }}
        >
          {handleArray[2]}
        </div>
        <div
          className="rd-large-planet"
          style={{
            backgroundColor: "#89f8ff",
            transform: `translate(${x - x + 100}px, ${y - y - 105}px)`,
          }}
        />
        <div
          className="rd-solar-handle-wrapper rd-lg-solar-handle-wrapper"
          style={{
            backgroundColor: "#89f8ff",
            transform: `translate(${x - x + 170}px, ${y - y - 135}px)`,
            padding: '5px 15px',
            fontSize: '15px !important',
          }}
        >
          {handleArray[3]}
        </div>
      </div>
    </div>
  );
};

export default Ring;
