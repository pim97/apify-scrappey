// Axios for making HTTP requests
import axios from 'axios';
// Apify SDK for actor functionality
import { Actor } from 'apify';

// Define input interface
interface Input {
    scrappeyApiKey: string;
    url: string;
    requestType?: 'browser' | 'request';
    customHeaders?: Record<string, string>;
    proxy?: string | null;
    browserActions?: any[];
    session?: string | null;
    cookiejar?: any[] | null;
    cookies?: any | null;
    proxyCountry?: string | null;
    localStorage?: Record<string, any> | null;
}

// Initialize the actor
await Actor.init();

try {
    // Get and validate input
    const input = await Actor.getInput<Input>();
    console.log('Actor input:', input);

    if (!input) throw new Error('Input is missing!');
    
    const {
        scrappeyApiKey,
        url,
        requestType = 'browser',
        customHeaders = {},
        browserActions = [],
        session = null,
        cookiejar = null,
        cookies = null,
        proxyCountry = null,
        localStorage = null
    } = input;

    // Validate required inputs
    if (!scrappeyApiKey) {
        throw new Error('Scrappey API key is required!');
    }

    if (!url) {
        throw new Error('Target URL is required!');
    }

    // Configure Scrappey request
    const scrappeyEndpoint = 'https://publisher.scrappey.com/api/v1';
    
    const requestBody = {
        cmd: 'request.get',
        url: url,
        customHeaders,
        browserActions,
        requestType,
        ...(session && { session }),
        ...(cookiejar && { cookiejar }),
        ...(cookies && { cookies }),
        ...(proxyCountry && { proxyCountry }),
        ...(localStorage && { localStorage })
    };

    // Make request to Scrappey
    const response = await axios.post(
        `${scrappeyEndpoint}?key=${scrappeyApiKey}`,
        requestBody
    );

    // Handle potential errors
    if (response.data.error) {
        throw new Error(`Scrappey Error ${response.data.error.code}: ${response.data.error.message}`);
    }

    // Save results to dataset
    await Actor.pushData({
        url: url,
        verified: response.data.solution.verified,
        cookieString: response.data.solution.cookieString,
        responseHeaders: response.data.solution.responseHeaders,
        requestHeaders: response.data.solution.requestHeaders,
        html: response.data.solution.response,
        innerText: response.data.solution.innerText,
        cookies: response.data.solution.cookies,
        ipInfo: response.data.solution.ipInfo,
        data: response.data.solution.data,
        timeElapsed: response.data.solution.timeElapsed,
        session: response.data.solution.session,
        status: response.data.solution.status,
        localStorage: response.data.solution.localStorage,
        timestamp: new Date().toISOString()
    });

} catch (error) {
    if (error instanceof Error) {
        console.error('Error during scraping:', error.message);
    } else {
        console.error('Error during scraping:', String(error));
    }
    throw error;
} finally {
    await Actor.exit();
}
