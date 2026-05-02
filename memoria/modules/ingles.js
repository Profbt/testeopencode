// ==================== ENGLISH MODULE ====================
const INGLES_MODULE = {
  id: 'ingles',
  name: 'Inglês',
  icon: '🇺🇸',
  color: '#ef4444',
  colorLight: 'rgba(239, 68, 68, 0.1)',
  description: 'Encontre a palavra em inglês e sua tradução',

  difficulties: {
    facil: {
      label: 'Fácil',
      pairs: 6,
      time: 90,
      generate: function() {
        const pool = [
          { en: 'Dog', pt: 'Cachorro' },
          { en: 'Cat', pt: 'Gato' },
          { en: 'House', pt: 'Casa' },
          { en: 'Water', pt: 'Água' },
          { en: 'Book', pt: 'Livro' },
          { en: 'Sun', pt: 'Sol' },
          { en: 'Moon', pt: 'Lua' },
          { en: 'Tree', pt: 'Árvore' },
          { en: 'Fish', pt: 'Peixe' },
          { en: 'Bird', pt: 'Pássaro' },
          { en: 'Fire', pt: 'Fogo' },
          { en: 'Sky', pt: 'Céu' },
          { en: 'Red', pt: 'Vermelho' },
          { en: 'Blue', pt: 'Azul' },
          { en: 'Green', pt: 'Verde' }
        ];
        return shufflePairsEN(pool, this.pairs);
      }
    },
    medio: {
      label: 'Médio',
      pairs: 8,
      time: 120,
      generate: function() {
        const pool = [
          { en: 'Butterfly', pt: 'Borboleta' },
          { en: 'Knowledge', pt: 'Conhecimento' },
          { en: 'Journey', pt: 'Jornada' },
          { en: 'Strength', pt: 'Força' },
          { en: 'Shadow', pt: 'Sombra' },
          { en: 'Dream', pt: 'Sonho' },
          { en: 'Courage', pt: 'Coragem' },
          { en: 'Freedom', pt: 'Liberdade' },
          { en: 'Wisdom', pt: 'Sabedoria' },
          { en: 'Thunder', pt: 'Trovão' },
          { en: 'Mountain', pt: 'Montanha' },
          { en: 'Ocean', pt: 'Oceano' },
          { en: 'Forest', pt: 'Floresta' },
          { en: 'Bridge', pt: 'Ponte' },
          { en: 'Castle', pt: 'Castelo' }
        ];
        return shufflePairsEN(pool, this.pairs);
      }
    },
    dificil: {
      label: 'Difícil',
      pairs: 10,
      time: 150,
      generate: function() {
        const pool = [
          { en: 'Overwhelm', pt: 'Sobrecarregar' },
          { en: 'Achievement', pt: 'Conquista' },
          { en: 'Breathtaking', pt: 'Impressionante' },
          { en: 'Resilience', pt: 'Resiliência' },
          { en: 'Flawless', pt: 'Impecável' },
          { en: 'Foresight', pt: 'Previsão' },
          { en: 'Hindrance', pt: 'Obstáculo' },
          { en: 'Reluctant', pt: 'Relutante' },
          { en: 'Bewilder', pt: 'Desconcertar' },
          { en: 'Compassion', pt: 'Compaixão' },
          { en: 'Endeavor', pt: 'Empreendimento' },
          { en: 'Gratitude', pt: 'Gratidão' },
          { en: 'Perseverance', pt: 'Perseverança' },
          { en: 'Serenity', pt: 'Serenidade' },
          { en: 'Vulnerability', pt: 'Vulnerabilidade' }
        ];
        return shufflePairsEN(pool, this.pairs);
      }
    },
    expert: {
      label: 'Expert',
      pairs: 12,
      time: 180,
      generate: function() {
        const pool = [
          { en: 'Catch a cold', pt: 'Pegar resfriado' },
          { en: 'Run out of', pt: 'Ficar sem' },
          { en: 'Look forward to', pt: 'Ansioso por' },
          { en: 'Break the ice', pt: 'Quebrar o gelo' },
          { en: 'Piece of cake', pt: 'Moleza' },
          { en: 'Hit the nail', pt: 'Acertar em cheio' },
          { en: 'Cost an arm', pt: 'Cortar os pulsos' },
          { en: 'Once in a blue', pt: 'De vez em quando' },
          { en: 'Burn bridges', pt: 'Queimar pontes' },
          { en: 'Spill the beans', pt: 'Contar o segredo' },
          { en: 'Under the weather', pt: 'Sentindo-se mal' },
          { en: 'Hit the sack', pt: 'Ir dormir' },
          { en: 'Let the cat out', pt: 'Revelar segredo' },
          { en: 'Bite the bullet', pt: 'Engolir o sapo' },
          { en: 'Cut to the chase', pt: 'Ir direto ao ponto' }
        ];
        return shufflePairsEN(pool, this.pairs);
      }
    }
  }
};

function shufflePairsEN(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  return selected.map((item, i) => ({
    cardA: item.en,
    cardB: item.pt,
    pairId: i
  }));
}
