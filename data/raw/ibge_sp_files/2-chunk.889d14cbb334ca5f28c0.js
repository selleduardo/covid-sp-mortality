webpackJsonp([2],{

/***/ 600:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var panorama_service_1 = __webpack_require__(604);
var router_1 = __webpack_require__(11);
var common_1 = __webpack_require__(7);
var core_1 = __webpack_require__(1);
var estado_sintese_component_1 = __webpack_require__(626);
var estado_sintese_service_1 = __webpack_require__(613);
var shared_module_1 = __webpack_require__(78);
var routes = [
    {
        path: ':uf',
        component: estado_sintese_component_1.EstadoSinteseComponent
    }
];
var EstadoSinteseModule = (function () {
    function EstadoSinteseModule() {
    }
    EstadoSinteseModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes),
            ],
            exports: [],
            declarations: [estado_sintese_component_1.EstadoSinteseComponent],
            providers: [
                panorama_service_1.PanoramaService,
                estado_sintese_service_1.EstadoSinteseService
            ],
        })
    ], EstadoSinteseModule);
    return EstadoSinteseModule;
}());
exports.EstadoSinteseModule = EstadoSinteseModule;


/***/ }),

/***/ 604:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var configuration_1 = __webpack_require__(605);
var shared_1 = __webpack_require__(4);
var utils_1 = __webpack_require__(21);
var notas_especiais_1 = __webpack_require__(610);
var Observable_1 = __webpack_require__(0);
__webpack_require__(59);
var aniversario_service_1 = __webpack_require__(46);
var PanoramaService = (function () {
    function PanoramaService(_resultadoService, _localidadeService, _rankingService3, _bibliotecaService, _conjunturaisService, _pesquisasConfiguration, _aniversarioService, _nomesBrasilService, _traducaoServ) {
        this._resultadoService = _resultadoService;
        this._localidadeService = _localidadeService;
        this._rankingService3 = _rankingService3;
        this._bibliotecaService = _bibliotecaService;
        this._conjunturaisService = _conjunturaisService;
        this._pesquisasConfiguration = _pesquisasConfiguration;
        this._aniversarioService = _aniversarioService;
        this._nomesBrasilService = _nomesBrasilService;
        this._traducaoServ = _traducaoServ;
        this._totalUfs = this._localidadeService.getRoot().children.length;
        this._totalMunicipios = this._localidadeService.getRoot().children.reduce(function (sum, uf) { return sum + uf.children.length; }, 0);
    }
    PanoramaService.prototype.getConfiguracao = function (tipo) {
        var _a = configuration_1.PANORAMA[tipo] || { temas: [], indicadores: [] }, temas = _a.temas, indicadores = _a.indicadores;
        var hash = utils_1.converterObjArrayEmHash(indicadores, 'tema', true);
        return temas.reduce(function (agg, tema) { return agg.concat(hash[tema]); }, []).filter(Boolean);
    };
    PanoramaService.prototype.getResultados = function (configuracao, localidade) {
        var _this = this;
        var itensPesquisas = [];
        var itensConjunturais = [];
        var order = {};
        configuracao.forEach(function (item, idx) {
            if (!item.indicadorId) {
                return;
            }
            switch (item.servico) {
                case 'conjunturais':
                    itensConjunturais.push(item);
                    break;
                default:
                    itensPesquisas.push(item);
                    break;
            }
            order[item.indicadorId] = idx;
        });
        var resPesquisas = itensPesquisas.length > 0
            ? this._resultadoService.getResultadosCompletos(itensPesquisas.map(function (item) { return item.indicadorId; }), localidade.codigo)
            : Observable_1.Observable.of([]);
        var resConjunturais = itensConjunturais.length > 0
            ? Observable_1.Observable.zip.apply(Observable_1.Observable, itensConjunturais.map(function (item) {
                return _this._conjunturaisService.getIndicadorAsResultado(item.pesquisaId, item.indicadorId, item.quantidadePeriodos, item.categoria);
            })) : Observable_1.Observable.of([]);
        return Observable_1.Observable.zip(resConjunturais, resPesquisas)
            .map(function (_a) {
            var conjunturais = _a[0], pesquisas = _a[1];
            return pesquisas
                .concat.apply(pesquisas, conjunturais).reduce(function (arr, item) {
                var idx = order[item.indicadorId];
                arr[idx] = item;
                return arr;
            }, []);
        });
    };
    PanoramaService.prototype.getResumo = function (configuracao, localidade) {
        var _this = this;
        // Retorna dados fixos para o município Boa Esperança do Norte / MT
        if (localidade.codigo == 510183) {
            return Observable_1.Observable.from([DADOS_MUNINICIO_NOVO]);
        }
        if (localidade.codigo === 0) {
            return this.getResumoBrasil(configuracao, localidade);
        }
        return Observable_1.Observable.zip(this._getResultadosIndicadores(configuracao, localidade), localidade.tipo === 'municipio' ? this._bibliotecaService.getValuesMunicipio(localidade.codigo) : this._bibliotecaService.getValuesEstado(localidade.codigo), localidade.tipo === 'municipio' ? this._localidadeService.getRegioesMunicipio(localidade.codigoCompleto.toString()) : Observable_1.Observable.of([]), localidade.tipo === 'municipio' ? this._aniversarioService.getAniversarioMunicipio(localidade.codigo.toString()) : Observable_1.Observable.of([]), localidade.tipo === 'municipio' || localidade.tipo === 'uf' ? this._nomesBrasilService.getNomesMaisPopulares(localidade.codigoCompleto) : Observable_1.Observable.of([])).map(function (_a) {
            var resultados = _a[0], valoresBiblioteca = _a[1], valoresLocalidade = _a[2], aniversario = _a[3], nomesPopulares = _a[4];
            return configuracao
                .filter(function (item) { return Boolean(item.indicadorId) || _this.isIndicadorGentilico(item.titulo) ||
                _this.isIndicadorRegiao(item.titulo) || _this.isIndicadorAniversario(item.titulo) ||
                _this.isIndicadorNomeMasculinoMaisPopular(item.titulo) ||
                _this.isIndicadorNomeFemininoMaisPopular(item.titulo) ||
                _this.isIndicadorSobrenomeMaisPopular(item.titulo); })
                .map(function (item) {
                var periodo = item.periodo
                    || resultados[item.indicadorId] && resultados[item.indicadorId].periodoValidoMaisRecente
                    || '-';
                var titulo = item.titulo
                    || (resultados[item.indicadorId] &&
                        resultados[item.indicadorId].indicador &&
                        resultados[item.indicadorId].indicador.nome);
                var valor = (resultados[item.indicadorId] &&
                    resultados[item.indicadorId].indicador &&
                    resultados[item.indicadorId].getValor(periodo)) || _this.tratarIndicadoresOutrosServicos(item.titulo, valoresBiblioteca, valoresLocalidade, aniversario, nomesPopulares);
                var notaJuridica = (resultados[item.indicadorId] &&
                    resultados[item.indicadorId].getNotaJuridica(periodo)) || '';
                var unidade = (resultados[item.indicadorId] &&
                    resultados[item.indicadorId].indicador &&
                    resultados[item.indicadorId].indicador.unidade.toString()) || '';
                var tipo = (resultados[item.indicadorId] &&
                    resultados[item.indicadorId].indicador &&
                    resultados[item.indicadorId].indicador.unidade.classe.toString()) || '';
                var notas = (resultados[item.indicadorId] &&
                    resultados[item.indicadorId].indicador &&
                    resultados[item.indicadorId].indicador.notas) || [];
                var fontes = [];
                if (resultados[item.indicadorId] &&
                    resultados[item.indicadorId].indicador) {
                    var indicador = resultados[item.indicadorId].indicador;
                    if (indicador.fontes && indicador.fontes.length > 0) {
                        fontes = indicador.fontes;
                    }
                    else if (indicador.pesquisa) {
                        var f = indicador.pesquisa.getFontesDoPeriodo(item.periodo);
                        if (f[0]) {
                            fontes = [{
                                    periodo: item.periodo,
                                    fontes: f,
                                }];
                        }
                    }
                }
                if (_this.isIndicadorNomeMasculinoMaisPopular(item.titulo) || _this.isIndicadorNomeFemininoMaisPopular(item.titulo) || _this.isIndicadorSobrenomeMaisPopular(item.titulo)) {
                    fontes.push({ periodo: "-", fontes: ["Nomes e sobrenome mais comum: IBGE, Censo Demográfico 2022"] });
                }
                return {
                    tema: item.tema,
                    titulo: titulo,
                    periodo: periodo,
                    valor: valor,
                    unidade: unidade,
                    tipo: tipo,
                    notas: notas,
                    notaJuridica: notaJuridica,
                    fontes: fontes,
                    id: item.indicadorId
                };
            });
        });
    };
    PanoramaService.prototype.getResumoBrasil = function (configuracao, localidade) {
        var _this = this;
        var itensPesquisas = [];
        var itensConjunturais = [];
        var itensNomes = [];
        var order = {};
        configuracao.forEach(function (item, idx) {
            if (!item.indicadorId && item.servico != 'nomesDoBrasil') {
                return;
            }
            switch (item.servico) {
                case 'conjunturais':
                    itensConjunturais.push(item);
                    break;
                case 'nomesDoBrasil':
                    itensNomes.push(item);
                    break;
                default:
                    itensPesquisas.push(item);
                    break;
            }
            order[item.titulo] = idx;
        });
        var respostaServicoNomes = this._getResultadosNomesBrasil(localidade).map(function (resposta) {
            var resultado = itensNomes.map(function (item) {
                var tituloIndicador = item.titulo;
                var valor = '';
                if (_this.isIndicadorNomeMasculinoMaisPopular(tituloIndicador)) {
                    valor = resposta.homens[0].nome.charAt(0).toUpperCase() + resposta.homens[0].nome.slice(1);
                }
                if (_this.isIndicadorNomeFemininoMaisPopular(tituloIndicador)) {
                    valor = resposta.mulheres[0].nome.charAt(0).toUpperCase() + resposta.mulheres[0].nome.slice(1);
                }
                if (_this.isIndicadorSobrenomeMaisPopular(tituloIndicador)) {
                    valor = resposta.sobrenomes[0].nome.charAt(0).toUpperCase() + resposta.sobrenomes[0].nome.slice(1);
                }
                // this._traducaoServ.L10N(this._traducaoServ.lang, tituloIndicador)
                return {
                    tema: item.tema,
                    titulo: tituloIndicador,
                    periodo: '2022',
                    valor: valor,
                    unidade: '',
                    notas: [],
                    fontes: [{ periodo: "-", fontes: ["Nomes e sobrenome mais comum: IBGE, Censo Demográfico 2022"] }]
                };
            });
            return resultado;
        });
        var resPesquisas = this._getResultadosIndicadores(itensPesquisas, localidade)
            .map(function (resultados) {
            return itensPesquisas.map(function (item) {
                var periodo = item.periodo
                    || resultados[item.indicadorId] && resultados[item.indicadorId].periodoValidoMaisRecente
                    || '-';
                var titulo = item.titulo
                    || (resultados[item.indicadorId] &&
                        resultados[item.indicadorId].indicador &&
                        resultados[item.indicadorId].indicador.nome);
                var valor = (resultados[item.indicadorId] &&
                    resultados[item.indicadorId].indicador &&
                    resultados[item.indicadorId].getValor(periodo)) || '-';
                var unidade = (resultados[item.indicadorId] &&
                    resultados[item.indicadorId].indicador &&
                    resultados[item.indicadorId].indicador.unidade.toString()) || '';
                var notas = (resultados[item.indicadorId] &&
                    resultados[item.indicadorId].indicador &&
                    resultados[item.indicadorId].indicador.notas) || [];
                var fontes = (resultados[item.indicadorId] &&
                    resultados[item.indicadorId].indicador &&
                    resultados[item.indicadorId].indicador.fontes) || [];
                return {
                    tema: item.tema,
                    titulo: titulo,
                    periodo: periodo,
                    valor: valor,
                    unidade: unidade,
                    notas: notas,
                    fontes: fontes
                };
            });
        });
        var resConjunturais = Observable_1.Observable.zip.apply(Observable_1.Observable, itensConjunturais
            .map(function (item) {
            return _this._conjunturaisService.getIndicadorAsResultado(item.pesquisaId, item.indicadorId, item.quantidadePeriodos, item.categoria).take(1).map(function (json) {
                var obj = json[0];
                var periodo = item.periodo || obj.periodoValidoMaisRecente || '-';
                var titulo = item.titulo || obj.indicador.nome;
                var valor = obj.getValor(periodo);
                var unidade = obj.indicador.unidade.nome === 'Percentual' ? '%' : obj.indicador.unidade.nome;
                var notas = [];
                var fontes = [];
                return {
                    tema: item.tema,
                    titulo: titulo,
                    periodo: periodo,
                    valor: valor,
                    unidade: unidade,
                    notas: notas,
                    fontes: fontes
                };
            });
        }));
        return Observable_1.Observable.zip(resConjunturais, resPesquisas, respostaServicoNomes)
            .map(function (_a) {
            var conjunturais = _a[0], pesquisas = _a[1], nomesDoBrasil = _a[2];
            return (_b = pesquisas
                .concat.apply(pesquisas, conjunturais)).concat.apply(_b, nomesDoBrasil).reduce(function (arr, item) {
                var idx = order[item.titulo];
                arr[idx] = item;
                return arr;
            }, []);
            var _b;
        });
    };
    PanoramaService.prototype.getTemas = function (configuracao, localidade, exibirIndicadoresNumericosNoPainel) {
        var _this = this;
        if (exibirIndicadoresNumericosNoPainel === void 0) { exibirIndicadoresNumericosNoPainel = false; }
        var resultados$ = this._getResultadosIndicadores(configuracao, localidade);
        var rankings$ = localidade.tipo === shared_1.niveisTerritoriais.pais.label ?
            Observable_1.Observable.of({}) : this._getPosicaoRankings(configuracao, localidade);
        return Observable_1.Observable.zip(resultados$, rankings$)
            .map(function (_a) {
            var resultados = _a[0], rankings = _a[1];
            return {
                configuracao: _this._organizarConfiguracaoParaTemas(configuracao, resultados, rankings, exibirIndicadoresNumericosNoPainel),
                resultados: resultados,
                rankings: rankings
            };
        });
    };
    PanoramaService.prototype.getNotaEspecial = function (idIndicador) {
        var notaEspecial = notas_especiais_1.notasEspeciais.filter(function (nota) { return nota.indicador == idIndicador; });
        return notaEspecial.length > 0 ? notaEspecial[0]['nota'] : '';
    };
    PanoramaService.prototype._getResultadosNomesBrasil = function (localidade) {
        return this._nomesBrasilService.getNomesMaisPopulares(localidade.codigoCompleto);
    };
    PanoramaService.prototype._getResultadosIndicadores = function (configuracao, localidade) {
        var _this = this;
        var itensPesquisas = [];
        var itensConjunturais = [];
        configuracao.forEach(function (item, idx) {
            switch (item.servico) {
                case 'conjunturais':
                    if (item.indicadorId) {
                        itensConjunturais.push(item);
                    }
                    if (item.grafico) {
                        item.grafico.dados.forEach(function (obj) {
                            itensConjunturais.push(obj);
                        });
                    }
                    break;
                default:
                    if (item.indicadorId) {
                        itensPesquisas.push(item.indicadorId);
                    }
                    if (item.grafico) {
                        item.grafico.dados.forEach(function (obj) {
                            itensPesquisas.push(obj.indicadorId);
                        });
                    }
                    break;
            }
        });
        itensPesquisas = utils_1.arrayUniqueValues(itensPesquisas);
        itensConjunturais = utils_1.converterObjArrayEmHash(itensConjunturais, 'indicadorId', true);
        itensConjunturais = Object.keys(itensConjunturais).map(function (key) { return itensConjunturais[key][0]; });
        var resPesquisas = itensPesquisas.length <= 0
            ? Observable_1.Observable.of([])
            : this._resultadoService.getResultadosCompletos(itensPesquisas, localidade.codigo)
                .map(function (resultados) { return utils_1.converterObjArrayEmHash(resultados, 'indicador.id'); });
        var resConjunturais = itensConjunturais.length <= 0
            ? Observable_1.Observable.of([])
            : Observable_1.Observable.zip.apply(Observable_1.Observable, itensConjunturais.map(function (item) {
                return _this._conjunturaisService
                    .getIndicadorAsResultado(item.pesquisaId, item.indicadorId, item.quantidadePeriodos, item.categoria);
            })).map(function (resultados) { return utils_1.converterObjArrayEmHash([].concat.apply([], resultados), 'indicador.id'); });
        return Observable_1.Observable.zip(resPesquisas, resConjunturais)
            .map(function (_a) {
            var pesquisas = _a[0], conjunturais = _a[1];
            return Object.assign({}, pesquisas, conjunturais);
        });
    };
    PanoramaService.prototype._getPosicaoRankings = function (configuracao, localidade) {
        var _this = this;
        var indicadores = configuracao
            .filter(function (item) { return item.visualizacao === configuration_1.PanoramaVisualizacao.painel; })
            .map(function (item) { return ({ indicadorId: item.indicadorId, periodo: item.periodo }); });
        if (indicadores.length === 0) {
            return Observable_1.Observable.of({});
        }
        var contextos = ['BR'];
        if (localidade.parent && localidade.parent.codigo) {
            contextos.push(localidade.parent.codigo.toString());
        }
        if (localidade.microrregiao) {
            contextos.push(localidade.microrregiao.toString());
        }
        if (localidade.regiaoImediata) {
            contextos.push(localidade.regiaoImediata.toString());
        }
        return this._rankingService3.getRankingsIndicador(indicadores, contextos, localidade.codigo)
            .map(function (response) {
            return response.reduce(function (agg, ranking) {
                var id = ranking.indicadorId;
                if (!agg[id]) {
                    agg[id] = {};
                }
                var _ranking = ranking && ranking.res && ranking.res[0] && ranking.res[0].ranking;
                switch (ranking.contexto) {
                    case 'BR':
                        agg[id].BR = {
                            posicao: _ranking,
                            itens: localidade.tipo === 'municipio' ? _this._totalMunicipios : _this._totalUfs
                        };
                        break;
                    case localidade.parent.codigo.toString():
                        agg[id].local = { posicao: _ranking, itens: localidade.parent.children.length };
                        break;
                    case localidade.microrregiao.toString():
                        var qtdeMicrorregioes = _this._localidadeService.getMunicipiosMicrorregiao(localidade.microrregiao).length;
                        agg[id].microrregiao = { posicao: _ranking, itens: qtdeMicrorregioes };
                        break;
                    case localidade.regiaoImediata.toString():
                        var qtdeRegioesImediatas = _this._localidadeService.getMunicipiosRegiaoImediata(localidade.regiaoImediata).length;
                        agg[id].regiaoImediata = { posicao: _ranking, itens: qtdeRegioesImediatas };
                        break;
                }
                return agg;
            }, {});
        });
    };
    PanoramaService.prototype._organizarConfiguracaoParaTemas = function (configuracao, resultados, rankings, exibirIndicadoresNumericosNoPainel) {
        var _this = this;
        if (exibirIndicadoresNumericosNoPainel === void 0) { exibirIndicadoresNumericosNoPainel = false; }
        var temas = configuracao
            .reduce(function (_a, item) {
            var temas = _a.temas, posicao = _a.posicao;
            if (!item.tema) {
                return { temas: temas, posicao: posicao };
            }
            if (!temas[item.tema]) {
                temas[item.tema] = {
                    idx: posicao,
                    painel: [],
                    graficos: [],
                    indicadoresNumericos: []
                };
                posicao++;
            }
            // Trata os indicadores numéricos e gráficos como se fossem painéis
            if (exibirIndicadoresNumericosNoPainel && (item.visualizacao === configuration_1.PanoramaVisualizacao.numerico || item.visualizacao === configuration_1.PanoramaVisualizacao.grafico) && !!resultados[item.indicadorId]) {
                var painel = _this._prepararDadosPainel(item, resultados, rankings);
                temas[item.tema].painel.push(painel);
            }
            if (item.visualizacao === configuration_1.PanoramaVisualizacao.painel) {
                var painel = _this._prepararDadosPainel(item, resultados, rankings);
                temas[item.tema].painel.push(painel);
            }
            if (item.visualizacao === configuration_1.PanoramaVisualizacao.grafico) {
                var grafico = _this._prepararDadosGrafico(item, resultados);
                temas[item.tema].graficos.push(grafico);
            }
            return { temas: temas, posicao: posicao };
        }, { temas: {}, posicao: 0 }).temas;
        return Object.keys(temas)
            .reduce(function (agg, tema) {
            var _a = temas[tema], idx = _a.idx, painel = _a.painel, graficos = _a.graficos;
            agg[idx] = { tema: tema, painel: painel, graficos: graficos };
            return agg;
        }, [])
            .reduce(function (arr, itens) { return arr.concat(itens); }, []);
    };
    PanoramaService.prototype._prepararDadosPainel = function (item, resultados, rankings) {
        var resultado = resultados[item.indicadorId];
        var periodo = item.periodo ? item.periodo : resultado.periodoMaisRecente;
        return {
            mostrarLinkRanking: this._pesquisasConfiguration.isValida(item.pesquisaId),
            pesquisaId: item.pesquisaId,
            indicadorId: item.indicadorId,
            titulo: item.titulo,
            valor: resultado ? resultado.getValor(periodo) : '-',
            periodo: periodo,
            unidade: resultado && resultado.indicador.unidade.toString(),
            tipoDado: resultado && resultado.indicador && resultado.indicador.unidade && resultado.indicador.unidade.classe,
            ranking: rankings[item.indicadorId]
        };
    };
    PanoramaService.prototype._prepararDadosGrafico = function (item, resultados) {
        return {
            tipo: item.grafico.tipo,
            titulo: item.grafico.titulo,
            unidade: this.getUnidade(item, resultados),
            eixoX: this.getEixoX(item, resultados),
            dados: this.getDados(item, resultados),
            fontes: this.getFontes(item, resultados),
            link: item.grafico.link
        };
    };
    PanoramaService.prototype.getUnidade = function (item, resultados) {
        var indicadorId = item.grafico.dados[0].indicadorId;
        var res = resultados[indicadorId];
        if (res && res.indicador && res.indicador.unidade) {
            return res.indicador.unidade;
        }
        return null;
    };
    PanoramaService.prototype.getEixoX = function (item, resultados) {
        var indicadorId = item.grafico.dados[0].indicadorId;
        if (!resultados[indicadorId]) {
            return null;
        }
        return resultados[indicadorId].periodosValidos;
    };
    PanoramaService.prototype.getDados = function (item, resultados) {
        var _this = this;
        return item.grafico.dados.map(function (item) {
            var indicadorId = item.indicadorId;
            var resultado = resultados[indicadorId];
            if (!resultado) {
                return null;
            }
            var valores = resultado.valoresValidos.map(function (valor) { return _this.tratarCasosEspeciais(valor); });
            var nome = resultado.indicador.nome;
            return { data: valores, anos: resultado.periodosValidos, label: nome };
        });
    };
    PanoramaService.prototype.getFontes = function (item, resultados) {
        if (item.grafico.fontes && item.grafico.fontes.length > 0) {
            return item.grafico.fontes;
        }
        var indicadorId = item.grafico.dados[0].indicadorId;
        if (!resultados[indicadorId]) {
            return null;
        }
        return resultados[indicadorId].indicador.pesquisa ?
            resultados[indicadorId].indicador.pesquisa.getAllFontes() : [];
    };
    PanoramaService.prototype.converterParaNumero = function (valor) {
        if (valor === '99999999999999' || valor === '99999999999998' || valor === '99999999999997' ||
            valor === '99999999999996' || valor === '99999999999995' || valor === '99999999999992' ||
            valor === '99999999999991') {
            valor = '0';
        }
        return !!valor ? Number(valor.replace(',', '.')) : Number(valor);
    };
    PanoramaService.prototype.tratarCasosEspeciais = function (valor) {
        if (valor === '99999999999999' || valor === '99999999999998' || valor === '99999999999997' ||
            valor === '99999999999996' || valor === '99999999999995' || valor === '99999999999992' ||
            valor === '99999999999991') {
            return '0';
        }
        return valor;
    };
    PanoramaService.prototype.isIndicadorGentilico = function (tituloIndicador) {
        var chaveTraducaoIndicadorGentilico = [
            'panorama_configuration_municipio_gentilico',
            'panorama_configuration_estado_gentilico'
        ];
        return chaveTraducaoIndicadorGentilico.indexOf(tituloIndicador) >= 0;
    };
    PanoramaService.prototype.isIndicadorAniversario = function (tituloIndicador) {
        return tituloIndicador == 'panorama_configuration_municipio_aniversario';
    };
    PanoramaService.prototype.isIndicadorNomeMasculinoMaisPopular = function (tituloIndicador) {
        return tituloIndicador == 'panorama_configuration_nome_masculino_mais_popular';
    };
    PanoramaService.prototype.isIndicadorNomeFemininoMaisPopular = function (tituloIndicador) {
        return tituloIndicador == 'panorama_configuration_nome_feminino_mais_popular';
    };
    PanoramaService.prototype.isIndicadorSobrenomeMaisPopular = function (tituloIndicador) {
        return tituloIndicador == 'panorama_configuration_sobrenome_mais_popular';
    };
    PanoramaService.prototype.isIndicadorRegiao = function (tituloIndicador) {
        var chaveTraducao = [
            'panorama_configuration_municipio_micro_regiao',
            'panorama_configuration_municipio_meso_regiao',
            'panorama_configuration_municipio_regiao_imediata',
            'panorama_configuration_municipio_regiao_intermediaria'
        ];
        return chaveTraducao.indexOf(tituloIndicador) >= 0;
    };
    PanoramaService.prototype.tratarIndicadoresOutrosServicos = function (tituloIndicador, valoresBiblioteca, valoresLocalidade, aniversario, nomesPopulares) {
        var MESES_ANO = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        if (this.isIndicadorGentilico(tituloIndicador)) {
            return valoresBiblioteca.GENTILICO;
        }
        if (this.isIndicadorAniversario(tituloIndicador)) {
            if (!aniversario) {
                return "-";
            }
            var diaAniversario = aniversario['diaAniversario'];
            // Mês de aniversário sempre com 2 dígitos
            var mesAniversario = aniversario['mesAniversario'].toString().length == 1 ? '0' + aniversario['mesAniversario'].toString() : aniversario['mesAniversario'].toString();
            // Inclui os dois formatos de aniversário: extenso e resumido
            var valoresAniversario = [];
            valoresAniversario.push(diaAniversario + " de " + MESES_ANO[parseInt(mesAniversario) - 1]);
            valoresAniversario.push(diaAniversario + "/" + mesAniversario);
            return valoresAniversario;
        }
        if (this.isIndicadorNomeMasculinoMaisPopular(tituloIndicador)) {
            return nomesPopulares.homens[0].nome.charAt(0).toUpperCase() + nomesPopulares.homens[0].nome.slice(1);
        }
        if (this.isIndicadorNomeFemininoMaisPopular(tituloIndicador)) {
            return nomesPopulares.mulheres[0].nome.charAt(0).toUpperCase() + nomesPopulares.mulheres[0].nome.slice(1);
        }
        if (this.isIndicadorSobrenomeMaisPopular(tituloIndicador)) {
            return nomesPopulares.sobrenomes[0].nome.charAt(0).toUpperCase() + nomesPopulares.sobrenomes[0].nome.slice(1);
        }
        return '-';
    };
    PanoramaService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [shared_1.ResultadoService3,
            shared_1.LocalidadeService3,
            shared_1.RankingService3,
            shared_1.BibliotecaService,
            shared_1.ConjunturaisService,
            shared_1.PesquisaConfiguration,
            aniversario_service_1.AniversarioService,
            shared_1.NomesBrasilService,
            shared_1.TraducaoService])
    ], PanoramaService);
    return PanoramaService;
}());
exports.PanoramaService = PanoramaService;
var DADOS_MUNINICIO_NOVO = [
    {
        "tema": "",
        "titulo": "panorama_configuration_municipio_codigo",
        "periodo": "2016",
        "valor": "5101837",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": [],
        "id": 29169
    },
    {
        "tema": "",
        "titulo": "panorama_configuration_municipio_gentilico",
        "periodo": "-",
        "valor": "-",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": []
    },
    {
        "tema": "",
        "titulo": "panorama_configuration_municipio_aniversario",
        "periodo": "-",
        "valor": ["-"],
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": []
    },
    {
        "tema": "",
        "titulo": "panorama_configuration_municipio_prefeito",
        "periodo": "2025",
        "valor": "Calebe Francesco Francio",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": [],
        "id": 29170
    },
    {
        "tema": "População",
        "titulo": "panorama_configuration_municipio_populacao_ultimo_censo",
        "periodo": "2022",
        "valor": "-",
        "unidade": "pessoas",
        "tipo": "N",
        "notas": [],
        "notaJuridica": "",
        "fontes": [],
        "id": 96385
    },
    {
        "tema": "População",
        "titulo": "panorama_configuration_municipio_populacao_estimada",
        "periodo": "2024",
        "valor": "5772",
        "unidade": "pessoas",
        "tipo": "N",
        "notas": [
            {
                "periodo": "2020",
                "notas": [
                    "Para \"dúvidas e contestações\" [clique aqui](https://www.ibge.gov.br/estatisticas/sociais/populacao/9103-estimativas-de-populacao.html)"
                ]
            },
            {
                "periodo": "2019",
                "notas": [
                    "Para \"dúvidas e contestações\" [clique aqui](https://www.ibge.gov.br/estatisticas/sociais/populacao/9103-estimativas-de-populacao.html)"
                ]
            },
            {
                "periodo": "2021",
                "notas": [
                    "Para \"dúvidas e contestações\" [clique aqui](https://www.ibge.gov.br/estatisticas/sociais/populacao/9103-estimativas-de-populacao.html)"
                ]
            },
            {
                "periodo": "2024",
                "notas": [
                    "Para \"dúvidas e contestações\" [clique aqui](https://www.ibge.gov.br/estatisticas/sociais/populacao/9103-estimativas-de-populacao.html)"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2020",
                "fontes": [
                    "IBGE, Diretoria de Pesquisas, Coordenação de População e Indicadores Sociais, Estimativas da população residente com data de referência 1o de julho de 2020"
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "IBGE, Diretoria de Pesquisas, Coordenação de População e Indicadores Sociais, Estimativas da população residente com data de referência 1o de julho de 2017"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "IBGE, Diretoria de Pesquisas, Coordenação de População e Indicadores Sociais, Estimativas da população residente com data de referência 1o de julho de 2018"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "IBGE, Diretoria de Pesquisas, Coordenação de População e Indicadores Sociais, Estimativas da população residente com data de referência 1o de julho de 2019"
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "IBGE, Diretoria de Pesquisas, Coordenação de População e Indicadores Sociais, Estimativas da população residente com data de referência 1o de julho de 2021"
                ]
            },
            {
                "periodo": "2024",
                "fontes": [
                    "IBGE, Diretoria de Pesquisas, Coordenação de População e Indicadores Sociais, Estimativas da população residente com data de referência 1o de julho de 2024"
                ]
            }
        ],
        "id": 29171
    },
    {
        "tema": "População",
        "titulo": "panorama_configuration_municipio_densidade_demografica",
        "periodo": "2022",
        "valor": "-",
        "unidade": "habitante por quilômetro quadrado",
        "tipo": "N",
        "notas": [
            {
                "periodo": "2022",
                "notas": [
                    "Atualizado em 22/12/2023"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [],
        "id": 96386
    },
    {
        "tema": "Trabalho e Rendimento",
        "titulo": "panorama_configuration_municipio_salario_trabalhadores_formais",
        "periodo": "2022",
        "valor": "-",
        "unidade": "salários mínimos",
        "tipo": "N",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2022",
                "fontes": [
                    "IBGE, Cadastro Central de Empresas 2022. Rio de Janeiro: IBGE, 2024"
                ]
            }
        ],
        "id": 143558
    },
    {
        "tema": "Trabalho e Rendimento",
        "titulo": "panorama_configuration_municipio_pessoal_ocupado",
        "periodo": "2022",
        "valor": "-",
        "unidade": "pessoas",
        "tipo": "N",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2022",
                "fontes": [
                    "IBGE, Cadastro Central de Empresas 2022. Rio de Janeiro: IBGE, 2024"
                ]
            }
        ],
        "id": 143514
    },
    {
        "tema": "Trabalho e Rendimento",
        "titulo": "panorama_configuration_municipio_populacao_ocupada",
        "periodo": "2022",
        "valor": "-",
        "unidade": "%",
        "tipo": "N",
        "notas": [
            {
                "periodo": "-",
                "notas": [
                    "[pessoal ocupado no município/população total do município] x 100"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2014",
                "fontes": [
                    "IBGE, Cadastro Central de Empresas (CEMPRE) 2014 (data de referência: 31/12/2014)",
                    "IBGE, Estimativa da população 2014 (data de referência: 1/7/2014)"
                ]
            },
            {
                "periodo": "2015",
                "fontes": [
                    "IBGE, Cadastro Central de Empresas (CEMPRE) 2015 (data de referência: 31/12/2015)",
                    "IBGE, Estimativa da população 2015 (data de referência: 1/7/2015)"
                ]
            },
            {
                "periodo": "2020",
                "fontes": [
                    "IBGE, Cadastro Central de Empresas (CEMPRE) 2020 (data de referência: 31/12/2020)",
                    "IBGE, Estimativa da população 2020 (data de referência: 1/7/2020)"
                ]
            },
            {
                "periodo": "2016",
                "fontes": [
                    "IBGE, Cadastro Central de Empresas (CEMPRE) 2016 (data de referência: 31/12/2016)",
                    "IBGE, Estimativa da população 2016 (data de referência: 1/7/2016)"
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "IBGE, Cadastro Central de Empresas (CEMPRE) 2017 (data de referência: 31/12/2017)",
                    "IBGE, Estimativa da população 2017 (data de referência: 1/7/2017)"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "IBGE, Cadastro Central de Empresas (CEMPRE) 2018 (data de referência: 31/12/2018)",
                    "IBGE, Estimativa da população 2018 (data de referência: 1/7/2018)"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "IBGE, Cadastro Central de Empresas (CEMPRE) 2019 (data de referência: 31/12/2019)",
                    "IBGE, Estimativa da população 2019 (data de referência: 1/7/2019)"
                ]
            },
            {
                "periodo": "2022",
                "fontes": [
                    "IBGE, Censo Demográfico 2022",
                    "IBGE, Cadastro Central de Empresas 2022. Rio de Janeiro: IBGE, 2024"
                ]
            }
        ],
        "id": 60036
    },
    {
        "tema": "Trabalho e Rendimento",
        "titulo": "panorama_configuration_municipio_pencentual_pupulacao_rendimento_ate_meio_salario",
        "periodo": "2010",
        "valor": "-",
        "unidade": "%",
        "tipo": "N",
        "notas": [
            {
                "periodo": "2010",
                "notas": [
                    "[População residente em domicílios particulares permanentes com rendimento mensal de até 1/2 salário mínimo / População total residente em domicílios particulares permanentes] * 100"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2010",
                "fontes": [
                    "IBGE, Censo Demográfico 2010"
                ]
            }
        ],
        "id": 60037
    },
    {
        "tema": "Educação",
        "titulo": "panorama_configuration_municipio_taxa_escolarizacao",
        "periodo": "2010",
        "valor": "-",
        "unidade": "%",
        "tipo": "N",
        "notas": [
            {
                "periodo": "2010",
                "notas": [
                    "[população residente no município de 6 a 14 anos de idade matriculada no ensino regular/total de população residente no município de 6 a 14 anos de idade] x 100"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2010",
                "fontes": [
                    "IBGE, Censo Demográfico 2010"
                ]
            }
        ],
        "id": 60045
    },
    {
        "tema": "Educação",
        "titulo": "panorama_configuration_municipio_ideb_anos_iniciais_fundamental",
        "periodo": "2023",
        "valor": "-",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2017",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2017"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2019"
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2021"
                ]
            }
        ],
        "id": 78187
    },
    {
        "tema": "Educação",
        "titulo": "panorama_configuration_municipio_ideb_anos_finais_fundamental",
        "periodo": "2023",
        "valor": "-",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2017",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2017"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2019"
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2021"
                ]
            }
        ],
        "id": 78192
    },
    {
        "tema": "Educação",
        "titulo": "panorama_configuration_municipio_matriculas_fundamental",
        "periodo": "2023",
        "valor": "-",
        "unidade": "matrículas",
        "tipo": "N",
        "notas": [
            {
                "periodo": "-",
                "notas": [
                    "Inclui matrículas do ensino fundamental de 8 e 9 anos de ensino regular e/ou especial"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2015",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2015"
                ]
            },
            {
                "periodo": "2020",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2020. Brasília: Inep, 2021. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2017"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2018. Brasília: Inep, 2019. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 10 05. 2019."
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2019. Brasília: Inep, 2020. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2021. Brasília: Inep, 2022. Disponível em <https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar/resultados>. Acesso em: 30.05.2022."
                ]
            }
        ],
        "id": 5908
    },
    {
        "tema": "Educação",
        "titulo": "panorama_configuration_municipio_matriculas_medio",
        "periodo": "2023",
        "valor": "-",
        "unidade": "matrículas",
        "tipo": "N",
        "notas": [
            {
                "periodo": "-",
                "notas": [
                    "Inclui matrículas do ensino médio propedêutico, normal/magistério e médio integrado (Técnico integrado) de ensino regular e/ou especial"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2015",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2015"
                ]
            },
            {
                "periodo": "2020",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2020. Brasília: Inep, 2021. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2017"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2018. Brasília: Inep, 2019. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 10 05. 2019."
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2019. Brasília: Inep, 2020. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2021. Brasília: Inep, 2022. Disponível em <https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar/resultados>. Acesso em: 30.05.2022."
                ]
            }
        ],
        "id": 5913
    },
    {
        "tema": "Educação",
        "titulo": "panorama_configuration_municipio_docentes_ensino_fundamental",
        "periodo": "2023",
        "valor": "-",
        "unidade": "docentes",
        "tipo": "N",
        "notas": [
            {
                "periodo": "-",
                "notas": [
                    "A nível de Brasil, os docentes são contados uma única vez, independente se atuam em mais de uma região geográfica, unidade da federação, município ou Etapa de Ensino e Dependência Administrativa",
                    "A nível de Unidade da Federação, os docentes são contados uma única vez em cada Unidade da Federação (UF), portanto o somatório não representa a soma das 27 UF's, dos municípios ou das etapas de ensino/dependências administrativas, pois o mesmo docente pode atuar em mais de uma unidade",
                    "A nível de município, os docentes são contados uma única vez em cada município, portanto o somatório não representa a soma dos 5.570 municípios ou das etapas de ensino/dependências administrativas, pois o mesmo docente pode atuar em mais de uma unidade de agregação.",
                    "Os docentes são contados somente uma vez em cada etapa de ensino e dependência administrativa - municipal, estadual, federal ou privado -, independente de atuarem em mais de uma delas.",
                    "Inclui os docentes que atuam no ensino fundamental de 8 e 9 anos de ensino regular e/ou especial"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2020",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2020. Brasília: Inep, 2021. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2017"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2018. Brasília: Inep, 2019. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 10 05. 2019."
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2019. Brasília: Inep, 2020. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2021. Brasília: Inep, 2022. Disponível em <https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar/resultados>. Acesso em: 30.05.2022."
                ]
            }
        ],
        "id": 5929
    },
    {
        "tema": "Educação",
        "titulo": "panorama_configuration_municipio_docentes_ensino_medio",
        "periodo": "2023",
        "valor": "-",
        "unidade": "docentes",
        "tipo": "N",
        "notas": [
            {
                "periodo": "-",
                "notas": [
                    "A nível de Brasil, os docentes são contados uma única vez, independente se atuam em mais de uma região geográfica, unidade da federação, município ou Etapa de Ensino e Dependência Administrativa",
                    "A nível de Unidade da Federação, os docentes são contados uma única vez em cada Unidade da Federação (UF), portanto o somatório não representa a soma das 27 UF's, dos municípios ou das etapas de ensino/dependências administrativas, pois o mesmo docente pode atuar em mais de uma unidade",
                    "A nível de município, os docentes são contados uma única vez em cada município, portanto o somatório não representa a soma dos 5.570 municípios ou das etapas de ensino/dependências administrativas, pois o mesmo docente pode atuar em mais de uma unidade de agregação.",
                    "Inclui os docentes que atuam no ensino médio propedêutico, normal/magistério e médio integrado (Técnico Integrado) de ensino regular e/ou especial"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2020",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2020. Brasília: Inep, 2021. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2017"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2018. Brasília: Inep, 2019. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 10 05. 2019."
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2019. Brasília: Inep, 2020. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2021. Brasília: Inep, 2022. Disponível em <https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar/resultados>. Acesso em: 30.05.2022."
                ]
            }
        ],
        "id": 5934
    },
    {
        "tema": "Educação",
        "titulo": "panorama_configuration_municipio_numero_estabelecimentos_ensino_fundamental",
        "periodo": "2023",
        "valor": "-",
        "unidade": "escolas",
        "tipo": "N",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2020",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2020. Brasília: Inep, 2021. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2017"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2018. Brasília: Inep, 2019. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 10 05. 2019."
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2019. Brasília: Inep, 2020. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2021. Brasília: Inep, 2022. Disponível em <https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar/resultados>. Acesso em: 30.05.2022."
                ]
            }
        ],
        "id": 5950
    },
    {
        "tema": "Educação",
        "titulo": "panorama_configuration_municipio_numero_estabelecimentos_ensino_medio",
        "periodo": "2023",
        "valor": "-",
        "unidade": "escolas",
        "tipo": "N",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2020",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2020. Brasília: Inep, 2021. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "Ministério da Educação, Instituto Nacional de Estudos e Pesquisas Educacionais - INEP - Censo Educacional 2017"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2018. Brasília: Inep, 2019. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 10 05. 2019."
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2019. Brasília: Inep, 2020. Disponível em <http://portal.inep.gov.br/sinopses-estatisticas-da-educacao-basica>. Acesso em: 25.06.2021."
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. Sinopse Estatística da Educação Básica 2021. Brasília: Inep, 2022. Disponível em <https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar/resultados>. Acesso em: 30.05.2022."
                ]
            }
        ],
        "id": 5955
    },
    {
        "tema": "Economia",
        "titulo": "panorama_configuration_municipio_pib_per_capita",
        "periodo": "2021",
        "valor": "-",
        "unidade": "R$",
        "tipo": "$",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "-",
                "fontes": [
                    "IBGE, em parceria com os Órgãos Estaduais de Estatística, Secretarias Estaduais de Governo e Superintendência da Zona Franca de Manaus - \r\nSUFRAMA"
                ]
            }
        ],
        "id": 47001
    },
    {
        "tema": "Economia",
        "titulo": "panorama_configuration_municipio_idhm",
        "periodo": "2010",
        "valor": "-",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "-",
                "fontes": [
                    "Programa das Nações Unidas para o Desenvolvimento - PNUD"
                ]
            },
            {
                "periodo": "2013",
                "fontes": [
                    "IPEA, Instituto de Pesquisa Econômica Aplicada"
                ]
            },
            {
                "periodo": "2012",
                "fontes": [
                    "IPEA, Instituto de Pesquisa Econômica Aplicada"
                ]
            },
            {
                "periodo": "2014",
                "fontes": [
                    "IPEA, Instituto de Pesquisa Econômica Aplicada"
                ]
            },
            {
                "periodo": "2015",
                "fontes": [
                    "IPEA, Instituto de Pesquisa Econômica Aplicada"
                ]
            },
            {
                "periodo": "2020",
                "fontes": [
                    "IPEA, Instituto de Pesquisa Econômica Aplicada"
                ]
            },
            {
                "periodo": "2016",
                "fontes": [
                    "IPEA, Instituto de Pesquisa Econômica Aplicada"
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "IPEA, Instituto de Pesquisa Econômica Aplicada"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "IPEA, Instituto de Pesquisa Econômica Aplicada"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "IPEA, Instituto de Pesquisa Econômica Aplicada"
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "IPEA, Instituto de Pesquisa Econômica Aplicada"
                ]
            }
        ],
        "id": 30255
    },
    {
        "tema": "Economia",
        "titulo": "panorama_configuration_municipio_total_receitas_realizadas",
        "periodo": "2023",
        "valor": "-",
        "unidade": "R$",
        "tipo": "$",
        "notas": [
            {
                "periodo": "-",
                "notas": [
                    "Não inclui receitas intraorçamentárias"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2023",
                "fontes": [
                    "Siconfi: Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro. Brasília, DF, [2023]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/pages/public/consulta_finbra/finbra_list.jsf. Acesso em: jun. 2024",
                    "Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2023 e Despesas orçamentárias empenhadas (Anexo I-D) 2023. In: Brasil. Secretaria do Tesouro Nacional"
                ]
            }
        ],
        "id": 28141
    },
    {
        "tema": "Economia",
        "titulo": "panorama_configuration_municipio_percentual_receitas_fontes_externas",
        "periodo": "2023",
        "valor": "-",
        "unidade": "%",
        "tipo": "N",
        "notas": [
            {
                "periodo": "-",
                "notas": [
                    "Transferências correntes brutas: [Transferências correntes brutas realizadas/Total das receitas correntes brutas realizadas] x 100",
                    "Não inclui transferências intraorçamentárias"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2023",
                "fontes": [
                    "Siconfi: Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro. Brasília, DF, [2023]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/pages/public/consulta_finbra/finbra_list.jsf. Acesso em: jul. 2024, Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2023. In: Brasil. Secretaria do Tesouro Nacional"
                ]
            }
        ],
        "id": 60048
    },
    {
        "tema": "Economia",
        "titulo": "panorama_configuration_municipio_total_despesas_empenhadas",
        "periodo": "2023",
        "valor": "-",
        "unidade": "R$",
        "tipo": "$",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2023",
                "fontes": [
                    "Siconfi: Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro. Brasília, DF, [2023]. Disponível em: https://siconfi.tesouro.gov.br/siconfi/pages/public/consulta_finbra/finbra_list.jsf. Acesso em: jun. 2024",
                    "Contas anuais. Receitas orçamentárias realizadas (Anexo I-C) 2023 e Despesas orçamentárias empenhadas (Anexo I-D) 2023. In: Brasil. Secretaria do Tesouro Nacional"
                ]
            }
        ],
        "id": 29749
    },
    {
        "tema": "Saúde",
        "titulo": "panorama_configuration_municipio_mortalidade_infantil",
        "periodo": "2022",
        "valor": "-",
        "unidade": "óbitos por mil nascidos vivos",
        "tipo": "N",
        "notas": [
            {
                "periodo": "-",
                "notas": [
                    "(Nº de óbitos infantis, segundo o local de residência do falecido / Nº de nascidos vivos, segundo o local de residência da mãe) x 1000"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2014",
                "fontes": [
                    "Ministério da Saúde, Departamento de Informática do Sistema Único de Saúde - DATASUS 2014"
                ]
            },
            {
                "periodo": "2020",
                "fontes": [
                    "Ministério da Saúde, Departamento de Informática do Sistema Único de Saúde - DATASUS 2020"
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "Ministério da Saúde, Departamento de Informática do Sistema Único de Saúde - DATASUS 2017"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "Ministério da Saúde, Departamento de Informática do Sistema Único de Saúde - DATASUS 2018"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "Ministério da Saúde, Departamento de Informática do Sistema Único de Saúde - DATASUS 2019"
                ]
            },
            {
                "periodo": "2022",
                "fontes": [
                    "Ministério da Saúde, Departamento de Informática do Sistema Único de Saúde - DATASUS 2022"
                ]
            }
        ],
        "id": 30279
    },
    {
        "tema": "Saúde",
        "titulo": "panorama_configuration_municipio_internacoes_diarreia",
        "periodo": "2022",
        "valor": "-",
        "unidade": "internações por 100 mil habitantes",
        "tipo": "N",
        "notas": [
            {
                "periodo": "2022",
                "notas": [
                    "[número de internações por diarreia/população residente] x 100000"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2020",
                "fontes": [
                    "Ministério da Saúde, DATASUS - Departamento de Informática do SUS"
                ]
            },
            {
                "periodo": "2016",
                "fontes": [
                    "Ministério da Saúde, DATASUS - Departamento de Informática do SUS"
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "Ministério da Saúde, DATASUS - Departamento de Informática do SUS"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "Ministério da Saúde, DATASUS - Departamento de Informática do SUS"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "Ministério da Saúde, DATASUS - Departamento de Informática do SUS"
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "Ministério da Saúde, DATASUS - Departamento de Informática do SUS"
                ]
            },
            {
                "periodo": "2022",
                "fontes": [
                    "Ministério da Saúde, DATASUS - Departamento de Informática do SUS"
                ]
            }
        ],
        "id": 60032
    },
    {
        "tema": "Saúde",
        "titulo": "panorama_configuration_municipio_estabelecimento_saude_sus",
        "periodo": "2009",
        "valor": "-",
        "unidade": "estabelecimentos",
        "tipo": "N",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2009",
                "fontes": [
                    "IBGE, Assistência Médica Sanitária 2009"
                ]
            }
        ],
        "id": 28242
    },
    {
        "tema": "Meio Ambiente",
        "titulo": "panorama_configuration_municipio_area_urbanizada",
        "periodo": "2019",
        "valor": "-",
        "unidade": "km²",
        "tipo": "N",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2019",
                "fontes": [
                    "IBGE, Diretoria de Geociências, Coordenação de Meio Ambiente, Áreas Urbanizadas do Brasil 2019."
                ]
            }
        ],
        "id": 95335
    },
    {
        "tema": "Meio Ambiente",
        "titulo": "panorama_configuration_municipio_esgotamento_sanitario",
        "periodo": "2010",
        "valor": "-",
        "unidade": "%",
        "tipo": "N",
        "notas": [
            {
                "periodo": "2010",
                "notas": [
                    "[população total residente nos domicílios particulares permanentes com esgotamento sanitário do tipo rede geral e fossa séptica / População total residente nos domicílios particulares permanentes] x 100"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2010",
                "fontes": [
                    "Ministério do Planejamento, Desenvolvimento e Gestão",
                    "IBGE, Instituto Brasileiro de Geografia e Estatística"
                ]
            }
        ],
        "id": 60030
    },
    {
        "tema": "Meio Ambiente",
        "titulo": "panorama_configuration_municipio_arborizacao",
        "periodo": "2010",
        "valor": "-",
        "unidade": "%",
        "tipo": "N",
        "notas": [
            {
                "periodo": "2010",
                "notas": [
                    "[domicílios urbanos em face de quadra com arborização/domicílios urbanos totais] x100"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2010",
                "fontes": [
                    "IBGE, Censo Demográfico 2010"
                ]
            }
        ],
        "id": 60029
    },
    {
        "tema": "Meio Ambiente",
        "titulo": "panorama_configuration_municipio_urbanizacao",
        "periodo": "2010",
        "valor": "-",
        "unidade": "%",
        "tipo": "N",
        "notas": [
            {
                "periodo": "2010",
                "notas": [
                    "[domicílios urbanos em face de quadra com boca de lobo e pavimentação e meio-fio e calçada/domicílios urbanos totais] x 100"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2010",
                "fontes": [
                    "IBGE, Censo Demográfico 2010"
                ]
            }
        ],
        "id": 60031
    },
    {
        "tema": "Meio Ambiente",
        "titulo": "panorama_configuration_municipio_populacao_exposta_risco",
        "periodo": "2010",
        "valor": "-",
        "unidade": "pessoas",
        "tipo": "N",
        "notas": [
            {
                "periodo": "-",
                "notas": [
                    "População exposta em área de risco a inundações, enxurradas e deslizamentos contabilizada para os municípios considerados críticos a desastres naturais no Brasil e monitorados pelo Centro Nacional de Monitoramento e Alertas de Desastres Naturais – CEMADEN. Municípios ‘sem dados’ não são monitorados pelo CEMADEN ou não tem dados publicados em respeito ao sigilo estatístico."
                ]
            },
            {
                "periodo": "2010",
                "notas": [
                    "Número de moradores nos domicílios particulares permanentes ocupados, observado em 2010 pelo Censo Demográfico, inseridos nas áreas de risco hidrogeológico. No ano da publicação (2018), foram alvo do mapeamento e da associação aos dados demográficos as áreas de risco de 826 municípios, considerados críticos e monitorados pelo Centro Nacional de Monitoramento e Alertas de Desastres Naturais – CEMADEN."
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2010",
                "fontes": [
                    "População em Áreas de Risco no Brasil – 2010. IBGE, 2018. Disponível em [https://www.ibge.gov.br/geociencias/informacoes-ambientais/estudos-ambientais/21538-populacao-em-areas-de-risco-no-brasil.html?=&t=acesso-ao-produto](https://www.ibge.gov.br/geociencias/informacoes-ambientais/estudos-ambientais/21538-populacao-em-areas-de-risco-no-brasil.html?=&t=acesso-ao-produto)"
                ]
            }
        ],
        "id": 93371
    },
    {
        "tema": "Meio Ambiente",
        "titulo": "panorama_configuration_municipio_bioma",
        "periodo": "2024",
        "valor": "-",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2024",
                "fontes": [
                    "Bioma predominante: IBGE, Diretoria de Geociências, Coordenação de Meio Ambiente, Biomas 2024"
                ]
            }
        ],
        "id": 77861
    },
    {
        "tema": "Meio Ambiente",
        "titulo": "panorama_configuration_municipio_sistena_costeiro_marinho",
        "periodo": "2019",
        "valor": "-",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2019",
                "fontes": [
                    "Sistema Costeiro-Marinho: IBGE, Diretoria de Geociências, Coordenação de Meio Ambiente, Biomas 2019"
                ]
            }
        ],
        "id": 82270
    },
    {
        "tema": "Território",
        "titulo": "panorama_configuration_municipio_area_unidade_territorial",
        "periodo": "2024",
        "valor": "4704.488",
        "unidade": "km²",
        "tipo": "N",
        "notas": [
            {
                "periodo": "2016",
                "notas": [
                    "Disponível em: <https://www.ibge.gov.br/home/geociencias/cartografia/default_territ_area.shtm>. Acesso em: jun. 2017"
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2020",
                "fontes": [
                    "Área territorial brasileira 2020. Rio de Janeiro: IBGE, 2021"
                ]
            },
            {
                "periodo": "2016",
                "fontes": [
                    "Área territorial brasileira. Rio de Janeiro: IBGE, 2017"
                ]
            },
            {
                "periodo": "2017",
                "fontes": [
                    "Área territorial brasileira. Rio de Janeiro: IBGE, 2018"
                ]
            },
            {
                "periodo": "2018",
                "fontes": [
                    "Área territorial brasileira. Rio de Janeiro: IBGE, 2019"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "Área territorial brasileira. Rio de Janeiro: IBGE, 2020"
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "Área territorial brasileira 2021. Rio de Janeiro: IBGE, 2022"
                ]
            },
            {
                "periodo": "2022",
                "fontes": [
                    "Área territorial brasileira 2022. Rio de Janeiro: IBGE, 2023"
                ]
            },
            {
                "periodo": "2023",
                "fontes": [
                    "Área territorial brasileira 2023. Rio de Janeiro: IBGE, 2024"
                ]
            }
        ],
        "id": 29167
    },
    {
        "tema": "Território",
        "titulo": "panorama_configuration_municipio_hierarquia_urbana",
        "periodo": "2018",
        "valor": "-",
        "unidade": "",
        "tipo": "",
        "notas": [
            {
                "periodo": "-",
                "notas": [
                    "A hierarquia urbana indica a centralidade da Cidade de acordo com a atração que exerce a populações de outros centros urbanos para acesso a bens e serviços e o nível de articulação territorial que a Cidade possui por estar inserida em atividades de gestão pública e empresarial. São cinco níveis hierárquicos, com onze subdivisões: Metrópoles (1A, 1B e 1C), Capitais Regionais (2A, 2B e 2C), Centros Sub-Regionais (3A e 3B), Centros de Zona (4A e 4B) e Centros Locais (5). Alguns Municípios são muito integrados entre si e constituem apenas uma Cidade para fim de hierarquia urbana, tratam-se dos Arranjos Populacionais, os quais são indicados no complemento da hierarquia urbana quando ocorrem."
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2018",
                "fontes": [
                    "IBGE. Regiões de Influência das Cidades 2018. Rio de Janeiro: IBGE, 2020. Disponível em: <https://www.ibge.gov.br/geociencias/organizacao-do-territorio/redes-e-fluxos-geograficos/15798-regioes-de-influencia-das-cidades.html?=&t=acesso-ao-produto> Acesso em: 31 jul. 2020."
                ]
            }
        ],
        "id": 87529
    },
    {
        "tema": "Território",
        "titulo": "panorama_configuration_municipio_regiao_influencia",
        "periodo": "2018",
        "valor": "-",
        "unidade": "",
        "tipo": "",
        "notas": [
            {
                "periodo": "",
                "notas": [
                    "Cada Cidade se vincula diretamente à região de influência de pelo menos uma outra Cidade, vínculo que sintetiza a relação interurbana mais relevante da Cidade de origem, tanto para acessar bens e serviços quanto por relações de gestão de empresas e órgãos públicos."
                ]
            }
        ],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2018",
                "fontes": [
                    "IBGE. Regiões de Influência das Cidades 2018. Rio de Janeiro: IBGE, 2020. Disponível em: <https://www.ibge.gov.br/geociencias/organizacao-do-territorio/redes-e-fluxos-geograficos/15798-regioes-de-influencia-das-cidades.html?=&t=acesso-ao-produto> Acesso em: 31 jul. 2020."
                ]
            }
        ],
        "id": 87530
    },
    {
        "tema": "Território",
        "titulo": "panorama_configuration_municipio_regiao_intermediaria",
        "periodo": "2024",
        "valor": "Sinop",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2020",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2020"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2019"
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2021"
                ]
            }
        ],
        "id": 91245
    },
    {
        "tema": "Território",
        "titulo": "panorama_configuration_municipio_regiao_imediata",
        "periodo": "2024",
        "valor": "Sorriso",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2020",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2020"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2019"
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2021"
                ]
            }
        ],
        "id": 91247
    },
    {
        "tema": "Território",
        "titulo": "panorama_configuration_municipio_meso_regiao",
        "periodo": "2021",
        "valor": "-",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2020",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2020"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2019"
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2021"
                ]
            }
        ],
        "id": 91249
    },
    {
        "tema": "Território",
        "titulo": "panorama_configuration_municipio_micro_regiao",
        "periodo": "2021",
        "valor": "-",
        "unidade": "",
        "tipo": "",
        "notas": [],
        "notaJuridica": "",
        "fontes": [
            {
                "periodo": "2020",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2020"
                ]
            },
            {
                "periodo": "2019",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2019"
                ]
            },
            {
                "periodo": "2021",
                "fontes": [
                    "IBGE, Divisão Territorial Brasileira - DTB 2021"
                ]
            }
        ],
        "id": 91251
    }
];


/***/ }),

/***/ 605:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var panorama_configuration_1 = __webpack_require__(611);
exports.PANORAMA = panorama_configuration_1.PANORAMA;
var panorama_values_1 = __webpack_require__(606);
exports.PanoramaVisualizacao = panorama_values_1.PanoramaVisualizacao;
var temas_values_1 = __webpack_require__(607);
exports.TEMAS = temas_values_1.TEMAS;


/***/ }),

/***/ 606:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PanoramaVisualizacao = {
    grafico: 'grafico',
    mapa: 'cartograma',
    numerico: 'numero',
    painel: 'painel'
};


/***/ }),

/***/ 607:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMAS = {
    nenhum: {
        label: '',
        icon: ''
    },
    agricultura: {
        label: 'Agricultura',
        // icon: 'agricultura.svg'
        icon: 'ico-agricultura'
    },
    agropecuaria: {
        label: 'Agropecuária',
        // icon: 'ico-agricultura.svg'
        icon: 'ico-agricultura'
    },
    comercio: {
        label: 'Comércio',
        icon: 'ico-comercio'
    },
    educacao: {
        label: 'Educação',
        // icon: 'ico-educacao.svg'
        icon: 'ico-educacao'
    },
    economia: {
        label: 'Economia',
        // icon: 'ico-economia.svg'
        icon: 'ico-economia'
    },
    frota: {
        label: 'Frota de veículos',
        // icon: 'frota.svg'
        icon: 'ico-frota'
    },
    historico: {
        label: 'Histórico',
        icon: ''
    },
    industria: {
        label: 'Indústria',
        icon: 'ico-industria'
    },
    meioAmbiente: {
        label: 'Meio Ambiente',
        // icon: 'ico-ambiente.svg'
        icon: 'ico-ambiente'
    },
    territorio: {
        label: 'Território',
        // icon: 'ico-ambiente.svg'
        icon: 'ico-territorio'
    },
    populacao: {
        label: 'População',
        // icon: 'ico-populacao.svg'
        icon: 'ico-populacao'
    },
    saude: {
        label: 'Saúde',
        // icon: 'ico-saude.svg'
        icon: 'ico-saude'
    },
    servicos: {
        label: 'Serviços',
        icon: 'ico-servicos'
    },
    // territorio: {
    //     label: 'Território',
    //     icon: ''
    // },
    trabalho: {
        label: 'Trabalho e Rendimento',
        // icon: 'ico-trabalho.svg'
        icon: 'ico-trabalho'
    }
};


/***/ }),

/***/ 608:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposGrafico = {
    "coluna": "coluna",
    "colunaEmpilhada": "colunaEmpilhada",
    "barra": "barra",
    "barraJustaposta": "barraJustaposta",
    "linha": "linha",
    "radar": "radar",
    "polar": "polar",
    "pizza": "pizza",
    "rosca": "rosca",
    "pontos": "pontos"
};
exports.dicionarioTiposGrafico = (_a = {},
    _a[exports.TiposGrafico.coluna] = 'bar',
    _a[exports.TiposGrafico.colunaEmpilhada] = 'bar',
    _a[exports.TiposGrafico.barra] = 'horizontalBar',
    _a[exports.TiposGrafico.barraJustaposta] = 'horizontalBar',
    _a[exports.TiposGrafico.linha] = 'line',
    _a[exports.TiposGrafico.radar] = 'radar',
    _a[exports.TiposGrafico.polar] = 'polarArea',
    _a[exports.TiposGrafico.pizza] = 'pie',
    _a[exports.TiposGrafico.rosca] = 'doughnut',
    _a[exports.TiposGrafico.pontos] = 'bubble',
    _a);
var _a;


/***/ }),

/***/ 610:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.notasEspeciais = [
    {
        "indicador": 87529,
        "nota": "A hierarquia urbana indica a centralidade da Cidade de acordo com a atração que exerce a populações de outros centros urbanos para acesso a bens e serviços e o nível de articulação territorial que a Cidade possui por estar inserida em atividades de gestão pública e empresarial. São cinco níveis hierárquicos, com onze subdivisões: Metrópoles (1A, 1B e 1C), Capitais Regionais (2A, 2B e 2C), Centros Sub-Regionais (3A e 3B), Centros de Zona (4A e 4B) e Centros Locais (5). Alguns Municípios são muito integrados entre si e constituem apenas uma Cidade para fim de hierarquia urbana, tratam-se dos Arranjos Populacionais, os quais são indicados no complemento da hierarquia urbana quando ocorrem."
    },
    {
        "indicador": 87530,
        "nota": "Cada Cidade se vincula diretamente à região de influência de pelo menos uma outra Cidade, vínculo que sintetiza a relação interurbana mais relevante da Cidade de origem, tanto para acessar bens e serviços quanto por relações de gestão de empresas e órgãos públicos"
    },
    {
        "indicador": 93371,
        "nota": "População exposta em área de risco a inundações, enxurradas e deslizamentos contabilizada para os municípios considerados críticos a desastres naturais no Brasil e monitorados pelo Centro Nacional de Monitoramento e Alertas de Desastres Naturais – CEMADEN. Municípios ‘sem dados’ não são monitorados pelo CEMADEN ou não tem dados publicados em respeito ao sigilo estatístico."
    },
    {
        "indicador": 29170,
        "nota": "Os nomes dos prefeitos são extraídos dos resultados das últimas eleições. Mudanças posteriores podem, eventualmente, não estar contempladas. Para reportar correção, utilize o formulário disponível em https://www.ibge.gov.br/atendimento.html."
    },
    {
        "indicador": 21910,
        "nota": "Os indicadores N° de agências, Depósitos a prazo e Depósitos à vista referem-se ao último mês do ano civil/fiscal do Brasil, no caso dezembro."
    },
    {
        "indicador": 21906,
        "nota": "Os indicadores N° de agências, Depósitos a prazo e Depósitos à vista referem-se ao último mês do ano civil/fiscal do Brasil, no caso dezembro."
    },
    {
        "indicador": 21907,
        "nota": "Os indicadores N° de agências, Depósitos a prazo e Depósitos à vista referem-se ao último mês do ano civil/fiscal do Brasil, no caso dezembro."
    }
];


/***/ }),

/***/ 611:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var temas_values_1 = __webpack_require__(607);
var panorama_values_1 = __webpack_require__(606);
var shared_1 = __webpack_require__(4);
var grafico_values_1 = __webpack_require__(608);
exports.PANORAMA = (_a = {},
    _a[shared_1.niveisTerritoriais.pais.label] = {
        temas: [
            temas_values_1.TEMAS.nenhum.label,
            temas_values_1.TEMAS.populacao.label,
            temas_values_1.TEMAS.economia.label,
            // TEMAS.territorio.label,
            temas_values_1.TEMAS.educacao.label,
            // TEMAS.trabalho.label,
            // TEMAS.agropecuaria.label,
            temas_values_1.TEMAS.industria.label,
            temas_values_1.TEMAS.comercio.label,
            temas_values_1.TEMAS.servicos.label,
            temas_values_1.TEMAS.saude.label
        ],
        indicadores: [
            // ----------------------------
            // NENHUM
            // ----------------------------
            {
                indicadorId: 60053,
                pesquisaId: 10059,
                periodo: '2010',
                titulo: 'panorama_configuration_pais_capital',
                tema: temas_values_1.TEMAS.nenhum.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                indicadorId: 60280,
                pesquisaId: 10065,
                periodo: '2016',
                titulo: 'panorama_configuration_pais_numero_municipios',
                tema: temas_values_1.TEMAS.nenhum.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                indicadorId: 60052,
                pesquisaId: 10059,
                periodo: '2024',
                titulo: 'panorama_configuration_pais_area_territorial',
                tema: temas_values_1.TEMAS.nenhum.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                indicadorId: 62887,
                pesquisaId: 10059,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_presidente',
                tema: temas_values_1.TEMAS.nenhum.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // ------------------------
            // POPULAÇÃO
            // ------------------------
            {
                pesquisaId: 10101,
                indicadorId: 96385,
                periodo: '2022',
                titulo: 'panorama_configuration_pais_populacao_ultimo_censo',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 33,
                indicadorId: 29171,
                periodo: '2025',
                titulo: 'panorama_configuration_pais_populacao_estimada',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 10101,
                indicadorId: 96386,
                periodo: '2022',
                titulo: 'panorama_configuration_pais_densidade_demografica',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 10065,
                indicadorId: 60284,
                periodo: '2021',
                titulo: 'panorama_configuration_pais_taxa_fecundidade',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_taxa_fecundidade',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    dados: [{
                            pesquisaId: 10065,
                            indicadorId: 60284
                        }]
                }
            },
            {
                pesquisaId: 39,
                indicadorId: 30279,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_taxa_mortalidade_infantil',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_taxa_mortalidade_infantil',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    dados: [{
                            pesquisaId: 39,
                            indicadorId: 30279
                        }]
                }
            },
            {
                pesquisaId: 10065,
                indicadorId: 60404,
                periodo: '2015',
                titulo: 'panorama_configuration_pais_domicilios_com_iluminacao_eletrica',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_iluminacao_lixo_agua_esgoto',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    dados: [{
                            pesquisaId: 10065,
                            indicadorId: 60404
                        },
                        {
                            pesquisaId: 10065,
                            indicadorId: 60406
                        },
                        {
                            pesquisaId: 10065,
                            indicadorId: 60407
                        },
                        {
                            pesquisaId: 10065,
                            indicadorId: 60408
                        }]
                }
            },
            {
                pesquisaId: 10070,
                indicadorId: 62912,
                periodo: '2022',
                titulo: 'panorama_configuration_pais_domicilios_com_coleta_de_lixo',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 10070,
                indicadorId: 62914,
                periodo: '2022',
                titulo: 'panorama_configuration_pais_domicilios_com_abastecimento_de_agua',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 10070,
                indicadorId: 62916,
                periodo: '2022',
                titulo: 'panorama_configuration_pais_domicilios_com_esgotamento_sanitario',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 10070,
                indicadorId: 64508,
                periodo: '2021',
                titulo: 'panorama_configuration_pais_domicilios_computador',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_bens_duraveis_domicilio',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    dados: [{
                            pesquisaId: 44,
                            indicadorId: 47103
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47106
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47107
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47108
                        }]
                }
            },
            {
                pesquisaId: 10070,
                indicadorId: 64517,
                periodo: '2021',
                titulo: 'panorama_configuration_pais_domicilio_acesso_internet',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_tipo_conexao_internet',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    dados: [{
                            pesquisaId: 44,
                            indicadorId: 47260
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47261
                        }]
                }
            },
            {
                pesquisaId: 10070,
                indicadorId: 64510,
                periodo: '2021',
                titulo: 'panorama_configuration_pais_domicilios_com_telefone_celular',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 10070,
                indicadorId: 64511,
                periodo: '2021',
                titulo: 'panorama_configuration_pais_domicilios_televisao',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_modalidade_recepcao_sinal_tv',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    dados: [{
                            pesquisaId: 44,
                            indicadorId: 47251
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47252
                        },
                        {
                            pesquisaId: 44,
                            indicadorId: 47253
                        }]
                }
            },
            {
                pesquisaId: 44,
                indicadorId: 60414,
                periodo: '2015',
                titulo: 'panorama_configuration_pais_pratica_atividade_fisica',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                indicadorId: 101,
                titulo: 'panorama_configuration_nome_masculino_mais_popular',
                tema: temas_values_1.TEMAS.populacao.label,
                servico: 'nomesDoBrasil',
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico,
            },
            {
                indicadorId: 102,
                titulo: 'panorama_configuration_nome_feminino_mais_popular',
                tema: temas_values_1.TEMAS.populacao.label,
                servico: 'nomesDoBrasil',
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                indicadorId: 103,
                titulo: 'panorama_configuration_sobrenome_mais_popular',
                tema: temas_values_1.TEMAS.populacao.label,
                servico: 'nomesDoBrasil',
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // ------------------------
            // EDUCAÇÃO
            // ------------------------
            {
                pesquisaId: 10070,
                indicadorId: 63311,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_taxa_analfabetismo_15_anos_ou_mais',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_taxa_analfabetismo_15_anos_ou_mais',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    dados: [{
                            pesquisaId: 10070,
                            indicadorId: 63311,
                        }]
                }
            },
            {
                pesquisaId: 10070,
                indicadorId: 63306,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_taxa_escolarizacao_6_a_14_anos',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 40,
                indicadorId: 78187,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_ideb_anos_iniciais_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 40,
                indicadorId: 78192,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_ideb_anos_finais_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5908,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_matriculas_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5913,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_matriculas_medio',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5929,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_docentes_ensino_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5934,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_docentes_ensino_medio',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5950,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_numero_estabelecimentos_ensino_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_numero_estabelecimentos',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    dados: [{
                            pesquisaId: 13,
                            indicadorId: 5950,
                        },
                        {
                            pesquisaId: 13,
                            indicadorId: 5955,
                        }]
                }
            },
            {
                pesquisaId: 13,
                indicadorId: 5955,
                periodo: '2023',
                titulo: 'panorama_configuration_pais_numero_estabelecimentos_ensino_medio',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // ----------------------------
            // ECONOMIA
            // ----------------------------
            {
                pesquisaId: 10089,
                indicadorId: 77003,
                periodo: '2022',
                titulo: 'panorama_configuration_pais_pib_per_capita',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_pib_per_capita',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    dados: [{
                            pesquisaId: 10089,
                            indicadorId: 77003
                        }]
                }
            },
            {
                pesquisaId: 1737,
                indicadorId: 63,
                categoria: '',
                servico: 'conjunturais',
                quantidadePeriodos: 1,
                titulo: 'panorama_configuration_pais_precos_ipca_mensal',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_ipca_inpc_ipp_acumulado_12_meses',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    link: 'https://www.ibge.gov.br/estatisticas-novoportal/economicas/precos-e-custos/9258-indice-nacional-de-precos-ao-consumidor.html',
                    dados: [{
                            pesquisaId: 1737,
                            indicadorId: 2265,
                            categoria: '',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        },
                        {
                            pesquisaId: 1736,
                            indicadorId: 2292,
                            categoria: '',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        },
                        {
                            pesquisaId: 5796,
                            indicadorId: 1394,
                            categoria: '715[33611]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                }
            },
            {
                pesquisaId: 1736,
                indicadorId: 44,
                categoria: '',
                servico: 'conjunturais',
                quantidadePeriodos: 1,
                titulo: 'panorama_configuration_pais_precos_inpc',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // {
            //     pesquisaId: 1737,
            //     indicadorId: 1120,
            //     categoria: '',
            //     servico: 'conjunturais',
            //     quantidadePeriodos: 1,
            //     titulo: 'Preços - IPCA 12 meses',
            //     tema: TEMAS.economia.label,
            //     visualizacao: PanoramaVisualizacao.numerico
            // },
            {
                pesquisaId: 3065,
                indicadorId: 355,
                categoria: '',
                servico: 'conjunturais',
                quantidadePeriodos: 1,
                titulo: 'panorama_configuration_pais_precos_ipca15',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_ipca15_acumulado_12_meses',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    link: '',
                    dados: [{
                            pesquisaId: 3065,
                            indicadorId: 1120,
                            categoria: '',
                            servico: 'conjunturais',
                            quantidadePeriodos: 10
                        }]
                }
            },
            {
                pesquisaId: 6903,
                indicadorId: 1396,
                categoria: '842[46608]',
                servico: 'conjunturais',
                quantidadePeriodos: 1,
                titulo: 'panorama_configuration_pais_preco_produtor_ipp',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 1737,
                indicadorId: 2265,
                categoria: '',
                servico: 'conjunturais',
                quantidadePeriodos: 1,
                titulo: 'panorama_configuration_pais_precos_ipca_12_meses',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 8888,
                indicadorId: 11604,
                categoria: '544[129314]',
                servico: 'conjunturais',
                quantidadePeriodos: 36,
                titulo: 'panorama_configuration_pais_industria_pim-pf',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_pim-pf_variacao_acumulada_12_meses',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    link: '',
                    dados: [{
                            pesquisaId: 8888,
                            indicadorId: 11604,
                            categoria: '544[129314]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                }
            },
            {
                pesquisaId: 8880,
                indicadorId: 11711,
                categoria: '11046[56734]',
                servico: 'conjunturais',
                quantidadePeriodos: 36,
                titulo: 'panorama_configuration_pais_comercio_pmc',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_pmc_variacao_acumulada_12_meses',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    link: '',
                    dados: [{
                            pesquisaId: 8880,
                            indicadorId: 11711,
                            categoria: '11046[56734]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                }
            },
            {
                pesquisaId: 5906,
                indicadorId: 11626,
                categoria: '11046[56726]',
                servico: 'conjunturais',
                quantidadePeriodos: 36,
                titulo: 'panorama_configuration_pais_servicos_pms',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_pms_variacao_acumulada_12_meses',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    link: '',
                    dados: [{
                            pesquisaId: 5906,
                            indicadorId: 11626,
                            categoria: '11046[56726]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                }
            },
            // Taxa de desocupação
            {
                pesquisaId: 4094,
                indicadorId: 4099,
                servico: 'conjunturais',
                categoria: '58(95253)',
                quantidadePeriodos: 36,
                titulo: 'panorama_configuration_pais_taxa_desocupacao_pnad_continua',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_pnad_continua_taxa_desocupacao',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    link: '',
                    dados: [{
                            pesquisaId: 4094,
                            indicadorId: 4099,
                            categoria: '58(95253)',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                }
            },
            {
                pesquisaId: 5932,
                indicadorId: 6562,
                categoria: '11255[90707]',
                servico: 'conjunturais',
                quantidadePeriodos: 12,
                periodo: '',
                titulo: 'panorama_configuration_pais_pib_scnt',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_pib_taxa_acumulada_12_meses',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    link: 'https://www.ibge.gov.br/estatisticas-novoportal/economicas/contas-nacionais/2036-np-produto-interno-bruto-dos-municipios/9088-produto-interno-bruto-dos-municipios.html',
                    dados: [{
                            pesquisaId: 5932,
                            indicadorId: 6562,
                            categoria: '11255[90707]',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36,
                        }]
                }
            },
            // SINAPI
            {
                pesquisaId: 2296,
                indicadorId: 1196,
                categoria: '',
                servico: 'conjunturais',
                quantidadePeriodos: 36,
                titulo: 'panorama_configuration_pais_construcao_sinapi',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_pais_sinapi_construcao',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    link: '',
                    dados: [{
                            pesquisaId: 2296,
                            indicadorId: 1196,
                            categoria: '',
                            servico: 'conjunturais',
                            quantidadePeriodos: 36
                        }]
                }
            },
        ]
    },
    // ----------------------------
    // UF
    // ----------------------------
    _a[shared_1.niveisTerritoriais.uf.label] = {
        temas: [
            temas_values_1.TEMAS.nenhum.label,
            temas_values_1.TEMAS.populacao.label,
            temas_values_1.TEMAS.educacao.label,
            temas_values_1.TEMAS.trabalho.label,
            temas_values_1.TEMAS.frota.label,
            temas_values_1.TEMAS.economia.label,
            temas_values_1.TEMAS.saude.label,
            temas_values_1.TEMAS.territorio.label
        ],
        indicadores: [
            // {
            //     pesquisaId: 48,
            //     indicadorId: 0,
            //     titulo: 'Código do Estado',
            //     tema: TEMAS.nenhum.label,
            //     largura: 'half',
            //     visualizacao: PanoramaVisualizacao.numerico
            // },
            {
                // pesquisaId: 48,
                // indicadorId: 62877,
                // periodo: '-',
                titulo: 'panorama_configuration_estado_gentilico',
                tema: temas_values_1.TEMAS.nenhum.label,
                largura: 'half',
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // {
            //     pesquisaId: 48,
            //     indicadorId: 0,
            //     titulo: 'Número de municípios',
            //     tema: TEMAS.nenhum.label,
            //     visualizacao: PanoramaVisualizacao.numerico
            // },
            {
                pesquisaId: 48,
                indicadorId: 48981,
                periodo: '2010',
                titulo: 'panorama_configuration_estado_capital',
                tema: temas_values_1.TEMAS.nenhum.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 48,
                indicadorId: 62876,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_governador',
                tema: temas_values_1.TEMAS.nenhum.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // --- População
            // {
            //     pesquisaId: 48,
            //     indicadorId: 48985,
            //     periodo: '2021',
            //     titulo: 'panorama_configuration_estado_populacao_estimada',
            //     tema: TEMAS.populacao.label,
            //     visualizacao: PanoramaVisualizacao.grafico,
            //     grafico: {
            //         titulo: 'panorama_configuration_estado_populacao_residente_situacao_domiciliar',
            //         tipo: TiposGrafico.coluna,
            //         dados: [{
            //             pesquisaId: 23,
            //             indicadorId: 25191
            //         }, {
            //             pesquisaId: 23,
            //             indicadorId: 25199
            //         }]
            //     }
            // },
            {
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_estado_projecao_populacao',
                    link: "https://www.ibge.gov.br/estatisticas/sociais/populacao/9109-projecao-da-populacao.html",
                    tipo: grafico_values_1.TiposGrafico.linha,
                    dados: [{
                            pesquisaId: 53,
                            indicadorId: 49645
                        }]
                }
            },
            {
                pesquisaId: 10101,
                indicadorId: 96385,
                periodo: '2022',
                titulo: 'panorama_configuration_estado_populacao_ultimo_censo',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
                // grafico: {
                //     titulo: 'População residente por grupos de idade',
                //     tipo: TiposGrafico.coluna,
                //     dados: [{
                //         pesquisaId: 23,
                //         indicadorId: 25181
                //     }, {
                //         pesquisaId: 23,
                //         indicadorId: 25182
                //     }, {
                //         pesquisaId: 23,
                //         indicadorId: 25183
                //     }, {
                //         pesquisaId: 23,
                //         indicadorId: 25184
                //     }, {
                //         pesquisaId: 23,
                //         indicadorId: 25185
                //     }, {
                //         pesquisaId: 23,
                //         indicadorId: 25186
                //     }]
                // }
            },
            {
                pesquisaId: 33,
                indicadorId: 29171,
                periodo: '2025',
                titulo: 'panorama_configuration_estado_populacao_estimada',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 10101,
                indicadorId: 96386,
                periodo: '2022',
                titulo: 'panorama_configuration_estado_densidade_demografica',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            // --- FROTA
            {
                pesquisaId: 22,
                indicadorId: 28120,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_total_veiculos',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                titulo: 'panorama_configuration_nome_masculino_mais_popular',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico,
            },
            {
                titulo: 'panorama_configuration_nome_feminino_mais_popular',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                titulo: 'panorama_configuration_sobrenome_mais_popular',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                // pesquisaId: 22,
                // indicadorId: 28122,
                // periodo: '2016',
                // titulo: 'Total de automóveis',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_estado_veiculos_tipo',
                    tipo: grafico_values_1.TiposGrafico.coluna,
                    dados: [
                        {
                            pesquisaId: 22,
                            indicadorId: 28122
                        },
                        {
                            pesquisaId: 22,
                            indicadorId: 28123
                        },
                        {
                            pesquisaId: 22,
                            indicadorId: 28130
                        },
                        {
                            pesquisaId: 22,
                            indicadorId: 28128
                        }
                    ]
                }
            },
            // {
            //     titulo: 'panorama_configuration_nome_masculino_mais_popular',
            //     tema: TEMAS.populacao.label,
            //     visualizacao: PanoramaVisualizacao.numerico,
            // },
            // {
            //     titulo: 'panorama_configuration_nome_feminino_mais_popular',
            //     tema: TEMAS.populacao.label,
            //     visualizacao: PanoramaVisualizacao.numerico
            // },
            // {
            //     titulo: 'panorama_configuration_sobrenome_mais_popular',
            //     tema: TEMAS.populacao.label,
            //     visualizacao: PanoramaVisualizacao.numerico
            // },
            // {
            //     pesquisaId: 20,
            //     indicadorId: 29788,
            //     periodo: '2015',
            //     titulo: 'Óbitos ocorridos no estado',
            //     tema: TEMAS.populacao.label,
            //     visualizacao: PanoramaVisualizacao.painel
            // },
            // --- Trabalho
            {
                pesquisaId: 48,
                indicadorId: 48986,
                periodo: '2025',
                titulo: 'panorama_configuration_estado_rendimento_nominal_mensal_domiciliar',
                tema: temas_values_1.TEMAS.trabalho.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 45,
                indicadorId: 62585,
                periodo: '2016',
                titulo: 'panorama_configuration_estado_pessoas_ocupadas',
                tema: temas_values_1.TEMAS.trabalho.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 45,
                indicadorId: 62590,
                periodo: '2016',
                titulo: 'panorama_configuration_estado_proporcao_pessoas_ocupadas_trabalhos_formais_semana_referencia',
                tema: temas_values_1.TEMAS.trabalho.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 45,
                indicadorId: 95345,
                periodo: '2022',
                titulo: 'panorama_configuration_estado_proporcao_pessoas_ocupadas_trabalhos_formais',
                tema: temas_values_1.TEMAS.trabalho.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 45,
                indicadorId: 95379,
                periodo: '2022',
                titulo: 'panorama_configuration_estado_rendimento_medio_trabalhos_formais',
                tema: temas_values_1.TEMAS.trabalho.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 19,
                indicadorId: 143516,
                periodo: '2022',
                titulo: 'panorama_configuration_estado_pessoal_ocupado_administracao_publica',
                tema: temas_values_1.TEMAS.trabalho.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            // --- EDUCAÇÃO
            {
                pesquisaId: 40,
                indicadorId: 78187,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_ideb_anos_iniciais_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 40,
                indicadorId: 78192,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_ideb_anos_finais_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 13,
                indicadorId: 5908,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_matriculas_ensino_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 13,
                indicadorId: 5913,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_matriculas_ensino_medio',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                // pesquisaId: 13,
                // indicadorId: 5908,
                periodo: '2023',
                // titulo: 'Matrículas no ensino fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_estado_matriculas',
                    tipo: grafico_values_1.TiposGrafico.linha,
                    dados: [{
                            pesquisaId: 13,
                            indicadorId: 5903,
                        }, {
                            pesquisaId: 13,
                            indicadorId: 5908,
                        }, {
                            pesquisaId: 13,
                            indicadorId: 5913,
                        }]
                }
            },
            {
                pesquisaId: 13,
                indicadorId: 5929,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_docentes_ensino_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5934,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_docentes_ensino_medio',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5950,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_numero_estabelecimentos_ensino_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5955,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_numero_estabelecimentos_ensino_medio',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // --- ECONOMIA
            {
                pesquisaId: 37,
                indicadorId: 30255,
                periodo: '2021',
                titulo: 'panorama_configuration_estado_idh',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 21,
                indicadorId: 28141,
                titulo: 'panorama_configuration_estado_receitas_orcamentarias_realizadas',
                periodo: '2023',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 21,
                indicadorId: 29749,
                titulo: 'panorama_configuration_estado_receitas_orcamentarias_empenhadas',
                periodo: '2023',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel,
            },
            {
                pesquisaId: 29,
                indicadorId: 21910,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_numero_agencias',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 29,
                indicadorId: 21906,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_depositos_a_vista',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 29,
                indicadorId: 21907,
                periodo: '2023',
                titulo: 'panorama_configuration_estado_depositos_a_prazo',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // --- Território
            {
                indicadorId: 97964,
                periodo: '-',
                titulo: 'panorama_configuration_estado_numero_municipios',
                tema: temas_values_1.TEMAS.territorio.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 48,
                indicadorId: 48980,
                periodo: '2024',
                titulo: 'panorama_configuration_estado_area_unidade_territorial',
                tema: temas_values_1.TEMAS.territorio.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 48,
                indicadorId: 95338,
                periodo: '2019',
                titulo: 'panorama_configuration_estado_area_urbanizada',
                tema: temas_values_1.TEMAS.territorio.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            }
            // {
            //     pesquisaId: 10058,
            //     indicadorId: 60030,
            //     periodo: '2010',
            //     titulo: 'Esgotamento sanitário adequado',
            //     tema: TEMAS.territorio.label,
            //     visualizacao: PanoramaVisualizacao.painel
            // },
            // {
            //     pesquisaId: 10058,
            //     indicadorId: 60029,
            //     periodo: '2010',
            //     titulo: 'Arborização de vias públicas',
            //     tema: TEMAS.territorio.label,
            //     visualizacao: PanoramaVisualizacao.painel
            // },
            // {
            //     pesquisaId: 10058,
            //     indicadorId: 60031,
            //     periodo: '2010',
            //     titulo: 'Urbanização de vias públicas',
            //     tema: TEMAS.territorio.label,
            //     visualizacao: PanoramaVisualizacao.painel
            // },
        ]
    },
    // ------------------------------------
    // MUNICIPIO
    // ------------------------------------
    _a[shared_1.niveisTerritoriais.municipio.label] = {
        temas: [
            temas_values_1.TEMAS.nenhum.label,
            temas_values_1.TEMAS.populacao.label,
            temas_values_1.TEMAS.trabalho.label,
            temas_values_1.TEMAS.educacao.label,
            temas_values_1.TEMAS.economia.label,
            temas_values_1.TEMAS.saude.label,
            temas_values_1.TEMAS.meioAmbiente.label,
            temas_values_1.TEMAS.territorio.label
        ],
        indicadores: [
            {
                pesquisaId: 33,
                indicadorId: 29169,
                titulo: 'panorama_configuration_municipio_codigo',
                tema: temas_values_1.TEMAS.nenhum.label,
                largura: 'half',
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                // pesquisaId: 33,
                // indicadorId: 60409,
                titulo: 'panorama_configuration_municipio_gentilico',
                tema: temas_values_1.TEMAS.nenhum.label,
                largura: 'half',
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                titulo: 'panorama_configuration_municipio_aniversario',
                tema: temas_values_1.TEMAS.nenhum.label,
                largura: 'half',
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 33,
                indicadorId: 29170,
                titulo: 'panorama_configuration_municipio_prefeito',
                periodo: '2025',
                tema: temas_values_1.TEMAS.nenhum.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // // --- População
            // {
            //     pesquisaId: 33,
            //     indicadorId: 29171,
            //     titulo: 'panorama_configuration_municipio_populacao_estimada',
            //     periodo: '2021',
            //     tema: TEMAS.populacao.label,
            //     visualizacao: PanoramaVisualizacao.grafico,
            //     grafico: {
            //         titulo: 'panorama_configuration_municipio_populacao_residente_religiao',
            //         tipo: TiposGrafico.coluna,
            //         dados: [{
            //             pesquisaId: 23,
            //             indicadorId: 22423
            //         }, {
            //             pesquisaId: 23,
            //             indicadorId: 22426
            //         }, {
            //             pesquisaId: 23,
            //             indicadorId: 22424
            //         }]
            //     }
            // },
            {
                pesquisaId: 10101,
                indicadorId: 96385,
                periodo: '2022',
                titulo: 'panorama_configuration_municipio_populacao_ultimo_censo',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 33,
                indicadorId: 29171,
                periodo: '2025',
                titulo: 'panorama_configuration_municipio_populacao_estimada',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 10101,
                indicadorId: 96386,
                periodo: '2022',
                titulo: 'panorama_configuration_municipio_densidade_demografica',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                titulo: 'panorama_configuration_nome_masculino_mais_popular',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico,
            },
            {
                titulo: 'panorama_configuration_nome_feminino_mais_popular',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                titulo: 'panorama_configuration_sobrenome_mais_popular',
                tema: temas_values_1.TEMAS.populacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // --- Ambiente
            {
                pesquisaId: 10058,
                indicadorId: 95335,
                periodo: '2019',
                titulo: 'panorama_configuration_municipio_area_urbanizada',
                tema: temas_values_1.TEMAS.meioAmbiente.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 60030,
                periodo: '2022',
                titulo: 'panorama_configuration_municipio_esgotamento_sanitario',
                tema: temas_values_1.TEMAS.meioAmbiente.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 60029,
                periodo: '2022',
                titulo: 'panorama_configuration_municipio_arborizacao',
                tema: temas_values_1.TEMAS.meioAmbiente.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 60031,
                periodo: '2010',
                titulo: 'panorama_configuration_municipio_urbanizacao',
                tema: temas_values_1.TEMAS.meioAmbiente.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 93371,
                periodo: '2010',
                titulo: 'panorama_configuration_municipio_populacao_exposta_risco',
                tema: temas_values_1.TEMAS.meioAmbiente.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 33,
                indicadorId: 77861,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_bioma',
                tema: temas_values_1.TEMAS.meioAmbiente.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 33,
                indicadorId: 82270,
                periodo: '2019',
                titulo: 'panorama_configuration_municipio_sistena_costeiro_marinho',
                tema: temas_values_1.TEMAS.meioAmbiente.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // --- Território
            {
                pesquisaId: 33,
                indicadorId: 29167,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_area_unidade_territorial',
                tema: temas_values_1.TEMAS.territorio.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 87529,
                periodo: '2018',
                titulo: 'panorama_configuration_municipio_hierarquia_urbana',
                tema: temas_values_1.TEMAS.territorio.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 10058,
                indicadorId: 87530,
                periodo: '2018',
                titulo: 'panorama_configuration_municipio_regiao_influencia',
                tema: temas_values_1.TEMAS.territorio.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 33,
                indicadorId: 91245,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_regiao_intermediaria',
                tema: temas_values_1.TEMAS.territorio.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 33,
                indicadorId: 91247,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_regiao_imediata',
                tema: temas_values_1.TEMAS.territorio.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 33,
                indicadorId: 91249,
                periodo: '2022',
                titulo: 'panorama_configuration_municipio_meso_regiao',
                tema: temas_values_1.TEMAS.territorio.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 33,
                indicadorId: 91251,
                periodo: '2022',
                titulo: 'panorama_configuration_municipio_micro_regiao',
                tema: temas_values_1.TEMAS.territorio.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // --- Educação
            {
                pesquisaId: 10058,
                indicadorId: 60045,
                periodo: '2022',
                titulo: 'panorama_configuration_municipio_taxa_escolarizacao',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 40,
                indicadorId: 78187,
                periodo: '2023',
                titulo: 'panorama_configuration_municipio_ideb_anos_iniciais_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 40,
                indicadorId: 78192,
                periodo: '2023',
                titulo: 'panorama_configuration_municipio_ideb_anos_finais_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 13,
                indicadorId: 5908,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_matriculas_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.grafico,
                grafico: {
                    titulo: 'panorama_configuration_municipio_matriculas',
                    tipo: grafico_values_1.TiposGrafico.coluna,
                    dados: [{
                            pesquisaId: 13,
                            indicadorId: 5903,
                        }, {
                            pesquisaId: 13,
                            indicadorId: 5908,
                        }, {
                            pesquisaId: 13,
                            indicadorId: 5913,
                        }, {
                            pesquisaId: 13,
                            indicadorId: 5918,
                        }]
                }
            },
            {
                pesquisaId: 13,
                indicadorId: 5913,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_matriculas_medio',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5929,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_docentes_ensino_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5934,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_docentes_ensino_medio',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5950,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_numero_estabelecimentos_ensino_fundamental',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 13,
                indicadorId: 5955,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_numero_estabelecimentos_ensino_medio',
                tema: temas_values_1.TEMAS.educacao.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // --- Trabalho
            {
                pesquisaId: 19,
                indicadorId: 143558,
                periodo: '2023',
                titulo: 'panorama_configuration_municipio_salario_trabalhadores_formais',
                tema: temas_values_1.TEMAS.trabalho.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 19,
                indicadorId: 143514,
                periodo: '2023',
                titulo: 'panorama_configuration_municipio_pessoal_ocupado',
                tema: temas_values_1.TEMAS.trabalho.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            // {
            //     pesquisaId: 10058,
            //     indicadorId: 60036,                    
            //     periodo: '2022',
            //     titulo: 'panorama_configuration_municipio_populacao_ocupada',
            //     tema: TEMAS.trabalho.label,
            //     visualizacao: PanoramaVisualizacao.painel
            // },
            {
                pesquisaId: 10058,
                indicadorId: 60037,
                periodo: '2010',
                titulo: 'panorama_configuration_municipio_pencentual_pupulacao_rendimento_ate_meio_salario',
                tema: temas_values_1.TEMAS.trabalho.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            // --- Saúde
            {
                pesquisaId: 39,
                indicadorId: 30279,
                periodo: '2023',
                titulo: 'panorama_configuration_municipio_mortalidade_infantil',
                tema: temas_values_1.TEMAS.saude.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel,
                correlacaoNegativaValorQualidade: true
            },
            {
                pesquisaId: 10058,
                indicadorId: 60032,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_internacoes_diarreia',
                tema: temas_values_1.TEMAS.saude.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel,
                correlacaoNegativaValorQualidade: true
            },
            {
                pesquisaId: 32,
                indicadorId: 28242,
                periodo: '2009',
                titulo: 'panorama_configuration_municipio_estabelecimento_saude_sus',
                tema: temas_values_1.TEMAS.saude.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            // --- Economia
            {
                pesquisaId: 38,
                indicadorId: 47001,
                periodo: '2023',
                titulo: 'panorama_configuration_municipio_pib_per_capita',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            // TODO: Resolver erro ao incluir este indicador.
            // {
            //     pesquisaId: 21,
            //     indicadorId: 28160,
            //     periodo: '2014',
            //     titulo: 'panorama_configuration_municipio_valor_fpm',
            //     tema: TEMAS.economia.label,
            //     visualizacao: PanoramaVisualizacao.numerico
            // },
            {
                pesquisaId: 10111,
                indicadorId: 329756,
                periodo: '2010',
                titulo: 'panorama_configuration_municipio_idhm',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.numerico
            },
            {
                pesquisaId: 21,
                indicadorId: 28141,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_total_receitas_realizadas',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel
            },
            {
                pesquisaId: 10058,
                indicadorId: 60048,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_percentual_receitas_fontes_externas',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel,
                correlacaoNegativaValorQualidade: true
            },
            {
                pesquisaId: 21,
                indicadorId: 29749,
                periodo: '2024',
                titulo: 'panorama_configuration_municipio_total_despesas_empenhadas',
                tema: temas_values_1.TEMAS.economia.label,
                visualizacao: panorama_values_1.PanoramaVisualizacao.painel,
            }
        ]
    },
    _a);
var _a;


/***/ }),

/***/ 613:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var Observable_1 = __webpack_require__(0);
__webpack_require__(59);
var utils_1 = __webpack_require__(21);
var panorama_service_1 = __webpack_require__(604);
var configuration_1 = __webpack_require__(605);
var shared_1 = __webpack_require__(4);
var EstadoSinteseService = (function () {
    function EstadoSinteseService(_panoramaService, _localidadeService, _appState, _routerParams, _traducaoService, _bibliotecaService, _resultadoService) {
        this._panoramaService = _panoramaService;
        this._localidadeService = _localidadeService;
        this._appState = _appState;
        this._routerParams = _routerParams;
        this._traducaoService = _traducaoService;
        this._bibliotecaService = _bibliotecaService;
        this._resultadoService = _resultadoService;
    }
    Object.defineProperty(EstadoSinteseService.prototype, "lang", {
        get: function () {
            return this._traducaoService.lang;
        },
        enumerable: true,
        configurable: true
    });
    EstadoSinteseService.prototype.getResumoMunicipios = function (estado, indicadores) {
        var municipios = estado.children;
        var resultObservables = [];
        var _loop_1 = function (municipio) {
            var configuracao = this_1.getConfiguracao(municipio.tipo);
            var resumoMunicipio = this_1._panoramaService.getResumo(configuracao, municipio)
                .map(function (res) {
                var resumo = {};
                resumo.municipio = municipio.nome;
                res = res.map(function (res) {
                    if (res.titulo == 'Gentílico') {
                        resumo.gentilico = res.valor;
                    }
                    return res;
                }).filter(function (res) { return res.titulo != 'Gentílico' && indicadores.includes(res.id + ""); });
                resumo.indicadores = res;
                return resumo;
            });
            resultObservables.push(resumoMunicipio);
        };
        var this_1 = this;
        for (var _i = 0, municipios_1 = municipios; _i < municipios_1.length; _i++) {
            var municipio = municipios_1[_i];
            _loop_1(municipio);
        }
        return Observable_1.Observable.forkJoin(resultObservables);
    };
    EstadoSinteseService.prototype.getNotasResumo = function (resumo) {
        var notas = [];
        resumo.indicadores.filter(function (resultado) {
            if (resultado.notas.length === 0) {
                return false;
            }
            for (var i = 0; i < resultado.notas.length; i++) {
                if (resultado.notas[i]['periodo'] === resultado.periodo || resultado.notas[i]['periodo'] === '-') {
                    var nota = {};
                    nota.descricao = resultado.notas[i]['notas'][0];
                    nota.indicador = resultado.titulo;
                    notas.push(nota);
                    return true;
                }
            }
            return false;
        });
        return notas;
    };
    EstadoSinteseService.prototype.getFontesResumo = function (resumo) {
        var fontes = [];
        resumo.indicadores.filter(function (resultado) {
            return !!resultado.fontes
                && resultado.fontes.length > 0
                && (resultado.fontes[0]['periodo'] === resultado.periodo
                    || resultado.fontes[0]['periodo'] === '-');
        }).map(function (resultado) {
            var fonte = {};
            fonte.descricao = resultado.fontes[0]['fontes'];
            fonte.indicador = resultado.titulo;
            fontes.push(fonte);
        });
        return fontes;
    };
    EstadoSinteseService.prototype.getResumoEstado = function (localidade, indicadores) {
        var _this = this;
        var configuracao = this.getConfiguracao('municipio');
        var resumo = {};
        resumo.municipios = [];
        for (var _i = 0, _a = localidade.children; _i < _a.length; _i++) {
            var municipio = _a[_i];
            resumo.municipios.push({ codigo: municipio.codigo, nome: municipio.nome });
        }
        return Observable_1.Observable.zip(this._resultadoService.getResultadosCompletosSubLocalidade(indicadores, localidade.codigo).map(function (resultados) { return utils_1.converterObjArrayEmHash(resultados, 'codigoLocalidade', true); }), this._bibliotecaService.getValuesEstado(localidade.codigo))
            .map(function (_a) {
            var resultados = _a[0], valoresBiblioteca = _a[1];
            resumo.municipios.map(function (municipio) {
                municipio.indicadores = resultados[municipio.codigo].map(function (resultado) {
                    var codigoLocalidade = Object.keys(valoresBiblioteca).filter(function (valor) { return valor.substring(0, 6) == resultado.codigoLocalidade + ""; }).shift();
                    var configuracao = _this.getConfiguracao('municipio');
                    return configuracao
                        .filter(function (item) { return Boolean(item.indicadorId) && resultado.indicador.id == item.indicadorId; })
                        .map(function (item) {
                        municipio.gentilico = valoresBiblioteca.GENTILICO;
                        var periodo = item.periodo
                            || resultado && resultado.periodoValidoMaisRecente
                            || '-';
                        var titulo = item.titulo
                            || (resultado &&
                                resultado.indicador &&
                                resultado.indicador.nome);
                        var valor = (resultado &&
                            resultado.valorMaisRecente);
                        var unidade = (resultado &&
                            resultado.indicador &&
                            resultado.indicador.unidade.toString()) || '';
                        var notas = (resultado &&
                            resultado.indicador &&
                            resultado.indicador.notas) || [];
                        var fontes = (resultado &&
                            resultado.indicador &&
                            resultado.indicador.fontes) || [];
                        return {
                            tema: item.tema,
                            titulo: titulo,
                            periodo: periodo,
                            valor: valor,
                            unidade: unidade,
                            notas: notas,
                            fontes: fontes,
                            id: item.indicadorId
                        };
                    }).shift();
                });
                return municipio;
            });
            return resumo;
        });
    };
    EstadoSinteseService.prototype.getIndicadores = function (estado) {
    };
    EstadoSinteseService.prototype.getConfiguracao = function (tipo) {
        var _a = configuration_1.PANORAMA[tipo] || { temas: [], indicadores: [] }, temas = _a.temas, indicadores = _a.indicadores;
        var hash = utils_1.converterObjArrayEmHash(indicadores, 'tema', true);
        return temas.reduce(function (agg, tema) { return agg.concat(hash[tema]); }, []).filter(Boolean);
    };
    EstadoSinteseService.prototype.getIndicadoresMunicipioCorrespondentes = function (indicadoresEstado) {
        var panoramaEstado = configuration_1.PANORAMA['uf'];
        var panoramaMunicipios = configuration_1.PANORAMA['municipio'];
        return panoramaEstado.indicadores.
            map(function (indicador) { return panoramaMunicipios.indicadores.filter(function (indMun) { return indMun.titulo == indicador.titulo; }); })
            .map(function (ind) { return ind[0] && ind[0].indicadorId; })
            .filter(function (ind) { return ind != null; });
    };
    EstadoSinteseService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [panorama_service_1.PanoramaService,
            shared_1.LocalidadeService3,
            shared_1.AppState,
            shared_1.RouterParamsService,
            shared_1.TraducaoService,
            shared_1.BibliotecaService,
            shared_1.ResultadoService3])
    ], EstadoSinteseService);
    return EstadoSinteseService;
}());
exports.EstadoSinteseService = EstadoSinteseService;


/***/ }),

/***/ 626:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(8);
var common_1 = __webpack_require__(7);
__webpack_require__(59);
__webpack_require__(27);
__webpack_require__(23);
__webpack_require__(35);
__webpack_require__(17);
__webpack_require__(28);
__webpack_require__(18);
var core_2 = __webpack_require__(16);
var estado_sintese_service_1 = __webpack_require__(613);
var shared_1 = __webpack_require__(4);
var headers = new http_1.Headers({ 'accept': '*/*' });
var options = new http_1.RequestOptions({ headers: headers, withCredentials: false });
var EstadoSinteseComponent = (function () {
    function EstadoSinteseComponent(_routerParamsServ, _http, modalErrorService, _traducaoServ, _routerParams, _localidadeService, _appState, _estadoSinteseService, _indicadorService, _pesquisaService, platformId) {
        this._routerParamsServ = _routerParamsServ;
        this._http = _http;
        this.modalErrorService = modalErrorService;
        this._traducaoServ = _traducaoServ;
        this._routerParams = _routerParams;
        this._localidadeService = _localidadeService;
        this._appState = _appState;
        this._estadoSinteseService = _estadoSinteseService;
        this._indicadorService = _indicadorService;
        this._pesquisaService = _pesquisaService;
        this.resumo = {};
        this.indicadores = [];
        this.esconde = true;
        this.enviado = false;
        this.url = '';
        this.notas = [];
        this.fontes = [];
        this.resumo.municipios = [];
        this.isBrowser = common_1.isPlatformBrowser(platformId);
    }
    Object.defineProperty(EstadoSinteseComponent.prototype, "lang", {
        get: function () {
            return this._traducaoServ.lang;
        },
        enumerable: true,
        configurable: true
    });
    EstadoSinteseComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.isBrowser) {
            this._routerParams.params$.subscribe(function (_a) {
                var params = _a.params, queryParams = _a.queryParams;
                if (params.uf != null) {
                    _this.estado = _this._localidadeService.getUfBySigla(params.uf);
                }
                if (queryParams.indicadores != null) {
                    var indicadores = queryParams.indicadores.split(',');
                    /* this._estadoSinteseService.getResumoMunicipios(localidade,indicadores).subscribe((resumo)=>{
                        this.resumo = resumo;
                            
                        if(this.resumo!=null && this.resumo.length>0){
                            this.indicadores = this.resumo[0].indicadores;
                            this.notas  = this._estadoSinteseService.getNotasResumo(resumo[0]);
                            this.fontes =    this._estadoSinteseService.getFontesResumo(resumo[0]);
                            }
                        
                    });*/
                    _this._estadoSinteseService.getResumoEstado(_this.estado, indicadores).subscribe(function (resumo) {
                        _this.resumo = resumo;
                        if (_this.resumo != null && _this.resumo.municipios != null && _this.resumo.municipios.length > 0) {
                            _this.indicadores = _this.resumo.municipios[0].indicadores;
                            _this.notas = _this._estadoSinteseService.getNotasResumo(_this.resumo.municipios[0]);
                            _this.fontes = _this._estadoSinteseService.getFontesResumo(_this.resumo.municipios[0]);
                        }
                        console.log(_this.indicadores);
                    });
                }
                //    this._localidade$$ = this._appState.observable$
                //         .subscribe(({ localidade }) => {
                //   })
            });
        }
    };
    EstadoSinteseComponent = __decorate([
        core_1.Component({
            selector: 'estado-sintese',
            template: __webpack_require__(683),
            styles: [__webpack_require__(710)]
        }),
        __param(10, core_1.Inject(core_1.PLATFORM_ID)),
        __metadata("design:paramtypes", [shared_1.RouterParamsService,
            http_1.Http,
            core_2.ModalErrorService,
            shared_1.TraducaoService,
            shared_1.RouterParamsService,
            shared_1.LocalidadeService3,
            shared_1.AppState,
            estado_sintese_service_1.EstadoSinteseService,
            shared_1.IndicadorService3,
            shared_1.PesquisaService3, String])
    ], EstadoSinteseComponent);
    return EstadoSinteseComponent;
}());
exports.EstadoSinteseComponent = EstadoSinteseComponent;


/***/ }),

/***/ 656:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)();
// imports


// module
exports.push([module.i, ".estado-sintese {\r\n    background-color: #EEE;\r\n    text-align: center;\r\n    font-family: 'Open Sans', sans-serif;\r\n    width:100%;\r\n    min-height: 100vh;\r\n    padding-bottom: 50px;\r\n}\r\n.estado{\r\n    font-size:2em;\r\n}\r\n#conteudo {\r\n    margin: 30px auto;\r\n    background-color: #FFF;\r\n    border: 1px solid #ccc;\r\n    padding: 25px;\r\n    text-align: left;\r\n    width: 1200px;\r\n    margin-bottom: 0px;\r\n}\r\n\r\n.logo{\r\n    float: right;\r\n}\r\n\r\nh1 {\r\n    margin: 50 0 10px 0;\r\n    padding-top: 3%;\r\n    padding-bottom:1%;\r\n    font-size:2em;\r\n}\r\nul#info {\r\n    margin: 0 0 25px 0;\r\n    padding: 0;\r\n    font-size: 12px;\r\n    list-style-position: outside;\r\n    list-style-type: none;\r\n}\r\ndiv#mapa {\r\n    margin: 0 0 25px 0;\r\n    text-align: center;\r\n}\r\n\r\ntable#municipios  {\r\n    font-size: 12px;\r\n    min-width: 100%;\r\n}\r\ntable#municipios thead tr  {\r\n    background-color: #ddd;\r\n}\r\ntable#municipios thead tr th  {\r\n    text-align: center;\r\n    padding: 5px;\r\n}\r\ntable#municipios tbody tr td  {\r\n    text-align: right;\r\n    padding: 5px;\r\n}\r\ntable#municipios thead tr th.nome, table#municipios tbody tr td.nome, table#municipios tbody tr td.gentilico {\r\n    text-align: left;\r\n}\r\n\r\ntable#municipios tbody tr.impar  {\r\n    background-color: #EEE;\r\n}\r\ntable#municipios tfoot tr td {\r\n    font-weight: bold;\r\n    padding-top: 15px;\r\n}\r\n\r\n\r\n@media print {\r\n    #conteudo{\r\n        width: 100%;\r\n    }\r\n}", ""]);

// exports


/***/ }),

/***/ 683:
/***/ (function(module, exports) {

module.exports = "<div class=\"estado-sintese\">\r\n    <div id=\"conteudo\">\r\n            <img src='/img/logo.png' class='logo'>\r\n            <h1 class=\"estado\">{{ estado?.nome }}</h1>\r\n            <table id=\"municipios\">\r\n                <thead>\r\n                    <tr>\r\n                        <th>{{ \"panorama_resumo__municipios\" | l10n:lang }}</th>\r\n                        <th>{{ \"panorama_resumo__gentilico\" | l10n:lang }}</th>\r\n                        <th *ngFor=\"let indicador of indicadores\">{{ indicador.titulo | l10n:lang }}</th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody  *ngFor=\"let municipio of resumo.municipios;let i=index\">\r\n                        <tr class=\"3300100 par\">\r\n                            <td class=\"nome\">{{ municipio.nome }}</td>\r\n                            <td class=\"gentilico\">{{ municipio.gentilico }}</td>\r\n                            <td  *ngFor=\"let indicador of municipio.indicadores\" >{{ indicador.valor | resultado}} <span *ngIf=\"indicador.valor!='-'\">{{ indicador.unidade }}</span></td>\r\n                        </tr>                \r\n                </tbody>\r\n                <tfoot>\r\n                    <tr>\r\n                        <td [attr.colspan]=\"indicadores && (indicadores.length+2)\">\r\n                             <div *ngFor=\"let fonte of fontes;let i=index\">\r\n                                 <br/>{{ \"panorama_resumo__fonte\" | l10n:lang }} {{i+1}} - {{fonte.indicador  | l10n:lang }}: {{fonte.descricao}} \r\n                             </div>   \r\n                            <div *ngFor=\"let nota of notas;let i=index\">\r\n                                <br/>{{ \"panorama_resumo__nota\" | l10n:lang }} {{i+1}} - {{nota.indicador  | l10n:lang }}: {{nota.descricao}}\r\n\r\n                            </div>\r\n                        </td>\r\n                    </tr>\r\n                </tfoot>\r\n            </table>\r\n    </div>\r\n</div>   ";

/***/ }),

/***/ 710:
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(656);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ })

});
//# sourceMappingURL=2-chunk.889d14cbb334ca5f28c0.js.map