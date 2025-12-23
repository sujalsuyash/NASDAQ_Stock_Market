📈 NASDAQ Stock Market & Analysis Dashboard
A professional-grade, full-stack financial application providing real-time market data, technical analysis visualizations, and personalized user experiences. This project leverages a microservices-inspired architecture to deliver a high-performance dashboard with secure user authentication and automated data syncing.

1. Key Features
Real-Time Market Indices: A dedicated micro-service on Render specialized in fetching aggregated index data for NASDAQ, S&P 500, and Dow Jones via Yahoo Finance.

Advanced Technical Analysis: Interactive price charts supporting various formats (Line, Area, Bar) and timelines (Weekly/Monthly) powered by Chart.js.

Secure User Wishlists: Personalized watchlist management using Supabase as a persistent database for saving and tracking favorite stock tickers.

Live Financial News: A dynamic news engine fetching the latest market headlines from the Finnhub API.

Smart Search & Filtering: Intelligent search functionality that provides auto-suggestions while filtering out low-quality listings like OTC or Pink Sheet stocks.

Snapshot Sharing: Built-in functionality to capture analysis snapshots and share them instantly using the Web Share API.

2. Technical Stack
Frontend: Vanilla JavaScript (ES6+ Modules), CSS3, and HTML5 hosted on Vercel.

Backends: Dual Node.js/Express servers hosted on Render (Main API and Index Widget Service).

Database & Auth: Supabase (PostgreSQL) for user management and real-time data storage.

Visualizations: Chart.js for rendering technical market data.

DevOps: Absolute path routing and rewrites configured via vercel.json for a seamless single-link experience.

3. API Ecosystem
Internal API Service (Render)
/api/search?q={query}: Returns a list of matching ticker symbols and descriptions.

/api/profile?symbol={ticker}: Fetches company metadata, sector information, and exchange details.

/api/quote?symbol={ticker}: Provides real-time price, change value, and percentage change.

/api/candles?symbol={ticker}: Supplies historical data points for technical charting.

/api/wishlist: Secure endpoint for CRUD operations on user-saved stocks.

Widget Micro-service (Render)
/api/market: Aggregates live prices and changes for major global indices.

4. Database Schema & Automation
The project uses advanced PostgreSQL automation to ensure a smooth user experience within Supabase:

User Profiles: A custom profiles table stores user-specific data including id, username, and email.

Automated Triggers: A PostgreSQL trigger on_auth_user_created fires automatically when a new user joins.

Serverless Sync: The trigger executes the handle_new_user() function, which instantly synchronizes user metadata from the Auth layer to the public profile table.

Security Policies: Row Level Security (RLS) is configured to allow authenticated users to manage only their own wishlist data.

5. Local Setup Instructions

Install Dependencies: Navigate to the project directory and run npm install.

Configure Environment: Create a .env file with your FINNHUB_KEY, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY.

Launch Backends: Start the main server with node dashboard/server.js and the widget service with node to_run_widget_panel.js.

Run Frontend: Open frontpage/frontpage.html using a local server (e.g., Live Server extension).

6. Deployment Details
Vercel (Frontend): Uses a vercel.json rewrite to route the root domain to the frontpage folder.

Render (Backend): Implements automated deployment cycles upon every GitHub push to the main branch.

CORS Security: Both backend services are optimized to accept secure requests from the Vercel production domain.
