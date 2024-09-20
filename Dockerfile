FROM denoland/deno:debian-1.46.3 AS production
COPY ./src /app/src
WORKDIR /app

EXPOSE 8080
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--unstable", "/app/src/index.ts"]