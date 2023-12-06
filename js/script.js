document.querySelector('#button-cep').addEventListener('click', (evt) => { 
    let cep = document.querySelector('#input-cep').value;
    console.log(cep);

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((res) => {
            console.log(res);

            setEndereco(res);
            buscaPrevTemp(res.localidade);
            buscaNoticia(res.localidade);
        });
         
});

// API ENDEREÇO
const setEndereco = (objEndereco) =>{
    let divEndereco = document.querySelector('#endereco');
    
    let enderecoCompleto = `${objEndereco.logradouro}, ${objEndereco.bairro}, ${objEndereco.localidade} - ${objEndereco.uf}`;
    let enderecoElement = document.createElement('p');
    enderecoElement.textContent = enderecoCompleto;

    divEndereco.innerHTML = '';
    divEndereco.appendChild(enderecoElement);
    
}

// API DO TEMPO
const buscaPrevTemp = (localidade) => {

    const apiKeyPre = '15d48599bcae91aac4b900cf67c2f82e';
    const apiUtl = `https://api.openweathermap.org/data/2.5/weather?q=${localidade}&appid=${apiKeyPre}&units=metric`;

    fetch(apiUtl)
        .then((res) => res.json())
        .then((data) => {

            if(data.cod == '200') {
                exibePrevisaoTempo(data);
            } else {
                console.error('Erro na Busca de previsão do tempo', data.message);
            }
        })
        .catch((erro) => {
            console.error('Erro na Busca da API',error);
        });
};

const exibePrevisaoTempo = (dados) => {
    let divPrevTemp = document.querySelector('#prev-temp');
    
    let tempAtual = dados.main.temp;
    let tempMin = dados.main.temp_min;
    let tempMax = dados.main.temp_max;
    let descTempo = dados.weather[0].description;
    

    let prevElement = document.createElement('p');
    prevElement.innerHTML = "Temperatura Atual: " + tempAtual + "°C,<br>" +"Condição: " + descTempo + ",<br>" +"Temperatura Mínima: " + tempMin + "°C,<br>" +"Temperatura Máxima: " + tempMax + "°C";

    document.getElementById('prev-temp').appendChild(prevElement);
    divPrevTemp.innerHTML = '';
    divPrevTemp.appendChild(prevElement);


    // API do Mapa 
    if(map === undefined) {
        map = L.map('map').setView([dados.coord.lat, dados.coord.lon], 15);
    } else {
        map.remove();
        map = L.map('map').setView([dados.coord.lat, dados.coord.lon], 15);
    }

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
          
    L.marker([dados.coord.lat, dados.coord.lon]).addTo(map)
        .bindPopup('Posição Atual')     
        .openPopup();

};

let map;

// Api de Notias
const buscaNoticia = (localidade) => {
    
    const apiKeyNoticia = '064fffa3bc244b66924349ad505fb65a';
    const apiNoticiasUrl = `https://newsapi.org/v2/top-headlines?q=${localidade}&apiKey=${apiKeyNoticia}`;

    fetch(apiNoticiasUrl)
        .then((res) => res.json())
        .then((data) => {
            exibeNoticias(data.articles);
        })
        .catch((error) => {
            console.error('Erro na busca de notícias:', erro);
        });
        
};

const exibeNoticias = (noticias) => {
    const divNoticias = document.querySelector('#noticia');
    divNoticias.innerHTML = '';

    if (noticias.length > 0) {
        const ul = document.createElement('ul');

        noticias.forEach((noticia) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${noticia.title}</strong>: ${noticia.description}`;
            ul.appendChild(li);
        });

        divNoticias.appendChild(ul);
    } else {
        divNoticias.textContent = 'Nenhuma notícia encontrada para esta região.';
    }
};







