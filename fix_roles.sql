UPDATE model_has_roles SET model_type = 'Src\\Domain\\User\\Models\\User';
SELECT model_type, HEX(model_type) FROM model_has_roles LIMIT 1;
