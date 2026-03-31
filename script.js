/* ══════════════════════════════════════════
   NexCore NF — script.js
   Mesma lógica do original: gerar(pdf, print)
   + cálculo automático de total
══════════════════════════════════════════ */

/* ── Calcula total automaticamente ── */
function calcTotal() {
  const qty   = parseFloat(document.getElementById('c14').value) || 0;
  const price = parseFloat(document.getElementById('c15').value) || 0;
  const total = qty * price;
  document.getElementById('c16').value = total > 0 ? fmtBRL(total) : '';
}

/* ── Formata moeda pt-BR ── */
function fmtBRL(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* ── Formata data legível ── */
function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const meses = ['janeiro','fevereiro','março','abril','maio','junho',
                 'julho','agosto','setembro','outubro','novembro','dezembro'];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`;
}

/* ══════════════════════════════════════════
   gerar() — mesma assinatura do original
   gerar()           → só visualiza
   gerar(true)       → gera PDF
   gerar(false,true) → imprime
══════════════════════════════════════════ */
function gerar(pdf = false, print = false) {

  /* 1. Transfere os campos do form → spans do relatório */
  for (let i = 1; i <= 17; i++) {
    const input = document.getElementById(`c${i}`);
    const span  = document.getElementById(`r${i}`);
    if (!input || !span) continue;
    span.textContent = input.value;
  }

  /* 2. Sobrescreve campos com formatação especial */

  // Data legível
  document.getElementById('r10').textContent = fmtDate(document.getElementById('c10').value);

  // Valores em BRL
  const qty   = parseFloat(document.getElementById('c14').value) || 0;
  const price = parseFloat(document.getElementById('c15').value) || 0;
  const total = qty * price;

  document.getElementById('r15').textContent = price > 0 ? fmtBRL(price) : '—';
  document.getElementById('r16').textContent = total > 0 ? fmtBRL(total) : '—';

  // Totals box
  document.getElementById('rSub').textContent   = total > 0 ? fmtBRL(total) : '—';
  document.getElementById('rGrand').textContent = total > 0 ? fmtBRL(total) : '—';

  // Rodapé direito
  document.getElementById('fRight').textContent =
    (document.getElementById('c9').value || 'NF') + ' — pág. 1/1';

  /* 3. Torna o relatório visível */
  const relatorio = document.getElementById('relatorio');
  relatorio.classList.add('visivel');
  relatorio.style.visibility = 'visible';
  relatorio.style.position   = 'static';

  /* 4. Ação */
  if (pdf) {
    const num      = document.getElementById('c9').value.trim() || 'nota-fiscal';
    const filename = `${num}_NexCore.pdf`;

    html2pdf()
      .set({
        margin:      0,
        filename:    filename,
        image:       { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF:       { unit: 'px', format: [860, relatorio.scrollHeight + 40], orientation: 'portrait' }
      })
      .from(relatorio)
      .save();

  } else if (print) {
    window.print();
  } else {
    // Só scroll suave até o relatório
    relatorio.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
