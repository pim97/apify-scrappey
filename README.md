# Scrappey Web Scraper for Apify

Web scraping actor with automatic Cloudflare bypass, antibot solving, captcha solving, and browser automation. Powered by [Scrappey.com](https://scrappey.com) API.

## Features

- **Cloudflare Bypass** - Automatically bypass Cloudflare protection and challenge pages
- **Antibot Solving** - Handle Datadome, PerimeterX, Kasada, Akamai, AWS WAF, and Incapsula
- **Captcha Solving** - Automatic solving for reCAPTCHA v2/v3, hCaptcha, Turnstile, FunCaptcha, and MTCaptcha
- **Browser Automation** - Full browser control with 20+ action types including click, type, scroll, and JavaScript execution
- **Session Management** - Maintain cookies and state across multiple requests
- **Proxy Support** - Built-in proxy rotation with country selection, premium, and mobile proxy options
- **All HTTP Methods** - Support for GET, POST, PUT, DELETE, and PATCH requests
- **Data Extraction** - CSS selectors, regex patterns, screenshots, and video recording

## Quick Start

### Input Configuration

```json
{
    "scrappeyApiKey": "your-api-key",
    "url": "https://example.com",
    "cmd": "request.get"
}
```

Get your API key at [https://scrappey.com](https://scrappey.com)

### Basic GET Request

```json
{
    "scrappeyApiKey": "your-api-key",
    "url": "https://httpbin.rs/get",
    "cmd": "request.get"
}
```

### POST Request with Data

```json
{
    "scrappeyApiKey": "your-api-key",
    "url": "https://httpbin.rs/post",
    "cmd": "request.post",
    "postData": {
        "username": "user",
        "password": "pass"
    }
}
```

### Browser Automation

```json
{
    "scrappeyApiKey": "your-api-key",
    "url": "https://example.com/login",
    "browserActions": [
        { "type": "wait_for_selector", "cssSelector": "#login-form" },
        { "type": "type", "cssSelector": "#username", "text": "myuser" },
        { "type": "type", "cssSelector": "#password", "text": "mypassword" },
        { "type": "click", "cssSelector": "#submit", "waitForSelector": ".dashboard" }
    ]
}
```

### Automatic Captcha Solving

```json
{
    "scrappeyApiKey": "your-api-key",
    "url": "https://protected-site.com",
    "automaticallySolveCaptchas": true,
    "alwaysLoad": ["recaptcha", "hcaptcha", "turnstile"]
}
```

### Geo-Targeted Scraping

```json
{
    "scrappeyApiKey": "your-api-key",
    "url": "https://example.com",
    "proxyCountry": "UnitedStates",
    "premiumProxy": true
}
```

### Screenshot Capture

```json
{
    "scrappeyApiKey": "your-api-key",
    "url": "https://example.com",
    "screenshot": true,
    "screenshotUpload": true
}
```

## Input Options

### Required

| Option | Type | Description |
|--------|------|-------------|
| `scrappeyApiKey` | string | Your Scrappey API key |
| `url` | string | Target URL to scrape |

### HTTP Method

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cmd` | string | `request.get` | HTTP method: `request.get`, `request.post`, `request.put`, `request.delete`, `request.patch` |
| `postData` | object | - | Request body for POST, PUT, PATCH |
| `requestType` | string | `browser` | `browser` for full rendering, `request` for HTTP-only (faster) |

### Proxy Configuration

| Option | Type | Description |
|--------|------|-------------|
| `proxy` | string | Custom proxy URL (http://user:pass@ip:port) |
| `proxyCountry` | string | Request proxy from country (e.g., UnitedStates, Germany) |
| `premiumProxy` | boolean | Use premium residential proxies |
| `mobileProxy` | boolean | Use mobile carrier proxies |

### Antibot Bypass

| Option | Type | Description |
|--------|------|-------------|
| `cloudflareBypass` | boolean | Enable Cloudflare-specific bypass |
| `datadomeBypass` | boolean | Enable Datadome bypass |
| `kasadaBypass` | boolean | Enable Kasada bypass |

### Captcha Solving

| Option | Type | Description |
|--------|------|-------------|
| `automaticallySolveCaptchas` | boolean | Auto-solve detected captchas |
| `alwaysLoad` | array | Captcha types to load: `recaptcha`, `hcaptcha`, `turnstile` |

### Response Options

| Option | Type | Description |
|--------|------|-------------|
| `screenshot` | boolean | Capture page screenshot |
| `screenshotUpload` | boolean | Upload screenshot to storage |
| `video` | boolean | Record browser session |
| `cssSelector` | string | Extract content by CSS selector |
| `innerText` | boolean | Include page text content |
| `includeImages` | boolean | Include image URLs |
| `includeLinks` | boolean | Include link URLs |

### Session and Cookies

| Option | Type | Description |
|--------|------|-------------|
| `session` | string | Session ID for state persistence |
| `cookiejar` | array | Cookies to set before request |
| `localStorage` | object | Local storage data to set |

## Output Data

```json
{
    "url": "https://example.com",
    "cmd": "request.get",
    "verified": true,
    "statusCode": 200,
    "currentUrl": "https://example.com",
    "userAgent": "Mozilla/5.0...",
    "cookies": [],
    "cookieString": "",
    "responseHeaders": {},
    "requestHeaders": {},
    "html": "<html>...</html>",
    "innerText": "Page content...",
    "ipInfo": {
        "country": "United States",
        "city": "New York"
    },
    "session": "session-id",
    "timeElapsed": 1234,
    "screenshot": "base64...",
    "screenshotUrl": "https://...",
    "timestamp": "2025-01-09T12:00:00.000Z"
}
```

## Browser Actions

Execute automated browser interactions:

| Action | Description |
|--------|-------------|
| `click` | Click an element |
| `type` | Type text into input |
| `wait` | Wait for milliseconds |
| `wait_for_selector` | Wait for element to appear |
| `scroll` | Scroll to element or bottom |
| `hover` | Hover over element |
| `keyboard` | Press keyboard keys |
| `dropdown` | Select dropdown option |
| `execute_js` | Run JavaScript code |
| `solve_captcha` | Solve captcha manually |
| `if` | Conditional execution |
| `while` | Loop execution |
| `goto` | Navigate to URL |

### Example: Login Flow

```json
{
    "browserActions": [
        { "type": "wait_for_selector", "cssSelector": "#login-form" },
        { "type": "type", "cssSelector": "#email", "text": "user@example.com" },
        { "type": "type", "cssSelector": "#password", "text": "password123" },
        { "type": "solve_captcha", "captcha": "turnstile" },
        { "type": "click", "cssSelector": "#submit", "waitForSelector": ".dashboard" },
        { "type": "execute_js", "code": "document.querySelector('.user-name').innerText" }
    ]
}
```

## Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| CODE-0001 | Server overload | Retry with backoff |
| CODE-0002 | Cloudflare blocked | Try different proxy |
| CODE-0007 | Proxy error | Check proxy credentials |
| CODE-0010 | Datadome blocked | Use premium proxy |
| CODE-0029 | Too many sessions | Wait for cleanup |
| CODE-0032 | Turnstile unsolvable | Retry request |

## Local Development

### Setup

```bash
git clone https://github.com/pim97/apify-scrappey
cd apify-scrappey
npm install
```

### Run Locally

```bash
# Set input in storage/key_value_stores/default/INPUT.json
npm run start:dev
```

### Run Tests

```bash
npm test
```

### Build

```bash
npm run build
```

### Deploy to Apify

```bash
apify login
apify push
```

## CI/CD

The repository includes GitHub Actions for automatic deployment:

1. Tests run on every push and pull request
2. Deployment to Apify triggers on:
   - Push to main/master branch
   - New release published

Set `APIFY_TOKEN` secret in your repository settings.

## Resources

- [Scrappey Documentation](https://docs.scrappey.com)
- [Scrappey API Reference](https://docs.scrappey.com/api-reference)
- [Apify SDK Documentation](https://docs.apify.com/sdk/js)
- [Request Builder](https://app.scrappey.com/#/builder)

## Support

- [Scrappey Support](https://scrappey.com/support)
- [GitHub Issues](https://github.com/pim97/apify-scrappey/issues)
- [Apify Discord](https://discord.com/invite/jyEM2PRvMU)

## License

MIT License
