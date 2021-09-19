FROM denoland/deno:debian-1.13.0 AS production
COPY ./src /app
WORKDIR /app

EXPOSE 8080
CMD ["run", "--allow-net", "--allow-env", "src/index.ts"]

FROM production as development
# Denon does not work with Deno 1.14
RUN deno install --allow-read --allow-run --allow-write --allow-net -f --unstable https://deno.land/x/denon@2.4.8/denon.ts
