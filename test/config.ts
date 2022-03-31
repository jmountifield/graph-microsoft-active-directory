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

const DEFAULT_CLIENT_DOMAIN = 'cn=root';
const DEFAULT_CLIENT_URL = 'ldap://127.0.0.1:1389';
const DEFAULT_CLIENT_USERNAME = 'cn=root';
const DEFAULT_CLIENT_PASSWORD = 'secret';

export const integrationConfig: IntegrationConfig = {
  clientDomain: process.env.CLIENT_DOMAIN || DEFAULT_CLIENT_DOMAIN,
  clientUrl: process.env.CLIENT_URL || DEFAULT_CLIENT_URL,
  clientUsername: process.env.CLIENT_USERNAME || DEFAULT_CLIENT_USERNAME,
  clientPassword: process.env.CLIENT_PASSWORD || DEFAULT_CLIENT_PASSWORD,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
