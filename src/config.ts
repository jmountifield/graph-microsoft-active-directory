import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

/**
 * Config fields for the Microsoft Active Directory (on-prem version).
 */
export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  username: {
    type: 'string',
  },
  password: {
    type: 'string',
    mask: true,
  },
  ldapUrl: {
    type: 'string',
  },
  baseDN: {
    type: 'string',
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The URL of the provider LDAP server.
   * ie - ldap://127.0.0.1
   */
  ldapUrl: string;

  /**
   * The Active Directory base Distinguished Name.
   * This is used as the entry point for searches.
   * ie - dc=activedir,dc=com
   */
  baseDN: string;

  /**
   * An Active Directory username.
   */
  username: string;

  /**
   * The Active Directory password.
   */
  password: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (
    !config.ldapUrl ||
    !config.baseDN ||
    !config.username ||
    !config.password
  ) {
    throw new IntegrationValidationError(
      'Config requires all of {ldapUrl, baseDN, username, password}',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
