import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accessSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://localhost/api/v1/users
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'ad_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'ad_account_has_user',
        sourceType: 'ad_account',
        _class: RelationshipClass.HAS,
        targetType: 'ad_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://localhost/api/v1/groups
     * PATTERN: Fetch Entities
     */
    id: 'fetch-groups',
    name: 'Fetch Groups',
    entities: [
      {
        resourceName: 'UserGroup',
        _type: 'ad_group',
        _class: ['UserGroup'],
      },
    ],
    relationships: [
      {
        _type: 'ad_account_has_group',
        sourceType: 'ad_account',
        _class: RelationshipClass.HAS,
        targetType: 'ad_group',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://localhost/api/v1/devices
     * PATTERN: Fetch Entities
     */
    id: 'fetch-devices',
    name: 'Fetch Devices',
    entities: [
      {
        resourceName: 'Device',
        _type: 'ad_device',
        _class: ['Device'],
      },
    ],
    relationships: [
      {
        _type: 'ad_account_has_device',
        sourceType: 'ad_account',
        _class: RelationshipClass.HAS,
        targetType: 'ad_device',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Build Child Relationships
     */
    id: 'build-user-group-relationships',
    name: 'Build Group -> User Relationships',
    entities: [],
    relationships: [
      {
        _type: 'ad_group_has_user',
        sourceType: 'ad_group',
        _class: RelationshipClass.HAS,
        targetType: 'ad_user',
      },
    ],
    dependsOn: ['fetch-groups', 'fetch-users'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Build Child Relationships
     */
    id: 'build-group-group-relationships',
    name: 'Build Group -> Group Relationships',
    entities: [],
    relationships: [
      {
        _type: 'ad_group_has_group',
        sourceType: 'ad_group',
        _class: RelationshipClass.HAS,
        targetType: 'ad_group',
      },
    ],
    dependsOn: ['fetch-groups'],
    implemented: true,
  },
];
