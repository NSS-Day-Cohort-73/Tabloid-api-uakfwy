#!/bin/bash
# Set the database name (modify this to match your database name)
DB_NAME="Tabloid"
# Set the EF Core command variables

# Drop the database
echo "Dropping database: $DB_NAME..."
dotnet ef database drop --force
# Apply migrations
echo "Applying migrations..."
dotnet ef database update
echo "Database reset complete!"
