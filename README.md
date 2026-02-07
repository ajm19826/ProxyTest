# ProxyTest - Web Proxy for Testing

A modern, production-ready web proxy application for testing and research. Access any website securely through our proxy without exposing your IP address.

## Features

✨ **Multi-Tab Support** - Open and manage multiple websites simultaneously  
🔒 **CORS Bypass** - Server-side proxy bypasses CORS restrictions  
📱 **Responsive Design** - Beautiful UI that works on all screen sizes  
🎨 **Modern Interface** - Clean, professional design with smooth animations  
⚡ **Fast & Lightweight** - Minimal footprint, instant loading  
🔄 **Tab Management** - Create, switch, and close tabs effortlessly  
🎯 **URL Validation** - Smart URL detection (accepts `example.com` or `https://example.com`)  

## Tech Stack

- **Frontend**: React 18 + React Router 6 + TypeScript + Vite
- **Backend**: Express.js with server-side proxy
- **Styling**: Tailwind CSS 3 + modern gradient effects
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd proxytest

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Usage

### Homepage
1. Enter a website URL in the input field
2. Click "Access" or press Enter
3. The website will load in the proxy viewer

### Proxy Viewer
- **Create New Tab**: Click the "+ New" button or the "+" icon in the tab bar
- **Switch Tabs**: Click on any tab to view that website
- **Close Tab**: Click the "X" button on a tab to close it
- **Open Original**: Click the "Open" button to visit the website directly
- **Go Back**: Click the "Back" button to return to the homepage
- **Resize**: Drag the right edge to open/close the sidebar (optional)

### URL Format
The proxy accepts URLs in multiple formats:
- Domain only: `example.com`
- With protocol: `https://example.com`
- With path: `example.com/page`
- Full URL: `https://example.com/page/to/content`

## Project Structure

```
├── client/                   # React SPA frontend
│   ├── pages/               # Route components
│   │   ├── Index.tsx        # Homepage with URL input
│   │   ├── Proxy.tsx        # Multi-tab proxy viewer
│   │   └── NotFound.tsx     # 404 page
│   ├── components/ui/       # Pre-built UI components
│   ├── App.tsx              # App entry point with routing
│   └── global.css           # Global styles and theme
├── server/                  # Express backend
│   ├── index.ts             # Server setup
│   └── routes/
│       ├── proxy.ts         # CORS-bypassing proxy endpoint
│       └── demo.ts          # Demo endpoint
├── shared/                  # Shared types
│   └── api.ts               # API interfaces
└── index.html               # HTML entry point
```

## API Endpoints

### GET `/api/proxy` (Backend Only - Not Available on GitHub Pages)
Fetches content from a URL and bypasses CORS restrictions using your own server.

**Query Parameters:**
- `url` (required): The URL to proxy (string)

**Response:**
```json
{
  "content": "<!DOCTYPE html>...",
  "contentType": "text/html; charset=utf-8",
  "url": "https://example.com"
}
```

**Example:**
```bash
curl "http://localhost:5173/api/proxy?url=https://example.com"
```

**Note:** This endpoint is only available when running the backend server locally or on platforms like Netlify/Vercel that support Node.js. On GitHub Pages, the app uses `allorigins.win` as a public CORS proxy service instead.

## Deployment

### GitHub Pages (Static Hosting - Recommended for Free Deployment)

The app is configured to deploy to GitHub Pages automatically using GitHub Actions.

**Setup:**
1. Push your code to the `main` branch
2. Go to your repository Settings → Pages
3. Under "Build and deployment", select:
   - Source: **GitHub Actions**
4. The workflow will automatically build and deploy your site

**Note:** GitHub Pages uses a public CORS proxy service (`allorigins.win`) for bypassing CORS restrictions. This works for most sites but may have rate limits or occasional availability issues.

**Access your deployed site:**
- User/Organization pages: `https://username.github.io`
- Project repository: `https://username.github.io/ProxyTest`

If deploying to a project repository, update the `base` in `vite.config.ts`:
```typescript
const base = "/ProxyTest/"; // Change to your repo name
```

### Local Production Build

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

### Netlify or Vercel (Better CORS Support)

For a more reliable CORS bypass experience with your own backend:

1. **Netlify**: Use the [Netlify MCP integration](#open-mcp-popover) to deploy in one click
2. **Vercel**: Connect your repository and deploy automatically with Node.js support

## Development Commands

```bash
# Start development server (hot reload)
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm typecheck

# Format code
pnpm format.fix

# Build for production
pnpm build
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security & Limitations

⚠️ **Important Notes:**

1. **Website Restrictions** - Some websites may block iframe access or have additional security headers
2. **JavaScript Execution** - The proxy allows JavaScript execution within the iframe sandbox
3. **Responsible Use** - This tool is for testing and research only. Use responsibly and respect website terms of service
4. **No Data Storage** - This application does not store any user data
5. **CORS Policy**:
   - **With Backend** (local/Netlify/Vercel): The server bypasses CORS restrictions at the server level
   - **GitHub Pages**: Uses a public CORS proxy service (allorigins.win), which may have rate limits or availability issues
6. **Rate Limiting** - GitHub Pages deployment uses a third-party CORS proxy that may rate-limit requests
7. **Proxy Service Terms** - When using GitHub Pages, you agree to the terms of the allorigins.win service

### Sandbox Restrictions
The iframe uses a security sandbox that allows:
- ✅ Scripts and popups
- ✅ Forms and navigation
- ✅ Presentations and modals
- ✅ Same-origin requests

## Performance Tips

- **Multiple Tabs**: While you can open many tabs, performance may degrade with too many loaded simultaneously
- **Large Sites**: Very large websites may take longer to load
- **Network**: Connection speed affects proxy response time

## Troubleshooting

### Website Won't Load
- **Issue**: "Unable to Load" error message
- **Solution**: The website may block iframe access or have security restrictions. Try clicking "Retry" or use "Open" to visit directly

### Tab Not Responding
- **Solution**: Click "Retry" button or close and reopen the tab

### Slow Performance
- **Solution**: Close unused tabs or refresh the page

## Contributing

This is a testing utility. For improvements or bug reports, please use the GitHub issue tracker.

## License

This project is open source and available under the MIT License.

## Disclaimer

ProxyTest is provided as-is for testing and research purposes. Users are responsible for their own use of this tool and must comply with all applicable laws and website terms of service. The creators are not responsible for misuse or any consequences arising from its use.

---

**Made with ❤️ using React, Express, and Tailwind CSS**
