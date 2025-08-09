-- Custom SQL additions after prisma migrate dev --create-only
-- Ensure GIN index on events.props for JSONB queries
CREATE INDEX IF NOT EXISTS events_props_gin ON "events" USING GIN ((props));


