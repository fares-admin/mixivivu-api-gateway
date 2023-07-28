FROM node:lts as dependencies
WORKDIR /forum-platform
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /forum-platform
COPY . .
COPY --from=dependencies /forum-platform/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /forum-platform
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /forum-platform/next.config.js ./
COPY --from=builder /forum-platform/public ./public
COPY --from=builder /forum-platform/.next ./.next
COPY --from=builder /forum-platform/node_modules ./node_modules
COPY --from=builder /forum-platform/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]