import { useState, useEffect } from 'react';

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
  };

  // ฟังก์ชันจัดการการพิมพ์
  const handleInputChange = (e) => {
    const newInput = e.target.value;
    
    // ป้องกันการพิมพ์เกินความยาวประโยค
    if (newInput.length <= currentSentence.length) {
      setUserInput(newInput);
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3">
              <span className="text-gray-600 text-sm block">เวลา</span>
              <span className="text-2xl font-bold text-gray-800">{timeElapsed.toFixed(1)}s</span>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg px-4 py-3">
              <span className="text-green-600 text-sm block">ความแม่นยำ</span>
              <span className="text-2xl font-bold text-green-800">100%</span>
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
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              placeholder="เริ่มพิมพ์ที่นี่..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={gameStatus === 'idle'}
              rows={4}
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
              onClick={startGame}
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

// Task 2 - การแสดงประโยคแบบสุ่มหลุ่งกดปุ่ม "เริ่มเกม"
// 1. Array ประโยค 10 ประโยค (ภาษาอังกฤษ 20-40 คำ)

// 2. ฟังก์ชั่นสุ่มประโยค
// const getRandomSentence = () => {
//   const randomIndex = Math.floor(Math.random() * sentences.length);
//   return sentences[randomIndex];
// };

// 3. ฟังก์ชันเริ่มเกมและการเปลี่ยนสถานะ
// const startGame = () => {
//   const newSentence = getRandomSentence();
//   setCurrentSentence(newSentence);
//   setUserInput('');
//   setTimeElapsed(0);
//   setGameStatus('playing');
// };