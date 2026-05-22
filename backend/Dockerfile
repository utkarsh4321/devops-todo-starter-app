FROM node:lts-alpine3.22 AS base
WORKDIR /app

# 2. Deps Stage: Install ONLY production dependencies
FROM base AS deps
# Use cache mount to install fast and keep image clean
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# 3. Builder Stage: Install ALL deps and build
FROM base AS builder
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
# COPY source code AFTER installing deps to preserve cache
COPY . .
RUN npm run build

# 4. Final Stage: The Production Runner
FROM base AS runner
ENV NODE_ENV=production

# Copy the entrypoint script
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Run as non-root user for security
USER node

# Copy necessary files from previous stages
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./

RUN ls -la
EXPOSE 5500
ENTRYPOINT ["./docker-entrypoint.sh"]