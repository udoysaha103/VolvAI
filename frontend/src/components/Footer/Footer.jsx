import styles from "./Footer.module.css"
import { Link } from "react-router-dom";

const Footer = (props) => {
  return (
    <div className={styles.footerText} {...props}>
        2025 © All rights reserved - Volv AI &nbsp; &nbsp;
        <Link to="/termsofuse" className={styles.footerLink}>Terms of Use</Link>
        <Link to="/FAQ" className={styles.footerLink}>FAQ</Link>  
        <Link to="https://x.com/[]" target="_blank" className={`${styles.footerLink} ${styles.footerIcon}`}>
          <img src="./x.svg" alt="Twitter" />
        </Link>
    </div>
  )
}

export default Footer