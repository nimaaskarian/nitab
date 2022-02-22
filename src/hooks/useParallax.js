import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useParallax = () => {
  const isParallax = useSelector(({data}) => data.isParallax);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mouseOver = (e) => {
      const x = 0.5 - Math.round((e.clientX / window.innerWidth) * 10) / 10;
      const y = 0.5 - Math.round((e.clientY / window.innerHeight) * 10) / 10;
      setParallax({ x, y });
    };
    if (isParallax) window.addEventListener("mousemove", mouseOver);
    return () => {
      window.removeEventListener("mousemove", mouseOver);
    };
  }, [isParallax]);
  if (!isParallax) return { x: 0, y: 0 };
  return parallax;
};

export default useParallax;
