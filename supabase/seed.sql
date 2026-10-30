-- Local demo module: one exercise of each type.
insert into "LingoModule" (id, language, cefr_level, class_topic, title) values
  ('11111111-1111-1111-1111-111111111111', 'FR', 'A2', 'Passé Composé con Être', 'Le passé composé');

insert into "LingoExercise" (module_id, type, question, options, correct_answer, audio_url) values
  ('11111111-1111-1111-1111-111111111111', 'MULTIPLE_CHOICE', 'Elle ___ partie hier soir.',
   '["a", "est", "était", "sera"]', 'est', null),
  ('11111111-1111-1111-1111-111111111111', 'FILL_BLANK', 'Nous ___ arrivés à huit heures.',
   '[]', 'sommes', null),
  ('11111111-1111-1111-1111-111111111111', 'FILL_BLANK', 'Je ___ ___ au cinéma.',
   '[]', 'suis|allé', null),
  ('11111111-1111-1111-1111-111111111111', 'LISTENING', '¿Adónde fue la persona?',
   '["Au cinéma", "Au marché", "À la plage", "Au travail"]', 'Au marché', 'demo/je-suis-alle.wav');
