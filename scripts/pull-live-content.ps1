# Pull live CMS content (content/ + public/uploads/) from Lenovo via SSH.
# Uses the existing SSH host JIFO-SERVER — no GitHub token.
#
# Usage (from repo root):
#   npm run content:pull
#   powershell -File scripts/pull-live-content.ps1
#   powershell -File scripts/pull-live-content.ps1 -SiteRoot /home/jifo/websites/jifo

param(
  [string]$SshHost = $(if ($env:JIFOCC_SSH_HOST) { $env:JIFOCC_SSH_HOST } else { "JIFO-SERVER" }),
  [string]$SiteRoot = $(if ($env:JIFOCC_SITE_ROOT) { $env:JIFOCC_SITE_ROOT } else { "/home/jifo/websites/annveronique" })
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

Write-Host "SSH $SshHost → ${SiteRoot}  (content + public/uploads)"

$sshArgs = @(
  "-o", "BatchMode=yes",
  "-o", "ConnectTimeout=12",
  $SshHost,
  "tar -C '$SiteRoot' -cf - content public/uploads"
)

& ssh @sshArgs | tar -xf -
if ($LASTEXITCODE -ne 0) {
  throw "ssh/tar failed with exit $LASTEXITCODE"
}

Write-Host "Gotowe. Sprawdź: git status -- content public/uploads"
git status --porcelain -- content public/uploads
