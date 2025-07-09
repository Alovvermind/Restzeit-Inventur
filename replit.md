# Spirituelle Selbstreflexion - 4. Schritt

## Overview

This is a Flask-based web application designed to support individuals in their spiritual self-reflection journey, specifically aligned with the 4th step of Alcoholics Anonymous. The application uses Google's Gemini AI to analyze user text input and provide compassionate guidance, character defect identification, and daily spiritual recommendations in German.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology**: Vanilla HTML, CSS, and JavaScript
- **UI Framework**: Bootstrap 5 with dark theme
- **Styling**: Custom CSS for enhanced user experience
- **Structure**: Single-page application with responsive design
- **Icons**: Font Awesome for visual elements

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **API Design**: RESTful API with JSON responses
- **Session Management**: Flask sessions with configurable secret key
- **CORS**: Enabled for cross-origin requests
- **Logging**: Python's built-in logging module configured for debugging

### AI Integration
- **Service**: Google Gemini AI (gemini-2.5-flash model)
- **Purpose**: Text analysis for spiritual self-reflection
- **Language**: German-language prompts and responses
- **Focus**: Character defect identification and spiritual guidance

## Key Components

### Backend Components
1. **Flask Application** (`app.py`)
   - Main application logic
   - Route handlers for web pages and API endpoints
   - Gemini AI client initialization and configuration

2. **Main Entry Point** (`main.py`)
   - Application launcher
   - Development server configuration

### Frontend Components
1. **HTML Template** (`templates/index.html`)
   - Single-page interface for user input
   - Bootstrap-based responsive design
   - Form validation and user feedback elements

2. **Styling** (`static/css/style.css`)
   - Custom CSS for enhanced user experience
   - Smooth transitions and hover effects
   - Form enhancements and loading animations

3. **JavaScript** (`static/js/app.js`)
   - Form submission handling
   - AJAX API communication
   - User interface state management
   - Input validation and character counting

## Data Flow

1. **User Input**: User enters text through web form
2. **Client-side Validation**: JavaScript validates input before submission
3. **API Request**: Frontend sends POST request to `/analyse` endpoint
4. **AI Processing**: Backend sends structured prompt to Gemini AI
5. **Response Processing**: AI analysis is formatted and returned
6. **User Feedback**: Results displayed with spiritual guidance and daily recommendations

## External Dependencies

### AI Service
- **Google Gemini AI**: Core AI functionality for text analysis
- **Authentication**: API key-based authentication via environment variables
- **Model**: gemini-2.5-flash for text generation

### Frontend Libraries
- **Bootstrap 5**: UI framework with dark theme
- **Font Awesome**: Icon library for visual elements
- **CDN Delivery**: External CDN for fast loading

### Python Dependencies
- **Flask**: Web application framework
- **Flask-CORS**: Cross-origin resource sharing support
- **Google GenAI**: Official Google Gemini AI client library

## Deployment Strategy

### Environment Configuration
- **API Keys**: Environment variable-based configuration
- **Session Security**: Configurable session secret key
- **Development Mode**: Debug mode enabled for development

### Server Configuration
- **Host**: Configured for 0.0.0.0 (all interfaces)
- **Port**: Default port 5000
- **CORS**: Enabled for frontend-backend communication

### Static Asset Serving
- **Flask Static**: Built-in Flask static file serving
- **Template Rendering**: Jinja2 template engine for HTML generation

### Security Considerations
- **Input Validation**: Both client-side and server-side validation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Session Management**: Secure session handling with configurable keys

## Technical Notes

The application is designed as a supportive tool for spiritual self-reflection, specifically targeting the 4th step of the AA program. The AI prompts are carefully crafted to provide compassionate yet honest feedback, focusing on character defects identification and practical daily spiritual recommendations. The entire user interface and AI interactions are conducted in German to serve the target audience effectively.

## Recent Changes (July 9, 2025)

- **Public URL Support**: Configured CORS to allow access from all domains for public link sharing
- **API Reliability**: Enhanced error handling for better user experience when accessing shared links
- **Network Robustness**: Improved timeout handling and more specific error messages
- **Deployment Optimization**: Added environment-aware configuration for better public deployment
- **Cross-Domain Compatibility**: Fixed JavaScript API calls to work with any domain (relative URLs)