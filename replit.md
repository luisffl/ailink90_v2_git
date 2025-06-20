# replit.md

## Overview

This is a full-stack web application built with React/TypeScript frontend and Express.js backend. The application appears to be focused on providing diagnostic services for business niches, featuring a multi-step form interface with user authentication, CSRF protection, and real-time WebSocket communication. The application includes comprehensive security measures and is designed to integrate with external webhook services.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Radix UI components with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design tokens and theme variables
- **Animation**: Framer Motion for smooth transitions and animations

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Session Management**: Express-session with memory store
- **Security**: Helmet for security headers, CSRF protection, rate limiting
- **Real-time Communication**: WebSocket server for live updates
- **Development**: tsx for TypeScript execution in development

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: User authentication schema with username/password
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Security Components
- **Rate Limiting**: General rate limiting (100 requests/15min) and webhook-specific limiting (10 requests/5min)
- **CSRF Protection**: Token-based CSRF protection for form submissions
- **Session Security**: Secure session configuration with proper cookie settings
- **Content Security Policy**: Helmet configuration with CSP headers
- **Input Validation**: Honeypot fields for bot detection

### Form System
- **Multi-step Form**: Progressive form with 6 steps for user data collection
- **Validation**: Client-side validation with error handling
- **Progress Tracking**: Visual progress indicator with step labels
- **Data Collection**: Comprehensive user profiling including location, preferences, skills, and business goals

### Communication Layer
- **REST API**: Express routes with `/api` prefix
- **WebSocket Integration**: Real-time status updates for webhook processing
- **External Integration**: Proxy endpoint for n8n webhook integration
- **Toast Notifications**: User feedback system for various application states

### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme**: Comprehensive dark theme implementation
- **Animation System**: Smooth transitions using Framer Motion
- **Accessibility**: Radix UI components ensure accessibility compliance
- **Error Handling**: Comprehensive error states and user feedback

## Data Flow

1. **User Registration/Login**: Users authenticate through the form system
2. **Form Submission**: Multi-step form collects user data with validation
3. **Webhook Processing**: External n8n webhook processes the diagnostic request
4. **Real-time Updates**: WebSocket provides status updates during processing
5. **Results Delivery**: Diagnostic results are displayed with PDF generation capability
6. **Session Management**: User sessions are maintained throughout the process

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **@radix-ui/***: Comprehensive UI component library
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe ORM for database operations
- **express-rate-limit**: API rate limiting
- **helmet**: Security headers middleware
- **framer-motion**: Animation library

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the application
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Production bundling for server code

### Integrations
- **n8n Webhook**: External workflow automation service
- **WebSocket**: Real-time communication protocol
- **PDF Generation**: Client-side PDF generation capabilities

## Deployment Strategy

### Environment Configuration
- **Development**: Uses Vite dev server with hot module replacement
- **Production**: Static file serving with Express backend
- **Database**: Configured for PostgreSQL with environment variables
- **Replit Integration**: Configured for Replit's deployment environment

### Build Process
1. **Frontend Build**: Vite builds React application to `/dist/public`
2. **Backend Build**: ESBuild bundles server code to `/dist`
3. **Asset Handling**: Static assets served from built directories
4. **Environment Variables**: Database URL and other config via environment

### Scaling Considerations
- **Session Storage**: Currently uses memory store (should be replaced with persistent store for production scaling)
- **Rate Limiting**: Per-IP rate limiting may need adjustment for load balancers
- **WebSocket Scaling**: Single WebSocket server may need clustering for high load

## Changelog

```
Changelog:
- June 20, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Design philosophy: Minimalismo elegante funcional, estilo Apple, pulcritud y coherencia con el diseño existente del proyecto.
UI/UX: Priorizar minimalismo y elegancia por encima de elementos decorativos excesivos.
```