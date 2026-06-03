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
WORKDIR /backend-app
ENV NODE_ENV=production

RUN addgroup -S backend_group && adduser -S backend_user -G backend_group

# Copy the entrypoint script
COPY docker-entrypoint.sh /backend-app/docker-entrypoint.sh
RUN sed -i 's/\r$//' /backend-app/docker-entrypoint.sh
# Copy necessary files from previous stages
COPY --from=deps /app/node_modules /backend-app/node_modules
COPY --from=builder /app/dist /backend-app

RUN chown -R root:backend_group /backend-app
RUN chmod -R 750 /backend-app

# Run as non-root user for security
USER backend_user


EXPOSE 5500
ENTRYPOINT ["/backend-app/docker-entrypoint.sh"]