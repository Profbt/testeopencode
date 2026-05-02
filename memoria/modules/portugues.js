// ==================== PORTUGUESE MODULE ====================
const PORTUGUES_MODULE = {
  id: 'portugues',
  name: 'Português',
  icon: '📖',
  color: '#f59e0b',
  colorLight: 'rgba(245, 158, 11, 0.1)',
  description: 'Encontre a palavra e seu significado',

  difficulties: {
    facil: {
      label: 'Fácil',
      pairs: 6,
      time: 90,
      generate: function() {
        const pool = [
          { word: 'Rápido', def: 'Veloz' },
          { word: 'Bonito', def: 'Formoso' },
          { word: 'Triste', def: 'Melancólico' },
          { word: 'Grande', def: 'Enorme' },
          { word: 'Feliz', def: 'Alegre' },
          { word: 'Cansado', def: 'Exausto' },
          { word: 'Bravo', def: 'Irritado' },
          { word: 'Calmo', def: 'Sereno' },
          { word: 'Rico', def: 'Abastado' },
          { word: 'Pobre', def: 'Carente' },
          { word: 'Doce', def: 'Açucarado' },
          { word: 'Forte', def: 'Robusto' }
        ];
        return shufflePairs(pool, this.pairs);
      }
    },
    medio: {
      label: 'Médio',
      pairs: 8,
      time: 120,
      generate: function() {
        const pool = [
          { word: 'Efêmero', def: 'Passageiro' },
          { word: 'Perspicaz', def: 'Sagaz' },
          { word: 'Intrépido', def: 'Corajoso' },
          { word: 'Taciturno', def: 'Silencioso' },
          { word: 'Obstinado', def: 'Teimoso' },
          { word: 'Frugal', def: 'Simples' },
          { word: 'Pródigo', def: 'Generoso' },
          { word: 'Idôneo', def: 'Apto' },
          { word: 'Insipiente', def: 'Ignorante' },
          { word: 'Prolixo', def: 'Extenso' },
          { word: 'Austero', def: 'Rigoroso' },
          { word: 'Benevolente', def: 'Bondoso' },
          { word: 'Diligente', def: 'Aplicado' },
          { word: 'Eloquente', def: 'Expressivo' },
          { word: 'Inócuo', def: 'Inofensivo' },
          { word: 'Mitigar', def: 'Suavizar' }
        ];
        return shufflePairs(pool, this.pairs);
      }
    },
    dificil: {
      label: 'Difícil',
      pairs: 10,
      time: 150,
      generate: function() {
        const pool = [
          { word: 'Pusilânime', def: 'Covarde' },
          { word: 'Sempiterno', def: 'Eterno' },
          { word: 'Quimera', def: 'Ilusão' },
          { word: 'Diacronia', def: 'Evolução' },
          { word: 'Anátema', def: 'Maldição' },
          { word: 'Cognição', def: 'Conhecimento' },
          { word: 'Empírico', def: 'Experimental' },
          { word: 'Inexorável', def: 'Implacável' },
          { word: 'Singular', def: 'Único' },
          { word: 'Vicissitude', def: 'Mudança' },
          { word: 'Archaico', def: 'Antigo' },
          { word: 'Ubíquo', def: 'Onipresente' },
          { word: 'Lânguido', def: 'Fraco' },
          { word: 'Nefasto', def: 'Desastroso' },
          { word: 'Onírico', def: 'Dos sonhos' },
          { word: 'Resiliência', def: 'Superação' },
          { word: 'Sibilante', def: 'Assobiado' },
          { word: 'Tergiversar', def: 'Enrolar' }
        ];
        return shufflePairs(pool, this.pairs);
      }
    },
    expert: {
      label: 'Expert',
      pairs: 12,
      time: 180,
      generate: function() {
        const pool = [
          { word: 'Fig. Linguagem', def: 'Ironia' },
          { word: 'Fig. Linguagem', def: 'Metáfora' },
          { word: 'Fig. Linguagem', def: 'Metonímia' },
          { word: 'Fig. Linguagem', def: 'Hipérbole' },
          { word: 'Fig. Linguagem', def: 'Eufemismo' },
          { word: 'Fig. Linguagem', def: 'Antonomásia' },
          { word: 'Antônimo de', def: 'Altruísmo → Egoísmo' },
          { word: 'Antônimo de', def: 'Efusão → Contenção' },
          { word: 'Coletivo de', def: 'Lobos → Alcateia' },
          { word: 'Coletivo de', def: 'Ilhas → Arquipélago' },
          { word: 'Coletivo de', def: 'Estrelas → Constelação' },
          { word: 'Coletivo de', def: 'Músicos → Orquestra' },
          { word: 'Parônimo de', def: 'Descrição → Discrição' },
          { word: 'Parônimo de', def: 'Emergir → Imergir' },
          { word: 'Parônimo de', def: 'Ratificar → Retificar' },
          { word: 'Parônimo de', def: 'Deferir → Diferir' }
        ];
        return shufflePairs(pool, this.pairs);
      }
    }
  }
};

function shufflePairs(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  return selected.map((item, i) => ({
    cardA: item.word,
    cardB: item.def,
    pairId: i
  }));
}
