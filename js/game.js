const sprites = new Image();
sprites.src = './img/sprites.png';
const som_hit = new Audio();
som_hit.volume = 0.1;
som_hit.src = './efeitos/efeitos_hit.wav';
var frames = 0;
const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


function fazColizao(elemento1, elemento2, type){
    if(type == 'x'){
        // console.log(elemento1,elemento2);
        return elemento1.destinationX + elemento1.spriteWidth >= elemento2.destinationX ? true : false;
    }else{
        // console.log(elemento1,elemento2);
        return elemento1.destinationY + elemento1.spriteHeight >= elemento2.destinationY ? true : false;
    }
}

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
        vivo: true,
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
            if(this.vivo){
                this.atualizaFrame();
            }
            const {spriteX, spriteY} = this.movimentos[this.frameAtual];
            contexto.drawImage(sprites,
                spriteX,spriteY,
                this.spriteWidth,this.spriteHeight,
                this.destinationX,this.destinationY,
                this.spriteWidth,this.spriteHeight);
        },
        atualiza(){
            if(fazColizao(this, globais.chao, 'y')){
                this.vivo = false;
                som_hit.play();
                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 500);
                return;
            }

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
            const movimentoDoChao = 2;
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

function criarCanos(){
    const canos = {
        spriteWidth: 52, 
        spriteHeight: 400, 
        chao: {
            spriteX: 0, 
            spriteY: 169,
        }, 
        ceu: {
            spriteX: 52, 
            spriteY: 169,
        }, 
        espacamentoEntreCanos: 90,
        pares: [],
        colisaoComPlappyBird(par){
            if(globais.flappyBird.destinationX + globais.flappyBird.spriteWidth >= par.x && 
                globais.flappyBird.destinationX <= par.x + this.spriteWidth
                ){ 
                if(globais.flappyBird.destinationY <= par.y + this.spriteHeight){
                    return true;
                }
                if(globais.flappyBird.destinationY + globais.flappyBird.spriteHeight  >= par.y + this.spriteHeight + this.espacamentoEntreCanos ){
                    return true;
                }
            }
            return false;
        },
        desenha(){
            const el = this;
            this.pares.forEach(function(par){
                const yRandom = par.y;

                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                //cano de cima
                contexto.drawImage(
                    sprites,
                    el.ceu.spriteX,el.ceu.spriteY,
                    el.spriteWidth, el.spriteHeight,
                    canoCeuX, canoCeuY,
                    el.spriteWidth, el.spriteHeight
                );
                //cano de baixo
                const canoChaoX = par.x;
                const canoChaoY = el.spriteHeight + el.espacamentoEntreCanos + yRandom;
                contexto.drawImage(
                    sprites,
                    el.chao.spriteX,el.chao.spriteY,
                    el.spriteWidth, el.spriteHeight,
                    canoChaoX, canoChaoY,
                    el.spriteWidth, el.spriteHeight
                );
            });

        },
        atualiza(){
            const passou100Frames = frames % 100 === 0;
            if(passou100Frames){
                this.pares.push({
                    x: canvas.width,
                    y: -180 * (Math.random() + 1),
                })
            }

            const el = this;
            canos.pares.forEach(function(par){
                par.x += -2; 

                if(el.colisaoComPlappyBird(par)){
                    this.vivo = false;
                    som_hit.play();
                    setTimeout(() => {
                        mudaParaTela(Telas.INICIO);
                    }, 500);
                    return;
                }

                if(par.x <= - el.spriteWidth){
                    el.pares.shift();
                }
            });
        }
    }
    return canos;
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


const globais = {
    planoDeFundo: {
        desenha: {},
        atualiza: {},
    },
    flappyBird: {
        desenha: {},
        atualiza: {},
        pular:  {},
    },
    chao: {
        desenha: {},
        atualiza: {},
    },
    canos: {
        desenha: {},
        atualiza: {},
    },
};
let telaAtiva = {
    inicializa: {},
    desenha: {},
    click: {},
    atualiza: {},
};

function mudaParaTela(novaTela){
    telaAtiva = novaTela;
    if(telaAtiva.inicializa){
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa(){
            frames = 0;
            globais.planoDeFundo = criaPlanoDeFundo();
            globais.chao = criaChao();
            globais.flappyBird = criaFlappyBird();
            globais.canos = criarCanos();
        },
        desenha(){
            globais.planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            mensagemGetReady.desenha();
        },
        click(){
            mudaParaTela(Telas.JOGO);
        },
        atualiza(){
            globais.chao.atualiza();
        }
    },
    JOGO:{
        inicializa(){

        },
        desenha(){
            globais.planoDeFundo.desenha();
            globais.flappyBird.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
        },
        click(){
            globais.flappyBird.pular();
        },
        atualiza(){
            globais.flappyBird.atualiza();
            globais.planoDeFundo.atualiza();
            globais.chao.atualiza();
            globais.canos.atualiza();
        }
    }
}

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
});


var fps = 60;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;


function loop(){
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        then = now - (delta % interval);
        telaAtiva.desenha();
        telaAtiva.atualiza();
        frames = frames <= 100 ? frames + 1 : 1;
    }
    requestAnimationFrame(loop);
}

mudaParaTela(Telas.INICIO);
loop();