# API Routes

This folder contains all API routes for Nerlude.

## Structure

```
/api
├── /auth           # Authentication endpoints
│   ├── login
│   ├── register
│   ├── logout
│   ├── forgot-password
│   └── reset-password
│
├── /users          # User management
│   └── me
│
├── /workspaces     # Workspace CRUD
│   └── [id]
│       └── members
│
├── /projects       # Project CRUD
│   └── [id]
│       ├── services
│       │   └── [serviceId]
│       │       └── credentials
│       ├── assets
│       ├── docs
│       └── members
│
├── /registry       # Service registry
│   ├── categories
│   └── services
│
├── /dashboard      # Dashboard data
│   ├── stats
│   ├── alerts
│   └── activity
│
└── /notifications  # User notifications
```

## Implementation Status

- [ ] Auth routes
- [ ] User routes
- [ ] Workspace routes
- [ ] Project routes
- [ ] Service routes
- [ ] Credential routes
- [ ] Registry routes
- [ ] Dashboard routes
- [ ] Notification routes

## Notes

All routes will be implemented when connecting to Supabase database.
