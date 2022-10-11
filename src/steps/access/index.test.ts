import {
  executeStepWithDependencies,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

describe('access steps', () => {
  test('fetch-users', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'fetch-users',
    });
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
    const stepConfig = buildStepTestConfigForStep(
      Steps.GROUP_USER_RELATIONSHIPS,
    );
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
