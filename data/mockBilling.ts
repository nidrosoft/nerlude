export interface BillingHistoryItem {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: "paid" | "pending" | "failed";
    invoiceUrl?: string;
}

export interface PaymentMethod {
    id: string;
    type: "card" | "paypal" | "bank";
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
}

export const mockBillingHistory: BillingHistoryItem[] = [
    {
        id: "inv-001",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        description: "Pro Plan - Monthly",
        amount: 29.00,
        status: "paid",
        invoiceUrl: "#",
    },
    {
        id: "inv-002",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
        description: "Pro Plan - Monthly",
        amount: 29.00,
        status: "paid",
        invoiceUrl: "#",
    },
    {
        id: "inv-003",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 65).toISOString(),
        description: "Pro Plan - Monthly",
        amount: 29.00,
        status: "paid",
        invoiceUrl: "#",
    },
    {
        id: "inv-004",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 95).toISOString(),
        description: "Starter Plan - Monthly",
        amount: 9.00,
        status: "paid",
        invoiceUrl: "#",
    },
    {
        id: "inv-005",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 125).toISOString(),
        description: "Starter Plan - Monthly",
        amount: 9.00,
        status: "paid",
        invoiceUrl: "#",
    },
];

export const mockPaymentMethods: PaymentMethod[] = [
    {
        id: "pm-001",
        type: "card",
        last4: "4242",
        brand: "Visa",
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true,
    },
    {
        id: "pm-002",
        type: "card",
        last4: "5555",
        brand: "Mastercard",
        expiryMonth: 8,
        expiryYear: 2025,
        isDefault: false,
    },
];

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};
