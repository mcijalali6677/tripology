#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Push to GitHub and auto-deploy to tripology7.shop server
.DESCRIPTION
    This script commits all changes, pushes to GitHub, and SSHs into the
    production server to pull and rebuild automatically.
.EXAMPLE
    .\deploy.ps1 "fix: updated homepage hero section"
    .\deploy.ps1                  # uses default commit message
#>

param(
    [string]$CommitMessage = "update: deploy changes"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tripology Deploy Pipeline" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Git add & commit
Write-Host "[1/3] Committing changes..." -ForegroundColor Yellow
git add -A
$status = git status --porcelain
if ($status) {
    git commit -m $CommitMessage
    Write-Host "  Committed: $CommitMessage" -ForegroundColor Green
} else {
    Write-Host "  No changes to commit" -ForegroundColor DarkGray
}

# Step 2: Push to GitHub
Write-Host "[2/3] Pushing to GitHub..." -ForegroundColor Yellow
git push origin master
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Push failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Pushed to GitHub" -ForegroundColor Green

# Step 3: Deploy to server
Write-Host "[3/3] Deploying to server..." -ForegroundColor Yellow
Write-Host "  This may take 2-5 minutes (build + restart)..." -ForegroundColor DarkGray
ssh tripology-server "cd /opt/tripology && bash deploy.sh 2>&1"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Deploy successful!" -ForegroundColor Green
    Write-Host "  https://tripology7.shop" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  Deploy FAILED!" -ForegroundColor Red
    Write-Host "  Check: ssh tripology-server 'tail -50 /var/log/tripology-deploy.log'" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    exit 1
}
