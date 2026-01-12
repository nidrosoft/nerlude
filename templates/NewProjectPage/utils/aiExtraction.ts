import { 
    UploadedDocument, 
    ExtractedProject, 
    ExtractedService, 
    ServiceCategory, 
    CostFrequency,
    ProjectType,
    ConfidenceLevel 
} from "@/types";

interface AIExtractedService {
    registryId: string | null;
    detectedName: string;
    confidence: number;
    billing: {
        amount: number | null;
        currency: string;
        frequency: "monthly" | "yearly" | "one-time" | null;
    };
    accountIdentifier: string | null;
    renewalDate: string | null;
    planName: string | null;
    notes: string;
}

interface AIAnalysisResult {
    success: boolean;
    suggestedProjectName: string | null;
    services: AIExtractedService[];
    unmatchedItems: string[];
    documentType: string;
    processingNotes: string;
}

interface APIResponse {
    success: boolean;
    data: AIAnalysisResult;
    serviceRegistry: { id: string; name: string; category: string }[];
    error?: string;
    details?: string;
}

// Custom error class for AI extraction errors
export class AIExtractionError extends Error {
    public code: 'NETWORK_ERROR' | 'AUTH_ERROR' | 'API_ERROR' | 'PARSE_ERROR' | 'TIMEOUT_ERROR' | 'UNKNOWN_ERROR';
    public userMessage: string;
    public details?: string;

    constructor(
        code: AIExtractionError['code'],
        message: string,
        userMessage: string,
        details?: string
    ) {
        super(message);
        this.name = 'AIExtractionError';
        this.code = code;
        this.userMessage = userMessage;
        this.details = details;
    }
}

// Error messages for different scenarios
const getErrorMessage = (code: AIExtractionError['code']): string => {
    switch (code) {
        case 'NETWORK_ERROR':
            return 'Unable to connect to the AI service. Please check your internet connection and try again.';
        case 'AUTH_ERROR':
            return 'Authentication failed. Please sign in again and retry.';
        case 'API_ERROR':
            return 'The AI service encountered an error. Please try again in a few moments.';
        case 'PARSE_ERROR':
            return 'Unable to process the AI response. Please try uploading different documents.';
        case 'TIMEOUT_ERROR':
            return 'The request took too long. Please try with fewer or smaller documents.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}

const projectIcons = ["🚀", "💼", "🎯", "📦", "🔥", "⚡", "🎨", "🛠️", "📱", "🌐", "💡", "🎮"];

const generateId = () => Math.random().toString(36).substring(2, 15);

const confidenceToLevel = (confidence: number): ConfidenceLevel => {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
};

const frequencyToCostFrequency = (frequency: string | null): CostFrequency => {
    if (frequency === 'yearly') return 'yearly';
    if (frequency === 'one-time') return 'one-time';
    return 'monthly';
};

const categoryFromRegistryId = (registryId: string | null, serviceRegistry: { id: string; name: string; category: string }[]): ServiceCategory => {
    if (!registryId) return 'other';
    const service = serviceRegistry.find(s => s.id === registryId);
    return (service?.category as ServiceCategory) || 'other';
};

const inferProjectType = (services: ExtractedService[]): ProjectType => {
    const categories = services.map(s => s.category.value);
    if (categories.includes('distribution')) return 'mobile';
    if (categories.includes('infrastructure')) return 'web';
    if (categories.includes('devtools')) return 'ai';
    if (services.length === 1 && categories[0] === 'domains') return 'landing';
    return 'web';
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/png;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
};

const fileToText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = error => reject(error);
    });
};

const isTextBasedFile = (mimeType: string): boolean => {
    return mimeType === 'text/csv' || 
           mimeType === 'text/plain' ||
           mimeType === 'text/html' ||
           mimeType === 'text/markdown' ||
           mimeType === 'application/json' ||
           mimeType === 'application/vnd.ms-excel' ||
           mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
};

const isPDF = (mimeType: string): boolean => {
    return mimeType === 'application/pdf';
};

const isImage = (mimeType: string): boolean => {
    return mimeType.startsWith('image/');
};

const isWordDocument = (mimeType: string): boolean => {
    return mimeType === 'application/msword' ||
           mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
};

/**
 * Extracts project and service information from uploaded documents using AI
 * Calls the Supabase Edge Function which uses Gemini for analysis
 * Gemini handles PDFs, images, and text files natively - no preprocessing needed
 */
export const extractProjectsFromDocumentsAI = async (
    documents: UploadedDocument[],
    workspaceId?: string
): Promise<ExtractedProject[]> => {
    // Convert files to appropriate format for API transmission
    // Gemini handles PDFs and images natively, so we just send them as base64
    let documentInputs;
    try {
        documentInputs = await Promise.all(
            documents.map(async (doc) => {
                const mimeType = doc.file.type;
                const isText = isTextBasedFile(mimeType);
                
                if (isText) {
                    // For CSV/Excel/HTML/JSON/text files, send as text content
                    console.log(`Sending text file to Gemini: ${doc.name} (${mimeType})`);
                    const textContent = await fileToText(doc.file);
                    return {
                        type: 'text' as const,
                        content: textContent,
                        filename: doc.name,
                        mimeType: mimeType,
                    };
                } else if (isPDF(mimeType)) {
                    // Gemini handles PDFs natively - send as base64
                    console.log(`Sending PDF to Gemini: ${doc.name}`);
                    const base64 = await fileToBase64(doc.file);
                    return {
                        type: 'pdf' as const,
                        content: base64,
                        filename: doc.name,
                        mimeType: mimeType,
                    };
                } else if (isWordDocument(mimeType)) {
                    // Word documents - Gemini can handle these as binary
                    console.log(`Sending Word document to Gemini: ${doc.name}`);
                    const base64 = await fileToBase64(doc.file);
                    return {
                        type: 'pdf' as const, // Treat like PDF for Gemini
                        content: base64,
                        filename: doc.name,
                        mimeType: mimeType,
                    };
                } else if (isImage(mimeType)) {
                    // For images (PNG, JPEG, WebP, GIF, BMP, TIFF), send as base64
                    console.log(`Sending image to Gemini: ${doc.name} (${mimeType})`);
                    const base64 = await fileToBase64(doc.file);
                    return {
                        type: 'image' as const,
                        content: base64,
                        filename: doc.name,
                        mimeType: mimeType,
                    };
                } else {
                    // Unknown type - try as base64 binary
                    console.log(`Sending unknown file type to Gemini: ${doc.name} (${mimeType})`);
                    const base64 = await fileToBase64(doc.file);
                    return {
                        type: 'pdf' as const, // Treat as binary document
                        content: base64,
                        filename: doc.name,
                        mimeType: mimeType,
                    };
                }
            })
        );
    } catch (fileError) {
        throw new AIExtractionError(
            'PARSE_ERROR',
            `Failed to read files: ${fileError}`,
            'Unable to read one or more uploaded files. Please try re-uploading them.',
            fileError instanceof Error ? fileError.message : String(fileError)
        );
    }

    // Call the API route with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

    let response: Response;
    try {
        response = await fetch('/api/projects/analyze-documents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                documents: documentInputs,
                workspaceId,
            }),
            signal: controller.signal,
        });
    } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            throw new AIExtractionError(
                'TIMEOUT_ERROR',
                'Request timed out after 2 minutes',
                getErrorMessage('TIMEOUT_ERROR')
            );
        }
        
        throw new AIExtractionError(
            'NETWORK_ERROR',
            `Network request failed: ${fetchError}`,
            getErrorMessage('NETWORK_ERROR'),
            fetchError instanceof Error ? fetchError.message : String(fetchError)
        );
    } finally {
        clearTimeout(timeoutId);
    }

    // Handle HTTP errors
    if (!response.ok) {
        let errorData: { error?: string; details?: string } = {};
        try {
            errorData = await response.json();
        } catch {
            // Response wasn't JSON
        }

        if (response.status === 401 || response.status === 403) {
            throw new AIExtractionError(
                'AUTH_ERROR',
                `Authentication failed: ${response.status}`,
                getErrorMessage('AUTH_ERROR'),
                errorData.details || errorData.error
            );
        }

        if (response.status >= 500) {
            throw new AIExtractionError(
                'API_ERROR',
                `Server error: ${response.status}`,
                errorData.error || getErrorMessage('API_ERROR'),
                errorData.details
            );
        }

        throw new AIExtractionError(
            'API_ERROR',
            errorData.error || `HTTP ${response.status}`,
            errorData.error || getErrorMessage('API_ERROR'),
            errorData.details
        );
    }

    // Parse response
    let result: APIResponse;
    try {
        result = await response.json();
    } catch (parseError) {
        throw new AIExtractionError(
            'PARSE_ERROR',
            `Failed to parse API response: ${parseError}`,
            getErrorMessage('PARSE_ERROR'),
            parseError instanceof Error ? parseError.message : String(parseError)
        );
    }

    if (!result.success || !result.data) {
        throw new AIExtractionError(
            'API_ERROR',
            result.error || 'Analysis returned unsuccessful',
            result.error || 'The AI was unable to analyze your documents. Please try different files.',
            result.details
        );
    }

    const { data, serviceRegistry } = result;

    // Convert AI-extracted services to ExtractedService format
    const extractedServices: ExtractedService[] = data.services.map((service) => {
        const category = categoryFromRegistryId(service.registryId, serviceRegistry);
        
        return {
            id: generateId(),
            name: { 
                value: service.detectedName, 
                confidence: confidenceToLevel(service.confidence) 
            },
            category: { 
                value: category, 
                confidence: confidenceToLevel(service.confidence) 
            },
            plan: service.planName ? { 
                value: service.planName, 
                confidence: confidenceToLevel(service.confidence * 0.8) 
            } : undefined,
            costAmount: { 
                value: service.billing.amount || 0, 
                confidence: service.billing.amount ? confidenceToLevel(service.confidence) : 'low' 
            },
            costFrequency: { 
                value: frequencyToCostFrequency(service.billing.frequency), 
                confidence: service.billing.frequency ? 'medium' : 'low' 
            },
            currency: { 
                value: service.billing.currency || 'USD', 
                confidence: 'high' 
            },
            renewalDate: service.renewalDate ? { 
                value: service.renewalDate, 
                confidence: 'medium' 
            } : undefined,
            logoUrl: undefined, // Could be added later based on registryId
        };
    });

    // Calculate total monthly cost
    const totalMonthlyCost = extractedServices.reduce((sum, s) => {
        const amount = s.costAmount.value;
        const frequency = s.costFrequency.value;
        return sum + (frequency === 'yearly' ? amount / 12 : amount);
    }, 0);

    // Create a single project with all extracted services
    const projectName = data.suggestedProjectName || 'Imported Project';
    const projectType = inferProjectType(extractedServices);

    const project: ExtractedProject = {
        id: generateId(),
        name: { 
            value: projectName, 
            confidence: data.suggestedProjectName ? 'medium' : 'low' 
        },
        type: { 
            value: projectType, 
            confidence: 'medium' 
        },
        icon: projectIcons[Math.floor(Math.random() * projectIcons.length)],
        services: extractedServices,
        documents: documents.map(d => ({ ...d, status: 'processed' as const })),
        totalMonthlyCost,
        isConfirmed: false,
    };

    // If there are unmatched items, add them as notes
    if (data.unmatchedItems.length > 0) {
        console.log('Unmatched items from AI analysis:', data.unmatchedItems);
    }

    return [project];
};

/**
 * Fallback extraction using filename patterns (used when AI fails)
 */
export const extractProjectsFromDocumentsFallback = async (
    documents: UploadedDocument[]
): Promise<ExtractedProject[]> => {
    // Import the mock extraction as fallback
    const { extractProjectsFromDocuments } = await import('./mockExtraction');
    return extractProjectsFromDocuments(documents);
};

/**
 * Result type for extraction that includes error information
 */
export interface ExtractionResult {
    success: boolean;
    projects: ExtractedProject[];
    error?: {
        code: AIExtractionError['code'];
        message: string;
        details?: string;
    };
}

/**
 * Main extraction function - returns result object with error info instead of throwing
 * This allows the UI to display meaningful error messages to users
 */
export const extractProjectsFromDocuments = async (
    documents: UploadedDocument[],
    workspaceId?: string
): Promise<ExtractionResult> => {
    try {
        console.log('Starting AI extraction for', documents.length, 'documents...');
        const projects = await extractProjectsFromDocumentsAI(documents, workspaceId);
        console.log('AI extraction successful:', projects.length, 'projects extracted');
        
        return {
            success: true,
            projects,
        };
    } catch (error) {
        console.error('AI extraction failed:', error);
        
        // Handle our custom error type
        if (error instanceof AIExtractionError) {
            return {
                success: false,
                projects: [],
                error: {
                    code: error.code,
                    message: error.userMessage,
                    details: error.details,
                },
            };
        }
        
        // Handle generic errors
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return {
            success: false,
            projects: [],
            error: {
                code: 'UNKNOWN_ERROR',
                message: errorMessage,
                details: error instanceof Error ? error.stack : undefined,
            },
        };
    }
};
