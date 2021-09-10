const content = document.querySelector("#content")

const produits = [
    {id:"1",nom:"Paquet de chips", prix:4, image:"chips.jpg"},
    {id:"2",nom:"Jambonneau", prix:30, image:"jambon.png"},
    {id:"3",nom:"Pack de bière", prix:15, image:"biere.png"},
    {id:"4",nom:"Paquet de bonbon", prix:7, image:"bonbon.png"},
    {id:"5",nom:"Cacahuettes", prix:2, image:"cacahuete.png"}
]

function makeCard(produit) {
    let modelCard = `
    <div class="row row-cols-1 row-cols-md-2 g-1" id="content">
        <div class="col">
            <div class="card" id="card">
                <img src=Images/${produit.image} class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title" id="card-tittle">${produit.nom}</h5>
                    <p class="card-text" id="card-prix">${produit.prix} €</p>
                    <div class="ajout">
                                <button class="btn btn-secondary moins"><strong>-</strong></button>
                                <input type="text" value="0" class="compteur">
                                <button class="btn btn-secondary plus"><strong>+</strong></button>
                                <button class="btn btn-success ajouter disabled" id="${produit.id}">Ajouter au panier</button>
                            </div>
                </div>
            </div>
        </div>
    </div>
    `
    return modelCard

    }

function getProducts(articles) {
    let cards = "";
    articles.forEach(article =>{
        cards += makeCard(article)
    });
    return cards;
}
showProducts()

function showProducts() {
    content.innerHTML = getProducts(produits)
    const mesDivsAjout = document.querySelectorAll('.ajout')
    mesDivsAjout.forEach(div=>{
        const boutonMoins = div.querySelector('.moins')
        const boutonPlus = div.querySelector('.plus')
        const boutonAjouter = div.querySelector('.ajouter')
        const compteur = div.querySelector('.compteur')

        boutonPlus.addEventListener('click', ()=>{
            increment(compteur, boutonAjouter)
        })

        boutonMoins.addEventListener('click', ()=>{
            decrement(compteur, boutonAjouter)
        })

        boutonAjouter.addEventListener('click', ()=>{
            ajouterAuPanier(boutonAjouter.id, compteur.value)
        })
    })
}

function increment(inputCompteur, boutonAJoutPanier) {
    inputCompteur.value++
    if (inputCompteur.value >0) boutonAJoutPanier.classList.remove("disabled")
}

function decrement(inputCompteur, boutonAjoutPanier) {
    if (inputCompteur.value >0) {
        inputCompteur.value--
    }
    if(inputCompteur.value == 0) boutonAjoutPanier.classList.add("disabled")
}

function ajouterAuPanier(idProduit, quantite) {
    quantite = parseInt(quantite)
    let produitSuppose = panier.find(e=> e.id == idProduit)
    if(produitSuppose) {
        produitSuppose.quantity+=quantite
    } else {
        panier.push({id:parseInt(idProduit), quantity:quantite})
    }
    showCount()
}

const panier = []

function afficheLePanier(){
    let grandTotal = 0;
    let contenu = "";
    panier.forEach(article =>{
        let produit = produits.find(e=>e.id == article.id)
        let tr = `
                <tr>
                <td>${produit.nom}</td>
                <td class="quantite" data-article="${article.id}">
                    <button class="btn btn-secondary moins"><strong>-</strong></button>
                    ${article.quantity}
                    <button class="btn btn-secondary plus"><strong>+</strong></button>
                    </td>
                <td>${produit.prix}€</td>
                <td>${article.quantity*produit.prix}€</td>
                <td><button class="btn btn-danger supprimer" id="${article.id}"><strong>X</strong></button></td>
                </tr> 
            `
        grandTotal+=(article.quantity * produit.prix)
        contenu += tr;
    })
    let table = `
     <table class="table table-striped">
            <thead>
            <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix</th>
                <th>Sous-total</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                ${contenu}
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td></td>
                <td></td>
                <td><strong>Total</strong></td>
                <td>${grandTotal} €</td>
                <td><button class="btn btn-success">Payer</button></td>
            </tr>
            </tfoot>
        </table>
    `
    content.innerHTML = table;

    const BoutonsSupprimer = document.querySelectorAll('.supprimer')
    BoutonsSupprimer.forEach(bouton =>{
        bouton.addEventListener('click', ()=>{
           supprimerArticlePanier(bouton.id)
        })
    })

    const tdsQuantite = document.querySelectorAll('.quantite')
    tdsQuantite.forEach(td=>{
        const boutonMoins = td.querySelector('.moins')
        const boutonPlus = td.querySelector('.plus')
        const articleId = td.getAttribute('data-article')

        boutonMoins.addEventListener('click', ()=>{
            enleverArticle(articleId)
        })
        boutonPlus.addEventListener('click', ()=>{
            ajouterArticle(articleId)

        })
    })
}

function ajouterArticle(articleId){
    let index = panier.findIndex(article=>article.id == articleId)
    panier[index].quantity++
    afficheLePanier()
    showCount()
}

function enleverArticle(articleId){
    let index = panier.findIndex(article=>article.id == articleId)
    if(panier[index].quantity == 1) {
        supprimerArticlePanier(articleId)
    }else {
        panier[index].quantity--
        afficheLePanier()
        showCount()
    }
}

function supprimerArticlePanier(idProduit) {
    let index = panier.findIndex(truc=>truc.id === parseInt(idProduit))
    panier.splice(index,1 )
    afficheLePanier()
    showCount()
}

function showCount() {
    let count = 0;
    panier.forEach(article=>count+=article.quantity)
    document.querySelector("#count").innerHTML = count
}

const btnShop = document.querySelector("#btnShop");
const btnPanier = document.querySelector("#btnPanier");

btnPanier.addEventListener('click', afficheLePanier)
btnShop.addEventListener('click', showProducts)

