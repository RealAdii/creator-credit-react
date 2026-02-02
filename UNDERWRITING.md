# Creator Credit Protocol — Underwriting Algorithm

## Overview

Creator Credit Protocol provides credit lines to content creators based on their verified platform revenue. Rather than traditional credit scores or collateral, we use on-chain verified earnings data from platforms like Twitter/X, YouTube, Instagram, and TikTok to determine creditworthiness.

This document explains the underwriting algorithm that calculates credit lines and interest rates.

---

## The Core Formula

```
Credit Line = Monthly Revenue × Base Multiplier × Trust Score
```

| Component | Description |
|-----------|-------------|
| **Monthly Revenue** | Verified earnings from creator platforms (pulled via Reclaim Protocol) |
| **Base Multiplier** | Fixed at 4x — represents months of revenue we're willing to advance |
| **Trust Score** | Dynamic coefficient (0.5 to 1.0) based on creator reliability signals |

---

## Trust Score Calculation

The trust score quantifies creator reliability. It determines both the credit line size and the interest rate offered.

### Initialization

Every verified creator starts with a base trust score of **0.5** (50%). This floor ensures that even new creators can access credit while protecting against default risk. The score can increase up to a maximum of **1.0** based on additional trust signals.

### Trust Signals

The score increases through three binary feature flags:

| Signal | Weight | Trigger Condition | Rationale |
|--------|--------|-------------------|-----------|
| Account Longevity | +0.1 | `accountAge > 24 months` | Creators with 2+ years on a platform demonstrate sustained commitment and lower churn probability |
| Revenue Consistency | +0.2 | `revenueHistory >= 6 months` | Six months of continuous monetization signals stable income patterns — strongest predictor of repayment |
| Growth Trajectory | +0.1 | `monthOverMonthGrowth > 0` | Positive revenue delta indicates expanding audience and earning potential |

### Score Calculation

```javascript
let trustScore = 0.5  // base

if (accountAgeMonths > 24)  trustScore += 0.1   // longevity bonus
if (revenueMonths >= 6)     trustScore += 0.2   // consistency bonus
if (isGrowing)              trustScore += 0.1   // growth bonus

trustScore = Math.min(trustScore, 1.0)  // cap at 1.0
```

### Score Distribution

| Profile | Score | Description |
|---------|-------|-------------|
| New Creator | 0.5 | Just verified, no history |
| Established | 0.6-0.7 | Some history or growth |
| Reliable | 0.8 | Multiple trust signals |
| Premium | 0.9 | All trust signals present |

---

## Interest Rate Tiering

The trust score inversely correlates with interest rates. Higher trust means lower rates.

| Trust Score | APY | Tier |
|-------------|-----|------|
| >= 0.8 | 8.5% | Premium |
| >= 0.6 | 10.5% | Standard |
| < 0.6 | 12.5% | Elevated Risk |

This tiered structure rewards consistent, growing creators while still providing access to newer creators at appropriately priced risk.

---

## Worked Examples

### Example 1: New Creator

A creator just verified their Twitter/X account showing $400/month revenue. They've been on the platform for 8 months with 3 months of monetization history and flat growth.

```
Monthly Revenue:     $400
Account Age:         8 months (< 24, no bonus)
Revenue History:     3 months (< 6, no bonus)
Growth:              Flat (no bonus)

Trust Score:         0.5 (base only)
Credit Line:         $400 × 4 × 0.5 = $800
Interest Rate:       12.5% APY
```

### Example 2: Established Creator

A YouTube creator earning $1,200/month. They've been creating for 18 months with 9 months of AdSense history and 15% month-over-month growth.

```
Monthly Revenue:     $1,200
Account Age:         18 months (< 24, no bonus)
Revenue History:     9 months (>= 6, +0.2)
Growth:              +15% MoM (+0.1)

Trust Score:         0.5 + 0.2 + 0.1 = 0.8
Credit Line:         $1,200 × 4 × 0.8 = $3,840
Interest Rate:       8.5% APY
```

### Example 3: Premium Creator

A TikTok creator earning $2,500/month. They've been on the platform for 36 months with 14 months of Creator Fund payouts and steady 8% growth.

```
Monthly Revenue:     $2,500
Account Age:         36 months (> 24, +0.1)
Revenue History:     14 months (>= 6, +0.2)
Growth:              +8% MoM (+0.1)

Trust Score:         0.5 + 0.1 + 0.2 + 0.1 = 0.9
Credit Line:         $2,500 × 4 × 0.9 = $9,000
Interest Rate:       8.5% APY
```

---

## Verification via Reclaim Protocol

All revenue data is verified using [Reclaim Protocol](https://reclaimprotocol.org), which enables zero-knowledge proofs of web2 data. This means:

1. **No API Access Required**: Creators don't share login credentials
2. **Cryptographic Verification**: Revenue claims are mathematically provable
3. **Privacy Preserving**: Only the necessary data points are revealed
4. **Real-time**: Verification happens in-browser, instantly

The verification flow:
1. Creator clicks "Connect" on a platform
2. Reclaim opens a secure verification portal
3. Creator logs into their platform dashboard
4. Reclaim generates a ZK proof of the revenue data
5. Proof is verified on-chain
6. Credit line is calculated and offered

---

## Algorithm Implementation

```javascript
function calculateCreditLine(monthlyRevenue, accountAgeMonths = 12, revenueMonths = 6, isGrowing = true) {
  const BASE_MULTIPLIER = 4

  // Calculate trust score
  let trustScore = 0.5
  if (accountAgeMonths > 24) trustScore += 0.1
  if (revenueMonths >= 6) trustScore += 0.2
  if (isGrowing) trustScore += 0.1
  trustScore = Math.min(trustScore, 1.0)

  // Calculate credit line
  const creditLine = monthlyRevenue * BASE_MULTIPLIER * trustScore

  // Determine interest rate tier
  const apy = trustScore >= 0.8 ? 8.5 : trustScore >= 0.6 ? 10.5 : 12.5

  return {
    creditLine: Math.floor(creditLine),
    trustScore,
    multiplier: BASE_MULTIPLIER,
    apy
  }
}
```

---

## Future Enhancements

The current algorithm is v1. Planned improvements include:

- **Multi-platform aggregation**: Combine revenue from multiple platforms for higher credit lines
- **Engagement metrics**: Factor in follower growth, engagement rates, and audience quality
- **Repayment history**: Adjust trust scores based on on-time repayments
- **Seasonal adjustment**: Account for creator revenue seasonality (Q4 spikes, summer dips)
- **Platform-specific multipliers**: Different base multipliers for different platform stability

---

## Summary

Creator Credit Protocol democratizes access to capital for content creators. By using cryptographically verified revenue data instead of traditional credit metrics, we can serve creators who are often underbanked despite having predictable income streams.

The algorithm is intentionally simple and transparent. Creators know exactly how their credit line is calculated and what they can do to improve their terms.

**Formula**: `Credit Line = Revenue × 4 × Trust Score`

**Trust Score**: Starts at 0.5, increases with account age (+0.1), revenue consistency (+0.2), and growth (+0.1)

**Rates**: 8.5% for premium creators, 10.5% standard, 12.5% for new creators

---

*Built with Reclaim Protocol for verifiable creator economics.*
