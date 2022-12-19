import { IntegrationConfig } from './config';
import { LdapClient, LdapTestAdapter, LdapTSAdapter } from './ldap';
import {
  ActiveDirectoryUser,
  ActiveDirectoryGroup,
  ActiveDirectoryComputer,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 */
export class APIClient {
  constructor(private readonly client: LdapClient) {}

  /**
   * Verifies authentication by doing a bind action.
   */
  public async verifyAuthentication(): Promise<void> {
    return this.client.verifyAuthentication();
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    iteratee: ResourceIteratee<ActiveDirectoryUser>,
  ): Promise<void> {
    await this.client.searchWithPagination(
      '(&(objectClass=user)(objectCategory=person))',
      iteratee,
    );
  }

  /**
   * Iterates each group resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateGroups(
    iteratee: ResourceIteratee<ActiveDirectoryGroup>,
  ): Promise<void> {
    await this.client.searchWithPagination('objectClass=Group', iteratee);
  }

  /**
   * Iterates each device resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateDevices(
    iteratee: ResourceIteratee<ActiveDirectoryComputer>,
  ): Promise<void> {
    await this.client.searchWithPagination('objectClass=Computer', iteratee);
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  if (process.env.NODE_ENV === 'test') {
    return new APIClient(new LdapTestAdapter());
  }

  return new APIClient(
    new LdapTSAdapter({
      baseDN: config.baseDN,
      url: config.ldapUrl,
      username: config.adUsername,
      password: config.adPassword,
    }),
  );
}
