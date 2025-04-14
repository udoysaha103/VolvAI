import styles from "./Footer.module.css"
import { Link } from "react-router-dom";

const Footer = ({className, props}) => {
  return (
    <div className={`${styles.footerText} ${className}`} {...props}>
        2025 © All rights reserved - Gnome AI &nbsp; &nbsp;
        <Link to="/terms-of-service" className={styles.footerLink}>Terms of Use</Link>
        <Link to="/faq" className={styles.footerLink}>FAQ</Link>  
        <Link to="https://x.com/GnomeAiSol" target="_blank" className={`${styles.footerLink} ${styles.footerIcon}`}>
          <img src="./x.svg" alt="Twitter" />
        </Link>
    </div>
  )
}

export default Footer