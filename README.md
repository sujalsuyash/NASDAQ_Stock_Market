**📈 NASDAQ Stock Market & Analysis Dashboard**

A professional-grade, full-stack financial application providing real-time market data, technical analysis visualizations, and personalized user experiences. This project leverages a microservices-inspired architecture to deliver a high-performance dashboard with secure user authentication and automated data syncing.

_**✨ Key Features**_ -> 

Real-Time Market Indices 📊

A dedicated micro-service on Render specialized in fetching aggregated index data for NASDAQ, S&P 500, and Dow Jones via Yahoo Finance.

Advanced Technical Analysis 📈

Interactive price charts supporting various formats (Line, Area, Bar) and timelines (Weekly/Monthly) powered by Chart.js.

Secure User Wishlists 🔒

Personalized wishlist management using Supabase as a persistent database for saving and tracking favorite stock tickers.

Live Financial News 📰

A dynamic news engine fetching the latest market headlines from the Finnhub API.

Smart Search & Filtering 🔍

Intelligent search functionality providing auto-suggestions while filtering out low-quality listings like OTC or Pink Sheet stocks.

Snapshot Sharing 📸
<img width="1500" height="1368" alt="front-eight-sigma vercel app_frontpage_frontpage html" src="https://github.com/user-attachments/assets/d053f850-de76-48c1-a1ad-0b5df522182b" />
<img width="1500" height="1155" alt="front-eight-sigma vercel app_dashboard_dashboard html" src="https://github.com/user-attachments/assets/e9193f1e-d0c4-4873-8153-e8c5cd95f515" />



Built-in functionality to capture analysis snapshots and share them instantly using the Web Share API.


_**🛠 Technical Stack**_ ->

_Frontend_
Framework: Vanilla JavaScript (ES6+ Modules), CSS3, and HTML5.

Hosting: Vercel for high-performance static delivery.

Visualizations: Chart.js for rendering complex technical market data.

_Backend_
Environment: Node.js & Express.js.

Architecture: Dual-server setup hosted on Render (Main API and Index Widget Service).

Database & Auth
Provider: Supabase (PostgreSQL).

Features: Managed Auth, PostgreSQL Triggers, and Row Level Security (RLS).

_**🌐 API Ecosystem**_ ->

_1. Internal API Service (Render)_
GET /api/search?q={query}: Returns a list of matching ticker symbols and descriptions.

GET /api/profile?symbol={ticker}: Fetches company metadata, sector info, and exchange details.

GET /api/quote?symbol={ticker}: Provides real-time price, change value, and percentage change.

GET /api/candles?symbol={ticker}: Supplies historical data points for technical charting.

CRUD /api/wishlist: Secure endpoint for managing user-saved stocks.

_2. Widget Micro-service (Render)_
GET /api/market: Aggregates live prices and changes for major global indices.

🗄 Database Schema & Automation
The project uses advanced PostgreSQL automation within Supabase to streamline user workflows:

User Profiles: A custom profiles table stores user-specific data including id, username, and email.

Automated Triggers: A PostgreSQL trigger on_auth_user_created fires automatically when a new user joins.

Serverless Sync: The trigger executes the handle_new_user() function, instantly synchronizing user metadata from the Auth layer to the public profile table.

Security Policies: Row Level Security (RLS) ensures authenticated users only manage their own data.

_**⚙️ Local Setup Instructions**_ ->

_1. Install Dependencies_
Navigate to the project directory:

Bash

npm install
_2. Configure Environment_
Create a .env file in the root directory:

Code snippet

FINNHUB_KEY=your_finnhub_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
_3. Launch Services_
Start the main API server and the widget service:

Bash

node dashboard/server.js
node to_run_widget_panel.js
4. Run Frontend
Open frontpage/frontpage.html using a local server (e.g., VS Code Live Server extension).

_**🚀 Deployment Details**_ ->

Vercel (Frontend): Configured via vercel.json to route the root domain directly to the frontpage folder.

Render (Backend): Automated deployment cycles triggered upon every git push to the main branch.

CORS Security: Backend services are optimized to accept secure requests exclusively from the Vercel production domain.
