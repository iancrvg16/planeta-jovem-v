import type { CountryData } from './contentTypes'

export const paises: CountryData[] = [
  {
    slug: 'galixandria',
    nome: 'Galixandria',
    status: 'ativo',
    lema: 'Galixandria: Terra, Mar, União.',
    resumo:
      'Entre florestas, rios e arquipélagos, o país mais antigo e isolado do Planeta Jovem V conecta natureza, ciência e participação cidadã.',
    missao: 'Saúde Digital',
    icone: 'sun',
    cores: { primaria: '#206c70', secundaria: '#d7a645', destaque: '#6ae0d3' },
    historia:
      'A história de Galixandria começou com comunidades próximas aos rios, florestas, campos e costas. A proteção dos recursos naturais levou a uma cultura de cooperação e responsabilidade coletiva. O isolamento preservou tradições e conhecimentos; a ciência passou a conectar as regiões sem abandonar a preservação ambiental. Solara consolidou-se como centro de ciência, tecnologia, cultura e administração.',
    bandeira: {
      arquivo: '1789400638988.png',
      significado: [
        'Verde-azulado e turquesa: oceano, rios, biodiversidade dos seis biomas, paz social e responsabilidade ecológica.',
        'Dourado e laranja solar: sol tropical, riqueza mineral e energia criativa do povo.',
        'Estrela de oito pontas (Solara): ciência e inteligência coletiva. Coqueiro: flora, litoral e resiliência. Onda: união entre terra e mar, renovação e economia circular.',
      ],
    },
    brasao: 'brasao-extraido.pdf',
    hino: {
      titulo: 'Hino Nacional de Galixandria',
      imagem: '1789772212078.png',
      revisao: true,
      // TODO: revisão da transcrição do hino pela tripulação; preserva a grafia visível na imagem.
      letra:
        'Galixandria, pátria amada, de biomas seis tecida,\nOnde a Amazônia sagrada pulsa, cheia de vida.\nDos teus rios, a Solara brilha com luz solar,\nOnde a cultura e o progresso vêm nos abraçar.\nCruzando a Savana, de troncos retorcidos,\nSentimos o pulso dos dias já vividos.\n\nDo Pantanal, planície bendita, espelho das águas,\nOnde o jacaré e a garça deixam suas pegadas.\nÀ Caatinga forte, sertão de semente,\nOnde a resistência é a alma da gente.\nDos Pampas sem fim, de campos e serras,\nOs gaúchos guardam suas ricas terras.\n\nREFRÃO\nGalixandria, estrela no céu e na terra,\nTua força unida nenhuma montanha quebra.\nDiversidade é o teu canto, e a tecnologia teu guia,\nCom fé e coragem, marchamos para um novo dia!\nCom minerais de riquezas e energia a gerar,\nSeremos sempre grandes, como o teu brasão a ornar!\n\nMata Atlântica, floresta que ao mar se une,\nPraias douradas, a brisa que nos consome.\nDe Solara a Horizonte, Costa Verde e Araguar,\nCidades brilhantes, prontas para prosperar.\nTeu povo unido, de histórias infinitas,\nEscreve o futuro nas páginas mais bonitas.',
    },
    governo: {
      modelo: 'Tecnocracia Participativa',
      descricao:
        'Dados e tecnologia apoiam as decisões; a participação humana permanece central. A soberania popular está acima de decisões algorítmicas ou militares. Grandes decisões sociais, ambientais e territoriais passam por discussão e validação cidadã.',
      conselhos: [
        {
          nome: 'Bem-Estar e Saúde Digital',
          descricao:
            'Saúde da população, monitoramento climático, prevenção e resposta a doenças sazonais.',
        },
        {
          nome: 'Inovação e Sustentabilidade',
          descricao:
            'Desenvolvimento ecológico, infraestrutura inteligente, economia circular e uso consciente dos recursos.',
        },
        {
          nome: 'Cidadania, Cultura e Direitos',
          descricao:
            'Mediação de conflitos, valorização cultural, privacidade, proteção de direitos e participação cidadã.',
        },
      ],
      ministerios: [
        {
          nome: 'Saúde',
          descricao:
            'Políticas de saúde, prevenção de doenças, atendimento e Saúde Digital.',
        },
        {
          nome: 'Educação',
          responsavel: 'Tiago Aragão',
          descricao:
            'Educação hoje, um futuro melhor amanhã. Formação cidadã, ciência, tecnologia responsável, saúde e consciência ambiental.',
        },
        {
          nome: 'Defesa',
          responsavel: 'Juan',
          descricao:
            'Proteção territorial e dos biomas, combate ao desmatamento e à biopirataria, cibersegurança, drones, sensores e resposta a emergências.',
        },
        {
          nome: 'Integração Ecológica e Biodiversidade',
          responsavel: 'Victória',
          descricao:
            'Integrar desenvolvimento, tecnologia e preservação ambiental; proteger os seis ambientes naturais e incentivar a economia circular.',
        },
        {
          nome: 'Tecnologia e Infraestrutura',
          descricao:
            'Conectividade, internet, energia limpa, transporte, pesquisa, inovação e proteção dos sistemas digitais.',
        },
        {
          nome: 'Cultura e Direitos',
          descricao:
            'Artes, patrimônio, direitos, convivência social e participação cidadã.',
        },
      ],
      processo: [
        'Sugestões',
        'Discussão',
        'Proposta',
        'Votação',
        'Registro',
        'Execução',
      ],
    },
    leis: [
      {
        numero: '001/2026',
        nome: 'Proteção Ambiental e Desenvolvimento Sustentável',
        objetivo:
          'Compatibilizar o desenvolvimento com a preservação do patrimônio natural.',
        itens: [
          'Proteger a biodiversidade.',
          'Preservar água e solo.',
          'Proteger os seis ambientes naturais.',
          'Prevenir a degradação ambiental.',
          'Incentivar tecnologias sustentáveis.',
          'Promover educação ambiental.',
          'Estimular a economia circular.',
          'Garantir participação cidadã em grandes projetos ambientais.',
        ],
      },
      {
        numero: '002/2026',
        nome: 'Saúde Digital e Vigilância Epidemiológica',
        objetivo:
          'Integrar tecnologia, saúde pública, prevenção e participação da população.',
        itens: [
          'Integrar dados ambientais e de saúde.',
          'Criar alertas para doenças sazonais.',
          'Utilizar sensores, drones e ferramentas digitais.',
          'Ampliar a telemedicina.',
          'Reforçar saneamento e controle de vetores.',
          'Proteger dados pessoais.',
          'Promover educação preventiva.',
          'Estabelecer resposta integrada em situações de emergência.',
        ],
      },
    ],
    territorio: {
      mapa: 'mapa-extraido.pdf',
      autoria: 'Tiago Aragão, com base nas descrições de Douglas Rodrigues',
      capital: 'Solara',
      cidades: [
        'Solara · 12 milhões de habitantes',
        'Horizonte · 6,2 milhões',
        'RioSol · 5,2 milhões',
        'Nova Avalon · 4,3 milhões',
        'Serra Branca · 3,1 milhões',
        'Araguar · 2,8 milhões',
        'Aruanã · 2,4 milhões',
      ],
      regioes: [
        {
          nome: 'Dresden · Norte',
          descricao:
            'Amazônia e floresta tropical. RioSol, Verdejar, Norte Vila, Maré Alta e Arya. Rios Tigre e das Pérolas.',
        },
        {
          nome: 'Varis · Nordeste',
          descricao:
            'Cerrado, Caatinga, dunas e potencial mineral e energético. Praia das Luzes, Horizonte, Araguar, Luziana e Lumina.',
        },
        {
          nome: 'Kairun · Sudeste',
          descricao:
            'Mata Atlântica e a capital Solara. Vila Serena, Itapema, Costa Verde e Andaluzia. Praia de Madora e patrimônio de Helena e Drake.',
        },
        {
          nome: 'Arquipélago Kayrudon',
          descricao:
            'Ilhas associadas à lenda de Kayrudon, abertas à pesquisa e preservação ambiental.',
        },
        {
          nome: 'Valdrova · Sul',
          descricao:
            'Pampa, agropecuária e geadas. Nova Avalon, Alvorada, Campos Livres, Estrela do Sul e Drakken. Castelo de Aldren.',
        },
        {
          nome: 'Aldris · Centro-Oeste',
          descricao:
            'Serras, cânions e Caatinga, com menor acesso histórico à tecnologia. Serra Branca, Jardim Seco, Sertão Azul, Serra da Rocha Vermelha e Arroio da Lua.',
        },
        {
          nome: 'Kalia · Noroeste',
          descricao:
            'Pantanal e agropecuária. Aruanã, Velha Esperança, Jatobá, Andruem e Auriúba. Desafios: queimadas, endemias, caça ilegal e expansão irregular.',
        },
        {
          nome: 'Lamaçal Negro',
          descricao:
            'Área pantanosa de Kalia, com mata densa, lama escura e antigas lendas e rituais.',
        },
      ],
      rios: [
        'Rio das Pérolas',
        'Rio Tigre',
        'Rio Azul',
        'Rio Solara',
        'Rio Verde',
        'Rio Araguaia',
        'Rio Luminara',
      ],
      montanhas: [
        'Picos Norn',
        'Monte Galix',
        'Serra Branca',
        'Serra da Rocha Vermelha',
        'Serra Azul',
        'Serra do Sol',
        'Monte Estrela',
        'Monte Chiliade',
      ],
    },
    valores: [
      'Participação cidadã',
      'Cooperação',
      'Transparência',
      'Justiça e respeito',
      'Proteção ambiental',
      'Desenvolvimento sustentável',
      'Ciência e tecnologia para o bem comum',
      'Privacidade e proteção de dados',
      'Valorização da cultura',
      'Saúde e qualidade de vida',
      'Responsabilidade coletiva',
    ],
    principios: [
      'Transparência institucional',
      'Privacidade individual',
      'Cooperação',
      'Economia circular',
      'Proteção ambiental',
      'Participação cidadã',
      'Ciência e tecnologia para o bem comum',
    ],
    projetos: [
      {
        nome: 'Pinacoteca Nacional',
        descricao:
          'A Casa das Artes de Solara valoriza a produção artística, a memória e a identidade cultural de Galixandria.',
      },
      {
        nome: 'Kayrudon, o Escuro e Rei dos Mares',
        descricao:
          'Lenda nacional ligada ao arquipélago Kayrudon. Integra a tradição cultural do país; não há comprovação científica da criatura.',
      },
      {
        nome: 'Educação e Saúde',
        descricao:
          'Ciência e tecnologia utilizadas de forma ética para promover prevenção, respeito às diferenças e cuidado com o ambiente.',
      },
    ],
    eixos: [
      {
        nome: 'Vigilância Epidemiológica e Controle de Vetores',
        descricao:
          'Monitorar doenças, arboviroses, qualidade da água e áreas de risco com drones e agentes de endemias.',
      },
      {
        nome: 'Infraestrutura Sanitária e Ambiental',
        descricao:
          'Saneamento, tratamento de esgoto, gestão de resíduos, proteção da água e monitoramento ambiental.',
      },
      {
        nome: 'Adaptação da Rede Hospitalar à Sazonalidade',
        descricao:
          'Preparação de equipes e estoques, telemedicina e integração entre unidades.',
      },
      {
        nome: 'Saúde do Trabalhador e Prevenção Climática',
        descricao:
          'Prevenir exposição ao sol e calor; preparar respostas a ressacas, alagamentos, tempestades e eventos extremos.',
      },
    ],
    estrategia: [
      'Monitorar chuvas, temperatura, qualidade da água e sinais epidemiológicos.',
      'Identificar áreas de risco e presença de vetores.',
      'Acionar equipes de campo.',
      'Reforçar prevenção e comunicação com a população.',
      'Integrar unidades de saúde, agentes de endemias e escolas.',
      'Utilizar telemedicina quando apropriado.',
      'Organizar estoques e equipes conforme a sazonalidade.',
      'Registrar resultados e atualizar continuamente os dados.',
    ],
  },
  {
    slug: 'astalania',
    nome: 'Astalânia',
    status: 'ativo',
    lema: 'O mar é nossa força, o futuro é nosso projeto!',
    lemaProvisorio: true,
    // TODO: confirmar lema oficial. A frase publicada é o slogan da peça de 23/09.
    resumo:
      'Um reino voltado para o mar, onde sustentabilidade, biodiversidade e soberania digital orientam a construção do futuro.',
    missao: 'Sustentabilidade · Biodiversidade · Soberania Digital',
    icone: 'wave',
    cores: { primaria: '#01327b', secundaria: '#01433b', destaque: '#83cfff' },
    bandeira: {
      arquivo: 'Bárbara 13 setembro 2 (BANDEIRA).png',
      significado: [
        'Azul profundo: oceano e riqueza marítima.',
        'Azul-claro: águas limpas e esperança.',
        'Verde: biodiversidade e preservação ambiental.',
        'Branco: paz, cooperação e sustentabilidade.',
        'Uma onda envolve uma concha com estrela de cinco pontas: força, riqueza do mar, futuro e conhecimento.',
      ],
    },
    hino: {
      titulo: 'Astalânia — Terra de Mar e Esperança',
      autoria: 'Rayssa',
      guia: 'Sol maior (G) · 4/4 · 76 BPM. Caráter solene, crescente e esperançoso. Acordes: G | D | Em | C • G | D | Em | C • G | D | Em | C • G | D | G | G.',
      letra:
        'Entre as ondas nasceu nosso reino,\nSob o céu, junto ao azul do mar,\nAstalânia ergue sua bandeira,\nCom coragem para caminhar.\nDo oceano vem nossa riqueza,\nNosso alimento, trabalho e união,\nMas sabemos que o mar é um tesouro\nQue pertence a toda geração.\n\nREFRÃO\nAstalânia, reino das águas,\nTerra forte de paz e união,\nQue o futuro encontre em nossas mãos\nUm oceano de preservação.\n\nPescadores lançam suas redes,\nCientistas procuram compreender,\nE o povo unido protege as águas\nPara o mar continuar a viver.\nTecnologia a serviço do povo,\nConhecimento para transformar,\nCom soberania e responsabilidade,\nConstruiremos um novo lugar.\n\nREFRÃO\n\nQue as marés levem nossa esperança,\nQue as ondas tragam prosperidade,\nE que Astalânia seja lembrada\nPelo amor à sua biodiversidade.\nViva o mar! Viva Astalânia!\nViva o povo e sua união!\nQue as águas sejam nossa força,\nE a preservação, nossa missão!',
    },
    governo: {
      modelo: 'Monarquia participativa',
      descricao: 'A Coroa governa junto com representantes do povo.',
      liderancas: [
        {
          nome: 'Rei Aren IV',
          descricao:
            'O Guardião das Marés: proteção do reino e administração responsável das riquezas naturais.',
        },
        {
          nome: 'Rainha Líria',
          descricao:
            'A Voz das Águas: políticas sociais, educação, cultura e qualidade de vida.',
        },
      ],
      conselhos: [
        {
          nome: 'Conselho das Marés',
          descricao:
            'Representantes das áreas ambiental, pesca, ciência e tecnologia, soberania digital, finanças, educação e cultura.',
        },
      ],
    },
    territorio: {
      mapa: 'Giovana 16 setembro 3.png',
      regioes: [
        {
          nome: 'Porto Real',
          descricao:
            'Paisagem costeira ligada à navegação, ao comércio e à conexão entre a cidade e o mar.',
        },
        {
          nome: 'Vila de Pescadores',
          descricao:
            'Convivência sustentável entre desenvolvimento humano e ecossistema marinho.',
        },
        {
          nome: 'Patrimônio natural',
          descricao:
            'Praias, ilhas, recifes de corais, manguezais, trilhas e cachoeiras, além do centro histórico.',
        },
      ],
    },
    moeda: {
      nome: 'Astal (A$)',
      descricao:
        'O Astal é dividido em 100 centavos e conecta a economia à biodiversidade, ao povo e ao conhecimento.',
      cedulas: [
        { valor: 2, tema: 'Biodiversidade marinha' },
        { valor: 5, tema: 'Pescadores de Astalânia' },
        { valor: 10, tema: 'Educação e juventude' },
        { valor: 20, tema: 'Tecnologia e Soberania Digital' },
        { valor: 50, tema: 'Sustentabilidade e energia limpa' },
        { valor: 100, tema: 'Patrimônio natural' },
        { valor: 200, tema: 'Identidade nacional' },
      ],
      moedas: '1, 5, 10, 25 e 50 centavos; A$ 1 e A$ 2.',
    },
    valores: [
      'Sustentabilidade',
      'Biodiversidade',
      'Soberania Digital',
      'Cooperação',
      'Preservação ambiental',
    ],
    projetos: [
      {
        nome: 'Centro de Soberania Digital',
        responsavel: 'Marcos (Oráculo)',
        descricao:
          'Tecnologia, conhecimento, segurança, proteção de dados, pensamento crítico, criatividade, inovação e cidadania digital.',
      },
      {
        nome: 'Vila de Pescadores',
        responsavel: 'Bárbara',
        descricao:
          'Segurança alimentar com pesca não predatória; ensino de aquacultura e monitoramento da biodiversidade; preservação da identidade e cooperação pela proteção ambiental.',
      },
      {
        nome: 'Novas moradias',
        responsavel: 'Bárbara, Giovana e Yasmim',
        descricao:
          'Construção de casas, trabalho coletivo e expansão da infraestrutura do país.',
      },
      {
        nome: 'Hospital Real de Astalânia',
        responsavel: 'Giovana',
        descricao:
          'Saúde e bem-estar, com atendimento de qualidade, acolhimento e segurança.',
      },
      {
        nome: 'Turismo sustentável',
        responsavel: 'Bárbara',
        descricao:
          'Valorização da cultura, da economia local e da preservação ambiental por meio do patrimônio natural e histórico.',
      },
    ],
  },
  {
    slug: 'jakkar',
    nome: 'Jakkar',
    status: 'ativo',
    lema: 'Diferentes vales, um só povo.',
    resumo:
      'Entre montanhas e vales, diferentes povos encontram na educação, no diálogo e na cooperação um caminho para construir uma história compartilhada.',
    missao: 'Educação e união entre os povos',
    icone: 'mountain',
    cores: { primaria: '#1c3d6e', secundaria: '#827b71', destaque: '#f0c36f' },
    historia:
      'Jakkar é uma nação montanhosa e geograficamente isolada. A Grande Cisão dos Vales nasceu de conflitos por terras férteis e recursos escassos. Os povos das altas montanhas preservam tradições e saberes ancestrais; os habitantes dos vales baixos têm maior abertura ao comércio e à tecnologia. O país busca superar preconceitos e desconfianças sem apagar sua diversidade cultural.',
    bandeira: {
      arquivo: 'Bandeira de Jakkar.png',
      significado: [
        'A bandeira recebida apresenta fundo azul-marinho e um emblema central em tons dourados. O significado oficial dos elementos ainda será publicado pelos tripulantes.',
      ],
    },
    // TODO: confirmar significados oficiais da bandeira de Jakkar; as cores foram amostradas, sem atribuir simbolismo inventado.
    governo: {
      modelo: 'Democrático e descentralizado',
      descricao:
        'Cada comunidade escolhe seus representantes e participa das decisões nacionais. Nenhuma região concentra poder absoluto.',
      conselhos: [
        {
          nome: 'Conselho Nacional dos Vales',
          descricao:
            'Representa as comunidades, media conflitos, discute terras e recursos, cria propostas de desenvolvimento e promove paz e cooperação.',
        },
      ],
    },
    leis: [
      {
        nome: 'Lei da União e da Paz dos Vales',
        objetivo:
          'Garantir a igualdade, a paz e a união entre todos os povos de Jakkar.',
        itens: [
          'Artigo 1º: Todos os cidadãos de Jakkar, independentemente de sua etnia, cultura ou origem, terão os mesmos direitos e deveres.',
          'Artigo 2º: É proibida qualquer forma de discriminação, violência ou perseguição entre os povos dos vales.',
          'Artigo 3º: Conflitos relacionados a terras e recursos naturais deverão ser resolvidos por meio do diálogo e da participação de representantes das comunidades envolvidas.',
          'Artigo 4º: O Estado deverá promover ações que incentivem o respeito, a convivência pacífica e a cooperação entre os diferentes povos.',
        ],
      },
      {
        nome: 'Lei da Educação e do Desenvolvimento para Todos',
        objetivo:
          'Garantir que todas as crianças e jovens de Jakkar tenham acesso à educação de qualidade.',
        itens: [
          'Artigo 1º: O Estado garantirá educação gratuita e acessível em todas as regiões de Jakkar, incluindo os vales e áreas mais isoladas.',
          'Artigo 2º: As escolas deverão ensinar a história, a cultura e as tradições dos diferentes povos de Jakkar.',
          'Artigo 3º: Todos os estudantes terão oportunidades iguais de aprendizado, independentemente de sua origem ou condição social.',
          'Artigo 4º: A educação deverá incentivar o respeito às diferenças, a cooperação e a resolução pacífica de conflitos.',
        ],
      },
    ],
    territorio: {
      regioes: [
        {
          nome: 'Altas Montanhas',
          descricao:
            'Comunidades que preservam tradições, costumes e conhecimentos ancestrais.',
        },
        {
          nome: 'Vales Baixos',
          descricao:
            'Comunidades mais abertas ao comércio, a novas tecnologias e ao desenvolvimento.',
        },
      ],
    },
    valores: [
      'União entre os povos',
      'Paz',
      'Educação',
      'Preservação das tradições',
      'Desenvolvimento',
      'Igualdade',
      'Diálogo',
      'Respeito às diferenças',
      'Cooperação',
    ],
    projetos: [
      {
        nome: 'Programa Pontes de Jakkar',
        responsavel: 'Suellem Silva',
        descricao:
          'Aproximar as comunidades pela educação, pelo diálogo e pela convivência. Representantes buscam soluções pacíficas para conflitos por terras, recursos, áreas férteis e comércio, respeitando a preservação cultural.',
      },
      {
        nome: 'Escolas de Fronteira',
        responsavel: 'Suellem Silva',
        descricao:
          'Espaços neutros entre montanhas e vales, onde jovens de diferentes comunidades estudam juntos. O currículo inclui histórias, culturas, tradições, conhecimentos e problemas dos vales; projetos em grupo, festivais e mediadores incentivam a cooperação.',
      },
      {
        nome: 'Biblioteca de Jakkar',
        responsavel: 'Leonardo',
        descricao:
          'Proposta de biblioteca comunitária de madeira e pedra, com estantes, mesas, espaços de leitura e registros históricos. Cresce conforme livros, manuscritos e histórias são recuperados.',
      },
    ],
    desafios: [
      {
        titulo: 'Incêndio na Biblioteca Ancestral',
        descricao:
          'Em 23/09, um incêndio destruiu parte do acervo. A comunidade salvou manuscritos. O debate envolve a guarda comunitária, a digitalização e uma biblioteca nacional, respeitando saberes tradicionais nunca divulgados.',
        entrega: 'j-incendio',
      },
      {
        titulo: 'Uma decisão construída em conjunto',
        descricao:
          'Lucaskauan Pinheiro propôs ouvir as opiniões e chegar a um acordo ou votação. Em 24/09, Leonardo apresentou uma biblioteca comunitária que preserva e reconstrói o conhecimento.',
        entrega: 'j-biblioteca',
      },
      {
        titulo: 'Pandemia Jakkar',
        descricao:
          'Peça visual recebida com o acervo de Jakkar. O registro não traz data ou detalhamento textual do desafio.',
        entrega: 'j-pandemia',
      },
    ],
  },
  {
    slug: 'jambor',
    nome: 'Jambor',
    status: 'ativo',
    lema: 'Nosso país, nosso futuro.',
    lemaProvisorio: true,
    // Slogan do Banner.png; os documentos não estabelecem um lema nacional.
    resumo:
      'Entre florestas, rios, serras e grutas, o Reino de Jambor une a diversidade de seus povos à preservação ambiental, à participação cidadã e à soberania digital.',
    missao: 'Preservação ambiental · Soberania Digital',
    icone: 'mountain',
    cores: { primaria: '#003f30', secundaria: '#006f75', destaque: '#b6e752' },
    historia:
      'As primeiras comunidades de Jambor se estabeleceram junto aos rios e vales, conectadas por trocas e conhecimentos sobre a floresta. O Pacto dos Vales firmou a proteção coletiva das águas. A tradição associa a unificação sob uma mesma Coroa à Rainha Amara I, preservando as identidades regionais. Mais tarde, o Movimento dos Vales e a Constituição limitaram o poder real e instituíram a representação parlamentar. A proteção da natureza permanece central diante do desmatamento, do garimpo ilegal e da ocupação irregular de terras.',
    bandeira: {
      // Escolha editorial documentada em docs/entrega-jambor.md; sem atribuir simbolismos ausentes.
      arquivo: 'bandeira de Jambor.jpeg',
      significado: [
        'Faixas laterais verdes e painel central azul-esverdeado, separados por faixas verde-limão.',
        'Flor branca sobre duas mãos, com o nome Jambor e uma estrela abaixo.',
      ],
    },
    brasao: 'brasão.jpeg',
    hino: {
      titulo: 'Hino Nacional de Jambor',
      letra:
        'I\nDas serras altas onde nasce a alvorada,\nAo sol que doura a floresta sagrada,\nErgue-se a voz dos primeiros vales,\nLivre de medo, imune aos males!\nNossos rios correm com força e união,\nGuardando a história de cada irmão.\n\n(Refrão)\nJambor! Jambor! Terra de encanto e luz!\nA tua natureza ao futuro nos conduz.\nNas águas puras e no verde sem fim,\nPrometemos proteger o teu solo assim!\n\nII\nDas grutas profundas ao alto patamar,\nOnde as cachoeiras vêm a cantar,\nPovo de paz, de mente e razão,\nErguemos a força de nossa nação.\nUnidos pelo pacto e pela Constituição,\nGuardamos a Terra Viva no coração!\n\n(Refrão)\nJambor! Jambor! Terra de encanto e luz!\nA tua natureza ao futuro nos conduz.\nNas águas puras e no verde sem fim,\nPrometemos proteger o teu solo assim!\n\nIII\nSempre soberana, firme a caminhar,\nJambor, para sempre, vamos te honrar!\n\nFilhos da terra, guardiões deste chão,\nCom honra e justiça no mesmo compasso,\nJambor é viva em cada coração,\nE a nossa história vence o tempo e o espaço!',
    },
    governo: {
      modelo: 'Monarquia Parlamentar Constitucional',
      descricao:
        'A Constituição define Jambor como Reino soberano e democrático. A soberania pertence ao povo; a Coroa exerce a Chefia de Estado e representa a unidade nacional. O Governo é chefiado pelo Primeiro-Ministro e responde perante o Parlamento.',
      liderancas: [
        {
          nome: 'Rainha Amara I',
          descricao:
            'A história associa a Rainha Amara I à unificação das comunidades sob uma mesma Coroa. O Manual do País também a menciona ao apresentar a Constituição e o Pacto dos Vales.',
        },
      ],
      conselhos: [
        {
          nome: 'Parlamento de Jambor',
          descricao:
            'Representantes eleitos elaboram leis, aprovam o orçamento e fiscalizam o Governo, expressando a diversidade política e territorial do país.',
        },
        {
          nome: 'Governo e Primeiro-Ministro',
          descricao:
            'O Primeiro-Ministro, nomeado pelo Monarca com apoio parlamentar, dirige a administração pública e a execução das leis.',
        },
      ],
    },
    territorio: {
      regioes: [
        {
          nome: 'Florestas e vales',
          descricao:
            'Extensas áreas florestais e vales fluviais conectam os ambientes naturais e as comunidades. O clima é predominantemente tropical úmido.',
        },
        {
          nome: 'Serras, planaltos e águas',
          descricao:
            'O relevo acidentado reúne nascentes, rios e cachoeiras. A ação da água também formou cavernas, grutas e sistemas subterrâneos.',
        },
        {
          nome: 'Fronteira com Jakkar',
          descricao:
            'Florestas e cursos de água atravessam a fronteira terrestre. A proteção desses ecossistemas exige fiscalização e cooperação entre os países.',
        },
      ],
    },
    valores: [
      'Cooperação',
      'Responsabilidade',
      'Hospitalidade',
      'Conhecimento',
      'Preservação',
      'Participação',
    ],
    projetos: [
      {
        nome: 'Escola Jambor de Ciências e Tecnologia',
        descricao:
          'Proposta de escola pública híbrida que combina aulas presenciais, atividades digitais e projetos de ciência, tecnologia, meio ambiente, cultura e formação geral.',
      },
      {
        nome: 'Projeto Fronteira Segura',
        descricao:
          'Propõe postos de fiscalização, a Guarda Verde, monitoramento e canais de comunicação para proteger as comunidades e combater crimes ambientais, com cooperação diplomática com Jakkar.',
      },
      {
        nome: 'Soberania Digital',
        descricao:
          'Autonomia tecnológica apoiada em conhecimento, infraestrutura nacional, tecnologias abertas e capacidade de manter e substituir sistemas, reduzindo a dependência de fornecedores sem abandonar a cooperação internacional.',
      },
      {
        nome: 'Projeto Nascente',
        descricao:
          'Apresentação sobre autonomia tecnológica, sistemas operacionais e uso de uma base aberta para adaptar e manter soluções digitais.',
      },
      {
        nome: 'Cooperativa Jambor',
        descricao:
          'Reúne pescadores, artesãos, agricultores e jovens empreendedores em torno do trabalho em equipe, da produção justa, da pesca sustentável, da agricultura familiar e da inovação.',
      },
      {
        nome: 'Pinacoteca de Jambor',
        descricao:
          'Em Porto Jambor, o acervo reúne arte, natureza e memória das comunidades, valorizando pescadores, agricultores, artesãos e jovens criadores.',
      },
    ],
  },
  {
    slug: 'lervuria',
    nome: 'Lervúria',
    status: 'ativo',
    lema: 'Progresso e Preservação',
    resumo:
      'Quatro regiões conectadas por ferrovias unem ventos, águas, sol e a força da terra. Na Capital da Inovação, ciência, cultura e energia sustentável convergem para o desenvolvimento com preservação ambiental.',
    missao: 'Energia sustentável · Inovação · Inclusão social',
    icone: 'mountain',
    cores: { primaria: '#166512', secundaria: '#edbb00', destaque: '#79cde6' },
    historia:
      'Lervúria nasceu da integração de quatro províncias: as planícies do Norte, as serras e os vales do Sul, as terras ensolaradas do Leste e os solos férteis e vulcânicos do Oeste. Uma extensa malha ferroviária superou o isolamento e convergiu para o planalto central, onde se formou a Capital da Inovação. O Pacto de Integração Nacional consolidou o Estado moderno e firmou o compromisso de conciliar crescimento industrial e proteção ambiental, expresso no lema do brasão: Progresso e Preservação.',
    bandeira: {
      arquivo: 'lervuria-bandeira.png',
      significado: [
        'Amarelo: prosperidade. Branco: paz. Verde: vigor.',
        'Laranja: movimento. Azul-claro: tranquilidade. Cinza: inovação.',
        'O símbolo central reúne montanhas e sol. Os trilhos ferroviários representam a integração das regiões do país.',
      ],
    },
    brasao: 'lervuria-brasao.png',
    hino: {
      titulo: 'Hino de Lervúria',
      // Versão textual intitulada no DOCX; o PDF apresenta somente o início.
      // O trecho posterior sem título não foi fundido a esta versão. Ver relatório.
      letra:
        'Ó Lervúria, terra de esperança,\nDe campos verdes, rios a brilhar,\nTeu povo unido avança e alcança\nUm novo mundo para construir e sonhar.\n\nEm tuas terras, riquezas florescem,\nSob o sol que ilumina o teu chão,\nMontanhas, florestas e mares oferecem\nÀ nossa gente força e inspiração.\n\nLervúria, Lervúria, terra querida,\nDe prosperidade, coragem e união,\nQue tua riqueza sustente a vida,\nE teu futuro se erga com nossas mãos.\n\nDo vento nasce a força que nos guia,\nDo sol vem a energia para crescer,\nCiência e trabalho trazem novos dias,\nE o conhecimento nos faz vencer.\n\nQue a natureza seja sempre honrada,\nQue nenhum povo fique para trás,\nE que a juventude, forte e preparada,\nConstrua um futuro de justiça e paz.\n\nLervúria, Lervúria, terra querida,\nDe prosperidade, coragem e união,\nQue tua riqueza sustente a vida,\nE teu futuro se erga com nossas mãos.\n\nErgue-se ao céu a nossa bandeira,\nSímbolo vivo da nossa nação,\nLervúria seguirá sua jornada inteira,\nCom esperança, trabalho e determinação.\n\nE enquanto houver estrelas sobre a terra,\nEnquanto houver sonhos para realizar,\nLervúria seguirá firme e sincera,\nPróspera e livre, sempre a caminhar.',
    },
    governo: {
      modelo: 'República Democrática',
      descricao:
        'O governo se orienta pelo bem-estar social, pela justiça e pela transparência. As quatro regiões possuem autonomia e governos próprios, unidos por uma mesma Constituição, e elegem representantes para discutir assuntos nacionais na região central. A Constituição estabelece os poderes Executivo, Legislativo e Judiciário como distintos e independentes.',
      conselhos: [],
    },
    leis: [
      {
        nome: 'Constituição de Lervúria',
        objetivo:
          'Assegurar direitos sociais e individuais, liberdade, segurança, bem-estar, igualdade e justiça. O texto integral está no material institucional disponível em Documentos oficiais.',
        itens: [
          'Soberania, cidadania, dignidade da pessoa humana, trabalho e livre iniciativa.',
          'Democracia, divisão de poderes, igualdade e combate à discriminação e às desigualdades.',
          'Direitos sociais e trabalhistas, saúde pública, inclusão e participação cidadã.',
          'Preservação dos ambientes naturais e relações internacionais orientadas pela paz.',
        ],
      },
    ],
    territorio: {
      capital: 'Capital da Inovação',
      regioes: [
        {
          nome: 'Norte — Região dos Ventos',
          descricao:
            'Área elevada e aberta, com planícies e ventos constantes. A proposta energética concentra a geração eólica nas áreas costeiras e nos corredores de vento.',
        },
        {
          nome: 'Sul — Região das Águas',
          descricao:
            'Serras, rios, vales e grandes desníveis de altitude favorecem a geração hidrelétrica com cachoeiras e barragens.',
        },
        {
          nome: 'Leste — Região Solar',
          descricao:
            'Terras mais secas e com grande incidência solar, destinadas à produção de energia em fazendas solares.',
        },
        {
          nome: 'Oeste — Biomassa e Energia Geotérmica',
          descricao:
            'Áreas agrícolas e atividade do subsolo permitem propor biomassa a partir de resíduos e energia geotérmica onde houver condições geológicas adequadas.',
        },
        {
          nome: 'Centro — Capital da Inovação',
          descricao:
            'Polo tecnológico e administrativo entre as quatro regiões, com centros de pesquisa, universidades, empresas e sistemas de armazenamento de energia.',
        },
      ],
    },
    valores: [
      'Progresso e preservação',
      'Integração regional',
      'Justiça social',
      'Democracia e transparência',
      'Educação e inovação',
      'Sustentabilidade',
    ],
    projetos: [
      {
        nome: 'Sistema energético integrado e transição energética',
        descricao:
          'A proposta conecta a geração eólica do Norte, hidrelétrica do Sul, solar do Leste e de biomassa e geotérmica do Oeste por uma rede elétrica inteligente. O Centro coordena armazenamento em baterias e hidrogênio verde, compensação entre regiões e redistribuição eficiente. O governo central orienta a participação regional na produção sustentável, sem metas numéricas definidas nos materiais.',
      },
      {
        nome: 'Política Nacional de Inclusão Social',
        descricao:
          'Capacitação no Norte, serviços básicos no Sul, participação comunitária no Leste e redução das desigualdades no Oeste convergem para o Centro Coordenador. O objetivo é acompanhar o avanço tecnológico com acesso à educação, saúde e conectividade.',
      },
      {
        nome: 'Educação regionalizada e inovação',
        descricao:
          'As regiões têm autonomia educacional e propõem cursos superiores ligados às suas vocações econômicas e energéticas. A sustentabilidade é ensinada desde a infância, e as universidades aproximam pesquisa e necessidades locais.',
      },
      {
        nome: 'Pinacoteca de Lervúria',
        descricao:
          'Na convergência das quatro regiões, a arquitetura reúne pedra vulcânica do Oeste, cerâmica do Sul, vitrais solares do Leste e tubos acústicos voltados aos ventos do Norte. As alas Sinfonia dos Ventos, Memória da Argila, Aura Solar e Raízes e Vulcões celebram Elara, Kaio, Solis e Maya, os guardiões criativos apresentados no acervo.',
      },
      {
        nome: 'Plano Integrado de Reconstrução da Pinacoteca',
        descricao:
          'O plano propõe proteção emergencial e restauração do acervo, contenção e drenagem do terreno, parque com jardins de chuva, galerias elevadas e reservatórios. Inclui acessibilidade, participação comunitária e a Pinacoteca Digital Lervúria Imersiva, com recursos de realidade virtual e aumentada. São propostas do documento, sem registro de execução concluída.',
      },
    ],
  },
]
