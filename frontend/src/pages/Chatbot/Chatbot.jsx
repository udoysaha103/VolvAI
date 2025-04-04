import React, { use } from "react";
import { useState, useEffect } from "react";
import styles from "./Chatbot.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const chats = [
  {
    bot: "Hello! How can I assist you today?",
    user: "Hi! I need help with my order.",
  },
  {
    bot: "Sure! Can you please provide me with your order number?",
    user: "Yes, it's 12345.",
  },
  {
    bot: "Thank you! Let me check the status of your order.",
    user: "Okay.",
  },
  {
    bot: "Your order is currently being processed and will be shipped soon.",
    user: "Great! Thank you for the update.",
  },
];

const Chatbot = () => {
  const coinAddress = import.meta.env.VITE_COIN_ADDRESS;
  const phase1cap = Number(import.meta.env.VITE_HATCH_CAP);

  const [mCap, setMCap] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);

  const apiUrl = `https://api.dexscreener.com/token-pairs/v1/solana/${coinAddress}`;

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          setMCap(data[0].marketCap);
        })
        .catch((error) => console.error("Error fetching coin data:", error));
    }, 3000);

    // fetch once immediately
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setMCap(data[0].marketCap);
      })
      .catch((error) => console.error("Error fetching coin data:", error));

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);


  useEffect(() => {
    if (mCap >= phase1cap) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }
  , [mCap]);


  return (
    <div className={styles.container}>
      <Navbar />
      <div className={`${styles.content} content`}>
        <img src="/wm.svg" className={styles.watermark} />
        {isDisabled && (
          <div className={styles.info}>
            Wait for hatching procedure to complete.....
          </div>
        )}
        <div className={styles.chatbox}>
          {!isDisabled && (
            <>
              <div className={styles.chatContainer}>
                {chats.map((chat, index) => (
                  <div key={index} className={styles.chatMessage}>
                    <div className={styles.botMessage}>
                      <img src="/bot.svg" className={styles.botIcon} />
                      <div className={styles.botText}>{chat.bot}</div>
                    </div>
                    <div className={styles.userMessage}>{chat.user}</div>
                  </div>
                ))}
              </div>
              <div className={styles.chatInputContainer}>
                <input
                  type="text"
                  placeholder="Start Asking............."
                  className={styles.chatInput}
                />
                <button className={styles.sendButton}>Send</button>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Chatbot;
