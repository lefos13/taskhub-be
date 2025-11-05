import * as Sentry from '@sentry/node';

/**
 * Configuration options for Sentry integration
 *
 * @property dsn - The Sentry Data Source Name (DSN) used to identify the project in Sentry.
 * @property environment - The environment name (e.g., 'production', 'development') for Sentry reporting.
 * @property tracesSampleRate - The sample rate for performance tracing (0.0 - 1.0).
 * @property enabled - Whether Sentry integration is enabled.
 */
export interface SentryConfig {
  dsn?: string;
  environment: string;
  tracesSampleRate: number;
  enabled: boolean;
}

/**
 * Initializes Sentry error tracking if enabled and DSN is provided.
 * Reads configuration from environment variables.
 *
 * - SENTRY_DSN: The Sentry project DSN (required for error reporting).
 * - SENTRY_ENVIRONMENT: The environment name for Sentry (optional, falls back to NODE_ENV or 'development').
 * - SENTRY_TRACES_SAMPLE_RATE: The sample rate for performance tracing (optional, defaults to 1.0).
 * - NODE_ENV: Used to determine if the app is running in production.
 *
 * Sentry is only initialized if a DSN is provided and the environment is 'production'.
 *
 * @returns {SentryConfig} The resolved Sentry configuration
 */
export function initializeSentry(): SentryConfig {
  // Build the Sentry configuration from environment variables
  const config: SentryConfig = {
    // Sentry DSN (Data Source Name) - required to send events to Sentry
    dsn: process.env.SENTRY_DSN,
    // Environment name for Sentry (e.g., 'production', 'staging', 'development')
    environment:
      process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    // Performance tracing sample rate (0.0 disables, 1.0 captures all transactions)
    tracesSampleRate: parseFloat(
      process.env.SENTRY_TRACES_SAMPLE_RATE || '1.0',
    ),
    // Enable Sentry only if DSN is provided and running in production
    enabled: !!process.env.SENTRY_DSN && process.env.NODE_ENV === 'production',
  };

  // Initialize Sentry only if enabled and DSN is present
  if (config.enabled && config.dsn) {
    Sentry.init({
      dsn: config.dsn, // Project DSN for Sentry
      environment: config.environment, // Set environment for Sentry events
      tracesSampleRate: config.tracesSampleRate, // Set performance tracing sample rate
    });

    // Log successful initialization
    console.log(`Sentry initialized for ${config.environment} environment`);
  } else {
    // Log when Sentry is not enabled
    console.log('Sentry disabled (no DSN provided or not in production)');
  }

  return config;
}
