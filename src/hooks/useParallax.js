import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const formatParallax = (currentPositon, firstPosition, parallaxFactor) => {
  return (
    (0.5 - Math.round((currentPositon / firstPosition) * 10) / 10) *
    parallaxFactor
  );
};
const useParallax = () => {
  const currentBackground = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].currentBackground
  );

  const parallaxEnabled = useSelector(
    ({ data }) => data.backgrounds[currentBackground]?.parallaxEnabled
  );
  const parallaxFactor = useSelector(
    ({ data }) => data.backgrounds[currentBackground]?.parallaxFactor
  );

  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mouseOver = (e) => {
      setParallax({
        x: formatParallax(e.clientX, window.innerWidth),
        y: formatParallax(e.clientY, window.innerHeight),
      });
    };
    if (parallaxEnabled) window.addEventListener("mousemove", mouseOver);
    return () => {
      window.removeEventListener("mousemove", mouseOver);
    };
  }, [parallaxEnabled, formatParallax]);

  if (!parallaxEnabled) return { x: 0, y: 0 };
  return parallax;
};

export default useParallax;
