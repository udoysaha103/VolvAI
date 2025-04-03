import React, { useEffect } from "react";
import styles from "./FAQ.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
const content = [
  {
    title: "What is Volv AI and how does it work?",
    text: "Volv AI is an advanced artificial intelligence system that uses multi-modal learning and adaptive reasoning. It generalizes across tasks, learns from sparse data, and evolves its strategies with minimal human intervention.",
  },
  {
    title: "How does Volv AI evolve?",
    text: "Volv AI progresses through four phases (Hatchling, Adolescent, Mature, Adult) using recursive self-improvement and neural architecture search. Each phase enhances its cognitive and operational capabilities autonomously.",
  },
  {
    title: "Can Volv AI be customized for specific crypto analysis needs?",
    text: "Yes, Volv AI’s modular architecture allows task-specific fine-tuning of neural networks and datasets. Users can tailor it to focus on specific cryptocurrencies or market segments such as Memecoin market.",
  },
  {
    title: "What sets Volv AI apart from traditional AI systems?",
    text: "Unlike narrow AI, Volv AI generalizes across tasks, learns from minimal data, and autonomously adapts to new conditions. Its AGI architecture enables reasoning, planning, and self-improvement.",
  },
  {
    title: "What safeguards prevent Volv AI from high-risk trading decisions?",
    text: "Volv AI employs probabilistic risk assessment, fail-safe mechanisms, and human-in-the-loop oversight. These ensure operations stay within predefined risk thresholds.",
  },
];
const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  document.title = "FAQ | Volv AI";
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={`${styles.content} content`}>
        <div className={styles.contentBox}>
          <h1 className={styles.header}>FAQ</h1>
          {content.map((item, index) => (
            <div key={index} className={styles.itemBox}>
              <div className={styles.itemHeader}>{item.title}</div>
              <div className={styles.itemText}>{item.text}</div>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FAQ;
