# Compose supplies the exact version from .infra/versions.env.
ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-bookworm-slim
ARG NPM_VERSION
RUN npm install --global "npm@${NPM_VERSION}" --no-audit --no-fund
WORKDIR /workspace
COPY .devcontainer/dev-entrypoint.sh /usr/local/bin/eml-entrypoint
RUN chmod 0755 /usr/local/bin/eml-entrypoint
ENTRYPOINT ["/usr/local/bin/eml-entrypoint"]
