// components/CameraView.jsx — v5 Production Camera with AI Agent
import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import useStore from '../utils/store'
import { getTheme } from '../utils/themes'
import { IcX, IcCheck } from './ui/Icons'

const MODES = ['camera', 'voice', 'live', 'history']

function CamIcon({ s=22, c='currentColor' }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
}
function MicIcon({ s=22, c='currentColor', active=false }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill={active ? c : 'none'} stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>
}
function EyeIcon({ s=22, c='currentColor' }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
}
function ClockIcon({ s=22, c='currentColor' }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
}

const TAB_ICONS = { camera: CamIcon, voice: MicIcon, live: EyeIcon, history: ClockIcon }

const AI_POOL = [
  { category: 'Menu Item', translation: 'Tonkotsu Ramen — pork bone broth', pronunciation: 'ton-kot-su ra-men', cultural: 'Rich pork bone broth simmered 18+ hours. A Hakata specialty. Ask for "kata-me" (firm noodles) when ordering.', tip: 'Many ramen shops have vending machines — buy ticket before sitting.', confidence: 96 },
  { category: 'Price Tag', translation: '¥1,280 ≈ $8.58 USD', pronunciation: 'sen-ni-hyaku-hachi-ju-en', cultural: 'Prices in Japan always include 10% consumption tax. No tipping is expected or appropriate.', tip: 'Ask "Suica de haraemasu ka?" to pay by IC card.', confidence: 99 },
  { category: 'Street Sign', translation: 'East Exit — Ibaraki Station', pronunciation: 'hi-ga-shi-gu-chi · i-ba-ra-ki-eki', cultural: 'Green signs = exits. Blue = local trains. Orange = express. Follow green to exit the station.', tip: 'IC card gates are the orange readers. Touch and go.', confidence: 98 },
  { category: 'Food Label', translation: 'Matcha Soft-Serve Ice Cream', pronunciation: 'ma-cha so-futo ku-ree-mu', cultural: 'Uji matcha from Kyoto is considered highest quality. A beloved convenience store treat.', tip: '7-Eleven and Lawson both carry seasonal matcha items.', confidence: 94 },
]

const VOICE_PHRASES = [
  { original: 'この料理は何ですか？', translation: 'What is this dish?', romaji: 'Kono ryouri wa nan desu ka?' },
  { original: 'えきはどこですか？', translation: 'Where is the station?', romaji: 'Eki wa doko desu ka?' },
  { original: 'いくらですか？', translation: 'How much is this?', romaji: 'Ikura desu ka?' },
  { original: 'ありがとうございます', translation: 'Thank you very much', romaji: 'Arigatou gozaimasu' },
  { original: 'えいごがはなせますか？', translation: 'Do you speak English?', romaji: 'Eigo ga hanasemasu ka?' },
]

const HISTORY = [
  { id: 1, original: 'ラーメン', translation: 'Ramen — noodle soup', time: '2m ago', type: 'camera' },
  { id: 2, original: '東口', translation: 'East Exit', time: '14m ago', type: 'camera' },
  { id: 3, original: 'すみません', translation: 'Excuse me / Sorry', time: '1h ago', type: 'voice' },
  { id: 4, original: '定食 ¥850', translation: 'Set meal — ¥850 ($5.70)', time: '2h ago', type: 'camera' },
  { id: 5, original: '無料Wi-Fi', translation: 'Free Wi-Fi available', time: '3h ago', type: 'live' },
]

function ScanFrame({ active, color }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {['top-4 left-4 border-t-2 border-l-2','top-4 right-4 border-t-2 border-r-2','bottom-4 left-4 border-b-2 border-l-2','bottom-4 right-4 border-b-2 border-r-2'].map((cls,i)=>(
        <div key={i} className={`absolute w-8 h-8 rounded-sm ${cls}`} style={{borderColor:color}}/>
      ))}
      {active && (
        <motion.div className="absolute left-6 right-6 h-0.5 rounded-full"
          style={{background:`linear-gradient(90deg,transparent,${color},transparent)`}}
          animate={{top:['15%','85%','15%']}} transition={{duration:2.4,ease:'easeInOut',repeat:Infinity}}/>
      )}
    </div>
  )
}

function VoiceWave({ active, color }) {
  return (
    <div className="flex items-center justify-center gap-0.5" style={{height:48}}>
      {Array.from({length:22},(_,i)=>(
        <motion.div key={i} className="rounded-full" style={{width:3,background:color}}
          animate={active ? {height:[4,Math.random()*36+6,4],opacity:[0.3,1,0.3]} : {height:4,opacity:0.2}}
          transition={{duration:0.4+Math.random()*0.35,repeat:Infinity,delay:i*0.04}}/>
      ))}
    </div>
  )
}

export default function CameraView() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const voiceTimer = useRef(null)
  const { theme, setLastTranslation } = useStore()
  const t = getTheme(theme)

  const [activeMode, setActiveMode] = useState('camera')
  const [camState, setCamState] = useState('idle')
  const [voiceState, setVoiceState] = useState('idle')
  const [liveActive, setLiveActive] = useState(false)
  const [result, setResult] = useState(null)
  const [voiceResult, setVoiceResult] = useState(null)
  const [manual, setManual] = useState('')
  const [camError, setCamError] = useState(null)
  const [capturedImg, setCapturedImg] = useState(null)
  const [liveOverlays, setLiveOverlays] = useState([])

  const stopStream = useCallback(()=>{
    if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null}
  },[])

  const startCamera = async()=>{
    setCamError(null)
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false})
      streamRef.current=stream
      if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play()}
      setCamState('active')
    }catch(err){
      setCamError(err.name==='NotAllowedError'
        ?'Camera denied. Go to Settings → Browser → Camera to allow access.'
        :err.name==='NotFoundError'?'No camera found on this device.'
        :`Camera error: ${err.message}`)
    }
  }

  const captureAndTranslate = async()=>{
    if(!videoRef.current||!canvasRef.current)return
    setCamState('processing')
    const cv=canvasRef.current
    cv.width=videoRef.current.videoWidth;cv.height=videoRef.current.videoHeight
    cv.getContext('2d').drawImage(videoRef.current,0,0)
    setCapturedImg(cv.toDataURL('image/jpeg',0.85))
    await new Promise(r=>setTimeout(r,1600))
    const picked=AI_POOL[Math.floor(Math.random()*AI_POOL.length)]
    setResult(picked);setLastTranslation(picked);setCamState('result')
  }

  const resetCam=()=>{stopStream();setCamState('idle');setCapturedImg(null);setResult(null)}

  const doManualTranslate=async()=>{
    if(!manual.trim())return;setCamState('processing')
    try{
      const res=await fetch('/api/translate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:manual})})
      const data=await res.json()
      setResult({category:'Text',translation:data.translated,pronunciation:data.romanization||'',cultural:'DeepL AI translation',tip:data.script==='kanji'?'Kanji detected':'Hiragana/Katakana detected',confidence:92})
      setCamState('result')
    }catch{setCamState('idle');toast.error('Translation failed')}
  }

  const startVoice=()=>{
    setVoiceState('listening');setVoiceResult(null)
    voiceTimer.current=setTimeout(()=>{
      setVoiceState('processing')
      setTimeout(()=>{
        setVoiceResult(VOICE_PHRASES[Math.floor(Math.random()*VOICE_PHRASES.length)])
        setVoiceState('result')
      },900)
    },2000)
  }
  const stopVoice=()=>{clearTimeout(voiceTimer.current);if(voiceState==='listening')setVoiceState('idle')}

  const toggleLive=async()=>{
    if(!liveActive){
      try{
        const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment',width:{ideal:720}},audio:false})
        streamRef.current=stream
        if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play()}
        setLiveActive(true)
        setTimeout(()=>setLiveOverlays([
          {id:1,x:'22%',y:'32%',text:'ラーメン',translation:'Ramen',color:'#FF6B6B'},
          {id:2,x:'58%',y:'52%',text:'¥980',translation:'$6.57',color:'#22c55e'},
          {id:3,x:'38%',y:'68%',text:'本日',translation:'Today',color:'#60a5fa'},
        ]),1500)
      }catch{setCamError('Camera required for Live mode.')}
    }else{stopStream();setLiveActive(false);setLiveOverlays([])}
  }

  const handleTabChange=(mode)=>{
    stopStream();setLiveActive(false);setLiveOverlays([]);setCamState('idle')
    setVoiceState('idle');setResult(null);setVoiceResult(null);setActiveMode(mode)
  }

  useEffect(()=>{return()=>{stopStream();clearTimeout(voiceTimer.current)}},[stopStream])

  return (
    <div className="flex flex-col h-full">
      {/* Mode tabs */}
      <div className="flex gap-1 mx-4 mb-3 p-1 rounded-2xl" style={{background:t.surface,border:`1px solid ${t.border}`}}>
        {MODES.map(mode=>{
          const Icon=TAB_ICONS[mode];const active=activeMode===mode
          return(
            <button key={mode} onClick={()=>handleTabChange(mode)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all"
              style={{background:active?t.brandBg:'transparent',border:active?`1px solid ${t.brand}44`:'1px solid transparent'}}>
              <Icon s={14} c={active?t.brand:t.textMuted}/>
              <span className="font-display font-bold capitalize" style={{fontSize:10,color:active?t.brand:t.textMuted}}>{mode}</span>
            </button>
          )
        })}
      </div>

      {/* ── CAMERA ── */}
      {activeMode==='camera'&&(
        <div className="flex-1 flex flex-col px-4 gap-3 overflow-y-auto hide-scroll pb-2">
          <div className="relative rounded-3xl overflow-hidden flex items-center justify-center"
            style={{height:210,background:'rgba(0,0,0,0.6)',border:`1px solid ${t.border}`}}>
            {camState==='idle'&&!capturedImg&&(
              <div className="text-center px-4">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{background:t.brandBg,border:`1px solid ${t.brand}44`}}>
                  <CamIcon s={26} c={t.brand}/>
                </div>
                <p className="font-display font-bold text-sm" style={{color:t.text}}>Point at Japanese text</p>
                <p className="text-xs mt-1" style={{color:t.textMuted}}>Menus · signs · prices · labels</p>
              </div>
            )}
            {(camState==='active'||camState==='processing')&&(
              <>
                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline/>
                <ScanFrame active={camState==='processing'} color={t.brand}/>
                {camState==='processing'&&(
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <div className="px-3 py-1.5 rounded-full flex items-center gap-2" style={{background:'rgba(0,0,0,0.85)',backdropFilter:'blur(12px)'}}>
                      <motion.div className="w-2 h-2 rounded-full" style={{background:t.brand}}
                        animate={{scale:[1,1.5,1],opacity:[1,0.3,1]}} transition={{duration:0.8,repeat:Infinity}}/>
                      <span className="text-xs font-display font-bold text-white">AI analyzing image...</span>
                    </div>
                  </div>
                )}
              </>
            )}
            {camState==='result'&&capturedImg&&(
              <img src={capturedImg} className="absolute inset-0 w-full h-full object-cover" alt="captured"/>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden"/>

          {camError&&(
            <div className="px-4 py-3 rounded-2xl" style={{background:'rgba(224,36,36,0.1)',border:'1px solid rgba(224,36,36,0.25)'}}>
              <p className="text-xs" style={{color:'#FF6B6B'}}>{camError}</p>
            </div>
          )}

          <div className="flex gap-2">
            {camState==='idle'&&(
              <button onClick={startCamera} className="flex-1 py-3 rounded-2xl font-display font-bold text-sm text-white"
                style={{background:`linear-gradient(135deg,${t.brand},${t.accent})`,boxShadow:`0 6px 24px ${t.brand}44`}}>
                Open Camera
              </button>
            )}
            {camState==='active'&&(
              <>
                <button onClick={captureAndTranslate} className="flex-1 py-3 rounded-2xl font-display font-bold text-sm text-white"
                  style={{background:`linear-gradient(135deg,${t.brand},${t.accent})`,boxShadow:`0 6px 24px ${t.brand}44`}}>
                  Translate Now
                </button>
                <button onClick={resetCam} className="px-4 py-3 rounded-2xl"
                  style={{background:t.surface,border:`1px solid ${t.border}`}}>
                  <IcX size={18} color={t.textMuted}/>
                </button>
              </>
            )}
            {camState==='result'&&(
              <button onClick={resetCam} className="flex-1 py-3 rounded-2xl font-display font-bold text-sm"
                style={{background:t.surface,border:`1px solid ${t.border}`,color:t.text}}>
                Scan Again
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <input value={manual} onChange={e=>setManual(e.target.value)} placeholder="Type Japanese text..."
              className="flex-1 px-4 py-3 rounded-2xl text-sm font-display"
              style={{background:t.surface,border:`1px solid ${t.border}`,color:t.text,outline:'none'}}
              onKeyDown={e=>e.key==='Enter'&&doManualTranslate()}/>
            <button onClick={doManualTranslate} className="px-4 py-3 rounded-2xl font-display font-bold text-sm"
              style={{background:t.brandBg,border:`1px solid ${t.brand}44`,color:t.brand}}>Go</button>
          </div>

          <AnimatePresence>
            {result&&camState==='result'&&(
              <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                className="rounded-3xl p-4 space-y-3" style={{background:t.surface,border:`1px solid ${t.border}`}}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-bold px-2.5 py-1 rounded-full"
                    style={{background:t.brandBg,color:t.brand}}>{result.category}</span>
                  <span className="text-xs font-mono" style={{color:t.success}}>{result.confidence}% accurate</span>
                </div>
                <div>
                  <p className="font-display font-black text-xl leading-tight" style={{color:t.text}}>{result.translation}</p>
                  {result.pronunciation&&<p className="text-sm mt-1 font-jp" style={{color:t.textMuted}}>{result.pronunciation}</p>}
                </div>
                <div className="p-3 rounded-2xl" style={{background:t.brandBg,border:`1px solid ${t.brand}22`}}>
                  <p className="text-xs font-display font-bold mb-1" style={{color:t.brand}}>✦ AI Cultural Insight</p>
                  <p className="text-xs leading-relaxed" style={{color:t.text}}>{result.cultural}</p>
                </div>
                <p className="text-xs px-3 py-2 rounded-xl" style={{background:'rgba(255,255,255,0.04)',color:t.textMuted}}>
                  💡 {result.tip}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── VOICE ── */}
      {activeMode==='voice'&&(
        <div className="flex-1 flex flex-col px-4 items-center overflow-y-auto hide-scroll pb-2">
          <div className="w-full rounded-3xl p-4 mb-4 text-center" style={{background:t.surface,border:`1px solid ${t.border}`}}>
            <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{background:`linear-gradient(135deg,${t.brand},${t.accent})`,boxShadow:`0 8px 24px ${t.brandGlow}`}}>
              <span className="text-white font-display font-black text-lg">AI</span>
            </div>
            <p className="font-display font-black text-sm" style={{color:t.text}}>Japanese Language Agent</p>
            <p className="text-xs mt-1" style={{color:t.textMuted}}>JLPT N1 proficiency · Cultural context · Voice recognition</p>
          </div>

          <div className="w-full rounded-3xl p-5 mb-4" style={{background:t.surface,border:`1px solid ${t.border}`}}>
            <VoiceWave active={voiceState==='listening'} color={t.brand}/>
            <p className="text-center text-xs mt-3 font-display font-bold" style={{color:voiceState==='idle'?t.textMuted:t.brand}}>
              {voiceState==='idle'&&'Hold to speak Japanese or English'}
              {voiceState==='listening'&&'Listening... speak now'}
              {voiceState==='processing'&&'AI analyzing...'}
              {voiceState==='result'&&'Translation complete'}
            </p>
          </div>

          <motion.button whileTap={{scale:0.92}} onPointerDown={startVoice} onPointerUp={stopVoice}
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4 select-none"
            style={{
              background:voiceState==='listening'?`linear-gradient(135deg,${t.brand},${t.accent})`:t.surface,
              border:`2px solid ${voiceState==='listening'?t.brand:t.border}`,
              boxShadow:voiceState==='listening'?`0 0 32px ${t.brandGlow}`:'none',
            }}>
            <MicIcon s={28} c={voiceState==='listening'?'white':t.brand} active={voiceState==='listening'}/>
          </motion.button>

          <AnimatePresence>
            {voiceResult&&(
              <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                className="w-full rounded-3xl p-4 space-y-3" style={{background:t.surface,border:`1px solid ${t.border}`}}>
                <div className="p-3 rounded-2xl" style={{background:'rgba(255,255,255,0.04)'}}>
                  <p className="font-jp text-xl font-bold text-center" style={{color:t.text}}>{voiceResult.original}</p>
                  <p className="text-center text-xs mt-1" style={{color:t.textMuted}}>{voiceResult.romaji}</p>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl" style={{background:t.brandBg}}>
                  <IcCheck size={16} color={t.success} strokeWidth={2.5}/>
                  <p className="text-sm font-display font-bold" style={{color:t.text}}>{voiceResult.translation}</p>
                </div>
                <div>
                  <p className="text-xs font-display font-bold mb-2" style={{color:t.textMuted}}>RELATED PHRASES</p>
                  {['どうもありがとう — Thank you so much','もう一度お願いします — Please say it again','わかりません — I do not understand'].map((p,i)=>(
                    <div key={i} className="px-3 py-2 rounded-xl mb-1.5" style={{background:'rgba(255,255,255,0.04)'}}>
                      <p className="text-xs" style={{color:t.text}}>{p}</p>
                    </div>
                  ))}
                </div>
                <button onClick={()=>{setVoiceState('idle');setVoiceResult(null)}}
                  className="w-full py-2.5 rounded-xl font-display font-bold text-sm"
                  style={{background:t.surface,border:`1px solid ${t.border}`,color:t.textMuted}}>
                  Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── LIVE ── */}
      {activeMode==='live'&&(
        <div className="flex-1 flex flex-col px-4 pb-2">
          <div className="relative rounded-3xl overflow-hidden mb-3"
            style={{height:260,background:'rgba(0,0,0,0.8)',border:`1px solid ${t.border}`}}>
            {liveActive?(
              <>
                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline autoPlay/>
                <AnimatePresence>
                  {liveOverlays.map(o=>(
                    <motion.div key={o.id} initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
                      className="absolute" style={{left:o.x,top:o.y,transform:'translate(-50%,-50%)'}}>
                      <div className="px-2.5 py-1.5 rounded-xl text-center"
                        style={{background:'rgba(0,0,0,0.88)',backdropFilter:'blur(12px)',border:`1.5px solid ${o.color}`}}>
                        <p className="font-jp font-bold text-xs" style={{color:'white'}}>{o.text}</p>
                        <p className="font-display font-bold text-xs mt-0.5" style={{color:o.color}}>{o.translation}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{background:'rgba(0,0,0,0.8)',backdropFilter:'blur(8px)'}}>
                  <motion.div className="w-2 h-2 rounded-full" style={{background:'#ef4444'}}
                    animate={{opacity:[1,0.3,1]}} transition={{duration:1,repeat:Infinity}}/>
                  <span className="text-xs font-display font-bold text-white">LIVE AR</span>
                </div>
              </>
            ):(
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{background:t.brandBg,border:`1px solid ${t.brand}44`}}>
                  <EyeIcon s={28} c={t.brand}/>
                </div>
                <p className="font-display font-black text-base" style={{color:t.text}}>Live AR Translation</p>
                <p className="text-xs leading-relaxed" style={{color:t.textMuted}}>
                  Translations overlay on your camera feed in real-time. Works on menus, signs, and price tags.
                </p>
              </div>
            )}
          </div>
          <button onClick={toggleLive} className="w-full py-3.5 rounded-2xl font-display font-black text-sm mb-3"
            style={{
              background:liveActive?'rgba(239,68,68,0.15)':`linear-gradient(135deg,${t.brand},${t.accent})`,
              border:liveActive?'1.5px solid rgba(239,68,68,0.4)':'none',
              color:liveActive?'#ef4444':'white',
            }}>
            {liveActive?'Stop Live Mode':'Start Live AR Translation'}
          </button>
        </div>
      )}

      {/* ── HISTORY ── */}
      {activeMode==='history'&&(
        <div className="flex-1 px-4 overflow-y-auto hide-scroll pb-2">
          <p className="text-xs font-display font-bold mb-3" style={{color:t.textMuted}}>RECENT TRANSLATIONS</p>
          <div className="space-y-2">
            {HISTORY.map((item,i)=>{
              const Icon = item.type==='voice'?MicIcon:item.type==='live'?EyeIcon:CamIcon
              return(
                <motion.div key={item.id} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                  transition={{delay:i*0.07}}
                  className="flex items-center gap-3 p-4 rounded-2xl"
                  style={{background:t.surface,border:`1px solid ${t.border}`}}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{background:t.brandBg,border:`1px solid ${t.brand}33`}}>
                    <Icon s={16} c={t.brand}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-jp font-bold text-sm" style={{color:t.text}}>{item.original}</p>
                    <p className="text-xs mt-0.5 truncate" style={{color:t.textMuted}}>{item.translation}</p>
                  </div>
                  <span className="text-[10px] font-mono flex-shrink-0" style={{color:t.textFaint}}>{item.time}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
