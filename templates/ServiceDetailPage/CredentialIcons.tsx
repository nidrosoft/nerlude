"use client";

interface IconProps {
  className?: string;
}

export const ApiKeyIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <g clipPath="url(#clip0_api_key)">
      <path d="M19.5697 4.7002C19.5697 6.1902 16.1797 7.4002 11.9997 7.4002C7.81969 7.4002 4.42969 6.1902 4.42969 4.7002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.5697 9.03027C19.5697 10.5203 16.1797 11.7303 11.9997 11.7303C7.81969 11.7303 4.42969 10.5203 4.42969 9.03027" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.42969 4.7C4.42969 3.21 7.81969 2 11.9997 2C16.1797 2 19.5697 3.21 19.5697 4.7V13.35C19.5697 14.84 18.9997 16 11.9997 16.05C4.99969 16.1 4.42969 14.84 4.42969 13.35V9.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 16.0498V18.7498" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.6201 20.3799H20.6501" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.34961 20.3799H10.3796" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.1502 19.2303C13.7802 19.8603 13.7802 20.8903 13.1502 21.5203C12.5202 22.1503 11.4902 22.1503 10.8602 21.5203C10.2302 20.8903 10.2302 19.8603 10.8602 19.2303C11.4902 18.6003 12.5202 18.6003 13.1502 19.2303Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_api_key">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const DatabaseIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <g clipPath="url(#clip0_database)">
      <path d="M2.25977 8.32031H21.2098" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.57977 20.95H6.25977C4.04977 20.95 2.25977 19.16 2.25977 16.95V6C2.25977 3.79 4.04977 2 6.25977 2H17.2098C19.4198 2 21.2098 3.79 21.2098 6V11.47" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21.7398 20.3101C21.7398 21.2401 19.6198 22.0001 16.9998 22.0001C14.3798 22.0001 12.2598 21.2401 12.2598 20.3101V15.2701C12.2598 14.3401 14.3798 13.5801 16.9998 13.5801C19.6198 13.5801 21.7398 14.3401 21.7398 15.2701V20.3101Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21.7398 16.6201C21.7398 17.5501 19.6198 18.3101 16.9998 18.3101C14.3798 18.3101 12.2598 17.5501 12.2598 16.6201" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_database">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const LoginIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8.8999 7.56023C9.2099 3.96023 11.0599 2.49023 15.1099 2.49023H15.2399C19.7099 2.49023 21.4999 4.28023 21.4999 8.75023V15.2702C21.4999 19.7402 19.7099 21.5302 15.2399 21.5302H15.1099C11.0899 21.5302 9.2399 20.0802 8.9099 16.5402" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12H14.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.6499 8.65039L15.9999 12.0004L12.6499 15.3504" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const EnvVarsIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8.47 5.47a.75.75 0 0 1 1.06 1.06L4.56 11.5l4.97 4.97a.75.75 0 1 1-1.06 1.06l-5.5-5.5a.75.75 0 0 1 0-1.06l5.5-5.5zm7.06 0a.75.75 0 0 0-1.06 1.06l4.97 4.97-4.97 4.97a.75.75 0 1 0 1.06 1.06l5.5-5.5a.75.75 0 0 0 0-1.06l-5.5-5.5z" fill="currentColor"/>
  </svg>
);

export const SshKeyIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2a5 5 0 0 1 5 5v2.126c1.725.444 3 2.01 3 3.874v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5c0-1.864 1.275-3.43 3-3.874V7a5 5 0 0 1 5-5zm0 11a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1zm0-9a3 3 0 0 0-3 3v2h6V7a3 3 0 0 0-3-3z" fill="currentColor"/>
  </svg>
);

export const WebhookIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <g clipPath="url(#clip0_webhook)">
      <path d="M9.19918 16.5698H8.17918C7.19918 16.5698 6.40918 15.7798 6.40918 14.7998V13.7798C6.40918 12.7998 7.19918 12.0098 8.17918 12.0098H9.19918C10.1792 12.0098 10.9692 12.7998 10.9692 13.7798V14.7998C10.9692 15.7798 10.1792 16.5698 9.19918 16.5698ZM8.17918 13.5098C8.02918 13.5098 7.90918 13.6298 7.90918 13.7798V14.7998C7.90918 14.9498 8.02918 15.0698 8.17918 15.0698H9.19918C9.34918 15.0698 9.46918 14.9498 9.46918 14.7998V13.7798C9.46918 13.6298 9.34918 13.5098 9.19918 13.5098H8.17918Z" fill="currentColor"/>
      <path d="M14.8095 10.9599H13.7895C12.8095 10.9599 12.0195 10.1699 12.0195 9.1899V8.1699C12.0195 7.1899 12.8095 6.3999 13.7895 6.3999H14.8095C15.7895 6.3999 16.5795 7.1899 16.5795 8.1699V9.1899C16.5795 10.1699 15.7895 10.9599 14.8095 10.9599ZM13.7895 7.8999C13.6395 7.8999 13.5195 8.0199 13.5195 8.1699V9.1899C13.5195 9.3399 13.6395 9.4599 13.7895 9.4599H14.8095C14.9595 9.4599 15.0795 9.3399 15.0795 9.1899V8.1699C15.0795 8.0199 14.9595 7.8999 14.8095 7.8999H13.7895Z" fill="currentColor"/>
      <path d="M16.6698 22.6996C16.6698 22.6996 16.5998 22.6996 16.5598 22.6996C15.7498 22.6496 15.0598 22.0996 14.8298 21.3296L13.1098 15.4996C12.9098 14.8296 13.0998 14.0996 13.5898 13.5996C14.0898 13.0996 14.8098 12.9196 15.4898 13.1196L21.3198 14.8296C22.0998 15.0596 22.6498 15.7596 22.6898 16.5596C22.7298 17.3696 22.2598 18.1196 21.5198 18.4296L19.4998 19.2796C19.3998 19.3196 19.3298 19.3996 19.2798 19.4996L18.4298 21.5196C18.1298 22.2296 17.4298 22.6896 16.6598 22.6896L16.6698 22.6996ZM14.9598 14.5396C14.8498 14.5396 14.7498 14.5796 14.6698 14.6596C14.5598 14.7696 14.5198 14.9296 14.5698 15.0696L16.2898 20.8996C16.3398 21.0696 16.4898 21.1896 16.6698 21.1996C16.8398 21.1996 17.0098 21.1096 17.0798 20.9396L17.9298 18.9196C18.1298 18.4596 18.4898 18.0996 18.9498 17.8996L20.9698 17.0496C21.1298 16.9796 21.2298 16.8196 21.2198 16.6396C21.2198 16.4696 21.0898 16.3096 20.9198 16.2596L15.0898 14.5496C15.0898 14.5496 15.0098 14.5296 14.9698 14.5296L14.9598 14.5396Z" fill="currentColor"/>
      <path d="M11.7496 22.1898C5.98957 22.1898 1.30957 17.5098 1.30957 11.7498C1.30957 5.9898 5.98957 1.2998 11.7496 1.2998C17.5096 1.2998 22.1896 5.9798 22.1896 11.7398C22.1896 12.1498 21.8496 12.4898 21.4396 12.4898C21.0296 12.4898 20.6896 12.1498 20.6896 11.7398C20.6896 6.8098 16.6796 2.7998 11.7496 2.7998C6.81957 2.7998 2.79957 6.8098 2.79957 11.7398C2.79957 16.6698 6.80957 20.6798 11.7396 20.6798C12.1496 20.6798 12.4896 21.0198 12.4896 21.4298C12.4896 21.8398 12.1496 22.1798 11.7396 22.1798L11.7496 22.1898Z" fill="currentColor"/>
      <path d="M8.67969 13.5097C8.26969 13.5097 7.92969 13.1697 7.92969 12.7597V11.2297C7.92969 9.40969 9.40969 7.92969 11.2297 7.92969H12.7597C13.1697 7.92969 13.5097 8.26969 13.5097 8.67969C13.5097 9.08969 13.1697 9.42969 12.7597 9.42969H11.2297C10.2397 9.42969 9.42969 10.2397 9.42969 11.2297V12.7597C9.42969 13.1697 9.08969 13.5097 8.67969 13.5097Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_webhook">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const OAuthIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <g clipPath="url(#clip0_oauth)">
      <path d="M21.97 19.33L20.88 19.58C20.1 19.76 19.49 20.37 19.3 21.15L19.04 22.24C19.01 22.36 18.85 22.36 18.82 22.24L18.57 21.15C18.39 20.37 17.78 19.76 17 19.57L15.91 19.31C15.79 19.28 15.79 19.12 15.91 19.09L17 18.84C17.78 18.66 18.39 18.05 18.58 17.27L18.84 16.18C18.87 16.06 19.03 16.06 19.06 16.18L19.31 17.27C19.49 18.05 20.1 18.66 20.88 18.85L21.97 19.11C22.09 19.14 22.09 19.3 21.97 19.33Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
      <path d="M5.41 9.24V7.3C5.41 4.09 6.38 1.47 11.24 1.47C16.1 1.47 17.07 4.08 17.07 7.3V9.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 20.9H6.38C2.5 20.9 1.52 19.93 1.52 16.04V14.1C1.52 10.22 2.49 9.24 6.38 9.24H16.09C19.46 9.24 20.64 9.97 20.89 12.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.13 16.07C14.58 16.07 14.13 15.62 14.13 15.07C14.13 14.52 14.57 14.07 15.13 14.07C15.68 14.07 16.13 14.52 16.13 15.07C16.13 15.62 15.68 16.07 15.13 16.07Z" fill="currentColor"/>
      <path d="M11.24 16.07C10.69 16.07 10.24 15.62 10.24 15.07C10.24 14.52 10.68 14.07 11.24 14.07C11.79 14.07 12.24 14.52 12.24 15.07C12.24 15.62 11.79 16.07 11.24 16.07Z" fill="currentColor"/>
      <path d="M7.35 16.07C6.8 16.07 6.35 15.62 6.35 15.07C6.35 14.52 6.79 14.07 7.35 14.07C7.9 14.07 8.35 14.52 8.35 15.07C8.35 15.62 7.9 16.07 7.35 16.07Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_oauth">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const CustomIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <g clipPath="url(#clip0_custom)">
      <path d="M16.4404 15.33H11.4404" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.49957 17.27C10.571 17.27 11.4396 16.4014 11.4396 15.33C11.4396 14.2586 10.571 13.39 9.49957 13.39C8.42814 13.39 7.55957 14.2586 7.55957 15.33C7.55957 16.4014 8.42814 17.27 9.49957 17.27Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.55957 8.67004H12.5596" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.4996 10.61C15.571 10.61 16.4396 9.74141 16.4396 8.66998C16.4396 7.59855 15.571 6.72998 14.4996 6.72998C13.4281 6.72998 12.5596 7.59855 12.5596 8.66998C12.5596 9.74141 13.4281 10.61 14.4996 10.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_custom">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const CredentialKeyIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M19.79 14.9301C17.73 16.9801 14.78 17.6101 12.19 16.8001L7.48002 21.5001C7.14002 21.8501 6.47002 22.0601 5.99002 21.9901L3.81002 21.6901C3.09002 21.5901 2.42002 20.9101 2.31002 20.1901L2.01002 18.0101C1.94002 17.5301 2.17002 16.8601 2.50002 16.5201L7.20002 11.8201C6.40002 9.22007 7.02002 6.27007 9.08002 4.22007C12.03 1.27007 16.82 1.27007 19.78 4.22007C22.74 7.17007 22.74 11.9801 19.79 14.9301Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.89001 17.49L9.19001 19.79" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.5 11C15.3284 11 16 10.3284 16 9.5C16 8.67157 15.3284 8 14.5 8C13.6716 8 13 8.67157 13 9.5C13 10.3284 13.6716 11 14.5 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const credentialIconMap: Record<string, React.FC<IconProps>> = {
  api_key: ApiKeyIcon,
  database: DatabaseIcon,
  login: LoginIcon,
  env_vars: EnvVarsIcon,
  ssh_key: SshKeyIcon,
  webhook: WebhookIcon,
  oauth: OAuthIcon,
  custom: CustomIcon,
};
