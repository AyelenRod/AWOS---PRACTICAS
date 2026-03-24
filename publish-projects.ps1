$projects = @(
    @{ folder = "API_DISNEY"; branch = "api-disney" },
    @{ folder = "CONSUMO DE APIS"; branch = "consumo-apis" },
    @{ folder = "FIRST_PROJECT_NEXT"; branch = "first-project-next" },
    @{ folder = "JSON"; branch = "json" },
    @{ folder = "PRACTICA-NEXT y BDA"; branch = "practica-next-y-bda" },
    @{ folder = "PRACTICA_NEXT_BDA"; branch = "practica-next-bda" },
    @{ folder = "TAREA CON NEXT"; branch = "tarea-con-next" },
    @{ folder = "bug-tracker-mvp"; branch = "bug-tracker-mvp" },
    @{ folder = "REPO\awos-products-fullstack-template"; branch = "awos-products-fullstack" }
)

$root = (Get-Location).Path

# Backup nested .git folders
Write-Host "Backing up nested .git folders..." -ForegroundColor Cyan
Get-ChildItem -Path "." -Filter ".git" -Recurse -Hidden -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.FullName -ne (Join-Path $root ".git")) {
        $parent = Split-Path $_.FullName
        $newName = Join-Path $parent ".git_bak"
        if (!(Test-Path $newName)) {
            Write-Host "Renaming $($_.FullName) to .git_bak"
            Rename-Item $_.FullName ".git_bak" -Force
        }
    }
}

foreach ($p in $projects) {
    $folder = $p.folder
    $branch = $p.branch
    Write-Host "`n>>> Processing '$folder' into branch '$branch'..." -ForegroundColor Cyan

    # Always start from main
    git checkout main --quiet

    # Add the folder contents (respecting .gitignore)
    Write-Host "Adding files for '$folder'..."
    git add "$folder"
    
    # Check if anything was added
    $status = git status --porcelain
    if ($status) {
        git commit -m "Temp commit for $folder" --quiet
        
        Write-Host "Splitting folder into branch..."
        # Use subtree split. We use -b to create a branch, but we push it directly.
        # Actually split creates a commit SHA. We can branch it.
        git subtree split --prefix="$folder" -b "$branch-temp"
        
        # Push to origin
        Write-Host "Pushing to origin branch '$branch'..." -ForegroundColor Green
        git push origin "$branch-temp`:$branch" -f --quiet
        Write-Host "Success!" -ForegroundColor Green
        
        # Cleanup temp branch
        git branch -D "$branch-temp" --quiet
        
        # Pop the temp commit from main
        git checkout main --quiet
        git reset --hard HEAD~1 --quiet
    } else {
        Write-Warning "Nothing to add for '$folder' (maybe all ignored?)"
    }
}

# Restore nested .git folders
Write-Host "`nRestoring nested .git folders..." -ForegroundColor Cyan
Get-ChildItem -Path "." -Filter ".git_bak" -Recurse -Hidden -ErrorAction SilentlyContinue | ForEach-Object {
    $parent = Split-Path $_.FullName
    $newName = Join-Path $parent ".git"
    Write-Host "Renaming $($_.FullName) back to .git"
    Rename-Item $_.FullName ".git" -Force
}

# Final cleanup
git checkout main --quiet
git reset --hard origin/main --quiet
git clean -fd --quiet

Write-Host "`nALL DONE!" -ForegroundColor Cyan
