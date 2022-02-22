import { useEffect, useState } from "react";

const useTime = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const intervalid = setInterval(() => setTime(new Date()), 30000);
    return () => {
      clearInterval(intervalid);
    };
  }, []);

  return time;
};

export default useTime;
