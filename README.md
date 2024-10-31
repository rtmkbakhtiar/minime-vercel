# MiniMe AI Frontend WEB

## Contents:

- [System Requirements](#a-system-requirements)
- [Third-party Libraries (Tools) and Assets List](#b-third-party-libraries-tools-and-assets-list)
- [Credentials of the Project](#c-credentials-of-the-project)
- [How to Run Guide](#d-how-to-run-guide)
- [How to Build and Deployment Guide](#e-how-to-build-and-deployment-guide)
- [Troubleshooting Guide](#f-troubleshooting-guide)
- [Developer Internal Notes](#g-developer-internal-notes)

---

## A. System Requirements

- **NodeJs**: >= v16.16.0
- **npm**: >= 8.11.0
- **yarn**: >= 1.22.15
- **Docker**: >= 20.10.12

---

## B. Third-Party Libraries (Tools) and Assets List

### B.1 Frontend Libraries

- **Next.js** (14.0.3): React-based framework for server-side rendering (SSR) and static site generation.
- **React** (18.2.0) / **React-DOM** (18.2.0): Core libraries for building UI components.
- **Tailwind CSS** (3.3.0): Utility-first CSS framework for styling.
- **Formik** (2.4.5): Forms management library.
- **Framer Motion** (11.2.6): Animation library.
- **Radix UI**: Various UI components including:
  - react-dialog (1.0.5)
  - react-dropdown-menu (2.0.6)
  - react-radio-group (1.2.0)
  - react-scroll-area (1.0.5)
  - react-tooltip (1.1.2)
  - react-visually-hidden (1.1.0)

### B.2 Utility Libraries

- **Axios** (1.6.2): HTTP client for API calls.
- **Lodash** (4.17.21): Utility library for JavaScript.
- **Date-fns** (3.6.0): For date manipulation.
- **Clsx** (2.0.0): Utility for conditionally joining classNames.
- **Yup** (1.4.0): Schema validation for form data.

### B.3 Tools & Other Libraries

- **Sharp** (0.33.2): Image processing library.
- **Next SEO** (6.4.0): SEO configuration for Next.js.
- **React Toastify** (9.1.3): For displaying toast notifications.
- **Tanstack React Table** (8.17.3): Table management.
- **Open Graph Scraper** (6.8.0): For extracting Open Graph metadata.
- **React-Spring Bottom Sheet** (3.4.1): Modal-style bottom sheets.

### B.4 Authentication & Security

- **Next Auth** (4.24.7): Authentication library for Next.js.
- **Jose** (5.4.0): JWT utilities for handling JSON Web Tokens.
- **@sentry/nextjs** (8): Error tracking and monitoring.

### B.5 Tailwind Plugins

- **@tailwindcss/forms** (0.5.7): Tailwind plugin for better form styling.
- **Tailwind Merge** (2.0.0): To intelligently merge Tailwind CSS classes.
- **Tailwindcss Animate** (1.0.7): For handling animations with Tailwind.

---

## C. Credentials of the Project

### Environment Variables:

```env
NEXT_PUBLIC_BASE_URL_S3=
NEXT_PUBLIC_MAX_FREE_CHAT=
NEXTAUTH_SECRET=
NEXTAUTH_URL_INTERNAL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

SENTRY_PROJECT_ID=
SENTRY_HOST=
SENTRY_AUTH_TOKEN=
SENTRY_IGNORE_API_RESOLUTION_ERROR=

NEXT_PUBLIC_BASE_URL=
NEXTAUTH_URL=
NEXT_PUBLIC_BASE_URL_SSE=
NEXT_PUBLIC_BASE_URL_API=
```

### Sentry Configuration:

Also update DSN in the following Sentry config files if changing Sentry account:

- `sentry-client.config.ts`
- `sentry-edge.config.ts`
- `sentry-server.config.ts`

## D. How to Run Guide

### D.1 Clone the Repository

Clone the project repository using the following command:

```bash
git clone https://github.com/inovasi-pembaharuan-bersama/networky_bot_fe.git
cd [project-directory]
```

### D.2 Install Dependencies

Install the required dependencies using Yarn:

```bash
yarn install
```

### D.3 Set Up Environment Variables

Ensure the .env file exists and contains the required credentials.

### D.4 Generate OpenAPI Client

The project uses an OpenAPI client generated from an openapi.yaml file provided by the backend team. Ensure the openapi.yaml file is placed in the src/openapi directory.
To generate the OpenAPI client, run the following command:

```bash
yarn generate-openapi
```

### D.5 Run the Development Server

Start the development server using:

```bash
yarn dev
```

You can access the app at http://localhost:3000.

### D.6 Linting

After completing your code changes, run the following command to automatically fix any linting issues:

```bash
yarn lint --fix
```

This helps maintain consistent code quality and prevents potential issues due to incorrect formatting or linting errors.

## E. How to Build and Deployment Guide

### E.1 Build the Application

To create a production build of the application, run the following command:

```bash
yarn build
```

This will generate the optimized production version in the .next folder.

### E.2 Running the Build Result

To run the build result, you have two options:

1. Using the Start Command:

```bash
yarn start
```

This will use the Next.js script to run the build result.

2. Using the Serve Command:

```bash
yarn serve
```

This will use `.next/standalone/server.js` from the build result. Serving the app with this command will enter standalone mode, which is useful if you deploy the app with Docker/Kubernetes.
Ref: Next.js Standalone Mode

### E.3 Define Required Routes

During deployment, make sure to define the following routes for the app to work properly:

1. Application Routes:

All routes that start with the `/app` prefix.

2. API Routes:

- `/api/metadata`
- `/api/auth/signin`
- `/api/auth/signin/google`
- `/api/auth/callback/google`
- `/api/auth/signout`
- `/api/auth/session`
- `/api/auth/csrf`
- `/api/auth/providers`

These routes are necessary to handle both app functionality, authentication flow using Next-Auth, and the Open Graph scrapper.

### E.4 Build & Push Docker Image

1. Install AWS CLI

Follow the official AWS documentation to install the AWS CLI:  
[Getting Started with AWS CLI Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

2. AWS Configuration

Once AWS CLI is installed, configure it by running the following command:

```bash
aws configure
```

When prompted, enter the credentials. This will configure your AWS CLI for further use.

3. Login to AWS ECR

Before pushing the Docker image to AWS ECR, log in to the ECR registry by running the following command:

```bash
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <repository-name>
```

This will authenticate your Docker client to interact with AWS Elastic Container Registry (ECR).

4. Build the Docker Image
   To build the Docker image, run:

```bash
docker build --no-cache --network host -t <repository-name:tag> .
```

Replace `<repository-name:tag>` with the desired repository name and tag (e.g., myapp:v1.0).

5. Push the Docker Image
   After building the image, push it to the ECR repository:

```bash
docker push <repository-name:tag>
```

Again, replace `<repository-name:tag>` with the actual repository name and tag.

## F. Troubleshooting Guide

## G. Developer Internal Notes

### Sentry Account

Currently, Sentry is using a personal account for error tracking. It is recommended to provide a dedicated Sentry account specifically for the MiniMe AI web project to ensure proper ownership and long-term maintenance. Please set up a new account and update the environment variables accordingly:

- `SENTRY_PROJECT_ID`
- `SENTRY_HOST`
- `SENTRY_AUTH_TOKEN`

### Branch Management

MiniMe has two main branches:

- **Master Branch**: Used for the web application at [https://myminime.ai](https://myminime.ai).
- **bot-fe-old Branch**: Used for the deployment of chatbot pages with the subdomain `myminime.club`.

### Active Bots

Here are the active bots deployed on the subdomain:

- [https://johnlee-sales.minime.club](https://johnlee-sales.minime.club)
- [https://woochan.minime.club](https://woochan.minime.club)
- [https://simplysosan.minime.club](https://simplysosan.minime.club)
- [https://johnlee.minime.club](https://johnlee.minime.club)

Each subdomain is created based on the routes defined in the pages folder. When deploying a new bot, remember to inform the DevOps team about the names of the routes.
