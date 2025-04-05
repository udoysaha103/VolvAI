import React from "react";
import styles from "./Features.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={`${styles.content} content`}>
        <div className={styles.row}>
          <img src="/hatching.png" onClick={() => navigate('/chatbot')}/>
          <div className={styles.text}>
            <h1 className={styles.header}>Hatchling: v0.1_Genesis</h1>
            <ul>
              <li>Data Absorption initiation</li>
              <li>Basic Sensory Input</li>
              <li>Community Nurturing</li>
              <li>Basic Pattern Recognition</li>
            </ul>
          </div>
        </div>
        <div className={styles.row}>
          <img src="/adolescent.png" onClick={() => navigate('/chatbot')} style={{height:"85px"}}/>
          <div className={styles.text}>
            <h1 className={styles.header}>
              Adolescent: v0.5_Quantum_Evolution
            </h1>
            <ul>
              <li>Problem-Solving</li>
              <li>Advanced Trend Prediction</li>
              <li>Candle Anomaly Detector</li>
              <li>Risk Assessment Module</li>
            </ul>
          </div>
        </div>
        <div className={styles.row}>
          <img src="/mature.png" onClick={() => navigate('/chatbot')}/>
          <div className={styles.text}>
            <h1 className={styles.header}>Mature: v0.8_Singularity</h1>
            <ul>
              <li>Advanced Reasoning</li>
              <li>Creative Collaboration</li>
              <li>Portfolio Optimization</li>
              <li>Dynamic Strategy Adjuster</li>
            </ul>
          </div>
        </div>
        <div className={styles.row}>
          <img src="/adult.png" onClick={() => navigate('/chatbot')}/>
          <div className={styles.text}>
            <h1 className={styles.header}>Adult: v1.0_OmniTrade_Volv AI</h1>
            <ul>
              <li>Meme Virality Score</li>
              <li>Fully Automated Trading</li>
              <li>Self-Learning Algorithm</li>
              <li>AI-Driven Market Manipulation Detection</li>
            </ul>
          </div>
        </div>
        <Footer className={styles.footer} />
      </div>
    </div>
  );
};

export default Features;
