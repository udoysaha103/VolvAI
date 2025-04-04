import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className={styles.navWrapper}>
      <div className={styles.contentWrapper}>
        <Link className={styles.leftItems} to="/">
          <div className={styles.logoIcon}>
            <img src="./logo.svg" alt="Volv Logo" />
          </div>
          <div className={styles.logoText}>
            <div className={styles.logoTextBold}>Volv AI</div>
            <div className={styles.logoTextVersion}>v 0.1.05</div>
          </div>
        </Link>
        <div className={styles.rightItems}>
          <Link
            to="/#about"
            onClick={() => {
              const element = document.getElementById("about");
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            About
          </Link>
          <Link to="/features">Features</Link>
          <Link className={styles.evolve} to="/chatbot">
            Evolve
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
