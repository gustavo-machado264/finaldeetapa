document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCalorias');
  const resultadoDiv = document.getElementById('resultado');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultadoDiv.innerHTML = 'Calculando...';

    const payload = {
      sexo: document.getElementById('sexo').value,
      idade: Number(document.getElementById('idade').value),
      peso: Number(document.getElementById('peso').value),
      altura: Number(document.getElementById('altura').value),
      atividade: Number(document.getElementById('atividade').value),
      objetivo: document.getElementById('objetivo').value,
      preferencias: document.getElementById('preferencias').value
    };

    try {
      const res = await fetch("https://finaldeetapa-production.up.railway.app/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Erro na API: " + res.status);
      }

      const data = await res.json();
      resultadoDiv.innerHTML = `
        <h2>Resultado</h2>
        <p><strong>BMR:</strong> ${data.bmr.toFixed(0)} kcal/dia</p>
        <p><strong>TDEE:</strong> ${data.tdee.toFixed(0)} kcal/dia</p>
        <p><strong>Meta:</strong> ${data.targetCalories.toFixed(0)} kcal/dia</p>
        <h3>Recomendação da Nutricionista</h3>
        <div>${data.recommendation}</div>
      `;
    } catch
