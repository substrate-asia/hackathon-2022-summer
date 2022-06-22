import "./solar.css";
import Ring from "./Ring";
import Typewriter from "typewriter-effect";
import { useRef, useEffect, useState } from "react";

const SolarSystem = () => {
  return (
    <div className="rd-solar-system-container">
      <div className="rd-sun">
        <div className="rd-input-field">
          <Typewriter
            options={{
              loop: true,
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString("@JANEDOE.RADI")
                .pauseFor(1500)
                .deleteAll()
                .pauseFor(500)
                .typeString("@RADIAN.RADI")
                .pauseFor(1500)
                .start();
            }}
          />
        </div>
      </div>
      <Ring />
    </div>
  );
};

export default SolarSystem;
