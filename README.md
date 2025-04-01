# Apify Scrappey Actor

A powerful web scraping solution that combines Apify's actor infrastructure with Scrappey's advanced anti-detection capabilities. This actor helps you scrape any website while bypassing common anti-bot protections like Cloudflare, Datadome, and PerimeterX.

![Scrappey API Integration](./assets/scrappey1.png)

## 🚀 Key Features

- **Advanced Protection Bypass** - Handles Cloudflare, Datadome, PerimeterX, and other anti-bot systems
- **Session Management** - Maintains persistent browser sessions for efficient scraping
- **Smart Proxy Rotation** - Automatic proxy management with country-specific options
- **Browser Fingerprint Randomization** - Prevents detection through browser fingerprinting
- **Comprehensive Data Extraction** - Captures HTML, cookies, headers, and more
- **Error Handling** - Robust error handling with detailed error codes and messages

## 📋 Input Options

```javascript
{
    "scrappeyApiKey": "your-api-key",
    "url": "https://example.com",
    "requestType": "browser",  // "browser" or "request"
    "customHeaders": {},       // Custom HTTP headers
    "browserActions": [],      // Automated browser actions
    "session": null,          // Session ID for persistent browsing
    "proxyCountry": null,     // Specific country for proxy
    "cookiejar": null,        // Pre-set cookies
    "includeImages": false,   // Include image URLs in response
    "includeLinks": false     // Include link URLs in response
}
```

## 📦 Output Data Structure

The actor stores the following data in the Apify dataset:

```javascript
{
    "url": "scraped-url",
    "verified": true/false,           // Request verification status
    "cookieString": "cookie-string",  // Formatted cookie string
    "responseHeaders": {},            // Response HTTP headers
    "requestHeaders": {},             // Request HTTP headers
    "html": "page-html",             // Raw HTML content
    "innerText": "page-text",        // Page text content
    "cookies": [],                    // Array of cookies
    "ipInfo": {},                    // IP information
    "status": 200,                   // HTTP status code
    "timeElapsed": "1.2s",          // Request duration
    "session": "session-id",         // Session identifier
    "localStorage": {},              // Browser localStorage data
    "timestamp": "ISO-date"         // Timestamp of scrape
}
```

## 🛠️ Common Use Cases

1. **E-commerce Scraping**
   - Product details from protected stores
   - Price monitoring
   - Inventory tracking

2. **Login-Protected Content**
   - Session management for authenticated scraping
   - Cookie handling for maintaining login state

3. **Anti-Bot Protected Sites**
   - Cloudflare challenge bypass
   - Datadome protection handling
   - PerimeterX mitigation

## 💡 Usage Examples

### Basic Scraping
```javascript
{
    "scrappeyApiKey": "your-api-key",
    "url": "https://example.com",
    "requestType": "browser"
}
```

### Session-Based Scraping
```javascript
{
    "scrappeyApiKey": "your-api-key",
    "url": "https://example.com",
    "requestType": "browser",
    "session": "my-session-id",
    "cookiejar": [
        {
            "name": "sessionId",
            "value": "abc123",
            "domain": "example.com",
            "path": "/"
        }
    ]
}
```

### Geo-Targeted Scraping
```javascript
{
    "scrappeyApiKey": "your-api-key",
    "url": "https://example.com",
    "proxyCountry": "UnitedStates",
    "includeImages": true,
    "includeLinks": true
}
```

## ⚠️ Error Handling

The actor handles common error scenarios:

| Code | Description | Solution |
|------|-------------|----------|
| CODE-0001 | Server overload | Retry with backoff |
| CODE-0002 | Cloudflare blocked | Try different proxy |
| CODE-0010 | Datadome blocked | Change proxy country |
| CODE-0029 | Too many sessions | Wait for session cleanup |

## 🚦 Best Practices

1. **Session Management**
   - Use persistent sessions for related requests
   - Clean up sessions when done using `sessions.destroy`

2. **Proxy Usage**
   - Rotate proxies for high-volume scraping
   - Use country-specific proxies for geo-restricted content

3. **Error Handling**
   - Implement exponential backoff for retries
   - Monitor error rates by URL

## 📚 Getting Started

1. **Setup**
   ```bash
   git clone https://github.com/yourusername/apify-scrappey
   cd apify-scrappey
   npm install
   ```

2. **Configuration**
   - Get your Scrappey API key from [scrappey.com](https://scrappey.com)
   - Set up your input.json in the Apify console or locally

3. **Running Locally**
   ```bash
   apify run
   ```

4. **Deployment**
   ```bash
   apify login
   apify push
   ```

## 🔗 Resources

- [Scrappey API Documentation](https://wiki.scrappey.com/getting-started)
- [Apify SDK Documentation](https://docs.apify.com/sdk/js)
- [Example Scraping Scripts](https://github.com/pim97/scrappey-examples)

## 🆘 Support

- Technical issues: [Create GitHub Issue](https://github.com/yourusername/apify-scrappey/issues)
- Scrappey API: [Scrappey Support](https://scrappey.com/support)
- Apify Platform: [Apify Discord](https://discord.com/invite/jyEM2PRvMU)

## 📄 License

ISC License - Feel free to use this actor for your scraping needs!
