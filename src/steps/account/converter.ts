import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';

import { Entities } from '../constants';

export function createAccountEntity(config: IntegrationConfig): Entity {
  const id = `ad_account:${config.adUsername}`;

  return createIntegrationEntity({
    entityData: {
      source: {
        id: id,
        name: 'Microsoft Active Directory Account',
      },
      assign: {
        _key: id,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
      },
    },
  });
}
