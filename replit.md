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
- June 20, 2025. Agregado soporte para URL de PDF en respuesta del webhook
- June 21, 2025. Mejorada interfaz del diagnóstico con diseño más elegante y legible
- June 21, 2025. Actualizado logo y solucionados problemas de deployment
- June 22, 2025. Añadido SEO completo: meta tags, Open Graph, Twitter Cards, robots.txt y sitemap.xml
- June 22, 2025. Implementado sistema de sesiones únicas para evitar respuestas cruzadas entre usuarios
- June 22, 2025. Añadida autenticación por header x-lambda-key para webhook
- June 22, 2025. Movida clave de autenticación a variable de entorno WEBHOOK_AUTH_KEY por seguridad
- June 22, 2025. Restaurada autenticación webhook usando secreto LAMBDA con header x-lambda-key - FUNCIONANDO
- June 22, 2025. Implementado manejo de errores con pantalla dedicada para respuestas inválidas o campos vacíos
- June 22, 2025. Actualizadas dependencias de seguridad: Vite 5.4.14 → 5.4.15 (CVE-2025-30208)
- June 22, 2025. Mejoradas validaciones del formulario: nombres válidos, contenido mínimo, palabras requeridas
- June 22, 2025. Añadido sistema de contacto en errores: email, WhatsApp, notificación automática al equipo técnico
- June 22, 2025. Actualizado sistema de contacto: removido WhatsApp, solo email a ejemplo@tecnico.com
- June 22, 2025. Añadido favicon de AILINK en la pestaña del navegador
- June 22, 2025. Convertida URL del webhook a variable de entorno SECRET (WEBHOOK_URL) para mejorar seguridad
- June 22, 2025. Renombrado archivo logo de WhatsApp Image a ailink-logo.jpeg para nomenclatura profesional
- June 22, 2025. Implementado timer de delay: mensaje animado después de 5 segundos si webhook tarda en responder
- June 23, 2025. Implementado sistema de logging estructurado con Winston para mejor organización de logs en producción
- June 23, 2025. Creados scripts de diagnóstico automático para personal no técnico: diagnostico-problemas.sh y ayuda-no-tecnica.md
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Design philosophy: Minimalismo elegante funcional, estilo Apple, pulcritud y coherencia con el diseño existente del proyecto.
UI/UX: Priorizar minimalismo y elegancia por encima de elementos decorativos excesivos.
Diagnostics: Always use diagnostic scripts (./diagnostico-problemas.sh, ./view-logs.sh) when asked about application status or problems.
```