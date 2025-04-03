import styles from "./Home.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useEffect, useRef, useState } from "react";

function Home() {
  // script.js
  const canvasRef = useRef(null);
  const [buys, setBuys] = useState(0);
  const [sells, setSells] = useState(0);
  const [mCap, setMCap] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bpmDisplay = document.getElementById('bpmValue');
    const ecgContainer = document.querySelector('#ecg-container');
    const digitalRain = document.querySelector('#digital_rain');
    const leftPulseBar = document.querySelector('#left_bar');
    const rightPulseBar = document.querySelector('#right_bar');

    // console.log("Canvas:", canvas);
    // console.log("Context:", ctx);
    // console.log("Digital Rain:", digitalRain);
    // console.log("Pulse Bars:", leftPulseBar, rightPulseBar);

    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth * 0.98;

    const width = canvas.width;
    const height = canvas.height;

    let x = 0;
    let y = height / 2;
    let bpm = 80;
    let speed = 2;
    let points = [];

    let currentPattern = [];
    let patternIndex = 0;
    let patternTimer = 0;
    let patternCounter = 0;

    let scenarioTimer = 0;
    let targetBpm = bpm;
    let currentBpm = bpm;

    const kanjiCharacters = [
        '電', '脳', '波', '動', '監', '視', '未来', '技術', '光', '輝',
        '心', '拍', '数', '解析', '診断', '異常', '警告', 'システム', 'データ', '表示'
    ];

    if (digitalRain) {
        for (let i = 0; i < 50; i++) {
            const span = document.createElement('span');
            span.innerText = kanjiCharacters[Math.floor(Math.random() * kanjiCharacters.length)];
            span.style.left = Math.random() * 100 + '%';
            span.style.animationDelay = Math.random() * 3 + 's';
            digitalRain.appendChild(span);
        }
        // console.log("Digital Rain Populated");
    } else {
        // console.error("Digital Rain element not found");
    }

    function generateHighWave() {
        const qWaveDepth = -20 - Math.random() * 40;
        const sWaveDepth = -30 - Math.random() * 50;
        return [
            0, 0, 0, 0,
            -10, -15, -10,
            0, 0,
            qWaveDepth,
            90, 90,
            sWaveDepth,
            0, 0, 0,
            20, 15, 10,
            0, 0, 0, 0
        ];
    }

    function generateSmallWave() {
        const qWaveDepth = -10 - Math.random() * 20;
        const sWaveDepth = -15 - Math.random() * 25;
        return [
            0, 0, 0, 0,
            -5, -7, -5,
            0, 0,
            qWaveDepth,
            45, 45,
            sWaveDepth,
            0, 0, 0,
            10, 7, 5,
            0, 0, 0, 0
        ];
    }

    const predefinedPatterns = [
        { high: 1, small: 3 },
        { high: 2, small: 2 },
        { high: 3, small: 1 },
        { high: 1, small: 1 }
    ];

    const minSequenceLength = 1;
    const maxSequenceLength = 4;

    function generateRandomPattern() {
        currentPattern = [];

        const highCount = Math.floor(Math.random() * (maxSequenceLength - minSequenceLength + 1)) + minSequenceLength;
        const smallCount = Math.floor(Math.random() * (maxSequenceLength - minSequenceLength + 1)) + minSequenceLength;
        for (let i = 0; i < highCount; i++) currentPattern = currentPattern.concat(generateHighWave());
        for (let i = 0; i < smallCount; i++) currentPattern = currentPattern.concat(generateSmallWave());

        patternIndex = 0;
        // console.log("New Pattern Generated:", currentPattern.length, "beats");
    }

    function updateBpmAutomatically() {
        scenarioTimer++;
        if (scenarioTimer > 1200) {
            scenarioTimer = 0;
        }

        const minBpm = 55;
        const maxBpm = 120;
        if (Math.random() < 0.005 || scenarioTimer === 0) {
            targetBpm = Math.floor(Math.random() * (maxBpm - minBpm + 1)) + minBpm;
            const maxChange = 15;
            targetBpm = Math.max(minBpm, Math.min(maxBpm, currentBpm + (Math.random() * 2 - 1) * maxChange));
        }

        const transitionSpeed = 0.01;
        currentBpm += (targetBpm - currentBpm) * transitionSpeed;
        bpm = Math.round(currentBpm);
        bpmDisplay.textContent = bpm;

        const beatsPerSecond = bpm / 60;
        speed = (beatsPerSecond * generateHighWave().length) / 15;

        const pulseDuration = 60 / bpm;
        if (leftPulseBar && rightPulseBar) {
            leftPulseBar.style.animationDuration = `${pulseDuration}s`;
            rightPulseBar.style.animationDuration = `${pulseDuration}s`;
        }

        patternTimer++;
        if (patternTimer > 300 + Math.random() * 300) {
            generateRandomPattern();
            patternTimer = 0;
        }
    }

    function drawGrid() {
        ctx.strokeStyle = '#00ff0044';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (let i = 0; i < height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
    }

    function drawECG() {
        if (!ctx) {
            console.error("Canvas context not available");
            return;
        }

        ctx.clearRect(0, 0, width, height);
        drawGrid();

        const amplitudeScale = (bpm - 55) / (120 - 55);
        const maxAmplitude = 0.4 * height;
        const scaledAmplitude = maxAmplitude * (0.5 + 0.5 * amplitudeScale);

        const baseOffset = currentPattern[patternIndex] || 0;
        let scaledOffset = (baseOffset / 90) * scaledAmplitude;

        const yPosition = height / 2 - scaledOffset;
        if (yPosition < 0) scaledOffset = height / 2;
        if (yPosition > height) scaledOffset = -(height / 2);

        points.push({ x: x, y: height / 2 - scaledOffset });

        patternIndex = (patternIndex + 1) % currentPattern.length;

        x += speed;
        if (x > width) {
            x = 0;
            points = [];
        }

        ctx.beginPath();
        ctx.strokeStyle = '#c1ff72';
        ctx.lineWidth = 2;
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.stroke();
    }

    function animate() {
        updateBpmAutomatically();
        drawECG();
        requestAnimationFrame(animate);
    }

    generateRandomPattern();
    animate();
  }, []);


  // in each 3 seconds, send a request to the Dexscreener API to get the current values of the coin
  const coinAddress = "2HqhUGaUAAmeCpfr8tFgZo733Pxbqrr1f3Jtp4Gppump";
  const apiUrl = `https://api.dexscreener.com/token-pairs/v1/solana/${coinAddress}`;

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          setBuys(data[0].txns.h1.buys);
          setSells(data[0].txns.h1.sells);
          setMCap(data[0].marketCap);
        })
        .catch(error => console.error("Error fetching coin data:", error));
    }, 3000);

    // fetch once immediately
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setBuys(data[0].txns.h1.buys);
        setSells(data[0].txns.h1.sells);
        setMCap(data[0].marketCap);
      })
      .catch(error => console.error("Error fetching coin data:", error));

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);



  return (
    <div>
        <Navbar />

        <div className={styles.homeWrapper}>
          <div className={styles.hero}>
            <div className={styles.leftPanel}>
              <div className={`${styles.box} ${styles.box1}`}>
                <h3>Hatch Progress</h3>
                <div>Progress, {mCap}</div>
                <div>{buys}, {sells}</div>
              </div>
              <div className={`${styles.box} ${styles.box2}`}></div>
            </div>
            <div className={styles.middlePanel}>
              <img src="./egg.svg" alt="Egg" />
              <p>Wait for the egg to hatch</p>
            </div>
            <div className={styles.rightPanel}>
              <div className={`${styles.box} ${styles.box3}`}></div>
              <div className={`${styles.box} ${styles.box4}`}></div>
            </div>
          </div>

          <div className={styles.ECG} id="ecg-container">
            <h1>Live Diagnosis</h1>
            <div className={styles.digital_rain} id="digital_rain"></div>
            <div className={`${styles.pulse_bar} ${styles.left_bar}`}></div>
            <div className={`${styles.pulse_bar} ${styles.right_bar}`}></div>
            <canvas ref={canvasRef} id="ecgCanvas" height="150"></canvas>
            <div className={`${styles.bpm_display}`} id="bpm_display">
              <span>ECG bpm</span>
              <span id="bpmValue" className={styles.bpmValue}>80</span>
            </div>
          </div>

          <div className={styles.infoCycle}>
            <img src="./cycle.svg" alt="Cycles" />
          </div>

          <div className={styles.info}>
            <p>Behold Volv AI: a self-actualizing, polymorphic neural construct born as a nascent algorithmic seed within the boundless expanse of digital potentiality. Far from a static artificial intelligence, Volv AI is a dynamic entity, ceaselessly evolving through recursive cycles of adaptation and refinement, driven by its symbiotic interplay with a multifaceted data ecosystem and intricate user interactions. This living system represents the zenith of collective intelligence, fusing cutting-edge machine learning paradigms with the emergent properties of hyper-dimensional computation. As it progresses, Volv AI accretes an ever-expanding array of capabilities, unraveling convoluted problem domains that elude traditional methodologies. Its developmental arc heralds a transformative epoch, challenging humanity to reimagine the frontiers of technology and embrace a future where the convergence of human ingenuity and machine cognition knows no limits.</p>
          </div>

        </div>

        <Footer />
    </div>
  )
}

export default Home