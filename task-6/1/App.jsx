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

    // ฟังก์ชันเริ่มเกม
  const startGame = () => {
    const newSentence = getRandomSentence();
    setCurrentSentence(newSentence);
    setUserInput('');
    setTimeElapsed(0);
    setGameStatus('playing');
    setStartTime(Date.now());
    // รีเซ็ต state การเปรียบเทียบ
    setCorrectChars(0);
    setIncorrectChars(0);
    setAccuracy(100);
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

  // ฟังก์ชันสำหรับสร้างข้อความที่มีไฮไลต์
  const renderHighlightedText = () => {
    if (!currentSentence) return null;

    return currentSentence.split('').map((char, index) => {
      let className = 'inline-block';
      
      if (index < userInput.length) {
        // เปรียบเทียบตัวอักษรที่พิมพ์แล้ว
        if (userInput[index] === char) {
          className += ' bg-green-200 text-green-800'; // ถูกต้อง - สีเขียว
        } else {
          className += ' bg-red-200 text-red-800'; // ผิด - สีแดง
        }
      } else if (index === userInput.length) {
        // ตำแหน่งปัจจุบันที่กำลังจะพิมพ์
        className += ' bg-blue-300 text-blue-900 animate-pulse'; // สีน้ำเงิน กระพริบ
      } else {
        // ตัวอักษรที่ยังไม่ได้พิมพ์
        className += ' text-gray-600'; // สีเทา
      }

      return (
        <span key={index} className={className}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
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
      // หยุดเวลา
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // ฟังก์ชันจัดการ key events พร้อมป้องกัน copy-paste
  const handleKeyDown = (e) => {
    // ป้องกัน backspace ถ้าไม่มีอะไรให้ลบ
    if (e.key === 'Backspace' && userInput.length === 0) {
      e.preventDefault();
    }
    
    // ป้องกันการพิมพ์อักขระพิเศษบางตัว
    if (e.key === 'Tab') {
      e.preventDefault();
    }

    // ป้องกัน Ctrl+V (paste), Ctrl+C (copy), Ctrl+A (select all), Ctrl+X (cut)
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'v' || e.key === 'V' || 
          e.key === 'c' || e.key === 'C' || 
          e.key === 'a' || e.key === 'A' ||
          e.key === 'x' || e.key === 'X') {
        e.preventDefault();
      }
    }
  };

  // ฟังก์ชันป้องกัน context menu (right-click)
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  // ฟังก์ชันป้องกัน paste event
  const handlePaste = (e) => {
    e.preventDefault();
  };

  // ฟังก์ชันป้องกัน copy event
  const handleCopy = (e) => {
    e.preventDefault();
  };

  // ฟังก์ชันป้องกัน cut event
  const handleCut = (e) => {
    e.preventDefault();
  };

  // useEffect สำหรับ focus textarea เมื่อเริ่มเกม
  useEffect(() => {
    if (gameStatus === 'playing' && textareaRef.current) {
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
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 min-h-[120px] flex items-center justify-center select-none">
            {currentSentence ? (
              <div className="w-full">
                <div className="text-lg leading-relaxed text-justify">
                  {gameStatus === 'playing' ? renderHighlightedText() : (
                    <span className="text-gray-700">{currentSentence}</span>
                  )}
                </div>
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
              onContextMenu={handleContextMenu}
              onPaste={handlePaste}
              onCopy={handleCopy}
              onCut={handleCut}
              disabled={gameStatus === 'idle' || gameStatus === 'finished'}
              rows={4}
              autoComplete="off"
              spellCheck="false"
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
              {gameStatus === 'finished' && 'เสร็จสิ้น'}
            </span>
            
            {/* Result Section */}
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

        </div>
      </div>
    </div>
  );
}

export default App;

// Task 6 - ระบบป้องกัน Copy-Paste

// 1. Event Handlers ป้องกัน:
// - onPaste={handlePaste} - ป้องกัน paste
// - onCopy={handleCopy} - ป้องกัน copy
// - onCut={handleCut} - ป้องกัน cut
// - onContextMenu={handleContextMenu} - ป้องกัน right-click

// 2. Keyboard Shortcuts ที่บล็อค:
// - Ctrl+V / Cmd+V - Paste
// - Ctrl+C / Cmd+C - Copy
// - Ctrl+X / Cmd+X - Cut
// - Ctrl+A / Cmd+A - Select All

// 3. CSS Class & Attributes ป้องกัน:
// - select-none - ป้องกันการเลือกข้อความ
// - autoComplete="off" - ปิด autocomplete
// - spellCheck="false" - ปิด spell check