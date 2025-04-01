## Scrappey API Integration with Apify Actor

A template for scraping data from web pages using the Scrappey API service integrated with an Apify Actor. This actor provides a robust solution for handling complex web scraping scenarios, including sites with anti-bot protection.

![Scrappey API Integration](./assets/scrappey.png)

## Features

- **[Apify SDK](https://docs.apify.com/sdk/js/)** - A toolkit for building [Actors](https://apify.com/actors)
- **[Scrappey API](https://scrappey.com/)** - Advanced web scraping API with anti-bot protection bypass
- **[Input Schema](https://docs.apify.com/platform/actors/development/input-schema)** - Comprehensive input validation
- **[Dataset Storage](https://docs.apify.com/sdk/js/docs/guides/result-storage#dataset)** - Structured data storage
- **[Axios](https://axios-http.com/docs/intro)** - Promise-based HTTP client

## How it works

1. `Actor.getInput()` retrieves the configuration including Scrappey API key and target URL
2. The actor makes a request to Scrappey API with the specified configuration
3. Scrappey handles the web scraping with advanced features like:
   - Browser fingerprint randomization
   - Proxy rotation
   - Cookie and session management
   - JavaScript rendering
4. Results are stored in the Apify dataset

## Input Configuration

```javascript
{
    "scrappeyApiKey": "your-api-key",
    "targetUrl": "https://example.com",
    "requestType": "browser",  // or "request"
    "customHeaders": {},       // optional
    "browserActions": [],      // optional
    "session": null,          // optional
    "proxyCountry": null,     // optional
}
```

## Getting Started

1. Get your Scrappey API key from [scrappey.com](https://scrappey.com)
2. Run the actor locally:
```bash
apify run
```

## Deploy to Apify

### Connect Git Repository

1. Go to [Actor creation page](https://console.apify.com/actors/new)
2. Click on **Link Git Repository** button

### Deploy from Local Machine

1. Login to Apify:
```bash
apify login
```

2. Deploy your actor:
```bash
apify push
```

## Documentation

- [Apify SDK Documentation](https://docs.apify.com/sdk/js)
- [Scrappey API Documentation](https://scrappey.com/docs)
- [Apify Platform Documentation](https://docs.apify.com/platform)
- [Join Apify Discord Community](https://discord.com/invite/jyEM2PRvMU)

## Support

For questions about:
- Apify integration: [Apify Discord](https://discord.com/invite/jyEM2PRvMU)
- Scrappey API: [Scrappey Support](https://scrappey.com/support)
