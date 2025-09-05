import { useState, useEffect } from 'react';

function App() {
  // State พื้นฐาน
  const [currentSentence, setCurrentSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStatus, setGameStatus] = useState('idle'); // 'idle', 'playing', 'finished'

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
          
          {/* Timer Section */}
          <div className="text-center">
            <div className="inline-block bg-gray-50 border-2 border-gray-200 rounded-lg px-6 py-4">
              <span className="text-gray-600 text-lg mr-3">เวลา:</span>
              <span className="text-3xl font-bold text-gray-800">{timeElapsed.toFixed(1)}s</span>
            </div>
          </div>

          {/* Sentence Display */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 min-h-[100px] flex items-center justify-center">
            <p className="text-xl text-gray-700 text-center leading-relaxed">
              {currentSentence || "กดปุ่มเริ่มเกมเพื่อแสดงประโยค"}
            </p>
          </div>

          {/* Input Section */}
          <div>
            <textarea
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              placeholder="เริ่มพิมพ์ที่นี่..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={gameStatus === 'idle'}
              rows={3}
            />
          </div>

          {/* Control Section */}
          <div className="text-center">
            <button 
              className={`px-8 py-3 text-lg font-semibold rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-lg min-w-[150px] ${
                gameStatus === 'playing' 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-green-200'
              } disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
              onClick={() => {
                // ฟังก์ชันเริ่มเกมจะเพิ่มใน Task ต่อไป
                console.log('เริ่มเกม!');
              }}
              disabled={gameStatus === 'playing'}
            >
              {gameStatus === 'playing' ? 'กำลังเล่น...' : 'เริ่มเกม'}
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
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;

// สิ่งที่สร้างขึ้นใน Task 1:
// 1. State พื้นฐาน:
// currentSentence - เก็บประโยคที่จะให้พิมพ์
// userInput - เก็บข้อความที่ผู้ใช้พิมพ์
// timeElapsed - เก็บเวลาที่ผ่านไป
// gameStatus - เก็บสถานะเกม (idle/playing/finished)

// 2. UI Layout ที่เป็นระเบียบ:

// Header ที่สวยงาม
// ส่วนแสดงเวลา
// ส่วนแสดงประโยคที่จะพิมพ์
// Textarea สำหรับพิมพ์
// ปุ่มเริ่มเกม
// ส่วนแสดงสถานะ

// 3. CSS ที่เขียนเองแบบ Clean:

// ใช้ Gradient backgrounds
// Responsive design
// Hover effects
// สีสันที่เป็นระเบียบ
// Typography ที่ดูดี