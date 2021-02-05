let url = 'https://pokeapi.co/api/v2/pokedex/';


//create a pokemon function
function Pokemon(name, hp, attack, defense, spattack, spdefense, speed, type, ability){
    this.name = name;
    this.hp = hp;
    this.attack = attack;
    this.defense = defense;
    this.spattack = spattack;
    this.spdefense = spdefense;
    this.speed = speed;
    this.type = type
    this.ability = ability
}

$(function () { //shorthand for jquery document ready
    $(".btn").on('click',function (event) {
        event.preventDefault();

        //Step 1: Check the region chosen
        fetch(url)
          .then(response => response.json()) 
          .then(function(data){
            let name = document.getElementById('search').value;
            let region = document.querySelector('input[name="inlineRadioOptions"]:checked').value;
            for(let i = 0; i < data.results.length; i++){
                if(region == data.results[i].name){
                    console.log(data.results[i].name)
                    url2 = data.results[i].url;
                }
            }

            //Step 2: Find pokemon
            fetch(url2)
            .then(response => response.json()) 
            .then(function(data){
                for(let t = 0; t < data.pokemon_entries.length - 1; t++){
                    let poke_name = data.pokemon_entries[t].pokemon_species.name;
                    let poke_no = data.pokemon_entries[t].entry_number;
                    if(name.toLowerCase() == poke_name || name == poke_no){
                        console.log(poke_name);
                        url3 = data.pokemon_entries[t].pokemon_species.url;
                    }
                }

                //Step 3: Get pokemon stats
                fetch(url3)
                .then(response => response.json()) 
                .then(function(data){
                    //Get national dex id
                    let id = data.pokedex_numbers[0].entry_number;
                    console.log(id);
                    url4 = `https://pokeapi.co/api/v2/pokemon/${id}/`;
                    localStorage.setItem('url', url4);

                    fetch(url4)
                    .then(response => response.json()) 
                    .then(function(data){
                        let mname = data.forms[0].name;
                        let hp = data.stats[0].base_stat;
                        let attack = data.stats[1].base_stat;
                        let defense = data.stats[2].base_stat;
                        let spattack = data.stats[3].base_stat;
                        let spdefense = data.stats[4].base_stat;
                        let speed = data.stats[5].base_stat;

                        if(data.types.length == 2){
                            var type = `${data.types[0].type.name}, ${data.types[1].type.name}`;
                        }
                        else{
                            var type = `${data.types[0].type.name}`;
                        }

                        if(data.abilities.length == 2){
                            var ability = `${data.abilities[0].ability.name}, ${data.abilities[1].ability.name}`;
                        }
                        else{
                            var ability = `${data.abilities[0].ability.name}`;
                        }

                        let pokemon = new Pokemon(mname, hp, attack, defense, spattack, spdefense, speed, type, ability);
                        let giantpokeball = [];
                        giantpokeball.push(pokemon);

                        console.log(mname);
                        console.log(attack);
                        console.log(defense);
                        console.log(spattack);
                        console.log(spdefense);
                        console.log(speed);
                        console.log(type);
                        console.log(ability);
                     
                        var p = `<li class=pokebox><p>‏‏‎‏‏‎ ‎ ${id}. ${mname[0].toUpperCase()}${mname.slice(1)} ‎ </p><p><a href="pages/pokestats.html" target="_blank"><img src=${data.sprites.front_default} alt="sprite" class="pokeimg" value=${id} /></a></p></li>`
                        $('ul').append(p);
                        localStorage.setItem('pokemon', JSON.stringify(pokemon));

                        $(".pokeimg").on('click',function (events) {
                            console.log($(this).attr("value"));
                            url4 = `https://pokeapi.co/api/v2/pokemon/${$(this).attr("value")}/`;
                            localStorage.setItem('url', url4);

                        });
                    });
                });
            });
        });
    });

    //Clear
    $(".clear").on('click',function (event) {
        event.preventDefault();
        $('.pokebox').remove();
        document.getElementById('search').value = '';
        document.querySelector('input[name="inlineRadioOptions"]:checked').checked = false;
    });
});
