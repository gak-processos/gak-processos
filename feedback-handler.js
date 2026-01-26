// ========================================
// FEEDBACK HANDLER - INTRANET GAK
// Salva feedbacks no localStorage do navegador
// ========================================

// Função para gerar ID único para cada feedback
function generateFeedbackId() {
    return 'feedback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Função para formatar data em português
function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('pt-BR', options);
}

// Função para salvar feedback
function saveFeedback(event) {
    event.preventDefault(); // Impede reload da página
    
    // Captura os dados do formulário
    const feedbackData = {
        id: generateFeedbackId(),
        timestamp: new Date().toISOString(),
        tipo: document.querySelector('input[name="tipo"]:checked')?.value || '',
        nome: document.getElementById('nome').value.trim(),
        processo: document.getElementById('processo').value,
        titulo: document.getElementById('titulo').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        frequencia: document.getElementById('frequencia').value,
        prioridade: document.querySelector('input[name="prioridade"]:checked')?.value || '',
        impactoFinanceiro: document.querySelector('input[name="impacto"]:checked')?.value || '',
        obraExemplo: document.getElementById('obra').value.trim()
    };
    
    // Validação básica
    if (!feedbackData.tipo || !feedbackData.nome || !feedbackData.titulo || !feedbackData.descricao) {
        alert('⚠️ Por favor, preencha todos os campos obrigatórios marcados com *');
        return false;
    }
    
    // Recupera feedbacks existentes do localStorage
    let feedbacks = JSON.parse(localStorage.getItem('gak_feedbacks')) || [];
    
    // Adiciona novo feedback
    feedbacks.push(feedbackData);
    
    // Salva de volta no localStorage
    localStorage.setItem('gak_feedbacks', JSON.stringify(feedbacks));
    
    // Mostra mensagem de sucesso
    showSuccessMessage();
    
    // Limpa o formulário
    document.getElementById('feedbackForm').reset();
    
    // Atualiza a lista de feedbacks exibida
    displayFeedbacks();
    
    // Scroll suave para mensagem de sucesso
    document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    return false;
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage() {
    const successDiv = document.getElementById('successMessage');
    successDiv.style.display = 'block';
    
    // Esconde automaticamente após 5 segundos
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// Função para voltar ao formulário
function voltarFormulario() {
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('feedbackForm').scrollIntoView({ behavior: 'smooth' });
}

// Função para exibir feedbacks registrados
function displayFeedbacks() {
    const feedbacks = JSON.parse(localStorage.getItem('gak_feedbacks')) || [];
    const container = document.getElementById('feedbacksList');
    
    if (!container) return; // Se não existe o container, não faz nada
    
    // Limpa container
    container.innerHTML = '';
    
    if (feedbacks.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <p style="font-size: 18px;">📋 Nenhum feedback registrado ainda.</p>
                <p>Seja o primeiro a contribuir!</p>
            </div>
        `;
        return;
    }
    
    // Ordena por data (mais recente primeiro)
    feedbacks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Gera HTML para cada feedback
    feedbacks.forEach(feedback => {
        const feedbackCard = createFeedbackCard(feedback);
        container.innerHTML += feedbackCard;
    });
    
    // Atualiza contador
    const counter = document.getElementById('feedbackCounter');
    if (counter) {
        counter.textContent = feedbacks.length;
    }
}

// Função para criar card HTML de um feedback
function createFeedbackCard(feedback) {
    // Ícone baseado no tipo
    const tipoIcon = feedback.tipo === 'melhoria' ? '💡' : '⚠️';
    const tipoText = feedback.tipo === 'melhoria' ? 'Melhoria de Processo' : 'Problema Recorrente';
    
    // Cor da prioridade
    const prioridadeColors = {
        'baixa': '#28a745',
        'media': '#ffc107',
        'alta': '#dc3545'
    };
    const prioridadeLabels = {
        'baixa': '🟢 Baixa',
        'media': '🟡 Média',
        'alta': '🔴 Alta'
    };
    
    // Nome do processo
    const processos = {
        'orcamentacao': '0. Orçamentação',
        'inicio': '1. Início de Obra',
        'revisao': '2. Revisão de Projeto',
        'demolicao': '3. Demolição + Civil',
        'hidraulica': '4. Hidráulica',
        'finalizacao': '5. Finalização de Obra',
        'mudancas': '6. Gestão de Mudanças',
        'geral': 'Geral (não específico)'
    };
    
    const processoNome = processos[feedback.processo] || 'Não especificado';
    
    // Frequência
    const frequenciaLabels = {
        'raramente': 'Raramente (1-2 vezes)',
        'ocasionalmente': 'Ocasionalmente (mensal)',
        'frequentemente': 'Frequentemente (semanal)',
        'sempre': 'Sempre (toda obra)'
    };
    
    return `
        <div class="feedback-card" style="
            background: white;
            border: 1px solid #ddd;
            border-left: 4px solid ${prioridadeColors[feedback.prioridade]};
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                    <h4 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">
                        ${tipoIcon} ${feedback.titulo}
                    </h4>
                    <div style="font-size: 14px; color: #666;">
                        👤 ${feedback.nome}
                        <span style="margin: 0 8px;">•</span>
                        📅 ${formatDate(feedback.timestamp)}
                        <span style="margin: 0 8px;">•</span>
                        🔄 Processo: <strong>${processoNome}</strong>
                    </div>
                </div>
                <div style="
                    background: ${prioridadeColors[feedback.prioridade]};
                    color: white;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: bold;
                    white-space: nowrap;
                ">
                    ${prioridadeLabels[feedback.prioridade]}
                </div>
            </div>
            
            <div style="margin-bottom: 12px; color: #555; line-height: 1.6;">
                ${feedback.descricao}
            </div>
            
            <div style="display: flex; gap: 20px; font-size: 13px; color: #666; flex-wrap: wrap;">
                ${feedback.frequencia ? `
                    <div>
                        <strong>Frequência:</strong> ${frequenciaLabels[feedback.frequencia]}
                    </div>
                ` : ''}
                
                ${feedback.impactoFinanceiro ? `
                    <div>
                        <strong>Impacto Financeiro:</strong> ${feedback.impactoFinanceiro === 'sim' ? '💰 Sim' : 'Não'}
                    </div>
                ` : ''}
                
                ${feedback.obraExemplo ? `
                    <div>
                        <strong>Obra Exemplo:</strong> ${feedback.obraExemplo}
                    </div>
                ` : ''}
            </div>
            
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
                Tipo: ${tipoText} • ID: ${feedback.id}
            </div>
        </div>
    `;
}

// Função para exportar feedbacks como JSON
function exportFeedbacks() {
    const feedbacks = JSON.parse(localStorage.getItem('gak_feedbacks')) || [];
    
    if (feedbacks.length === 0) {
        alert('📋 Nenhum feedback para exportar.');
        return;
    }
    
    const dataStr = JSON.stringify(feedbacks, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedbacks_gak_${formatDate(new Date()).replace(/\//g, '-')}.json`;
    link.click();
    
    alert(`✅ ${feedbacks.length} feedback(s) exportado(s) com sucesso!`);
}

// Função para limpar todos os feedbacks (com confirmação)
function clearAllFeedbacks() {
    const feedbacks = JSON.parse(localStorage.getItem('gak_feedbacks')) || [];
    
    if (feedbacks.length === 0) {
        alert('📋 Não há feedbacks para limpar.');
        return;
    }
    
    const confirmacao = confirm(
        `⚠️ ATENÇÃO!\n\nVocê está prestes a deletar ${feedbacks.length} feedback(s).\n\n` +
        `Esta ação NÃO PODE ser desfeita.\n\n` +
        `Tem certeza que deseja continuar?`
    );
    
    if (confirmacao) {
        localStorage.removeItem('gak_feedbacks');
        displayFeedbacks();
        alert('✅ Todos os feedbacks foram removidos.');
    }
}

// Função para deletar feedback específico
function deleteFeedback(feedbackId) {
    const confirmacao = confirm('⚠️ Tem certeza que deseja deletar este feedback?');
    
    if (!confirmacao) return;
    
    let feedbacks = JSON.parse(localStorage.getItem('gak_feedbacks')) || [];
    feedbacks = feedbacks.filter(f => f.id !== feedbackId);
    localStorage.setItem('gak_feedbacks', JSON.stringify(feedbacks));
    
    displayFeedbacks();
    alert('✅ Feedback deletado com sucesso!');
}

// Função para filtrar feedbacks
function filterFeedbacks(filterType, filterValue) {
    const allFeedbacks = JSON.parse(localStorage.getItem('gak_feedbacks')) || [];
    
    let filtered = allFeedbacks;
    
    if (filterValue && filterValue !== 'todos') {
        filtered = allFeedbacks.filter(f => f[filterType] === filterValue);
    }
    
    // Atualiza display temporariamente com filtro
    const container = document.getElementById('feedbacksList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <p style="font-size: 18px;">📋 Nenhum feedback encontrado com este filtro.</p>
            </div>
        `;
        return;
    }
    
    filtered.forEach(feedback => {
        container.innerHTML += createFeedbackCard(feedback);
    });
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Feedback Handler GAK carregado!');
    
    // Vincula função ao formulário
    const form = document.getElementById('feedbackForm');
    if (form) {
        form.addEventListener('submit', saveFeedback);
        console.log('✅ Formulário vinculado ao handler');
    }
    
    // Exibe feedbacks existentes
    displayFeedbacks();
    
    // Vincula botão de voltar ao formulário
    const voltarBtn = document.getElementById('voltarFormBtn');
    if (voltarBtn) {
        voltarBtn.addEventListener('click', voltarFormulario);
    }
});

// Expõe funções globalmente para uso nos botões HTML
window.saveFeedback = saveFeedback;
window.voltarFormulario = voltarFormulario;
window.exportFeedbacks = exportFeedbacks;
window.clearAllFeedbacks = clearAllFeedbacks;
window.deleteFeedback = deleteFeedback;
window.filterFeedbacks = filterFeedbacks;

console.log('📦 Feedback Handler GAK inicializado!');
