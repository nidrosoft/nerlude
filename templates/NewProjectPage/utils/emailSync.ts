/**
 * Email Sync Utilities
 * Uses Unipile API via Edge Function to sync invoices from user's email
 */

export interface ExtractedEmailService {
  name: string;
  amount: number;
  currency: string;
  billingDate: string;
  billingCycle: string;
  confidence: number;
}

export interface EmailSyncResult {
  emailsScanned: number;
  invoiceEmailsFound: number;
  documentsAnalyzed: number;
  services: ExtractedEmailService[];
}

export interface AuthLinkResult {
  authLink: string;
}

export class EmailSyncError extends Error {
  constructor(
    public code: string,
    message: string,
    public userMessage: string
  ) {
    super(message);
    this.name = "EmailSyncError";
  }
}

/**
 * Create a hosted auth link for the user to connect their email account
 * This opens Unipile's hosted authentication page
 */
export async function createEmailAuthLink(
  successRedirectUrl?: string,
  failureRedirectUrl?: string
): Promise<string> {
  try {
    const response = await fetch("/api/projects/sync-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "create_auth_link",
        successRedirectUrl,
        failureRedirectUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new EmailSyncError(
        "AUTH_LINK_ERROR",
        errorData.error || `HTTP ${response.status}`,
        "Failed to create email connection link. Please try again."
      );
    }

    const result: AuthLinkResult = await response.json();
    
    if (!result.authLink) {
      throw new EmailSyncError(
        "AUTH_LINK_ERROR",
        "No auth link returned",
        "Failed to create email connection link. Please try again."
      );
    }

    return result.authLink;
  } catch (error) {
    if (error instanceof EmailSyncError) {
      throw error;
    }
    throw new EmailSyncError(
      "NETWORK_ERROR",
      error instanceof Error ? error.message : String(error),
      "Network error. Please check your connection and try again."
    );
  }
}

/**
 * Fetch and analyze invoices from a connected email account
 */
export async function fetchEmailInvoices(
  accountId: string,
  daysBack: number = 30
): Promise<EmailSyncResult> {
  try {
    const response = await fetch("/api/projects/sync-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "fetch_invoices",
        accountId,
        daysBack,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new EmailSyncError(
        "FETCH_ERROR",
        errorData.error || `HTTP ${response.status}`,
        "Failed to fetch emails. Please try reconnecting your email account."
      );
    }

    const result: EmailSyncResult = await response.json();
    return result;
  } catch (error) {
    if (error instanceof EmailSyncError) {
      throw error;
    }
    throw new EmailSyncError(
      "NETWORK_ERROR",
      error instanceof Error ? error.message : String(error),
      "Network error. Please check your connection and try again."
    );
  }
}

/**
 * Open the email auth link in a popup window
 * Returns a promise that resolves when the popup is closed
 */
export function openEmailAuthPopup(authLink: string): Promise<{ success: boolean; accountId?: string }> {
  return new Promise((resolve) => {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authLink,
      "email_auth",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      resolve({ success: false });
      return;
    }

    // Check if popup is closed
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        // Check URL params for success/failure
        const urlParams = new URLSearchParams(window.location.search);
        const emailConnected = urlParams.get("email_connected");
        const accountId = urlParams.get("account_id");
        
        resolve({
          success: emailConnected === "true",
          accountId: accountId || undefined,
        });
      }
    }, 500);

    // Timeout after 10 minutes
    setTimeout(() => {
      clearInterval(checkClosed);
      if (!popup.closed) {
        popup.close();
      }
      resolve({ success: false });
    }, 10 * 60 * 1000);
  });
}

/**
 * Get stored email account ID from localStorage
 */
export function getStoredEmailAccountId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("unipile_account_id");
}

/**
 * Store email account ID in localStorage
 */
export function storeEmailAccountId(accountId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("unipile_account_id", accountId);
}

/**
 * Clear stored email account ID
 */
export function clearEmailAccountId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("unipile_account_id");
}
