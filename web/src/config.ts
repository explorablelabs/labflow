import { Auth0ClientOptions } from "@auth0/auth0-spa-js";

export type LabflowAuthType = 'none' | 'auth0';

export interface LabflowOptions {
    authType: LabflowAuthType;
    apiURL: string;

    // Auth type options
    auth0Options?: Auth0ClientOptions;
}

export const labflowOptions: LabflowOptions = {
    authType: parseAuthType(),
    apiURL: parseAPIURL(),

    auth0Options: parseAuth0Options(),
};


// Parse function helpers
function parseAuthType(): LabflowAuthType {
    switch (process.env.REACT_APP_AUTH_TYPE) {
        case 'auth0':
            return 'auth0';
        case 'none':
        case '':
        case null:
        case undefined:
            return 'none';
        default:
            throw 'Please provide either "auth0" or "none" to the environment variable "REACT_APP_AUTH_TYPE"';
    }
}

function parseAPIURL(): string {
    const apiURL = process.env.REACT_APP_AUTH_TYPE;
    if (!apiURL) {
        throw 'Please provide a value for the environment variable "REACT_APP_API_URL"';
    }

    return apiURL;
}

export const auth0Scopes = [
    'read:runs',
    'read:protocols',
    'write:runs',
    'write:protocols',
];

function parseAuth0Options(): Auth0ClientOptions | undefined {
    switch (process.env.REACT_APP_AUTH_TYPE) {
        case 'auth0':
            const domain = process.env.REACT_APP_AUTH0_DOMAIN;
            const client_id = process.env.REACT_APP_AUTH0_CLIENT_ID;
            const redirect_uri = window.location.origin;
            const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
            const scope = auth0Scopes.join(' ');
            if (!domain) {
                throw 'Please provide a value for the environment variable "REACT_APP_AUTH0_DOMAIN"';
            }
            if (!client_id) {
                throw 'Please provide a value for the environment variable "REACT_APP_AUTH0_CLIENT_ID"';
            }
            if (!audience) {
                throw 'Please provide a value for the environment variable "REACT_APP_AUTH0_AUDIENCE"';
            }

            return {
                domain,
                client_id,
                redirect_uri,
                audience,
                scope,
                // onRedirectCallback={onRedirectCallback}
                // WARNING: Storing tokens in the browsers localstorage has some unfortunate security
                //          implications: https://auth0.com/docs/tokens/concepts/token-storage#browser-local-storage-scenarios
                cacheLocation: 'localstorage',
            };
        default:
            return;
    }
}
