document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCalorias');
  const resultadoDiv = document.getElementById('resultado');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultadoDiv.innerHTML = 'Calculando...';

    const sexo = document.getElementById('sexo').value;
    const idade = Number(document.getElementById('idade').value);
    const peso = Number(document.getElementById('peso').value);
    const altura = Number(document.getElementById('altura').value);
    const atividade = Number(document.getElementById('atividade').value);
    const frequencia = document.getElementById('frequencia').value;
    const objetivo = document.getElementById('objetivo').value;
    const preferencias = document.getElementById('preferencias').value || '';

    const atividades = Array.from(
      document.querySelectorAll('input[name="atividades"]:checked')
    ).map(i => i.value);

    try {
      const res = await fetch("https://finaldeetapa-production.up.railway.app/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sexo, idade, peso, altura, atividade,
          frequencia, objetivo, preferencias, atividades
        })
      });

      const data = await res.json();

      resultadoDiv.innerHTML = `
      <h2>Resultado</h2>
      <p><strong>BMR:</strong> ${data.bmr.toFixed(0)} kcal/dia</p>
      <p><strong>TDEE:</strong> ${data.tdee.toFixed(0)} kcal/dia</p>
      <p><strong>Meta:</strong> ${data.targetCalories.toFixed(0)} kcal/dia</p>
      <h3>Recomendação da Nutricionista</h3>
      <div>${data.recommendation}</div>
      `;
    } catch (err) {
      resultadoDiv.innerHTML = `<p style="color:red;">Erro ao conectar à API.</p>`;
      console.error(err);
    }
  });
});
