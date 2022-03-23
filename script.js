let quantidade = 1;
let cart = [];
let modalkey = 0;

pizzaJson.map((item, index) => {
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true); // clona todo o html dessa div



    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; // Depois de clonar, incluindo os dados via innerHTML - item.name
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => { // ativa a modal
        //preenchendo a modal
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalkey = key;
        document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => { //oque rola aqui. primeiro eu acesso todos os dados do pizzaInfo--size, faz um foreach, que recebe o size e o sizeindex 
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });


        e.preventDefault();// tira a ação default (atualizar a tela)
       quantidade = 1;
        document.querySelector('.pizzaInfo--qt').innerHTML = quantidade;
        document.querySelector('.pizzaWindowArea').style.opacity = 0;
        document.querySelector('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            document.querySelector('.pizzaWindowArea').style.opacity = 1;
        }, 200)
    });

    document.querySelector('.pizza-area').append(pizzaItem); // adiciona o conteudo na pizza area. Usa o append pra add  innerhtml substitui
});


function closemodal() {
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    }, 200);
}
document.querySelectorAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closemodal);
});


document.querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
    quantidade++;
    document.querySelector('.pizzaInfo--qt').innerHTML = quantidade;

});


document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {

    if (quantidade > 1) {
        quantidade--;
        document.querySelector('.pizzaInfo--qt').innerHTML = quantidade;
    }

});


document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {

    size.addEventListener('click', (e) => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });

});


document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key');

    let identificador = pizzaJson[modalkey].id + '@' + size; // cria um identificador

    let key = cart.findIndex((item) => { // faz uma busca se existe 
        return item.identificador == identificador; // retornar se for igual
    });

    if (key > -1) {// se existir soma
        cart[key].qt += quantidade
    } else {
        cart.push({//se não add
            identificador,
            id: pizzaJson[modalkey].id,
            size,
            qt: quantidade,
        })
    }
    updatecar();
    closemodal();
});

document.querySelector('.menu-openner').addEventListener('click',()=>{
    if(cart.length > -1){
    document.querySelector('aside').style.left =0;
}

});


document.querySelector('.menu-closer').addEventListener('click',()=>{
    
    document.querySelector('aside').style.left ='100vw';


});


function updatecar() {

    document.querySelector('.menu-openner span').innerHTML = cart.length;
    if (cart.length > 0){
        let subtotal = 0;
        let total =0;
        let desconto=0;
        
        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML = '';
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id==cart[i].id);
            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);

            subtotal += pizzaItem.price * cart[i].qt;

            let pizzasizeName;
            switch (cart[i].size) {
                case '0':
                pizzasizeName = 'P';
                break;

                case '1':
                    pizzasizeName = 'M';
                    break;

                    case '2':
                        pizzasizeName = 'G';
                        break;
        

            }


            let pizzaName = `${pizzaItem.name} (${pizzasizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;


            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1 ){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                   
                }
                updatecar();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updatecar();
            });
           


            document.querySelector('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        document.querySelector('.subtotal span:last-child').innerHTML = `R$:${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$:${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$:${total.toFixed(2)}`;

    }else{
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left ='100vw';
    }
}