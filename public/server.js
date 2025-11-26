require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('API funcionando! Use o frontend pelo Live Server 🙂');
});

const GROQ_API_KEY = process.env.GROQ_API_KEY;

function calcBMR({ sexo, peso, altura, idade }) {
  if (sexo === 'masculino') {
    return 10 * peso + 6.25 * altura - 5 * idade + 5;
  } else {
    return 10 * peso + 6.25 * altura - 5 * idade - 161;
  }
}

function determineTargetCalories(tdee, objetivo) {
  switch (objetivo) {
    case 'emagrecer': return Math.max(1200, tdee - 500);
    case 'ganhar': return tdee + 300;
    default: return tdee;
  }
}

app.post('/api/calculate', async (req, res) => {
  try {
    const { sexo, idade, peso, altura, atividade, objetivo, preferencias } = req.body;

    const bmr = calcBMR({ sexo, peso, altura, idade });
    const tdee = bmr * atividade;
    const targetCalories = determineTargetCalories(tdee, objetivo);

    if (!GROQ_API_KEY) {
      return res.json({
        bmr, tdee, targetCalories,
        recommendation: "API Key Groq ausente."
      });
    }

    const prompt = `
    Gere uma recomendação nutricional.
    Sexo: ${sexo}
    Idade: ${idade}
    Peso: ${peso}
    Altura: ${altura}
    Atividade: ${atividade}
    Objetivo: ${objetivo}
    Preferências: ${preferencias}
    BMR: ${Math.round(bmr)}
    TDEE: ${Math.round(tdee)}
    Meta: ${Math.round(targetCalories)}
    `;

    const groq = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const json = await groq.json();

    res.json({
      bmr, tdee, targetCalories,
      recommendation: json.choices?.[0]?.message?.content ?? "Falha ao gerar recomendação."
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta " + PORT));
