const sprites = new Image();
sprites.src = './img/sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

function criaFlappyBird(){
    const flappyBird = {
        spriteX: 0, 
        spriteY: 0, 
        spriteWidth: 33, 
        spriteHeight: 24, 
        destinationX: 10, 
        destinationY: 50, 
        velocidade: 0,
        gravidade: 0.25,
        movimentos: [
            {spriteX: 0, spriteY: 0},
            {spriteX: 0, spriteY: 26},
            {spriteX: 0, spriteY: 52},
            {spriteX: 0, spriteY: 26},
        ],
        pulo: 4.6,
        pular(){
            this.velocidade = - this.pulo;
        },
        frameAtual: 0,
        atualizaFrame(){
            const intrvaloDeFrames = 10;
            const passouOIntervalo = frames % intrvaloDeFrames === 0;

            if(passouOIntervalo){
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + this.frameAtual;
                const baseRepeticao = this.movimentos.length;
                this.frameAtual = incremento % baseRepeticao;
            }
        },
        desenha(){
            this.atualizaFrame();
            const {spriteX, spriteY} = this.movimentos[this.frameAtual];
            contexto.drawImage(sprites,
                spriteX,spriteY,
                this.spriteWidth,this.spriteHeight,
                this.destinationX,this.destinationY,
                this.spriteWidth,this.spriteHeight);
        },
        atualiza(){
            this.velocidade += this.gravidade;
            this.destinationY += this.velocidade;
        }
    }
    return flappyBird;
}

function criaChao(){
    const chao = {
        spriteX: 0, 
        spriteY: 610, 
        spriteWidth: 224, 
        spriteHeight: 112, 
        destinationX: 0, 
        destinationY: canvas.height - 112,
        atualiza(){
            const movimentoDoChao = 1;
            const repeteEm = this.spriteWidth/2;
            const movimentacao = this.destinationX - movimentoDoChao;

            this.destinationX = movimentacao % repeteEm;
        },
        desenha(){
            contexto.drawImage(
                sprites,
                this.spriteX, this.spriteY,
                this.spriteWidth, this.spriteHeight,
                this.destinationX, this.destinationY,
                this.spriteWidth, this.spriteHeight
            )
            contexto.drawImage(
                sprites,
                this.spriteX, this.spriteY,
                this.spriteWidth, this.spriteHeight,
                this.destinationX + this.spriteWidth, this.destinationY,
                this.spriteWidth, this.spriteHeight
            )
        }
    };
    return chao;
}

function criaPlanoDeFundo(){
    const planoDeFundo = {
        spriteX: 390, 
        spriteY: 0, 
        spriteWidth: 275, 
        spriteHeight: 204, 
        destinationX: 0, 
        destinationY: canvas.height - 204,
        atualiza(){
            const movimentoDoPlanoDeFundo = .1;
            const repeteEm = this.spriteWidth/2;
            const movimentacao = this.destinationX - movimentoDoPlanoDeFundo;

            this.destinationX = movimentacao % repeteEm;
        },
        desenha(){
            contexto.fillStyle = '#70c5ce';
            contexto.fillRect(0,0, canvas.width, canvas.height);
    
            contexto.drawImage(
                sprites,
                this.spriteX, this.spriteY,
                this.spriteWidth, this.spriteHeight,
                this.destinationX, this.destinationY,
                this.spriteWidth, this.spriteHeight
            )
            contexto.drawImage(
                sprites,
                this.spriteX, this.spriteY,
                this.spriteWidth, this.spriteHeight,
                (this.destinationX + this.spriteWidth), this.destinationY,
                this.spriteWidth, this.spriteHeight
            )
        },
    }
    return planoDeFundo;
}

const mensagemGetReady = {
    spriteX: 134, 
    spriteY: 0, 
    spriteWidth: 174, 
    spriteHeight: 152, 
    destinationX: (canvas.width/2) - (174/2), 
    destinationY: 50,
    desenha(){
        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.spriteWidth, this.spriteHeight,
            this.destinationX, this.destinationY,
            this.spriteWidth, this.spriteHeight,
        );
    }
}



const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela){
    telaAtiva = novaTela;
    if(telaAtiva.inicializa){
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa(){
            globais.planoDefundo = criaPlanoDeFundo();
            globais.chao = criaChao();
            globais.flappyBird = criaFlappyBird();
        },
        desenha(){
            globais.planoDefundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            mensagemGetReady.desenha();
        },
        click(){
            mudaParaTela(Telas.JOGO);
        },
        atualiza(){

        }
    },
    JOGO:{
        inicializa(){

        },
        desenha(){
            globais.planoDefundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
        },
        click(){
            globais.flappyBird.pular();
        },
        atualiza(){
            globais.flappyBird.atualiza();
            globais.planoDefundo.atualiza();
            globais.chao.atualiza();
        }
    }
}

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
});

function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();
    requestAnimationFrame(loop);
}

mudaParaTela(Telas.INICIO);
loop();