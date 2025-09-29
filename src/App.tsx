import { useState } from 'react'
import { useSubscribeDev } from '@subscribe.dev/react'
import './App.css'

// Component for unauthenticated state
function SignInScreen({ signIn }: { signIn: () => void }) {
  return (
    <div className="sign-in-container">
      <div className="duck-emoji">🦆</div>
      <h1>Themed Duck Generator</h1>
      <p className="subtitle">Generate custom duck images with any theme you can imagine</p>
      <button onClick={signIn} className="sign-in-button">
        Sign In to Start Generating
      </button>
    </div>
  )
}

// Component for authenticated state with duck generator
function DuckGenerator() {
  const { client, user, usage, subscribe, subscriptionStatus, signOut, useStorage } = useSubscribeDev()

  const [theme, setTheme] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use storage to persist generation history
  const [history, setHistory, syncStatus] = useStorage<Array<{ theme: string; timestamp: number }>>('duck-history', [])

  const handleGenerate = async () => {
    if (!client || !theme.trim()) return

    setLoading(true)
    setError(null)

    try {
      const prompt = `A cute rubber duck themed as ${theme}, high quality, detailed, vibrant colors, studio lighting, 3D render`

      const { output } = await client.run('black-forest-labs/flux-schnell', {
        input: {
          prompt,
          width: 1024,
          height: 1024
        }
      })

      setGeneratedImage(output[0] as string)

      // Add to history
      const newHistory = [{ theme, timestamp: Date.now() }, ...history.slice(0, 9)]
      setHistory(newHistory)

    } catch (err: any) {
      if (err.type === 'insufficient_credits') {
        setError('Not enough credits! Please upgrade your plan to continue generating ducks.')
      } else if (err.type === 'rate_limit_exceeded') {
        const retrySeconds = Math.ceil((err.retryAfter || 60000) / 1000)
        setError(`Rate limit reached. Please try again in ${retrySeconds} seconds.`)
      } else {
        setError('Failed to generate image. Please try again.')
      }
      console.error('Generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerate()
    }
  }

  return (
    <div className="duck-app">
      {/* Header with user info and controls */}
      <header className="app-header">
        <div className="header-content">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <button onClick={signOut} className="btn-secondary">
              Sign Out
            </button>
          </div>

          <div className="usage-info">
            <div className="credits">
              <span className="credits-label">Credits:</span>
              <span className="credits-value">{usage?.remainingCredits ?? 0}</span>
            </div>
            <div className="plan">
              <span className="plan-name">{subscriptionStatus?.plan?.name ?? 'Free'}</span>
              <button onClick={subscribe!} className="btn-upgrade">
                Manage Plan
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="main-content">
        <div className="duck-emoji-large">🦆</div>
        <h1>Themed Duck Generator</h1>
        <p className="description">Enter any theme to generate a unique duck image</p>

        {/* Input section */}
        <div className="input-section">
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., pirate, astronaut, wizard..."
            className="theme-input"
            disabled={loading}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !theme.trim()}
            className="btn-generate"
          >
            {loading ? 'Generating...' : 'Generate Duck'}
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            {error.includes('credits') && (
              <button onClick={subscribe!} className="btn-upgrade-inline">
                Upgrade Now
              </button>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Creating your themed duck...</p>
          </div>
        )}

        {/* Generated image */}
        {generatedImage && !loading && (
          <div className="image-container">
            <img src={generatedImage} alt={`Duck themed as ${theme}`} className="generated-image" />
            <p className="image-caption">Duck themed as: <strong>{theme}</strong></p>
          </div>
        )}

        {/* History section */}
        {history.length > 0 && (
          <div className="history-section">
            <h3>Recent Themes <span className="sync-status">({syncStatus})</span></h3>
            <div className="history-list">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setTheme(item.theme)}
                  className="history-item"
                >
                  {item.theme}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Main app component with conditional rendering
export default function App() {
  const { isSignedIn, signIn } = useSubscribeDev()

  if (!isSignedIn) {
    return <SignInScreen signIn={signIn} />
  }

  return <DuckGenerator />
}