const Loading = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100px"
      height="60px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle cx="27.5" cy="57.5" r="5" fill="#a428d0">
        <animate
          attributeName="cy"
          calcMode="spline"
          keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
          repeatCount="indefinite"
          values="57.5;42.5;57.5;57.5"
          keyTimes="0;0.3;0.6;1"
          dur="1s"
          begin="-0.6s"
        ></animate>
      </circle>{' '}
      <circle cx="42.5" cy="57.5" r="5" fill="#8e62c6">
        <animate
          attributeName="cy"
          calcMode="spline"
          keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
          repeatCount="indefinite"
          values="57.5;42.5;57.5;57.5"
          keyTimes="0;0.3;0.6;1"
          dur="1s"
          begin="-0.44999999999999996s"
        ></animate>
      </circle>{' '}
      <circle cx="57.5" cy="57.5" r="5" fill="#6f96b9">
        <animate
          attributeName="cy"
          calcMode="spline"
          keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
          repeatCount="indefinite"
          values="57.5;42.5;57.5;57.5"
          keyTimes="0;0.3;0.6;1"
          dur="1s"
          begin="-0.3s"
        ></animate>
      </circle>{' '}
      <circle cx="72.5" cy="57.5" r="5" fill="#20d4a9">
        <animate
          attributeName="cy"
          calcMode="spline"
          keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
          repeatCount="indefinite"
          values="57.5;42.5;57.5;57.5"
          keyTimes="0;0.3;0.6;1"
          dur="1s"
          begin="-0.15s"
        ></animate>
      </circle>
    </svg>
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="40px"
    //   height="40px"
    //   viewBox="0 0 100 100"
    //   preserveAspectRatio="xMidYMid"
    //   style={{ opacity: '.6' }}
    // >
    //   <circle
    //     cx="50"
    //     cy="50"
    //     r="32"
    //     stroke-width="8"
    //     stroke="#a428d0"
    //     stroke-dasharray="50.26548245743669 50.26548245743669"
    //     fill="none"
    //     stroke-linecap="round"
    //   >
    //     <animateTransform
    //       attributeName="transform"
    //       type="rotate"
    //       dur="1s"
    //       repeatCount="indefinite"
    //       keyTimes="0;1"
    //       values="0 50 50;360 50 50"
    //     ></animateTransform>
    //   </circle>
    //   <circle
    //     cx="50"
    //     cy="50"
    //     r="23"
    //     stroke-width="8"
    //     stroke="#20d4a9"
    //     stroke-dasharray="36.12831551628262 36.12831551628262"
    //     stroke-dashoffset="36.12831551628262"
    //     fill="none"
    //     stroke-linecap="round"
    //   >
    //     <animateTransform
    //       attributeName="transform"
    //       type="rotate"
    //       dur="1s"
    //       repeatCount="indefinite"
    //       keyTimes="0;1"
    //       values="0 50 50;-360 50 50"
    //     ></animateTransform>
    //   </circle>
    // </svg>
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   // style="margin:auto;background:#fff;display:block;"
    //   width="80px"
    //   height="40px"
    //   viewBox="0 0 100 100"
    //   preserveAspectRatio="xMidYMid"
    // >
    //   <circle cx="6.451612903225806" cy="50" r="3" fill="#941946">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.5s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="0s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#941946;#fbacc9;#941946"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.5s"
    //     ></animate>
    //   </circle>
    //   <circle cx="6.451612903225806" cy="50" r="3" fill="#a2f0fb">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.5s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#a2f0fb;#164ba3;#a2f0fb"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.5s"
    //     ></animate>
    //   </circle>
    //   <circle cx="16.129032258064512" cy="50" r="3" fill="#941946">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.7s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.2s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#941946;#fbacc9;#941946"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.7s"
    //     ></animate>
    //   </circle>
    //   <circle cx="16.129032258064512" cy="50" r="3" fill="#a2f0fb">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.7s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.2s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#a2f0fb;#164ba3;#a2f0fb"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.7s"
    //     ></animate>
    //   </circle>
    //   <circle cx="25.806451612903224" cy="50" r="3" fill="#941946">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.9s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.4s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#941946;#fbacc9;#941946"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.9s"
    //     ></animate>
    //   </circle>
    //   <circle cx="25.806451612903224" cy="50" r="3" fill="#a2f0fb">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.9s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.4s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#a2f0fb;#164ba3;#a2f0fb"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.9s"
    //     ></animate>
    //   </circle>
    //   <circle cx="35.48387096774193" cy="50" r="3" fill="#941946">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.1s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.6s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#941946;#fbacc9;#941946"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.1s"
    //     ></animate>
    //   </circle>
    //   <circle cx="35.48387096774193" cy="50" r="3" fill="#a2f0fb">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.1s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.6s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#a2f0fb;#164ba3;#a2f0fb"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.1s"
    //     ></animate>
    //   </circle>
    //   <circle cx="45.16129032258064" cy="50" r="3" fill="#941946">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.3s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-0.8s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#941946;#fbacc9;#941946"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.3s"
    //     ></animate>
    //   </circle>
    //   <circle cx="45.16129032258064" cy="50" r="3" fill="#a2f0fb">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.3s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.8s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#a2f0fb;#164ba3;#a2f0fb"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.3s"
    //     ></animate>
    //   </circle>
    //   <circle cx="54.838709677419345" cy="50" r="3" fill="#941946">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.5s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#941946;#fbacc9;#941946"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.5s"
    //     ></animate>
    //   </circle>
    //   <circle cx="54.838709677419345" cy="50" r="3" fill="#a2f0fb">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.5s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#a2f0fb;#164ba3;#a2f0fb"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.5s"
    //     ></animate>
    //   </circle>
    //   <circle cx="64.51612903225805" cy="50" r="3" fill="#941946">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.7s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.2s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#941946;#fbacc9;#941946"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.7s"
    //     ></animate>
    //   </circle>
    //   <circle cx="64.51612903225805" cy="50" r="3" fill="#a2f0fb">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.7s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.2s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#a2f0fb;#164ba3;#a2f0fb"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.7s"
    //     ></animate>
    //   </circle>
    //   <circle cx="74.19354838709677" cy="50" r="3" fill="#941946">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.9s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.4s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#941946;#fbacc9;#941946"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.9s"
    //     ></animate>
    //   </circle>
    //   <circle cx="74.19354838709677" cy="50" r="3" fill="#a2f0fb">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.9s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.4s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#a2f0fb;#164ba3;#a2f0fb"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.9s"
    //     ></animate>
    //   </circle>
    //   <circle cx="83.87096774193547" cy="50" r="3" fill="#941946">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.1s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.6s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#941946;#fbacc9;#941946"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.1s"
    //     ></animate>
    //   </circle>
    //   <circle cx="83.87096774193547" cy="50" r="3" fill="#a2f0fb">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-3.1s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.6s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#a2f0fb;#164ba3;#a2f0fb"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.1s"
    //     ></animate>
    //   </circle>
    //   <circle cx="93.54838709677418" cy="50" r="3" fill="#941946">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.3s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-1.8s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#941946;#fbacc9;#941946"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.3s"
    //     ></animate>
    //   </circle>
    //   <circle cx="93.54838709677418" cy="50" r="3" fill="#a2f0fb">
    //     <animate
    //       attributeName="r"
    //       keyTimes="0;0.5;1"
    //       values="2.4000000000000004;3.5999999999999996;2.4000000000000004"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-3.3s"
    //     ></animate>
    //     <animate
    //       attributeName="cy"
    //       keyTimes="0;0.5;1"
    //       values="32;68;32"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.8s"
    //       keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
    //       calcMode="spline"
    //     ></animate>
    //     <animate
    //       attributeName="fill"
    //       keyTimes="0;0.5;1"
    //       values="#a2f0fb;#164ba3;#a2f0fb"
    //       dur="2s"
    //       repeatCount="indefinite"
    //       begin="-2.3s"
    //     ></animate>
    //   </circle>
    // </svg>
  );
};
export default Loading;
