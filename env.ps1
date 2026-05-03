[CmdletBinding()]
param(
  [string]$EnvFile = ".env.production",
  [string]$Environment = "production",
  [switch]$DryRun,
  [switch]$Deploy,
  [switch]$AllowPlaceholders
)

$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

function Read-DotEnvFile {
  param([string]$Path)

  $values = [ordered]@{}

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Environment file not found: $Path"
  }

  foreach ($line in Get-Content -LiteralPath $Path) {
    $trimmed = $line.Trim()

    if (-not $trimmed -or $trimmed.StartsWith("#") -or -not $trimmed.Contains("=")) {
      continue
    }

    $key, $value = $trimmed -split "=", 2
    $key = $key.Trim()
    $value = $value.Trim()

    if (
      ($value.StartsWith('"') -and $value.EndsWith('"')) -or
      ($value.StartsWith("'") -and $value.EndsWith("'"))
    ) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    if ($key) {
      $values[$key] = $value
    }
  }

  return $values
}

function Test-GeneratedVercelKey {
  param([string]$Key)

  return (
    $Key -eq "NX_DAEMON" -or
    $Key.StartsWith("TURBO_") -or
    $Key.StartsWith("VERCEL")
  )
}

function Test-SensitiveKey {
  param([string]$Key)

  return (
    $Key -match "(^|_)(SECRET|TOKEN|PASSWORD|PASS|PRIVATE)$" -or
    $Key -match "(^|_)API_KEY$" -or
    $Key -match "SIGNATURE_KEY$" -or
    $Key -eq "DATABASE_URL" -or
    $Key -eq "IMGBB"
  )
}

function Test-PlaceholderValue {
  param([string]$Value)

  $normalized = $Value.Trim().ToLowerInvariant()

  if (-not $normalized) {
    return $true
  }

  return (
    $normalized -like "your-*" -or
    $normalized -like "replace-with-*" -or
    $normalized -like "optional-*" -or
    $normalized -eq "changeme" -or
    $normalized -like "*placeholder*" -or
    $normalized -like "*example.com*" -or
    $normalized -like "http://localhost*" -or
    $normalized -like "https://localhost*"
  )
}

function Invoke-VercelEnvAdd {
  param(
    [string]$Key,
    [string]$Value,
    [string]$TargetEnvironment,
    [bool]$Sensitive
  )

  $arguments = @("env", "add", $Key, $TargetEnvironment, "--force")

  if ($Sensitive) {
    $arguments += "--sensitive"
  }

  $Value | vercel @arguments
}

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  throw "Vercel CLI is not installed or is not available in PATH."
}

Write-Host "Reading remote Vercel env names for '$Environment'..."
$remoteSnapshotDirectory = Join-Path $PSScriptRoot ".vercel"
if (-not (Test-Path -LiteralPath $remoteSnapshotDirectory)) {
  New-Item -ItemType Directory -Path $remoteSnapshotDirectory | Out-Null
}
$remoteListFile = Join-Path $remoteSnapshotDirectory "env.remote.$Environment.txt"
vercel env ls $Environment | Tee-Object -FilePath $remoteListFile
Write-Host "Remote env name snapshot saved to $remoteListFile"

Write-Host "Reading local env file: $EnvFile"
$envValues = Read-DotEnvFile -Path $EnvFile

$syncedCount = 0
$skippedCount = 0

foreach ($entry in $envValues.GetEnumerator()) {
  $key = [string]$entry.Key
  $value = [string]$entry.Value

  if (Test-GeneratedVercelKey -Key $key) {
    Write-Host "SKIP generated Vercel/runtime key: $key"
    $skippedCount++
    continue
  }

  if ((-not $AllowPlaceholders) -and (Test-PlaceholderValue -Value $value)) {
    Write-Host "SKIP placeholder or empty value: $key"
    $skippedCount++
    continue
  }

  $isSensitive = Test-SensitiveKey -Key $key
  $sensitiveLabel = if ($isSensitive) { "sensitive" } else { "plain" }

  if ($DryRun) {
    Write-Host "DRY RUN would sync $key ($sensitiveLabel)"
    continue
  }

  Write-Host "Syncing $key ($sensitiveLabel)..."
  Invoke-VercelEnvAdd -Key $key -Value $value -TargetEnvironment $Environment -Sensitive $isSensitive
  $syncedCount++
}

Write-Host "Done. Synced: $syncedCount. Skipped: $skippedCount."

if ($Deploy) {
  if ($Environment -ne "production") {
    throw "-Deploy is only wired for production. Run vercel deploy manually for non-production targets."
  }

  Write-Host "Deploying production with updated envs..."
  vercel deploy --prod
} else {
  Write-Host "Next step: run 'vercel deploy --prod' so production uses the updated env values."
}
