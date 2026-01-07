/**
 * Service Registry Exports
 * 
 * Central export point for service registry and categories.
 */

// Services
export {
    serviceRegistry,
    getServiceById,
    getServiceBySlug,
    getServicesByCategory,
    searchServices,
    getAllCategories,
} from './services';

export type {
    ServiceRegistryItem,
    ServicePlan,
    CredentialField,
} from './services';

// Categories
export {
    serviceCategories,
    getCategoryBySlug,
    getCategoryName,
} from './categories';

export type { CategoryInfo } from './categories';
