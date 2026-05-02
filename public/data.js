// ─── DADOS PARTILHADOS ────────────────────────────────────────────────────
// Usado por profile.html e gerar.html

const DATA_MEDICAMENTOS = {
  "Diabetes": {
    "Metformina": ["Náuseas, diarreia, desconforto abdominal e sabor metálico na boca."],
    "Sulfonilureias (ex: Gliclazida)": ["Risco de hipoglicemia (açúcar muito baixo no sangue) e aumento de peso."],
    "Análogos de GLP-1 — Medicamentos que imitam uma hormona natural para controlar o açúcar no sangue (ex: Semaglutida)": ["Náuseas intensas, vómitos e redução acentuada do apetite."]
  },
  "Hipertensão": {
    "Inibidores da ECA — Medicamentos que relaxam os vasos sanguíneos (ex: Enalapril)": ["Tosse seca persistente, tonturas e cansaço."],
    "Bloqueadores da Angiotensina — Medicamentos que baixam a pressão arterial (ex: Losartana)": ["Tonturas e aumento do potássio no sangue."],
    "Diuréticos — Medicamentos que ajudam o corpo a eliminar o excesso de água e sal pela urina (ex: Hidroclorotiazida)": ["Urinar com muita frequência, sede e cãibras."]
  },
  "Colesterol Elevado": {
    "Estatinas — Medicamentos que reduzem o colesterol mau no sangue (ex: Atorvastatina)": ["Dores musculares, fadiga e possíveis alterações no fígado."]
  },
  "Obesidade": {
    "Orlistato — Medicamento que impede a absorção de gordura pelo intestino": ["Fezes oleosas, urgência em ir à casa de banho e gases."],
    "Liraglutida/Semaglutida — Injeções semanais que reduzem o apetite e o peso": ["Náuseas, prisão de ventre ou diarreia."]
  },
  "Anemia": {
    "Suplementos de Ferro — Comprimidos ou xaropes para aumentar o ferro no sangue": ["Fezes escuras, prisão de ventre e dores de estômago."]
  },
  "Osteoporose": {
    "Bisfosfonatos — Medicamentos que fortalecem os ossos e reduzem o risco de fraturas (ex: Alendronato)": ["Azia, irritação no esófago e dores nos ossos ou músculos."]
  },
  "Insuficiência Renal": {
    "Furosemida — Diurético (medicamento para eliminar o excesso de líquidos pelo rim)": ["Desidratação, tonturas e desequilíbrio de minerais."]
  },
  "Insuficiência Hepática": {
    "Furosemida — Diurético (medicamento para eliminar o excesso de líquidos pelo rim)": ["Desidratação, tonturas e desequilíbrio de minerais."],
    "Lactulose — Xarope laxante que ajuda a eliminar toxinas pelo intestino": ["Diarreia, gases e cólicas abdominais."]
  },
  "Hepatite B": {
    "Antivirais — Medicamentos que combatem o vírus da Hepatite B (ex: Tenofovir)": ["Dores de cabeça, cansaço e risco de lesão nos rins a longo prazo."]
  },
  "Doença de Behçet": {
    "Colchicina — Medicamento anti-inflamatório usado para reduzir as crises": ["Diarreia e dor abdominal."],
    "Corticoides — Medicamentos anti-inflamatórios fortes (ex: Prednisolona)": ["Aumento de peso, retenção de líquidos, insónia e rosto inchado."]
  }
};

const DATA_RECOMENDACOES = {
  "Diabetes": {
    "Alimentação": ["Aumente o consumo de fibras: espinafre, alface, acelga, brócolos, couve e curgete retardam a absorção do açúcar.","Prefira hidratos de carbono complexos (açúcares de absorção lenta): aveia, arroz integral, quinoa, pão de centeio ou integral.","Inclua proteínas magras (com pouca gordura): frango, peru, salmão, atum, cavala, tofu, feijão, lentilha e grão-de-bico.","Gorduras saudáveis: azeite como principal gordura, abacate e frutos secos com moderação.","Fruta com moderação: maçã, pera, laranjas, frutos vermelhos — de preferência com casca. Evite sumos.","Evitar: açúcares refinados, doces, bolos, refrigerantes, bebidas alcoólicas, pão branco e batatas fritas."],
    "Atividade Física": ["Exercício aeróbico regular (exercício que acelera o coração, como caminhada, natação ou bicicleta) ajuda a controlar o açúcar no sangue.","Musculação (exercícios com pesos ou máquinas) e exercícios de resistência aumentam a captação de açúcar pelos músculos.","Monitorize o açúcar no sangue antes e após o exercício para evitar hipoglicemia (baixa de açúcar).","Evite exercício intenso quando o açúcar no sangue estiver muito elevado ou muito baixo."]
  },
  "Hipertensão": {
    "Alimentação": ["Aumente o potássio e o magnésio (minerais que relaxam os vasos sanguíneos): banana, abacate, laranja, espinafre, feijão e água de coco.","Substitua o sal por ervas aromáticas, alho, cebola e limão. Máximo 5g de sal por dia (uma colher de chá rasa).","Lacticínios magros (com pouca gordura): iogurte natural desnatado, queijo ricota ou queijo fresco.","Cereais integrais: aveia, arroz e massas integrais ajudam na excreção (eliminação) de sódio.","Evitar: ultraprocessados (alimentos de pacote com muitos ingredientes), enchidos, enlatados, caldos prontos, refrigerantes e carnes gordas."],
    "Atividade Física": ["Exercícios aeróbicos (que aceleram o coração): caminhar, pedalar ou nadar — mínimo 150 minutos por semana.","Isométricos (exercícios em que se mantém uma posição sem mover): Wall Sit (agachamento encostado à parede) durante 2 minutos e Prancha Abdominal são os mais eficazes.","Controlo da respiração: inspirar 4 segundos, expirar 8 segundos — ajuda a baixar a pressão em momentos de tensão.","Hidratação: 1,5 a 2 litros de água por dia.","Evitar vícios: não fumar, moderar álcool e cafeína (café, chá preto, bebidas energéticas)."]
  },
  "Colesterol Elevado": {
    "Alimentação": ["Fibras solúveis (fibras que se dissolvem na água e arrastam o colesterol): aveia, linhaça, chia e leguminosas.","Gorduras insaturadas (gorduras saudáveis que protegem o coração): azeite extra virgem, frutos secos e peixes gordos ricos em Ómega-3.","Esteróis vegetais (substâncias naturais que bloqueiam a absorção do colesterol): abacate e sementes.","Evitar: carnes gordas, enchidos, natas, queijos amarelos, pastelaria e fritos (gordura trans — o tipo de gordura mais prejudicial)."],
    "Atividade Física": ["Exercício aeróbico (que acelera o coração) moderado e contínuo aumenta o HDL (colesterol bom).","Regularidade mais importante que intensidade — mínimo 30 a 40 minutos diários.","Evitar o sedentarismo (estar parado durante muitas horas seguidas)."]
  },
  "Obesidade": {
    "Alimentação": ["Regra do prato: 50% de vegetais (fibras) para ocupar espaço no estômago e reduzir a fome.","Proteína em todas as refeições (frango, peixe, ovos ou leguminosas) preservam a massa muscular.","Evite calorias líquidas: sumos, refrigerantes e álcool não saciam e engordam rapidamente.","Comida real: evite ultraprocessados (produtos de pacote com muitos aditivos e açúcares escondidos)."],
    "Atividade Física": ["Treino de força (musculação ou exercícios com pesos): o músculo queima mais calorias mesmo em repouso.","NEAT — Termogénese de Atividade Não relacionada com Exercício (calorias gastas nos movimentos do dia a dia): andar a pé, usar escadas pode superar 30 min de ginásio.","Prefira caminhada, natação ou bicicleta para proteger as articulações (joelhos e ancas)."]
  },
  "Anemia": {
    "Alimentação": ["Ferro Heme (ferro de origem animal, mais fácil de absorver): carnes vermelhas com moderação, fígado, gema de ovo, amêijoas.","Ferro Não-Heme (ferro de origem vegetal, mais difícil de absorver): feijão, lentilhas, grão-de-bico, espinafres, brócolos.","Vitamina C na mesma refeição (laranja, kiwi, pimento, limão) aumenta muito a absorção do ferro vegetal.","Evitar bloqueadores de ferro: café, chá (que contêm taninos) e lacticínios (que contêm cálcio) logo após as refeições."],
    "Atividade Física": ["Exercício de baixa a moderada intensidade (caminhadas leves, ioga) enquanto os níveis de ferro no sangue não estabilizarem.","Evite corridas de longa distância — podem causar hemólise de impacto (destruição de glóbulos vermelhos pelo impacto dos pés no chão).","O descanso é fundamental — o corpo com anemia precisa de mais tempo para recuperar."]
  },
  "Osteoporose": {
    "Alimentação": ["Cálcio (mineral essencial para os ossos): lacticínios, brócolos, couve galega, amêndoas.","Vitamina D (necessária para o corpo absorver o cálcio): exposição solar 15 min/dia, peixes gordos e gemas de ovo.","Evitar: excesso de sal e cafeína (que aumentam a perda de cálcio pela urina) e refrigerantes de cola (que contêm fósforo em excesso)."],
    "Atividade Física": ["Impacto controlado (exercícios que criam pressão sobre os ossos e os estimulam a fortalecer): caminhar, dançar ou subir escadas.","Treino de força: musculação ou elásticos estimulam a criação de massa óssea (osso mais denso e resistente).","Ioga ou pilates: fortalecem o core (músculos do centro do corpo) e melhoram o equilíbrio, prevenindo quedas."]
  },
  "Insuficiência Renal": {
    "Alimentação": ["Controlo da proteína: quantidade moderada e de elevada qualidade (ovo, carnes magras) — proteína em excesso produz ureia que o rim doente não elimina bem.","Atenção ao potássio e fósforo (minerais que se acumulam no sangue quando o rim falha): evitar banana, abacate, frutos secos.","Sódio (sal) quase zero: o sal retém líquidos e sobrecarrega os rins."],
    "Atividade Física": ["Intensidade leve a moderada: caminhadas ou ciclismo leve são ideais.","Evitar exercício intenso — pode causar rabdomiólise (destruição de músculo) que liberta substâncias nocivas para os rins.","Evitar desidratação (falta de água no corpo) — reduz o fluxo de sangue para os rins."]
  },
  "Insuficiência Hepática": {
    "Alimentação": ["Fracionamento (dividir as refeições): 5 a 6 refeições pequenas por dia — o jejum prolongado é perigoso pois o fígado não consegue armazenar energia (glicogénio).","Proteínas vegetais e lacticínios: melhor toleradas que a carne vermelha pois produzem menos amoníaco (substância tóxica para o cérebro).","Restrição de sódio (sal) quase total para evitar ascite (acumulação de líquido na barriga).","Proibido: álcool (proibição total), mariscos crus e alimentos muito gordurosos."],
    "Atividade Física": ["Exercícios de resistência leves (elásticos ou pesos muito leves) para combater a sarcopenia (perda de músculo).","Caminhadas curtas de baixo impacto aeróbico (que não causam cansaço excessivo)."]
  },
  "Hepatite B": {
    "Alimentação": ["Proibição total do álcool — a regra mais importante.","Dieta mediterrânica (baseada em peixe, azeite, legumes e cereais integrais): rica em antioxidantes (substâncias que protegem as células do fígado).","Proteínas magras (com pouca gordura): peixe, frango sem pele, tofu, leguminosas."],
    "Atividade Física": ["Fase aguda (início da doença): repouso ou atividade muito moderada, respeitando o cansaço extremo.","Fase crónica (doença estabilizada): 40 minutos de exercício, 4 a 5 vezes por semana.","Caminhadas rápidas, natação e ciclismo são excelentes para a saúde do fígado."]
  },
  "Doença de Behçet": {
    "Alimentação": ["Dieta anti-inflamatória (que reduz a inflamação no corpo): rica em Ómega-3 (gordura saudável presente em peixes gordos, linhaça, nozes).","Antioxidantes (substâncias que protegem os vasos sanguíneos): frutos vermelhos, brócolos, cenoura.","Crises de aftas (feridas na boca): evitar alimentos ácidos (limão, tomate) ou picantes que irritam as feridas.","Evitar: açúcares refinados e gorduras trans (gorduras artificiais presentes em bolachas e fritos industriais)."],
    "Atividade Física": ["Exercício moderado em remissão (quando a doença está controlada): caminhadas, natação ou ioga.","Respeitar a fadiga crónica (cansaço persistente) — não forçar o corpo nos dias mais difíceis.","Manter-se ativo para prevenir tromboses (coágulos no sangue) — evitar estar sentado muitas horas seguidas."]
  }
};

const DATA_EXERCICIOS = {
  "Diabetes": {
    "Foco": "Controlo do açúcar no sangue e melhoria da resposta do corpo à insulina (hormona que regula o açúcar)",
    "Exercicios": [
      "Caminhada rápida (30 a 45 minutos)",
      "Musculação — exercícios com pesos ou máquinas (3 vezes por semana)",
      "HIIT leve ou moderado — Treino em Intervalos de Alta Intensidade (alternar períodos de esforço com descanso)",
      "Bicicleta (estática ou ao ar livre)",
      "Natação"
    ],
    "Top": "Caminhada + musculação"
  },
  "Hipertensão": {
    "Foco": "Baixar a pressão arterial (a força com que o sangue empurra as paredes das artérias)",
    "Exercicios": [
      "Caminhada diária",
      "Natação",
      "Bicicleta leve",
      "Exercícios isométricos — manter uma posição sem mover (ex: prancha abdominal, wall sit — agachamento encostado à parede)",
      "Respiração controlada (inspirar devagar e expirar mais devagar ainda)"
    ],
    "Top": "Caminhada + exercícios isométricos (posições estáticas)"
  },
  "Colesterol Elevado": {
    "Foco": "Aumentar o HDL (colesterol bom, que limpa as artérias) e reduzir o LDL (colesterol mau)",
    "Exercicios": [
      "Corrida leve",
      "Caminhada rápida",
      "Natação",
      "Ciclismo",
      "Exercício aeróbico contínuo e moderado (que acelera o coração de forma constante)"
    ],
    "Top": "Cardio contínuo (exercício que acelera o coração de forma constante e prolongada)"
  },
  "Obesidade": {
    "Foco": "Gastar calorias e acelerar o metabolismo (o ritmo a que o corpo queima energia)",
    "Exercicios": [
      "Caminhada",
      "Musculação (exercícios com pesos)",
      "Bicicleta",
      "Hidroginástica (ginástica na água, suave para as articulações)",
      "Aumentar a atividade do dia a dia (subir escadas, andar a pé)"
    ],
    "Top": "Musculação + movimento ao longo do dia"
  },
  "Anemia": {
    "Foco": "Evitar a fadiga (cansaço extremo causado pela falta de glóbulos vermelhos no sangue)",
    "Exercicios": [
      "Caminhadas leves",
      "Yoga (exercício suave de alongamento e respiração)",
      "Alongamentos",
      "Mobilidade leve (movimentos suaves das articulações)"
    ],
    "Top": "Exercícios de baixa intensidade enquanto os níveis de ferro não normalizam"
  },
  "Osteoporose": {
    "Foco": "Fortalecer os ossos e prevenir fraturas (quebras)",
    "Exercicios": [
      "Musculação (exercícios com pesos que criam pressão sobre os ossos)",
      "Caminhada",
      "Subir escadas",
      "Dança",
      "Pilates (exercícios de controlo muscular e equilíbrio)"
    ],
    "Top": "Treino de força + exercícios com impacto controlado (que criam pressão saudável sobre os ossos)"
  },
  "Insuficiência Renal": {
    "Foco": "Manter o corpo ativo sem sobrecarregar os rins",
    "Exercicios": [
      "Caminhada leve",
      "Bicicleta leve",
      "Alongamentos",
      "Exercícios de resistência leve (com elásticos ou pesos muito leves)"
    ],
    "Top": "Exercícios de intensidade leve a moderada (sem esforço excessivo)"
  },
  "Insuficiência Hepática": {
    "Foco": "Evitar a sarcopenia (perda de músculo), muito comum quando o fígado não funciona bem",
    "Exercicios": [
      "Caminhadas curtas",
      "Exercícios com elásticos (resistência suave)",
      "Musculação leve (pesos muito leves)",
      "Qualquer atividade leve do dia a dia"
    ],
    "Top": "Treino leve de resistência (exercícios suaves que mantêm os músculos ativos)"
  },
  "Hepatite B": {
    "Foco": "Reduzir a inflamação no fígado e manter a condição física",
    "Exercicios": [
      "Caminhada",
      "Natação",
      "Ciclismo",
      "Musculação leve"
    ],
    "Top": "Cardio moderado (exercício que acelera o coração a um ritmo confortável)"
  },
  "Doença de Behçet": {
    "Foco": "Reduzir a inflamação e o cansaço crónico (fadiga persistente)",
    "Exercicios": [
      "Caminhada",
      "Yoga (exercício suave de alongamento e respiração)",
      "Natação",
      "Alongamentos",
      "Hidroginástica (ginástica na água, suave para as articulações)"
    ],
    "Top": "Exercícios suaves praticados com regularidade"
  }
};

const DATA_NOTA = {
  "Nota Importante": "Esta informação tem caráter meramente educativo. Qualquer ajuste ou início de medicação deve ser realizado exclusivamente por um profissional de saúde qualificado."
};