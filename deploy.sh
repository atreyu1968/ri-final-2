#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Utility functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check requirements
check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    }
}

# Set up directories and permissions
setup_directories() {
    log_info "Setting up directories..."
    
    # Create necessary directories
    mkdir -p secrets uploads logs docker/{mariadb,nextcloud,discourse}/{conf.d,init}
    
    # Generate secure passwords if they don't exist
    if [ ! -f secrets/db_root_password.txt ]; then
        openssl rand -base64 32 > secrets/db_root_password.txt
    fi
    
    if [ ! -f secrets/db_user.txt ]; then
        echo "innovation_user" > secrets/db_user.txt
    fi
    
    if [ ! -f secrets/db_password.txt ]; then
        openssl rand -base64 32 > secrets/db_password.txt
    fi

    # Generate Nextcloud admin password
    if [ ! -f secrets/nextcloud_admin_password.txt ]; then
        openssl rand -base64 32 > secrets/nextcloud_admin_password.txt
    fi

    # Generate Discourse admin password
    if [ ! -f secrets/discourse_admin_password.txt ]; then
        openssl rand -base64 32 > secrets/discourse_admin_password.txt
    fi
    
    # Set permissions
    chmod 600 secrets/*
    chmod 755 docker/{mariadb,nextcloud,discourse}/{conf.d,init}
}

# Configure services
configure_services() {
    log_info "Configuring services..."

    # Get domain from environment or use default
    DOMAIN=${DOMAIN:-"localhost"}
    PROTOCOL=${PROTOCOL:-"https"}
    
    # Configure Nextcloud
    cat > docker/nextcloud/config.php <<EOF
<?php
\$CONFIG = array (
  'trusted_domains' => array('${DOMAIN}'),
  'overwrite.cli.url' => '${PROTOCOL}://${DOMAIN}/nextcloud',
  'default_language' => 'es',
  'default_locale' => 'es_ES',
  'default_phone_region' => 'ES',
);
EOF

    # Store service URLs for the application
    echo "${PROTOCOL}://${DOMAIN}/nextcloud" > secrets/nextcloud_url.txt
    echo "${PROTOCOL}://${DOMAIN}/forum" > secrets/discourse_url.txt
    
    log_info "Nextcloud URL: ${PROTOCOL}://${DOMAIN}/nextcloud"
    log_info "Discourse URL: ${PROTOCOL}://${DOMAIN}/forum"
}

# Deploy application
deploy_app() {
    log_info "Deploying application..."
    
    # Build and start containers
    docker compose build --no-cache
    docker compose up -d
    
    # Check container status
    docker compose ps
    
    # Wait for services to be healthy
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Check logs for errors
    docker compose logs --tail=100

    # Configure services after deployment
    configure_services
}

# Main function
main() {
    log_info "Starting deployment..."
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then 
        log_error "This script must be run as root"
        exit 1
    }
    
    check_requirements
    setup_directories
    deploy_app
    
    log_info "Deployment completed successfully"
    
    # Show service URLs
    if [ -f secrets/nextcloud_url.txt ]; then
        NEXTCLOUD_URL=$(cat secrets/nextcloud_url.txt)
        log_info "Nextcloud is available at: ${NEXTCLOUD_URL}"
        log_info "Nextcloud admin password is stored in secrets/nextcloud_admin_password.txt"
    fi

    if [ -f secrets/discourse_url.txt ]; then
        DISCOURSE_URL=$(cat secrets/discourse_url.txt)
        log_info "Forum is available at: ${DISCOURSE_URL}"
        log_info "Forum admin password is stored in secrets/discourse_admin_password.txt"
    fi
}

# Run script
main