// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // npm i node-fetch@2
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* variáveis de ambiente obrigatórias
const GROQ_API_URL = process.env.GROQ_API_URL; // ex: https://api.groq.ai/v1/models/...
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_URL || !GROQ_API_KEY) {
  console.warn('Aviso: GROQ_API_URL ou GROQ_API_KEY não definidos no .env');
}
*/
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
    case 'emagrecer':
      return Math.max(1200, tdee - 500); // limite mínimo
    case 'ganhar':
      return tdee + 300; // leve excedente
    case 'manter':
    default:
      return tdee;
  }
}

app.post('/api/calculate', async (req, res) => {
  try {
    const { sexo, idade, peso, altura, atividade, frequencia, objetivo, preferencias, atividades } = req.body;

    // validação mínima
    if (!sexo || !idade || !peso || !altura || !atividade) {
      return res.status(400).send('Parâmetros insuficientes');
    }

    const bmr = calcBMR({ sexo, peso: Number(peso), altura: Number(altura), idade: Number(idade) });
    const tdee = bmr * Number(atividade);
    const targetCalories = determineTargetCalories(tdee, objetivo);

    // construir prompt para Groq
    const prompt = `
Você é uma nutricionista experiente. Com base nos dados abaixo, gere uma recomendação prática e objetiva:
- Sexo: ${sexo}
- Idade: ${idade}
- Peso (kg): ${peso}
- Altura (cm): ${altura}
- Nível de atividade (fator): ${atividade}
- Frequência de treinos por semana: ${frequencia || 'não informado'}
- Atividades: ${Array.isArray(atividades) ? atividades.join(', ') : (atividades || 'não informado')}
- Objetivo: ${objetivo}
- Preferências / restrições informadas pelo usuário: ${preferencias || 'nenhuma especificada'}
- BMR estimado: ${Math.round(bmr)} kcal/dia
- TDEE estimado: ${Math.round(tdee)} kcal/dia
- Meta calórica sugerida: ${Math.round(targetCalories)} kcal/dia

A saída deve conter:
1) Um parágrafo curto explicando por que essa meta calórica.
2) Um plano alimentar resumido para 1 dia (café, almoço, jantar e 2 lanches) com porções e calorias aproximadas que cheguem perto da meta calórica.
3) Dicas práticas (compra/receitas rápidas) de acordo com os gostos do usuário.
4) Se houver restrições mencionadas (ex: lactose, glúten, vegetarianismo), adapte as sugestões.

Seja conciso, direto e entregue em português.
    `;

    // fallback: se NÃO tiver chave do Groq, retornamos apenas cálculo e instrução
    if (!GROQ_API_KEY || !GROQ_API_URL) {
      return res.json({
        bmr,
        tdee,
        targetCalories,
        recommendation:
          'API do Groq não configurada no servidor (.env). Configure GROQ_API_URL e GROQ_API_KEY para obter a recomendação da nutricionista via IA.'
      });
    }

    // Chamada à API do Groq
    // Observação: a forma concreta do body depende da API Groq específica (modelo / campos).
    // Aqui usamos um formato genérico: { prompt: "...", max_tokens: 800 }
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 800
      })
    });

    if (!groqResponse.ok) {
      const txt = await groqResponse.text();
      console.error('Erro Groq:', txt);
      return res.status(502).send('Erro na chamada da API do Groq: ' + txt);
    }

    // interpretação da resposta (ajuste conforme formato real do Groq)
    const groqJson = await groqResponse.json();

    // a resposta real pode vir em groqJson.output, groqJson.choices[0].text, etc.
    // Aqui tentamos capturar texto em campos comuns; adapte se necessário.
    let recommendationText = '';
    if (groqJson.choices && groqJson.choices[0] && groqJson.choices[0].text) {
      recommendationText = groqJson.choices[0].text;
    } else if (groqJson.output && typeof groqJson.output === 'string') {
      recommendationText = groqJson.output;
    } else if (groqJson.result) {
      recommendationText = JSON.stringify(groqJson.result, null, 2);
    } else {
      // fallback: stringify
      recommendationText = JSON.stringify(groqJson, null, 2);
    }

    return res.json({
      bmr,
      tdee,
      targetCalories,
      recommendation: recommendationText
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno: ' + err.message);
  }
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
