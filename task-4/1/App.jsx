import { useState, useEffect, useRef } from 'react';

function App() {
  // Array ประโยค 10 ประโยค (20-40 คำ)
  const sentences = [
    // ~20 คำ
    "The quick brown fox jumps over the lazy dog while the sun shines brightly in the clear blue sky above.",
    
    // ~22 คำ
    "Technology has revolutionized the way we communicate, work, and live our daily lives in the modern digital age we inhabit today.",
    
    // ~25 คำ
    "Ancient civilizations built magnificent structures that continue to amaze archaeologists and historians who study their remarkable achievements and cultural legacy throughout human history.",
    
    // ~27 คำ
    "Climate change presents one of the greatest challenges facing humanity today, requiring immediate action from governments, businesses, and individuals to protect our planet for future generations.",
    
    // ~30 คำ
    "The art of cooking combines creativity, science, and tradition as chefs experiment with flavors, techniques, and ingredients from around the world to create memorable dining experiences.",
    
    // ~32 คำ
    "Space exploration has always captured human imagination, inspiring scientists and engineers to push the boundaries of what is possible as we venture beyond Earth to discover new worlds.",
    
    // ~35 คำ
    "Education plays a fundamental role in shaping society by providing individuals with knowledge, critical thinking skills, and opportunities to pursue their dreams while contributing positively to their communities and the world.",
    
    // ~37 คำ
    "The ocean covers more than seventy percent of Earth's surface and remains largely unexplored, containing countless species of marine life and holding secrets that could help us understand our planet's history.",
    
    // ~38 คำ
    "Music has the power to transcend cultural boundaries, evoke emotions, and bring people together regardless of their background, language, or beliefs, creating universal connections through rhythm, melody, and shared human experiences.",
    
    // ~40 คำ
    "Artificial intelligence and machine learning technologies are rapidly transforming industries, creating new opportunities for innovation while also raising important questions about ethics, privacy, and the future of human work in an increasingly automated world."
  ];

  // State พื้นฐาน
  const [currentSentence, setCurrentSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStatus, setGameStatus] = useState('idle'); // 'idle', 'playing', 'finished'
  const [startTime, setStartTime] = useState(null);
  
  // State สำหรับการเปรียบเทียบข้อความ
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Ref สำหรับ textarea และ timer
  const textareaRef = useRef(null);
  const timerRef = useRef(null);

  // ฟังก์ชันสุ่มประโยค
  const getRandomSentence = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
  };

  // ฟังก์ชันหยุดเกม
  const stopGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // ฟังก์ชันเปรียบเทียบข้อความและอัพเดท state
  const compareText = (input) => {
    let correct = 0;
    let incorrect = 0;
    
    for (let i = 0; i < input.length; i++) {
      if (i < currentSentence.length) {
        if (input[i] === currentSentence[i]) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        // พิมพ์เกินความยาวประโยค
        incorrect++;
      }
    }
    
    setCorrectChars(correct);
    setIncorrectChars(incorrect);
    
    // คำนวณความแม่นยำ
    const totalChars = correct + incorrect;
    const accuracyPercent = totalChars > 0 ? (correct / totalChars) * 100 : 100;
    setAccuracy(accuracyPercent);
    
    // ตรวจสอบว่าพิมพ์เสร็จหรือยัง
    if (input.length === currentSentence.length && correct === currentSentence.length) {
      setGameStatus('finished');
      stopGame(); // หยุดเวลาเมื่อเสร็จสิ้น
    }
  };

  // ฟังก์ชันจัดการการพิมพ์
  const handleInputChange = (e) => {
    const newInput = e.target.value;
    
    // ป้องกันการพิมพ์เกินความยาวประโยค
    if (newInput.length <= currentSentence.length) {
      setUserInput(newInput);
      compareText(newInput);
    }
  };

  // ฟังก์ชันจัดการ key events
  const handleKeyDown = (e) => {
    // ป้องกัน backspace ถ้าไม่มีอะไรให้ลบ
    if (e.key === 'Backspace' && userInput.length === 0) {
      e.preventDefault();
    }
    
    // ป้องกันการพิมพ์อักขระพิเศษบางตัว
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  // ฟังก์ชันเริ่มเกม
  const startGame = () => {
    const newSentence = getRandomSentence();
    setCurrentSentence(newSentence);
    setUserInput('');
    setTimeElapsed(0);
    setStartTime(Date.now());
    setGameStatus('playing');
    // รีเซ็ต state การเปรียบเทียบ
    setCorrectChars(0);
    setIncorrectChars(0);
    setAccuracy(100);
  };

  // useEffect สำหรับ focus textarea เมื่อเริ่มเกม
  useEffect(() => {
    if (gameStatus === 'playing' && textareaRef.current) {
      // ใช้ setTimeout เพื่อให้ DOM render เสร็จก่อน
      setTimeout(() => {
        textareaRef.current.focus();
      }, 100);
    }
  }, [gameStatus]);

  // useEffect สำหรับระบบจับเวลา
  useEffect(() => {
    if (gameStatus === 'playing') {
      // เริ่มจับเวลา
      timerRef.current = setInterval(() => {
        if (startTime) {
          const currentTime = Date.now();
          const elapsed = (currentTime - startTime) / 1000; // แปลงเป็นวินาที
          setTimeElapsed(elapsed);
        }
      }, 100); // อัพเดททุก 100ms เพื่อความแม่นยำ

      // Cleanup function
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      // หยุดเวลาเมื่อไม่ได้เล่น
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [gameStatus, startTime]);

  // useEffect สำหรับ cleanup เมื่อ component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black p-5">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-700 text-white text-center py-8 px-6">
          <h1 className="text-4xl font-bold mb-3">🚀 Typing Speed Test</h1>
          <p className="text-lg opacity-90">พิมพ์ตามประโยคให้ถูกต้องและเร็วที่สุด!</p>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-8">
          
          {/* Timer and Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3">
              <span className="text-gray-600 text-sm block">เวลา</span>
              <span className="text-2xl font-bold text-gray-800">{timeElapsed.toFixed(1)}s</span>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg px-4 py-3">
              <span className="text-green-600 text-sm block">ความแม่นยำ</span>
              <span className="text-2xl font-bold text-green-800">{accuracy.toFixed(1)}%</span>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-3">
              <span className="text-blue-600 text-sm block">ความคืบหน้า</span>
              <span className="text-2xl font-bold text-blue-800">
                {currentSentence ? `${userInput.length}/${currentSentence.length}` : '0/0'}
              </span>
            </div>
          </div>

          {/* Sentence Display */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 min-h-[120px] flex items-center justify-center">
            {currentSentence ? (
              <div className="w-full">
                <p className="text-lg text-gray-700 leading-relaxed text-justify">
                  {currentSentence}
                </p>
                <div className="mt-3 text-right">
                  <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {currentSentence.split(' ').length} words
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xl text-gray-500 text-center">
                กดปุ่มเริ่มเกมเพื่อแสดงประโยค
              </p>
            )}
          </div>

          {/* Input Section */}
          <div>
            <textarea
              ref={textareaRef}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              placeholder="เริ่มพิมพ์ที่นี่..."
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={gameStatus === 'idle' || gameStatus === 'finished'}
              rows={4}
            />
            
            {/* แสดงสถิติการพิมพ์ */}
            {gameStatus === 'playing' && (
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-green-600">
                  ถูกต้อง: {correctChars} ตัวอักษร
                </span>
                <span className="text-red-600">
                  ผิด: {incorrectChars} ตัวอักษร
                </span>
                <span className="text-blue-600">
                  เหลือ: {currentSentence.length - userInput.length} ตัวอักษร
                </span>
              </div>
            )}
          </div>

          {/* Control Section */}
          <div className="text-center">
            <button 
              className={`px-8 py-3 text-lg font-semibold rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-lg min-w-[150px] ${
                gameStatus === 'playing' 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-not-allowed' 
                  : gameStatus === 'finished'
                  ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-green-200'
                  : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-green-200'
              } disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
              onClick={startGame}
              disabled={gameStatus === 'playing'}
            >
              {gameStatus === 'playing' ? 'กำลังเล่น...' : 
               gameStatus === 'finished' ? 'เล่นใหม่' : 'เริ่มเกม'}
            </button>
          </div>

          {/* Status Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-gray-600 mr-3">สถานะ:</span>
            <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
              gameStatus === 'idle' ? 'bg-gray-200 text-gray-700' :
              gameStatus === 'playing' ? 'bg-amber-100 text-amber-800' :
              'bg-green-100 text-green-800'
            }`}>
              {gameStatus === 'idle' && 'รอเริ่มเกม'}
              {gameStatus === 'playing' && 'กำลังเล่น'}
              {gameStatus === 'finished' && '🎉 เสร็จสิ้น!'}
            </span>
            
            {/* แสดงผลลัพธ์เมื่อเสร็จ */}
            {gameStatus === 'finished' && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-semibold">ผลการทดสอบ:</div>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>ความแม่นยำ: <span className="font-bold">{accuracy.toFixed(1)}%</span></div>
                  <div>เวลาที่ใช้: <span className="font-bold">{timeElapsed.toFixed(1)} วินาที</span></div>
                  <div>อักษรถูก: <span className="font-bold text-green-600">{correctChars}</span></div>
                  <div>อักษรผิด: <span className="font-bold text-red-600">{incorrectChars}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Debug Info (เพื่อดูการทำงาน) */}
          {gameStatus === 'playing' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Debug Info:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>ความยาวประโยค: {currentSentence.split(' ').length} คำ</p>
                <p>ความยาวข้อความที่พิมพ์: {userInput.length} ตัวอักษร</p>
                <p>ความคืบหน้า: {userInput.length}/{currentSentence.length} ({((userInput.length/currentSentence.length) * 100).toFixed(1)}%)</p>
                <p>เวลาปัจจุบัน: {timeElapsed.toFixed(2)} วินาที</p>
                <p>สถานะตัวจับเวลา: {timerRef.current ? '🟢 ทำงาน' : '🔴 หยุด'}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;

// Task 4 - ระบบจับเวลา สมบูรณ์แล้ว:
// ฟีเจอร์ระบบจับเวลาที่เพิ่ม:

// State การจับเวลา

// startTime - เก็บเวลาที่เริ่มเกม (timestamp)
// timerRef - useRef สำหรับ setInterval


// ฟังก์ชันควบคุมเวลา

// stopGame() - หยุดเวลาและ clear interval
// อัพเดท startGame() - บันทึกเวลาเริ่ม
// หยุดเวลาอัตโนมัติเมื่อพิมพ์เสร็จ


// useEffect Timer System
// javascriptuseEffect(() => {
//   if (gameStatus === 'playing') {
//     timerRef.current = setInterval(() => {
//       const elapsed = (Date.now() - startTime) / 1000;
//       setTimeElapsed(elapsed);
//     }, 100); // อัพเดททุก 100ms
//   }
// }, [gameStatus, startTime]);

// ระบบ Cleanup

// Clear interval เมื่อหยุดเกม
// Clear interval เมื่อ component unmount
// ป้องกัน memory leaks