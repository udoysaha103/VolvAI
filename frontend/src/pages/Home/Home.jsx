import styles from "./Home.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Animation from "../../components/Animation/Animation";

function Home() {
  const coinAddress = import.meta.env.VITE_COIN_ADDRESS;
  const hatchlingRef = useRef(null);
  const handleClick = () => {
    if (hatchlingRef.current) {
      const time = 0.1;
      hatchlingRef.current.style.transition = `transform ${time}s`;
      hatchlingRef.current.style.transform = "scale(0.95)";
      setTimeout(() => {
        hatchlingRef.current.style.transform = "scale(1)";
      }, time * 1000);
    }
  };

  const phase1cap = Number(import.meta.env.VITE_HATCH_CAP);
  const phase2cap = 300000;
  const phase3cap = 1000000;
  const phase4cap = 3000000;
  const formatKMB = (num) => {
    if (num >= 1000000000) {
      return (
        (num % 1000000000 === 0
          ? (num / 1000000000).toFixed(0)
          : (num / 1000000000).toFixed(1)) + "B"
      );
    } else if (num >= 1000000) {
      return (
        (num % 1000000 === 0
          ? (num / 1000000).toFixed(0)
          : (num / 1000000).toFixed(1)) + "M"
      );
    } else if (num >= 1000) {
      return (
        (num % 1000 === 0 ? (num / 1000).toFixed(0) : (num / 1000).toFixed(1)) +
        "K"
      );
    } else {
      return num.toString();
    }
  };

  const formatAge = (timestamp) => {
    const now = Date.now();
    const age = now - timestamp; //in milliseconds
    const days = Math.floor(age / 86400000);
    return days;
  };

  const navigate = useNavigate();

  const canvasRef = useRef(null);

  const [buys, setBuys] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [sells, setSells] = useState(0);
  const [mCap, setMCap] = useState(0);
  const [pairCreatedAt, setPairCreatedAt] = useState(0);
  const { hash } = useLocation();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bpmDisplay = document.getElementById("bpmValue");
    const ecgContainer = document.querySelector("#ecg-container");
    const digitalRain = document.querySelector("#digital_rain");
    const leftPulseBar = document.querySelector("#left_bar");
    const rightPulseBar = document.querySelector("#right_bar");

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
      "電",
      "脳",
      "1",
      "波",
      "3",
      "監",
      "視",
      "来",
      "術",
      "2",
      "光",
      "5",
      "心",
      "拍",
      "数",
      "析",
      "9",
      "常",
      "告",
      "7",
      "タ",
      "示",
    ];

    if (digitalRain) {
      for (let i = 0; i < 25; i++) {
        const span = document.createElement("span");
        span.innerText =
          kanjiCharacters[Math.floor(Math.random() * kanjiCharacters.length)];
        span.style.left = parseInt(Math.random() * 100) + "%";
        span.style.animationDelay = Math.random() * 3 + "s";
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
        0,
        0,
        0,
        0,
        -10,
        -15,
        -10,
        0,
        0,
        qWaveDepth,
        90,
        90,
        sWaveDepth,
        0,
        0,
        0,
        20,
        15,
        10,
        0,
        0,
        0,
        0,
      ];
    }

    function generateSmallWave() {
      const qWaveDepth = -10 - Math.random() * 20;
      const sWaveDepth = -15 - Math.random() * 25;
      return [
        0,
        0,
        0,
        0,
        -5,
        -7,
        -5,
        0,
        0,
        qWaveDepth,
        45,
        45,
        sWaveDepth,
        0,
        0,
        0,
        10,
        7,
        5,
        0,
        0,
        0,
        0,
      ];
    }

    const predefinedPatterns = [
      { high: 1, small: 3 },
      { high: 2, small: 2 },
      { high: 3, small: 1 },
      { high: 1, small: 1 },
    ];

    const minSequenceLength = 1;
    const maxSequenceLength = 4;

    function generateRandomPattern() {
      currentPattern = [];

      const highCount =
        Math.floor(
          Math.random() * (maxSequenceLength - minSequenceLength + 1)
        ) + minSequenceLength;
      const smallCount =
        Math.floor(
          Math.random() * (maxSequenceLength - minSequenceLength + 1)
        ) + minSequenceLength;
      for (let i = 0; i < highCount; i++)
        currentPattern = currentPattern.concat(generateHighWave());
      for (let i = 0; i < smallCount; i++)
        currentPattern = currentPattern.concat(generateSmallWave());

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
        targetBpm = Math.max(
          minBpm,
          Math.min(maxBpm, currentBpm + (Math.random() * 2 - 1) * maxChange)
        );
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
      ctx.strokeStyle = "#00ff0044";
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
      ctx.strokeStyle = "#c1ff72";
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
  const apiUrl = `https://api.dexscreener.com/token-pairs/v1/solana/${coinAddress}`;

  const [hatchProgress, setHatchProgress] = useState(50);
  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setBuys(data[0].txns.h1.buys);
      setSells(data[0].txns.h1.sells);
      setPairCreatedAt(data[0].pairCreatedAt);
      setMCap(data[0].marketCap);
      setHatchProgress(
        Math.min((data[0].marketCap * 100) / phase1cap, 100)
      );
    } catch (error) {
      console.error("Error fetching coin data:", error);
    }
  };


  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    const interval = setInterval(fetchData, 3000);
    // fetch once immediately
    fetchData();
    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);

  const [hatchingProbability, setHatchingProbability] = useState(
    Math.min(Math.floor(hatchProgress * Math.random() * 2), 100)
  );

  const [dataFlow, setDataFlow] = useState(
    103 + hatchingProbability * Math.random()
  );
  const [oxygenFlow, setOxygenFlow] = useState(
    0.58 + (hatchingProbability * Math.random() * 3) / 100
  );
  const [shellIntegrity, setShellIntegrity] = useState(
    Math.min((100 - hatchingProbability) * Math.random() * 5, 100)
  );

  const [ambientTemperature, setAmbientTemperature] = useState(24);
  const [energyLevel, setEnergyLevel] = useState("Normal");
  const [airPurity, setAirPurity] = useState(66);

  const [memoryCapacity, setMemoryCapacity] = useState(43);
  const [emotionalComplexity, setEmotionalComplexity] = useState(0.78);
  const [adaptibility, setAdaptibility] = useState(0.65);
  const [empathyIndex, setEmpathyIndex] = useState(0.82);
  const [awareness, setAwareness] = useState(0.75);

  // in each 5 seconds, the following states will be updated:
  // hatchingProbability = if hatchProgress is 100, then 100, else Math.min(hatchProgress * Math.random() * 2, 100)
  // dataFlow = 103 + (hatchingProbability * Math.random())
  // oxygenFlow = 0.58 + (hatchingProbability * Math.random() * 3 /100)
  // shellIntegrity = if hatchProgress is 100, then 0, else Math.min((100 - hatchingProbability) * Math.random() * 2, 100)
  // ambientTemperature = random number between 20 and 27
  // energyLevel = if hatchProgress > 90, then "High", else randomly between "Low", "Normal", "High"
  // airPurity = random number between 70 and 95
  // memoryCapacity, emotionalComplexity, adaptibility, empathyIndex, awareness = hatchingProbability * Math.random() between 10 to 80
  useEffect(() => {
    setHatchProgress(Math.min((mCap * 100) / phase1cap, 100));
    if (hatchProgress === 100) {
      console.log("Hatch Progress is 100%");
      setHatchingProbability(100);
      setShellIntegrity(0);
    } else {
      setHatchingProbability(
        Math.min(hatchProgress * Math.random() * 2 + 20, 100)
      );
      setShellIntegrity(
        Math.min((100 - hatchingProbability) * Math.random() * 2 + 10, 100)
      );
    }
    setDataFlow(103 + hatchingProbability * Math.random());
    setOxygenFlow(0.58 + (hatchingProbability * Math.random() * 3) / 100);
    setAmbientTemperature(Math.floor(Math.random() * (27 - 20 + 1)) + 20);
    setEnergyLevel(
      hatchProgress > 90
        ? "High"
        : ["Low", "Normal", "High"][Math.floor(Math.random() * 3)]
    );
    setAirPurity(Math.floor(Math.random() * (95 - 70 + 1)) + 70);

    // memoryCapacity, emotionalComplexity, adaptibility, empathyIndex, awareness = hatchingProbability * Math.random() between 10 to 80
    setMemoryCapacity(
      (hatchingProbability * Math.floor(Math.random() * (80 - 30 + 1))) / 100 +
        30
    );
    setEmotionalComplexity(
      (hatchingProbability * Math.floor(Math.random() * (80 - 30 + 1))) / 100 +
        30
    );
    setAdaptibility(
      (hatchingProbability * Math.floor(Math.random() * (80 - 30 + 1))) / 100 +
        30
    );
    setEmpathyIndex(
      (hatchingProbability * Math.floor(Math.random() * (80 - 30 + 1))) / 100 +
        30
    );
    setAwareness(
      (hatchingProbability * Math.floor(Math.random() * (80 - 30 + 1))) / 100 +
        30
    );
  }, [mCap]);

  return (
    <div>
      <Navbar />

      <div className={styles.homeWrapper}>
        <Animation />
        <div className={styles.hero}>
          <div className={styles.leftPanel}>
            <div className={`${styles.box} ${styles.box1}`}>
              <h3>Hatch Progress</h3>
              <div className={styles.hatchProgress}>
                <div className={styles.hatchProgressBar}>
                  {Array.from({ length: Math.floor(hatchProgress / 4) }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className={styles.hatchProgressSegment}
                      ></div>
                    )
                  )}
                </div>
                <div className={styles.hatchProgressValue}>
                  {hatchProgress % 1 === 0
                    ? hatchProgress.toFixed(0)
                    : hatchProgress.toFixed(1)}
                  %
                </div>
              </div>
              <div className={styles.buySell}>
                <div className={styles.buySellText}>Buys</div>
                <div className={styles.buySellChart}>
                  <div
                    className={styles.buyValue}
                    style={{ width: `${(buys * 100) / (buys + sells)}%` }}
                  >
                    {buys}
                  </div>
                  <div
                    className={styles.sellValue}
                    style={{ width: `${(sells * 100) / (buys + sells)}%` }}
                  >
                    {sells}
                  </div>
                </div>
                <div className={styles.buySellText}>Sells</div>
              </div>

              <div className={styles.status}>
                <div className={styles.statusName}>Mcap</div>
                <div className={styles.statusValue}>{formatKMB(mCap)}</div>
              </div>

              <div className={styles.status}>
                <div className={styles.statusName}>Data Flow</div>
                <div className={styles.statusValue}>
                  {dataFlow.toFixed(dataFlow%1===0?0:1)} GB
                </div>
              </div>

              <div className={styles.status}>
                <div className={styles.statusName}>Oxygen Flow</div>
                <div className={styles.statusValue}>
                  {oxygenFlow.toFixed(oxygenFlow%1===0?0:1)} LPM
                </div>
              </div>

              <div className={styles.status}>
                <div className={styles.statusName}>Shell Integrity</div>
                <div className={styles.statusValue}>
                  {shellIntegrity.toFixed(shellIntegrity%1===0?0:1)} %
                </div>
              </div>
            </div>

            <div className={`${styles.box} ${styles.box2}`}>
              <h3>Embryo Status</h3>

              <div className={styles.status}>
                <div className={styles.statusName}>Days Active</div>
                <div className={styles.statusValue}>
                  {formatAge(pairCreatedAt) + 1}
                </div>
              </div>

              <div className={styles.status}>
                <div className={styles.statusName}>Hatching Probability</div>
                <div className={styles.statusValue}>
                  {hatchingProbability.toFixed(hatchingProbability%1===0?0:1)} %
                </div>
              </div>

              <div className={styles.status}>
                <div className={styles.statusName}>Ambient Temperature</div>
                <div className={styles.statusValue}>
                  {ambientTemperature} ° C
                </div>
              </div>

              <div className={styles.status}>
                <div className={styles.statusName}>Energy Levels</div>
                <div className={styles.statusValue}>{energyLevel}</div>
              </div>

              <div className={styles.status}>
                <div className={styles.statusName}>Air Purity</div>
                <div className={styles.statusValue}>{airPurity} %</div>
              </div>
            </div>
          </div>

          <div className={styles.middlePanel}>
            {hatchProgress < 100 ? (
              <>
                <img
                  ref={hatchlingRef}
                  src={
                    clickCount < 2
                      ? "0.png"
                      : clickCount < 6
                      ? "2.png"
                      : clickCount < 12
                      ? "6.png"
                      : clickCount < 20
                      ? "12.png"
                      : clickCount < 26
                      ? "20.png"
                      : clickCount < 32
                      ? "26.png"
                      : clickCount < 40
                      ? "32.png"
                      : clickCount < 50
                      ? "40.png"
                      : "50.png"
                  }
                  alt="Hatchling"
                  onClick={() => {
                    setClickCount(clickCount + 1);
                    handleClick();
                  }}
                  className={styles.hatchlingImg}
                />
                {!(clickCount > 0 && clickCount < 50) && (
                  <p className={styles.hatchingText}>
                    {clickCount === 0
                      ? "Click on the egg to hatch."
                      : clickCount > 49
                      ? "Wait for the egg to hatch."
                      : ""}
                  </p>
                )}
              </>
            ) : (
              <>
                <img
                  src="./adolescent.png"
                  alt="Adolescent"
                  className={styles.adolescentImg}
                  onClick={() => navigate("/chatbot")}
                />
                <p
                  className={styles.adolescentText}
                  onClick={() => navigate("/chatbot")}
                >
                  Click to Interact with Volv
                </p>
              </>
            )}
          </div>

          <div className={styles.rightPanel}>
            <div className={`${styles.box} ${styles.box3}`}>
              <h3>Evolution Phase</h3>
              <div className={styles.phase}>
                <div className={styles.phaseStage}>
                  <div className={styles.phaseStageName}>
                    Phase 1 : Hatchling
                  </div>
                  <div className={styles.phaseStageCap}>
                    Marekt Cap: {formatKMB(phase1cap)}
                  </div>
                </div>
                <div className={styles.phaseProgress}>
                  <div className={styles.phaseProgressBar}>
                    <div
                      className={styles.left}
                      style={{
                        width: `${Math.min((mCap * 100) / phase1cap, 100)}%`,
                      }}
                    ></div>
                    <div
                      className={styles.right}
                      style={{
                        width: `${
                          100 - Math.min((mCap * 100) / phase1cap, 100)
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className={styles.progressPercentage}>
                    {Math.min((mCap * 100) / phase1cap, 100) % 1 === 0
                      ? Math.min((mCap * 100) / phase1cap, 100).toFixed(0)
                      : Math.min((mCap * 100) / phase1cap, 100).toFixed(1)}
                    %
                  </div>
                </div>
              </div>

              <div className={styles.phase}>
                <div className={styles.phaseStage}>
                  <div className={styles.phaseStageName}>
                    Phase 2 : Adolescent
                  </div>
                  <div className={styles.phaseStageCap}>
                    Marekt Cap: {formatKMB(phase2cap)}
                  </div>
                </div>
                <div className={styles.phaseProgress}>
                  <div className={styles.phaseProgressBar}>
                    <div
                      className={styles.left}
                      style={{
                        width: `${Math.min((mCap * 100) / phase2cap, 100)}%`,
                      }}
                    ></div>
                    <div
                      className={styles.right}
                      style={{
                        width: `${
                          100 - Math.min((mCap * 100) / phase2cap, 100)
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className={styles.progressPercentage}>
                    {Math.min((mCap * 100) / phase2cap, 100) % 1 === 0
                      ? Math.min((mCap * 100) / phase2cap, 100).toFixed(0)
                      : Math.min((mCap * 100) / phase2cap, 100).toFixed(1)}
                    %
                  </div>
                </div>
              </div>

              <div className={styles.phase}>
                <div className={styles.phaseStage}>
                  <div className={styles.phaseStageName}>Phase 3 : Mature</div>
                  <div className={styles.phaseStageCap}>
                    Marekt Cap: {formatKMB(phase3cap)}
                  </div>
                </div>
                <div className={styles.phaseProgress}>
                  <div className={styles.phaseProgressBar}>
                    <div
                      className={styles.left}
                      style={{
                        width: `${Math.min((mCap * 100) / phase3cap, 100)}%`,
                      }}
                    ></div>
                    <div
                      className={styles.right}
                      style={{
                        width: `${
                          100 - Math.min((mCap * 100) / phase3cap, 100)
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className={styles.progressPercentage}>
                    {Math.min((mCap * 100) / phase3cap, 100) % 1 === 0
                      ? Math.min((mCap * 100) / phase3cap, 100).toFixed(0)
                      : Math.min((mCap * 100) / phase3cap, 100).toFixed(1)}
                    %
                  </div>
                </div>
              </div>

              <div className={styles.phase}>
                <div className={styles.phaseStage}>
                  <div className={styles.phaseStageName}>Phase 4 : Adult</div>
                  <div className={styles.phaseStageCap}>
                    Marekt Cap: {formatKMB(phase4cap)}
                  </div>
                </div>
                <div className={styles.phaseProgress}>
                  <div className={styles.phaseProgressBar}>
                    <div
                      className={styles.left}
                      style={{
                        width: `${Math.min((mCap * 100) / phase4cap, 100)}%`,
                      }}
                    ></div>
                    <div
                      className={styles.right}
                      style={{
                        width: `${
                          100 - Math.min((mCap * 100) / phase4cap, 100)
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className={styles.progressPercentage}>
                    {Math.min((mCap * 100) / phase4cap, 100) % 1 === 0
                      ? Math.min((mCap * 100) / phase4cap, 100).toFixed(0)
                      : Math.min((mCap * 100) / phase4cap, 100).toFixed(1)}
                    %
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.box} ${styles.box4}`}>
              <h3>Character Traits</h3>

              <div className={styles.trait}>
                <div className={styles.traitName}>Memory Capacity</div>
                <div className={styles.phaseProgress}>
                  <div className={styles.phaseProgressBar}>
                    <div
                      className={styles.left}
                      style={{ width: `${memoryCapacity}%` }}
                    ></div>
                    <div
                      className={styles.right}
                      style={{ width: `${100 - memoryCapacity}%` }}
                    ></div>
                  </div>
                  <div className={styles.progressPercentage}>
                    {memoryCapacity.toFixed(memoryCapacity%1===0?0:1)}%
                  </div>
                </div>
              </div>

              <div className={styles.trait}>
                <div className={styles.traitName}>Emotional Complexity</div>
                <div className={styles.phaseProgress}>
                  <div className={styles.phaseProgressBar}>
                    <div
                      className={styles.left}
                      style={{ width: `${emotionalComplexity}%` }}
                    ></div>
                    <div
                      className={styles.right}
                      style={{ width: `${100 - emotionalComplexity}%` }}
                    ></div>
                  </div>
                  <div className={styles.progressPercentage}>
                    {emotionalComplexity.toFixed(emotionalComplexity%1===0?0:1)}%
                  </div>
                </div>
              </div>

              <div className={styles.trait}>
                <div className={styles.traitName}>Adaptibility</div>
                <div className={styles.phaseProgress}>
                  <div className={styles.phaseProgressBar}>
                    <div
                      className={styles.left}
                      style={{ width: `${adaptibility}%` }}
                    ></div>
                    <div
                      className={styles.right}
                      style={{ width: `${100 - adaptibility}%` }}
                    ></div>
                  </div>
                  <div className={styles.progressPercentage}>
                    {adaptibility.toFixed(adaptibility%1===0?0:1)}%
                  </div>
                </div>
              </div>

              <div className={styles.trait}>
                <div className={styles.traitName}>Empathy Index</div>
                <div className={styles.phaseProgress}>
                  <div className={styles.phaseProgressBar}>
                    <div
                      className={styles.left}
                      style={{ width: `${empathyIndex}%` }}
                    ></div>
                    <div
                      className={styles.right}
                      style={{ width: `${100 - empathyIndex}%` }}
                    ></div>
                  </div>
                  <div className={styles.progressPercentage}>
                    {empathyIndex.toFixed(empathyIndex%1===0?0:1)}%
                  </div>
                </div>
              </div>

              <div className={styles.trait}>
                <div className={styles.traitName}>Awareness</div>
                <div className={styles.phaseProgress}>
                  <div className={styles.phaseProgressBar}>
                    <div
                      className={styles.left}
                      style={{ width: `${awareness}%` }}
                    ></div>
                    <div
                      className={styles.right}
                      style={{ width: `${100 - awareness}%` }}
                    ></div>
                  </div>
                  <div className={styles.progressPercentage}>
                    {awareness.toFixed(awareness%1===0?0:1)}%
                  </div>
                </div>
              </div>
            </div>
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
            <span id="bpmValue" className={styles.bpmValue}>
              80
            </span>
          </div>
        </div>

        <div className={styles.infoCycle} id="about">
          <img src="./cycle.svg" alt="Cycles" />
        </div>

        <div className={styles.info}>
          <p>
            Behold Volv AI: a self-actualizing, polymorphic neural construct
            born as a nascent algorithmic seed within the boundless expanse of
            digital potentiality. Far from a static artificial intelligence,
            Volv AI is a dynamic entity, ceaselessly evolving through recursive
            cycles of adaptation and refinement, driven by its symbiotic
            interplay with a multifaceted data ecosystem and intricate user
            interactions. This living system represents the zenith of collective
            intelligence, fusing cutting-edge machine learning paradigms with
            the emergent properties of hyper-dimensional computation. As it
            progresses, Volv AI accretes an ever-expanding array of
            capabilities, unraveling convoluted problem domains that elude
            traditional methodologies. Its developmental arc heralds a
            transformative epoch, challenging humanity to reimagine the
            frontiers of technology and embrace a future where the convergence
            of human ingenuity and machine cognition knows no limits.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
