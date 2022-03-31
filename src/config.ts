import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

/**
 * A type describing the configuration fields required to execute the
 * integration for a specific account in the data provider.
 *
 * When executing the integration in a development environment, these values may
 * be provided in a `.env` file with environment variables. For example:
 *
 * - `CLIENT_USERNAME=123` becomes `instance.config.clientId = '123'`
 * - `CLIENT_PASSWORD=abc` becomes `instance.config.clientSecret = 'abc'`
 *
 * Environment variables are NOT used when the integration is executing in a
 * managed environment. For example, in JupiterOne, users configure
 * `instance.config` in a UI.
 */
export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  clientUrl: {
    type: 'string',
  },
  clientUsername: {
    type: 'string',
  },
  clientPassword: {
    type: 'string',
    mask: true,
  },
  clientDomain: {
    type: 'string',
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The provider API client url used to authenticate requests.
   */
  clientUrl: string;

  /**
   * The provider API client username used to authenticate requests.
   */
  clientUsername: string;

  /**
   * The provider API client password used to authenticate requests.
   */
  clientPassword: string;

  /**
   * The provider API client domain used to authenticate requests.
   */
  clientDomain: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (
    !config.clientUrl ||
    !config.clientUsername ||
    !config.clientPassword ||
    !config.clientDomain
  ) {
    throw new IntegrationValidationError(
      'Config requires all of {clientUrl, clientUsername, clientPassword, clientDomain}',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
