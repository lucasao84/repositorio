$(document).ready(function () {
    cardapio.eventos.init();
})


var cardapio = {};

var MEU_CARRINHO  = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 0;


var CELULAR_EMPRESA = '556992614173'




cardapio.eventos = {
    init: () => {
        cardapio.metodo.obterItensCardapio();
        cardapio.metodo.carregarBotaoReserva();
        cardapio.metodo.carregarBoataoLigar();
        cardapio.metodo.BtnWhat();
        cardapio.metodo.BtnWhat1();
    }
}

cardapio.metodo = {

    //obter a lista de itens do cardapio

    obterItensCardapio: (categoria = 'burgers',vermais = false) => {
        var filtro = MENU[categoria]
        console.log(filtro)

            if (!vermais) {
                $("#itensCardapio").html('')
                $("#btnVermais").removeClass('hidden');

            }

      

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img).replace(/\${name}/g, e.name).replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)



            //botão ver mais foi clicad0 12 itens
            if (vermais && i >= 8 && i <12){
                $("#itensCardapio").append(temp)
            }

            //paginação inicial (8 itens)
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp)
            }

        })

        //remove o ativo

        $(".container-menu a").removeClass('active');

        // seta o menu para ativo

        $('#menu-' + categoria).addClass('active')
    },

    
    //clique no botao de ver mais

    verMais: () => {

         var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];//menu-burgers
         cardapio.metodo.obterItensCardapio(ativo, true)

         $("#btnVermais").addClass('hidden');

    },


    //dimunir a quantidade do item do cardapio

    diminuirQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1);
        }
    },
    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1);
    },

     

    //adicionarr ao carrinho o item do cardapio
    adicionarAoCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0) {
            // obter a categoria ativa

            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obter a lista de itens
            let filtro = MENU[categoria];

            //obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id})

            if (item.length > 0) {


                //validar se ja existe esse item no carrinho

                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id})
                 

                //caso ja existe o item do carrinho, altera a quantidade
                if (existe. length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual; 
                
                //caso ainda nao exista o item no carrinho adicionar ele
                } else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }
                
                cardapio.metodo.mensagem("Item adicionado ao carrinho", "green")
                $("#qntd-" + id).text(0)

                cardapio.metodo.atualizarBadgeTotal();

            }

        }

        
    },

    //atualiza o badge de  totais dos botões "Meu Carrinho"
    atualizarBadgeTotal: () => {
        var total = 0;


        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden')
            $(".container-total-carrinho").removeClass('hidden')
        }
        else {
            $(".botao-carinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden')
            
        }

        $(".badge-total-carrinho").html(total);

    }, 


    //abrir a modal de carrinho

    abrirCarrinho: (abrir) => {
        if (abrir) {
            $("#modalCarrinho").removeClass('hidden')
            cardapio.metodo.carregarCarrinho()

        } else {
            $("#modalCarrinho").addClass('hidden')

        }
    },


    //altera os texo e o exibe os botões das etapas
    carregarEtapa: (etapa) => {
        if (etapa == 1){
          $("#lblTituloEtapa").text('Seu carrinho');
          $("#itensCarrinho").removeClass('hidden');
          $("#localEntrega").addClass('hidden');
          $("#resumoCarrinho").addClass('hidden');

          $(".etapa").removeClass('active');
          $(".etapa1").addClass('active');

          $("#btnEtapaPedido").removeClass('hidden')
          $("#btnEndereço").addClass('hidden')
          $("#btnEtapaResumo").addClass('hidden')
          $("#btnVoltar").addClass('hidden')
        } 
        
        if (etapa == 2){
          $("#lblTituloEtapa").text('Endereço de entrega:');
          $("#itensCarrinho").addClass('hidden');
          $("#localEntrega").removeClass('hidden');
          $("#resumoCarrinho").addClass('hidden');

          $(".etapa").removeClass('active');
          $(".etapa1").addClass('active');
          $(".etapa2").addClass('active');

          $("#btnEtapaPedido").addClass('hidden')
          $("#btnEndereço").removeClass('hidden')
          $("#btnEtapaResumo").addClass('hidden')
          $("#btnVoltar").removeClass('hidden')
        }

        if (etapa == 3){
          $("#lblTituloEtapa").text('Resumo do pedido:');
          $("#itensCarrinho").addClass('hidden');
          $("#localEntrega").addClass('hidden');
          $("#resumoCarrinho").removeClass('hidden');

          $(".etapa").removeClass('active');
          $(".etapa1").addClass('active');
          $(".etapa2").addClass('active');
          $(".etapa3").addClass('active');

          $("#btnEtapaPedido").addClass('hidden')
          $("#btnEndereço").addClass('hidden')
          $("#btnEtapaResumo").removeClass('hidden')
          $("#btnVoltar").removeClass('hidden')

        }

    },


    //botao de volta etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodo.carregarEtapa(etapa - 1);

    },

    //carrega a lista de itens do carrinho

    carregarCarrinho: () => {
        cardapio.metodo.carregarEtapa(1);

        if (MEU_CARRINHO.length){
            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO , (i,e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img).replace(/\${name}/g, e.name).replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)


                $("#itensCarrinho").append(temp);

                //ultimo item

                if((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodo.carregarValores();
                }

            })
        } else {
                $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio</p>');
                cardapio.metodo.carregarValores();
        }
        
    },


    //diminuir a quantidade de item no carrinho

    diminuirQuantidadeCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodo.atualizarCarrinho(id, qntdAtual - 1)
        } else {
            cardapio.metodo.removerItemCarrinho(id)
        }

    },
     

     //almentar a quantidade de item no carrinho
    aumentarQuantidadeCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodo.atualizarCarrinho(id, qntdAtual + 1)

    },

    //botão remover item do carrinho
    removerItemCarrinho: (id) => {
        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id})
        cardapio.metodo.carregarCarrinho();

         //atualizar o botão carrinho com a quantidade atualizada
         cardapio.metodo.atualizarBadgeTotal();

    },


    //atualiza o carrinho atual
    atualizarCarrinho: (id,qntd) => {
        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;


    //atualizar o botão carrinho com a quantidade atualizada
        cardapio.metodo.atualizarBadgeTotal();
    

    //atualizar os valores (R$) totais do carrinho
        cardapio.metodo.carregarValores();

    },
 
     
    //carregar os valores de subtotal,Entrega e total
    carregarValores: () => {

         VALOR_CARRINHO = 0;

         $('#lblsubTotal').text('R$0,00');
         $('#lblValorEntrega').text('+ R$0,00');
         $('#lblValorTotal').text('R$0,00');


         $.each(MEU_CARRINHO, (i, e) => {
            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if((i + 1) == MEU_CARRINHO.length) {
                $('#lblsubTotal').text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $('#lblValorEntrega').text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $('#lblValorTotal').text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }
         })

    },

     //carregar a etapa endereços
    carregarEndereço: () => {
        if (MEU_CARRINHO.length <= 0) {
            cardapio.metodo.mensagem('Seu carrinho esta vazio')
            //cardapio.metodo.mensagem('Seu carrino está vazio.')
            return
        } 

        cardapio.metodo.carregarEtapa(2);
    },
     

    //API ViaCEP
    buscarCp: () => {
        // Cria a variável com o valor do CEP
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');
    
        // Verifica se o CEP possui valor informado
        if (cep !== "") {
            // Expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;
    
            if (validacep.test(cep)) {
                // Faz a requisição na API ViaCEP
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                    if (!dados.erro) {
                        // Atualizar os campos com os valores retornados, verificando se existem
                        $("#txtEndereço").val(dados.logradouro || "");
                        $("#txtBairro").val(dados.bairro || "");
                        $("#txtCidade").val(dados.localidade || "");
                        $("#ddlUf").val(dados.uf || "");
                        $("#txtNumero").focus();
                    } else {
                        cardapio.metodo.mensagem('CEP não encontrado. Preencha as informações manualmente.');
                        $("#txtEndereço").focus();
                    }
                }).fail(function () {
                    // Caso a API não responda
                    cardapio.metodo.mensagem('Erro ao buscar o CEP. Tente novamente mais tarde.');
                    $("#txtCEP").focus();
                });
            } else {
                cardapio.metodo.mensagem('Formato do CEP inválido.');
                $("#txtCEP").focus();
            }
        } else {
            cardapio.metodo.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
        }
    },

    
    // validação antes de prosseguir para etapa 3 ETAPA IMPORTANTE

    resumoPedido: () => {
        let cep = $('#txtCEP').val().trim();
        let endereço = $('#txtEndereço').val().trim();
        let bairro = $('#txtBairro').val().trim();
        let cidade = $('#txtCidade').val().trim();
        let uf = $('#ddlUf').val().trim();
        let numero = $('#txtNumero').val().trim();
        let complemento = $('#txtComplemento').val().trim();


        if (cep.length <= 0) {
            cardapio.metodo.mensagem('Informe o CEP, por favor.');
            $('#txtCEP').focus()
            return;
        }

        if (endereço.length <= 0) {
            cardapio.metodo.mensagem('Informe o Endereço, por favor.');
            $('#txtEndereço').focus()
            return;
        }


        if (bairro.length <= 0) {
            cardapio.metodo.mensagem('Informe o Bairro, por favor.').focus();
            $('#txtBairro').focus()
            return;
        }

        if (bairro.length <= 0) {
            cardapio.metodo.mensagem('Informe a Cidade, por favor.').focus();
            $('#txtCidade').focus()
            return;
        }

        if (uf == "-1"){
            cardapio.metodo.mensagem('Informe a UF, por favor.').focus();
            $('##ddlUf').focus()
            return;
        }

        if (numero.length <= 0) {
            cardapio.metodo.mensagem('Informe o Numero ou 0 Para Prosseguir, por favor.').focus();
            $('#txtNumero').focus()
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereço: endereço,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodo.carregarEtapa(3);
        cardapio.metodo.carregarResumo();


        },
         
        //carrega a etapa de remudo do pedido
    carregarResumo: () => {

        $("#listaItemResumo").html('');
        
        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img).replace(/\${name}/g, e.name).replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${qntd}/g, e.qntd)


            $("#listaItemResumo").append(temp);

        })

        $("#resumoEndereço").html(`${MEU_ENDERECO.endereço},${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro} `);
        $("#cidadeEndereço").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

        cardapio.metodo.finalizarPedido();

        },

    



    


    // Atualizar o link do botão do whatsapp
    finalizarPedido: () => {
        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {
            // Valor da entrega
            // Exemplo de valor fixo
            var TOTAL_FINAL = VALOR_CARRINHO + VALOR_ENTREGA;
    
            // Inicia o texto do pedido
            let texto = "Olá, gostaria de fazer um pedido:";
            
            // Adiciona os itens do pedido
            let itens = '';
            $.each(MEU_CARRINHO, (i, e) => {
                itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;
            });
            texto += `\n*Itens do pedido:*\n${itens}`;
    
            // Adiciona o endereço de entrega
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereço}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
    
            // Adiciona o valor total com entrega
            texto += `\n\n*Total (com entrega): R$ ${TOTAL_FINAL.toFixed(2).replace('.', ',')}*`;
    
            console.log(texto)
            // Codifica o texto para o formato de URL
          //  const textoEncoded = encodeURIComponent(texto);
    
            // Atualiza o link do WhatsApp
          //  const whatsappUrl = `https://wa.me/${CELULAR_EMPRESA}?text=${textoEncoded}`;
          // console.log(whatsappUrl);

            // Exemplo: redirecionar o usuário
           // window.open(whatsappUrl, '_blank');

           let encode = encodeURI(texto);
           let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;


           $("#btnEtapaResumo").attr('href', URL)


           



        } else {
            console.error("Carrinho vazio ou endereço não preenchido.");
        }
    },
     

    //carregar o link botão reserva
    carregarBotaoReserva: () => {

        var texto = "Olá! gostaria de fazer uma *reserva*"

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },

    //carrgar o botão de ligar
    carregarBoataoLigar: () => {
        $('#btnLigar').attr('href', 'tel:5569992614173')
    },

    //abre depoimento
    abrirDepoimento: (depoimento) => {
    
        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');    
    },
    



    BtnWhat: () => {
        var texto = 'Olá! Como Funcionar Seus Serviços ?';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#botaoWhatsapp").attr('href', URL);
       

    },

    BtnWhat1: () => {
        
        var texto = 'Olá! Como Funcionar Seus Serviços ?';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#botaoZap").attr('href', URL);

    },




    //mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {
        // Gera um ID único para a mensagem
        let id = `toast-${Math.floor(Date.now() * Math.random()).toString(16)}`;
    
        // Cria o HTML da mensagem
        let msg = `<div id="${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;
    
        // Adiciona a mensagem ao contêiner
        $("#container-mensagens").append(msg);
    
        // Define o tempo para remover a mensagem
        setTimeout(() => {
            $(`#${id}`).removeClass('fadeInDown').addClass('fadeOutUp');
            setTimeout(() => {
                $(`#${id}`).remove();
            }, 800); // Deve corresponder ao tempo da animação `fadeOutUp`
        }, tempo);
    },



    


};


//funçao ao clicla rolagem automatica BOTAO VERCARDAPIO

document.getElementById('btnVerCardapio').addEventListener('click', function (event) {
    event.preventDefault(); // Impede comportamento padrão
    document.getElementById('cardapio').scrollIntoView({
        behavior: 'smooth' // Ativa a rolagem suave
    });
});


//funçao ao clicla rolagem automatica MENU - RESERVA

document.getElementById('btnReserva').addEventListener('click', function (event) {
    event.preventDefault(); // Impede comportamento padrão
    document.getElementById('reserva').scrollIntoView({
        behavior: 'smooth' // Ativa a rolagem suave
    });
});


//funçao ao clicla rolagem automatica MENU - SERVIÇOS

document.getElementById('btnServiços').addEventListener('click', function (event) {
    event.preventDefault(); // Impede comportamento padrão
    document.getElementById('serviços').scrollIntoView({
        behavior: 'smooth' // Ativa a rolagem suave
    });
});

//funçao ao clicla rolagem automatica MENU - SERVIÇOS

document.getElementById('BtnCapioMenu').addEventListener('click', function (event) {
    event.preventDefault(); // Impede comportamento padrão
    document.getElementById('cardapio').scrollIntoView({
        behavior: 'smooth' // Ativa a rolagem suave
    });
});


//funçao ao clicla rolagem automatica MENU - DEPOIMENTOS

document.getElementById('btnDepoimento').addEventListener('click', function (event) {
    event.preventDefault(); // Impede comportamento padrão
    document.getElementById('depoimento').scrollIntoView({
        behavior: 'smooth' // Ativa a rolagem suave
    });
});








cardapio.templates = {
    item: `
        <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated wow fadeInUp">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}" alt="">
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${name}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${price}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodo.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodo.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodo.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
     <div class="col-12 item-carrinho">
                <div class="img-produto">
                            <img src="\${img}">
                        </div>
                        <div class="dados-produto">
                            <p class="title-produto" id="NTC"><b>\${name}</b></p>
                            <p class="price-produto"><b>R$ \${price}</b></p>
                        </div>
                        <div class="add-carrinho">
                             <span class="btn-menos" onclick="cardapio.metodo.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                             <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                             <span class="btn-mais" onclick="cardapio.metodo.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                            <span class="btn btn-remove no-mobile" onclick="cardapio.metodo.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
                            
        </div>
    
    `,


    itemResumo: `
                <div class="col-12 item-carrinho resumo">
                                    <div class="img-produto-resumo">
                                        <img src="\${img}">
                                    </div>

                                    <div class="dados-produto">
                                        <p class="title-produto-resumo">
                                            <b>\${name}</b>
                                        </p>
                                        <p class="price-produto-resumo">
                                            <b>R$ \${price}</b>
                                        </p>
                                    </div>
                                    <p class="quantidade-produto-resumo">
                                        x <b>\${qntd}</b>
                                    </p>
                                </div>
    
    `
};