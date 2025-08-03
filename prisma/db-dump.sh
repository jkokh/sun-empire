#!/bin/sh
#
# MySQL Database Dump Script
# 
# This script creates a dump of the MySQL database running in a Docker container,
# compresses it with gzip, and saves it with a timestamp in the filename.
#
# Changes made:
# - Updated container name from "bandink-mysql-1" to "mysql-container" to match docker-compose.yml
# - Added loading of environment variables from .env file instead of hardcoding credentials
# - Updated database credentials to use environment variables
# - Added error handling for missing .env file and container not running
#

# Load environment variables from .env file
if [ -f ../.env ]; then
  export $(grep -v '^#' ../.env | xargs)
else
  echo "Warning: .env file not found. Using default values."
fi

# Variables
DATE=$(date "+%Y-%m-%d_%H-%M-%S") # Current date and time
HOST_VOLUME_PATH="./dump_${DATE}.sql" # Path and name of the dump file on your host, including the date
GZIPPED_PATH="${HOST_VOLUME_PATH}.gz" # Path for the gzipped dump file
MYSQL_CONTAINER_NAME="mysql-container" # Name of your existing MySQL container

# Check if MySQL container is running
if ! docker ps | grep -q ${MYSQL_CONTAINER_NAME}; then
  echo "Error: MySQL container '${MYSQL_CONTAINER_NAME}' is not running."
  exit 1
fi

# Use environment variables from .env file
MYSQL_DATABASE="${MYSQL_DATABASE:-sun.dev}"
MYSQL_USER="root"
MYSQL_PASSWORD="${MYSQL_ROOT_PASSWORD}"

# Ensure the dump file does not already exist
rm -f ${HOST_VOLUME_PATH}
rm -f ${GZIPPED_PATH}

# Run mysqldump within the MySQL container and save it to the host
docker exec ${MYSQL_CONTAINER_NAME} /usr/bin/mysqldump -u ${MYSQL_USER} --password=${MYSQL_PASSWORD} ${MYSQL_DATABASE} > ${HOST_VOLUME_PATH}

# Check if dump was successful
if [ $? -eq 0 ]; then
    echo "Database dump was successful."
    # Compress the dump file
    gzip ${HOST_VOLUME_PATH}
    echo "Database dump compressed to ${GZIPPED_PATH}."
else
    echo "Database dump failed."
fi
