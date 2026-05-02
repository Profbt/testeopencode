// ==================== ANIMALS MODULE (Visual with Pollinations AI) ====================
const ANIMAIS_MODULE = {
  id: 'animais',
  name: 'Animais',
  icon: '🐾',
  color: '#22c55e',
  colorLight: 'rgba(34, 197, 94, 0.1)',
  description: 'Encontre o animal e seu nome',
  visual: true,

  difficulties: {
    facil: {
      label: 'Fácil',
      pairs: 6,
      time: 120,
      generate: function() {
        const pool = [
          { img: pollinate('cute cartoon dog playing', 1), text: '🐕 Cão' },
          { img: pollinate('cute cartoon cat sitting', 2), text: '🐈 Gato' },
          { img: pollinate('cute cartoon elephant walking', 3), text: '🐘 Elefante' },
          { img: pollinate('cute cartoon lion sitting', 4), text: '🦁 Leão' },
          { img: pollinate('cute cartoon fish swimming', 5), text: '🐟 Peixe' },
          { img: pollinate('cute cartoon bird flying', 6), text: '🐦 Pássaro' },
          { img: pollinate('cute cartoon rabbit hopping', 7), text: '🐰 Coelho' },
          { img: pollinate('cute cartoon turtle walking', 8), text: '🐢 Tartaruga' },
          { img: pollinate('cute cartoon butterfly on flower', 9), text: '🦋 Borboleta' },
          { img: pollinate('cute cartoon horse running', 10), text: '🐴 Cavalo' }
        ];
        return shuffleAnimalPairs(pool, this.pairs);
      }
    },
    medio: {
      label: 'Médio',
      pairs: 8,
      time: 150,
      generate: function() {
        const pool = [
          { img: pollinate('realistic giraffe in savanna', 11), text: '🦒 Girafa' },
          { img: pollinate('realistic penguin on ice', 12), text: '🐧 Pinguim' },
          { img: pollinate('realistic dolphin jumping water', 13), text: '🐬 Golfinho' },
          { img: pollinate('realistic owl on branch night', 14), text: '🦉 Coruja' },
          { img: pollinate('realistic fox in forest autumn', 15), text: '🦊 Raposa' },
          { img: pollinate('realistic whale in ocean', 16), text: '🐋 Baleia' },
          { img: pollinate('realistic snake in jungle', 17), text: '🐍 Cobra' },
          { img: pollinate('realistic frog on lily pad', 18), text: '🐸 Sapo' },
          { img: pollinate('realistic eagle flying sky', 19), text: '🦅 Águia' },
          { img: pollinate('realistic panda eating bamboo', 20), text: '🐼 Panda' },
          { img: pollinate('realistic flamingo in water', 21), text: '🦩 Flamingo' },
          { img: pollinate('realistic kangaroo in australia', 22), text: '🦘 Canguru' }
        ];
        return shuffleAnimalPairs(pool, this.pairs);
      }
    },
    dificil: {
      label: 'Difícil',
      pairs: 10,
      time: 180,
      generate: function() {
        const pool = [
          { img: pollinate('cute chameleon cartoon illustration', 23), text: '🦎 Camaleão' },
          { img: pollinate('cute hedgehog cartoon illustration', 24), text: '🦔 Ouriço' },
          { img: pollinate('cute octopus cartoon underwater', 25), text: '🐙 Polvo' },
          { img: pollinate('cute parrot cartoon tropical', 26), text: '🦜 Papagaio' },
          { img: pollinate('cute bat cartoon flying night', 27), text: '🦇 Morcego' },
          { img: pollinate('cute raccoon cartoon illustration', 28), text: '🦝 Guaxinim' },
          { img: pollinate('cute shark cartoon underwater', 29), text: '🦈 Tubarão' },
          { img: pollinate('cute koala cartoon on tree', 30), text: '🐨 Coala' },
          { img: pollinate('cute crocodile cartoon swamp', 31), text: '🐊 Crocodilo' },
          { img: pollinate('cute seal cartoon on beach', 32), text: '🦭 Foca' },
          { img: pollinate('cute lobster cartoon underwater', 33), text: '🦞 Lagosta' },
          { img: pollinate('cute swan cartoon on lake', 34), text: '🦢 Cisne' },
          { img: pollinate('cute scorpion cartoon desert', 35), text: '🦂 Escorpião' },
          { img: pollinate('cute peacock cartoon colorful', 36), text: '🦚 Pavão' }
        ];
        return shuffleAnimalPairs(pool, this.pairs);
      }
    },
    expert: {
      label: 'Expert',
      pairs: 12,
      time: 200,
      generate: function() {
        const pool = [
          { img: pollinate('realistic toucan bird amazon', 37), text: '🦅 Tucano' },
          { img: pollinate('realistic capybara in wetland', 38), text: '🦫 Capivara' },
          { img: pollinate('realistic tapir in jungle', 39), text: '🦏 Anta' },
          { img: pollinate('realistic armadillo in brazil', 40), text: '🦔 Tatu' },
          { img: pollinate('realistic jaguar in rainforest', 41), text: '🐆 Onça' },
          { img: pollinate('realistic macaw parrot colorful', 42), text: '🦜 Arara' },
          { img: pollinate('realistic toucan tropical bird', 43), text: '🐦 Tucano' },
          { img: pollinate('realistic sloth hanging tree', 44), text: '🦥 Preguiça' },
          { img: pollinate('realistic anaconda in river', 45), text: '🐍 Sucuri' },
          { img: pollinate('realistic piranha fish in water', 46), text: '🐟 Piranha' },
          { img: pollinate('realistic caiman in pantanal', 47), text: '🐊 Jacaré' },
          { img: pollinate('realistic manatee in amazon river', 48), text: '🦭 Peixe-boi' }
        ];
        return shuffleAnimalPairs(pool, this.pairs);
      }
    }
  }
};

function pollinate(prompt, seed) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=256&height=256&nologo=true&model=turbo&seed=${seed}`;
}

function shuffleAnimalPairs(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  return selected.map((item, i) => ({
    cardA: { content: item.img, isImage: true },
    cardB: { content: item.text, isImage: false },
    pairId: i
  }));
}
