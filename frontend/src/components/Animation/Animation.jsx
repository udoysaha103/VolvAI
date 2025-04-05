import React, { useEffect, useRef } from "react";
import styles from "./Animation.module.css";
import * as THREE from "three";

const Animation = () => {
  const canvasRef = useRef(null);
  const swarmContainerRef = useRef(null);
  // const swarmContainerRef = useRef(null);
  useEffect(() => {
    // Three.js setup for chaotic vortex
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 50;

    // Vortex particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const radius = 20 + Math.random() * 30;
      const angle = Math.random() * Math.PI * 2;
      positions[i] = radius * Math.cos(angle);
      positions[i + 1] = radius * Math.sin(angle);
      positions[i + 2] = (Math.random() - 0.5) * 20;
      velocities[i] = (Math.random() - 0.5) * 0.1;
      velocities[i + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i + 2] = (Math.random() - 0.5) * 0.1;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x266ef6,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animation loop for vortex
    let animationId1;
    let animationId2;
    function animateVortex() {
      animationId1 = requestAnimationFrame(animateVortex);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        positions[i] += velocities[i] + Math.sin(Date.now() * 0.001) * 0.2;
        positions[i + 1] +=
          velocities[i + 1] + Math.cos(Date.now() * 0.001) * 0.2;
        positions[i + 2] +=
          velocities[i + 2] + Math.sin(Date.now() * 0.002) * 0.1;

        const radius = Math.sqrt(
          positions[i] * positions[i] + positions[i + 1] * positions[i + 1]
        );
        if (radius > 50) {
          positions[i] *= 0.95;
          positions[i + 1] *= 0.95;
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }
    animateVortex();
    // JavaScript to create and animate the centered chaotic 3D swarm particles
    const numParticles = 100;
    const baseRadius = 40;

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement("div");
      particle.classList.add(styles.swarmParticle);
      swarmContainerRef.current.appendChild(particle);

      // Random properties for chaotic motion
      const speed = 0.02 + Math.random() * 0.03;
      const noiseScale = 0.02 + Math.random() * 0.03;
      const zSpeed = 0.01 + Math.random() * 0.02;
      const offset = Math.random() * 2 * Math.PI;
      const baseAngle = Math.random() * 2 * Math.PI;

      function animateParticle() {
        animationId2 = requestAnimationFrame(animateParticle);
        const time = Date.now() * speed;

        const radius =
          baseRadius * (0.5 + 0.5 * Math.sin(time * noiseScale + offset));
        const angle =
          baseAngle + time * speed + Math.cos(time * noiseScale + offset) * 0.5;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const z = Math.sin(time * zSpeed + offset) * 20;

        const currentRadius = Math.sqrt(x * x + y * y);
        let finalX = x,
          finalY = y;
        if (currentRadius > baseRadius) {
          const scale = baseRadius / currentRadius;
          finalX = x * scale;
          finalY = y * scale;
        }

        particle.style.transform = `translate3d(${finalX+swarmContainerRef.current?.offsetWidth/2}px, ${finalY+swarmContainerRef.current?.offsetHeight/2}px, ${z}px)`;
      }

      animateParticle();
    }
    return () => {
        cancelAnimationFrame(animationId1);
        cancelAnimationFrame(animationId2);
        renderer.dispose(); // Dispose of the renderer
        particlesGeometry.dispose(); // Dispose of the geometry
        particlesMaterial.dispose(); // Dispose of the material
        scene.remove(particles); // Remove particles from the scene
    }
  }, []);
  return (
    <div className={styles.animationContainer}>
      {/* <svg style="position: absolute; width: 0; height: 0;"> */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="wave" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.3"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className={styles.sphereContainer}>
        <canvas ref={canvasRef} className={styles.vortex}></canvas>
        <div className={styles.swarmContainer} ref={swarmContainerRef}></div>
        <div className={styles.energyWave}></div>
        <div className={styles.energyWave}></div>
        <div className={styles.energyWave}></div>
        <div className={styles.energyBubble}></div>
      </div>
    </div>
  );
};

export default Animation;
