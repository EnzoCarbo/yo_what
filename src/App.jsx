import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import './App.css'

function App() {
  const [showGame, setShowGame] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState(null)
  
  const [power, setPower] = useState(0)
  const [spinsPlayed, setSpinsPlayed] = useState(0)
  
  const [mathAnswer, setMathAnswer] = useState('')
  const [rewardRedeemed, setRewardRedeemed] = useState(false)
  const [mathError, setMathError] = useState(false)
  
  const { width, height } = useWindowSize()

  // Power bar decrease effect
  useEffect(() => {
    if (power > 0 && power < 100 && !spinning && !result) {
      const interval = setInterval(() => {
        setPower(p => Math.max(p - 1.5, 0))
      }, 100)
      return () => clearInterval(interval)
    } else if (power >= 100 && !spinning && !result) {
      spinWheel()
    }
  }, [power, spinning, result])

  const sendDiscordNotif = async () => {
    // Remplacer cette URL par l'URL de votre Webhook Discord !
    const webhookUrl = "https://discord.com/api/webhooks/1493664102911050029/H6YjEwbKyOufo9sPK3LAa6tAMLB5CrXM4Tf5mV85JjhFRjhrtc0RI5tubdaDTFM6xC_z"; 
    
    if (!webhookUrl.startsWith("http")) return;

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: "🚨 INCROYABLE ! Quelqu'un vient de survivre à la roue, de spammer l'énergie et de résoudre l'équation complexe 5x5 ! Il a gagné un ticket pour Astérix ! 🎢"
        })
      });
    } catch (e) {
      console.error("Erreur lors de l'envoi Discord :", e);
    }
  }

  const handleSpamClick = () => {
    if (spinning || result) return
    setPower(p => Math.min(p + 3, 100))
  }

  const spinWheel = () => {
    if (spinning) return

    setSpinning(true)
    setResult(null)

    const currentSpin = spinsPlayed + 1
    
    // Rigging the wheel: 100% chance to lose on try 1 and 2. 99% chance to win on try 3!
    let forceWin = false
    if (currentSpin === 3) {
      forceWin = Math.random() < 0.99
    }
    
    let finalStoppedDegree;
    if (forceWin) {
      // Asterix is mapped to 356 to 360 degrees
      finalStoppedDegree = 356 + Math.random() * 3
    } else {
      // Perdu is mapped to 0 to 355 degrees
      finalStoppedDegree = Math.random() * 355
    }

    const targetModulo = (360 - finalStoppedDegree) % 360
    const currentModulo = rotation % 360
    
    const extraSpins = Math.floor(Math.random() * 5) + 5
    let diff = targetModulo - currentModulo
    if (diff < 0) diff += 360

    const totalRotation = rotation + (extraSpins * 360) + diff
    setRotation(totalRotation)

    // 5000ms animation duration
    setTimeout(() => {
      setSpinning(false)
      setSpinsPlayed(currentSpin)

      const stoppedDegree = (360 - (totalRotation % 360)) % 360
      const won = stoppedDegree >= 356 && stoppedDegree <= 360

      setResult(won ? 'WIN' : 'LOSE')
    }, 5000)
  }

  // Shrek images array for the background
  const shrekUrl = "https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png";
  const [shreks] = useState(() => Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    top: `${Math.random() * 100}vh`,
    animationDelay: `${Math.random() * 2}s`,
    width: `${Math.random() * 80 + 50}px`
  })))

  const resetGame = () => {
    setResult(null)
    setPower(0)
    setMathAnswer('')
    setRewardRedeemed(false)
    setMathError(false)
    if (spinsPlayed >= 3) {
      setSpinsPlayed(0) // Full reset if they reached the end
    }
  }

  const remainingSpins = 3 - spinsPlayed;

  // Landing page state for the "No" button escaping
  const [noButtonStyle, setNoButtonStyle] = useState({ position: 'relative' })
  
  const handleNoHover = () => {
    setNoButtonStyle({
      position: 'absolute',
      top: `${Math.random() * 80 + 10}vh`,
      left: `${Math.random() * 80 + 10}vw`,
      transform: 'translate(-50%, -50%)'
    })
  }

  if (!showGame) {
    return (
      <>
        {/* Background Shreks */}
        {shreks.map(shrek => (
          <img 
            key={shrek.id}
            src={shrekUrl}
            className="shrek-floater"
            style={{
              left: shrek.left,
              top: shrek.top,
              animationDelay: shrek.animationDelay,
              width: shrek.width
            }}
            alt="Shrek background"
          />
        ))}

        <div className="landing-container">
          <h1 className="landing-title">Voulez-vous gagner un ticket pour Astérix ?</h1>
          <div className="landing-buttons">
            <button className="btn-yes" onClick={() => setShowGame(true)}>OUI !</button>
            <button 
              className="btn-no" 
              style={noButtonStyle}
              onMouseEnter={handleNoHover}
              onClick={handleNoHover}
            >
              NON
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Confetti when winning */}
      {result === 'WIN' && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={500}
          gravity={0.15}
        />
      )}

      {/* Background Shreks */}
      {shreks.map(shrek => (
        <img 
          key={shrek.id}
          src={shrekUrl}
          className="shrek-floater"
          style={{
            left: shrek.left,
            top: shrek.top,
            animationDelay: shrek.animationDelay,
            width: shrek.width
          }}
          alt="Shrek background"
        />
      ))}

      <div className="app-container">
        <div className="title-container">
          <h1 className="title">La Roue Tourne</h1>
          <p className="subtitle">
            Lancers restants : <strong>{remainingSpins}</strong> / 3
          </p>
        </div>

        <div className="wheel-wrapper">
          <div className="marker-container">
            <div className="marker"></div>
          </div>

          <div className="wheel-container">
            <div
              className="wheel-inner"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="slice-text-perdu">PERDU</div>

              <div className="slice-text-asterix">
                <span>ASTERIX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="power-container">
          <div className="power-text">{power >= 100 ? 'LANCEMENT...' : 'ÉNERGIE'}</div>
          <div className="power-bar" style={{ width: `${power}%` }}></div>
        </div>

        <button
          className="spin-button"
          onClick={handleSpamClick}
          disabled={spinning || result !== null}
        >
          {spinning ? 'Suspense...' : 'SPAMME L\'ÉNERGIE !'}
        </button>

        {result && (
          <div className="result-modal-overlay">
            <div className={`result-modal ${result === 'WIN' ? 'win' : 'lose'}`}>
                <>
                  <h2>{result === 'WIN' ? '🎉 INCROYABLE 🎉' : '😥 PERDU 😥'}</h2>
                  {result === 'WIN' ? (
                    rewardRedeemed ? (
                      <p>VOUS AVEZ ENFIN GAGNÉ UN TICKET POUR LE PARC ASTÉRIX !!!</p>
                    ) : (
                      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        <p style={{ marginBottom: '1rem' }}>Bravo ! Pour débloquer définitivement votre ticket, veuillez prouver que vous n'êtes pas un robot :</p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
                           <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>5 × 5 =</span>
                           <input 
                             type="number" 
                             value={mathAnswer}
                             onChange={(e) => {
                               setMathAnswer(e.target.value)
                               setMathError(false)
                             }}
                             style={{ padding: '0.5rem', fontSize: '1.5rem', width: '100px', borderRadius: '10px', border: 'none', textAlign: 'center', color: '#111' }}
                           />
                           <button 
                             className="close-btn" 
                             style={{ padding: '0.5rem 1.5rem', fontSize: '1.2rem', margin: 0, boxShadow: 'none' }}
                             onClick={() => {
                               if (mathAnswer.trim() === '25') {
                                 setRewardRedeemed(true)
                                 sendDiscordNotif()
                               } else {
                                 setMathError(true)
                               }
                             }}
                           >
                             Valider
                           </button>
                        </div>
                        {mathError && <p style={{ color: '#ff4b2b', marginTop: '1rem', fontWeight: 'bold' }}>Réponse incorrecte ! Concentrez-vous !!</p>}
                      </div>
                    )
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {spinsPlayed === 1 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <p>Ah... perdu ! Ne baissez pas les bras, il vous reste 2 essais !</p>
                          <img 
                            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDY4eThlMDdkbGdnanZ5NGxhYngzbHBpazQycm12azEzZ3hueGg5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VzS83KZXazsy86sBCR/giphy.gif" 
                            alt="Cat troll 1" 
                            style={{ width: '250px', borderRadius: '15px', marginTop: '1rem', border: '3px solid #ff4b2b' }}
                          />
                        </div>
                      )}
                      {spinsPlayed === 2 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <p>Encore raté... Vous n'avez vraiment pas de chance. Plus qu'un seul essai !!</p>
                          <img 
                            src="https://media.giphy.com/media/hzzVv0SMDjyyVVtlnb/giphy.gif" 
                            alt="Cat troll 2" 
                            style={{ width: '250px', borderRadius: '15px', marginTop: '1rem', border: '3px solid #ff4b2b' }}
                          />
                        </div>
                      )}
                      {spinsPlayed === 3 && <p>Sérieusement ? Vous avez spammé 3 fois la barre, vous aviez 99% de chances au dernier lancer, et vous arrivez à tomber sur le 1% pour perdre. Quel échec...</p>}
                    </div>
                  )}
                </>
              
              {(!result || result !== 'WIN' || rewardRedeemed) && (
                <button className="close-btn" onClick={resetGame}>
                  {spinsPlayed >= 3 ? "Recommencer du début" : "Lancer suivant"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
