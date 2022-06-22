import './App.css';
import React, { useEffect, useState } from 'react';
import { useSprings, animated } from 'react-spring';

function LargeElement() {
  return (
    <path
      fill="url(#paint0_linear_3486_25574)"
      fillOpacity="0.8"
      d="M312.429 343.185l292.477-162.324c3.377-1.865 6.178-4.529 8.124-7.728 1.946-3.199 2.97-6.821 2.97-10.508 0-3.686-1.024-7.308-2.97-10.507-1.946-3.199-4.747-5.863-8.124-7.728L347.872 2.91A23.541 23.541 0 00336.501 0a23.537 23.537 0 00-11.37 2.91L11.056 177.263c-3.372 1.872-6.166 4.541-8.105 7.743A20.2 20.2 0 000 195.517l.653 348.214c.012 3.681 1.044 7.296 2.994 10.487 1.95 3.191 4.75 5.847 8.126 7.706L268.19 703.109a23.523 23.523 0 0011.25 2.891 23.547 23.547 0 0011.273-2.813c3.429-1.856 6.276-4.532 8.254-7.757 1.977-3.225 3.015-6.885 3.007-10.609l-.603-323.383c-.006-3.686 1.011-7.309 2.951-10.511 1.939-3.201 4.733-5.87 8.106-7.742z"
    ></path>
  );
}
function Triangle1() {
  return (
    <path
      fill="url(#paint1_linear_3486_25574)"
      fillOpacity="0.8"
      d="M362.916 700.115l234.968-128.757c3.393-1.861 6.204-4.519 8.155-7.709 1.95-3.19 2.971-6.802 2.961-10.475-.01-3.673-1.051-7.28-3.019-10.461-1.968-3.181-4.795-5.825-8.198-7.669L362.815 407.839c-3.422-1.854-7.307-2.833-11.264-2.839-3.957-.006-7.846.961-11.274 2.805-3.429 1.843-6.277 4.498-8.256 7.695-1.98 3.198-3.022 6.826-3.021 10.52v255.961c.001 3.702 1.05 7.338 3.039 10.54 1.99 3.203 4.85 5.858 8.291 7.698 3.441 1.84 7.342 2.799 11.308 2.781 3.966-.019 7.856-1.014 11.278-2.885z"
    ></path>
  );
}
function Triangle2() {
  return (
    <path
      fill="url(#paint2_linear_3486_25574)"
      fillOpacity="0.9"
      d="M603.073 509.079L368.128 379.028c-3.396-1.877-6.211-4.561-8.163-7.784A20.288 20.288 0 01357 360.661c.01-3.711 1.053-7.356 3.023-10.569 1.97-3.213 4.8-5.883 8.206-7.743l234.945-128.483A23.578 23.578 0 01614.439 211a23.581 23.581 0 0111.275 2.833c3.43 1.861 6.278 4.542 8.259 7.771 1.981 3.23 3.025 6.894 3.027 10.625v258.534c0 3.741-1.048 7.415-3.038 10.651-1.99 3.236-4.851 5.92-8.295 7.779A23.602 23.602 0 01614.354 512a23.577 23.577 0 01-11.281-2.921z"
    ></path>
  );
}

function SplashScreen() {
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setToggle(true);
  }, []);

  const fragments = [<Triangle1 key="envelope-1" />, <Triangle2 key="envelope-2" />, <LargeElement key="envelope-3" />];

  const animationsLol = [
    ['rotate(0deg) scale(1)', 'rotate(90deg) scale(0)'],
    ['rotate(0deg) scale(1)', 'rotate(-90deg) scale(0)'],
    [`translate3d(0px, 0px, 0px)`, `translate3d(-400px, -400px, 0px)`]
  ];

  const springs2 = useSprings(
    fragments.length,
    fragments.map((_, i) => ({
      transform: toggle ? animationsLol[i][0] : animationsLol[i][1],
      delay: i * 500
    }))
  );

  const animatedIcons = springs2.map((style, index) => (
    <animated.g
      key={index}
      style={{
        transformOrigin: '0px 0px',
        transformBox: 'fill-box',
        ...style
      }}
    >
      {fragments[index]}
    </animated.g>
  ));

  return (
    <>
      <div className="splash-container">
        <div className="splash-wrapper">
          <svg
            className="logo1"
            xmlns="http://www.w3.org/2000/svg"
            width="182"
            height="202"
            fill="none"
            viewBox="0 0 637 706"
          >
            {/* {envelopes} */}
            {animatedIcons}
            {/* <LargeElement />
            <Triangle1 />
            <Triangle2 /> */}
            <defs>
              <linearGradient
                id="paint0_linear_3486_25574"
                x1="56.073"
                x2="393.735"
                y1="571.506"
                y2="44.59"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#79EFAE"></stop>
                <stop offset="0.58" stopColor="#8E94FF"></stop>
                <stop offset="1" stopColor="#C842F5"></stop>
              </linearGradient>
              <linearGradient
                id="paint1_linear_3486_25574"
                x1="236.291"
                x2="898.146"
                y1="663.999"
                y2="43.228"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#1A24E4"></stop>
                <stop offset="1" stopColor="#CBCDFC" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="paint2_linear_3486_25574"
                x1="394.728"
                x2="846.322"
                y1="546.21"
                y2="173.532"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#1A24E4"></stop>
                <stop offset="1" stopColor="#F0F0F0" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
}

export default SplashScreen;
