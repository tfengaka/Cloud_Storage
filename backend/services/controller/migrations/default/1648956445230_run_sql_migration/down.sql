-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE FUNCTION public.move_file(from_path text, to_path text)
--  RETURNS SETOF files
--  LANGUAGE sql
-- AS $function$ UPDATE files SET path = to_path || '/' || substr(path, strpos(path, right(from_path, 36)))
-- WHERE path SIMILAR TO (from_path || '%') RETURNING * $function$;
