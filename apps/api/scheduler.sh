#!/bin/bash

SCHEDULE_TIME=1

source ".env"

BASE_URL="http://localhost:${SERVER_PORT}/summary"

add_pending_summaries_to_queue() {
  curl -X POST "${BASE_URL}/schedule" -H "Content-Type: application/json" -d '{}'
}

last_archive_run=$(date +%s)

while true; do
  add_pending_summaries_to_queue
  sleep $SCHEDULE_TIME
done