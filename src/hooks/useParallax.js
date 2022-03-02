import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useParallax = () => {
  const isParallax = useSelector(({ data }) => data.isParallax);
  const parallaxFactor = useSelector(({ data }) => data.parallaxFactor);

  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const formatParallax = useCallback(
    (currentPositon, firstPosition) => {
      return (
        (0.5 - Math.round((currentPositon / firstPosition) * 10) / 10) *
        parallaxFactor
      );
    },
    [parallaxFactor]
  );

  useEffect(() => {
    const mouseOver = (e) => {
      setParallax({
        x: formatParallax(e.clientX, window.innerWidth),
        y: formatParallax(e.clientY, window.innerHeight),
      });
    };
    if (isParallax) window.addEventListener("mousemove", mouseOver);
    return () => {
      window.removeEventListener("mousemove", mouseOver);
    };
  }, [isParallax, formatParallax]);

  if (!isParallax) return { x: 0, y: 0 };
  return parallax;
};

export default useParallax;
