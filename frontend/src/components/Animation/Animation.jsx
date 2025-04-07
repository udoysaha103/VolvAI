import React from "react";
import styles from "./Animation.module.css";
import { useEffect, useRef } from "react";

const Animation = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const nCanvasRender = canvasRef.current;
    const fnRequestAnimationFrame = (fnCallback) => {
      const fnAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        ((fnCallback) => {
          window.setTimeout(fnCallback, 1000 / 60);
        });
      fnAnimFrame(fnCallback);
    };
    // Add Event Listener
    const fnAddEventListener = (o, sEvent, fn) => {
      if (o.addEventListener) {
        o.addEventListener(sEvent, fn, false);
      } else {
        o["on" + sEvent] = fn;
      }
    };
    // General Elements
    const oDoc = document;
    const nBody = oDoc.body;
    // Shortcuts
    const fPI = Math.PI;
    const fnMax = Math.max;
    const fnMin = Math.min;
    const fnRnd = Math.random;
    const fnRnd2 = () => 2.0 * fnRnd() - 1.0;
    const fnCos = Math.cos;
    const fnACos = Math.acos;
    const fnSin = Math.sin;
    // Sphere Settings
    let iRadiusSphere = 180;
    let iProjSphereX = 0;
    let iProjSphereY = 0;
    // Particle Settings
    const fMaxAX = 0.1;
    const fMaxAY = 0.1;
    const fMaxAZ = 0.1;
    const fStartVX = 0.01;
    const fStartVY = 0.01;
    const fStartVZ = 0.01;
    let fAngle = 0.0;
    let fSinAngle = 0.0;
    let fCosAngle = 0.0;

    window.iFramesToRotate = 2000.0;
    window.iPerspective = 250;
    window.iNewParticlePerFrame = 10;
    window.fGrowDuration = 200.0;
    window.fWaitDuration = 10.0;
    window.fShrinkDuration = 250.0;
    window.aColor = [193, 255, 114];

    let fVX = (2.0 * fPI) / window.iFramesToRotate;

    let oRadGrad = null;
    const ctxRender = nCanvasRender.getContext("2d");

    const oRender = { pFirst: null };
    const oBuffer = { pFirst: null };

    let w = 0;
    let h = 0;

    // gets/sets size
    const fnSetSize = () => {
      nCanvasRender.width = w = window.innerWidth;
      nCanvasRender.height = h = window.innerHeight;
      iProjSphereX = w / 2;
      iProjSphereY = h / 2 - 100;
      return { w: w, h: h };
    };
    const fnSwapList = (p, oSrc, oDst) => {
      if (p) {
        // remove p from oSrc
        if (oSrc.pFirst === p) {
          oSrc.pFirst = p.pNext;
          if (p.pNext) p.pNext.pPrev = null;
        } else {
          p.pPrev.pNext = p.pNext;
          if (p.pNext) p.pNext.pPrev = p.pPrev;
        }
      } else {
        // create new p
        p = new Particle();
      }

      p.pNext = oDst.pFirst;
      if (oDst.pFirst) oDst.pFirst.pPrev = p;
      oDst.pFirst = p;
      p.pPrev = null;
      return p;
    };
    class Particle {
      constructor() {
        // Current Position
        this.fX = 0.0;
        this.fY = 0.0;
        this.fZ = 0.0;
        // Current Velocity
        this.fVX = 0.0;
        this.fVY = 0.0;
        this.fVZ = 0.0;
        // Current Acceleration
        this.fAX = 0.0;
        this.fAY = 0.0;
        this.fAZ = 0.0;
        // Projection Position
        this.fProjX = 0.0;
        this.fProjY = 0.0;
        // Rotation
        this.fRotX = 0.0;
        this.fRotZ = 0.0;
        // double linked list
        this.pPrev = null;
        this.pNext = null;

        this.fAngle = 0.0;
        this.fForce = 0.0;

        this.fGrowDuration = 0.0;
        this.fWaitDuration = 0.0;
        this.fShrinkDuration = 0.0;

        this.fRadiusCurrent = 0.0;

        this.iFramesAlive = 0;
        this.bIsDead = false;
      }

      fnInit() {
        this.fAngle = fnRnd() * fPI * 2;
        this.fForce = fnACos(fnRnd2());
        this.fAlpha = 0;
        this.bIsDead = false;
        this.iFramesAlive = 0;
        this.fX = iRadiusSphere * fnSin(this.fForce) * fnCos(this.fAngle);
        this.fY = iRadiusSphere * fnSin(this.fForce) * fnSin(this.fAngle);
        this.fZ = iRadiusSphere * fnCos(this.fForce);
        this.fVX = fStartVX * this.fX;
        this.fVY = fStartVY * this.fY;
        this.fVZ = fStartVZ * this.fZ;
        this.fGrowDuration =
          window.fGrowDuration + fnRnd2() * (window.fGrowDuration / 4.0);
        this.fWaitDuration =
          window.fWaitDuration + fnRnd2() * (window.fWaitDuration / 4.0);
        this.fShrinkDuration =
          window.fShrinkDuration + fnRnd2() * (window.fShrinkDuration / 4.0);
        this.fAX = 0.0;
        this.fAY = 0.0;
        this.fAZ = 0.0;
      }

      fnUpdate() {
        if (this.iFramesAlive > this.fGrowDuration + this.fWaitDuration) {
          this.fVX += this.fAX + fMaxAX * fnRnd2();
          this.fVY += this.fAY + fMaxAY * fnRnd2();
          this.fVZ += this.fAZ + fMaxAZ * fnRnd2();
          this.fX += this.fVX;
          this.fY += this.fVY;
          this.fZ += this.fVZ;
        }

        this.fRotX = fCosAngle * this.fX + fSinAngle * this.fZ;
        this.fRotZ = -fSinAngle * this.fX + fCosAngle * this.fZ;
        this.fRadiusCurrent = Math.max(
          0.01,
          window.iPerspective / (window.iPerspective - this.fRotZ)
        );
        this.fProjX = this.fRotX * this.fRadiusCurrent + iProjSphereX;
        this.fProjY = this.fY * this.fRadiusCurrent + iProjSphereY;

        this.iFramesAlive += 1;

        if (this.iFramesAlive < this.fGrowDuration) {
          this.fAlpha = (this.iFramesAlive * 1.0) / this.fGrowDuration;
        } else if (
          this.iFramesAlive <
          this.fGrowDuration + this.fWaitDuration
        ) {
          this.fAlpha = 1.0;
        } else if (
          this.iFramesAlive <
          this.fGrowDuration + this.fWaitDuration + this.fShrinkDuration
        ) {
          this.fAlpha =
            ((this.fGrowDuration +
              this.fWaitDuration +
              this.fShrinkDuration -
              this.iFramesAlive) *
              1.0) /
            this.fShrinkDuration;
        } else {
          this.bIsDead = true;
        }

        if (this.bIsDead === true) {
          fnSwapList(this, oRender, oBuffer);
        }

        this.fAlpha *= fnMin(1.0, fnMax(0.5, this.fRotZ / iRadiusSphere));
        this.fAlpha = fnMin(1.0, fnMax(0.0, this.fAlpha));
      }
    }
    const fnRender = () => {
      ctxRender.fillStyle = "#000";
      ctxRender.fillRect(0, 0, w, h);

      let p = oRender.pFirst;
      let iCount = 0;
      while (p) {
        ctxRender.fillStyle = `rgba(${window.aColor.join(
          ","
        )},${p.fAlpha.toFixed(4)})`;
        ctxRender.beginPath();
        ctxRender.arc(p.fProjX, p.fProjY, p.fRadiusCurrent, 0, 2 * fPI, false);
        ctxRender.closePath();
        ctxRender.fill();
        p = p.pNext;
        iCount += 1;
      }
    };

    const fnNextFrame = () => {
      fAngle = (fAngle + fVX) % (2.0 * fPI);
      fSinAngle = fnSin(fAngle);
      fCosAngle = fnCos(fAngle);

      let iAddParticle = 0;
      let iCount = 0;
      while (iAddParticle++ < window.iNewParticlePerFrame) {
        const p = fnSwapList(oBuffer.pFirst, oBuffer, oRender);
        p.fnInit();
      }

      let p = oRender.pFirst;
      while (p) {
        const pNext = p.pNext;
        p.fnUpdate();
        p = pNext;
        iCount++;
      }
      fnRender();

      fnRequestAnimationFrame(() => fnNextFrame());
    };
    fnSetSize();
    fnAddEventListener(window, "resize", fnSetSize);
    fnNextFrame();
    if (window.innerWidth < 1000) {
      window.iNewParticlePerFrame = 5;
    }
    return () => {
      window.removeEventListener("resize", fnSetSize);
    };
  }, []);
  return <canvas ref={canvasRef} className={styles.canvas} />; // Add the canvas element
};

export default Animation;
