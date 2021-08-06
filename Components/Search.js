import React from 'react'
import { StyleSheet, View, TextInput, Button,FlatList ,Text } from 'react-native'
import films from '../Helpers/filmsData'
import FilmItem from "./FilmItem";
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'; // import { } from ... car c'est un export nommé dans TMDBApi.js

class Search extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            films: [],
            searchedText: "" // Initialisation de notre donnée searchedText dans le state
        }
    }

    _searchTextInputChanged(text) {
        this.setState({ searchedText: text })
    }

    _loadFilms() {
        console.log(this.state.searchedText) // Un log pour vérifier qu'on a bien le texte du TextInput
        if (this.state.searchedText.length > 0) { // Seulement si le texte recherché n'est pas vide
            getFilmsFromApiWithSearchedText(this.state.searchedText).then(data => {
                this.setState({ films: data.results })
            })
        }
    }
    render() {    console.log("RENDER")

        return (

        <View style={styles.main_container}>
            <View style={styles.view1}>
                <TextInput style={styles.textinput}
                           placeholder='Titre du film'
                           onChangeText={(text) => this._searchTextInputChanged(text)}
                />
                <Button title='Rechercher' onPress={() => this._loadFilms()}/>
                {/* Ici j'ai simplement repris l'exemple sur la documentation de la FlatList */}

            </View>
            <View style={{ flex: 6,flexDirection: 'row', backgroundColor: 'red' }}>

                <View style={styles.text}>
                    <FlatList
                        data={this.state.films}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({item}) => <FilmItem film={item}  />}
                    />
                </View>

            </View>
            <View style={{ flex: 1, backgroundColor: 'green' }}></View>
        </View>
        )
    }
}


const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        marginTop: 20
    },
    textinput: {
        marginLeft: 5,
        marginBottom: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    view1:{
        marginTop: 20 ,
    }  ,
    text:{
        flex:4,

        backgroundColor: 'white'
    }
})


export default Search
