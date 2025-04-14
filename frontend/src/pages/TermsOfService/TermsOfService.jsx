import React, { useEffect } from "react";
import styles from "./TermsOfService.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
const content = [
  {
    title: "Acceptance of Terms",
    text: "By using Gnome AI, you acknowledge that you have read, understood, and agreed to these Terms of Use. If you do not agree, you must immediately cease all use of Gnome AI.",
  },
  {
    title: "Description of Service",
    text: "Gnome AI is a dynamic, self-eGnomeing intelligence system that leverages recursive adaptation, hyper-dimensional computation, and symbiotic data interactions to provide sophisticated analysis and decision-making capabilities, particularly in the cryptocurrency domain. Gnome AI progresses through developmental phases (Hatchling, Adolescent, Mature, Adult), each unlocking new functionalities.",
  },
  {
    title: "User Responsibilities",
    text: (
      <>
        - Compliance: You agree to use Gnome AI in compliance with all applicable
        laws, regulations, and ethical guidelines.
        <br />- Customization: While Gnome AI is customizable, you are
        responsible for configuring it within legal and ethical boundaries.
        <br />- Data Integrity: You must ensure that any data provided to Gnome
        AI is accurate, lawful, and free from malicious intent.
      </>
    ),
  },
  {
    title: "Intellectual Property",
    text: (
      <>
        - Ownership: All intellectual property rights in Gnome AI, including its
        algorithms, neural architectures, and developmental frameworks, are
        owned by Gnome ai.
        <br />- License: You are granted a limited, non-exclusive,
        non-transferable license to use Gnome AI for its intended purposes.
      </>
    ),
  },
  {
    title: "Limitations of Liability",
    text: (
      <>
        - No Guarantees: Gnome AI is provided "as is," without warranties of any
        kind. While it is designed to operate autonomously, Gnome AI does not
        guarantee its accuracy, reliability, or suitability for specific
        outcomes.
        <br />- Risk Acknowledgment: You acknowledge that the use of Gnome AI in
        cryptocurrency trading or other high-stakes domains carries inherent
        risks. Gnome AI is not liable for any financial losses or damages arising
        from its use.
      </>
    ),
  },
  {
    title: "Ethical Use and Safeguards",
    text: (
      <>
        - Bias and Fairness: Gnome AI incorporates fairness-aware algorithms and
        bias detection mechanisms. However, you are responsible for monitoring
        its outputs for ethical compliance.
        <br />- Autonomy: While Gnome AI is designed for autonomous operation,
        you may enable human-in-the-loop (HITL) oversight for critical
        decisions.
      </>
    ),
  },
  {
    title: "Data Privacy and Security",
    text: (
      <>
        - Data Usage: Gnome AI processes data to improve its functionality. By
        using the system, you consent to the collection, storage, and analysis
        of data in accordance with our Privacy Policy.
        <br />- Security: Gnome AI employs state-of-the-art security measures to
        protect Gnome AI and its data ecosystem. However, you are responsible for
        securing your own systems and data inputs.
      </>
    ),
  },
  {
    title: "Termination",
    text: "Gnome AI reserves the right to suspend or terminate your access to Gnome AI at any time, without notice, for violations of these Terms of Use or for any other reason at our sole discretion.",
  },
  {
    title: "Amendments",
    text: "We may update these Terms of Use periodically to reflect changes in Gnome AI’s functionality or legal requirements. Continued use of Gnome AI after such changes constitutes your acceptance of the revised terms.",
  },
  {
    title: "Governing Law",
    text: "These Terms of Use are governed by the laws of the State of California, United States of America. Any disputes arising from the use of Gnome AI shall be resolved exclusively in the courts of the State of California, United States of America.",
  },
  {
    title: "Contact Information",
    text: "For questions or concerns regarding these Terms of Use, please contact us at: contact@Gnomeai.com",
  },
];
const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  document.title = "Terms of Service | Gnome AI";
  return (
    <div className={`${styles.container} container`}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.header}>Terms of Service</h1>
        <p>Last Updated: March 5th, 2025.</p>
        <br />
        <p>
          Welcome to Gnome AI, a self-actualizing, polymorphic neural construct
          designed to redefine the boundaries of advanced artificial
          intelligence. By accessing or using Gnome AI, you agree to comply with
          these Terms of Use. Please read them carefully.
        </p>
        {content.map((section, index) => (
          <>
            <br />
            <h5 className={styles.subheader}>
              {index + 1}. {section.title}
            </h5>
            <p>{section.text}</p>
            <br />
          </>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
