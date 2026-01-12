// Credential type definitions with dynamic fields for each type

export type CredentialTypeId = 
  | 'api_key'
  | 'database'
  | 'login'
  | 'env_vars'
  | 'ssh_key'
  | 'webhook'
  | 'oauth'
  | 'custom';

export interface CredentialFieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'url' | 'textarea';
  placeholder?: string;
  helpText?: string;
  required: boolean;
  sensitive: boolean; // Should be masked/hidden by default
}

export interface CredentialTypeDefinition {
  id: CredentialTypeId;
  label: string;
  description: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  fields: CredentialFieldDefinition[];
}

export const credentialTypes: CredentialTypeDefinition[] = [
  {
    id: 'api_key',
    label: 'API Key',
    description: 'Single API key or token for service authentication',
    icon: 'key',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    iconColor: 'fill-blue-500',
    fields: [
      {
        key: 'key_name',
        label: 'Key Name',
        type: 'text',
        placeholder: 'e.g., STRIPE_SECRET_KEY',
        helpText: 'A descriptive name for this key',
        required: true,
        sensitive: false,
      },
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        placeholder: 'sk_live_xxxxxxxxxxxxx',
        required: true,
        sensitive: true,
      },
      {
        key: 'api_url',
        label: 'API Base URL (optional)',
        type: 'url',
        placeholder: 'https://api.example.com/v1',
        required: false,
        sensitive: false,
      },
    ],
  },
  {
    id: 'database',
    label: 'Database Connection',
    description: 'Database connection string or credentials',
    icon: 'data',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    iconColor: 'fill-purple-500',
    fields: [
      {
        key: 'connection_name',
        label: 'Connection Name',
        type: 'text',
        placeholder: 'e.g., Primary Database',
        required: true,
        sensitive: false,
      },
      {
        key: 'connection_string',
        label: 'Connection String',
        type: 'password',
        placeholder: 'postgresql://user:pass@host:5432/db',
        helpText: 'Full connection URL including credentials',
        required: false,
        sensitive: true,
      },
      {
        key: 'host',
        label: 'Host',
        type: 'text',
        placeholder: 'db.example.com',
        required: false,
        sensitive: false,
      },
      {
        key: 'port',
        label: 'Port',
        type: 'text',
        placeholder: '5432',
        required: false,
        sensitive: false,
      },
      {
        key: 'database_name',
        label: 'Database Name',
        type: 'text',
        placeholder: 'myapp_production',
        required: false,
        sensitive: false,
      },
      {
        key: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'db_user',
        required: false,
        sensitive: false,
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        required: false,
        sensitive: true,
      },
    ],
  },
  {
    id: 'login',
    label: 'Login Credentials',
    description: 'Email/username and password for service login',
    icon: 'user',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    iconColor: 'fill-green-500',
    fields: [
      {
        key: 'service_name',
        label: 'Service/Account Name',
        type: 'text',
        placeholder: 'e.g., Vercel Account',
        required: true,
        sensitive: false,
      },
      {
        key: 'login_url',
        label: 'Login URL',
        type: 'url',
        placeholder: 'https://vercel.com/login',
        required: false,
        sensitive: false,
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
        required: false,
        sensitive: false,
      },
      {
        key: 'username',
        label: 'Username (if different from email)',
        type: 'text',
        placeholder: 'myusername',
        required: false,
        sensitive: false,
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        required: true,
        sensitive: true,
      },
      {
        key: 'two_factor_secret',
        label: '2FA Secret/Backup Codes',
        type: 'textarea',
        placeholder: 'TOTP secret or backup codes',
        helpText: 'Store your 2FA recovery codes here',
        required: false,
        sensitive: true,
      },
    ],
  },
  {
    id: 'env_vars',
    label: 'Environment Variables',
    description: 'Multiple key-value pairs for environment config',
    icon: 'code',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    iconColor: 'fill-amber-500',
    fields: [
      {
        key: 'env_name',
        label: 'Config Name',
        type: 'text',
        placeholder: 'e.g., Railway Environment',
        required: true,
        sensitive: false,
      },
      {
        key: 'env_content',
        label: 'Environment Variables',
        type: 'textarea',
        placeholder: 'DATABASE_URL=postgres://...\nAPI_KEY=sk_live_...\nSECRET_KEY=...',
        helpText: 'Paste your .env file contents or enter KEY=VALUE pairs',
        required: true,
        sensitive: true,
      },
    ],
  },
  {
    id: 'ssh_key',
    label: 'SSH / Deploy Key',
    description: 'SSH private key for server access or deployments',
    icon: 'lock',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    iconColor: 'fill-red-500',
    fields: [
      {
        key: 'key_name',
        label: 'Key Name',
        type: 'text',
        placeholder: 'e.g., Production Server Key',
        required: true,
        sensitive: false,
      },
      {
        key: 'private_key',
        label: 'Private Key',
        type: 'textarea',
        placeholder: '-----BEGIN OPENSSH PRIVATE KEY-----\n...',
        helpText: 'Paste your private key (id_rsa, id_ed25519, etc.)',
        required: true,
        sensitive: true,
      },
      {
        key: 'public_key',
        label: 'Public Key (optional)',
        type: 'textarea',
        placeholder: 'ssh-ed25519 AAAA...',
        required: false,
        sensitive: false,
      },
      {
        key: 'passphrase',
        label: 'Passphrase (if encrypted)',
        type: 'password',
        placeholder: '••••••••',
        required: false,
        sensitive: true,
      },
    ],
  },
  {
    id: 'webhook',
    label: 'Webhook Secret',
    description: 'Webhook URL and signing secret',
    icon: 'link',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    iconColor: 'fill-cyan-500',
    fields: [
      {
        key: 'webhook_name',
        label: 'Webhook Name',
        type: 'text',
        placeholder: 'e.g., Stripe Webhook',
        required: true,
        sensitive: false,
      },
      {
        key: 'webhook_url',
        label: 'Webhook URL',
        type: 'url',
        placeholder: 'https://myapp.com/api/webhooks/stripe',
        required: true,
        sensitive: false,
      },
      {
        key: 'signing_secret',
        label: 'Signing Secret',
        type: 'password',
        placeholder: 'whsec_xxxxxxxxxxxxx',
        helpText: 'Used to verify webhook signatures',
        required: true,
        sensitive: true,
      },
    ],
  },
  {
    id: 'oauth',
    label: 'OAuth Credentials',
    description: 'OAuth client ID and secret for integrations',
    icon: 'shield-tick',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
    iconColor: 'fill-indigo-500',
    fields: [
      {
        key: 'provider_name',
        label: 'Provider Name',
        type: 'text',
        placeholder: 'e.g., Google OAuth',
        required: true,
        sensitive: false,
      },
      {
        key: 'client_id',
        label: 'Client ID',
        type: 'text',
        placeholder: 'xxxxx.apps.googleusercontent.com',
        required: true,
        sensitive: false,
      },
      {
        key: 'client_secret',
        label: 'Client Secret',
        type: 'password',
        placeholder: 'GOCSPX-xxxxxxxxxxxxx',
        required: true,
        sensitive: true,
      },
      {
        key: 'redirect_uri',
        label: 'Redirect URI',
        type: 'url',
        placeholder: 'https://myapp.com/auth/callback',
        required: false,
        sensitive: false,
      },
      {
        key: 'scopes',
        label: 'Scopes',
        type: 'text',
        placeholder: 'openid profile email',
        required: false,
        sensitive: false,
      },
    ],
  },
  {
    id: 'custom',
    label: 'Custom',
    description: 'Any other credential type with custom fields',
    icon: 'setting-2',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20',
    iconColor: 'fill-slate-500',
    fields: [
      {
        key: 'credential_name',
        label: 'Credential Name',
        type: 'text',
        placeholder: 'e.g., License Key',
        required: true,
        sensitive: false,
      },
      {
        key: 'value',
        label: 'Value',
        type: 'textarea',
        placeholder: 'Enter your credential value...',
        required: true,
        sensitive: true,
      },
      {
        key: 'notes',
        label: 'Notes',
        type: 'textarea',
        placeholder: 'Additional notes about this credential...',
        required: false,
        sensitive: false,
      },
    ],
  },
];

export const getCredentialType = (id: CredentialTypeId): CredentialTypeDefinition | undefined => {
  return credentialTypes.find(t => t.id === id);
};
