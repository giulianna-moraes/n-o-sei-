// Zoneamento fixo das marcas por ruas do galpão
const marcasPorRua = {
    "R1": { nome: "EPSON", classeCor: "border-rose-500 ring-4 ring-rose-500/20 bg-rose-950/10" },
    "R2": { nome: "LG", classeCor: "border-amber-500 ring-4 ring-amber-500/20 bg-amber-950/10" },
    "R3": { nome: "SAMSUNG", classeCor: "border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-950/10" },
    "R4": { nome: "HP", classeCor: "border-blue-500 ring-4 ring-blue-500/20 bg-blue-950/10" }
};

// Inicializa a malha do galpão gerando IDs únicos para cada apartamento
function renderWarehouse() {
    const ruas = ['R1', 'R2', 'R3', 'R4'];
    
    // Setor de Impressoras (Prateleiras A e B)
    ruas.forEach(rua => {
        ['A', 'B'].forEach(prat => {
            const container = document.getElementById(`${rua}-IMP-${prat}`);
            if (container) container.appendChild(createShelfGrid(rua, "IMP", prat));
        });
    });

    // Setor de Computadores (Prateleiras C e D)
    ruas.forEach(rua => {
        ['C', 'D'].forEach(prat => {
            const container = document.getElementById(`${rua}-COMP-${prat}`);
            if (container) container.appendChild(createShelfGrid(rua, "COMP", prat));
        });
    });
}

function createShelfGrid(rua, setor, prat) {
    const moduloPrat = document.createElement('div');
    moduloPrat.className = "bg-slate-900 border border-slate-800/80 p-1.5 rounded-xl w-full text-center static-shelf-box shadow-inner";
    
    const aptGrid = document.createElement('div');
    aptGrid.className = "grid grid-cols-6 gap-1"; 

    // Cria as posições sequenciais (01 ao 06) refletindo os andares/apartamentos
    for (let a = 1; a <= 6; a++) {
        const aptDiv = document.createElement('div');
        aptDiv.id = `cell-${rua}-${setor}-${prat}-andar-${a}`;
        aptDiv.className = "h-5 bg-slate-950 border border-slate-800/30 rounded-[3px] text-[8px] text-slate-600 font-black flex items-center justify-center transition-all duration-300";
        aptDiv.innerHTML = `<span>0${a}</span>`;
        aptGrid.appendChild(aptDiv);
    }
    
    moduloPrat.appendChild(aptGrid);
    return moduloPrat;
}

// Mecanismo de Busca Inteligente Híbrido com Exemplos no Foco
const searchInput = document.getElementById('search');
const suggestionsDiv = document.getElementById('suggestions');

// Mostra sugestões e exemplos práticos assim que clica no campo
searchInput.addEventListener('focus', () => {
    renderSuggestions(searchInput.value.toUpperCase().trim());
});

searchInput.addEventListener('input', (e) => {
    renderSuggestions(e.target.value.toUpperCase().trim());
});

function renderSuggestions(query) {
    suggestionsDiv.innerHTML = '';

    // Se o campo estiver totalmente vazio, exibe o menu de Exemplos Práticos de Código
    if (query.length === 0) {
        const titleEx = document.createElement('div');
        titleEx.className = "px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950";
        titleEx.innerText = "💡 Exemplos de Códigos para Pesquisar:";
        suggestionsDiv.appendChild(titleEx);

        const exemplos = [
            { cod: "R1-B1-A-3", desc: "Rua 1, Bloco 1, Prat. A (Epson Impressora)" },
            { cod: "R1-B2-A-5", desc: "Rua 1, Bloco 2, Prat. A (Epson Impressora)" },
            { cod: "R2-B2-D-1", desc: "Rua 2, Bloco 2, Prat. D (LG Computador)" },
            { cod: "R3-B1-C-4", desc: "Rua 3, Bloco 1, Prat. C (Samsung Computador)" },
            { cod: "R4-B2-B-2", desc: "Rua 4, Bloco 2, Prat. B (HP Impressora)" }
        ];

        exemplos.forEach(ex => {
            const item = document.createElement('div');
            item.className = "px-4 py-2 hover:bg-slate-800 border-b border-slate-950 cursor-pointer text-xs flex justify-between items-center";
            item.innerHTML = `<span class="font-mono font-bold text-emerald-400">${ex.cod}</span><span class="text-[10px] text-slate-400">${ex.desc}</span>`;
            item.onclick = () => {
                processarBuscaCodigoString(ex.cod);
                searchInput.value = ex.cod;
                suggestionsDiv.classList.add('hidden');
            };
            suggestionsDiv.appendChild(item);
        });
        suggestionsDiv.classList.remove('hidden');
        return;
    }

    // Processamento da busca ativa do usuário
    if (query.startsWith("R") && query.includes("-")) {
        renderCodigoActiveSuggestion(query);
    } else {
        renderMarcaActiveSuggestions(query);
    }
}

function renderCodigoActiveSuggestion(query) {
    const item = document.createElement('div');
    item.className = "px-4 py-2.5 hover:bg-slate-800 border-b border-slate-950 cursor-pointer text-xs flex items-center gap-2 bg-indigo-950/20";
    item.innerHTML = `<i class="fa-solid fa-magnifying-glass text-emerald-400"></i> <span class="text-white">Buscar código: <strong>${query}</strong></span>`;
    item.onclick = () => {
        processarBuscaCodigoString(query);
        searchInput.value = query;
        suggestionsDiv.classList.add('hidden');
    };
    suggestionsDiv.appendChild(item);
    suggestionsDiv.classList.remove('hidden');
}

function renderMarcaActiveSuggestions(query) {
    const setoresMapeados = ["IMPRESSORAS", "COMPUTADORES"];
    let matches = [];

    Object.keys(marcasPorRua).forEach(key => {
        const m = marcasPorRua[key];
        if (m.nome.includes(query)) {
            setoresMapeados.forEach(s => {
                matches.push({ marca: m.nome, setor: s, rua: key });
            });
        }
    });

    if (matches.length > 0) {
        matches.forEach(itemMatch => {
            const item = document.createElement('div');
            item.className = "px-4 py-2.5 hover:bg-slate-800 border-b border-slate-950 cursor-pointer text-xs flex justify-between items-center";
            const icone = itemMatch.setor === "IMPRESSORAS" ? "fa-print text-indigo-400" : "fa-desktop text-teal-400";
            
            item.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="fa-solid ${icone} w-4"></i>
                    <span class="font-bold text-white">${itemMatch.marca}</span>
                    <span class="text-[10px] text-slate-400">(${itemMatch.setor.toLowerCase()})</span>
                </div>
                <span class="text-[9px] font-mono bg-slate-950 px-1.5 py-0.5 rounded text-slate-400">${itemMatch.rua}</span>
            `;
            item.onclick = () => {
                selectContornoEstrutura(itemMatch.marca, itemMatch.setor, itemMatch.rua);
                searchInput.value = `${itemMatch.marca} (${itemMatch.setor.toLowerCase()})`;
                suggestionsDiv.classList.add('hidden');
            };
            suggestionsDiv.appendChild(item);
        });
        suggestionsDiv.classList.remove('hidden');
    } else {
        suggestionsDiv.innerHTML = `<div class="p-2.5 text-xs text-slate-500 text-center">Nenhuma marca ou formato de código localizado</div>`;
        suggestionsDiv.classList.remove('hidden');
    }
}

// Transforma a string de texto digitada em coordenadas exatas corrigindo os blocos
function processarBuscaCodigoString(codStr) {
    const partes = codStr.split('-');
    const rua = partes[0] || "R1";
    const bloco = partes[1] || "B1";
    const prat = partes[2] || "A";
    const andar = partes[3] || "1";

    const setor = (prat === "A" || prat === "B") ? "IMPRESSORAS" : "COMPUTADORES";
    const marcaAlvo = marcasPorRua[rua] ? marcasPorRua[rua].nome : "MULTIMARCA";

    executeBuscaPorCodigo(rua, bloco, prat, andar, marcaAlvo, setor);
}

// CORREÇÃO E EXECUÇÃO DA BUSCA EXATA POR CÓDIGO (Circula e valida Bloco 1 e Bloco 2)
function executeBuscaPorCodigo(rua, bloco, prat, andar, marca, setor) {
    clearSelection();

    document.getElementById('info-empty').classList.add('hidden');
    const content = document.getElementById('info-content');
    content.classList.remove('hidden');

    document.getElementById('tipo-busca-tag').innerText = "POSIÇÃO EXATA CIRCULADA";
    document.getElementById('tipo-busca-tag').className = "text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-lg";

    // Alimenta o painel lateral com precisão comercial
    document.getElementById('prod-nome').innerText = `${marca} - ${setor}`;
    document.getElementById('lbl-rua').innerText = rua;
    document.getElementById('lbl-bloco').innerText = bloco === "B1" ? "Bloco 1" : "Bloco 2";
    document.getElementById('lbl-prat').innerText = prat;
    document.getElementById('lbl-andar').innerText = `${andar}º Nível`;
    document.getElementById('lbl-apt').innerText = `Apt 0${andar}`;
    document.getElementById('addr-completo').innerText = `${rua}-${bloco}-${prat}-0${andar}`;

    const steps = [
        `Desloque-se imediatamente para a <strong class="text-indigo-400">Rua ${rua}</strong> do pavilhão.`,
        `Identifique o setor de <strong class="text-indigo-300">${setor.toLowerCase()}</strong> na prateleira <strong class="text-white">Lado ${prat}</strong>.`,
        `Vá até o <strong class="text-white">${bloco === "B1" ? "Bloco 1" : "Bloco 2"}</strong> e retire a caixa na posição <strong class="text-emerald-400">0${andar}</strong> que está piscando em neon.`
    ];
    document.getElementById('route-steps').innerHTML = steps.map(step => `<li>${step}</li>`).join('');

    // Acende os fundos macros da rua informada
    const areaRua = document.getElementById(`area-${rua}`);
    if (areaRua) areaRua.className += " border-indigo-500/30 bg-indigo-950/10";
    const setaRua = document.getElementById(`arrow-${rua}`);
    if (setaRua) setaRua.classList.remove('hidden');

    // Executa o contorno macro do pavilhão correspondente
    const siglaSetor = (prat === "A" || prat === "B") ? "IMP" : "COMP";
    const estruturaAlvo = document.getElementById(`shelf-${rua}-${siglaSetor}`);
    if (estruturaAlvo && marcasPorRua[rua]) {
        estruturaAlvo.className = `grid grid-cols-2 gap-3 p-1 rounded-xl border-2 transition-all duration-300 ${marcasPorRua[rua].classeCor} shadow-2xl scale-[1.01] z-10`;
    }

    // PESCA EXATA DA CÉLULA (Resolve e valida dinamicamente Bloco 1 ou Bloco 2)
    const celulaExata = document.getElementById(`cell-${rua}-${siglaSetor}-${prat}-andar-${andar}`);
    if (celulaExata) {
        celulaExata.classList.add('exact-target-blink');
    }
}

// BUSCA TRADICIONAL POR MARCA
function selectContornoEstrutura(marca, setor, rua) {
    clearSelection();

    document.getElementById('info-empty').classList.add('hidden');
    const content = document.getElementById('info-content');
    content.classList.remove('hidden');

    document.getElementById('tipo-busca-tag').innerText = "ESTRUTURA COMPLETA";
    document.getElementById('tipo-busca-tag').className = "text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-lg";

    document.getElementById('prod-nome').innerText = marca;
    document.getElementById('lbl-rua').innerText = rua;
    document.getElementById('lbl-bloco').innerText = "B1 e B2";
    
    const badge = document.getElementById('prod-badge');
    badge.innerText = setor;
    badge.className = `text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white ${setor === 'IMPRESSORAS' ? 'bg-indigo-600' : 'bg-teal-600'}`;

    const siglaSetor = setor === "IMPRESSORAS" ? "IMP" : "COMP";
    const letrasPrat = setor === "IMPRESSORAS" ? "A e B" : "C e D";
    document.getElementById('lbl-prat').innerText = letrasPrat;
    document.getElementById('lbl-andar').innerText = "1º ao 6º";
    document.getElementById('lbl-apt').innerText = "01 ao 06";
    document.getElementById('addr-completo').innerText = `${rua}-${siglaSetor} (ESTRUTURA INTERA)`;

    const steps = [
        `Siga em direção à <strong class="text-indigo-400">Rua ${rua}</strong>.`,
        `Toda a área de prateleiras (<strong class="text-indigo-300">Prat. ${letrasPrat}</strong>) é de domínio exclusivo da marca <strong class="text-white">${marca}</strong>.`
    ];
    document.getElementById('route-steps').innerHTML = steps.map(step => `<li>${step}</li>`).join('');

    const areaRua = document.getElementById(`area-${rua}`);
    if (areaRua) areaRua.className += " border-indigo-500/30 bg-indigo-950/10";
    const setaRua = document.getElementById(`arrow-${rua}`);
    if (setaRua) setaRua.classList.remove('hidden');

    const estruturaAlvo = document.getElementById(`shelf-${rua}-${siglaSetor}`);
    if (estruturaAlvo) {
        estruturaAlvo.className = `grid grid-cols-2 gap-3 p-1 rounded-xl border-2 transition-all duration-300 ${marcasPorRua[rua].classeCor} shadow-2xl scale-[1.01] z-10`;
    }
}

function clearSelection() {
    document.getElementById('info-content').classList.add('hidden');
    document.getElementById('info-empty').classList.remove('hidden');
    
    // Reseta qualquer caixinha que esteja piscando
    const celulas = document.querySelectorAll('.exact-target-blink');
    celulas.forEach(c => c.classList.remove('exact-target-blink'));

    ['R1', 'R2', 'R3', 'R4'].forEach(rua => {
        const area = document.getElementById(`area-${rua}`);
        if(area) area.className = "relative corridor-row border-slate-800/50 bg-slate-950/10";
        const seta = document.getElementById(`arrow-${rua}`);
        if (seta) seta.classList.add('hidden');
        
        ['IMP', 'COMP'].forEach(setor => {
            const shelf = document.getElementById(`shelf-${rua}-${setor}`);
            if (shelf) {
                shelf.className = "grid grid-cols-2 gap-3 transition-all duration-300 p-1 rounded-xl border-2 border-transparent";
            }
        });
    });
}

// Fecha o menu se clicar fora
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.classList.add('hidden');
    }
});

window.onload = renderWarehouse;