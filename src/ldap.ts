import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';
import * as ldapts from 'ldapts';

export interface LdapClient {
  /**
   * Searches active directory for resources using the provided filter.
   *
   * @param filter the active directory search term to use to search for resources, e.g. objectClass=Computer
   * @returns all matching resources
   */
  search<T>(filter: string): Promise<T[]>;

  /**
   * Verifies authentication by doing a bind action.
   */
  verifyAuthentication(): Promise<void>;
}

interface LdapAdapterConfig {
  url: string;
  username: string;
  password: string;
  domain: string;
}

export class LdapTSAdapter implements LdapClient {
  private client: ldapts.Client;
  private config: LdapAdapterConfig;

  constructor(readonly cfg: LdapAdapterConfig) {
    this.config = cfg;
    this.client = new ldapts.Client({
      url: this.config.url,
    });
  }

  async search<T>(filter: string): Promise<T[]> {
    try {
      await this.client.bind(this.config.username, this.config.password);

      const res = await this.client.search(this.config.domain, {
        filter,
      });

      return res.searchEntries as unknown as T[];
    } finally {
      await this.client.unbind();
    }
  }

  async verifyAuthentication(): Promise<void> {
    try {
      await this.client.bind(this.config.username, this.config.password);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: this.config.url,
        status: 500,
        statusText: 'Unable to bind client',
      });
    } finally {
      await this.client.unbind();
    }
  }
}

export class LdapTestAdapter implements LdapClient {
  async search<T>(filter: string): Promise<T[]> {
    if (filter === 'objectCategory=User') {
      return Promise.resolve(require('./steps/access/__testdata__/users.json'));
    } else if (filter === 'objectClass=Group') {
      return Promise.resolve(
        require('./steps/access/__testdata__/groups.json'),
      );
    } else if (filter === 'objectClass=Computer') {
      return Promise.resolve(
        require('./steps/access/__testdata__/computers.json'),
      );
    }

    return Promise.resolve([]);
  }

  async verifyAuthentication(): Promise<void> {
    // Do nothing
  }
}

/**
 * Parses an ldap datetime string into a timestamp using new Date(date).getTime().
 *
 * @param timestamp the ldap datetime string, e.g. 20220311153154.0Z
 * @returns a time value in milliseconds since epoch
 */
export function parseLdapDatetime(timestamp: string): number {
  const [first] = timestamp.split('.');
  const yyyy = first.substring(0, 4);
  const MM = first.substring(4, 6);
  const dd = first.substring(6, 8);
  const hh = first.substring(8, 10);
  const mm = first.substring(10, 12);
  const ss = first.substring(12, 14);

  return new Date(`${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`).getTime();
}
