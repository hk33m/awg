'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Trash2, Volume2, History, Heart, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'


function ModelViewer({ url }) {
  const group = useRef()
  const [ready, setReady] = useState(false)

useEffect(() => {
  setReady(true)
}, [])

const gltf = ready ? useGLTF(url) : null

const scene = gltf?.scene
const animations = gltf?.animations || []

  const mixer = useRef(null)
  const actions = useRef({})

  const [text, setText] = useState('')
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState('')
  const [history, setHistory] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    const savedHistory = localStorage.getItem('signHistory')
    const savedFavorites = localStorage.getItem('signFavorites')
    if (savedHistory) setHistory(JSON.parse(savedHistory))
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
  }, [])

  useEffect(() => {
    localStorage.setItem('signHistory', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    localStorage.setItem('signFavorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (!scene || !animations) return
    mixer.current = new THREE.AnimationMixer(scene)
    animations.forEach((clip) => {
      actions.current[clip.name.trim()] = mixer.current.clipAction(clip)
    })
  }, [scene, animations])

  useEffect(() => {
    let frame
    const animate = () => {
      frame = requestAnimationFrame(animate)
      mixer.current?.update(0.016)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [])

  const stopAll = () => {
    Object.values(actions.current).forEach((action) => {
      action.stop()
      action.reset()
    })
  }

  const playLetter = (letter) => {
    const action = actions.current[letter]
    if (!action) return 600
    stopAll()
    action.reset()
    action.setLoop(THREE.LoopOnce, 1)
    action.clampWhenFinished = true
    action.play()
    setCurrent(letter)
    return action.getClip().duration * 1000
  }

  const playWord = async () => {
    if (!text.trim()) return
    setPlaying(true)
    const letters = [...text.trim()]
    for (const letter of letters) {
      if (letter === ' ') {
        await new Promise((r) => setTimeout(r, 400))
        continue
      }
      const duration = playLetter(letter)
      await new Promise((r) => setTimeout(r, duration + 150))
    }
    setCurrent('')
    setPlaying(false)
    if (!history.includes(text.trim())) {
      setHistory([text.trim(), ...history.slice(0, 19)])
    }
  }

  const addToFavorites = () => {
    if (text.trim() && !favorites.includes(text.trim())) {
      setFavorites([...favorites, text.trim()])
    }
  }

  const removeFromHistory = (word) => {
    setHistory(history.filter((w) => w !== word))
  }

  const removeFromFavorites = (word) => {
    setFavorites(favorites.filter((w) => w !== word))
  }

  const copyToClipboard = (word) => {
    navigator.clipboard.writeText(word)
  }

  return (
    <div>

    <Header title={"مُترجِم الإشارة"} description={"ترجم كلماتك إلى لغة الإشارة بسهولة وسرعة"} /> 
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-100 text-gray-900 flex flex-col">
      {/* الرأس */}
  
      {/* المحتوى الرئيسي */}
      <main className="flex-1 mt-40  max-w-[90%] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="bg-white lg:col-span-2   rounded-2xl shadow-lg border-2 border-indigo-100 overflow-hidden" style={{ height: '600px' }}>
              <Canvas camera={{ position: [0, 1.5, 3], fov: 45 }} >
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 5, 5]} intensity={2} color="#87ceeb" />
                <directionalLight position={[-5, 3, -5]} intensity={1} color="#ffffff" />
                <primitive ref={group} object={scene} />
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  autoRotateSpeed={2}
                />
              </Canvas>
             
            </div>
          
          {/* القسم الأيسر - الإدخال والعرض */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* بطاقة الإدخال */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-indigo-100 p-6 sm:p-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                أدخل كلمتك
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && playWord()}
                  placeholder="مثال: مرحبا"
                  className="flex-1 bg-gray-50 border-2 border-indigo-200 px-4 sm:px-5 py-3 rounded-xl outline-none text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                />
                <button
                  onClick={() => setText('')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition duration-200"
                  title="مسح"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* بطاقة الأزرار */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={playWord}
                disabled={playing || !text.trim()}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white px-4 py-3 sm:py-4 rounded-xl font-bold transition duration-200 flex items-center justify-center gap-2 shadow-md col-span-2 sm:col-span-1"
              >
                <Volume2 size={20} />
                <span className="hidden sm:inline">{playing ? 'جاري...' : 'تشغيل'}</span>
                <span className="sm:hidden">{playing ? '...' : '▶'}</span>
              </button>

              <button
                onClick={addToFavorites}
                disabled={!text.trim()}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-300 disabled:to-gray-300 text-white px-4 py-3 sm:py-4 rounded-xl font-bold transition duration-200 flex items-center justify-center shadow-md"
                title="إضافة إلى المفضلة"
              >
                <Heart size={20} fill="currentColor" />
              </button>

            </div>

            {/* عرض الحرف الحالي */}
            <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-2xl shadow-lg border-2 border-indigo-200 p-8 text-center">
              <p className="text-gray-600 text-sm font-semibold mb-2">الحرف الحالي</p>
              <p className="text-7xl sm:text-8xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text">
                {current || '*'}
              </p>
            </div>

            {/* عرض النموذج ثلاثي الأبعاد */}
            

            {/* نصيحة */}
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 text-sm text-blue-800">
              💡 <span className="font-semibold">نصيحة:</span> استخدم عجلة الماوس للتكبير، واسحب لتدوير النموذج
            </div>
          </div>

          {/* القسم الأيمن - السجل والمفضلة */}
          <aside className="space-y-6">
            
            {/* السجل */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 overflow-hidden">
              <div
                onClick={() => setShowHistory(!showHistory)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 cursor-pointer flex items-center justify-between hover:shadow-lg transition"
              >
                <div className="flex items-center gap-2">
                  <History size={20} />
                  <span className="font-bold">السجل</span>
                </div>
                <span className="bg-white text-blue-600 font-bold px-3 py-1 rounded-full text-sm">
                  {history.length}
                </span>
              </div>
              
              {showHistory && (
                <div className="p-4 max-h-80 overflow-y-auto space-y-2">
                  {history.length > 0 ? (
                    history.map((word, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between group hover:bg-blue-100 transition"
                      >
                        <button
                          onClick={() => setText(word)}
                          className="text-blue-700 font-semibold flex-1 text-right hover:text-blue-900 transition"
                        >
                          {word}
                        </button>
                        <button
                          onClick={() => removeFromHistory(word)}
                          className="text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-6 text-sm">لا يوجد سجل بعد</p>
                  )}
                </div>
              )}
            </div>

            {/* المفضلة */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-pink-200 overflow-hidden">
              <div
                onClick={() => setShowFavorites(!showFavorites)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 cursor-pointer flex items-center justify-between hover:shadow-lg transition"
              >
                <div className="flex items-center gap-2">
                  <Heart size={20} fill="currentColor" />
                  <span className="font-bold">المفضلة</span>
                </div>
                <span className="bg-white text-pink-600 font-bold px-3 py-1 rounded-full text-sm">
                  {favorites.length}
                </span>
              </div>
              
              {showFavorites && (
                <div className="p-4 max-h-80 overflow-y-auto space-y-2">
                  {favorites.length > 0 ? (
                    favorites.map((word, idx) => (
                      <div
                        key={idx}
                        className="bg-pink-50 border border-pink-200 rounded-lg p-3 flex items-center justify-between group hover:bg-pink-100 transition"
                      >
                        <button
                          onClick={() => setText(word)}
                          className="text-pink-700 font-semibold flex-1 text-right hover:text-pink-900 transition"
                        >
                          {word}
                        </button>
                        <button
                          onClick={() => removeFromFavorites(word)}
                          className="text-pink-400 hover:text-pink-600 opacity-0 group-hover:opacity-100 transition p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-6 text-sm">لا توجد مفضلة بعد</p>
                  )}
                </div>
              )}
            </div>

            {/* بطاقة معلومات */}
           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-4">
              <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                ℹ️ كيفية الاستخدام
              </h3>
              <ul className="text-sm text-indigo-800 space-y-2">
                <li>✍️ اكتب كلمتك بالعربية</li>
                <li>▶️ اضغط تشغيل أو اضغط Enter</li>
                <li>❤️ احفظ المفضلة</li>
                <li>📜 عرض السجل</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* التذييل */}
    </div>
      <Footer />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-gradient-to-b from-white to-indigo-50 flex items-center justify-center text-gray-900">
        <div className="text-center">
          <p className="text-xl font-semibold">جاري التحميل...</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    }>
      <ModelViewer url="/pros.glb" />
    </Suspense>
  )
}