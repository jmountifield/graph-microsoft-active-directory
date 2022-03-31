import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationMissingKeyError,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { ActiveDirectoryGroup, ActiveDirectoryUser } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Steps, Relationships } from '../constants';
import {
  createAccountGroupRelationship,
  createAccountUserRelationship,
  createDeviceEntity,
  createGroupEntity,
  createGroupGroupRelationship,
  createGroupUserRelationship,
  createUserEntity,
  getGroupId,
} from './converter';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateUsers(async (user) => {
    const userEntity = await jobState.addEntity(createUserEntity(user));

    await jobState.addRelationship(
      createAccountUserRelationship(accountEntity, userEntity),
    );
  });
}

export async function fetchGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateGroups(async (group) => {
    const groupEntity = await jobState.addEntity(createGroupEntity(group));

    await jobState.addRelationship(
      createAccountGroupRelationship(accountEntity, groupEntity),
    );
  });
}

export async function fetchDevices({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateDevices(async (computer) => {
    const deviceEntity = await jobState.addEntity(createDeviceEntity(computer));

    await jobState.addRelationship(
      createAccountGroupRelationship(accountEntity, deviceEntity),
    );
  });
}

export async function buildGroupUserRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.USER._type },
    async (userEntity) => {
      const user = getRawData<ActiveDirectoryUser>(userEntity);

      if (!user) {
        logger.warn(
          { _key: userEntity._key },
          'Could not get raw data for user entity',
        );

        return;
      }

      if (!user.memberOf) {
        return;
      }

      const userGroups =
        typeof user.memberOf === 'string' ? [user.memberOf] : user.memberOf;

      for (const groupId of userGroups) {
        const groupEntity = await jobState.findEntity(getGroupId(groupId));

        if (!groupEntity) {
          throw new IntegrationMissingKeyError(
            `Expected group with key to exist (key=${groupId})`,
          );
        }

        await jobState.addRelationship(
          createGroupUserRelationship(groupEntity, userEntity),
        );
      }
    },
  );
}

export async function buildGroupGroupRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.GROUP._type },
    async (groupEntity) => {
      const group = getRawData<ActiveDirectoryGroup>(groupEntity);

      if (!group) {
        logger.warn(
          { _key: groupEntity._key },
          'Could not get raw data for group entity',
        );

        return;
      }

      if (!group.memberOf) {
        return;
      }

      const groupGroups =
        typeof group.memberOf === 'string' ? [group.memberOf] : group.memberOf;

      for (const memberOf of groupGroups) {
        const sourceGroupId = getGroupId(memberOf);
        const sourceGroupEntity = await jobState.findEntity(sourceGroupId);

        if (!sourceGroupEntity) {
          throw new IntegrationMissingKeyError(
            `Expected group with key to exist (key=${sourceGroupId})`,
          );
        }

        await jobState.addRelationship(
          createGroupGroupRelationship(sourceGroupEntity, groupEntity),
        );
      }
    },
  );
}

export const accessSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.GROUPS,
    name: 'Fetch Groups',
    entities: [Entities.GROUP],
    relationships: [Relationships.ACCOUNT_HAS_GROUP],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchGroups,
  },
  {
    id: Steps.DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.DEVICE],
    relationships: [Relationships.ACCOUNT_HAS_DEVICE],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchDevices,
  },
  {
    id: Steps.GROUP_USER_RELATIONSHIPS,
    name: 'Build Group -> User Relationships',
    entities: [],
    relationships: [Relationships.GROUP_HAS_USER],
    dependsOn: [Steps.GROUPS, Steps.USERS],
    executionHandler: buildGroupUserRelationships,
  },
  {
    id: Steps.GROUP_GROUP_RELATIONSHIPS,
    name: 'Build Group -> Group Relationships',
    entities: [],
    relationships: [Relationships.GROUP_HAS_GROUP],
    dependsOn: [Steps.GROUPS],
    executionHandler: buildGroupGroupRelationships,
  },
];
