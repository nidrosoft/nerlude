"use client";

import { useState, useCallback } from "react";
import { Sms, TickCircle, CloseCircle, Refresh, ArrowRight } from "iconsax-react";
import Button from "@/components/Button";
import {
  createEmailAuthLink,
  fetchEmailInvoices,
  openEmailAuthPopup,
  getStoredEmailAccountId,
  storeEmailAccountId,
  EmailSyncError,
  ExtractedEmailService,
} from "../utils/emailSync";

type Props = {
  onServicesExtracted: (services: ExtractedEmailService[]) => void;
  onBack: () => void;
};

type SyncStep = "connect" | "connecting" | "connected" | "syncing" | "complete" | "error";

const EmailSync = ({ onServicesExtracted, onBack }: Props) => {
  const [step, setStep] = useState<SyncStep>("connect");
  const [error, setError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(getStoredEmailAccountId());
  const [syncProgress, setSyncProgress] = useState<string>("");
  const [syncResult, setSyncResult] = useState<{
    emailsScanned: number;
    invoicesFound: number;
    servicesExtracted: number;
  } | null>(null);
  const [extractedServices, setExtractedServices] = useState<ExtractedEmailService[]>([]);
  const [daysBack, setDaysBack] = useState<number>(30);

  const handleConnectEmail = useCallback(async () => {
    setStep("connecting");
    setError(null);

    try {
      const authLink = await createEmailAuthLink();
      
      // Open popup for authentication
      const result = await openEmailAuthPopup(authLink);
      
      if (result.success && result.accountId) {
        setAccountId(result.accountId);
        storeEmailAccountId(result.accountId);
        setStep("connected");
      } else {
        setStep("connect");
        setError("Email connection was cancelled or failed. Please try again.");
      }
    } catch (err) {
      console.error("Email connection error:", err);
      setStep("error");
      if (err instanceof EmailSyncError) {
        setError(err.userMessage);
      } else {
        setError("Failed to connect email. Please try again.");
      }
    }
  }, []);

  const handleSyncEmails = useCallback(async () => {
    if (!accountId) {
      setError("No email account connected. Please connect your email first.");
      return;
    }

    setStep("syncing");
    setError(null);
    setSyncProgress("Fetching emails...");

    try {
      setSyncProgress(`Scanning emails from the last ${daysBack} days...`);
      
      const result = await fetchEmailInvoices(accountId, daysBack);
      
      setSyncProgress("Analysis complete!");
      setSyncResult({
        emailsScanned: result.emailsScanned,
        invoicesFound: result.invoiceEmailsFound,
        servicesExtracted: result.services.length,
      });
      setExtractedServices(result.services);
      setStep("complete");
    } catch (err) {
      console.error("Email sync error:", err);
      setStep("error");
      if (err instanceof EmailSyncError) {
        setError(err.userMessage);
      } else {
        setError("Failed to sync emails. Please try again.");
      }
    }
  }, [accountId, daysBack]);

  const handleContinue = useCallback(() => {
    onServicesExtracted(extractedServices);
  }, [extractedServices, onServicesExtracted]);

  const handleRetry = useCallback(() => {
    setError(null);
    if (accountId) {
      setStep("connected");
    } else {
      setStep("connect");
    }
  }, [accountId]);

  return (
    <div>
      <h2 className="text-body-bold mb-2">Sync from Email</h2>
      <p className="text-small text-t-secondary mb-6">
        Connect your email to automatically find invoices and receipts from your services.
      </p>

      {/* Step: Connect Email */}
      {step === "connect" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-b-surface1 border border-stroke-subtle">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center size-12 rounded-xl bg-violet-500/10">
                <Sms size={24} color="#8B5CF6" variant="Bold" />
              </div>
              <div>
                <h3 className="text-body-bold text-t-primary">Connect Your Email</h3>
                <p className="text-small text-t-secondary">Gmail, Outlook, Yahoo, and more</p>
              </div>
            </div>
            
            <p className="text-small text-t-secondary mb-4">
              We&apos;ll securely connect to your email to find invoices and receipts from services like Vercel, AWS, Stripe, and more. We only read billing-related emails.
            </p>

            <div className="flex items-center gap-3 mb-6">
              <label className="text-small text-t-secondary">Scan emails from the last:</label>
              <select
                value={daysBack}
                onChange={(e) => setDaysBack(Number(e.target.value))}
                className="px-3 py-2 rounded-lg bg-b-surface2 border border-stroke-subtle text-small text-t-primary"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>

            <Button onClick={handleConnectEmail} className="w-full">
              Connect Email Account
            </Button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <CloseCircle size={20} color="#EF4444" variant="Bold" className="shrink-0 mt-0.5" />
                <p className="text-small text-red-500">{error}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step: Connecting */}
      {step === "connecting" && (
        <div className="p-6 rounded-2xl bg-b-surface1 border border-stroke-subtle text-center">
          <div className="flex items-center justify-center size-16 mx-auto mb-4 rounded-2xl bg-violet-500/10">
            <Refresh size={32} color="#8B5CF6" className="animate-spin" />
          </div>
          <h3 className="text-body-bold text-t-primary mb-2">Connecting...</h3>
          <p className="text-small text-t-secondary">
            Please complete the authentication in the popup window.
          </p>
        </div>
      )}

      {/* Step: Connected */}
      {step === "connected" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-b-surface1 border border-stroke-subtle">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center size-12 rounded-xl bg-green-500/10">
                <TickCircle size={24} color="#22C55E" variant="Bold" />
              </div>
              <div>
                <h3 className="text-body-bold text-t-primary">Email Connected</h3>
                <p className="text-small text-t-secondary">Ready to sync invoices</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <label className="text-small text-t-secondary">Scan emails from the last:</label>
              <select
                value={daysBack}
                onChange={(e) => setDaysBack(Number(e.target.value))}
                className="px-3 py-2 rounded-lg bg-b-surface2 border border-stroke-subtle text-small text-t-primary"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>

            <Button onClick={handleSyncEmails} className="w-full">
              Sync Invoices Now
            </Button>
          </div>
        </div>
      )}

      {/* Step: Syncing */}
      {step === "syncing" && (
        <div className="p-6 rounded-2xl bg-b-surface1 border border-stroke-subtle text-center">
          <div className="flex items-center justify-center size-16 mx-auto mb-4 rounded-2xl bg-violet-500/10">
            <Refresh size={32} color="#8B5CF6" className="animate-spin" />
          </div>
          <h3 className="text-body-bold text-t-primary mb-2">Syncing Emails...</h3>
          <p className="text-small text-t-secondary">{syncProgress}</p>
        </div>
      )}

      {/* Step: Complete */}
      {step === "complete" && syncResult && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-b-surface1 border border-stroke-subtle">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center size-12 rounded-xl bg-green-500/10">
                <TickCircle size={24} color="#22C55E" variant="Bold" />
              </div>
              <div>
                <h3 className="text-body-bold text-t-primary">Sync Complete</h3>
                <p className="text-small text-t-secondary">Found {syncResult.servicesExtracted} services</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-b-surface2 text-center">
                <p className="text-h4 text-t-primary">{syncResult.emailsScanned}</p>
                <p className="text-xs text-t-tertiary">Emails Scanned</p>
              </div>
              <div className="p-3 rounded-xl bg-b-surface2 text-center">
                <p className="text-h4 text-t-primary">{syncResult.invoicesFound}</p>
                <p className="text-xs text-t-tertiary">Invoices Found</p>
              </div>
              <div className="p-3 rounded-xl bg-b-surface2 text-center">
                <p className="text-h4 text-violet-500">{syncResult.servicesExtracted}</p>
                <p className="text-xs text-t-tertiary">Services Extracted</p>
              </div>
            </div>

            {extractedServices.length > 0 && (
              <div className="mb-6">
                <h4 className="text-small font-medium text-t-primary mb-3">Extracted Services:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {extractedServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-b-surface2"
                    >
                      <div>
                        <p className="text-small font-medium text-t-primary">{service.name}</p>
                        <p className="text-xs text-t-tertiary">{service.billingCycle}</p>
                      </div>
                      <p className="text-small font-medium text-t-primary">
                        {service.currency} {service.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleContinue} className="w-full">
              Continue to Review
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Error */}
      {step === "error" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center size-12 rounded-xl bg-red-500/10">
                <CloseCircle size={24} color="#EF4444" variant="Bold" />
              </div>
              <div>
                <h3 className="text-body-bold text-red-500">Sync Failed</h3>
                <p className="text-small text-red-400">{error}</p>
              </div>
            </div>

            <Button onClick={handleRetry} isSecondary className="w-full">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-6">
        <Button onClick={onBack} isSecondary>
          Back
        </Button>
      </div>
    </div>
  );
};

export default EmailSync;
