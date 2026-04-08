#!/usr/bin/env bash
set -euo pipefail

dotenv_value() {
  local key="$1"
  local file="${2:-.env}"
  if [[ ! -f "$file" ]]; then
    return 1
  fi

  local line
  line="$(grep -E "^${key}=" "$file" | tail -n1 || true)"
  if [[ -z "$line" ]]; then
    return 1
  fi

  printf '%s' "${line#*=}"
}

DEFAULT_BASE_URL="http://localhost:3000/api"
if base_url_from_env_file="$(dotenv_value BASE_URL 2>/dev/null)"; then
  DEFAULT_BASE_URL="$base_url_from_env_file"
fi

BASE_URL="${BASE_URL:-$DEFAULT_BASE_URL}"
ADMIN_TOKEN="${ADMIN_TOKEN:-}"
ADMIN_EMAIL="${ADMIN_EMAIL:-$(dotenv_value ADMIN_EMAIL 2>/dev/null || true)}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-$(dotenv_value ADMIN_PASSWORD 2>/dev/null || true)}"

USER_PASSWORD="${USER_PASSWORD:-password123}"

timestamp="$(date +%s)"
USER_EMAIL="user.${timestamp}@eventmaster.local"
STAFF_EMAIL="staff.${timestamp}@eventmaster.local"
PLACE_NAME="Arena QA ${timestamp}"
PLACE_LEGACY_NAME="Arena Legacy ${timestamp}"
EVENT_TITLE="Evento QA ${timestamp}"

if ! command -v curl >/dev/null 2>&1; then
  echo "curl no esta instalado"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "node no esta instalado (se usa para parsear JSON en este script)"
  exit 1
fi

json_get() {
  local path="$1"
  node -e '
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim() || "{}";
const obj = JSON.parse(input);
const path = process.argv[1].split(".");
let cur = obj;
for (const part of path) {
  if (cur == null || !(part in cur)) process.exit(2);
  cur = cur[part];
}
if (typeof cur === "object") process.stdout.write(JSON.stringify(cur));
else process.stdout.write(String(cur));
' "$path"
}

request() {
  local method="$1"
  local path="$2"
  local token="${3:-}"
  local data="${4:-}"

  local url="${BASE_URL}${path}"
  local response

  if [[ -n "$data" ]]; then
    if [[ -n "$token" ]]; then
      response="$(curl -sS -X "$method" "$url" -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "$data" -w $'\n%{http_code}')"
    else
      response="$(curl -sS -X "$method" "$url" -H "Content-Type: application/json" -d "$data" -w $'\n%{http_code}')"
    fi
  else
    if [[ -n "$token" ]]; then
      response="$(curl -sS -X "$method" "$url" -H "Authorization: Bearer $token" -w $'\n%{http_code}')"
    else
      response="$(curl -sS -X "$method" "$url" -w $'\n%{http_code}')"
    fi
  fi

  REQ_BODY="$(printf '%s\n' "$response" | sed '$d')"
  REQ_CODE="$(printf '%s\n' "$response" | tail -n1)"
}

expect_code() {
  local got="$1"
  shift
  local ok=1
  for expected in "$@"; do
    if [[ "$got" == "$expected" ]]; then
      ok=0
      break
    fi
  done

  if [[ $ok -ne 0 ]]; then
    echo "ERROR: HTTP $got (esperado: $*)"
    echo "Body: $REQ_BODY"
    exit 1
  fi
}

step() {
  echo
  echo "==> $1"
}

step "Health publico segun docs (event y places)"
request GET "/event"
expect_code "$REQ_CODE" 200
echo "GET /event -> $REQ_CODE"

request GET "/places"
expect_code "$REQ_CODE" 200
echo "GET /places -> $REQ_CODE"

step "Registro de usuario final"
request POST "/auth/register" "" "{\"name\":\"Usuario QA\",\"email\":\"${USER_EMAIL}\",\"password\":\"${USER_PASSWORD}\"}"
expect_code "$REQ_CODE" 201
echo "POST /auth/register -> $REQ_CODE"

step "Login usuario final"
request POST "/auth/login" "" "{\"email\":\"${USER_EMAIL}\",\"password\":\"${USER_PASSWORD}\"}"
expect_code "$REQ_CODE" 200
USER_TOKEN="$(printf '%s' "$REQ_BODY" | json_get token)"
echo "POST /auth/login -> $REQ_CODE"

step "Sesion actual de usuario"
request GET "/auth/me" "$USER_TOKEN"
expect_code "$REQ_CODE" 200
echo "GET /auth/me -> $REQ_CODE"

step "Resolviendo token admin para endpoints restringidos"
if [[ -z "$ADMIN_TOKEN" ]]; then
  if [[ -n "$ADMIN_EMAIL" && -n "$ADMIN_PASSWORD" ]]; then
    request POST "/auth/login" "" "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}"
    expect_code "$REQ_CODE" 200
    ADMIN_TOKEN="$(printf '%s' "$REQ_BODY" | json_get token)"
    echo "Login admin por credenciales -> $REQ_CODE"
  else
    echo "Falta ADMIN_TOKEN o ADMIN_EMAIL/ADMIN_PASSWORD para completar endpoints admin/staff/organizer"
    echo "Tip: el script intenta leer ADMIN_EMAIL y ADMIN_PASSWORD desde .env"
    echo "Define variables y vuelve a ejecutar:"
    echo "  ADMIN_TOKEN=<token> BASE_URL=${BASE_URL} bash scripts/test_all_endpoints.sh"
    echo "  o"
    echo "  ADMIN_EMAIL=<mail> ADMIN_PASSWORD=<pass> BASE_URL=${BASE_URL} bash scripts/test_all_endpoints.sh"
    exit 1
  fi
fi

step "Crear cuenta operativa (auth/admin/create-account)"
request POST "/auth/admin/create-account" "$ADMIN_TOKEN" "{\"name\":\"Staff QA\",\"email\":\"${STAFF_EMAIL}\",\"password\":\"password123\",\"role\":\"staff\"}"
expect_code "$REQ_CODE" 201
echo "POST /auth/admin/create-account -> $REQ_CODE"

step "Crear sede por modulo places (admin)"
request POST "/places" "$ADMIN_TOKEN" "{\"name\":\"${PLACE_NAME}\",\"location\":{\"type\":\"Point\",\"coordinates\":[-99.1764,19.4975]},\"maxCapacity\":2000,\"defaultZones\":[{\"name\":\"VIP\",\"capacity\":300},{\"name\":\"General\",\"capacity\":1700}],\"amenities\":[\"Parking\",\"WiFi\"]}"
expect_code "$REQ_CODE" 201
PLACE_ID="$(printf '%s' "$REQ_BODY" | json_get place._id)"
echo "POST /places -> $REQ_CODE"

step "Crear sede por endpoint legacy /place (autenticado)"
request POST "/place" "$USER_TOKEN" "{\"name\":\"${PLACE_LEGACY_NAME}\",\"location\":{\"type\":\"Point\",\"coordinates\":[-99.1664,19.4075]},\"maxCapacity\":1200,\"defaultZones\":[{\"name\":\"VIP\",\"capacity\":200},{\"name\":\"General\",\"capacity\":1000}]}"
expect_code "$REQ_CODE" 201
echo "POST /place -> $REQ_CODE"

step "Disponibilidad de sede"
TODAY="$(date -u +%F)"
request GET "/places/${PLACE_ID}/availability?date=${TODAY}"
expect_code "$REQ_CODE" 200
echo "GET /places/{id}/availability -> $REQ_CODE"

step "Crear evento (admin)"
START_AT="$(date -u -d '+2 day' +%Y-%m-%dT18:00:00.000Z)"
END_AT="$(date -u -d '+2 day' +%Y-%m-%dT22:00:00.000Z)"
request POST "/event/new" "$ADMIN_TOKEN" "{\"title\":\"${EVENT_TITLE}\",\"description\":\"Evento para QA por curl\",\"location\":\"${PLACE_NAME}\",\"startTime\":\"${START_AT}\",\"endTime\":\"${END_AT}\",\"totalCapacity\":2000,\"status\":\"published\",\"zones\":[{\"name\":\"VIP\",\"capacity\":300,\"price\":250},{\"name\":\"General\",\"capacity\":1700,\"price\":100}]}"
expect_code "$REQ_CODE" 201
EVENT_ID="$(printf '%s' "$REQ_BODY" | json_get _id)"
echo "POST /event/new -> $REQ_CODE"

step "Consultar evento por ID"
request GET "/event/${EVENT_ID}"
expect_code "$REQ_CODE" 200
echo "GET /event/{id} -> $REQ_CODE"

step "Actualizar evento"
request PATCH "/event/${EVENT_ID}" "$ADMIN_TOKEN" "{\"description\":\"Descripcion actualizada por QA\"}"
expect_code "$REQ_CODE" 200
echo "PATCH /event/{id} -> $REQ_CODE"

step "Consultar disponibilidad de evento"
request GET "/event/${EVENT_ID}/availability"
expect_code "$REQ_CODE" 200
echo "GET /event/{id}/availability -> $REQ_CODE"

step "Crear reserva"
request POST "/reservations" "$USER_TOKEN" "{\"eventId\":\"${EVENT_ID}\",\"zone\":\"VIP\"}"
expect_code "$REQ_CODE" 201
RESERVATION_ID="$(printf '%s' "$REQ_BODY" | json_get _id)"
echo "POST /reservations -> $REQ_CODE"

step "Mis tickets"
request GET "/reservations/my-tickets" "$USER_TOKEN"
expect_code "$REQ_CODE" 200
echo "GET /reservations/my-tickets -> $REQ_CODE"

step "Reporte de reservas por evento"
request GET "/reservations/event/${EVENT_ID}" "$ADMIN_TOKEN"
expect_code "$REQ_CODE" 200
echo "GET /reservations/event/{eventId} -> $REQ_CODE"

step "Check-in de reserva"
request PATCH "/reservations/${RESERVATION_ID}/check-in" "$ADMIN_TOKEN"
expect_code "$REQ_CODE" 200
echo "PATCH /reservations/{id}/check-in -> $REQ_CODE"

step "Cancelar reserva"
request DELETE "/reservations/${RESERVATION_ID}" "$USER_TOKEN"
expect_code "$REQ_CODE" 200
echo "DELETE /reservations/{id} -> $REQ_CODE"

step "Cancelar evento (borrado logico)"
request DELETE "/event/${EVENT_ID}" "$ADMIN_TOKEN"
expect_code "$REQ_CODE" 200
echo "DELETE /event/{id} -> $REQ_CODE"

echo
echo "OK: se ejecutaron todos los endpoints documentados en YAML."