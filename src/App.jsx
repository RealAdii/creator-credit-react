import { useState } from 'react'
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'
import './App.css'

// Reclaim credentials
const APP_ID = '0x8b377992E1F76560d1836f51BAAf86f8600ec360'
const APP_SECRET = '0xc5c38950146621afde382fec6e652d64ca2f1bd703d23c05fdc746b24e3a2f40'
const PROVIDER_ID = 'b9535a2d-c7b4-463c-8d35-15329ff4d7de'

// Platform icons as components
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#FF0000">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#E4405F">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

// Demo Twitter revenue
const DEMO_TWITTER_REVENUE = 550

// Underwriting Algorithm
function calculateCreditLine(monthlyRevenue, accountAgeMonths = 12, revenueMonths = 6, isGrowing = true) {
  const BASE_MULTIPLIER = 4
  let riskScore = 0.5

  if (accountAgeMonths > 24) riskScore += 0.1
  if (revenueMonths >= 6) riskScore += 0.2
  if (isGrowing) riskScore += 0.1

  riskScore = Math.min(riskScore, 1.0)

  const creditLine = monthlyRevenue * BASE_MULTIPLIER * riskScore

  return {
    creditLine: Math.floor(creditLine),
    riskScore,
    multiplier: BASE_MULTIPLIER,
    apy: riskScore >= 0.8 ? 8.5 : riskScore >= 0.6 ? 10.5 : 12.5
  }
}

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [revenue, setRevenue] = useState(0)
  const [creditLine, setCreditLine] = useState(0)
  const [apy, setApy] = useState(0)
  const [pulled, setPulled] = useState(0)
  const [connecting, setConnecting] = useState(false)
  const [showPullModal, setShowPullModal] = useState(false)
  const [pullAmount, setPullAmount] = useState('')

  const connectX = async () => {
    setConnecting(true)

    try {
      console.log('Initializing Reclaim with in-browser SDK...')

      // Initialize with in-browser SDK option
      const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID, {
        customSharePageUrl: 'https://portal.reclaimprotocol.org'
      })

      console.log('Reclaim initialized')

      // Start session to listen for proofs
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          console.log('Verification successful!', proofs)
          handleReclaimSuccess(proofs)
        },
        onError: (err) => {
          console.error('Verification failed:', err)
          setConnecting(false)
          alert('Verification failed: ' + (err.message || err))
        }
      })

      // Get the request URL
      const requestUrl = await reclaimProofRequest.getRequestUrl()
      console.log('Request URL:', requestUrl)

      // Open the verification URL in new window
      const verifyWindow = window.open(requestUrl, '_blank', 'width=600,height=800,scrollbars=yes')

      if (!verifyWindow) {
        alert('Please allow popups to complete verification')
        setConnecting(false)
      }

    } catch (err) {
      console.error('Reclaim error:', err)
      setConnecting(false)
      alert('Error: ' + (err.message || err))
    }
  }

  // Handle Reclaim proof success
  const handleReclaimSuccess = (proofs) => {
    let verifiedRevenue = DEMO_TWITTER_REVENUE // Default fallback

    try {
      if (proofs && proofs.length > 0) {
        const proof = proofs[0]
        console.log('Full proof:', JSON.stringify(proof, null, 2))

        const context = JSON.parse(proof.claimData?.context || '{}')
        const params = JSON.parse(proof.claimData?.parameters || '{}')
        console.log('Proof data:', { context, params })

        // Extract revenue from proof if available
        const extracted = context.extractedParameters || {}
        const possibleRevenue = parseFloat(
          extracted.revenue ||
          extracted.amount ||
          extracted.payout ||
          extracted.earnings ||
          params.revenue ||
          params.amount ||
          0
        )

        if (possibleRevenue > 0) {
          verifiedRevenue = possibleRevenue
        }
      }
    } catch (e) {
      console.log('Could not parse proof data, using demo value:', e)
    }

    // Calculate credit using underwriting algorithm
    const underwriting = calculateCreditLine(verifiedRevenue)

    setRevenue(verifiedRevenue)
    setCreditLine(underwriting.creditLine)
    setApy(underwriting.apy)
    setIsConnected(true)
    setConnecting(false)

    console.log('Credit approved:', {
      verifiedRevenue: `$${verifiedRevenue}/mo`,
      creditLine: `$${underwriting.creditLine}`,
      apy: `${underwriting.apy}%`
    })
  }


  const handlePull = () => {
    const amount = parseInt(pullAmount.replace(/\D/g, ''))
    if (amount && amount <= creditLine) {
      setPulled(amount)
      setShowPullModal(false)
      setPullAmount('')
    }
  }

  return (
    <div className="app">
      {/* Scattered decorative text */}
      <div className="scatter scatter-1">(...) CREATOR_PRODUCTIVITY....</div>
      <div className="scatter scatter-2">(...) REVENUE_BACKED_CREDIT..........</div>
      <div className="scatter scatter-3">//EPOCH 100 CREDIT</div>
      <div className="scatter scatter-4">.C0 {'>'} CONTENT<br/>.C1 {'>'} CREATOR<br/>.C2 {'>'} CREDIT<br/>.C3 {'>'} CAPITAL</div>
      <div className="scatter scatter-5">(FUTURE_BACKED CR...</div>
      <div className="scatter scatter-6">++++++<br/>++++++<br/>++++++</div>
      <div className="scatter scatter-7">{'{'}$USDC $HONEY{'}'}</div>
      <div className="scatter scatter-8">TERMINAL REVENUE HARVEST<br/>2026</div>

      {/* Navigation */}
      <nav>
        <div className="logo">CRDT</div>
        <a href="https://cal.com/adithyadinesh/15min" target="_blank" rel="noreferrer" className="nav-btn">
          [ TALK TO THE BEST ZKTLS PROVIDER ]
        </a>
      </nav>

      {/* Main content */}
      <div className="container">
        <div className="hero">
          <h1>CREATOR CREDIT<br/>PROTOCOL</h1>
          <p>REVENUE-BACKED CAPITAL FOR CREATORS</p>
        </div>

        <div className="dashboard">
          {/* Stats row */}
          <div className="stats-row">
            <div className="stat">
              <div className="stat-label">CREDIT LINE</div>
              <div className="stat-value highlight">${creditLine.toLocaleString()}</div>
            </div>
            <div className="stat">
              <div className="stat-label">IMPLIED APY</div>
              <div className="stat-value">{apy ? `${apy}%` : '--%'}</div>
            </div>
            <div className="stat">
              <div className="stat-label">PULLED</div>
              <div className="stat-value">${pulled.toLocaleString()}</div>
            </div>
          </div>

          {/* Verified Revenue */}
          <div className="section-header">VERIFIED REVENUE (via Reclaim)</div>
          <div className="revenue-section">
            <div className="platform-row">
              <div className="platform-left">
                <div className="platform-icon"><XIcon /></div>
                <div className="platform-name">X / Twitter</div>
              </div>
              <div className="platform-right">
                {isConnected ? (
                  <>
                    <span className="platform-value">${revenue.toLocaleString()}/mo</span>
                    <span className="platform-status status-verified">✓</span>
                  </>
                ) : (
                  <button className="connect-btn" onClick={connectX} disabled={connecting}>
                    {connecting ? '[ CONNECTING... ]' : '[ CONNECT ]'}
                  </button>
                )}
              </div>
            </div>

            <div className="platform-row">
              <div className="platform-left">
                <div className="platform-icon"><YouTubeIcon /></div>
                <div className="platform-name">YouTube AdSense</div>
              </div>
              <div className="platform-right">
                <span className="platform-status status-coming">COMING SOON</span>
              </div>
            </div>

            <div className="platform-row">
              <div className="platform-left">
                <div className="platform-icon"><InstagramIcon /></div>
                <div className="platform-name">Instagram</div>
              </div>
              <div className="platform-right">
                <span className="platform-status status-coming">COMING SOON</span>
              </div>
            </div>

            <div className="platform-row">
              <div className="platform-left">
                <div className="platform-icon"><TikTokIcon /></div>
                <div className="platform-name">TikTok Creator Fund</div>
              </div>
              <div className="platform-right">
                <span className="platform-status status-coming">COMING SOON</span>
              </div>
            </div>

            <div className="revenue-total">
              <span className="revenue-total-label">TOTAL VERIFIED</span>
              <span className="revenue-total-value">${revenue.toLocaleString()}/mo</span>
            </div>
          </div>

          {/* Pull button */}
          <button
            className="pull-btn"
            disabled={!isConnected}
            onClick={() => setShowPullModal(true)}
          >
            [ PULL ]
          </button>
        </div>

        {/* Backed by */}
        <div className="backed-by">
          <div className="backed-label">[ POWERED BY ]</div>
          <div className="backed-logos">
            <span>RECLAIM</span>
          </div>
        </div>
      </div>

      {/* Pull Modal */}
      {showPullModal && (
        <div className="modal-overlay" onClick={() => setShowPullModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>PULL CREDIT</h3>
            <p>Based on your verified revenue, you can pull up to <strong>${creditLine.toLocaleString()}</strong> at <strong>{apy}% APY</strong>.</p>
            <input
              type="text"
              value={pullAmount}
              onChange={(e) => setPullAmount(e.target.value)}
              placeholder="Enter amount..."
            />
            <div className="modal-buttons">
              <button className="modal-btn" onClick={handlePull}>[ CONFIRM PULL ]</button>
              <button className="modal-btn secondary" onClick={() => setShowPullModal(false)}>[ CANCEL ]</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
