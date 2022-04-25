import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  GROUPS: 'fetch-groups',
  DEVICES: 'fetch-devices',
  GROUP_USER_RELATIONSHIPS: 'build-user-group-relationships',
  GROUP_GROUP_RELATIONSHIPS: 'build-group-group-relationships',
};

export const Entities: Record<
  'ACCOUNT' | 'GROUP' | 'USER' | 'DEVICE',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'ad_account',
    _class: ['Account'],
    schema: {
      properties: {},
      required: [],
    },
  },
  GROUP: {
    resourceName: 'UserGroup',
    _type: 'ad_group',
    _class: ['UserGroup'],
    schema: {
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        createdOn: { type: 'number' },
        updatedOn: { type: 'number' },
      },
      required: ['name', 'description', 'createdOn', 'updatedOn'],
    },
  },
  USER: {
    resourceName: 'User',
    _type: 'ad_user',
    _class: ['User'],
    schema: {
      properties: {
        username: { type: 'string' },
        active: { type: 'boolean' },
        description: { type: 'string' },
        createdOn: { type: 'number' },
        updatedOn: { type: 'number' },
      },
      required: ['username', 'active', 'description', 'createdOn', 'updatedOn'],
    },
  },
  DEVICE: {
    resourceName: 'Device',
    _type: 'ad_device',
    _class: ['Device'],
    schema: {
      properties: {
        operatingSystem: { type: 'string' },
        operatingSystemVersion: { type: 'string' },
        createdOn: { type: 'number' },
        updatedOn: { type: 'number' },
      },
      required: [
        'operatingSystem',
        'operatingSystemVersion',
        'createdOn',
        'updatedOn',
      ],
    },
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_GROUP'
  | 'ACCOUNT_HAS_DEVICE'
  | 'GROUP_HAS_USER'
  | 'GROUP_HAS_GROUP',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'ad_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_GROUP: {
    _type: 'ad_account_has_group',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
  ACCOUNT_HAS_DEVICE: {
    _type: 'ad_account_has_device',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.DEVICE._type,
  },
  GROUP_HAS_USER: {
    _type: 'ad_group_has_user',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  GROUP_HAS_GROUP: {
    _type: 'ad_group_has_group',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
};
