-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE FUNCTION public.move_file(from_path text, to_path text)
--  RETURNS SETOF files
--  LANGUAGE plpgsql
-- AS $function$
-- DECLARE currPath TEXT;
-- BEGIN
--     currPath = to_path || '/' || substr(path, strpos(path, right(from_path, 36)));
--     UPDATE files SET path = currPath, layer = length(regexp_replace(path, '[^/]', '', 'g'))
--     WHERE path SIMILAR TO (from_path || '%')
-- RETURNING *;
-- END;
-- $function$;
