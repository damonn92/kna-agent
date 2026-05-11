/**
 * KNA SSO orchestration
 *
 * Owns the side-effects of "user just authorized this Mac via the
 * /desktop-login browser page":
 *
 *   1. Persist the sk-kna-... token + linked email in electron-store, so
 *      reinstalls / re-logins can re-bind the same provider account.
 *   2. Upsert an `anthropic` ProviderAccount pointing at
 *      `https://code.wearekna.com` with the token as the API key.
 *   3. Set that account as default so chat / @-agent calls go through
 *      KNA by default.
 *   4. Trigger a gateway debounced restart so the running gateway
 *      picks up the new credentials (lighter than a full re-init).
 *
 * Idempotent: re-applying with the same token updates the existing
 * account in-place (matched by the well-known id `kna-default`).
 */

import { logger } from '../utils/logger';
import { setSetting } from '../utils/store';
import { getProviderService } from './providers/provider-service';
import type { ProviderAccount } from '../../src/lib/providers';
import type { GatewayManager } from '../gateway/manager';

export const KNA_PROVIDER_ACCOUNT_ID = 'kna-default';
const KNA_BASE_URL = 'https://code.wearekna.com';
const KNA_DEFAULT_MODEL = 'claude-sonnet-4-6';

export interface ApplyKnaSsoResult {
  ok: boolean;
  accountId?: string;
  error?: string;
}

/**
 * Persist the KNA token, provision the Anthropic-compatible provider
 * account, set it as default, and schedule a gateway restart.
 *
 * `gatewayManager` is optional — pass it in when invoked from the
 * provider IPC scope (it has the live ref); otherwise the gateway
 * restart is skipped (the caller is expected to handle it).
 */
export async function applyKnaSso(
  token: string,
  email: string,
  gatewayManager?: GatewayManager,
): Promise<ApplyKnaSsoResult> {
  // Validate. The /desktop-login page should already enforce sk-kna-, but
  // we double-check on the main side because the URL came from the OS.
  const trimmedToken = (token || '').trim();
  if (!trimmedToken.startsWith('sk-kna-')) {
    return { ok: false, error: 'Invalid KNA token format (must start with sk-kna-)' };
  }

  const trimmedEmail = (email || '').trim();

  try {
    // 1. Persist in electron-store for subsequent process boots + UI.
    await setSetting('knaToken', trimmedToken);
    await setSetting('knaEmail', trimmedEmail);

    // 2. Upsert the ProviderAccount. Reusing a well-known id keeps the
    //    flow idempotent on re-login (instead of producing duplicate
    //    "KNA Claude (1)" / "KNA Claude (2)" entries).
    const now = new Date().toISOString();
    const account: ProviderAccount = {
      id: KNA_PROVIDER_ACCOUNT_ID,
      vendorId: 'anthropic',
      label: 'KNA Claude',
      authMode: 'api_key',
      baseUrl: KNA_BASE_URL,
      apiProtocol: 'anthropic-messages',
      headers: {},
      model: KNA_DEFAULT_MODEL,
      fallbackModels: [],
      fallbackAccountIds: [],
      enabled: true,
      isDefault: true,
      metadata: trimmedEmail ? { email: trimmedEmail } : {},
      createdAt: now,
      updatedAt: now,
    };

    const providerService = getProviderService();
    await providerService.createAccount(account, trimmedToken);

    // 3. Make sure subsequent chat calls actually route here. createAccount
    //    sets isDefault on the record but the active default pointer is
    //    a separate store entry.
    await providerService.setDefaultAccount(KNA_PROVIDER_ACCOUNT_ID);

    // 4. Light-touch gateway restart so the new key takes effect without
    //    a process bounce. Debounce keeps rapid re-applies cheap.
    try {
      gatewayManager?.debouncedRestart(2000);
    } catch (err) {
      logger.warn('[KNA-SSO] gateway debouncedRestart failed (continuing):', err);
    }

    logger.info(`[KNA-SSO] Applied SSO for ${trimmedEmail || '(no email)'}, account=${KNA_PROVIDER_ACCOUNT_ID}`);
    return { ok: true, accountId: KNA_PROVIDER_ACCOUNT_ID };
  } catch (error) {
    logger.error('[KNA-SSO] Failed to apply SSO:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
