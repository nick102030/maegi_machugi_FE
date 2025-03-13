import React, { useState, useEffect } from "react";

const QuizGame = () => {
  const [guildName, setGuildName] = useState("");
  const [worldName, setWorldName] = useState("");
  const [numOfQuestions, setNumOfQuestions] = useState(1);
  const [guildMembers, setGuildMembers] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ 로딩 상태 추가
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // ✅ 현재 문제 인덱스 상태 추가

  const checkAnswer = () => {
  if (!currentCharacter) return;
  setMessage(""); // ✅ 정답을 입력할 때마다 메시지 초기화
  // ✅ 현재 문제의 정답을 정확히 비교
  const correctAnswer = guildMembers[currentQuestionIndex]?.characterName || "";
  
  if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
    if (currentQuestionIndex + 1 < numOfQuestions) {
      setMessage("✅ 정답입니다!");
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setCurrentCharacter(null);
      setTimeout(() => {
        setCurrentCharacter(guildMembers[currentQuestionIndex + 1]);
      }, 500);
    } else {
      setMessage("🎉 모든 문제를 맞췄습니다! 게임 종료!");
      setTimeout(() => {
        setGameStarted(false);
      }, 3000);
    }
  } else {
    setMessage(`❌ 틀렸습니다! 정답: ${correctAnswer}`);
  }
  
  setUserAnswer("");
  };
  
  // 엔터 키 입력 감지 함수
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
    }
  };

  // 길드 정보 및 문제 개수 입력 후 백엔드 요청
  const fetchGuildMembers = () => {
    if (!guildName || !worldName || numOfQuestions < 1) {
      alert("길드명, 월드명, 문제 개수를 입력해주세요!");
      return;
    }
    setLoading(true);
  
    // 게임 시작 시 상태 초기화
    setCurrentQuestionIndex(0);
    setGuildMembers([]);
    setCurrentCharacter(null);
    setMessage("");
    
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
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  };

  // ✅ useEffect를 사용하여 currentCharacter 업데이트
  useEffect(() => {
    if (currentQuestionIndex < guildMembers.length) {
      setTimeout(() => {
        setCurrentCharacter(guildMembers[currentQuestionIndex]);
      }, 500);
    }
  }, [currentQuestionIndex, guildMembers]);
  
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
                setNumOfQuestions("");
              } else {
                setNumOfQuestions(Number(value));
              }
            }}
            placeholder="문제 개수 입력"
            min="1"
            style={styles.input}
          />
          <button onClick={fetchGuildMembers} style={styles.button} disabled={loading}>
            {loading ? "로딩 중..." : "게임 시작"}
          </button>
        </div>
      ) : (
        <div style={styles.quizBox}>
          <h1>🎮 길드원 닉네임 맞추기 퀴즈</h1>
          <p>문제 {currentQuestionIndex + 1} / {numOfQuestions}</p>
                    
          {currentCharacter ? (
            <img 
              src={currentCharacter?.imageURL} 
              alt="캐릭터" 
              style={styles.characterImage} 
              onError={(e) => e.target.src = "/fallback.png"} 
            />
          ) : (
            <p>다음 문제 준비 중...</p>
          )}

          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="닉네임 입력"
            style={styles.input}
            onKeyPress={handleKeyDown}
            disabled={!currentCharacter}
          />
          <button onClick={checkAnswer} style={styles.button} disabled={!currentCharacter}>
            정답 제출
          </button>
          <p style={styles.message}>{message}</p>
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