import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';

test('fetch-users', async () => {
  const stepConfig = buildStepTestConfigForStep(Steps.USERS);
  const stepResult = await executeStepWithDependencies(stepConfig);

  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('fetch-groups', async () => {
  const stepConfig = buildStepTestConfigForStep(Steps.GROUPS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-user-group-relationships', async () => {
  const stepConfig = buildStepTestConfigForStep(Steps.GROUP_USER_RELATIONSHIPS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
