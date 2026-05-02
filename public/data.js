// ─── DADOS PARTILHADOS ────────────────────────────────────────────────────
// Usado por profile.html e gerar.html

const DATA_MEDICAMENTOS = {
  "Diabetes": {
    "Metformina": ["Náuseas, diarreia, desconforto abdominal e sabor metálico na boca."],
    "Sulfonilureias (ex: Gliclazida)": ["Risco de hipoglicemia (açúcar muito baixo) e aumento de peso."],
    "Análogos de GLP-1 (ex: Semaglutida)": ["Náuseas intensas, vómitos e redução acentuada do apetite."]
  },
  "Hipertensão": {
    "Inibidores da ECA (ex: Enalapril)": ["Tosse seca persistente, tonturas e cansaço."],
    "Bloqueadores da Angiotensina (ex: Losartana)": ["Tonturas e aumento do potássio no sangue."],
    "Diuréticos (ex: Hidroclorotiazida)": ["Urinar com muita frequência, sede e cãibras."]
  },
  "Colesterol Elevado": {
    "Estatinas (ex: Atorvastatina)": ["Dores musculares, fadiga e possíveis alterações no fígado."]
  },
  "Obesidade": {
    "Orlistato": ["Fezes oleosas, urgência em ir à casa de banho e gases."],
    "Liraglutida/Semaglutida": ["Náuseas, prisão de ventre ou diarreia."]
  },
  "Anemia": {
    "Suplementos de Ferro": ["Fezes escuras, prisão de ventre e dores de estômago."]
  },
  "Osteoporose": {
    "Bisfosfonatos (ex: Alendronato)": ["Azia, irritação no esófago e dores nos ossos ou músculos."]
  },
  "Insuficiência Renal": {
    "Furosemida (Diurético)": ["Desidratação, tonturas e desequilíbrio de minerais."]
  },
  "Insuficiência Hepática": {
    "Furosemida (Diurético)": ["Desidratação, tonturas e desequilíbrio de minerais."],
    "Lactulose": ["Diarreia, gases e cólicas abdominais."]
  },
  "Hepatite B": {
    "Antivirais (ex: Tenofovir)": ["Dores de cabeça, cansaço e risco de toxicidade renal a longo prazo."]
  },
  "Doença de Behçet": {
    "Colchicina": ["Diarreia e dor abdominal."],
    "Corticoides (ex: Prednisolona)": ["Aumento de peso, retenção de líquidos, insónia e rosto inchado."]
  }
};

const DATA_RECOMENDACOES = {
  "Diabetes": {
    "Alimentação": ["Aumente o consumo de fibras: espinafre, alface, acelga, brócolos, couve e curgete retardam a absorção do açúcar.","Prefira hidratos de carbono complexos: aveia, arroz integral, quinoa, pão de centeio ou integral.","Inclua proteínas magras: frango, peru, salmão, atum, cavala, tofu, feijão, lentilha e grão-de-bico.","Gorduras saudáveis: azeite como principal gordura, abacate e frutos secos com moderação.","Fruta com moderação: maçã, pera, laranjas, frutos vermelhos — de preferência com casca. Evite sumos.","Evitar: açúcares refinados, doces, bolos, refrigerantes, bebidas alcoólicas, pão branco e batatas fritas."],
    "Atividade Física": ["Exercício aeróbico regular (caminhada, natação, bicicleta) ajuda a controlar a glicemia.","Musculação e exercícios de resistência aumentam a captação de glicose pelos músculos.","Monitorize a glicemia antes e após o exercício para evitar hipoglicemia.","Evite exercício intenso em períodos de glicemia muito elevada ou muito baixa."]
  },
  "Hipertensão": {
    "Alimentação": ["Aumente o potássio e o magnésio: banana, abacate, laranja, espinafre, feijão e água de coco.","Substitua o sal por ervas aromáticas, alho, cebola e limão. Máximo 5g de sal por dia.","Lacticínios magros: iogurte natural desnatado, queijo ricota ou queijo fresco.","Cereais integrais: aveia, arroz e massas integrais ajudam na excreção de sódio.","Evitar: ultraprocessados, enchidos, enlatados, caldos prontos, refrigerantes e carnes gordas."],
    "Atividade Física": ["Exercícios aeróbicos: caminhar, pedalar ou nadar — mínimo 150 minutos por semana.","Isométricos: Wall Sit durante 2 minutos e Prancha Abdominal são os mais eficazes.","Controlo da respiração: inspirar 4 segundos, expirar 8 segundos.","Hidratação: 1,5 a 2 litros de água por dia.","Evitar vícios: não fumar, moderar álcool e cafeína."]
  },
  "Colesterol Elevado": {
    "Alimentação": ["Fibras solúveis: aveia, linhaça, chia e leguminosas eliminam o colesterol.","Gorduras insaturadas: azeite extra virgem, frutos secos e peixes gordos ricos em Ómega-3.","Esteróis vegetais: abacate e sementes bloqueiam a absorção do colesterol.","Evitar: carnes gordas, enchidos, natas, queijos amarelos, pastelaria e fritos."],
    "Atividade Física": ["Exercício aeróbico moderado e contínuo aumenta o HDL.","Regularidade mais importante que intensidade — mínimo 30 a 40 minutos diários.","Evitar o sedentarismo."]
  },
  "Obesidade": {
    "Alimentação": ["Regra do prato: 50% de vegetais para ocupar espaço no estômago.","Proteína em todas as refeições preservam a massa muscular.","Evite calorias líquidas: sumos, refrigerantes e álcool.","Comida real: evite ultraprocessados."],
    "Atividade Física": ["Treino de força: o músculo queima mais calorias em repouso.","NEAT: andar a pé, usar escadas pode superar 30 min de ginásio.","Prefira caminhada, natação ou bicicleta para proteger as articulações."]
  },
  "Anemia": {
    "Alimentação": ["Ferro Heme (animal): carnes vermelhas com moderação, fígado, gema de ovo, amêijoas.","Ferro Não-Heme (vegetal): feijão, lentilhas, grão-de-bico, espinafres, brócolos.","Vitamina C na mesma refeição aumenta a absorção do ferro vegetal.","Evitar: café, chá e lacticínios logo após as refeições."],
    "Atividade Física": ["Exercício de baixa a moderada intensidade enquanto os níveis não estabilizarem.","Evite corridas de longa distância.","O descanso é fundamental."]
  },
  "Osteoporose": {
    "Alimentação": ["Cálcio: lacticínios, brócolos, couve galega, amêndoas.","Vitamina D: exposição solar 15 min/dia, peixes gordos e gemas de ovo.","Evitar: excesso de sal, cafeína e refrigerantes de cola."],
    "Atividade Física": ["Impacto controlado: caminhar, dançar ou subir escadas estimulam o osso.","Treino de força: musculação ou elásticos estimulam a criação de massa óssea.","Ioga ou pilates: fortalecem o core e melhoram o equilíbrio."]
  },
  "Insuficiência Renal": {
    "Alimentação": ["Controlo da proteína: quantidade moderada e de elevada qualidade.","Atenção ao potássio e fósforo: evitar banana, abacate, frutos secos.","Sódio quase zero: o sal retém líquidos."],
    "Atividade Física": ["Intensidade leve a moderada: caminhadas ou ciclismo leve.","Evitar exercício intenso.","Evitar desidratação."]
  },
  "Insuficiência Hepática": {
    "Alimentação": ["Fracionamento: 5 a 6 refeições pequenas por dia.","Proteínas vegetais e lacticínios: melhor toleradas que a carne vermelha.","Restrição de sódio quase total.","Proibido: álcool (total), mariscos crus e alimentos gordurosos."],
    "Atividade Física": ["Exercícios de resistência leves para combater a sarcopenia.","Caminhadas curtas de baixo impacto."]
  },
  "Hepatite B": {
    "Alimentação": ["Proibição total do álcool.","Dieta mediterrânica: rica em antioxidantes.","Proteínas magras: peixe, frango sem pele, tofu, leguminosas."],
    "Atividade Física": ["Fase aguda: repouso ou atividade muito moderada.","Fase crónica: 40 minutos, 4 a 5 vezes por semana.","Caminhadas rápidas, natação e ciclismo."]
  },
  "Doença de Behçet": {
    "Alimentação": ["Dieta anti-inflamatória: rica em Ómega-3 (peixes gordos, linhaça, nozes).","Antioxidantes: frutos vermelhos, brócolos, cenoura.","Crises de aftas: evitar alimentos ácidos ou picantes.","Evitar: açúcares refinados e gorduras trans."],
    "Atividade Física": ["Exercício moderado em remissão: caminhadas, natação ou ioga.","Respeitar a fadiga crónica.","Manter-se ativo para prevenir tromboses."]
  }
};
