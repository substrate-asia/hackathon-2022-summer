const Pie = ({ size, values }: any) => {
  const circleLength = 10 * Math.PI;
  const dataTotal = values.reduce(
    (a: any, b: any) => parseFloat(a.denormWeight) + parseFloat(b.denormWeight)
  );
  let startingPoint = 0;
  const dataObjects = values.map((item: any) => {
    const relativeSize =
      (parseFloat(item.denormWeight) / dataTotal) * circleLength;
    const dataObject = {
      relativeSize,
      offset: -startingPoint,
    };
    startingPoint += relativeSize;
    return dataObject;
  });

  const colors = values.map((item: any) => item.color);
  return (
    <span>
      <svg height={size} width={size} viewBox="0 0 20 20">
        {dataObjects.map((item: any, index: number) => {
          return (
            <circle
              key={index}
              style={{
                height: `${size}px`,
                width: `${size}px`,
                strokeDasharray: `${item.relativeSize} ${circleLength}`,
                strokeDashoffset: item.offset,
              }}
              r="5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke={colors[index]}
              stroke-offset={item.offset}
              stroke-width="10"
              transform="rotate(-90) translate(-20)"
            />
          );
        })}
      </svg>
    </span>
  );
};

export default Pie;
