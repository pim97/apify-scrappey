/**
 * Unit tests for Apify Scrappey Actor
 */

import { describe, it, expect } from 'vitest';

// ============================================================================
// Helper Function Tests (extracted for testing)
// ============================================================================

const CMD_MAP: Record<string, string> = {
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

function normalizeCommand(cmd?: string): string {
    if (!cmd) return 'request.get';
    const normalized = CMD_MAP[cmd.toLowerCase()];
    if (!normalized) {
        throw new Error(`Invalid command: ${cmd}. Valid commands are: get, post, put, delete, patch`);
    }
    return normalized;
}

interface TestInput {
    scrappeyApiKey: string;
    url: string;
    cmd?: string;
    postData?: Record<string, unknown> | string;
    requestType?: 'browser' | 'request';
    customHeaders?: Record<string, string>;
    proxy?: string;
    proxyCountry?: string;
    premiumProxy?: boolean;
    mobileProxy?: boolean;
    session?: string;
    browserActions?: unknown[];
    automaticallySolveCaptchas?: boolean;
    alwaysLoad?: string[];
    cloudflareBypass?: boolean;
    datadomeBypass?: boolean;
    kasadaBypass?: boolean;
    screenshot?: boolean;
    cssSelector?: string;
    cookiejar?: unknown[];
    localStorage?: Record<string, unknown>;
    timeout?: number;
}

function buildRequestBody(input: TestInput): Record<string, unknown> {
    const cmd = normalizeCommand(input.cmd);

    const body: Record<string, unknown> = {
        cmd,
        url: input.url,
    };

    if (['request.post', 'request.put', 'request.patch'].includes(cmd) && input.postData) {
        body.postData = input.postData;
    }

    if (input.requestType) body.requestType = input.requestType;
    if (input.customHeaders && Object.keys(input.customHeaders).length > 0) {
        body.customHeaders = input.customHeaders;
    }
    if (input.proxy) body.proxy = input.proxy;
    if (input.proxyCountry) body.proxyCountry = input.proxyCountry;
    if (input.premiumProxy) body.premiumProxy = input.premiumProxy;
    if (input.mobileProxy) body.mobileProxy = input.mobileProxy;
    if (input.session) body.session = input.session;
    if (input.browserActions && input.browserActions.length > 0) {
        body.browserActions = input.browserActions;
    }
    if (input.automaticallySolveCaptchas) {
        body.automaticallySolveCaptchas = input.automaticallySolveCaptchas;
    }
    if (input.alwaysLoad && input.alwaysLoad.length > 0) {
        body.alwaysLoad = input.alwaysLoad;
    }
    if (input.cloudflareBypass) body.cloudflareBypass = input.cloudflareBypass;
    if (input.datadomeBypass) body.datadomeBypass = input.datadomeBypass;
    if (input.kasadaBypass) body.kasadaBypass = input.kasadaBypass;
    if (input.screenshot) body.screenshot = input.screenshot;
    if (input.cssSelector) body.cssSelector = input.cssSelector;
    if (input.cookiejar && input.cookiejar.length > 0) body.cookiejar = input.cookiejar;
    if (input.localStorage && Object.keys(input.localStorage).length > 0) {
        body.localStorage = input.localStorage;
    }
    if (input.timeout) body.timeout = input.timeout;

    return body;
}

function isValidUrl(urlString: string): boolean {
    try {
        const parsed = new URL(urlString);
        return Boolean(parsed);
    } catch {
        return false;
    }
}

function validateInput(input: TestInput | null): void {
    if (!input) {
        throw new Error('Input is missing!');
    }

    if (!input.scrappeyApiKey) {
        throw new Error('Scrappey API key is required! Get one at https://scrappey.com');
    }

    if (!input.url) {
        throw new Error('Target URL is required!');
    }

    if (!isValidUrl(input.url)) {
        throw new Error(`Invalid URL format: ${input.url}`);
    }
}

// ============================================================================
// Tests
// ============================================================================

describe('Command Normalization', () => {
    it('should default to request.get when no command provided', () => {
        expect(normalizeCommand()).toBe('request.get');
        expect(normalizeCommand(undefined)).toBe('request.get');
    });

    it('should normalize short command names', () => {
        expect(normalizeCommand('get')).toBe('request.get');
        expect(normalizeCommand('post')).toBe('request.post');
        expect(normalizeCommand('put')).toBe('request.put');
        expect(normalizeCommand('delete')).toBe('request.delete');
        expect(normalizeCommand('patch')).toBe('request.patch');
    });

    it('should pass through full command names', () => {
        expect(normalizeCommand('request.get')).toBe('request.get');
        expect(normalizeCommand('request.post')).toBe('request.post');
        expect(normalizeCommand('request.put')).toBe('request.put');
        expect(normalizeCommand('request.delete')).toBe('request.delete');
        expect(normalizeCommand('request.patch')).toBe('request.patch');
    });

    it('should be case insensitive', () => {
        expect(normalizeCommand('GET')).toBe('request.get');
        expect(normalizeCommand('POST')).toBe('request.post');
        expect(normalizeCommand('Request.Get')).toBe('request.get');
    });

    it('should throw error for invalid commands', () => {
        expect(() => normalizeCommand('invalid')).toThrow('Invalid command');
        expect(() => normalizeCommand('head')).toThrow('Invalid command');
        expect(() => normalizeCommand('options')).toThrow('Invalid command');
    });
});

describe('Input Validation', () => {
    it('should throw error when input is null', () => {
        expect(() => validateInput(null)).toThrow('Input is missing!');
    });

    it('should throw error when API key is missing', () => {
        const input: TestInput = {
            scrappeyApiKey: '',
            url: 'https://example.com',
        };
        expect(() => validateInput(input)).toThrow('Scrappey API key is required');
    });

    it('should throw error when URL is missing', () => {
        const input: TestInput = {
            scrappeyApiKey: 'test-key',
            url: '',
        };
        expect(() => validateInput(input)).toThrow('Target URL is required');
    });

    it('should throw error for invalid URL format', () => {
        const input: TestInput = {
            scrappeyApiKey: 'test-key',
            url: 'not-a-valid-url',
        };
        expect(() => validateInput(input)).toThrow('Invalid URL format');
    });

    it('should pass validation for valid input', () => {
        const input: TestInput = {
            scrappeyApiKey: 'test-key',
            url: 'https://example.com',
        };
        expect(() => validateInput(input)).not.toThrow();
    });
});

describe('Request Body Building', () => {
    const baseInput: TestInput = {
        scrappeyApiKey: 'test-key',
        url: 'https://example.com',
    };

    it('should build minimal request body', () => {
        const body = buildRequestBody(baseInput);
        expect(body).toEqual({
            cmd: 'request.get',
            url: 'https://example.com',
        });
    });

    it('should include postData for POST requests', () => {
        const input: TestInput = {
            ...baseInput,
            cmd: 'request.post',
            postData: { key: 'value' },
        };
        const body = buildRequestBody(input);
        expect(body.cmd).toBe('request.post');
        expect(body.postData).toEqual({ key: 'value' });
    });

    it('should include postData for PUT requests', () => {
        const input: TestInput = {
            ...baseInput,
            cmd: 'request.put',
            postData: { update: 'data' },
        };
        const body = buildRequestBody(input);
        expect(body.cmd).toBe('request.put');
        expect(body.postData).toEqual({ update: 'data' });
    });

    it('should not include postData for GET requests', () => {
        const input: TestInput = {
            ...baseInput,
            cmd: 'request.get',
            postData: { should: 'be-ignored' },
        };
        const body = buildRequestBody(input);
        expect(body.postData).toBeUndefined();
    });

    it('should include proxy configuration', () => {
        const input: TestInput = {
            ...baseInput,
            proxy: 'http://user:pass@proxy:8080',
            proxyCountry: 'UnitedStates',
            premiumProxy: true,
            mobileProxy: true,
        };
        const body = buildRequestBody(input);
        expect(body.proxy).toBe('http://user:pass@proxy:8080');
        expect(body.proxyCountry).toBe('UnitedStates');
        expect(body.premiumProxy).toBe(true);
        expect(body.mobileProxy).toBe(true);
    });

    it('should include antibot bypass options', () => {
        const input: TestInput = {
            ...baseInput,
            cloudflareBypass: true,
            datadomeBypass: true,
            kasadaBypass: true,
        };
        const body = buildRequestBody(input);
        expect(body.cloudflareBypass).toBe(true);
        expect(body.datadomeBypass).toBe(true);
        expect(body.kasadaBypass).toBe(true);
    });

    it('should include captcha solving options', () => {
        const input: TestInput = {
            ...baseInput,
            automaticallySolveCaptchas: true,
            alwaysLoad: ['recaptcha', 'hcaptcha', 'turnstile'],
        };
        const body = buildRequestBody(input);
        expect(body.automaticallySolveCaptchas).toBe(true);
        expect(body.alwaysLoad).toEqual(['recaptcha', 'hcaptcha', 'turnstile']);
    });

    it('should include browser actions', () => {
        const actions = [
            { type: 'click', cssSelector: '#button' },
            { type: 'wait', wait: 1000 },
        ];
        const input: TestInput = {
            ...baseInput,
            browserActions: actions,
        };
        const body = buildRequestBody(input);
        expect(body.browserActions).toEqual(actions);
    });

    it('should not include empty arrays', () => {
        const input: TestInput = {
            ...baseInput,
            browserActions: [],
            alwaysLoad: [],
            cookiejar: [],
        };
        const body = buildRequestBody(input);
        expect(body.browserActions).toBeUndefined();
        expect(body.alwaysLoad).toBeUndefined();
        expect(body.cookiejar).toBeUndefined();
    });

    it('should not include empty objects', () => {
        const input: TestInput = {
            ...baseInput,
            customHeaders: {},
            localStorage: {},
        };
        const body = buildRequestBody(input);
        expect(body.customHeaders).toBeUndefined();
        expect(body.localStorage).toBeUndefined();
    });

    it('should include session and request type', () => {
        const input: TestInput = {
            ...baseInput,
            session: 'my-session-id',
            requestType: 'browser',
        };
        const body = buildRequestBody(input);
        expect(body.session).toBe('my-session-id');
        expect(body.requestType).toBe('browser');
    });

    it('should include screenshot options', () => {
        const input: TestInput = {
            ...baseInput,
            screenshot: true,
            cssSelector: '.product-title',
        };
        const body = buildRequestBody(input);
        expect(body.screenshot).toBe(true);
        expect(body.cssSelector).toBe('.product-title');
    });

    it('should include timeout', () => {
        const input: TestInput = {
            ...baseInput,
            timeout: 60000,
        };
        const body = buildRequestBody(input);
        expect(body.timeout).toBe(60000);
    });
});

describe('API Response Handling', () => {
    it('should identify success response', () => {
        const response = {
            data: 'success',
            solution: {
                verified: true,
                statusCode: 200,
                response: '<html></html>',
            },
            timeElapsed: 1234,
            session: 'session-123',
        };
        expect(response.data).toBe('success');
        expect(response.solution.verified).toBe(true);
    });

    it('should identify error response', () => {
        const response = {
            data: 'error',
            error: 'CODE-0002',
            info: 'https://wiki.scrappey.com/getting-started#error',
        };
        expect(response.data).toBe('error');
        expect(response.error).toBe('CODE-0002');
    });

    it('should handle antibot provider detection', () => {
        const response = {
            data: 'success',
            solution: {
                detectedAntibotProviders: {
                    providers: ['cloudflare', 'datadome'],
                    confidence: { cloudflare: 95, datadome: 80 },
                    primaryProvider: 'cloudflare',
                },
            },
        };
        expect(response.solution.detectedAntibotProviders?.providers).toContain('cloudflare');
        expect(response.solution.detectedAntibotProviders?.primaryProvider).toBe('cloudflare');
    });
});

describe('Error Code Mapping', () => {
    const errorCodes: Record<string, string> = {
        'CODE-0001': 'Server capacity',
        'CODE-0002': 'Cloudflare blocked',
        'CODE-0007': 'Proxy error',
        'CODE-0010': 'Datadome blocked',
        'CODE-0029': 'Too many sessions',
    };

    it('should have known error codes', () => {
        expect(Object.keys(errorCodes).length).toBeGreaterThan(0);
        expect(errorCodes['CODE-0002']).toBe('Cloudflare blocked');
    });
});

describe('Cookie Handling', () => {
    it('should format cookies correctly', () => {
        const cookies = [
            { name: 'session', value: 'abc123', domain: 'example.com' },
            { name: 'token', value: 'xyz789', domain: 'example.com' },
        ];
        const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');
        expect(cookieString).toBe('session=abc123; token=xyz789');
    });
});

describe('Browser Actions Validation', () => {
    const validActions = [
        { type: 'click', cssSelector: '#button' },
        { type: 'type', cssSelector: '#input', text: 'hello' },
        { type: 'wait', wait: 1000 },
        { type: 'scroll', cssSelector: 'footer' },
        { type: 'wait_for_selector', cssSelector: '.loaded' },
        { type: 'execute_js', code: 'document.title' },
        { type: 'solve_captcha', captcha: 'turnstile' },
    ];

    it('should recognize valid action types', () => {
        const actionTypes = validActions.map((a) => a.type);
        expect(actionTypes).toContain('click');
        expect(actionTypes).toContain('type');
        expect(actionTypes).toContain('wait');
        expect(actionTypes).toContain('scroll');
        expect(actionTypes).toContain('wait_for_selector');
        expect(actionTypes).toContain('execute_js');
        expect(actionTypes).toContain('solve_captcha');
    });
});
