import React, { useState } from "react";

const QuizGame = () => {
  const [guildName, setGuildName] = useState("");
  const [worldName, setWorldName] = useState("");
  const [numOfQuestions, setNumOfQuestions] = useState(1);
  const [guildMembers, setGuildMembers] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  // 길드 정보 및 문제 개수 입력 후 백엔드 요청
  const fetchGuildMembers = () => {
    if (!guildName || !worldName || numOfQuestions < 1) {
      alert("길드명, 월드명, 문제 개수를 입력해주세요!");
      return;
    }

    const url = `http://localhost:8080/api/v1/guild/game?guild_name=${guildName}&world_name=${worldName}&numOfCharacter=${numOfQuestions}`;
    
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 서버 응답 데이터:", data);
        setGuildMembers(data);
        if (data.length > 0) {
          setCurrentCharacter(data[Math.floor(Math.random() * data.length)]);
          setGameStarted(true);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div style={styles.container}>
      {/* 🔹 입력 필드가 보이도록 수정 */}
      {!gameStarted ? (
        <div style={styles.inputBox}>
          <h1>길드명, 월드명, 문제 개수 입력</h1>
          <input
            type="text"
            value={guildName}
            onChange={(e) => setGuildName(e.target.value)}
            placeholder="길드명 입력"
            style={styles.input}
          />
          <input
            type="text"
            value={worldName}
            onChange={(e) => setWorldName(e.target.value)}
            placeholder="월드명 입력"
            style={styles.input}
          />
          <input
            type="number"
            value={numOfQuestions}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setNumOfQuestions(""); // 🔹 사용자가 지웠을 때 빈 값 유지
              } else {
                setNumOfQuestions(Number(value)); // 🔹 01 → 1, 02 → 2 자동 변환
              }
            }}
            placeholder="문제 개수 입력"
            min="1"
            style={styles.input}
          />
          <button onClick={fetchGuildMembers} style={styles.button}>게임 시작</button>
        </div>
      ) : (
        <div style={styles.quizBox}>
          <h1>🎮 길드원 닉네임 맞추기 퀴즈</h1>
          <p>문제 {guildMembers.length > 0 ? `1 / ${numOfQuestions}` : "로딩 중..."}</p>
          {currentCharacter && (
            <>
              <img 
                src={currentCharacter?.imageURL} 
                alt="캐릭터" 
                style={styles.characterImage} 
                onError={(e) => e.target.src = "/fallback.png"} 
              />
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="닉네임 입력"
                style={styles.input}
              />
              <button onClick={() => setMessage("정답 확인 기능 구현 필요")} style={styles.button}>정답 제출</button>
              <p style={styles.message}>{message}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// 스타일 지정
const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px"
  },
  inputBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "50px"
  },
  quizBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px"
  },
  characterImage: {
    width: "200px",
    height: "200px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    marginBottom: "10px"
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    textAlign: "center"
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  message: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "10px"
  }
};

export default QuizGame;