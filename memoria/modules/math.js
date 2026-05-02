// ==================== MATH MODULE ====================
const MATH_MODULE = {
  id: 'math',
  name: 'Matemática',
  icon: '🔢',
  color: '#3b82f6',
  colorLight: 'rgba(59, 130, 246, 0.1)',
  description: 'Encontre a conta e seu resultado',

  difficulties: {
    facil: {
      label: 'Fácil',
      pairs: 6,
      time: 90,
      generate: function() {
        const pairs = [];
        const used = new Set();
        while (pairs.length < this.pairs) {
          let a, b, op, result, key;
          if (Math.random() > 0.5) {
            a = randInt(2, 15);
            b = randInt(1, 10);
            op = '+';
            result = a + b;
          } else {
            a = randInt(5, 20);
            b = randInt(1, a);
            op = '−';
            result = a - b;
          }
          key = `${a} ${op} ${b}`;
          if (!used.has(key)) {
            used.add(key);
            pairs.push({ cardA: key, cardB: String(result), pairId: pairs.length });
          }
        }
        return pairs;
      }
    },
    medio: {
      label: 'Médio',
      pairs: 8,
      time: 120,
      generate: function() {
        const pairs = [];
        const used = new Set();
        while (pairs.length < this.pairs) {
          const a = randInt(2, 9);
          const b = randInt(2, 9);
          const key = `${a} × ${b}`;
          if (!used.has(key)) {
            used.add(key);
            pairs.push({ cardA: key, cardB: String(a * b), pairId: pairs.length });
          }
        }
        return pairs;
      }
    },
    dificil: {
      label: 'Difícil',
      pairs: 10,
      time: 150,
      generate: function() {
        const pairs = [];
        const used = new Set();
        while (pairs.length < this.pairs) {
          let a, b, op, result, key;
          const type = Math.random();
          if (type < 0.35) {
            a = randInt(2, 9);
            b = randInt(2, 9);
            op = '×';
            result = a * b;
          } else if (type < 0.7) {
            b = randInt(2, 9);
            result = randInt(2, 9);
            a = b * result;
            op = '÷';
          } else {
            a = randInt(10, 50);
            b = randInt(1, a - 1);
            op = '−';
            result = a - b;
          }
          key = `${a} ${op} ${b}`;
          if (!used.has(key)) {
            used.add(key);
            pairs.push({ cardA: key, cardB: String(result), pairId: pairs.length });
          }
        }
        return pairs;
      }
    },
    expert: {
      label: 'Expert',
      pairs: 12,
      time: 180,
      generate: function() {
        const pairs = [];
        const used = new Set();
        while (pairs.length < this.pairs) {
          let equation, answer, key;
          const type = Math.random();
          if (type < 0.33) {
            const x = randInt(2, 12);
            const a = randInt(2, 9);
            const b = randInt(1, 20);
            equation = `${a}x + ${b} = ${a * x + b}`;
            answer = String(x);
          } else if (type < 0.66) {
            const a = randInt(2, 8);
            const b = randInt(2, 8);
            const c = randInt(1, 10);
            equation = `${a} × ${b} + ${c}`;
            answer = String(a * b + c);
          } else {
            const base = randInt(2, 5);
            const exp = randInt(2, 3);
            equation = `${base}²`;
            if (exp === 3) equation = `${base}³`;
            answer = exp === 2 ? String(base * base) : String(base * base * base);
          }
          key = equation;
          if (!used.has(key)) {
            used.add(key);
            pairs.push({ cardA: key, cardB: answer, pairId: pairs.length });
          }
        }
        return pairs;
      }
    }
  }
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
