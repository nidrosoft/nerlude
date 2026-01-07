import { 
    UploadedDocument, 
    ExtractedProject, 
    ExtractedService, 
    ServiceCategory, 
    CostFrequency,
    ProjectType,
    ConfidenceLevel 
} from "@/types";

// Service detection patterns (in a real app, this would be AI-powered)
const servicePatterns: {
    keywords: string[];
    name: string;
    category: ServiceCategory;
    logoUrl?: string;
}[] = [
    { keywords: ['vercel', 'zeit'], name: 'Vercel', category: 'hosting', logoUrl: '/images/services/vercel.svg' },
    { keywords: ['netlify'], name: 'Netlify', category: 'hosting', logoUrl: '/images/services/netlify.svg' },
    { keywords: ['aws', 'amazon'], name: 'AWS', category: 'hosting', logoUrl: '/images/services/aws.svg' },
    { keywords: ['heroku'], name: 'Heroku', category: 'hosting', logoUrl: '/images/services/heroku.svg' },
    { keywords: ['railway'], name: 'Railway', category: 'hosting', logoUrl: '/images/services/railway.svg' },
    { keywords: ['supabase'], name: 'Supabase', category: 'database', logoUrl: '/images/services/supabase.svg' },
    { keywords: ['firebase'], name: 'Firebase', category: 'database', logoUrl: '/images/services/firebase.svg' },
    { keywords: ['mongodb', 'atlas'], name: 'MongoDB Atlas', category: 'database', logoUrl: '/images/services/mongodb.svg' },
    { keywords: ['planetscale'], name: 'PlanetScale', category: 'database', logoUrl: '/images/services/planetscale.svg' },
    { keywords: ['stripe'], name: 'Stripe', category: 'payments', logoUrl: '/images/services/stripe.svg' },
    { keywords: ['clerk'], name: 'Clerk', category: 'auth', logoUrl: '/images/services/clerk.svg' },
    { keywords: ['auth0'], name: 'Auth0', category: 'auth', logoUrl: '/images/services/auth0.svg' },
    { keywords: ['resend'], name: 'Resend', category: 'email', logoUrl: '/images/services/resend.svg' },
    { keywords: ['sendgrid'], name: 'SendGrid', category: 'email', logoUrl: '/images/services/sendgrid.svg' },
    { keywords: ['mailgun'], name: 'Mailgun', category: 'email', logoUrl: '/images/services/mailgun.svg' },
    { keywords: ['posthog'], name: 'PostHog', category: 'analytics', logoUrl: '/images/services/posthog.svg' },
    { keywords: ['mixpanel'], name: 'Mixpanel', category: 'analytics', logoUrl: '/images/services/mixpanel.svg' },
    { keywords: ['sentry'], name: 'Sentry', category: 'monitoring', logoUrl: '/images/services/sentry.svg' },
    { keywords: ['cloudinary'], name: 'Cloudinary', category: 'media', logoUrl: '/images/services/cloudinary.svg' },
    { keywords: ['openai', 'gpt'], name: 'OpenAI', category: 'ai', logoUrl: '/images/services/openai.svg' },
    { keywords: ['namecheap'], name: 'Namecheap', category: 'domain', logoUrl: '/images/services/namecheap.svg' },
    { keywords: ['godaddy'], name: 'GoDaddy', category: 'domain', logoUrl: '/images/services/godaddy.svg' },
    { keywords: ['cloudflare'], name: 'Cloudflare', category: 'domain', logoUrl: '/images/services/cloudflare.svg' },
];

const projectIcons = ["🚀", "💼", "🎯", "📦", "🔥", "⚡", "🎨", "🛠️", "📱", "🌐", "💡", "🎮"];

const generateId = () => Math.random().toString(36).substring(2, 15);

const getRandomConfidence = (): ConfidenceLevel => {
    const rand = Math.random();
    if (rand > 0.7) return 'high';
    if (rand > 0.3) return 'medium';
    return 'low';
};

const detectServiceFromFilename = (filename: string): typeof servicePatterns[0] | null => {
    const lowerName = filename.toLowerCase();
    for (const pattern of servicePatterns) {
        if (pattern.keywords.some(keyword => lowerName.includes(keyword))) {
            return pattern;
        }
    }
    return null;
};

const generateMockCost = (): { amount: number; frequency: CostFrequency } => {
    const amounts = [0, 5, 9.99, 19, 20, 25, 29, 49, 99, 199];
    const frequencies: CostFrequency[] = ['monthly', 'yearly'];
    return {
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
    };
};

const generateMockPlan = (): string => {
    const plans = ['Free', 'Hobby', 'Pro', 'Team', 'Business', 'Enterprise', 'Starter', 'Growth'];
    return plans[Math.floor(Math.random() * plans.length)];
};

const generateMockRenewalDate = (): string => {
    const date = new Date();
    date.setMonth(date.getMonth() + Math.floor(Math.random() * 12) + 1);
    return date.toISOString().split('T')[0];
};

const inferProjectType = (services: ExtractedService[]): ProjectType => {
    const categories = services.map(s => s.category.value);
    if (categories.includes('appstores')) return 'mobile';
    if (categories.includes('hosting') && categories.includes('database')) return 'web';
    if (categories.includes('ai')) return 'ai';
    if (services.length === 1 && categories[0] === 'domain') return 'landing';
    return 'web';
};

const inferProjectName = (services: ExtractedService[], documents: UploadedDocument[]): string => {
    // Try to extract project name from document names
    const docNames = documents.map(d => d.name.toLowerCase());
    
    // Common project name patterns
    const projectPatterns = [
        /([a-z]+)[-_]?(app|web|api|site|project)/i,
        /invoice[-_]?([a-z]+)/i,
        /receipt[-_]?([a-z]+)/i,
    ];

    for (const doc of docNames) {
        for (const pattern of projectPatterns) {
            const match = doc.match(pattern);
            if (match && match[1]) {
                return match[1].charAt(0).toUpperCase() + match[1].slice(1);
            }
        }
    }

    // Fall back to service-based naming
    if (services.length > 0) {
        const mainService = services[0].name.value;
        return `${mainService} Project`;
    }

    return 'New Project';
};

/**
 * Simulates AI extraction from uploaded documents
 * In production, this would call an AI API (OpenAI Vision, Claude, etc.)
 */
export const extractProjectsFromDocuments = async (
    documents: UploadedDocument[]
): Promise<ExtractedProject[]> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Group documents by detected services/projects
    const serviceMap = new Map<string, { service: typeof servicePatterns[0]; docs: UploadedDocument[] }>();
    const unassignedDocs: UploadedDocument[] = [];

    for (const doc of documents) {
        const detectedService = detectServiceFromFilename(doc.name);
        if (detectedService) {
            const existing = serviceMap.get(detectedService.name);
            if (existing) {
                existing.docs.push(doc);
            } else {
                serviceMap.set(detectedService.name, { service: detectedService, docs: [doc] });
            }
        } else {
            unassignedDocs.push(doc);
        }
    }

    // Create extracted services
    const extractedServices: ExtractedService[] = [];
    
    serviceMap.forEach(({ service, docs }) => {
        const cost = generateMockCost();
        extractedServices.push({
            id: generateId(),
            name: { value: service.name, confidence: 'high' },
            category: { value: service.category, confidence: 'high' },
            plan: { value: generateMockPlan(), confidence: getRandomConfidence() },
            costAmount: { value: cost.amount, confidence: getRandomConfidence() },
            costFrequency: { value: cost.frequency, confidence: 'medium' },
            currency: { value: '$', confidence: 'high' },
            renewalDate: { value: generateMockRenewalDate(), confidence: 'medium' },
            logoUrl: service.logoUrl,
        });
    });

    // If no services detected, create some mock ones
    if (extractedServices.length === 0) {
        const mockServices = servicePatterns.slice(0, Math.min(3, Math.ceil(documents.length / 2)));
        for (const service of mockServices) {
            const cost = generateMockCost();
            extractedServices.push({
                id: generateId(),
                name: { value: service.name, confidence: 'medium' },
                category: { value: service.category, confidence: 'medium' },
                plan: { value: generateMockPlan(), confidence: 'low' },
                costAmount: { value: cost.amount, confidence: 'low' },
                costFrequency: { value: cost.frequency, confidence: 'medium' },
                currency: { value: '$', confidence: 'high' },
                renewalDate: { value: generateMockRenewalDate(), confidence: 'low' },
                logoUrl: service.logoUrl,
            });
        }
    }

    // Group services into projects (max 5 projects)
    const maxProjects = Math.min(5, Math.ceil(extractedServices.length / 2));
    const servicesPerProject = Math.ceil(extractedServices.length / maxProjects);
    
    const projects: ExtractedProject[] = [];
    
    for (let i = 0; i < maxProjects && extractedServices.length > 0; i++) {
        const projectServices = extractedServices.splice(0, servicesPerProject);
        const projectDocs = documents.slice(
            i * Math.ceil(documents.length / maxProjects),
            (i + 1) * Math.ceil(documents.length / maxProjects)
        );

        const totalMonthlyCost = projectServices.reduce((sum, s) => {
            const amount = s.costAmount.value;
            const frequency = s.costFrequency.value;
            return sum + (frequency === 'yearly' ? amount / 12 : amount);
        }, 0);

        const projectName = inferProjectName(projectServices, projectDocs);
        const projectType = inferProjectType(projectServices);

        projects.push({
            id: generateId(),
            name: { value: projectName, confidence: projectServices.length > 1 ? 'medium' : 'low' },
            type: { value: projectType, confidence: 'medium' },
            icon: projectIcons[Math.floor(Math.random() * projectIcons.length)],
            services: projectServices,
            documents: projectDocs.map(d => ({ ...d, status: 'processed' as const })),
            totalMonthlyCost,
            isConfirmed: false,
        });
    }

    // If we have leftover services, add them to the first project
    if (extractedServices.length > 0 && projects.length > 0) {
        projects[0].services.push(...extractedServices);
        projects[0].totalMonthlyCost = projects[0].services.reduce((sum, s) => {
            const amount = s.costAmount.value;
            const frequency = s.costFrequency.value;
            return sum + (frequency === 'yearly' ? amount / 12 : amount);
        }, 0);
    }

    return projects;
};
