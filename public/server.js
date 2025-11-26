require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ SERVE ESTÁTICO VEM POR ÚLTIMO! (ou remova no Railway)
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// 🔥 SUAS ROTAS DEVEM VIR ANTES DO SERVE ESTÁTICO
app.post('/api/calculate', async (req, res) => {
  try {
    const { sexo, idade, peso, altura, atividade, objetivo, preferencias } = req.body;

    const bmr = 10 * peso + 6.25 * altura - 5 * idade + (sexo === 'masculino' ? 5 : -161);
    const tdee = bmr * atividade;
    const targetCalories = objetivo === 'emagrecer'
      ? Math.max(1200, tdee - 500)
      : objetivo === 'ganhar'
        ? tdee + 300
        : tdee;

    res.json({
      bmr, tdee, targetCalories,
      recommendation: "API funcionando sem Groq."
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ⚠️ SOMENTE NO DESENVOLVIMENTO
if (process.env.NODE_ENV !== "production") {
  app.use(express.static(path.join(__dirname, 'public')));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta " + PORT));
