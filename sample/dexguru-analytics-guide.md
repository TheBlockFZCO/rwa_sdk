# DexGuru Analytics Dashboard - Chart Implementation Specifications

## 1. Liquidity Chart

### What is a Liquidity Chart?
A liquidity chart visualizes the flow of funds in and out of a liquidity pool over time. It shows when liquidity providers (LPs) add tokens to the pool (increasing liquidity) or remove tokens from the pool (decreasing liquidity). This helps traders and LPs understand:
- Pool stability and growth trends
- Large liquidity events that might impact price
- Overall confidence in the token pair
- Best times to enter/exit as an LP

### How It Will Be Displayed
- **Chart Type**: Combined Area Chart with Line Overlay
- **X-Axis**: Time (hourly/daily intervals)
- **Y-Axis**: USD Value
- **Visual Elements**:
  - **Green Area (Positive)**: Liquidity additions (mints)
  - **Red Area (Negative)**: Liquidity removals (burns)
  - **Blue Line**: Net liquidity change over time
  - **Purple Line**: Cumulative total liquidity

### Data Required from DexGuru API

#### Primary Endpoints:
1. **Mints Endpoint**: `/v1/chain/{chain_id}/tokens/{token_address}/transactions/mints`
   - Provides all liquidity addition events
   - Fields used: `timestamp`, `amount_usd`, `wallet_address`, `pool_address`

2. **Burns Endpoint**: `/v1/chain/{chain_id}/tokens/{token_address}/transactions/burns`
   - Provides all liquidity removal events
   - Fields used: `timestamp`, `amount_usd`, `wallet_address`, `pool_address`

### How API Data Affects the Chart

```
Mints Data Impact:
- Each mint event creates an upward green bar at its timestamp
- amount_usd determines the height of the green area
- Multiple mints in same period are summed
- Affects cumulative liquidity line positively

Burns Data Impact:
- Each burn event creates a downward red bar at its timestamp
- amount_usd determines the depth of the red area
- Multiple burns in same period are summed
- Affects cumulative liquidity line negatively

Example Data Flow:
API Response (Mint) → { timestamp: 1701234567, amount_usd: 50000 } → Green bar at Dec 1, +$50k
API Response (Burn) → { timestamp: 1701234890, amount_usd: 30000 } → Red bar at Dec 1, -$30k
Net Result → Blue line shows +$20k for that period
```

---

## 2. Trading Volume Chart

### What is a Trading Volume Chart?
A trading volume chart displays the amount of token trading activity over time. It shows buy and sell pressure, helping traders identify:
- High activity periods (potential volatility)
- Trading trends (increasing/decreasing interest)
- Buy vs sell pressure balance
- Market sentiment shifts

### How It Will Be Displayed
- **Chart Type**: Stacked Column Chart with Moving Average
- **X-Axis**: Time (5-minute/hourly/daily intervals)
- **Y-Axis**: Volume in USD
- **Visual Elements**:
  - **Green Columns**: Buy volume (token being purchased)
  - **Red Columns**: Sell volume (token being sold)
  - **Yellow Line**: 24-hour moving average
  - **Dots**: Individual large trades (whale activity)

### Data Required from DexGuru API

#### Primary Endpoint:
**Swaps Endpoint**: `/v1/chain/{chain_id}/tokens/{token_address}/transactions/swaps`
- Query parameters: `begin_timestamp`, `end_timestamp`, `limit=100`, `sort_by=timestamp`
- Fields used: 
  - `timestamp`: When the trade occurred
  - `amount_usd`: Size of the trade
  - `token_in_address`: Determines if buy or sell
  - `price_usd`: Token price at trade time
  - `wallet_category`: Trader type (bot/whale/retail)

### How API Data Affects the Chart

```
Buy Trade Detection:
IF token_in_address != {our_token_address}
THEN it's a BUY (someone swapped another token for ours)
→ Add to green column at timestamp

Sell Trade Detection:
IF token_in_address == {our_token_address}
THEN it's a SELL (someone swapped our token for another)
→ Add to red column at timestamp

Volume Aggregation:
- Group swaps by time interval (e.g., hourly)
- Sum amount_usd for all buys in period → Green column height
- Sum amount_usd for all sells in period → Red column height
- Calculate ratio for sentiment indicator

Special Markers:
- If amount_usd > $10,000 → Show as whale dot
- If wallet_category == "bot" → Different visual indicator
```

---

## 3. Price Impact Chart

### What is a Price Impact Chart?
A price impact chart shows how different trade sizes affect the token price. It helps traders understand:
- Liquidity depth at different price levels
- Expected slippage for various trade sizes
- Optimal trade sizing
- Market manipulation risks

### How It Will Be Displayed
- **Chart Type**: Scatter Plot with Trend Line
- **X-Axis**: Trade Size (USD, logarithmic scale)
- **Y-Axis**: Price Change (percentage)
- **Visual Elements**:
  - **Green Dots**: Buys with positive price impact
  - **Red Dots**: Sells with negative price impact
  - **Blue Line**: Average impact trend line
  - **Shaded Area**: 95% confidence interval

### Data Required from DexGuru API

#### Primary Endpoints:
1. **Swaps with Price Data**: `/v1/chain/{chain_id}/tokens/{token_address}/transactions/swaps`
   - Fields: `amount_usd`, `price_usd`, `timestamp`

2. **Market History**: `/v1/chain/{chain_id}/tokens/{token_address}/market/history`
   - Provides price before/after context
   - Fields: `timestamp`, `price`, `volume`

### How API Data Affects the Chart

```
Price Impact Calculation:
1. Get swap at time T with amount_usd = $5000
2. Get price from market history at T-1 minute = $1.00
3. Get price from market history at T+1 minute = $1.02
4. Impact = ((1.02 - 1.00) / 1.00) * 100 = 2%
5. Plot point at (5000, 2%)

Trend Analysis:
- Collect all swap impacts over period
- Group by trade size buckets ($0-1k, $1k-10k, etc.)
- Calculate average impact per bucket
- Draw regression line showing size-to-impact relationship
```

---

## 4. Liquidity Depth Chart

### What is a Liquidity Depth Chart?
A liquidity depth chart (order book visualization) shows available liquidity at different price levels. It indicates:
- Support and resistance levels
- Available liquidity for large trades
- Potential price movements
- Market maker activity

### How It Will Be Displayed
- **Chart Type**: Stepped Area Chart (Depth Chart)
- **X-Axis**: Price levels
- **Y-Axis**: Cumulative liquidity (USD)
- **Visual Elements**:
  - **Green Area**: Buy-side liquidity (bids)
  - **Red Area**: Sell-side liquidity (asks)
  - **Center Line**: Current market price
  - **Gradient**: Darker = more recent liquidity events

### Data Required from DexGuru API

#### Primary Endpoints:
1. **Current Market Data**: `/v1/chain/{chain_id}/tokens/{token_address}/market`
   - Fields: `liquidity_usd`, `price_usd`

2. **Recent Mints/Burns**: Combined data from mints and burns endpoints
   - Used to estimate liquidity distribution

3. **LP Token Data**: `/v1/chain/{chain_id}/lp_tokens/{token_address}/market`
   - Provides pool composition information

### How API Data Affects the Chart

```
Liquidity Distribution Estimation:
1. Total liquidity from market endpoint = $1,000,000
2. Current price = $1.00
3. Recent mints/burns show activity range $0.95-$1.05

Distribution Model:
- 40% liquidity within 2% of current price
- 30% liquidity within 5% of current price  
- 20% liquidity within 10% of current price
- 10% liquidity beyond 10%

Visual Representation:
Price $0.98: Cumulative liquidity = $200,000 (red side)
Price $1.00: Current price marker
Price $1.02: Cumulative liquidity = $200,000 (green side)
```

---

## 5. Wallet Activity Heatmap

### What is a Wallet Activity Heatmap?
A wallet activity heatmap shows when different types of traders are most active. It reveals:
- Peak trading hours by trader type
- Bot vs human trading patterns
- Geographic trading distribution (inferred from timing)
- Optimal trading windows with less competition

### How It Will Be Displayed
- **Chart Type**: Heatmap Grid
- **X-Axis**: Hours of day (0-23)
- **Y-Axis**: Days of week or trader categories
- **Visual Elements**:
  - **Color Intensity**: Transaction volume (light to dark)
  - **Cell Labels**: Average trade size
  - **Row Headers**: Bot/Heavy/Medium/Casual/Noob categories
  - **Tooltips**: Detailed stats on hover

### Data Required from DexGuru API

#### Primary Endpoint:
**All Transactions with Wallet Categories**:
- `/v1/chain/{chain_id}/tokens/{token_address}/transactions`
- Query parameter: `wallet_category` (filter by type)
- Fields used:
  - `timestamp`: Extract hour and day
  - `wallet_category`: Trader classification
  - `amount_usd`: Transaction size
  - `wallet_address`: Unique trader count

### How API Data Affects the Chart

```
Data Processing:
For each transaction:
1. Extract hour from timestamp: new Date(timestamp * 1000).getHours()
2. Extract day from timestamp: new Date(timestamp * 1000).getDay()
3. Group by [wallet_category][day][hour]
4. Sum amount_usd for cell intensity

Example Heatmap Cell:
- Category: "bot"
- Day: Monday
- Hour: 14:00
- Total Volume: $45,000 (dark red - high activity)
- Transaction Count: 234
- Unique Wallets: 12

Pattern Recognition:
- Bots show consistent activity 24/7
- Retail traders peak at 14:00-22:00 UTC
- Whales ("heavy") concentrate activity around market opens
```

---

## 6. TVL (Total Value Locked) Trend Chart

### What is a TVL Trend Chart?
A TVL trend chart tracks the total value locked in liquidity pools over time. It indicates:
- Protocol growth or decline
- Investor confidence levels
- Major liquidity events
- Comparative performance vs other tokens

### How It Will Be Displayed
- **Chart Type**: Area Chart with Annotations
- **X-Axis**: Time (daily/weekly)
- **Y-Axis**: TVL in USD
- **Visual Elements**:
  - **Blue Area**: Total locked value
  - **Green Arrows**: Significant additions (>$100k)
  - **Red Arrows**: Significant removals (>$100k)
  - **Dotted Line**: 7-day moving average
  - **Annotations**: Major events

### Data Required from DexGuru API

#### Primary Endpoints:
1. **Token Market Endpoint**: `/v1/chain/{chain_id}/tokens/{token_address}/market`
   - Field: `liquidity_usd` (current TVL)

2. **Market History**: `/v1/chain/{chain_id}/tokens/{token_address}/market/history`
   - Provides historical liquidity data
   - Query with different time ranges

3. **Mints/Burns**: For event annotations
   - Filter for large transactions (amount_usd > threshold)

### How API Data Affects the Chart

```
TVL Calculation:
- Current TVL = liquidity_usd from market endpoint
- Historical TVL = market history data points

Data Points:
Time T1: liquidity_usd = $500,000
Time T2: liquidity_usd = $750,000
Time T3: liquidity_usd = $700,000

Event Detection:
From mints/burns data:
- If single mint.amount_usd > $100,000 → Add green arrow annotation
- If single burn.amount_usd > $100,000 → Add red arrow annotation
- Include wallet_address in tooltip for whale tracking

Trend Analysis:
- Calculate 7-day moving average
- Show percentage change indicators
- Mark all-time high/low points
```

---

## 7. Trader Distribution Pie Chart

### What is a Trader Distribution Chart?
A trader distribution chart shows the breakdown of trading activity by wallet category. It helps understand:
- Market composition (retail vs bots vs whales)
- Manipulation risks (high bot percentage)
- Market maturity (diverse trader base)
- Target audience for liquidity provision

### How It Will Be Displayed
- **Chart Type**: Donut Chart with Legend
- **Segments**: Wallet categories
- **Visual Elements**:
  - **Segment Size**: Proportional to volume or count
  - **Colors**: 
    - Bot (Gray)
    - Heavy (Purple) 
    - Medium (Blue)
    - Casual (Green)
    - Noob (Yellow)
  - **Center Display**: Total volume or count
  - **Legend**: Shows percentages and absolute values

### Data Required from DexGuru API

#### Primary Endpoint:
**Swaps with Wallet Categories**: `/v1/chain/{chain_id}/tokens/{token_address}/transactions/swaps`
- Query parameter: Can filter by `wallet_category`
- Fields used:
  - `wallet_category`: Classification
  - `amount_usd`: Volume per category
  - `wallet_address`: Unique traders per category

### How API Data Affects the Chart

```
Data Aggregation:
From swap transactions:
- Bot: 150 transactions, $2.5M volume, 8 unique wallets
- Heavy: 20 transactions, $1.8M volume, 5 unique wallets  
- Medium: 85 transactions, $500k volume, 42 unique wallets
- Casual: 340 transactions, $180k volume, 290 unique wallets
- Noob: 1200 transactions, $20k volume, 1150 unique wallets

Chart Display Options:
1. By Volume: Bot (50%), Heavy (36%), Medium (10%), Casual (3.6%), Noob (0.4%)
2. By Count: Noob (67%), Casual (19%), Medium (5%), Bot (8%), Heavy (1%)
3. By Unique Wallets: Shows actual user distribution

Insights:
- High bot volume % = automated trading dominant
- High noob count % = retail interest growing
- Balanced distribution = healthy market
```

---

## Implementation Notes

### API Rate Limits and Optimization
- DexGuru API limit: 5 concurrent requests per second
- Use pagination (`limit` and `offset`) for large datasets
- Cache frequently accessed data (5-minute TTL recommended)
- Batch requests where possible

### Data Refresh Strategies
1. **Real-time critical** (Price, Volume): 30-second intervals
2. **Near real-time** (Liquidity, TVL): 1-minute intervals
3. **Periodic** (Wallet distribution, Heatmaps): 5-minute intervals
4. **Historical** (Trend analysis): 15-minute intervals

### Error Handling
- Implement exponential backoff for rate limit errors
- Provide fallback visualizations with cached data
- Show clear error states when data unavailable
- Log failed requests for debugging

### Performance Considerations
- Aggregate data on backend when possible
- Implement virtual scrolling for large datasets
- Use WebSocket for real-time updates if available
- Progressive loading for historical data