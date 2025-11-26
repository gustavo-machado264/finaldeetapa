require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// util: calcula BMR usando Mifflin-St Jeor
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
    case 'manter': default: return tdee;
  }
}

app.post('/api/calculate', async (req, res) => {
  try {
    const { sexo, idade, peso, altura, atividade, frequencia, objetivo, preferencias, atividades } = req.body;

    if (!sexo || !idade || !peso || !altura || !atividade) {
      return res.status(400).send('Parâmetros insuficientes');
    }

    const bmr = calcBMR({ sexo, peso, altura, idade });
    const tdee = bmr * atividade;
    const targetCalories = determineTargetCalories(tdee, objetivo);

    const prompt = `
Você é uma nutricionista experiente. Com base nos dados abaixo, gere uma recomendação prática e objetiva:
- Sexo: ${sexo}
- Idade: ${idade}
- Peso: ${peso}
- Altura: ${altura}
- Nível de atividade: ${atividade}
- Frequência: ${frequencia}
- Atividades: ${atividades?.join(', ')}
- Objetivo: ${objetivo}
- Preferências: ${preferencias}
- BMR: ${Math.round(bmr)}
- TDEE: ${Math.round(tdee)}
- Meta: ${Math.round(targetCalories)}
    `;

    if (!GROQ_API_KEY) {
      return res.json({
        bmr, tdee, targetCalories,
        recommendation: 'API do Groq não configurada.'
      });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!groqResponse.ok) {
      const txt = await groqResponse.text();
      console.error("=== ERRO GROQ RAW ===");
      console.error(txt);
      return res.status(502).send(txt);
    }

    const groqJson = await groqResponse.json();

    const recommendationText =
      groqJson.choices?.[0]?.message?.content || "Sem resposta da IA.";

    return res.json({
      bmr,
      tdee,
      targetCalories,
      recommendation: recommendationText
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
app.get('/', (req, res) => {
  res.send('API funcionando! Use o frontend pelo Live Server 🙂');
});
