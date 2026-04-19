"use client";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import React, { useEffect, useRef, useState } from "react";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

interface JelloTextProps {
  text: string;
  fontSize?: number; // in vw units
  fontWeight?: number; // 100-800
  fontStretch?: number; // 10-200
  backgroundColor?: string;
  textColor?: string;
  shadowColor?: string;
  className?: string;
}

const JelloText: React.FC<JelloTextProps> = ({
  text,
  fontSize = 15,
  fontWeight = 600,
  fontStretch = 150,
  backgroundColor = "#1a1a2e",
  textColor = "#eee",
  shadowColor = "#0f3460",
  className = "",
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!textRef.current || !stageRef.current) return;

    const weightInit = fontWeight;
    const weightTarget = 400;
    const weightDiff = weightInit - weightTarget;
    const stretchInit = fontStretch;
    const stretchTarget = 80;
    const stretchDiff = stretchInit - stretchTarget;
    const maxYScale = 2.5;
    const elasticDropOff = 0.8;

    let isMouseDown = false;
    let mouseInitialY = 0;
    let mouseFinalY = 0;
    let distY = 0;
    let charIndexSelected = 0;
    let charH = 0;
    let dragYScale = 0;

    // Split text into characters
    const mySplitText = new SplitText(textRef.current, {
      type: "chars",
      charsClass: "char",
    });

    const chars = mySplitText.chars;
    const numChars = chars?.length || 0;

    if (!chars || numChars === 0) return;

    // Calculate character height
    const resize = () => {
      if (textRef.current) {
        charH = textRef.current.offsetHeight;
      }
    };

    resize();

    // Set initial styles
    gsap.set(stageRef.current, { autoAlpha: 1 });
    gsap.set(chars, {
      transformOrigin: "center bottom",
    });

    // Animate in
    const animInTxt = () => {
      const elem = chars[0] as HTMLElement;
      const rect = elem.getBoundingClientRect();
      gsap.from(chars, {
        y: () => {
          return -1 * (rect.y + charH + 500);
        },
        fontWeight: weightTarget,
        fontStretch: stretchTarget,
        scaleY: 2,
        ease: "elastic(0.2, 0.1)",
        duration: 1.5,
        delay: 0.5,
        stagger: {
          each: 0.05,
          from: "random",
        },
        onComplete: () => setIsInitialized(true),
      });
    };

    animInTxt();

    const calcDist = () => {
      const maxYDragDist = charH * (maxYScale - 1);
      distY = mouseInitialY - mouseFinalY;
      dragYScale = distY / maxYDragDist;
      if (dragYScale > maxYScale - 1) {
        dragYScale = maxYScale - 1;
      } else if (dragYScale < -0.5) {
        dragYScale = -0.5;
      }
    };

    const calcfracDispersion = (index: number) => {
      const dispersion = 1 - Math.abs(index - charIndexSelected) / (numChars * elasticDropOff);
      return dispersion * dragYScale;
    };

    const setFontDragDimensions = () => {
      gsap.to(chars, {
        y: (index: number) => {
          const fracDispersion = calcfracDispersion(index);
          return fracDispersion * -50;
        },
        fontWeight: (index: number) => {
          const fracDispersion = calcfracDispersion(index);
          return weightInit - fracDispersion * weightDiff;
        },
        fontStretch: (index: number) => {
          const fracDispersion = calcfracDispersion(index);
          return stretchInit - fracDispersion * stretchDiff;
        },
        scaleY: (index: number) => {
          const fracDispersion = calcfracDispersion(index);
          let scaleY = 1 + fracDispersion;
          if (scaleY < 0.5) scaleY = 0.5;
          return scaleY;
        },
        ease: "power4",
        duration: 0.6,
      });
    };

    const snapBackText = () => {
      gsap.to(chars, {
        y: 0,
        fontWeight: weightInit,
        fontStretch: stretchInit,
        scale: 1,
        ease: "elastic(0.35, 0.1)",
        duration: 1,
        stagger: {
          each: 0.02,
          from: charIndexSelected,
        },
      });
    };

    // Event handlers
    const handleMouseDown = (e: MouseEvent, index: number) => {
      mouseInitialY = e.clientY;
      charIndexSelected = index;
      isMouseDown = true;
      document.body.classList.add("jello-grab");
    };

    const handleMouseUp = () => {
      if (isMouseDown) {
        isMouseDown = false;
        snapBackText();
        document.body.classList.remove("jello-grab");
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMouseDown) {
        mouseFinalY = e.clientY;
        calcDist();
        setFontDragDimensions();
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        snapBackText();
        isMouseDown = false;
        document.body.classList.remove("jello-grab");
      }
    };

    // Add event listeners
    chars.forEach((char, index) => {
      const charElement = char as HTMLElement;
      charElement.addEventListener("mousedown", (e) => handleMouseDown(e as MouseEvent, index));
    });

    document.body.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);

    // Cleanup
    return () => {
      document.body.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
      document.body.classList.remove("jello-grab");
      mySplitText.revert();
    };
  }, [text, fontWeight, fontStretch]);

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'GT-Flexa';
          src: url('https://assets.codepen.io/61488/GT-Flexa-VF-Trial.woff2');
          font-display: block;
          font-style: normal italic;
          font-weight: 100 800;
          font-stretch: 10% 200%;
        }

        .jello-stage {
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          visibility: hidden;
        }

        .jello-content {
          text-align: center;
        }

        .jello-txt {
          margin: 0;
          font-family: 'GT-Flexa', sans-serif;
          font-size: ${fontSize}vw;
          font-weight: ${fontWeight};
          font-stretch: ${fontStretch}%;
          line-height: 0.6;
          letter-spacing: -1vw;
          user-select: none;
          color: ${textColor};
          text-shadow: 0 0.05em 0 ${shadowColor},
                       0 0.1em 0.1em rgba(0, 0, 0, 0.5),
                       0 0.4em 0.3em rgba(0, 0, 0, 0.3);
        }

        .jello-txt .char {
          padding-top: 1.08vw;
          text-align: center;
          will-change: font-weight, font-stretch, transform;
          display: inline-block;
        }

        .jello-grab {
          cursor: url("data:image/svg+xml,%3Csvg width='64px' height='64px' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 700 700'%3E%3Cpath d='M419.9949,560.0013a179.4167,179.4167,0,0,1-127.73-52.898l-46.691-46.668a81.2138,81.2138,0,0,1-23.914-57.77v-35.352a81.1643,81.1643,0,0,1,23.918-57.75l22.75-22.723v-53.504a46.6566,46.6566,0,0,1,72.613-38.7813,46.691,46.691,0,0,1,88.106,0,46.6714,46.6714,0,0,1,70,23.3323,46.6566,46.6566,0,0,1,72.613,38.7813v151.67c0,83.625-68.039,151.66-151.67,151.66Zm-151.6526-221.66a11.666,11.666,0,1,0,23.332,0v-46.645a.19.19,0,0,1,.0039-.0469V233.34a23.332,23.332,0,1,1,46.664,0v35a11.666,11.666,0,1,0,23.332,0l.0039-58.336a23.332,23.332,0,1,1,46.664,0V268.34a11.666,11.666,0,1,0,23.332,0l.0039-35a23.332,23.332,0,1,1,46.664,0v35a11.666,11.666,0,1,0,23.332,0l.0039-11.668a23.332,23.332,0,1,1,46.664,0l-.0039,151.67c0,70.768-57.59,128.33-128.36,128.33a156.1776,156.1776,0,0,1-111.21-46.059l-46.691-46.668a58.0537,58.0537,0,0,1-17.078-41.254v-35.352a57.9448,57.9448,0,0,1,17.082-41.254l6.2539-6.2539Z' fill='%23fff'/%3E%3Cpath d='M419.9949,560.0013a179.4167,179.4167,0,0,1-127.73-52.898l-46.691-46.668a81.2138,81.2138,0,0,1-23.914-57.77v-35.352a81.1643,81.1643,0,0,1,23.918-57.75l22.75-22.723v-53.504a46.6566,46.6566,0,0,1,72.613-38.7813,46.691,46.691,0,0,1,88.106,0,46.6714,46.6714,0,0,1,70,23.3323,46.6566,46.6566,0,0,1,72.613,38.7813v151.67c0,83.625-68.039,151.66-151.67,151.66Zm-151.66-240.17-6.2539,6.2539a57.9448,57.9448,0,0,0-17.082,41.254v35.352a58.0537,58.0537,0,0,0,17.078,41.254l46.691,46.668a156.1776,156.1776,0,0,0,111.21,46.059c70.77,0,128.36-57.562,128.36-128.33l.0039-151.67a23.332,23.332,0,1,0-46.664,0l-.0039,11.668a11.666,11.666,0,1,1-23.332,0v-35a23.332,23.332,0,1,0-46.664,0l-.0039,35a11.666,11.666,0,1,1-23.332,0v-58.336a23.332,23.332,0,1,0-46.664,0l-.0039,58.336a11.666,11.666,0,1,1-23.332,0v-35a23.332,23.332,0,1,0-46.664,0v58.309a.19.19,0,0,0-.0039.0469v46.645a11.666,11.666,0,1,1-23.332,0Z'/%3E%3C/svg%3E") 32 32, pointer !important;
        }
      `}</style>
      <div ref={stageRef} className={`jello-stage ${className}`} style={{ backgroundColor }}>
        <div className="jello-content">
          <h1 ref={textRef} className="jello-txt">
            {text}
          </h1>
        </div>
      </div>
    </>
  );
};

export default JelloText;
