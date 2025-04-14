import React, { useEffect } from "react";
import styles from "./FAQ.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
const content = [
  {
    title: "What is Gnome AI and how does it work?",
    text: "Gnome AI is an advanced artificial intelligence system that uses multi-modal learning and adaptive reasoning. It generalizes across tasks, learns from sparse data, and evolves its strategies with minimal human intervention.",
  },
  {
    title: "How does Gnome AI evolve?",
    text: "Gnome AI progresses through four phases (Hatchling, Adolescent, Mature, Adult) using recursive self-improvement and neural architecture search. Each phase enhances its cognitive and operational capabilities autonomously.",
  },
  {
    title: "Can Gnome AI be customized for specific crypto analysis needs?",
    text: "Yes, Gnome AI’s modular architecture allows task-specific fine-tuning of neural networks and datasets. Users can tailor it to focus on specific cryptocurrencies or market segments such as Memecoin market.",
  },
  {
    title: "What sets Gnome AI apart from traditional AI systems?",
    text: "Unlike narrow AI, Gnome AI generalizes across tasks, learns from minimal data, and autonomously adapts to new conditions. Its AGI architecture enables reasoning, planning, and self-improvement.",
  },
  {
    title: "What safeguards prevent Gnome AI from high-risk trading decisions?",
    text: "Gnome AI employs probabilistic risk assessment, fail-safe mechanisms, and human-in-the-loop oversight. These ensure operations stay within predefined risk thresholds.",
  },
];
const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  document.title = "FAQ | Gnome AI";
  return (
      <div className={`${styles.container} container`}>
        <Navbar />
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
  );
};

export default FAQ;
