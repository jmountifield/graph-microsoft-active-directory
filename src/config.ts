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
  adUsername: {
    type: 'string',
  },
  adPassword: {
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
   * NOTE: this cannot be renamed to username.
   *       Env var USERNAME not usable on Windows
   */
  adUsername: string;

  /**
   * The Active Directory password.
   */
  adPassword: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  // Support old config values.
  // Added Oct 2022.
  // All 4 instances are currently disabled.
  if (!config.ldapUrl && config.clientUrl) {
    config.ldapUrl = config.clientUrl;
    delete config.clientUrl;
  }
  if (!config.baseDN && config.clientDomain) {
    config.baseDN = config.clientDomain;
    delete config.clientDomain;
  }
  if (!config.username && config.clientUsername) {
    config.username = config.clientUsername;
    delete config.clientUsername;
  }
  if (!config.password && config.clientPassword) {
    config.password = config.clientPassword;
    delete config.clientPassword;
  }
  // Support 2nd gen config values
  // Added Nov 2022 due to issue on Windows
  if (!config.adUsername && config.username) {
    config.adUsername = config.username;
    delete config.username;
  }
  if (!config.adPassword && config.password) {
    config.adPassword = config.password;
    delete config.password;
  }

  if (
    !config.ldapUrl ||
    !config.baseDN ||
    !config.adUsername ||
    !config.adPassword
  ) {
    throw new IntegrationValidationError(
      'Config requires all of {ldapUrl, baseDN, adUsername, adPassword}',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
