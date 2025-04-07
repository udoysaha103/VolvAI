import React, { useState, useEffect, useRef } from "react";
import styles from "./Chatbot.module.css";
import Navbar from "../../components/Navbar/Navbar";
import ReactMarkDown from "react-markdown";
import Footer from "../../components/Footer/Footer";

// const chats = [
//   {
//     role: "assistant",
//     text: "Hello! How can I assist you today?",
//   },
//   {
//     role: "user",
//     text: "What is the current market cap?",
//   },
//   {
//     role: "assistant",
//     text: "The current market cap is $1,000,000.",
//   },
//   {
//     role: "user",
//     text: "What is the price of the token?",
//   },
//   {
//     role: "assistant",
//     text: "$0.01",
//   },
//   {
//     role: "user",
//     text: "When will the next update be?",
//   },
//   {
//     role: "assistant",
//     text: "The next update will be in one hour.",
//   },
// ];

const Chatbot = () => {
  const coinAddress = import.meta.env.VITE_COIN_ADDRESS;
  const phase1cap = Number(import.meta.env.VITE_HATCH_CAP);

  const [mCap, setMCap] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [threadId, setThreadId] = useState(null);
  const [sending, setSending] = useState(false);
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const apiUrl = `https://api.dexscreener.com/token-pairs/v1/solana/${coinAddress}`;

  const handleSendMessage = () => {
    const message = inputRef.current.value;
    inputRef.current.value = ""; // Clear the input field
    console.log(message);
    console.log(threadId, "handleSendMessage");

    if (!message || sending) return;
    setSending(true);
    setChats((prevChats) => [
      ...prevChats,
      { role: "user", text: message },
      { role: "assistant", text: "..." },
    ]);
    fetch(`${import.meta.env.VITE_API_URL}/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId: threadId,
        message: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.reply); // Log the assistant's reply
        console.log(data.reply[0].text.value);
        inputRef.current.value = ""; // Clear the input field
        setChats((prevChats) => [
          ...prevChats.slice(0, prevChats.length - 1),
          ...data.reply.map((e) => ({
            role: "assistant",
            text: e.text.value,
          })),
        ]);
        setSending(false);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        setError(error);
        setSending(false);
      });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log(threadId, "handleKeyDown");
      handleSendMessage();
    }
  };
  const fetchCoinData = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setMCap(data[0].marketCap);
    } catch (error) {
      console.error("Error fetching coin data:", error);
      setError(error);
    }
  };
  const fetchThreadId = async () => {
    if (!chats.length) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/create-thread`,
          {
            method: "POST",
          }
        );
        const data = await response.json();
        setThreadId(data.threadId);
        setChats([
          { role: "assistant", text: "Hello! How can I assist you today?" },
        ]);
      } catch (error) {
        console.error("Error creating thread:", error);
        setError(error);
      }
    }
  };
  useEffect(() => {
    const interval = setInterval(fetchCoinData, 3000);
    fetchCoinData();
    fetchThreadId();
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [threadId]);

  useEffect(() => {
    if (mCap >= phase1cap) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [mCap]);

  return (
    <div className={`${styles.container} container`}>
      <Navbar />
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
                  {chat.role === "assistant" && (
                    <div className={styles.botMessage}>
                      <img src="/bot.svg" className={styles.botIcon} />
                      <div className={styles.botText}>
                        <ReactMarkDown>{chat.text}</ReactMarkDown>
                      </div>
                    </div>
                  )}
                  {chat.role === "user" && (
                    <div className={styles.userMessage}>
                      <div className={styles.userText}>{chat.text}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.chatInputContainer}>
              <input
                type="text"
                placeholder="Start Asking............."
                ref={inputRef}
                className={styles.chatInput}
              />
              <button className={styles.sendButton} onClick={handleSendMessage}>
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Chatbot;
