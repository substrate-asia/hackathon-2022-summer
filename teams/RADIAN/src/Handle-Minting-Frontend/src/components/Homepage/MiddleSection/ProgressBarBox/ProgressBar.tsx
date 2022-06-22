import { MinusOutlined } from "@ant-design/icons";
import { Progress } from "antd";
import { resolve } from "path";
import { FC, useState, useEffect } from "react";

interface ProgressBarProps {
  minted: number;
  total: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ minted, total }) => {
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState((minted / total) * 100);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((t) => {
        if (t >= totalProgress) clearInterval(intervalId);
        return t < totalProgress ? t + 1 : t;
      });
    }, 30);
    return () => clearInterval(intervalId);
  }, [totalProgress]);


  return (
    <>
      <Progress
        type="line"
        percent={progress}
        strokeColor={{
          "0%": "rgba(200,66,245,1)",
          "80%": "rgba(142,148,255,1)",
          "100%": "rgba(121,239,174,1)",
        }}
        showInfo={false}
      />
    </>
  );
};

export default ProgressBar;
