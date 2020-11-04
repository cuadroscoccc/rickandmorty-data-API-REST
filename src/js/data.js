const d = document,
$paginationTop = d.querySelector('.pagination-top'),
$paginationButton = d.querySelector('.pagination-button'),
$containerCards = d.getElementById('cards-container'),
$cardsCharacters=d.getElementById("cardsCharacters"),
search = d.querySelector('.search'),
dropdown = d.getElementById("dropdown"),
contentBack = d.createElement('div'),
back = document.createElement("button");
back.textContent ="Volver";
back.setAttribute("class", "btn");
contentBack.setAttribute("class", "container d-flex flex-row");
let $pictureFrame="",
pagPrev="",
pagNext="";



/* =============loadCharacter============== */
let api_characterURL = "https://rickandmortyapi.com/api/character/";

async function loadCharacters(url){
    try{  
        let res = await fetch(url), 
        json = await res.json();  
        $containerCards.innerHTML =  
       `<div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>`; 
      
            if(!res.ok)throw {status:res.status, statusText:res.statusText}
  
        for(let i = 0; i<json.results.length; i++){
            try{
                let res = await fetch(json.results[i].url),
                character = await res.json();
        
                    if(!res.ok)throw {status:res.status, statusText:res.statusText}
    
                $pictureFrame += 
                `
                <div class="card mx-auto my-2" style="width: 18rem">
                        <img class="card-img-top" src="${character.image}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title text-center">${character.name}</h5>
                        <p class="card-text">Status: ${character.status}</p>
                        <p class="card-text">Species:${character.species}</p>
                        <p class="card-text">Type: ${character.type ? character.type : "none"}</p>
                        <p class="card-text">Gender:${character.gender}</p>
                        <p class="card-text">Origin:${character.origin.name}</p>
                        <p class="card-text">Origin Current:${character.location.name}</p>
                         <div class="contenedor-button">
                           <!-- Button trigger modal -->
                            <button id="btnModal" type="button"  class="btn btn-primary btnModal" data-id="${character.id}" data-image="${character.image}" data-name="${character.name}" data-char_episode="${character.episode}" data-toggle="modal" data-target="#exampleModal">
                                GO TO EPISODES
                            </button>
                        </div>
                    </div>
                </div>
             `   
            }catch(err){
                let message = err.statusText || "Ha ocurrido un error intente nuevamente"    
                   
                $containerCards.insertAdjacentHTML("beforebegin", `<p>Error ${err.status}: ${message}</p>`)       
            }
        } 
            $containerCards.innerHTML = $pictureFrame; 
            $pictureFrame = "";
            pagPrev = json.info.prev ? `<li class="page-item"><a class="page-link" href="${json.info.prev}">Previous</a></li>`:"";
            pagNext = json.info.next ? `<li class="page-item"><a class="page-link" href="${json.info.next}">Next</a></li>`:"";
            $paginationTop.innerHTML = pagPrev + " " + pagNext;
            $paginationButton.innerHTML = pagPrev + " " + pagNext;
  
    }catch(err){
            let message = err.statusText || "Ha ocurrido un error"; 
    }
}





/* =============loadEpisodes============== */

let api_episodeURL = "https://rickandmortyapi.com/api/episode/";

async function loadEpisodes(url){
    try {
        let res = await fetch(url), 
        json = await res.json();
       
        if(!res.ok)throw {status:res.status, statusText:res.statusText}
            for(const dato of json.results){
                $pictureFrame += 
            `
                <tbody>
                    <tr id="choice" class="itemlist">
                        <th scope="row" data-id="${dato.id}">${dato.id}</th>
                            <td class="itemlist">${dato.name}</td>
                            <td>${dato.air_date}</td>
                            <td>${dato.episode}</td>
                            <td><button class=" link btn" data-idCharacters="${dato.characters}">Más info</button></td>
                    </tr>
                </tbody>
            `;
            }
         
    document.getElementById("tbody").innerHTML = $pictureFrame;
    pagPrev = json.info.prev ? `<li class="page-item"><a class="page-link" href="${json.info.prev}">Previous</a></li>`:"";
    pagNext = json.info.next ? `<li class="page-item"><a class="page-link" href="${json.info.next}">Next</a></li>`:"";
    $paginationButton.innerHTML = pagPrev + " " + pagNext;
    }catch(err){
       let message = err.statusText || "Ha ocurrido un error";
  

  
    }
            $pictureFrame = "";
}


d.addEventListener("DOMContentLoaded", (e)=>loadCharacters(api_characterURL));
d.addEventListener("DOMContentLoaded", (e)=>loadEpisodes(api_episodeURL));



d.addEventListener('click', (e)=>{
    if(e.target.matches(".pagination li a")){
        e.preventDefault();
         loadCharacters(e.target.getAttribute("href"));        
    }
});

d.addEventListener('keyup', (e)=>{
    if(e.target.matches(".search")){
     loadCharacters(`https://rickandmortyapi.com/api/character/?name=${e.target.value}`)            
    }
});

d.addEventListener('change', async (e)=>{
    if(e.target.matches(".dropdown")){
        loadCharacters(`https://rickandmortyapi.com/api/character/?species=${e.target.value}`)
    }
});

d.addEventListener('click', (e)=>{
        if(e.target.matches(".status")){
            loadCharacters(`https://rickandmortyapi.com/api/character/?status=${e.target.value}`)   
        }   
})

  d.addEventListener('click', (e)=>{
    if(e.target.matches(".gender")){
        loadCharacters(`https://rickandmortyapi.com/api/character/?gender=${e.target.value}`)
    }
})  


d.addEventListener('click', (e)=>{
    if(e.target.matches(".pagination li a")){
        e.preventDefault();
         loadEpisodes(e.target.getAttribute("href"));        
    }
});


/* EVENTO BOTON MODAL */
d.addEventListener('click', async (e)=>{
 if(e.target.matches(".btnModal")){
    const obj = e.target;
    const modalbody = d.getElementById("modal-body");
    let urlImg = obj.dataset.image,
    title = obj.dataset.name,
    episodes = obj.dataset.char_episode;
    
    let templateList = "";
    modalbody.innerHTML=   `<div class="card mx-auto my-2" style="width: 18rem">
    <img class="card-img-top" src="${urlImg}" alt="Card image cap">
       <div class="card-body">
           <h5 class="card-title text-center">${title}</h5>
       </div>
      <ul id="list"></ul>
    </div>`;

    let strDiv = ",",
    strUrl = episodes.split(strDiv);
   
    for(let x = 0; x < strUrl.length; x++){
        let lastNumUrlEpisode = strUrl[x].slice(40);
        let res = await fetch(`https://rickandmortyapi.com/api/episode/${lastNumUrlEpisode}`), 
        json = await res.json(); 
        d.getElementById("list").innerHTML += `<li class="border modal-item">${json.id}  ${json.name}</li>`
    }  
}                  
})    


d.addEventListener('click',async (e)=>{
    if(e.target.matches('.link')){
        let dataCharacter = e.target.getAttribute("data-idCharacters"),
        coma=",",
        vector = dataCharacter.split(coma)
        for(let i=0; i< vector.length;i++){
            cadenaUrl= vector[i].slice(42);
            try {
                let res = await fetch(`https://rickandmortyapi.com/api/character/${cadenaUrl}`),
                characters = await res.json();              
      
            d.getElementById("cardsCharacters").innerHTML += `
            <div class="card mx-auto my-2" style="width: 18rem">
              <img class="card-img-top" src="${characters.image}" alt="Card image cap">
                <div class="card-body"><h5 class="card-title text-center">${characters.name}</h5>
                    <p class="card-text">Status: ${characters.status}</p>
                    <p class="card-text">Species :${characters.species}</p>
                    <p class="card-text">Type : ${characters.type ? characters.type : "none"}</p>
                    <p class="card-text">Gender :${characters.gender}</p>
                    <p class="card-text">Origin :${characters.origin.name}</p>
                    <p class="card-text">Origin current :${characters.location.name}</p>
                </div>
            </div>
            ` 
            d.getElementById("table").style.display='none';
            d.getElementById("paginacion").style.display='none';
            back.addEventListener('click', e =>{
            location.href = "episodios.html"
            })
            
            } catch (error) {
                
            }
     
        }
   
        contentBack.appendChild(back);
        $cardsCharacters.appendChild(contentBack)
    }
})