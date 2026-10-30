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

-- One demo module per taught language (pick one with DEMO_LANG, see RUNBOOK).
insert into "LingoModule" (id, language, cefr_level, class_topic, title) values
  ('22222222-2222-2222-2222-222222222222', 'EN', 'A2', 'Simple Past', 'The simple past'),
  ('33333333-3333-3333-3333-333333333333', 'IT', 'A2', 'Passato Prossimo con Essere', 'Il passato prossimo'),
  ('44444444-4444-4444-4444-444444444444', 'PT', 'A2', 'Pretérito Perfeito', 'O pretérito perfeito'),
  ('55555555-5555-5555-5555-555555555555', 'DE', 'A2', 'Perfekt mit Sein', 'Das Perfekt');

insert into "LingoExercise" (module_id, type, question, options, correct_answer, audio_url) values
  ('22222222-2222-2222-2222-222222222222', 'MULTIPLE_CHOICE', 'She ___ home late last night.',
   '["go", "went", "goes", "going"]', 'went', null),
  ('22222222-2222-2222-2222-222222222222', 'FILL_BLANK', 'We ___ at eight o''clock. (arrive)',
   '[]', 'arrived', null),
  ('22222222-2222-2222-2222-222222222222', 'FILL_BLANK', 'I ___ ___ to the cinema. (not go)',
   '[]', 'didn''t|go', null),
  ('22222222-2222-2222-2222-222222222222', 'LISTENING', '¿Adónde fue la persona?',
   '["To the cinema", "To the market", "To the beach", "To work"]', 'To the market', 'demo/i-went.wav'),

  ('33333333-3333-3333-3333-333333333333', 'MULTIPLE_CHOICE', 'Lei ___ partita ieri sera.',
   '["ha", "è", "era", "sarà"]', 'è', null),
  ('33333333-3333-3333-3333-333333333333', 'FILL_BLANK', 'Noi ___ arrivati alle otto.',
   '[]', 'siamo', null),
  ('33333333-3333-3333-3333-333333333333', 'FILL_BLANK', 'Io ___ ___ al cinema.',
   '[]', 'sono|andato', null),
  ('33333333-3333-3333-3333-333333333333', 'LISTENING', '¿Adónde fue la persona?',
   '["Al cinema", "Al mercato", "Al mare", "Al lavoro"]', 'Al mercato', 'demo/sono-andata.wav'),

  ('44444444-4444-4444-4444-444444444444', 'MULTIPLE_CHOICE', 'Ela ___ ontem à noite.',
   '["sai", "saiu", "sairá", "saía"]', 'saiu', null),
  ('44444444-4444-4444-4444-444444444444', 'FILL_BLANK', 'Nós ___ às oito horas. (chegar)',
   '[]', 'chegamos', null),
  ('44444444-4444-4444-4444-444444444444', 'FILL_BLANK', 'Eu ___ ao cinema. (ir)',
   '[]', 'fui', null),
  ('44444444-4444-4444-4444-444444444444', 'LISTENING', '¿Adónde fue la persona?',
   '["Ao cinema", "Ao mercado", "À praia", "Ao trabalho"]', 'Ao mercado', 'demo/eu-fui.wav'),

  ('55555555-5555-5555-5555-555555555555', 'MULTIPLE_CHOICE', 'Sie ___ gestern Abend abgefahren.',
   '["hat", "ist", "war", "wird"]', 'ist', null),
  ('55555555-5555-5555-5555-555555555555', 'FILL_BLANK', 'Wir ___ um acht Uhr angekommen.',
   '[]', 'sind', null),
  ('55555555-5555-5555-5555-555555555555', 'FILL_BLANK', 'Ich ___ ins Kino ___.',
   '[]', 'bin|gegangen', null),
  ('55555555-5555-5555-5555-555555555555', 'LISTENING', '¿Adónde fue la persona?',
   '["Ins Kino", "Zum Markt", "An den Strand", "Zur Arbeit"]', 'Zum Markt', 'demo/ich-bin-gegangen.wav');
