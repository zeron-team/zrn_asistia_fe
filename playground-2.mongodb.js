
use('thesaurus_db');

db.thesaurus.find({
    "secundaria.ciclo_basico.grados.3.areas.lengua.temas.Gramática": { "$exists": true }
  })
  