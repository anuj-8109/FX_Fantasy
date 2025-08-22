# PowerShell script to convert TypeScript UI components to JavaScript
# This script will convert all .tsx files in the src/components/ui directory to .jsx

Write-Host "Starting conversion of UI components from TypeScript to JavaScript..." -ForegroundColor Green

# Get all .tsx files in the ui components directory
$tsxFiles = Get-ChildItem -Path "theme-swap-showcase-81-main/src/components/ui" -Filter "*.tsx" -Recurse

Write-Host "Found $($tsxFiles.Count) TypeScript files to convert" -ForegroundColor Yellow

foreach ($file in $tsxFiles) {
    $jsxPath = $file.FullName -replace '\.tsx$', '.jsx'
    
    Write-Host "Converting: $($file.Name) -> $([System.IO.Path]::GetFileName($jsxPath))" -ForegroundColor Cyan
    
    try {
        # Read the content
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # Remove TypeScript-specific syntax
        $content = $content -replace 'import type \{([^}]+)\} from', 'import {$1} from'
        $content = $content -replace ': React\.FC<[^>]*>', ''
        $content = $content -replace ': React\.FC', ''
        $content = $content -replace ': FC<[^>]*>', ''
        $content = $content -replace ': FC', ''
        $content = $content -replace ': ReactNode', ''
        $content = $content -replace ': string', ''
        $content = $content -replace ': number', ''
        $content = $content -replace ': boolean', ''
        $content = $content -replace ': any', ''
        $content = $content -replace ': undefined', ''
        $content = $content -replace ': null', ''
        $content = $content -replace ': \[[^\]]*\]', ''
        $content = $content -replace ': \{[^}]*\}', ''
        $content = $content -replace ': \([^)]*\)', ''
        $content = $content -replace ': \w+<[^>]*>', ''
        $content = $content -replace ': \w+', ''
        $content = $content -replace 'interface \w+[^{]*\{[^}]*\}', ''
        $content = $content -replace 'type \w+[^=]*=.*?;', ''
        $content = $content -replace 'const \w+: \w+ =', 'const $1 ='
        $content = $content -replace 'function \w+\([^)]*\): \w+', 'function $1($2)'
        $content = $content -replace 'export default \w+;', 'export default $1'
        
        # Write the converted content to the new .jsx file
        Set-Content -Path $jsxPath -Value $content -Encoding UTF8
        
        # Remove the original .tsx file
        Remove-Item -Path $file.FullName
        
        Write-Host "✓ Successfully converted $($file.Name)" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Error converting $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Conversion completed!" -ForegroundColor Green
Write-Host "All UI components have been converted from TypeScript to JavaScript." -ForegroundColor Green
