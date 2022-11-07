import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

const DEFAULT_BASE_DN = 'cn=root';
const DEFAULT_LDAP_URL = 'ldap://127.0.0.1:1389';
const DEFAULT_USERNAME = 'cn=root';
const DEFAULT_PASSWORD = 'secret';

export const integrationConfig: IntegrationConfig = {
  baseDN: process.env.BASE_DN || DEFAULT_BASE_DN,
  ldapUrl: process.env.LDAP_URL || DEFAULT_LDAP_URL,
  adUsername: process.env.AD_USERNAME || DEFAULT_USERNAME,
  adPassword: process.env.AD_PASSWORD || DEFAULT_PASSWORD,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
