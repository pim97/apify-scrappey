/**
 * Apify Scrappey Actor
 * A powerful web scraping solution using Scrappey.com API
 * Supports Cloudflare bypass, antibot solving, captcha solving, and browser automation
 */

import axios, { AxiosError } from 'axios';
import { Actor } from 'apify';

// ============================================================================
// Type Definitions
// ============================================================================

/** Supported HTTP command types */
type ScrappeyCommand =
    | 'request.get'
    | 'request.post'
    | 'request.put'
    | 'request.delete'
    | 'request.patch';

/** Browser action types */
interface BrowserAction {
    type: string;
    cssSelector?: string;
    text?: string;
    url?: string;
    wait?: number;
    waitForSelector?: string;
    code?: string;
    timeout?: number;
    when?: 'beforeload' | 'afterload';
    ignoreErrors?: boolean;
    [key: string]: unknown;
}

/** Cookie object structure */
interface Cookie {
    name: string;
    value: string;
    domain?: string;
    path?: string;
    expires?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}

/** IP information from response */
interface IpInfo {
    status?: string;
    country?: string;
    countryCode?: string;
    region?: string;
    regionName?: string;
    city?: string;
    zip?: string;
    lat?: number;
    lon?: number;
    timezone?: string;
    isp?: string;
    org?: string;
    as?: string;
    mobile?: boolean;
    proxy?: boolean;
    hosting?: boolean;
    query?: string;
}

/** Actor input configuration */
interface Input {
    // Required
    scrappeyApiKey: string;
    url: string;

    // Command configuration
    cmd?: ScrappeyCommand;
    postData?: Record<string, unknown> | string;

    // Request configuration
    requestType?: 'browser' | 'request';
    customHeaders?: Record<string, string>;
    referer?: string;

    // Proxy configuration
    proxy?: string;
    proxyCountry?: string;
    noProxy?: boolean;
    premiumProxy?: boolean;
    mobileProxy?: boolean;

    // Session management
    session?: string;
    closeAfterUse?: boolean;

    // Browser configuration
    browserActions?: BrowserAction[];
    userAgent?: string;
    locales?: string[];

    // Antibot bypass
    cloudflareBypass?: boolean;
    datadomeBypass?: boolean;
    kasadaBypass?: boolean;
    disableAntiBot?: boolean;

    // Captcha solving
    automaticallySolveCaptchas?: boolean;
    alwaysLoad?: string[];

    // Response options
    screenshot?: boolean;
    screenshotUpload?: boolean;
    video?: boolean;
    cssSelector?: string;
    innerText?: boolean;
    includeImages?: boolean;
    includeLinks?: boolean;
    regex?: string | string[];
    filter?: string[];

    // Cookie and storage
    cookies?: string;
    cookiejar?: Cookie[];
    localStorage?: Record<string, unknown>;

    // Advanced options
    interceptFetchRequest?: string | string[];
    abortOnDetection?: string[];
    whitelistedDomains?: string[];
    blackListedDomains?: string[];
    fullPageLoad?: boolean;
    timeout?: number;
    retries?: number;
}

/** Scrappey API solution response */
interface ScrappeyApiSolution {
    verified?: boolean;
    type?: string;
    response?: string;
    statusCode?: number;
    currentUrl?: string;
    userAgent?: string;
    cookies?: Cookie[];
    cookieString?: string;
    responseHeaders?: Record<string, string>;
    requestHeaders?: Record<string, string>;
    requestBody?: string;
    method?: string;
    ipInfo?: IpInfo;
    innerText?: string;
    localStorageData?: Record<string, unknown>;
    screenshot?: string;
    screenshotUrl?: string;
    videoUrl?: string;
    interceptFetchRequestResponse?: unknown;
    javascriptReturn?: unknown[];
    base64Response?: string;
    listAllRedirectsResponse?: string[];
    additionalCost?: number;
    wsEndpoint?: string;
    detectedAntibotProviders?: {
        providers?: string[];
        confidence?: Record<string, number>;
        primaryProvider?: string;
    };
}

/** Scrappey API response structure */
interface ScrappeyApiResponse {
    solution?: ScrappeyApiSolution;
    timeElapsed?: number;
    data: 'success' | 'error';
    session?: string;
    error?: string;
    info?: string;
}

/** Output data structure */
interface OutputData {
    url: string;
    cmd: string;
    verified: boolean;
    statusCode: number | null;
    currentUrl: string | null;
    userAgent: string | null;
    cookies: Cookie[];
    cookieString: string | null;
    responseHeaders: Record<string, string> | null;
    requestHeaders: Record<string, string> | null;
    html: string | null;
    innerText: string | null;
    ipInfo: IpInfo | null;
    session: string | null;
    timeElapsed: number | null;
    screenshot: string | null;
    screenshotUrl: string | null;
    videoUrl: string | null;
    javascriptReturn: unknown[] | null;
    detectedAntibotProviders: unknown | null;
    localStorage: Record<string, unknown> | null;
    timestamp: string;
}

// ============================================================================
// Constants
// ============================================================================

const SCRAPPEY_API_ENDPOINT = 'https://publisher.scrappey.com/api/v1';

const CMD_MAP: Record<string, ScrappeyCommand> = {
    get: 'request.get',
    post: 'request.post',
    put: 'request.put',
    delete: 'request.delete',
    patch: 'request.patch',
    'request.get': 'request.get',
    'request.post': 'request.post',
    'request.put': 'request.put',
    'request.delete': 'request.delete',
    'request.patch': 'request.patch',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validates and normalizes the command parameter
 */
function normalizeCommand(cmd?: string): ScrappeyCommand {
    if (!cmd) return 'request.get';
    const normalized = CMD_MAP[cmd.toLowerCase()];
    if (!normalized) {
        throw new Error(`Invalid command: ${cmd}. Valid commands are: get, post, put, delete, patch`);
    }
    return normalized;
}

/**
 * Validates URL format
 */
function isValidUrl(urlString: string): boolean {
    try {
        const parsed = new URL(urlString);
        return Boolean(parsed);
    } catch {
        return false;
    }
}

/**
 * Builds the request body for Scrappey API
 */
function buildRequestBody(input: Input): Record<string, unknown> {
    const cmd = normalizeCommand(input.cmd);

    const body: Record<string, unknown> = {
        cmd,
        url: input.url,
    };

    // Add postData for POST/PUT/PATCH requests
    if (['request.post', 'request.put', 'request.patch'].includes(cmd) && input.postData) {
        body.postData = input.postData;
    }

    // Request configuration
    if (input.requestType) body.requestType = input.requestType;
    if (input.customHeaders && Object.keys(input.customHeaders).length > 0) {
        body.customHeaders = input.customHeaders;
    }
    if (input.referer) body.referer = input.referer;

    // Proxy configuration
    if (input.proxy) body.proxy = input.proxy;
    if (input.proxyCountry) body.proxyCountry = input.proxyCountry;
    if (input.noProxy) body.noProxy = input.noProxy;
    if (input.premiumProxy) body.premiumProxy = input.premiumProxy;
    if (input.mobileProxy) body.mobileProxy = input.mobileProxy;

    // Session management
    if (input.session) body.session = input.session;
    if (input.closeAfterUse) body.closeAfterUse = input.closeAfterUse;

    // Browser configuration
    if (input.browserActions && input.browserActions.length > 0) {
        body.browserActions = input.browserActions;
    }
    if (input.userAgent) body.userAgent = input.userAgent;
    if (input.locales && input.locales.length > 0) body.locales = input.locales;

    // Antibot bypass
    if (input.cloudflareBypass) body.cloudflareBypass = input.cloudflareBypass;
    if (input.datadomeBypass) body.datadomeBypass = input.datadomeBypass;
    if (input.kasadaBypass) body.kasadaBypass = input.kasadaBypass;
    if (input.disableAntiBot) body.disableAntiBot = input.disableAntiBot;

    // Captcha solving
    if (input.automaticallySolveCaptchas) {
        body.automaticallySolveCaptchas = input.automaticallySolveCaptchas;
    }
    if (input.alwaysLoad && input.alwaysLoad.length > 0) {
        body.alwaysLoad = input.alwaysLoad;
    }

    // Response options
    if (input.screenshot) body.screenshot = input.screenshot;
    if (input.screenshotUpload) body.screenshotUpload = input.screenshotUpload;
    if (input.video) body.video = input.video;
    if (input.cssSelector) body.cssSelector = input.cssSelector;
    if (input.innerText) body.innerText = input.innerText;
    if (input.includeImages) body.includeImages = input.includeImages;
    if (input.includeLinks) body.includeLinks = input.includeLinks;
    if (input.regex) body.regex = input.regex;
    if (input.filter && input.filter.length > 0) body.filter = input.filter;

    // Cookie and storage
    if (input.cookies) body.cookies = input.cookies;
    if (input.cookiejar && input.cookiejar.length > 0) body.cookiejar = input.cookiejar;
    if (input.localStorage && Object.keys(input.localStorage).length > 0) {
        body.localStorage = input.localStorage;
    }

    // Advanced options
    if (input.interceptFetchRequest) {
        body.interceptFetchRequest = input.interceptFetchRequest;
    }
    if (input.abortOnDetection && input.abortOnDetection.length > 0) {
        body.abortOnDetection = input.abortOnDetection;
    }
    if (input.whitelistedDomains && input.whitelistedDomains.length > 0) {
        body.whitelistedDomains = input.whitelistedDomains;
    }
    if (input.blackListedDomains && input.blackListedDomains.length > 0) {
        body.blackListedDomains = input.blackListedDomains;
    }
    if (input.fullPageLoad) body.fullPageLoad = input.fullPageLoad;
    if (input.timeout) body.timeout = input.timeout;
    if (input.retries) body.retries = input.retries;

    return body;
}

/**
 * Formats error message from Scrappey API response
 */
function formatError(response: ScrappeyApiResponse): string {
    if (response.error) {
        return `Scrappey Error: ${response.error}`;
    }
    return 'Unknown Scrappey API error';
}

// ============================================================================
// Main Actor Logic
// ============================================================================

await Actor.init();

try {
    // Get and validate input
    const input = await Actor.getInput<Input>();

    if (!input) {
        throw new Error('Input is missing!');
    }

    const { scrappeyApiKey, url } = input;

    // Validate required inputs
    if (!scrappeyApiKey) {
        throw new Error('Scrappey API key is required! Get one at https://scrappey.com');
    }

    if (!url) {
        throw new Error('Target URL is required!');
    }

    // Validate URL format
    if (!isValidUrl(url)) {
        throw new Error(`Invalid URL format: ${url}`);
    }

    const cmd = normalizeCommand(input.cmd);
    console.log(`Executing ${cmd} request to: ${url}`);

    // Build request body
    const requestBody = buildRequestBody(input);

    // Make request to Scrappey API
    const response = await axios.post<ScrappeyApiResponse>(
        `${SCRAPPEY_API_ENDPOINT}?key=${scrappeyApiKey}`,
        requestBody,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: input.timeout || 300000, // 5 minute default timeout
        },
    );

    const apiResponse = response.data;

    // Check for API-level errors
    if (apiResponse.data === 'error') {
        throw new Error(formatError(apiResponse));
    }

    const solution = apiResponse.solution || {};

    // Build output data
    const outputData: OutputData = {
        url,
        cmd,
        verified: solution.verified ?? false,
        statusCode: solution.statusCode ?? null,
        currentUrl: solution.currentUrl ?? null,
        userAgent: solution.userAgent ?? null,
        cookies: solution.cookies ?? [],
        cookieString: solution.cookieString ?? null,
        responseHeaders: solution.responseHeaders ?? null,
        requestHeaders: solution.requestHeaders ?? null,
        html: solution.response ?? null,
        innerText: solution.innerText ?? null,
        ipInfo: solution.ipInfo ?? null,
        session: apiResponse.session ?? null,
        timeElapsed: apiResponse.timeElapsed ?? null,
        screenshot: solution.screenshot ?? null,
        screenshotUrl: solution.screenshotUrl ?? null,
        videoUrl: solution.videoUrl ?? null,
        javascriptReturn: solution.javascriptReturn ?? null,
        detectedAntibotProviders: solution.detectedAntibotProviders ?? null,
        localStorage: solution.localStorageData ?? null,
        timestamp: new Date().toISOString(),
    };

    // Save results to dataset
    await Actor.pushData(outputData);

    console.log(`Request completed successfully in ${apiResponse.timeElapsed}ms`);
    console.log(`Status code: ${solution.statusCode}`);
    console.log(`Session: ${apiResponse.session}`);

    if (solution.detectedAntibotProviders?.providers?.length) {
        console.log(`Detected antibot providers: ${solution.detectedAntibotProviders.providers.join(', ')}`);
    }
} catch (error) {
    if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const responseData = error.response?.data;

        console.error(`HTTP Error ${statusCode}:`, responseData);

        if (statusCode === 401 || statusCode === 403) {
            throw new Error('Invalid or expired Scrappey API key');
        }

        throw new Error(`Scrappey API request failed: ${error.message}`);
    }

    if (error instanceof Error) {
        console.error('Error during scraping:', error.message);
        throw error;
    }

    console.error('Unknown error:', String(error));
    throw new Error(String(error));
} finally {
    await Actor.exit();
}
